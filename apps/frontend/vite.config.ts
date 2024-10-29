import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  base: "/portal/",
  envDir: ".env",
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
      {
        find: /^(@mui\/[\w-]+)/,
        replacement: path.resolve(__dirname, "node_modules/$1"),
      },
      {
        find: "src",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: 'react',
        replacement: path.resolve(__dirname, 'node_modules/react')
      },
      {
        find: 'react-router-dom',
        replacement: path.resolve(__dirname, 'node_modules/react-router-dom')
      }
    ],
  },
  server: {
    proxy: {
      "^/api/search/1/": {
        target: "https://pds.mcp.nasa.gov/",
        changeOrigin: true,
      },
      "^/assets/": {
        target: "http://localhost:5173/portal/",
        changeOrigin: true,
      }
    }
  },
})
