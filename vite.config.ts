import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: '/geminis-saving/',
  build: {
    sourcemap: 'hidden',
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/.pnpm-store/**', '**/node_modules/**'],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
