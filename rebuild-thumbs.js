const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const TMP = path.join(ROOT, ".thumbs-tmp");
const CATS = ["driveways", "pools", "patios", "walkways", "walls"];

if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);
let done = 0, fallback = 0, fail = 0;

for (const c of CATS) {
  const dir = path.join(ROOT, "assets", "photos", c);
  const thDir = path.join(dir, "thumbs");
  for (const f of fs.readdirSync(thDir).filter((x) => /\.jpg$/i.test(x))) {
    const largeName = f.replace(/th\.jpg$/i, ".jpg");
    const large = path.join(dir, largeName);
    if (!fs.existsSync(large)) { fallback++; continue; }
    const out = path.join(TMP, f);
    const r = spawnSync("ffmpeg", ["-y", "-i", large, "-vf", "scale=560:-1:flags=lanczos", "-q:v", "3", out], { encoding: "utf8" });
    if (r.status !== 0) { fail++; console.log("FAIL", f, (r.stderr || "").split("\n").slice(-2).join(" ")); continue; }
    fs.copyFileSync(out, path.join(thDir, f));
    fs.unlinkSync(out);
    done++;
  }
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log(`thumbs rebuilt from hi-res: ${done}, kept original thumb fallback: ${fallback}, failed: ${fail}`);