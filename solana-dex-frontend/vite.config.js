import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
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
      '@solana/web3.js': path.resolve(__dirname, 'node_modules/@solana/web3.js/lib/index.browser.esm.js'),
      'jayson/lib/client/browser': path.resolve(__dirname, 'node_modules/jayson/lib/client/browser/index.js'),
      'rpc-websockets': path.resolve(__dirname, 'node_modules/rpc-websockets'),
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js/lib/bn.js'),
      'stream': 'stream-browserify',
      'crypto': 'crypto-browserify',
    },
    mainFields: ['browser', 'module', 'main'],
  },
  define: {
    'process.env.BROWSER': true,
    'process.env.NODE_DEBUG': JSON.stringify(''),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@solana/web3.js',
      'jayson/lib/client/browser',
      'rpc-websockets',
      'buffer',
      'bn.js',
      'jayson',
    ],
    exclude: [
      '@project-serum/anchor',
      '@drift-labs/sdk'
    ],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
      platform: 'browser',
    },
  },
  build: {
    target: ['es2020'],
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        /node_modules/,
        /node_modules\/jayson/,
        /node_modules\/@solana\/web3.js/,
      ],
      requireReturnsDefault: 'auto',
    },
    rollupOptions: {
      external: ['@project-serum/anchor', '@drift-labs/sdk'],
      output: {
        manualChunks: undefined,
      },
    },
  },
});