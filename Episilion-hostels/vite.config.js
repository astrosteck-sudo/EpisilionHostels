import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerender from "@prerenderer/rollup-plugin";
import fs from "fs";

function getRoutesToPrerender() {
  const staticRoutes = ["/", "/aboutus", "/hostels-near-upsa"];

  try {
    const hostelRoutes = JSON.parse(
      fs.readFileSync("./routes.json", "utf-8")
    );
    return [...staticRoutes, ...hostelRoutes];
  } catch (err) {
    console.warn(
      "⚠️ routes.json not found — did generate-sitemap.js run first? Falling back to static routes only."
    );
    return staticRoutes;
  }
}

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: getRoutesToPrerender(),
      fallback: true,
      server: {
        // Proxies /api requests during the prerender step's local static server,
        // same job server.proxy does for `vite dev` — but that one doesn't apply here.
        proxy: {
          "/api": {
            target: "https://episilion-backend-2lt0.onrender.com",
            changeOrigin: true,
            secure: true,
          },
        },
      },
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        renderAfterDocumentEvent: "app-ready",
        headless: true,
        timeout: 30000,
        // Logs anything the browser's console.* prints — including our
        // "HOSTEL FETCH ERROR:" from App.jsx's catch block, if it fires.
        consoleHandler: (route, message) => {
          console.log(`[Puppeteer] [${route}]`, message.text());
        },
      },
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