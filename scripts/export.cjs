#!/usr/bin/env node
/* social-mockup-studio · export.cjs
   Renders every [data-shot] in a page to a transparent PNG, plus an overview board.

   usage:  node export.cjs <project-dir> [--root <dir>] [--page index.html] [--only id1,id2] [--scale 3] [--overview-width 2000] [--no-overview] [--safe] [--bare [round]]
   output: <project-dir>/captures/<NN>-<shot-id>.png, 00-overview.png, qa.json

   - serves the project over a local http server (sprites/fonts need http, not file://)
   - waits for kit.js (html[data-ready=1]): fonts loaded, images decoded
   - fails loudly on 4xx/5xx requests, broken images, placeholder blocks, text overflow
   - requires: npm i playwright (in this folder) or global; uses installed Google Chrome
     if Playwright's own Chromium isn't downloaded.
*/
const fs = require("fs"), path = require("path"), http = require("http");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) {
  console.error("playwright not found. Run:  cd " + __dirname + " && npm install"); process.exit(2);
}

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || ".");
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const page = opt("page", "index.html"), scale = +opt("scale", 3), only = opt("only", null);
const bareQ = args.includes("--bare") ? "&bare=" + (opt("bare", true) === "round" ? "round" : "1") : "";   // --bare: screen only, no phone frame (--bare round keeps the corners)
const outDir = path.join(dir, "captures"); fs.mkdirSync(outDir, { recursive: true });

// serves ONLY the project folder by default (projects carry their own kit/). Use --root <dir> to widen
// (e.g. the skill's own templates/gallery.html references ../assets, so it's exported with --root ..)
const root = path.resolve(opt("root", dir) === true ? dir : opt("root", dir));
if (!dir.startsWith(root)) { console.error("--root must contain the project dir"); process.exit(2); }
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".otf": "font/otf", ".ttf": "font/ttf", ".json": "application/json" };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": MIME[path.extname(p).toLowerCase()] || "application/octet-stream" }); fs.createReadStream(p).pipe(r);
});

(async () => {
  await new Promise(ok => srv.listen(0, "127.0.0.1", ok));
  const rel = path.relative(root, dir).split(path.sep).filter(Boolean).map(encodeURIComponent).join("/");
  const base = `http://127.0.0.1:${srv.address().port}/${rel ? rel + "/" : ""}${page}`;
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ channel: "chrome" }); }
  const qa = { page: base, shots: [], failedRequests: [], issues: [] };

  async function open(url, vw, vh, dsf) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dsf });
    const pg = await ctx.newPage();
    pg.on("response", r => { if (r.status() >= 400) qa.failedRequests.push(r.status() + " " + r.url()); });
    pg.on("requestfailed", r => qa.failedRequests.push("FAILED " + r.url()));
    await pg.goto(url, { waitUntil: "networkidle" });
    await pg.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 });
    // neutralise any forced browser zoom so 1 CSS px == 1 layout px
    await pg.evaluate(() => { const z = parseFloat(getComputedStyle(document.documentElement).zoom || "1"); if (z && Math.abs(z - 1) > .01) document.documentElement.style.zoom = 1 / z; });
    return { ctx, pg };
  }

  // 1) discover shots
  const { ctx: c0, pg: p0 } = await open(base, 1600, 1000, 1);
  const allIds = await p0.$$eval("[data-shot]", els => els.map(e => e.dataset.shot));
  let ids = allIds.slice();
  qa.issues.push(...(await p0.evaluate(() => window.__kitIssues || [])));
  if (only) ids = ids.filter(i => String(only).split(",").includes(i));
  // overview
  if (!args.includes("--no-overview") && !only) {
    await c0.close();
    const { ctx, pg } = await open(base, +opt("overview-width", 2000), 1000, 1.5);
    await pg.locator(".board").screenshot({ path: path.join(outDir, "00-overview.png") });
    await ctx.close();
  } else await c0.close();

  // 2) each shot on its own transparent page
  for (const id of ids) {
    const n = allIds.indexOf(id) + 1;   // stable numbering = order in the page
    const desk = await (async () => { const { ctx, pg } = await open(base + "?only=" + encodeURIComponent(id) + (args.includes("--safe") ? "&safe=1" : "") + bareQ, 1700, 1100, 1);
      const b = await pg.locator(".frame").first().boundingBox(); const d = await pg.locator(".dev.desktop").count(); await ctx.close(); return { b, d }; })();
    const vw = Math.ceil(desk.b.width) + 2, vh = Math.ceil(desk.b.height) + 2;
    const dsf = desk.d ? Math.min(scale, 2) : scale;
    const { ctx, pg } = await open(base + "?only=" + encodeURIComponent(id) + (args.includes("--safe") ? "&safe=1" : "") + bareQ, vw, vh, dsf);
    const file = path.join(outDir, String(n).padStart(2, "0") + "-" + id + ".png");
    const fb = await pg.locator(".frame").first().boundingBox();
    await pg.locator(".frame").first().screenshot({ path: file, omitBackground: true });
    const issues = await pg.evaluate(() => window.__kitIssues || []);
    qa.shots.push({ id, file: path.relative(dir, file), px: [Math.round(fb.width * dsf), Math.round(fb.height * dsf)], issues });
    await ctx.close();
    console.log((issues.length ? "⚠ " : "✓ ") + path.basename(file) + (issues.length ? "  " + issues.join(" | ") : ""));
  }
  await browser.close(); srv.close();
  qa.failedRequests = [...new Set(qa.failedRequests)];
  fs.writeFileSync(path.join(outDir, "qa.json"), JSON.stringify(qa, null, 2));
  const bad = qa.failedRequests.length + qa.shots.reduce((a, s) => a + s.issues.length, 0);
  console.log(`\n${qa.shots.length} shots → ${outDir}\nfailed requests: ${qa.failedRequests.length}${qa.failedRequests.length ? "\n  " + qa.failedRequests.join("\n  ") : ""}\nQA issues: ${bad ? bad + " (see captures/qa.json)" : "none"}`);
  process.exit(qa.failedRequests.length ? 1 : 0);
})().catch(e => { console.error(e); srv.close(); process.exit(1); });
