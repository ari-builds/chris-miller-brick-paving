const fs = require("fs");
const path = require("path");
const { reel } = require("./reel-block");

const ROOT = __dirname;
const LIB = path.join(ROOT, "gallery.html");

if (!fs.existsSync(LIB)) {
  console.error("gallery.html not found");
  process.exit(1);
}

let html = fs.readFileSync(LIB, "utf8");

if (/class="reel-block"/.test(html)) {
  console.log("gallery.html reel block already present - skipping");
  process.exit(0);
}

const block = reel("driveways", { kicker: "Watch the work" });
if (!block) {
  console.log("driveways reel not rendered yet - skipping");
  process.exit(0);
}

const heroEnd = '<section class="section-block">';
if (html.indexOf(heroEnd) === -1) {
  console.error("anchor not found");
  process.exit(1);
}

html = html.replace(heroEnd, block + "\n" + heroEnd);
fs.writeFileSync(LIB, html, "utf8");
console.log("gallery.html driveways reel embedded");