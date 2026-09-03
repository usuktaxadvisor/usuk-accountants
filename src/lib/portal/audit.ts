import { db, tables } from './db';

/**
 * Best-effort audit logging. Never logs secrets, passwords, tokens,
 * document contents, or Drive IDs in meta. Failures never break the
 * user-facing operation.
 */
export async function audit(
  actorUserId: string | null,
  action: string,
  opts: { targetType?: string; targetId?: string; ip?: string; meta?: Record<string, unknown> } = {},
) {
  try {
    await db.insert(tables.auditLogs).values({
      actorUserId: actorUserId ?? undefined,
      action,
      targetType: opts.targetType,
      targetId: opts.targetId,
      ip: opts.ip,
      meta: opts.meta ?? undefined,
    });
  } catch {
    // swallow — auditing must not take the portal down; server logs capture DB issues separately
  }
}
