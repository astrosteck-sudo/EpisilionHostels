import fs from "fs";

const BASE_URL = "https://www.episilionhostels.com";
const API_URL = "https://episilion-backend-2lt0.onrender.com/api/hostels";

function buildHostelSlug(hostel) {
  if (!hostel?.name || !hostel?.id) return hostel?.id || "";
  const namePart = hostel.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${namePart}-${hostel.id}`;
}

async function generateSitemap() {
  try {
    const response = await fetch(API_URL);
    const hostels = await response.json();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/aboutus</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/hostels-near-upsa</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

    hostels.forEach((hostel) => {
      const slug = buildHostelSlug(hostel);
      xml += `  <url>
    <loc>${BASE_URL}/hostels/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync("./public/sitemap.xml", xml);
    console.log("✅ Sitemap successfully generated with slug URLs!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
