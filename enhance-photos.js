const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FFPROBE = process.env.FFPROBE || "ffprobe";
const TMP = path.join(ROOT, ".enhance-tmp");

const MAX_LARGE = 1600;
const MAX_THUMB = 900;

function dims(file) {
  const r = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const [w, h] = r.stdout.trim().split(",").map(Number);
  return { w, h };
}

function enhance(file, maxDim) {
  const d = dims(file);
  if (!d || !d.w || !d.h) { console.log("SKIP (noprobe)", file); return false; }
  const ratio = Math.min(1, maxDim / Math.max(d.w, d.h));
  let w, h;
  if (ratio < 1) { w = Math.round(d.w * ratio); h = Math.round(d.h * ratio); }
  else { w = d.w * 2; h = d.h * 2; }
  const vf =
    `scale=${w}:${h}:flags=lanczos,` +
    `unsharp=7:7:0.9:5:5:0.05,` +
    `eq=saturation=1.06:contrast=1.03`;
  const out = path.join(TMP, path.basename(file));
  const r = spawnSync(FFMPEG, [
    "-y", "-i", file,
    "-vf", vf,
    "-q:v", "4",
    out,
  ], { encoding: "utf8" });
  if (r.status !== 0) {
    console.log("FAIL", file, (r.stderr || "").split("\n").slice(-2).join(" "));
    return false;
  }
  fs.copyFileSync(out, file);
  fs.unlinkSync(out);
  return true;
}

const target = process.argv[2]; // e.g. "driveways" or "driveways+l" or "all-l"
const CATEGORIES = ["driveways", "pools", "patios", "walkways", "walls"];

if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);
let done = 0, failed = 0;

const files = [];
if (target === "all") {
  for (const c of CATEGORIES) {
    const base = path.join(ROOT, "assets", "photos", c);
    for (const f of fs.readdirSync(base).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
      files.push([path.join(base, f), MAX_LARGE]);
    }
    const th = path.join(base, "thumbs");
    for (const f of fs.readdirSync(th).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
      files.push([path.join(th, f), MAX_THUMB]);
    }
  }
} else if (target === "all-l") {
  for (const c of CATEGORIES) {
    const base = path.join(ROOT, "assets", "photos", c);
    for (const f of fs.readdirSync(base).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
      files.push([path.join(base, f), MAX_LARGE]);
    }
  }
} else if (target === "all-t") {
  for (const c of CATEGORIES) {
    const th = path.join(ROOT, "assets", "photos", c, "thumbs");
    for (const f of fs.readdirSync(th).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
      files.push([path.join(th, f), MAX_THUMB]);
    }
  }
} else if (target && target.endsWith("+l")) {
  const c = target.replace("+l", "");
  const base = path.join(ROOT, "assets", "photos", c);
  for (const f of fs.readdirSync(base).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
    files.push([path.join(base, f), MAX_LARGE]);
  }
} else if (target && target.endsWith("+t")) {
  const c = target.replace("+t", "");
  const th = path.join(ROOT, "assets", "photos", c, "thumbs");
  for (const f of fs.readdirSync(th).filter((f) => f.toLowerCase().endsWith(".jpg"))) {
    files.push([path.join(th, f), MAX_THUMB]);
  }
}

const t0 = Date.now();
for (const [f, mx] of files) {
  if (enhance(f, mx)) done++; else failed++;
}
console.log(`done=${done} failed=${failed} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);