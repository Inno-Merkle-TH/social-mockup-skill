#!/usr/bin/env python3
"""
clean_image.py · run on EVERY image the user uploads (and every screenshot you crop) before placing it.

usage:
  python3 scripts/clean_image.py <img> [<img> …] [--out <dir>] [--tol 14] [--max 40] [--any] [--for <placement>] [--edges <sheet.png>]

- Trims white / near-white rows and columns from each edge (screenshots and exported banners often
  carry a 1–30 px white strip that shows up as "white space under the tile" in the mockup).
  A row counts as border when ≥ 98 % of its pixels are within --tol of white (or of the corner
  colour with --any, e.g. black letterbox bars). Transparent pixels are NOT trimmed (transparent PNG
  rich messages are legitimate). Strips wider than --max (40 px) are reported, not cut: they are
  usually a white product background.
- Writes the cleaned image in place (original kept in <dir>/_originals/) or to --out <dir>.
- Prints exactly what it trimmed, e.g.  banner.png  1040×1052 → 1040×1040  (top 0, bottom 12, left 0, right 0)
  and appends the same line to <dir>/clean-log.txt, so notes.md can cite it.
- --for <placement> checks the result against references/line-image-sizes.md and warns:
    line-richmsg | line-flex-hero | line-image | line-richmenu-large | line-richmenu-compact |
    line-card | fb-feed | fb-carousel | story | tiktok
- --edges <sheet.png> writes a QA sheet: a 4× zoom of the outer 24 px on all four sides of every
  image. LOOK at it: any light line along an edge is a defect.
"""
import os, shutil, sys, datetime
from PIL import Image, ImageDraw

SPEC = {  # placement: (allowed exact sizes or None, (min_ratio, max_ratio) w/h, note)
    "line-richmsg": ([(1040, 1040), (1040, 350), (1040, 585), (1040, 700), (1040, 1300), (1040, 1850)], (1040 / 2080, 1040 / 250),
                     "rich message: 1040 wide; 1040×1040 default; other heights need user confirmation (see line-image-sizes.md)"),
    "line-flex-hero": (None, (1 / 3, 100), "Flex image: height ≤ 3× width, ≤1024×1024 px per LINE API; common hero 20:13, 1.51:1, 1:1"),
    "line-image": (None, (0.05, 20), "image message: any ratio, JPEG/PNG ≤10 MB, preview ≤1 MB"),
    "line-richmenu-large": ([(2500, 1686), (1200, 810), (800, 540)], (1.45, 99), "rich menu: 800–2500 wide, ≥250 high, w/h ≥1.45, ≤1 MB"),
    "line-richmenu-compact": ([(2500, 843), (1200, 405), (800, 270)], (1.45, 99), "rich menu compact"),
    "line-card": (None, (1.0, 1.55), "card-based message: 1.51:1 or 1:1 (OA Manager)"),
    "fb-feed": (None, (0.8, 1.91), "FB feed 4:5 default, 1:1, 1.91:1"),
    "fb-carousel": (None, (1.0, 1.0), "FB carousel 1:1"),
    "story": (None, (9 / 16, 9 / 16), "Stories/Reels 9:16"),
    "tiktok": (None, (9 / 16, 9 / 16), "TikTok 9:16"),
}

def near(px, ref, tol):
    return all(abs(a - b) <= tol for a, b in zip(px[:3], ref[:3]))

def is_border(im, line, ref, tol, horizontal):
    w, h = im.size; n = w if horizontal else h; step = max(1, n // 600); bad = tot = 0
    for i in range(0, n, step):
        p = im.getpixel((i, line) if horizontal else (line, i)); tot += 1
        if len(p) == 4 and p[3] < 16: bad += 1; continue        # transparent: stop trimming here
        if not near(p, ref, tol): bad += 1
    return bad <= tot * 0.02

def trim(im, tol, any_colour):
    rgba = im.convert("RGBA"); w, h = rgba.size
    corner = rgba.getpixel((0, 0)) if any_colour else (255, 255, 255, 255)
    t = 0
    while t < h // 3 and is_border(rgba, t, corner, tol, True): t += 1
    b = 0
    while b < h // 3 and is_border(rgba, h - 1 - b, rgba.getpixel((0, h - 1)) if any_colour else corner, tol, True): b += 1
    l = 0
    while l < w // 3 and is_border(rgba, l, corner, tol, False): l += 1
    r = 0
    while r < w // 3 and is_border(rgba, w - 1 - r, rgba.getpixel((w - 1, 0)) if any_colour else corner, tol, False): r += 1
    return (t, b, l, r)

def cap(sides, mx):
    """strips wider than --max px are probably a white BACKGROUND, not a border: report, don't cut"""
    kept, skipped = [], []
    for name, v in zip(("top", "bottom", "left", "right"), sides):
        if v > mx: skipped.append(f"{name} {v}px"); kept.append(0)
        else: kept.append(v)
    return tuple(kept), skipped

def check(size, placement):
    if placement not in SPEC: return [f"unknown placement '{placement}' (options: {', '.join(SPEC)})"]
    sizes, (lo, hi), note = SPEC[placement]; w, h = size; ratio = w / h; warn = []
    if not (lo - .01 <= ratio <= hi + .01): warn.append(f"ratio {w}×{h} ({ratio:.2f}) is outside {placement} ({note})")
    if sizes and (w, h) not in sizes:
        near_ = min(sizes, key=lambda s: abs(s[0] / s[1] - ratio))
        warn.append(f"{w}×{h} is not a standard {placement} size; nearest {near_[0]}×{near_[1]}. {note}")
    if placement == "line-richmsg" and (w, h) != (1040, 1040) and not warn:
        warn.append(f"{w}×{h} is a valid but NON-SQUARE rich message: confirm with the user (default is 1040×1040)")
    if placement == "line-flex-hero" and max(w, h) > 1024: warn.append(f"{w}×{h} > 1024 px: LINE API caps Flex images at 1024×1024, export it smaller")
    return warn

def edge_sheet(paths, out, band=24, zoom=4):
    rows = []
    for p in paths:
        im = Image.open(p).convert("RGBA"); w, h = im.size
        strips = [("top", im.crop((0, 0, w, band))), ("bottom", im.crop((0, h - band, w, h))),
                  ("left", im.crop((0, 0, band, h)).rotate(90, expand=True)), ("right", im.crop((w - band, 0, w, h)).rotate(90, expand=True))]
        for name, s in strips:
            s = s.resize((min(1600, s.width * zoom), band * zoom), Image.NEAREST)
            rows.append((f"{os.path.basename(p)} · {name}", s))
    W = max(s.width for _, s in rows) + 20; H = sum(s.height + 30 for _, s in rows) + 10
    sheet = Image.new("RGBA", (W, H), (60, 60, 64, 255)); d = ImageDraw.Draw(sheet); y = 10
    for label, s in rows:
        d.text((10, y), label, fill=(255, 255, 255, 255)); y += 18
        sheet.alpha_composite(s, (10, y)); y += s.height + 12
    sheet.save(out); print(f"edge sheet → {out}  (open it: any light line along an edge is a defect)")

def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    opt = lambda k, d=None: a[a.index("--" + k) + 1] if "--" + k in a else d
    flags_with_val = {"--out", "--tol", "--for", "--edges", "--max"}
    files = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] not in flags_with_val)]
    tol, out_dir, placement, any_colour = int(opt("tol", 14)), opt("out"), opt("for"), "--any" in a
    done, warned = [], 0
    for f in files:
        im = Image.open(f); fmt = im.format; w, h = im.size
        (t, b, l, r), skipped = cap(trim(im, tol, any_colour), int(opt("max", 40)))
        if skipped: print(f"  ⚠ {os.path.basename(f)}: wide white area at {', '.join(skipped)} looks like a white background, NOT trimmed. Look at it; use --max to force."); warned += 1
        dst = os.path.join(out_dir, os.path.basename(f)) if out_dir else f
        if any((t, b, l, r)):
            if not out_dir:
                bak = os.path.join(os.path.dirname(os.path.abspath(f)), "_originals"); os.makedirs(bak, exist_ok=True)
                shutil.copy2(f, os.path.join(bak, os.path.basename(f)))
            else: os.makedirs(out_dir, exist_ok=True)
            im = im.crop((l, t, w - r, h - b)); im.save(dst, fmt, **({"quality": 92} if fmt == "JPEG" else {}))
        elif out_dir:
            os.makedirs(out_dir, exist_ok=True); shutil.copy2(f, dst)
        msg = f"{os.path.basename(f)}  {w}×{h} → {im.size[0]}×{im.size[1]}  (top {t}, bottom {b}, left {l}, right {r})" + ("" if any((t, b, l, r)) else "  clean")
        print(("✂ " if any((t, b, l, r)) else "✓ ") + msg)
        with open(os.path.join(os.path.dirname(os.path.abspath(dst)), "clean-log.txt"), "a") as lg:
            lg.write(f"{datetime.datetime.now():%Y-%m-%d %H:%M}  {msg}\n")
        if placement:
            for wmsg in check(im.size, placement): print("  ⚠ " + wmsg); warned += 1
        done.append(dst)
    if opt("edges"): edge_sheet(done, opt("edges"))
    sys.exit(0)

if __name__ == "__main__":
    main()
