import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

console.log(">>> VITE CONFIG LOADED <<<");

// https://vite.dev/config/
export default defineConfig({

  
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://eyediacrmsapi.runasp.net", // your backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), 
      },
    },
  },
})
