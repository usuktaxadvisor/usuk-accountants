import { redirect } from 'next/navigation';
import { signIn, portalSession } from '@/lib/portal/auth';
import { AuthError } from 'next-auth';

export const metadata = { title: 'Client Login — US UK Accountants' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await portalSession();
  if (session) redirect('/portal');
  const { error } = await searchParams;

  async function doLogin(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        redirectTo: '/portal',
      });
    } catch (e) {
      if (e instanceof AuthError) redirect('/portal/login?error=1');
      throw e; // NEXT_REDIRECT and unknown errors propagate
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-semibold text-ink">Client login</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Access is by invitation from our team. If you don&rsquo;t yet have login details, please
        contact us at hello@usukaccountants.com.
      </p>
      {error ? (
        <p className="mt-4 rounded-xl border border-mist bg-white px-4 py-3 text-sm text-ink" role="alert">
          Those details didn&rsquo;t match. Please check and try again.
        </p>
      ) : null}
      <form action={doLogin} className="mt-6 space-y-4 rounded-2xl border border-mist bg-white p-7 shadow-e2">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input name="email" type="email" required autoComplete="email"
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Password</span>
          <input name="password" type="password" required autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <button type="submit"
          className="w-full rounded-xl bg-navy-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">
          Sign in
        </button>
        <p className="text-center text-xs text-muted">
          Forgotten your password? Email hello@usukaccountants.com and we&rsquo;ll reset it securely.
        </p>
      </form>
    </div>
  );
}
