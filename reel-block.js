const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const REEL_DIRS = {
  driveways: "reel-driveways-driveways",
  patios: "reel-patios-patios",
  walkways: "reel-walkways-walkways",
  walls: "reel-rock-block-retaining-walls-walls",
};

const TITLES = {
  driveways: "Driveways",
  patios: "Patios",
  walkways: "Walkways",
  walls: "Rock & Block Retaining Walls",
};

function reelPath(id) {
  if (!REEL_DIRS[id]) return "";
  return path.join(ROOT, "videos", REEL_DIRS[id], "renders", `${id}-reel.mp4`);
}

function mp4Rel(id) {
  return `videos/${REEL_DIRS[id]}/renders/${id}-reel.mp4`;
}

function hasReel(id) {
  if (!REEL_DIRS[id]) return false;
  return fs.existsSync(reelPath(id));
}

function reel(id, { kicker = "Watch the work" } = {}) {
  if (!hasReel(id)) return "";
  const title = TITLES[id] || id;
  const img = `assets/videos/${id}-poster.jpg`;
  return `
    <section class="reel-block">
      <div class="section">
        <p class="kicker fade">${kicker}</p>
        <h2 class="fade">The ${title} reel</h2>
        <video controls preload="metadata" poster="${img}">
          <source src="${mp4Rel(id)}" type="video/mp4" />
          Your browser doesn't support embedded video -
          <a href="${mp4Rel(id)}" download>download the ${title} reel</a> instead.
        </video>
        <p class="reel-note fade">A cinematic tour of real ${title.toLowerCase()} projects by Chris Miller. Free estimates &middot; fully insured &middot; 5-year paver installation warranty.</p>
      </div>
    </section>`;
}

module.exports = { hasReel, reel, reelPath, mp4Rel, REEL_DIRS, TITLES };