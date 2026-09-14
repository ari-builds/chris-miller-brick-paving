const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const cats = ["driveways", "pools", "patios", "walkways", "walls"];
const big = [];

for (const c of cats) {
  const dir = path.join("assets", "photos", c);
  for (const f of fs.readdirSync(dir).filter((f) => /\.jpg$/i.test(f))) {
    const fp = path.join(dir, f);
    const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", fp], { encoding: "utf8" });
    if (r.status !== 0) continue;
    const [w, h] = r.stdout.trim().split(",").map(Number);
    big.push({ cat: c, file: f, w, h, px: (w || 0) * (h || 0) });
  }
}

big.sort((a, b) => b.px - a.px);
console.log("TOP 10 by resolution:");
big.slice(0, 10).forEach((x) => console.log("  " + x.cat + "/" + x.file + "  " + x.w + "x" + x.h));
console.log("total larges: " + big.length);