#!/usr/bin/env python3
"""
bundle.py · turn a mockup project into ONE self-contained HTML file (opens by double-click, no server).

usage:
  python3 scripts/bundle.py <project-dir> [--page index.html] [--out <file.html>] [--max-px 1600 | 0] [--no-verify]

What it inlines:
  - <link rel="stylesheet">  → <style>, following @import, with every url(...) turned into a data: URI
  - <script src>             → inline <script>  ("</script" inside the code is escaped)
  - kit/icons.svg            → inlined once after <body> (marked data-kit-sprite, so kit.js skips its fetch)
  - <img src>, style="…url()", <style> blocks, and quoted "--brand-logo-src" paths → data: URIs

Safety checks (the bundle FAILS, exit 1, if any of these fail):
  1. every inline <script> passes `node --check` (catches escaping bugs that would kill kit.js)
  2. every <use href="#id"> has a matching <symbol id> in the inlined sprite or page
  3. no local file reference is left un-inlined (missing files are listed)
  4. --verify (default when a browser is available): opens the bundle headless and checks that
     every .sb (status bar) is filled, every <use> icon resolves, no JS errors, data-ready=1.
     If no browser exists, it prints  NOT RENDER-VERIFIED  and you must tell the user.

Why this exists: an ad-hoc bundler once used re.sub() with a replacement STRING; Python turned the
"\\n" inside the icon sprite into a real newline, kit.js died with a SyntaxError, and the mockup lost
its status bar and every icon. Every re.sub below uses a lambda replacement, so backslashes in
CSS/JS/SVG are never interpreted.
"""
import base64, json, mimetypes, os, re, shutil, subprocess, sys, tempfile
from urllib.parse import unquote

MIME = {".woff2": "font/woff2", ".woff": "font/woff", ".otf": "font/otf", ".ttf": "font/ttf", ".svg": "image/svg+xml",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}
missing, inlined = [], {"css": 0, "js": 0, "img": 0, "font": 0}

def is_local(ref):
    return ref and not re.match(r"^(data:|https?:|//|#|about:|blob:|mailto:|javascript:)", ref.strip(), re.I)

MAX_PX = 1600   # --max-px: photos are shown at most ~1206 px wide (402 pt × 3), bigger only bloats the file

def shrink(path, mt):
    if not MAX_PX or mt not in ("image/jpeg", "image/png", "image/webp"): return None
    try:
        from PIL import Image
        import io
        im = Image.open(path)
        if max(im.size) <= MAX_PX: return None
        im.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS); buf = io.BytesIO()
        if im.mode in ("RGBA", "LA", "P") and mt != "image/jpeg": im.save(buf, "PNG", optimize=True); return "image/png", buf.getvalue()
        im.convert("RGB").save(buf, "JPEG", quality=86, optimize=True); return "image/jpeg", buf.getvalue()
    except Exception: return None

def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    mt = MIME.get(ext) or mimetypes.guess_type(path)[0] or "application/octet-stream"
    small = shrink(path, mt)
    if small: mt, raw = small
    else:
        with open(path, "rb") as f: raw = f.read()
    inlined["font" if mt.startswith("font/") else "img"] += 1
    return f"data:{mt};base64,{base64.b64encode(raw).decode()}"

def resolve(ref, base_dir):
    p = os.path.normpath(os.path.join(base_dir, unquote(ref.split("#")[0].split("?")[0])))
    if not os.path.isfile(p): missing.append(os.path.relpath(p)); return None
    return p

def css_inline(css, base_dir, seen=()):
    css = re.sub(r"/\*.*?\*/", lambda m: "", css, flags=re.S)   # commented-out @font-face etc. must not count as references
    # @import url("x.css") / @import "x.css"
    def imp(m):
        ref = m.group(2)
        if not is_local(ref): return m.group(0)
        p = resolve(ref, base_dir)
        if not p or p in seen: return ""
        with open(p, encoding="utf-8") as f: inner = f.read()
        return css_inline(inner, os.path.dirname(p), seen + (p,))
    css = re.sub(r'@import\s+(?:url\()?\s*(["\']?)([^"\')\s;]+)\1\s*\)?\s*;', lambda m: imp(m), css)
    def url(m):
        q, ref = m.group(1), m.group(2)
        if not is_local(ref): return m.group(0)
        p = resolve(ref, base_dir)
        return f'url("{data_uri(p)}")' if p else m.group(0)
    css = re.sub(r'url\(\s*(["\']?)([^"\')]+)\1\s*\)', lambda m: url(m), css)
    return css

def page_paths_in_vars(css, page_dir):
    # --brand-logo-src: "brand/logo.svg"  (a page-relative path stored as a string, read by kit.js)
    def rep(m):
        ref = m.group(3)
        if not is_local(ref) or os.path.splitext(ref)[1].lower() not in MIME: return m.group(0)
        p = resolve(ref, page_dir)
        return f'{m.group(1)}{m.group(2)}{data_uri(p)}{m.group(2)}' if p else m.group(0)
    return re.sub(r'(--[\w-]*src\s*:\s*)(["\'])([^"\']+)\2', lambda m: rep(m), css)

def bundle(project, page="index.html", out=None):
    page_path = os.path.join(project, page); page_dir = os.path.dirname(os.path.abspath(page_path))
    with open(page_path, encoding="utf-8") as f: html = f.read()
    sprite_path = None

    def link(m):
        tag = m.group(0)
        if not re.search(r'rel\s*=\s*["\']?stylesheet', tag, re.I): return tag
        href = re.search(r'href\s*=\s*["\']([^"\']+)', tag)
        if not href or not is_local(href.group(1)): return tag
        p = resolve(href.group(1), page_dir)
        if not p: return tag
        with open(p, encoding="utf-8") as f: css = f.read()
        inlined["css"] += 1
        css = page_paths_in_vars(css_inline(css, os.path.dirname(p)), page_dir)
        return f'<style data-from="{os.path.relpath(p, page_dir)}">\n{css}\n</style>'
    html = re.sub(r'<link\b[^>]*>', lambda m: link(m), html, flags=re.I)

    def script(m):
        nonlocal sprite_path
        src = m.group(1)
        if not is_local(src): return m.group(0)
        p = resolve(src, page_dir)
        if not p: return m.group(0)
        with open(p, encoding="utf-8") as f: js = f.read()
        inlined["js"] += 1
        cand = os.path.join(os.path.dirname(p), "icons.svg")
        if os.path.basename(p) == "kit.js" and os.path.isfile(cand): sprite_path = cand
        js = js.replace("</script", "<\\/script")
        return f'<script data-from="{os.path.relpath(p, page_dir)}">\n{js}\n</script>'
    html = re.sub(r'<script\b[^>]*\bsrc\s*=\s*["\']([^"\']+)["\'][^>]*>\s*</script>', lambda m: script(m), html, flags=re.I)

    # page <style> blocks and inline style attributes
    html = re.sub(r'(<style\b[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + page_paths_in_vars(css_inline(m.group(2), page_dir), page_dir) + m.group(3), html, flags=re.S | re.I)
    html = re.sub(r'(\sstyle\s*=\s*")([^"]*)(")', lambda m: m.group(1) + css_inline(m.group(2), page_dir).replace('"', "'") + m.group(3), html, flags=re.I)
    def img(m):
        ref = m.group(3)
        if not is_local(ref): return m.group(0)
        p = resolve(ref, page_dir)
        return f'{m.group(1)}{m.group(2)}{data_uri(p)}{m.group(2)}' if p else m.group(0)
    html = re.sub(r'(<(?:img|source)\b[^>]*?\ssrc\s*=\s*)(["\'])([^"\']+)\2', lambda m: img(m), html, flags=re.I)

    if sprite_path:
        with open(sprite_path, encoding="utf-8") as f: svg = f.read().strip()
        svg = re.sub(r'^<\?xml[^>]*>\s*', "", svg)
        svg = re.sub(r'<svg\b', lambda m: '<svg data-kit-sprite="1"', svg, count=1)
        html = re.sub(r'(<body\b[^>]*>)', lambda m: m.group(1) + "\n" + svg + "\n", html, count=1, flags=re.I)

    out = out or os.path.join(project, "dist", os.path.basename(os.path.abspath(project)) + ".html")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f: f.write(html)
    return out, html

def check_scripts(html):
    scripts = re.findall(r'<script\b(?![^>]*\bsrc=)[^>]*>(.*?)</script>', html, flags=re.S | re.I)
    node = shutil.which("node")
    if not node: return ["node not found: inline scripts NOT syntax-checked (install Node, or check by opening the file)"], False
    errs = []
    for i, js in enumerate(scripts):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t: t.write(js); tp = t.name
        r = subprocess.run([node, "--check", tp], capture_output=True, text=True); os.unlink(tp)
        if r.returncode:
            lines = r.stderr.strip().splitlines()
            err = next((l for l in lines if "Error" in l), lines[-1] if lines else "?").strip()
            loc = next((l for l in lines if l.startswith(tp + ":")), "").replace(tp + ":", "line ")
            errs.append(f"script #{i + 1} fails node --check: {err} ({loc})")
    return errs, True

def check_icons(html):
    html = re.sub(r'<script\b[^>]*>.*?</script>', lambda m: "", html, flags=re.S | re.I)   # comments in kit.js mention <use href="#id">
    ids = set(re.findall(r'<symbol\b[^>]*\bid\s*=\s*["\']([^"\']+)', html)) | set(re.findall(r'\bid\s*=\s*["\']([^"\']+)', html))
    used = set(re.findall(r'<use\b[^>]*\bhref\s*=\s*["\']#([^"\']+)', html))
    return sorted(used - ids), len(used)

VERIFY_JS = r"""
const { chromium } = require(process.env.PW_PATH || "playwright");
(async () => {
  let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ channel: "chrome" }); }
  const pg = await b.newPage(); const errs = [];
  pg.on("pageerror", e => errs.push("JS error: " + e.message));
  pg.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
  await pg.goto("file://" + process.argv[2]);
  try { await pg.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 20000 }); }
  catch { errs.push("kit.js never finished (html[data-ready] not set) - it probably crashed"); }
  const r = await pg.evaluate(() => {
    const sb = [...document.querySelectorAll(".sb")], empty = sb.filter(s => !s.textContent.trim() && !s.querySelector("svg")).length;
    const uses = [...document.querySelectorAll("use")], bad = uses.map(u => (u.getAttribute("href") || u.getAttribute("xlink:href") || "")).filter(h => h.startsWith("#") && !document.getElementById(h.slice(1)));
    return { sb: sb.length, sbEmpty: empty, uses: uses.length, badUses: [...new Set(bad)], issues: window.__kitIssues || [] };
  });
  console.log(JSON.stringify({ ...r, errs })); await b.close();
})().catch(e => { console.log(JSON.stringify({ fatal: String(e) })); process.exit(0); });
"""

def find_playwright():
    here = os.path.dirname(os.path.abspath(__file__))
    for p in [os.path.join(here, "node_modules", "playwright"), os.environ.get("PW_PATH", "")]:
        if p and os.path.isdir(p): return p
    r = subprocess.run(["node", "-e", "console.log(require.resolve('playwright'))"], capture_output=True, text=True) if shutil.which("node") else None
    return os.path.dirname(r.stdout.strip()) if r and r.returncode == 0 else None

def verify(out):
    pw = find_playwright()
    if not shutil.which("node") or not pw: return None
    with tempfile.NamedTemporaryFile("w", suffix=".cjs", delete=False) as t: t.write(VERIFY_JS); tp = t.name
    try:
        r = subprocess.run(["node", tp, os.path.abspath(out)], capture_output=True, text=True, timeout=90, env={**os.environ, "PW_PATH": pw})
        line = (r.stdout.strip().splitlines() or ["{}"])[-1]
        return json.loads(line)
    except Exception as e: return {"fatal": str(e)}
    finally: os.unlink(tp)

def main():
    a = sys.argv[1:]
    if not a or a[0].startswith("-"): print(__doc__); sys.exit(1)
    opt = lambda k, d=None: a[a.index("--" + k) + 1] if "--" + k in a else d
    global MAX_PX; MAX_PX = int(opt("max-px", MAX_PX))
    out, html = bundle(a[0], opt("page", "index.html"), opt("out"))
    fails = []
    if missing: fails.append("missing files (not inlined): " + ", ".join(sorted(set(missing))))
    errs, checked = check_scripts(html)
    (fails if checked else []).extend(errs)
    if not checked: print("⚠ " + errs[0])
    bad, n_use = check_icons(html)
    if bad: fails.append(f"{len(bad)} icon id(s) used but not in the sprite: " + ", ".join("#" + b for b in bad[:12]))
    print(f"→ {out}  ({os.path.getsize(out) / 1e6:.1f} MB; inlined {inlined['css']} css, {inlined['js']} js, {inlined['img']} images, {inlined['font']} fonts; {n_use} icon uses)")
    if "--no-verify" not in a:
        v = verify(out)
        if v is None: print("⚠ NOT RENDER-VERIFIED: no Node+Playwright/Chrome here. Tell the user the bundle was only checked statically.")
        elif v.get("fatal"): print("⚠ NOT RENDER-VERIFIED: browser could not start (" + v["fatal"][:160] + "). Tell the user.")
        else:
            if v["sbEmpty"]: fails.append(f"{v['sbEmpty']} of {v['sb']} status bars (.sb) rendered EMPTY")
            if v["badUses"]: fails.append("icons that render empty: " + ", ".join(v["badUses"][:12]))
            fails += v["errs"]
            if not fails: print(f"✓ render-verified: {v['sb']} status bars filled, {v['uses']} icons resolve, no JS errors")
            for iss in v["issues"]: print("  ⚠ kit QA: " + (iss if isinstance(iss, str) else iss.get("msg", str(iss))))
    if fails:
        print("✗ BUNDLE FAILED:\n  - " + "\n  - ".join(fails)); sys.exit(1)
    print("✓ static checks passed (scripts parse, every icon id exists, no missing files)")

if __name__ == "__main__":
    main()
