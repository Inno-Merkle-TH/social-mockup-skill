#!/usr/bin/env node
/* calibrate.cjs · compare a kit-built replica against a real device screenshot, pixel for pixel.

   node scripts/calibrate.cjs <replica.html> <device-capture.png> [--out <dir>] [--scale 3]

   - <replica.html>: a page with ONE .dev (ios/android) that rebuilds the capture with kit classes
     (see references/screens/calibrate/*.html). Screen corners/island are hidden so pixels line up.
   - writes <out>/<name>-side.png   real | replica side by side
              <out>/<name>-blend.png  50/50 overlay (ghosting = misalignment)
              <out>/<name>-diff.png   abs difference (bright = mismatch)
   - prints a mismatch score per horizontal band of 20pt so you can see WHERE it drifts.
   Use this whenever you recalibrate kit.css against new screenshots; mark values [V] afterwards.
*/
const fs = require("fs"), path = require("path"), http = require("http"), { execFileSync } = require("child_process");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { console.error("playwright not found. Run:  cd " + __dirname + " && npm install"); process.exit(2); }
const a = process.argv.slice(2);
if (a.length < 2) { console.log(fs.readFileSync(__filename, "utf8").split("*/")[0]); process.exit(1); }
const opt = (k, d) => { const i = a.indexOf("--" + k); return i < 0 ? d : a[i + 1]; };
const replica = path.resolve(a[0]), capture = path.resolve(a[1]), scale = +opt("scale", 3);
const outDir = path.resolve(opt("out", path.join(path.dirname(replica), "out"))); fs.mkdirSync(outDir, { recursive: true });
const name = path.basename(replica, ".html");
const root = path.resolve(__dirname, "..");
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".PNG": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(r);
});
(async () => {
  await new Promise(ok => srv.listen(0, "127.0.0.1", ok));
  const url = `http://127.0.0.1:${srv.address().port}/${path.relative(root, replica).split(path.sep).map(encodeURIComponent).join("/")}`;
  let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ channel: "chrome" }); }
  const pg = await (await b.newContext({ viewport: { width: 700, height: 1100 }, deviceScaleFactor: scale })).newPage();
  await pg.goto(url, { waitUntil: "networkidle" });
  await pg.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 });
  await pg.addStyleTag({ content: ".dev .screen{border-radius:0!important}.dev .cam,.sysnav::after{display:none!important}.dev{box-shadow:none!important}" });
  const shot = path.join(outDir, name + "-replica.png");
  await pg.locator(".dev .screen").first().screenshot({ path: shot });
  await b.close(); srv.close();
  const py = `
import sys
from PIL import Image, ImageChops, ImageDraw
r=Image.open(sys.argv[1]).convert('RGB'); k=Image.open(sys.argv[2]).convert('RGB').resize(Image.open(sys.argv[1]).size)
W,H=r.size; o=sys.argv[3]; n=sys.argv[4]; s=float(sys.argv[5])
side=Image.new('RGB',(W*2+12,H),'white'); side.paste(k,(0,0)); side.paste(r,(W+12,0)); side.save(f'{o}/{n}-side.png')
Image.blend(k,r,.5).save(f'{o}/{n}-blend.png')
d=ImageChops.difference(k,r).convert('L'); d.point(lambda v:min(255,v*3)).save(f'{o}/{n}-diff.png')
band=int(20*s); px=d.load()
for y0 in range(0,H,band):
  tot=0;c=0
  for y in range(y0,min(H,y0+band),3):
    for x in range(0,W,3): tot+=px[x,y]; c+=1
  m=tot/c
  print(f"{y0/s:6.0f}-{min(H,y0+band)/s:4.0f}pt  {'#'*int(m/2):40s} {m:5.1f}")
`;
  process.stdout.write(execFileSync("python3", ["-W", "ignore", "-c", py, shot, capture, outDir, name, String(scale)]).toString());
  console.log("→ " + path.join(outDir, name + "-{side,blend,diff}.png"));
})();
