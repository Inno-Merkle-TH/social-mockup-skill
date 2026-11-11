#!/usr/bin/env python3
"""
preflight.py · run BEFORE intake. Finds out what this environment can actually do, so the first reply
to the user is honest instead of discovering problems ten turns later.

usage:
  python3 scripts/preflight.py [--brand https://brand.example] [--surfaces line,fb,tiktok] [--project <dir>]

Checks
  render  : Node + Playwright + a launchable Chromium/Chrome (needed for PNG export and visual QA)
  fonts   : macOS? (iPhone text is exact SF Pro + Thonburi only on a Mac)
  network : the brand site (--brand) and the image sources used by find_images.py / fetch_image.py
Prints a summary plus a  TELL THE USER  block to paste into your first reply, and writes
<project>/preflight.json when --project is given (notes.md → Environment should quote it).
Exit code is always 0: this reports, it never blocks.
"""
import json, os, platform, shutil, subprocess, sys
from urllib.parse import urlparse

IMAGE_SOURCES = {"Wikimedia Commons": "https://commons.wikimedia.org/w/api.php?action=query&format=json",
                 "Pexels API": "https://api.pexels.com/v1/", "Unsplash API": "https://api.unsplash.com/",
                 "Unsplash images": "https://images.unsplash.com/"}
NEEDS = {  # what to ask for when we cannot fetch it ourselves
    "line": ["OA profile image / logo (square PNG, ≥ 640×640)", "rich message hero (1040×1040 PNG/JPG, or the size you send with)",
             "rich menu artwork or one photo per tile (2500×1686 large / 2500×843 compact)", "Flex hero photo(s) (≥ 1040 px wide)"],
    "fb": ["page profile logo (square, ≥ 320×320)", "ad creative (1080×1350 4:5, or 1080×1080)"],
    "tiktok": ["profile avatar (square)", "video still / key visual (1080×1920 9:16)"],
}

def run(cmd, timeout=60, env=None):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=env)
        return r.returncode, (r.stdout + r.stderr).strip()
    except Exception as e: return 99, str(e)

def reach(url):
    if not shutil.which("curl"): return False, "no curl"
    code, out = run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L", "--max-time", "10", "-A", "social-mockup-studio/1.0 (preflight)", url], 20)
    if code: return False, {6: "DNS blocked", 7: "connection refused", 28: "timed out", 35: "TLS failed", 56: "blocked by proxy"}.get(code, f"curl error {code}")
    http = int(out[-3:]) if out[-3:].isdigit() else 0
    if http == 0: return False, "no response"
    if http in (403, 407, 451) : return False, f"HTTP {http} (blocked/proxy)"
    return True, f"HTTP {http}"        # 401 from APIs without a key still means reachable

def render_check():
    here = os.path.dirname(os.path.abspath(__file__))
    if not shutil.which("node"): return False, "Node.js not installed"
    js = ("let pw;try{pw=require(process.argv[1]+'/node_modules/playwright')}catch(e){try{pw=require('playwright')}catch(e2){console.log('NO_PLAYWRIGHT');process.exit(0)}}"
          "(async()=>{let b;try{b=await pw.chromium.launch()}catch(e){try{b=await pw.chromium.launch({channel:'chrome'})}catch(e2){console.log('NO_BROWSER '+String(e2).split('\\n')[0]);return}}"
          "await b.close();console.log('OK')})()")
    code, out = run(["node", "-e", js, here], 90)
    if "OK" in out: return True, "Playwright + Chromium launch OK"
    if "NO_PLAYWRIGHT" in out:
        code2, out2 = run([sys.executable, "-c", "from playwright.sync_api import sync_playwright as s\nwith s() as p: p.chromium.launch().close(); print('OK')"], 90)
        if "OK" in out2: return True, "Python Playwright + Chromium OK (use it to screenshot .frame elements)"
        return False, "Playwright not installed (cd scripts && npm install && npx playwright install chromium)"
    return False, "browser cannot start: " + out[-160:]

def main():
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index("--" + k) + 1] if "--" + k in a else d
    brand, surfaces = opt("brand"), [s.strip() for s in (opt("surfaces", "line,fb,tiktok")).split(",") if s.strip()]
    rep = {"os": platform.system(), "mac": platform.system() == "Darwin"}
    rep["render"], rep["render_note"] = render_check()
    net = {}
    if brand:
        if not brand.startswith("http"): brand = "https://" + brand
        net["brand site " + urlparse(brand).netloc] = reach(brand)
    for name, url in IMAGE_SOURCES.items(): net[name] = reach(url)
    rep["network"] = {k: {"ok": v[0], "note": v[1]} for k, v in net.items()}

    print("PREFLIGHT")
    print(f"  render/export : {'✓' if rep['render'] else '✗'} {rep['render_note']}")
    print(f"  iPhone fonts  : {'✓ macOS (real SF Pro + Thonburi)' if rep['mac'] else '⚠ not macOS: iOS text uses Inter as a stand-in'}")
    for k, v in rep["network"].items(): print(f"  {k:28s}: {'✓' if v['ok'] else '✗'} {v['note']}")

    tell = []
    if not rep["render"]:
        tell.append("I can't render or screenshot anything in this environment (no working browser), so I can't export PNGs or visually check the screens here. "
                    "I'll deliver a single HTML file you open in Chrome plus the project ZIP, and I'll list every visual detail I couldn't verify. "
                    "For checked, client-ready PNGs, run the export on a Mac with Claude Code.")
    if not rep["mac"] and rep["render"]:
        tell.append("This machine isn't a Mac, so iPhone screens will use Inter instead of Apple's SF Pro. Fine for review; re-export on a Mac for final files.")
    blocked_brand = [k for k, v in rep["network"].items() if k.startswith("brand") and not v["ok"]]
    blocked_img = [k for k, v in rep["network"].items() if not k.startswith("brand") and not v["ok"]]
    if blocked_brand or len(blocked_img) == len(IMAGE_SOURCES):
        what = []
        for s in surfaces: what += NEEDS.get(s, [])
        where = (urlparse(brand).netloc if blocked_brand else "the image sites")
        tell.append(f"I can't reach {where} from here, so I can't download the brand's images myself. I won't build with made-up artwork. Please either "
                    "(a) upload these files: " + "; ".join(what) + ", plus the logo, brand colours (hex) and the exact CTA wording, or "
                    f"(b) allow {where} in your network settings (Claude app: Settings → Capabilities → code execution / allowed domains, or ask your admin), then tell me to retry.")
    elif blocked_img:
        tell.append("Some image sources are blocked (" + ", ".join(blocked_img) + "); I'll use the others, or you can upload photos.")
    rep["tell_user"] = tell
    print("\nTELL THE USER (first reply):" if tell else "\nAll clear: no environment caveats to report.")
    for t in tell: print("  • " + t)
    if opt("project"):
        os.makedirs(opt("project"), exist_ok=True)
        with open(os.path.join(opt("project"), "preflight.json"), "w") as f: json.dump(rep, f, indent=2, ensure_ascii=False)
        print(f"\n→ {os.path.join(opt('project'), 'preflight.json')}")

if __name__ == "__main__":
    main()
