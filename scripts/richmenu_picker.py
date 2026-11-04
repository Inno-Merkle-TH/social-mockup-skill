#!/usr/bin/env python3
"""
richmenu_picker.py · builds the rich menu LAYOUT PICKER shown to the user at intake (Round 3b).

usage:
  python3 scripts/richmenu_picker.py [--out templates/richmenu-picker.svg] [--png]

Writes one self-contained SVG (no fonts, images or scripts, so it renders inline as a Claude app
artifact, in Cowork, in any browser) with every rich menu layout: the 7 large and 5 compact
OA Manager templates plus custom and tabbed (Messaging API). Each card shows the code the user
replies with (L6, C3 …), the tap areas A, B, C…, the area count and a "good for" hint.
--png also renders <out>.png at 2× with Playwright (Node or Python), if one is available.
Layout geometry matches assets/kit.css (.rm-art.L6 … .C1). Change both together.
"""
import os, shutil, subprocess, sys

# code: (title, good-for hint, [areas as (x, y, w, h) fractions of the image])
LARGE = [
    ("L6", "3 × 2 · 6 areas", "full service menu: shop, coupons, points…", [(c / 3, r / 2, 1 / 3, 1 / 2) for r in range(2) for c in range(3)]),
    ("L4", "2 × 2 · 4 areas", "4 bigger shortcuts", [(c / 2, r / 2, 1 / 2, 1 / 2) for r in range(2) for c in range(2)]),
    ("L4b", "wide top + 3 · 4 areas", "campaign banner + 3 shortcuts", [(0, 0, 1, .5)] + [(c / 3, .5, 1 / 3, .5) for c in range(3)]),
    ("L3", "big left + 2 · 3 areas", "hero promo + 2 shortcuts", [(0, 0, 2 / 3, 1), (2 / 3, 0, 1 / 3, .5), (2 / 3, .5, 1 / 3, .5)]),
    ("L2r", "2 rows · 2 areas", "2 wide banners", [(0, 0, 1, .5), (0, .5, 1, .5)]),
    ("L2c", "2 columns · 2 areas", "2 big choices", [(0, 0, .5, 1), (.5, 0, .5, 1)]),
    ("L1", "full · 1 area", "one campaign, one link", [(0, 0, 1, 1)]),
]
COMPACT = [
    ("C3", "3 columns · 3 areas", "3 shortcuts, more chat visible", [(c / 3, 0, 1 / 3, 1) for c in range(3)]),
    ("C2", "halves · 2 areas", "2 choices", [(0, 0, .5, 1), (.5, 0, .5, 1)]),
    ("C2l", "⅔ + ⅓ · 2 areas", "main action + 1", [(0, 0, 2 / 3, 1), (2 / 3, 0, 1 / 3, 1)]),
    ("C2r", "⅓ + ⅔ · 2 areas", "1 + main action", [(0, 0, 1 / 3, 1), (1 / 3, 0, 2 / 3, 1)]),
    ("C1", "full · 1 area", "single banner", [(0, 0, 1, 1)]),
]
TAB_H = .16
API = [
    ("custom", "any layout · up to 20 areas", "free shapes, e.g. hero + 3 stacked", [(0, 0, .6, 1), (.6, 0, .4, 1 / 3), (.6, 1 / 3, .4, 1 / 3), (.6, 2 / 3, .4, 1 / 3)]),
    ("tabbed", "tab strip + menu per tab", "switch between e.g. Menu / Rewards", "tabs"),
]
DEFAULTS = {"L6", "C3"}

W, M, GAP, CW = 1216, 32, 24, 270          # canvas width, margin, gap, card width
LH, CH = round(CW * 1686 / 2500), round(CW * 843 / 2500)
INK, SUB, LINE, FILL, ACC = "#1d1d1f", "#6e6e73", "#06c755", "#f2f4f7", "#06c755"
FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

def esc(s): return s.replace("&", "&amp;").replace("<", "&lt;")

def areas_svg(x, y, w, h, areas):
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{FILL}" stroke="#d2d6dc"/>']
    for i, (ax, ay, aw, ah) in enumerate(areas):
        rx, ry, rw, rh = x + ax * w, y + ay * h, aw * w, ah * h
        L = chr(65 + i)
        out.append(f'<rect x="{rx + 1.5:.1f}" y="{ry + 1.5:.1f}" width="{rw - 3:.1f}" height="{rh - 3:.1f}" rx="4" fill="#fff" stroke="{LINE}" stroke-width="1.5" stroke-dasharray="5 4"/>')
        fs = 26 if min(rw, rh) > 70 else 20
        out.append(f'<text x="{rx + rw / 2:.1f}" y="{ry + rh / 2 + fs * .35:.1f}" text-anchor="middle" font-size="{fs}" font-weight="700" fill="#9aa1ab">{L}</text>')
    return out

def tabs_svg(x, y, w, h):
    th = h * TAB_H; out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{FILL}" stroke="#d2d6dc"/>']
    for i, name in enumerate(("Menu", "Rewards", "Stores")):
        tx = x + i * w / 3; on = i == 0
        out.append(f'<rect x="{tx:.1f}" y="{y}" width="{w / 3:.1f}" height="{th:.1f}" fill="{"#fff" if on else "#e4e7eb"}"/>')
        if on: out.append(f'<rect x="{tx:.1f}" y="{y + th - 3:.1f}" width="{w / 3:.1f}" height="3" fill="{ACC}"/>')
        out.append(f'<text x="{tx + w / 6:.1f}" y="{y + th * .68:.1f}" text-anchor="middle" font-size="12" font-weight="{700 if on else 500}" fill="{INK if on else SUB}">{name}</text>')
    grid = [(c / 3, r / 2, 1 / 3, 1 / 2) for r in range(2) for c in range(3)]
    return out + areas_svg(x, y + th, w, h - th, grid)[1:]

def card(x, y, code, title, hint, areas, h):
    out = tabs_svg(x, y, CW, h) if areas == "tabs" else areas_svg(x, y, CW, h, areas)
    ty = y + h + 24
    out.append(f'<text x="{x}" y="{ty}" font-size="17" font-weight="800" fill="{INK}">{code}<tspan font-size="14" font-weight="500" fill="{INK}" dx="8">{esc(title)}</tspan></text>')
    out.append(f'<text x="{x}" y="{ty + 19}" font-size="12.5" fill="{SUB}">{esc(hint)}</text>')
    if code in DEFAULTS:
        out.append(f'<rect x="{x + CW - 54}" y="{ty - 15}" width="54" height="20" rx="10" fill="{ACC}"/>'
                   f'<text x="{x + CW - 27}" y="{ty - 1}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">default</text>')
    return out

def section(y, label, note, items, h):
    out = [f'<text x="{M}" y="{y}" font-size="13" font-weight="800" letter-spacing="1.2" fill="{SUB}">{esc(label)}'
           f'<tspan font-weight="500" letter-spacing="0" dx="10">{esc(note)}</tspan></text>']
    y += 16
    for i, it in enumerate(items):
        col, row = i % 4, i // 4
        out += card(M + col * (CW + GAP), y + row * (h + 70), *it, h)
    rows = (len(items) + 3) // 4
    return out, y + rows * (h + 70) + 22

def build():
    body, y = [], 0
    body.append(f'<text x="{M}" y="44" font-size="24" font-weight="800" fill="{INK}">Pick a LINE rich menu layout</text>')
    body.append(f'<text x="{M}" y="70" font-size="14" fill="{SUB}">Reply with the code (for example L6 or C3). Letters are the tap areas. Each area can be a link, coupon, text or tab switch.</text>')
    y = 110
    for label, note, items, h in (("LARGE · 2500 × 1686", "about half the chat screen · OA Manager", LARGE, LH),
                                  ("COMPACT · 2500 × 843", "keeps more chat visible · OA Manager", COMPACT, CH),
                                  ("ADVANCED · MESSAGING API", "the client's developers must build these; not possible in OA Manager", API, LH)):
        part, y = section(y, label, note, items, h); body += part
    H = y + 4
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="{FONT}">'
            f'<rect width="{W}" height="{H}" fill="#fff"/>' + "".join(body) + "</svg>\n"), H

def to_png(svg_path, png_path, w, h):
    url = "file://" + os.path.abspath(svg_path)
    here = os.path.dirname(os.path.abspath(__file__))
    js = ("let pw;try{pw=require(process.argv[1]+'/node_modules/playwright')}catch(e){pw=require('playwright')}"
          "(async()=>{const b=await pw.chromium.launch().catch(()=>pw.chromium.launch({channel:'chrome'}));"
          f"const p=await b.newPage({{viewport:{{width:{w},height:{h}}},deviceScaleFactor:2}});await p.goto(process.argv[2]);"
          "await p.screenshot({path:process.argv[3]});await b.close()})()")
    if shutil.which("node") and subprocess.run(["node", "-e", js, here, url, png_path], capture_output=True).returncode == 0: return True
    py = ("import sys\nfrom playwright.sync_api import sync_playwright as s\nwith s() as p:\n b=p.chromium.launch();pg=b.new_page(viewport={'width':%d,'height':%d},device_scale_factor=2)\n"
          " pg.goto(sys.argv[1]);pg.screenshot(path=sys.argv[2]);b.close()") % (w, h)
    return subprocess.run([sys.executable, "-c", py, url, png_path], capture_output=True).returncode == 0

def main():
    a = sys.argv[1:]
    out = a[a.index("--out") + 1] if "--out" in a else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "templates", "richmenu-picker.svg")
    svg, h = build()
    with open(out, "w") as f: f.write(svg)
    print(f"✓ {os.path.normpath(out)}  ({len(svg) // 1024} KB, {W}×{h})")
    if "--png" in a:
        png = os.path.splitext(out)[0] + ".png"
        print(f"✓ {os.path.normpath(png)}" if to_png(out, png, W, h) else "✗ PNG not rendered (no Playwright): share the SVG instead")

if __name__ == "__main__":
    main()
