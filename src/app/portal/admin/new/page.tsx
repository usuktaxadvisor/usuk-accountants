import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { sql } from 'drizzle-orm';
import { requireRole } from '@/lib/portal/auth';
import { db, tables } from '@/lib/portal/db';
import { createInvitation } from '@/lib/portal/invite';
import { sendPortalEmail, inviteEmailHtml } from '@/lib/portal/email';
import { audit } from '@/lib/portal/audit';

export const dynamic = 'force-dynamic';

export default async function NewClientPage() {
  await requireRole('STAFF');

  async function createClient(formData: FormData) {
    'use server';
    const s = await requireRole('STAFF');
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    if (!firstName || !email.includes('@')) redirect('/portal/admin/new?e=1');

    const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(tables.clients);
    const clientRef = `CL-${String(Number(n) + 1).padStart(4, '0')}`;

    const [user] = await db.insert(tables.users).values({
      email, role: 'CLIENT', status: 'INVITED', firstName, lastName: lastName || null,
    }).returning({ id: tables.users.id });

    const [client] = await db.insert(tables.clients).values({
      clientRef, displayName: [firstName, lastName].filter(Boolean).join(' '), userId: user.id,
    }).returning({ id: tables.clients.id });

    const raw = await createInvitation(user.id);
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'https';
    const base = host ? `${proto}://${host}` : (process.env.AUTH_URL ?? 'https://www.usukaccountants.com');
    const sent = await sendPortalEmail(email, 'Your secure client portal — US UK Accountants', inviteEmailHtml(firstName, `${base}/portal/invite/${raw}`));

    await audit(s.uid, 'CLIENT_CREATED', { targetType: 'client', targetId: client.id, meta: { clientRef, inviteEmailSent: sent } });
    redirect(`/portal/admin/clients/${client.id}${sent ? '' : '?email=failed'}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-semibold text-ink">New client</h1>
      <p className="mt-2 text-sm text-muted">Creates the client record and emails their activation link.</p>
      <form action={createClient} className="mt-6 space-y-4 rounded-2xl border border-mist bg-white p-7 shadow-e2">
        <label className="block"><span className="text-sm font-semibold text-ink">First name</span>
          <input name="firstName" required className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-navy-ink" /></label>
        <label className="block"><span className="text-sm font-semibold text-ink">Last name</span>
          <input name="lastName" className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-navy-ink" /></label>
        <label className="block"><span className="text-sm font-semibold text-ink">Email</span>
          <input name="email" type="email" required className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none focus:border-navy-ink" /></label>
        <button className="w-full rounded-xl bg-navy-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">Create &amp; send invitation</button>
      </form>
    </div>
  );
}
