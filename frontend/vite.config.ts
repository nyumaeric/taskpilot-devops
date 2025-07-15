import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';
import crypto from 'crypto';

// Polyfill for crypto.subtle.digest in Node.js (for Vite build)
declare global {
  // Extend globalThis to include a crypto property
  // eslint-disable-next-line no-var
  var crypto: any;
}
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = crypto;
} else if (typeof globalThis.crypto.subtle === 'undefined') {
  globalThis.crypto.subtle = {};
  globalThis.crypto.subtle.digest = async (algorithm: string, data: ArrayBuffer) => {
    const algo = algorithm.replace('-', '').toLowerCase();
    const hash = crypto.createHash(algo);
    hash.update(Buffer.from(data));
    return hash.digest();
  };
}

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
});
