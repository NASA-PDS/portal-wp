import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: ".env",
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    proxy: {
      "^/api/search/1/": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search\/1/i, ''),
      }
    }
  },
})
