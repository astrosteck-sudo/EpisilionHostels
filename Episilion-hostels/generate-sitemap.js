import fs from 'fs';
//import fetch from 'node-fetch'; // Install via: npm install node-fetch

const BASE_URL = 'https://episilionhostels.com';
const API_URL = 'https://episilion-backend-2lt0.onrender.com/api/hostels'; // Your actual API endpoint

async function generateSitemap() {
  try {
    // 1. Fetch all hostel IDs from your database API
    const response = await fetch(API_URL);
    const hostels = await response.json();

    // 2. Start building the XML structure with your static pages
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    // 3. Loop through your API array and dynamically append your hostel pages
    hostels.forEach((hostel) => {
      xml += `  <url>
    <loc>${BASE_URL}/moreDetails?hostelId=${hostel.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    // 4. Write the file straight to your React public directory
    fs.writeFileSync('./public/sitemap.xml', xml);
    console.log('✅ Sitemap successfully generated in public folder!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
