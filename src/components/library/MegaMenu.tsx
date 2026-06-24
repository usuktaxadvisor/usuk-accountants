import type { MegaMenuPanel, MegaMenuFeature } from '@/lib/types';
import { IconArrowRight } from '@/components/ui/icons';

interface MegaMenuProps {
  panels: MegaMenuPanel[];
  feature?: MegaMenuFeature;
  onMouseEnter?: () => void;
}

export default function MegaMenu({ panels, feature, onMouseEnter }: MegaMenuProps) {
  return (
    <div
      className="absolute inset-x-0 top-full hidden border-b border-mist bg-white shadow-e2 lg:block"
      onMouseEnter={onMouseEnter}
    >
      <div className="mx-auto grid max-w-container grid-cols-3 gap-8 px-6 py-8">
        {panels.map((panel) => (
          <div key={panel.heading}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-gold-antique">
              {panel.heading}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {panel.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-gold-antique"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {feature && (
          <div className="rounded-xl bg-navy-ink p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-gold">
              {feature.eyebrow}
            </p>
            <p className="mt-2 font-display text-xl font-semibold">{feature.title}</p>
            <p className="mt-2 text-sm text-softwhite/80">{feature.description}</p>
            <a
              href={feature.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
            >
              Learn more <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
