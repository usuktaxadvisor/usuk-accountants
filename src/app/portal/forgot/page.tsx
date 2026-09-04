import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db, tables } from '@/lib/portal/db';
import { createInvitation } from '@/lib/portal/invite';
import { sendPortalEmail, resetEmailHtml } from '@/lib/portal/email';
import { requestBase } from '@/lib/portal/notify';
import { rateLimit } from '@/lib/portal/ratelimit';
import { audit } from '@/lib/portal/audit';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reset password — US UK Accountants' };

export default async function ForgotPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;

  async function requestReset(formData: FormData) {
    'use server';
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    // Always respond identically — never reveal whether an account exists.
    if (email.includes('@') && rateLimit(`reset:${email}`, 3, 60 * 60_000)) {
      const [user] = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1);
      if (user && user.status === 'ACTIVE') {
        const raw = await createInvitation(user.id, 1); // 24h
        const base = await requestBase();
        await sendPortalEmail(email, 'Reset your portal password — US UK Accountants', resetEmailHtml(user.firstName ?? 'there', `${base}/portal/invite/${raw}`));
        await audit(user.id, 'RESET_REQUESTED', { targetType: 'user', targetId: user.id });
      }
    }
    redirect('/portal/forgot?sent=1');
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-semibold text-ink">Reset your password</h1>
      {sent ? (
        <p className="mt-4 rounded-2xl border border-mist bg-white p-6 text-sm leading-relaxed text-ink">
          If that email address has a portal account, a reset link is on its way (valid for 24 hours). Check your spam folder if it doesn&rsquo;t arrive within a few minutes.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">Enter the email address you use for the portal and we&rsquo;ll send you a link to choose a new password.</p>
          <form action={requestReset} className="mt-6 space-y-4 rounded-2xl border border-mist bg-white p-7 shadow-e2">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Email</span>
              <input name="email" type="email" required autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
            </label>
            <button type="submit" className="w-full rounded-xl bg-navy-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">Send reset link</button>
          </form>
        </>
      )}
      <p className="mt-4 text-center text-xs text-muted"><Link href="/portal/login" className="underline underline-offset-2">Back to login</Link></p>
    </div>
  );
}
