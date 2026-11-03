#!/usr/bin/env python3
"""
find_images.py · search the web for real photos and build a numbered contact sheet to pick from.

usage:
  python3 find_images.py "iced coffee hand" [--n 12] [--orient portrait|landscape|square] [--out sheet.png]

Sources (all without bot-check circumvention):
  - Wikimedia Commons API            (always, no key)
  - Pexels API    if $PEXELS_API_KEY  (free key: pexels.com/api)
  - Unsplash API  if $UNSPLASH_ACCESS_KEY (free key: unsplash.com/developers)
Prints JSON lines {n, source, url, page, w, h, license, title} and writes a contact sheet
(default ./_image_sheet.png) so Claude/you can LOOK before choosing. Then download with:
  python3 fetch_image.py <url> <project>/assets/<name>.jpg --crop 4:5
Brand sites / news / any page with an og:image also work directly with fetch_image.py.
"""
import json, os, subprocess, sys, tempfile, urllib.parse

UA = "social-mockup-studio/1.0 (internal mockups; contact: team)"

def get(url, headers=()):
    cmd = ["curl", "-sL", "--max-time", "25", "-A", UA] + sum([["-H", h] for h in headers], []) + [url]
    r = subprocess.run(cmd, capture_output=True)
    return r.stdout if r.returncode == 0 else b""

def wikimedia(q, n):
    u = ("https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&format=json"
         "&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1920&gsrlimit=%d&gsrsearch=%s"
         % (n * 2, urllib.parse.quote(q + " filetype:bitmap")))
    try: pages = sorted(json.loads(get(u))["query"]["pages"].values(), key=lambda p: p.get("index", 0))
    except Exception: return []
    out = []
    for p in pages:
        i = p["imageinfo"][0]; m = i.get("extmetadata", {})
        if min(i["width"], i["height"]) < 1000: continue
        out.append({"source": "wikimedia", "url": i.get("thumburl") or i["url"], "thumb": i.get("thumburl"), "page": i["descriptionurl"],
                    "w": i["width"], "h": i["height"], "license": m.get("LicenseShortName", {}).get("value", "?"),
                    "title": p["title"].replace("File:", "")})
    return out

def pexels(q, n, orient):
    k = os.environ.get("PEXELS_API_KEY")
    if not k: return []
    u = "https://api.pexels.com/v1/search?per_page=%d&query=%s%s" % (n, urllib.parse.quote(q), "&orientation=" + orient if orient else "")
    try: d = json.loads(get(u, ["Authorization: " + k]))
    except Exception: return []
    return [{"source": "pexels", "url": p["src"]["original"] + "?auto=compress&w=2000", "thumb": p["src"]["medium"], "page": p["url"],
             "w": p["width"], "h": p["height"], "license": "Pexels License", "title": p.get("alt") or ""} for p in d.get("photos", [])]

def unsplash(q, n, orient):
    k = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not k: return []
    u = "https://api.unsplash.com/search/photos?per_page=%d&query=%s%s" % (n, urllib.parse.quote(q), "&orientation=" + {"square": "squarish"}.get(orient, orient) if orient else "")
    try: d = json.loads(get(u, ["Authorization: Client-ID " + k]))
    except Exception: return []
    return [{"source": "unsplash", "url": r["urls"]["raw"] + "&w=2000&q=85&fm=jpg", "thumb": r["urls"]["small"], "page": r["links"]["html"],
             "w": r["width"], "h": r["height"], "license": "Unsplash License", "title": r.get("alt_description") or ""} for r in d.get("results", [])]

def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    q = a[0]; opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    n, orient, out = int(opt("--n", 12)), opt("--orient"), opt("--out", "_image_sheet.png")
    res = unsplash(q, n, orient) + pexels(q, n, orient) + wikimedia(q, n)
    if orient:
        f = {"portrait": lambda r: r["h"] > r["w"], "landscape": lambda r: r["w"] > r["h"], "square": lambda r: 0.8 < r["w"] / r["h"] < 1.25}[orient]
        res = [r for r in res if f(r)] or res
    res = res[:n]
    for i, r in enumerate(res, 1): r["n"] = i; print(json.dumps(r, ensure_ascii=False))
    if not res: print("no results; try other words, or search the web and use fetch_image.py on a page URL"); return
    from PIL import Image, ImageDraw
    cells = []
    for r in res:
        t = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg").name
        open(t, "wb").write(get(r["thumb"] or r["url"]))
        try: im = Image.open(t).convert("RGB"); im.thumbnail((360, 360)); cells.append(im)
        except Exception: cells.append(Image.new("RGB", (360, 240), (90, 90, 90)))
        os.unlink(t)
    cols = 4; rows = (len(cells) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 370 + 10, rows * 400 + 10), (235, 236, 240)); d = ImageDraw.Draw(sheet)
    for i, (im, r) in enumerate(zip(cells, res)):
        x, y = 10 + (i % cols) * 370, 10 + (i // cols) * 400
        sheet.paste(im, (x, y)); d.rectangle((x, y, x + 34, y + 24), fill=(0, 0, 0)); d.text((x + 8, y + 6), str(r["n"]), fill=(255, 255, 255))
        d.text((x, y + 366), f'{r["source"]} {r["w"]}x{r["h"]} {r["license"][:18]}', fill=(40, 40, 40))
    sheet.save(out); print("sheet:", os.path.abspath(out))

if __name__ == "__main__":
    main()
