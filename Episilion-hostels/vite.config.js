import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://episilionhostels.com",
      generateRobotsTxt: false,
      routes: [
        "/",
        "/hostels/upsa",
        "/hostels/upsa/affordable",
        "/hostels/upsa/girls",
        "/hostels/upsa/boys",
        "/hostels/upsa/student-accommodation",
        "/hostels/upsa/verified",
      ],
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "https://episilion-backend-2lt0.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});