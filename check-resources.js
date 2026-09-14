const fs = require("fs");
const P = ["index.html", "services.html", "about.html", "gallery.html",
  "gallery-driveways.html", "gallery-pools.html", "gallery-patios.html",
  "gallery-walkways.html", "gallery-walls.html", "contact.html", "btu-bricks.html"];
let n = 0;
for (const p of P) {
  const h = fs.readFileSync(p, "utf8");
  const refs = h.match(/(?:src|href)="([^"]+)"/g) || [];
  for (const r of refs) {
    const ref = r.match(/^[^=]+="([^"]+)"/)[1];
    if (/^(https?:|data:|mailto:|tel:|#)/.test(ref)) continue;
    const c = ref.split("#")[0];
    if (!c) continue;
    if (!fs.existsSync(c)) { console.log("MISSING", p, "->", ref); n++; }
  }
}
console.log("missing-file refs:", n);
process.exit(n ? 1 : 0);