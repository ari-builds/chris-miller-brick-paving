const path = require("path");
const puppeteer = require("C:/Users/Arian/AppData/Roaming/npm/node_modules/hyperframes/node_modules/puppeteer-core");

const ROOT = "C:/Users/Arian/Desktop/chris-miller-brick-paving";
const PAGES = ["index.html", "services.html", "about.html", "gallery.html",
  "gallery-driveways.html", "gallery-pools.html", "gallery-patios.html",
  "gallery-walkways.html", "gallery-walls.html", "contact.html", "btu-bricks.html"];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:/Users/Arian/.cache/puppeteer/chrome/win64-152.0.7977.42/chrome-win64/chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--allow-file-access-from-files"],
  });
  let fails = 0;
  for (const p of PAGES) {
    const page = await browser.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto("file:///" + path.join(ROOT, p).replace(/\\/g, "/"), { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 400));

    const shell = await page.evaluate(() => !!document.querySelector(".top") && !!document.querySelector("footer"));
    const h1 = await page.evaluate(() => document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : "(none)");
    const broken = await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
      let n = 0;
      document.querySelectorAll("img").forEach((i) => { if (i.getAttribute("src") && i.complete && i.naturalWidth === 0) n++; });
      return n;
    });
    const imgCount = await page.evaluate(() => document.querySelectorAll("img").length);
    const fps = errors.filter((e) => /fonts\.gstatic/i.test(e));
    const real = errors.filter((e) => !/fonts\.gstatic/i.test(e));
    console.log(`${p.padEnd(26)} shell=${shell ? "ok" : "MISSING"}  imgs=${String(imgCount).padStart(3)} broken=${String(broken).padStart(2)}  h1="${h1.slice(0, 40)}"  ${real.length ? "CSERR=" + real.length : "js=ok"}`);
    if (!shell || broken > 0 || real.length) fails++;
    await page.close();
  }
  await browser.close();
  console.log(fails ? `SMOKE: ${fails} pages with issues` : "SMOKE: all pages clean");
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error("SMOKE FAIL", e.message); process.exit(1); });