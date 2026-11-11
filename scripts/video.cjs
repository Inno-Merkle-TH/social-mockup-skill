#!/usr/bin/env node
/* social-mockup-studio · video.cjs
   Records every [data-flow] in a page (several screens + a scripted timeline, see references/video.md) to video.

   usage:  node video.cjs <project-dir> [--root <dir>] [--page index.html] [--only id1,id2]
                          [--fps 30] [--scale 2] [--bg "#F2F2F4" | transparent] [--pad 60]
                          [--canvas 1080x1920] [--gif] [--stills 0,2.5,5]
   output: <project-dir>/captures/video/<flow-id>.mp4   (H.264, plays everywhere: Keynote, PowerPoint, Slack, WhatsApp)
           --bg transparent → <flow-id>.mov  (ProRes 4444 with alpha, for Keynote / Premiere / After Effects)
           --gif            → also <flow-id>.gif (small, for email / chat previews)
           --stills a,b,c   → only PNG frames at those seconds (fast check, no video)

   - frames are rendered one by one (kitFlows[id].render(t)), so the video is perfectly smooth whatever the machine speed
   - --scale 2 = phone at 2× (≈ 870×1790 for iPhone); --canvas centres the phone on a fixed-size background (e.g. 1080x1920 for 9:16, 1920x1080 for slides)
   - needs ffmpeg on PATH for video (brew install ffmpeg). Without it the PNG frames are kept and the ffmpeg command is printed.
*/
const fs = require("fs"), path = require("path"), http = require("http"), { spawn, spawnSync } = require("child_process");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) {
  console.error("playwright not found. Run:  cd " + __dirname + " && npm install"); process.exit(2);
}

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || ".");
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const page = opt("page", "index.html"), only = opt("only", null), fps = +opt("fps", 30), scale = +opt("scale", 2);
const bg = String(opt("bg", "#F2F2F4")), alpha = bg === "transparent", pad = +opt("pad", 60);
const canvas = opt("canvas", null), gif = args.includes("--gif"), stills = opt("stills", null);
const root = path.resolve(opt("root", dir) === true ? dir : opt("root", dir));
if (!dir.startsWith(root)) { console.error("--root must contain the project dir"); process.exit(2); }
const outDir = path.join(dir, "captures", "video"); fs.mkdirSync(outDir, { recursive: true });
const hasFfmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".otf": "font/otf", ".ttf": "font/ttf", ".json": "application/json" };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": MIME[path.extname(p).toLowerCase()] || "application/octet-stream" }); fs.createReadStream(p).pipe(r);
});

function ffmpeg(argv, label) {
  return new Promise((ok, no) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...argv], { stdio: ["pipe", "inherit", "inherit"] });
    p.on("close", c => c ? no(new Error(label + ": ffmpeg exited " + c)) : ok()); p.on("error", no);
    ffmpeg.last = p;
  });
}

(async () => {
  await new Promise(ok => srv.listen(0, "127.0.0.1", ok));
  const rel = path.relative(root, dir).split(path.sep).filter(Boolean).map(encodeURIComponent).join("/");
  const base = `http://127.0.0.1:${srv.address().port}/${rel ? rel + "/" : ""}${page}`;
  let browser;
  try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ channel: "chrome" }); }
  const failed = [];

  async function open(url, vw, vh, dsf) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dsf });
    const pg = await ctx.newPage();
    pg.on("response", r => { if (r.status() >= 400) failed.push(r.status() + " " + r.url()); });
    await pg.goto(url, { waitUntil: "networkidle" });
    await pg.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 });
    return { ctx, pg };
  }

  const { ctx: c0, pg: p0 } = await open(base, 1600, 1000, 1);
  let ids = await p0.$$eval("[data-flow]", els => els.map(e => e.dataset.flow));
  const issues = await p0.evaluate(() => (window.__kitIssues || []).filter(i => String(i).startsWith("flow ")));
  await c0.close();
  if (only) ids = ids.filter(i => String(only).split(",").includes(i));
  if (!ids.length) { console.error("no [data-flow] found in " + base + (only ? " matching --only " + only : "")); process.exit(1); }
  if (issues.length) { console.error("flow script problems:\n  " + issues.join("\n  ")); process.exit(1); }

  for (const id of ids) {
    const url = base + "?flow=" + encodeURIComponent(id) + "&rec=1";
    // measure the frame at 1× first, then open a page exactly that size with `pad` around it
    const m = await (async () => { const { ctx, pg } = await open(url, 1700, 1300, 1); const b = await pg.locator(".frame").first().boundingBox(); await ctx.close(); return b; })();
    const vw = Math.ceil(m.width) + 2 * pad, vh = Math.ceil(m.height) + 2 * pad;
    const { ctx, pg } = await open(url, vw, vh, scale);
    await pg.addStyleTag({ content: `html,body{margin:0!important;background:${alpha ? "transparent" : bg}!important}
      .board{padding:0!important;display:block!important} .shot{margin:0!important} [data-flow] .frame{cursor:default}
      body{display:flex;align-items:center;justify-content:center;width:${vw}px;height:${vh}px;overflow:hidden}` });
    const dur = await pg.evaluate(fid => window.kitFlows[fid].duration, id);
    const b = await pg.locator(".frame").first().boundingBox();
    const clip = { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(vw, b.width + 2 * pad), height: Math.min(vh, b.height + 2 * pad) };
    const shoot = async t => { await pg.evaluate(([fid, tt]) => window.kitFlows[fid].render(tt), [id, t]); return pg.screenshot({ clip, omitBackground: alpha, type: "png" }); };

    if (stills) {
      for (const s of String(stills).split(",").map(Number)) {
        const f = path.join(outDir, `${id}@${s.toFixed(2)}s.png`); fs.writeFileSync(f, await shoot(s)); console.log("✓ " + path.relative(dir, f));
      }
      await ctx.close(); continue;
    }

    const n = Math.round(dur * fps), started = Date.now();
    const W = Math.round(clip.width * scale), H = Math.round(clip.height * scale);
    let vf = "pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0" + (alpha ? ":color=0x00000000" : ":color=" + bg.replace("#", "0x"));
    if (canvas) { const [cw, ch] = String(canvas).split("x").map(Number);
      vf = `scale=w=${cw}:h=${ch}:force_original_aspect_ratio=decrease,pad=${cw}:${ch}:(ow-iw)/2:(oh-ih)/2:color=${alpha ? "0x00000000" : bg.replace("#", "0x")}`; }
    const out = path.join(outDir, id + (alpha ? ".mov" : ".mp4"));
    const enc = alpha ? ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"] : ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
    let framesDir = null, job = null;
    if (hasFfmpeg) job = ffmpeg(["-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-", "-vf", vf, ...enc, "-r", String(fps), out], id);
    else { framesDir = path.join(outDir, id + "-frames"); fs.mkdirSync(framesDir, { recursive: true }); }
    const sink = hasFfmpeg ? ffmpeg.last.stdin : null;
    for (let i = 0; i < n; i++) {
      const png = await shoot(i / fps);
      if (sink) { if (!sink.write(png)) await new Promise(r => sink.once("drain", r)); }
      else fs.writeFileSync(path.join(framesDir, "f" + String(i).padStart(5, "0") + ".png"), png);
      if (i % fps === 0) process.stdout.write(`\r${id}: ${Math.round(100 * i / n)}%`);
    }
    await ctx.close();
    if (sink) {
      sink.end(); await job;
      if (gif) {
        const g = out.replace(/\.(mp4|mov)$/, ".gif");
        await ffmpeg(["-i", out, "-vf", "fps=15,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", g], "gif");
        console.log(`\r✓ ${path.relative(dir, g)}`);
      }
      const mb = (fs.statSync(out).size / 1048576).toFixed(1);
      console.log(`\r✓ ${path.relative(dir, out)}  ${dur.toFixed(1)} s · ${fps} fps · ${canvas || W + "x" + H} · ${mb} MB · rendered in ${((Date.now() - started) / 1000).toFixed(0)} s`);
    } else {
      console.log(`\r⚠ ffmpeg not found: ${n} frames kept in ${path.relative(dir, framesDir)}. Make the video with:\n  ffmpeg -framerate ${fps} -i "${framesDir}/f%05d.png" -vf "${vf}" ${enc.join(" ")} "${out}"`);
    }
  }
  await browser.close(); srv.close();
  if (failed.length) { console.error("failed requests:\n  " + [...new Set(failed)].join("\n  ")); process.exit(1); }
})().catch(e => { console.error(e); srv.close(); process.exit(1); });
