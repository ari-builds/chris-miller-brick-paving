const fs = require("fs");
const path = require("path");
const { hasReel, reel } = require("./reel-block");

const ROOT = __dirname;
const PHOTO = path.join(ROOT, "assets", "photos");
const BASE = "https://ari-builds.github.io/chris-miller-brick-paving/";

const CATS = [
  {
    id: "driveways",
    title: "Brick Paver Driveways",
    h1: "Driveways",
    lead:
      "Brick paver driveways that take the daily traffic and the New England winters - installed on a proper base and backed by a 5-year paver installation warranty.",
    alt: "Brick paver driveway project",
  },
  {
    id: "pools",
    title: "Paver Pool Decks",
    h1: "Pool Areas",
    lead:
      "Cool, slip-resistant paver decks around pools - comfortable underfoot and built to handle years of splash and sun.",
    alt: "Paver pool deck project",
  },
  {
    id: "patios",
    title: "Paver Patios",
    h1: "Patios",
    lead:
      "Outdoor living spaces for dining, entertaining and relaxing, each one built on a solid base to last season after season.",
    alt: "Paver patio project",
  },
  {
    id: "walkways",
    title: "Paver Walkways",
    h1: "Walkways",
    lead:
      "Front and side walkways that lead visitors to your door while holding their line through the seasons.",
    alt: "Paver walkway project",
  },
  {
    id: "walls",
    title: "Rock & Block Retaining Walls",
    h1: "Rock & Block Retaining Walls",
    lead:
      "Retaining walls that stop slope erosion and turn unusable ground into usable space, built to complement the rest of the landscape.",
    alt: "Rock and block retaining wall project",
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const HEAD = (title, desc, canon, h1, lead, reelHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)} | Chris Miller</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${BASE}${canon}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)} | Chris Miller - Brick Paver Installer" />
  <meta property="og:description" content="${esc(h1)}. Free estimates, fully insured, 5-year paver installation warranty." />
  <meta name="theme-color" content="#a84b3c" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23a84b3c'/%3E%3Crect x='6' y='8' width='20' height='6' rx='1.5' fill='%23fffaf2'/%3E%3Crect x='6' y='17' width='20' height='6' rx='1.5' fill='%23fffaf2'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "${BASE}#business",
        "name": "Chris Miller - Brick Paver Installer",
        "url": "${BASE}",
        "telephone": "+16036357325",
        "email": "cjmbrick@comcast.net",
        "address": { "@type": "PostalAddress", "addressLocality": "Pelham", "addressRegion": "NH", "postalCode": "03076", "addressCountry": "US" },
        "areaServed": ["New Hampshire", "Massachusetts", "New England"]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${BASE}" },
          { "@type": "ListItem", "position": 2, "name": "Photo Gallery", "item": "${BASE}gallery.html" },
          { "@type": "ListItem", "position": 3, "name": "${esc(h1)}", "item": "${BASE}${canon}" }
        ]
      }
    ]
  }
  </script>
</head>
<body data-page="gallery">
  <main>
    <div class="crumbs"><div class="inner crumb"><nav aria-label="Breadcrumb"><ol>
      <li><a href="index.html">Home</a></li>
      <li><a href="gallery.html">Photo Gallery</a></li>
      <li aria-current="page">${esc(h1)}</li>
    </ol></nav></div></div>

    <section class="page-hero">
      <div class="inner">
        <p class="kicker fade">Our work</p>
        <h1 class="fade">${esc(h1)}</h1>
        <p class="lead fade">${esc(lead)}</p>
      </div>
    </section>
    ${reelHtml}
    <section class="section-block">
      <div class="section">
        <div class="photos fade" id="photos">`;

const TAIL = `
        </div>
        <p style="margin-top:1.4rem;font-size:.9rem;color:var(--slate)">Click any photo to enlarge. Free estimates &middot; fully insured &middot; 5-year paver installation warranty.</p>
      </div>
    </section>

    <section class="strip">
      <div class="section">
        <div class="estimate-card fade">
          <div>
            <h2>Want the next project to be yours?</h2>
            <p>Get a free, no-pressure estimate for your driveway, patio, walkway, pool deck or wall.</p>
          </div>
          <div class="estimate-cta">
            <a class="btn btn-call" href="contact.html" style="background:var(--white);color:var(--brick-deep)">Get a free estimate</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  <script src="assets/common.js"></script>
  <script src="assets/gallery.js"></script>
</body>
</html>`;

function naturalCmp(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

let totalPages = 0;
let totalThumbs = 0;
let missingLarge = 0;

for (const cat of CATS) {
  const dir = path.join(PHOTO, cat.id);
  const thumbsDir = path.join(dir, "thumbs");
  const files = fs.readdirSync(thumbsDir).filter((f) => f.toLowerCase().endsWith(".jpg")).sort(naturalCmp);

  const items = files.map((thumb) => {
    const largeName = thumb.replace(/\.jpg$/i, ".jpg").replace(/th\.jpg$/i, ".jpg");
    const largePath = path.join(dir, largeName);
    const usesLarge = fs.existsSync(largePath);
    if (!usesLarge) missingLarge++;
    return {
      thumb: `assets/photos/${cat.id}/thumbs/${thumb}`,
      large: usesLarge ? `assets/photos/${cat.id}/${largeName}` : `assets/photos/${cat.id}/thumbs/${thumb}`,
    };
  });

  const desc =
    `New England ${cat.id} by Chris Miller: ${cat.h1.toLowerCase()} installed with quality workmanship. Browse photos and get a free estimate.`;
  const imgHtml = items
    .map(
      (it, i) =>
        `<button type="button" aria-label="Enlarge photo ${i + 1} of ${items.length}"><img src="${it.thumb}" data-lb="${it.large}" alt="${esc(cat.alt)} - ${i + 1}" loading="lazy" /></button>`
    )
    .join("\n        ");

  const page = HEAD(cat.title, desc, `gallery-${cat.id}.html`, cat.h1, cat.lead, hasReel(cat.id) ? reel(cat.id, { kicker: "Watch the work" }) : "") + imgHtml + TAIL;
  const out = path.join(ROOT, `gallery-${cat.id}.html`);
  fs.writeFileSync(out, page, "utf8");
  totalPages++;
  totalThumbs += files.length;
  console.log(`gallery-${cat.id}.html  (${files.length} photos)`);
}

console.log("----");
console.log(`Generated ${totalPages} category pages, ${totalThumbs} thumbnails, ${missingLarge} items with no large version (lightbox falls back to thumb).`);