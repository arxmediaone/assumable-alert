import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Assumables Alert',
    short_name: 'Assumables',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#0EA5E9',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  };
}
