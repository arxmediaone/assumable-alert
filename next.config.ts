// next.config.ts
import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd, // no service worker in dev
})({
  reactStrictMode: true,
});

