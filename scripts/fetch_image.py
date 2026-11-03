#!/usr/bin/env python3
"""
fetch_image.py · download a real photo for a mockup and log where it came from.

usage:
  python3 fetch_image.py <page-or-image-url> <project>/assets/<name>.jpg [--min 1200] [--crop 4:5|1:1|9:16|16:9] [--width 2000]

- <url> may be an image URL or any web page (Unsplash/Pexels/brand site/news…): the page's
  og:image / twitter:image / largest <img> is used. Unsplash & Pexels URLs are upgraded to high-res.
- Rejects images smaller than --min px on the short side (blurry assets look fake).
- --crop centre-crops to the placement's ratio (FB feed 4:5, carousel 1:1, Stories/TikTok 9:16).
- Appends {file, source_page, image_url, title, fetched} to <project>/assets/credits.json.
  Mockups are internal/pitch material; credits.json makes it easy to swap in licensed
  or client-supplied images before anything is published.
Uses curl (works behind corporate SSL inspection where Python's urllib fails) + Pillow.
"""
import json, os, re, subprocess, sys, datetime, html, tempfile
from urllib.parse import urljoin, urlparse, urlencode, parse_qsl, urlunparse

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"

def curl(url, out=None):
    # Wikimedia asks for an honest UA (it serves an error image to fake browser UAs)
    ua = "social-mockup-studio/1.0 (internal mockups)" if "wikimedia.org" in url else UA
    url = re.sub(r"[?&]utm_[^&]+", "", url).replace("?&", "?").rstrip("?")
    cmd = ["curl", "-sL", "--max-time", "60", "--retry", "4", "--retry-delay", "4", "-A", ua, "-w", "\n%{http_code}", url]
    if out: cmd[1:1] = ["-o", out]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode: raise SystemExit(f"download failed ({r.returncode}): {url}")
    body, _, code = r.stdout.rpartition(b"\n")
    if code.strip().isdigit() and int(code) >= 400:
        raise SystemExit(f"HTTP {int(code)} for {url}" + ("  (rate-limited: wait a minute, or use a 1920px thumb)" if int(code) == 429 else ""))
    return body

def hi_res(u, width):
    p = urlparse(u)
    if "commons.wikimedia.org" in p.netloc and "Special:FilePath" in p.path:
        q = dict(parse_qsl(p.query)); q["width"] = "1920" if width >= 1920 else str(width)   # standard thumb bucket, not rate-limited originals
        return urlunparse(p._replace(query=urlencode(q)))
    if "images.unsplash.com" in p.netloc or "images.pexels.com" in p.netloc:
        q = dict(parse_qsl(p.query)); q.update({"w": str(width), "q": "85", "fm": "jpg", "fit": "max"})
        q.pop("h", None); q.pop("crop", None); q.pop("dpr", None)
        return urlunparse(p._replace(query=urlencode(q)))
    return u

def find_image(page_url, body):
    s = body.decode("utf-8", "ignore")
    title = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)', s) or re.search(r"<title>([^<]+)", s)
    for pat in [r'<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)',
                r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
                r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)']:
        m = re.search(pat, s)
        if m: return urljoin(page_url, html.unescape(m.group(1))), html.unescape(title.group(1)).strip() if title else ""
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+\.(?:jpe?g|png|webp)[^"\']*)', s, re.I)
    if imgs: return urljoin(page_url, html.unescape(imgs[0])), html.unescape(title.group(1)).strip() if title else ""
    raise SystemExit("no image found on page; pass a direct image URL instead")

def main():
    a = sys.argv[1:]
    if len(a) < 2: print(__doc__); sys.exit(1)
    url, out = a[0], a[1]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    minpx, crop, width = int(opt("--min", 1200)), opt("--crop"), int(opt("--width", 2000))
    from PIL import Image
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".img").name
    page, title, img_url = None, "", url
    body = curl(url)
    is_img = body.startswith(b"\xff\xd8") or body.startswith(b"\x89PNG") or (body[:4] == b"RIFF" and body[8:12] == b"WEBP")
    if is_img and hi_res(url, width) == url:
        open(tmp, "wb").write(body)
    else:
        if not is_img:
            low = body[:20000].decode("utf-8", "ignore").lower()
            if any(k in low for k in ("checking your browser", "just a moment", "cf-challenge", "captcha", "anubis")):
                raise SystemExit("blocked by a bot check on this site, so it is not bypassed. Use find_images.py, the site's official API, or another page.")
            page = url; img_url, title = find_image(url, body)
        img_url = hi_res(img_url, width)
        curl(img_url, tmp)
    im = Image.open(tmp); im.load(); im = im.convert("RGB")
    if min(im.size) < minpx:
        os.unlink(tmp); raise SystemExit(f"✗ only {im.size[0]}×{im.size[1]} (short side < {minpx}px): not saved. Pick another image or lower --min.")
    if crop:
        rw, rh = map(float, crop.split(":")); W, H = im.size
        if W / H > rw / rh: nw = int(H * rw / rh); im = im.crop(((W - nw) // 2, 0, (W - nw) // 2 + nw, H))
        else: nh = int(W * rh / rw); im = im.crop((0, (H - nh) // 2, W, (H - nh) // 2 + nh))
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    im.save(out, quality=88, optimize=True); os.unlink(tmp)
    cred = os.path.join(os.path.dirname(os.path.abspath(out)), "credits.json")
    data = json.load(open(cred)) if os.path.exists(cred) else []
    data = [d for d in data if d.get("file") != os.path.basename(out)]
    data.append({"file": os.path.basename(out), "source_page": page, "image_url": img_url, "title": title,
                 "size": list(im.size), "fetched": datetime.date.today().isoformat()})
    json.dump(data, open(cred, "w"), indent=2, ensure_ascii=False)
    print(f"✓ {out}  {im.size[0]}×{im.size[1]}  ← {page or img_url}")

if __name__ == "__main__":
    main()
