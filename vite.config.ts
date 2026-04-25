
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: true,
  },
  base: './',
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {
    // 关键修复：确保全局范围内 process.env.API_KEY 始终有定义，防止 SDK 初始化时抛错
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
    'global': 'window',
  }
});
