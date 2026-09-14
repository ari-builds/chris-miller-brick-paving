const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "videos");
const PHOTOS = path.join(ROOT, "assets", "photos");

const RW = parseInt(process.env.REEL_W, 10) || 1920;
const RH = parseInt(process.env.REEL_H, 10) || 1080;
const RPER = parseFloat(process.env.REEL_PER) || 0;

const CATS = [
  { id: "driveways", title: "Driveways", w: RW, h: RH, per: RPER || 2.2 },
  { id: "patios", title: "Patios", w: RW, h: RH, per: RPER || 2.4 },
  { id: "walkways", title: "Walkways", w: RW, h: RH, per: RPER || 2.4 },
  { id: "walls", title: "Rock & Block Retaining Walls", w: RW, h: RH, per: RPER || 2.4 },
];

const ID = (name) =>
  "reel-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "reel";

for (const cat of CATS) {
  const srcDir = path.join(PHOTOS, cat.id);
  const files = fs.readdirSync(srcDir)
    .filter((f) => /\.jpg$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const proj = path.join(OUT, ID(cat.title) + "-" + cat.id);
  const pDir = path.join(proj, "photos");
  fs.mkdirSync(pDir, { recursive: true });

  const used = [];
  for (const f of files) {
    fs.copyFileSync(path.join(srcDir, f), path.join(pDir, f));
    used.push(f);
  }

  const n = used.length;
  const DUR = n * cat.per;
  const dur = DUR.toFixed(2);

  const clips = used
    .map((f, i) => {
      const start = (i * cat.per).toFixed(2);
      const kb = i % 4;
      const pan = kb === 0 ? `x-percent:-4, scale:1.22` : kb === 1 ? `x-percent:4, scale:1.22` : kb === 2 ? `x-percent:0, y-percent:-3, scale:1.25` : `x-percent:0, y-percent:3, scale:1.25`;
      return { f, start, kb };
    });

  const imgHtml = clips
    .map(
      (c) =>
        `<div id="c${c.start.replace(".", "")}" class="clip" data-start="${c.start}" data-duration="${cat.per}" data-track-index="1">` +
        `<img src="photos/${c.f}" alt="" /></div>`
    )
    .join("\n      ");

  const tlLines = clips
    .map((c, i) => {
      const id = `#c${c.start.replace(".", "")}`;
      const s = parseFloat(c.start).toFixed(2);
      if (i % 4 === 0)
        return `tl.fromTo("${id} img", { opacity: 0, scale: 1.22, x: "-3.2%" }, { opacity: 1, scale: 1, x: "0%", duration: ${cat.per - 0.2}, ease: "power2.out" }, ${s});`;
      if (i % 4 === 1)
        return `tl.fromTo("${id} img", { opacity: 0, scale: 1.22, x: "3.2%" }, { opacity: 1, scale: 1, x: "0%", duration: ${cat.per - 0.2}, ease: "power2.out" }, ${s});`;
      if (i % 4 === 2)
        return `tl.fromTo("${id} img", { opacity: 0, scale: 1.25, y: "-3%" }, { opacity: 1, scale: 1, y: "0%", duration: ${cat.per - 0.2}, ease: "power2.out" }, ${s});`;
      return `tl.fromTo("${id} img", { opacity: 0, scale: 1.25, y: "3%" }, { opacity: 1, scale: 1, y: "0%", duration: ${cat.per - 0.2}, ease: "power2.out" }, ${s});`;
    })
    .join("\n      ");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${cat.w}, height=${cat.h}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${cat.w}px; height: ${cat.h}px; overflow: hidden; background: #131009; }
      .clip { position: absolute; inset: 0; width: ${cat.w}px; height: ${cat.h}px; }
      .clip img { width: 100%; height: 100%; object-fit: cover; }
      .brand { position: fixed; right: 44px; bottom: 36px; z-index: 50;
        font-family: Georgia, serif; color: rgba(255,250,242,.92); text-align: right;
        text-shadow: 0 2px 14px rgba(0,0,0,.65); }
      .brand b { font-size: 34px; font-weight: 700; letter-spacing: .01em; }
      .brand span { display: block; font-family: Arial, sans-serif; font-size: 15px;
        letter-spacing: .32em; text-transform: uppercase; margin-top: 4px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${dur}" data-width="${cat.w}" data-height="${cat.h}">
      ${imgHtml}
      <div class="brand" class="clip" data-start="1.5" data-duration="${dur}" data-track-index="2"><b>Chris Miller</b><span>Brick Paver Installer &middot; New England</span></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      ${tlLines}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

  fs.writeFileSync(path.join(proj, "index.html"), html, "utf8");
  fs.writeFileSync(path.join(proj, "meta.json"), JSON.stringify({ id: ID(cat.title) + "-" + cat.id, name: cat.title + " reel", createdAt: new Date().toISOString() }, null, 2), "utf8");
  fs.writeFileSync(path.join(proj, "package.json"), JSON.stringify({ name: ID(cat.title) + "-" + cat.id, private: true, type: "module", scripts: { render: "npx --yes hyperframes@0.8.37 render" } }, null, 2), "utf8");
  fs.writeFileSync(path.join(proj, "hyperframes.json"), JSON.stringify({ registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry", paths: { assets: "assets" }, media: { autoProxy: true } }, null, 2), "utf8");

  console.log(`built ${path.basename(proj)} :: ${n} photos :: ${dur}s @ ${cat.w}x${cat.h}`);
}