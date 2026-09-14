const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const BASE = "https://ari-builds.github.io/chris-miller-brick-paving/";

const pages = [
  "index.html",
  "services.html",
  "about.html",
  "gallery.html",
  "gallery-driveways.html",
  "gallery-pools.html",
  "gallery-patios.html",
  "gallery-walkways.html",
  "gallery-walls.html",
  "contact.html",
  "btu-bricks.html",
]
  .map((p) => (p === "index.html" ? "" : p))
  .sort();

const urls = pages
  .map(
    (p) =>
      `  <url>\n    <loc>${BASE}${p}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`sitemap.xml written with ${pages.length} URLs`);