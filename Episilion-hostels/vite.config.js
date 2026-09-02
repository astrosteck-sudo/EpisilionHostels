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

export default defineConfig(async () => {
  // On Vercel's build machine, use the special serverless-compatible Chromium.
  // Locally, let Puppeteer use the full Chrome it already downloaded.
  let launchOptions = {};
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    launchOptions = {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
    };
  }

  return {
    plugins: [
      react(),
      prerender({
        routes: getRoutesToPrerender(),
        fallback: true,
        server: {
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
          timeout: 30000,
          headless: true,
          launchOptions,
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
  };
});