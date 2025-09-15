// next.config.ts
import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

// Keep options minimal for widest version compatibility
export default withPWA({
  dest: 'public',
  disable: !isProd, // disables SW in dev; enables in production
})({
  reactStrictMode: true,
});
