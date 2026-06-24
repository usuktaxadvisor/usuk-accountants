import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'US UK Accountants',
    short_name: 'US·UK',
    description: 'Cross-border US–UK tax and accounting specialists.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1330',
    theme_color: '#0A1330',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
