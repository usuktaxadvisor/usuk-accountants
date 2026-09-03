import { redirect } from 'next/navigation';
import { hash as bcryptHash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, tables } from '@/lib/portal/db';
import { findLiveInvitation } from '@/lib/portal/invite';
import { audit } from '@/lib/portal/audit';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Activate your account — US UK Accountants' };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = await findLiveInvitation(token);

  if (!inv) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-semibold text-ink">Invitation not valid</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This activation link has expired or was already used. Please email
          hello@usukaccountants.com and we&rsquo;ll send you a fresh one.
        </p>
      </div>
    );
  }

  async function activate(formData: FormData) {
    'use server';
    const pw = String(formData.get('password') ?? '');
    const pw2 = String(formData.get('password2') ?? '');
    if (pw.length < 10) redirect(`/portal/invite/${token}?e=short`);
    if (pw !== pw2) redirect(`/portal/invite/${token}?e=match`);
    const live = await findLiveInvitation(token);
    if (!live) redirect('/portal/login');
    const passwordHash = await bcryptHash(pw, 12);
    await db.update(tables.users).set({ passwordHash, status: 'ACTIVE', updatedAt: new Date() }).where(eq(tables.users.id, live.userId));
    await db.update(tables.invitations).set({ usedAt: new Date() }).where(eq(tables.invitations.id, live.id));
    await audit(live.userId, 'INVITE_ACCEPTED', { targetType: 'user', targetId: live.userId });
    redirect('/portal/login?activated=1');
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-semibold text-ink">Set your password</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Welcome to the US UK Accountants client portal. Choose a password of at least 10 characters
        — a short phrase works well.
      </p>
      <form action={activate} className="mt-6 space-y-4 rounded-2xl border border-mist bg-white p-7 shadow-e2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">New password</span>
          <input name="password" type="password" required minLength={10} autoComplete="new-password"
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Repeat password</span>
          <input name="password2" type="password" required minLength={10} autoComplete="new-password"
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <button type="submit" className="w-full rounded-xl bg-navy-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">
          Activate account
        </button>
      </form>
    </div>
  );
}
