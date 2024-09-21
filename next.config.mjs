import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import withPWA from 'next-pwa';

// Manually define __dirname for ES module compatibility
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

// Export the config with PWA options applied
export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
