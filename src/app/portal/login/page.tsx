import Link from 'next/link';
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
    <div className="mx-auto max-w-md pt-4 sm:pt-10">
      <span aria-hidden className="mb-4 block h-px w-10 bg-gold" />
      <h1 className="font-brand text-[2rem] font-normal leading-tight text-navy-ink sm:text-[2.4rem]">Sign in to your portal</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Access is by invitation from our team. If you don&rsquo;t yet have login details, please
        contact us at hello@usukaccountants.com.
      </p>
      {error ? (
        <p className="mt-4 rounded-md border border-mist bg-white px-4 py-3 text-sm text-ink" role="alert">
          Those details didn&rsquo;t match. Please check and try again.
        </p>
      ) : null}
      <form action={doLogin} className="mt-6 space-y-4 rounded-md border border-mist bg-white p-7 shadow-e1">
        <label className="block">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input name="email" type="email" required autoComplete="email"
            className="mt-1.5 w-full rounded-md border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink">Password</span>
          <input name="password" type="password" required autoComplete="current-password"
            className="mt-1.5 w-full rounded-md border border-mist px-4 py-2.5 text-ink outline-none transition-colors focus:border-navy-ink" />
        </label>
        <button type="submit"
          className="w-full rounded-md bg-navy-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-royal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          Sign in
        </button>
        <p className="text-center text-xs text-muted">
          <Link href="/portal/forgot" className="underline decoration-mist underline-offset-2 hover:text-ink">Forgotten your password?</Link>
        </p>
      </form>
    </div>
  );
}
