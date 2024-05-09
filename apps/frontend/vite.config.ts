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
      "/api": {
        target: "https://pds.nasa.gov/",
        changeOrigin: true,
      }
    }
  },
})
