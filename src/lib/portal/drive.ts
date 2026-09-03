import { google } from 'googleapis';
import { Readable } from 'node:stream';
import { eq } from 'drizzle-orm';
import { db, tables } from './db';

/**
 * Google Drive service — scope drive.file ONLY: this client can see and
 * touch nothing in the firm Drive except folders/files it created itself.
 * Credentials live server-side in env; nothing here is ever serialised
 * to the browser (folder IDs stay inside the DB and this module).
 */
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

function oauthClient() {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Google OAuth env vars missing');
  return new google.auth.OAuth2(id, secret, `${process.env.AUTH_URL ?? ''}/api/auth/google/callback`);
}

function driveClient() {
  const refresh = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refresh) throw new Error('GOOGLE_REFRESH_TOKEN missing');
  const auth = oauthClient();
  auth.setCredentials({ refresh_token: refresh });
  return google.drive({ version: 'v3', auth });
}

export function consentUrl(state: string) {
  return oauthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [DRIVE_SCOPE],
    state,
  });
}

export async function exchangeCodeForRefreshToken(code: string): Promise<string | null> {
  const { tokens } = await oauthClient().getToken(code);
  return tokens.refresh_token ?? null;
}

async function ensureFolder(name: string, parentId?: string): Promise<string> {
  const drive = driveClient();
  const q = [
    `name = '${name.replace(/'/g, "\\'")}'`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    'trashed = false',
    parentId ? `'${parentId}' in parents` : undefined,
  ].filter(Boolean).join(' and ');
  const found = await drive.files.list({ q, fields: 'files(id)', pageSize: 1 });
  const existing = found.data.files?.[0]?.id;
  if (existing) return existing;
  const created = await drive.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: parentId ? [parentId] : undefined },
    fields: 'id',
  });
  if (!created.data.id) throw new Error('Drive folder creation failed');
  return created.data.id;
}

/** Creates (or finds) the private folder tree for a client and stores the IDs. Idempotent. */
export async function ensureClientFolders(clientId: string): Promise<{ incomingFolderId: string }> {
  const [client] = await db.select().from(tables.clients).where(eq(tables.clients.id, clientId)).limit(1);
  if (!client) throw new Error('Client not found');
  if (client.incomingFolderId) return { incomingFolderId: client.incomingFolderId };

  const rootId = await ensureFolder('USUK Accountants Portal');
  const clientsId = await ensureFolder('Clients', rootId);
  const clientFolderId = await ensureFolder(`${client.clientRef} — ${client.displayName}`, clientsId);
  const incomingFolderId = await ensureFolder('Incoming Documents', clientFolderId);
  await ensureFolder('Processed Documents', clientFolderId);

  await db.update(tables.clients)
    .set({ driveFolderId: clientFolderId, incomingFolderId, updatedAt: new Date() })
    .where(eq(tables.clients.id, clientId));
  return { incomingFolderId };
}

/** Streams a validated upload into the client's Incoming folder. Returns the Drive file id (kept server-side). */
export async function uploadToClientFolder(
  clientId: string,
  storedName: string,
  mimeType: string,
  data: Buffer,
): Promise<string> {
  const { incomingFolderId } = await ensureClientFolders(clientId);
  const drive = driveClient();
  const res = await drive.files.create({
    requestBody: { name: storedName, parents: [incomingFolderId] },
    media: { mimeType, body: Readable.from(data) },
    fields: 'id',
  });
  if (!res.data.id) throw new Error('Drive upload failed');
  return res.data.id;
}
