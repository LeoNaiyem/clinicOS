import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig({
  plugins: [react()],
  // base: "/Projects/React/clinic-os/",
  server: {
    proxy: {
      "/api": {
        target: "http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
