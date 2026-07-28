import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Panini Adrenalyn XL WC26 — чекліст і обмін',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  server: {
    publicDir: './public',
  },
  output: {
    target: 'web',
    distDirectory: './dist',
  },
});
