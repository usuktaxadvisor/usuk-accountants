import Logo from '@/components/ui/Logo';
import { LeadCaptureForm } from '@/components/library/Forms';
import { footerColumns, legalLinks, PHONE_UK, PHONE_US } from '@/lib/site-data';
import { IconInstagram, IconLinkedin, IconPinterest } from '@/components/ui/icons';

const SOCIALS = [
  { label: 'US UK Accountants on Instagram', href: 'https://www.instagram.com/usukaccountants/', Icon: IconInstagram },
  { label: 'US UK Accountants on LinkedIn', href: 'https://www.linkedin.com/company/usukaccountants/', Icon: IconLinkedin },
  { label: 'US UK Accountants on Pinterest', href: 'https://uk.pinterest.com/usukaccountants/', Icon: IconPinterest },
];


export default function Footer() {
  return (
    <footer className="bg-navy-ink text-softwhite">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Logo variant="dark" showSubline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-softwhite/70">
              The specialist firm for life and business between the US and the UK.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2"><span aria-hidden>🇬🇧</span> London · {PHONE_UK}</p>
              <p className="flex items-center gap-2"><span aria-hidden>🇺🇸</span> New York · {PHONE_US}</p>
            </div>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-eyebrow text-gold">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-softwhite/70 transition-colors hover:text-gold">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-navy-slate bg-navy-royal/40 p-7 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-semibold text-white">Cross-border tax tips, no noise</p>
            <p className="mt-1 text-sm text-softwhite/70">Deadlines and planning insights for US–UK filers. Monthly.</p>
          </div>
          <div className="w-full max-w-md">
            <LeadCaptureForm
              cta="Subscribe"
              placeholder="you@email.com"
              note="Monthly. No spam. Unsubscribe anytime."
              tone="dark"
              leadType="newsletter"
              source="footer_newsletter"
            />
          </div>
        </div>

        <div className="mt-12 border-t border-navy-slate pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-softwhite/70">
            Information on this website is provided for general informational purposes only and does not constitute
            tax, legal, accounting or financial advice. It may not reflect your specific circumstances or the most
            current law. Please obtain advice from a qualified professional before acting on anything you read here.
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-softwhite/60 md:flex-row">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} US UK Accountants. All rights reserved.</p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-softwhite/50 transition-all duration-200 hover:-translate-y-0.5 hover:text-gold"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <a key={l.label} href={l.href} className="transition-colors hover:text-gold">{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
