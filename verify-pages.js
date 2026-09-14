const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PAGES = [
  "index.html", "services.html", "about.html", "gallery.html",
  "gallery-driveways.html", "gallery-pools.html", "gallery-patios.html",
  "gallery-walkways.html", "gallery-walls.html", "contact.html", "btu-bricks.html",
];

let errors = 0;
let warnings = 0;

function fail(msg) { errors++; console.log("ERROR  " + msg); }
function warn(msg) { warnings++; console.log("WARN   " + msg); }

const exists = (p) => fs.existsSync(path.join(ROOT, p));

for (const page of PAGES) {
  const file = path.join(ROOT, page);
  if (!exists(page)) { fail(`${page} missing`); continue; }
  const html = fs.readFileSync(file, "utf8");

  if (!/assets\/common\.js/.test(html)) fail(`${page}: missing common.js script`);
  if (!/assets\/site\.css/.test(html)) fail(`${page}: missing site.css link`);
  if (!/<meta name="description"/.test(html)) fail(`${page}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${page}: missing canonical`);
  if (!/<script type="application\/ld\+json">/.test(html)) fail(`${page}: missing JSON-LD`);
  if (!/BreadcrumbList/.test(html)) fail(`${page}: JSON-LD lacks BreadcrumbList`);
  if (!/LocalBusiness/.test(html)) fail(`${page}: JSON-LD lacks LocalBusiness`);
  if (!/data-page="(home|services|about|gallery|contact|btu)"/.test(html)) fail(`${page}: bad or missing data-page attribute`);

  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1];
  if (!title || title.trim().length < 20) warn(`${page}: short title "${title}"`);

  /* every local resource referenced must exist */
  const hrefs = html.match(/(?:src|href)="([^"]+)"/g) || [];
  for (const h of hrefs) {
    const ref = h.match(/^[^=]+="([^"]+)"/)[1];
    if (/^(https?:|data:|mailto:|tel:|#)/.test(ref)) continue;
    const clean = ref.split("#")[0];
    if (!clean) continue;
    if (!exists(clean)) fail(`${page}: missing resource "${clean}"`);
  }

  /* every internal .html link must be one of our pages */
  const links = html.match(/href="([^"]*\.html[^"]*)"/g) || [];
  for (const l of links) {
    const ref = l.match(/^href="([^"]+)"/)[1].split("#")[0];
    if (!ref) continue;
    if (/^https?:/.test(ref)) continue;
    if (!PAGES.includes(ref)) fail(`${page}: link to unknown page "${ref}"`);
  }
}

/* JSON-LD validity per page */
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) { fail(`${page}: no JSON-LD block`); continue; }
  try {
    const obj = JSON.parse(m[1]);
    if (!obj["@graph"] || obj["@graph"].find((n) => n["@type"] === "BreadcrumbList") === undefined) {
      fail(`${page}: JSON-LD @graph missing BreadcrumbList`);
    }
  } catch (e) {
    fail(`${page}: JSON-LD does not parse (${e.message})`);
  }
}

/* no leftover placeholder tokens */
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  for (const tok of ["TODO", "FIXME", "lorem", "/gallery/large_images", "/gallery/html"]) {
    if (new RegExp(tok, "i").test(html)) fail(`${page}: contains placeholder token "${tok}"`);
  }
}

console.log((errors === 0 ? "ALL CHECKS PASSED" : "CHECKS FAILED") + `  (${errors} errors, ${warnings} warnings)`);
process.exit(errors === 0 ? 0 : 1);