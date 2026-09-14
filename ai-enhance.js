const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const RGAN = "C:/Users/Arian/AppData/Local/Temp/opencode/realesrgan/realesrgan-ncnn-vulkan.exe";
const TMP = path.join(ROOT, ".ai-tmp");
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);

const targets = [];
const cat = process.argv[2] || "pools";
const baseDir = path.join(ROOT, "assets", "photos", cat);

for (const f of fs.readdirSync(baseDir).filter((x) => /\.jpg$/i.test(x))) targets.push(path.join(baseDir, f));
const thDir = path.join(baseDir, "thumbs");
for (const f of fs.readdirSync(thDir).filter((x) => /\.jpg$/i.test(x))) {
  const largeName = f.replace(/th\.jpg$/i, ".jpg");
  if (!fs.existsSync(path.join(baseDir, largeName))) targets.push(path.join(thDir, f));
}

let ok = 0;
for (const t of targets) {
  const out = path.join(TMP, path.basename(t));
  const r = spawnSync(RGAN, ["-i", t, "-o", out, "-s", "4", "-n", "realesrgan-x4plus"], { encoding: "utf8" });
  const size = fs.existsSync(out) ? fs.statSync(out).size : 0;
  if (r.status !== 0) { console.log("FAIL", t, size); continue; }
  const r2 = spawnSync("ffmpeg", ["-y", "-i", out, "-vf", "scale=1600:-1:flags=lanczos,unsharp=5:5:0.6:5:5:0.0", "-q:v", "4", t], { encoding: "utf8" });
  if (r2.status !== 0) { console.log("FFFAIL", t); continue; }
  fs.unlinkSync(out);
  ok++;
  console.log("AI ok:", path.relative(ROOT, t));
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log("done", ok, "of", targets.length);