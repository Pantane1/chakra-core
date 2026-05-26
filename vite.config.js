import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    // MediaPipe needs HTTPS in some browsers for camera access.
    // Vite serves localhost over HTTP which is treated as a secure context.
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
