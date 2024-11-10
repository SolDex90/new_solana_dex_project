import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    envCompatible(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Use more specific path resolution
      'rpc-websockets': path.resolve(__dirname, 'node_modules/rpc-websockets'),
      // Add these for Solana compatibility
      'stream': 'stream-browserify',
      'crypto': 'crypto-browserify',
    },
  },
  optimizeDeps: {
    include: ['rpc-websockets', 'buffer'],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'esnext',
    sourcemap: true,
  },
});