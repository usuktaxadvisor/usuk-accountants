import { ImageResponse } from 'next/og';

/**
 * Sitewide default Open Graph / Twitter image, generated dynamically.
 *
 * Next.js automatically wires this file as the default og:image and
 * twitter:image for every route that doesn't define its own. No static PNG
 * to maintain; renders a real 1200x630 PNG on demand.
 *
 * Premium navy + gold, private-bank aesthetic, transatlantic positioning.
 */

export const runtime = 'edge';
export const alt = 'US UK Accountants — International Tax & Accounting Advisors for US and UK Expats, Individuals and Businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#0A1330';
const NAVY_CORE = '#0D1B3E';
const GOLD = '#C9A84C';
const CHAMPAGNE = '#E2CE92';
const SOFTWHITE = '#EAEDF5';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_CORE} 60%, #0c1838 100%)`,
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Transatlantic arc — the brand signature: two nodes (London, NY) bridged by a gold arc */}
        <div
          style={{
            position: 'absolute',
            top: 250,
            left: 72,
            right: 72,
            height: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: GOLD }} />
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${CHAMPAGNE}, ${GOLD})` }} />
          <div style={{ width: 18, height: 18, borderRadius: 9, background: CHAMPAGNE, border: `3px solid ${GOLD}` }} />
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${CHAMPAGNE}, ${GOLD})` }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: GOLD }} />
        </div>

        {/* Top row: wordmark + city labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
              US<span style={{ color: GOLD }}>·</span>UK Accountants
            </div>
          </div>
          <div style={{ fontSize: 20, color: SOFTWHITE, opacity: 0.7, letterSpacing: 3, textTransform: 'uppercase' }}>
            London · New York
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
          <div style={{ fontSize: 30, color: GOLD, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 18 }}>
            Cross-border specialists
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            US &amp; UK tax and accounting, under one roof
          </div>
          <div style={{ fontSize: 28, color: SOFTWHITE, opacity: 0.85, marginTop: 24, maxWidth: 900, lineHeight: 1.4 }}>
            International tax &amp; accounting advisors for US and UK expats, individuals and businesses.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(234,237,245,0.15)`, paddingTop: 24 }}>
          <div style={{ fontSize: 24, color: SOFTWHITE, opacity: 0.8 }}>usukaccountants.com</div>
          <div style={{ fontSize: 22, color: GOLD }}>£100 · 30-minute consultation</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
