import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://episilion-backend-2lt0.onrender.com", // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
