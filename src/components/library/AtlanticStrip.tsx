import Image from 'next/image';
import { Container } from '@/components/library/primitives';
import StripControls from '@/components/ui/StripControls';

/**
 * Atlantic strip: one slow, continuous row of destination photography
 * (London, Manchester, New York, the ocean between) from the firm's own
 * Atlantic Collection. The row drifts left at roughly 25 px per second and
 * loops without a seam; it pauses on hover, on keyboard focus, on the pause
 * control, and is a static scrollable row under prefers-reduced-motion.
 * Images are decorative context for the firm's two markets, not offices.
 */
const FRAMES: { src: string; alt: string; place: string; detail: string }[] = [
  { src: '/images/atlantic/loc-london.jpg', alt: 'The Palace of Westminster at dusk, lit from within and reflected in the Thames', place: 'London', detail: 'Westminster' },
  { src: '/images/atlantic/loc-newyork.jpg', alt: 'Brooklyn Bridge at dusk with the lights of Lower Manhattan beyond', place: 'New York', detail: 'Brooklyn Bridge' },
  { src: '/images/atlantic/loc-manchester.jpg', alt: 'A red-brick Manchester mill beside a canal, windows glowing at nightfall', place: 'Manchester', detail: 'Canal side' },
  { src: '/images/atlantic/bridge-london.jpg', alt: 'Tower Bridge in London at dusk, its walkways traced in warm golden light', place: 'London', detail: 'Tower Bridge' },
  { src: '/images/atlantic/loc-ny-soho.jpg', alt: 'A cast-iron SoHo street in New York at blue hour with lit shopfronts', place: 'New York', detail: 'SoHo' },
  { src: '/images/atlantic/blog-city.jpg', alt: 'A wet City of London lane at dusk leading toward the dome of St Paul’s', place: 'London', detail: 'The City' },
  { src: '/images/atlantic/hero-atlantic.jpg', alt: 'The Atlantic Ocean from above at dusk, a thin band of gold on the horizon', place: 'The Atlantic', detail: 'Between the two' },
];

export function AtlanticStrip({
  eyebrow = 'Two tax systems, one firm',
  title = 'London, Manchester and New York',
  intro = 'Our clients live and work on both sides of the Atlantic. We prepare their US and UK filings together, so each return is read against the other rather than in isolation.',
  tone = 'navy',
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: 'navy' | 'white';
}) {
  const dark = tone === 'navy';
  const track = [...FRAMES, ...FRAMES];
  return (
    <section className={`${dark ? 'bg-navy-ink' : 'bg-white'} py-20 md:py-28`} aria-labelledby="atlantic-strip-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className={`kicker ${dark ? 'kicker-light' : ''} mb-4`}>{eyebrow}</p>
            <h2 id="atlantic-strip-title" className={`font-display text-display-md ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
            <p className={`mt-5 max-w-xl text-lg leading-relaxed ${dark ? 'text-softwhite/80' : 'text-muted'}`}>{intro}</p>
          </div>
          <StripControls target="atlantic-strip" dark={dark} />
        </div>
      </Container>
      <div id="atlantic-strip" className="strip mt-12" data-paused="false">
        <div className="strip-track px-4" style={{ ['--strip-duration' as string]: `${FRAMES.length * 16}s` }}>
          {track.map((f, i) => {
            const dup = i >= FRAMES.length;
            return (
              <figure key={`${f.src}-${i}`} className={`strip-item ${dup ? 'strip-dup' : ''}`} aria-hidden={dup || undefined}>
                <Image
                  src={f.src}
                  alt={dup ? '' : f.alt}
                  width={840}
                  height={630}
                  sizes="(min-width: 1280px) 420px, 28vw"
                  loading="lazy"
                />
                <figcaption>
                  <span>{f.place}</span> &middot; {f.detail}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
