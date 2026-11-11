# Image sourcing

Mockups are internal/pitch material, so images may come from anywhere on the web. Still: **log every source** (credits.json does it automatically) so the team can swap in licensed or client assets before anything is published.

## Order of preference
1. **User-supplied** (brief, client drive, previous campaign).
2. **Brand's own site / press kit / official social**: real products, correct colours/packaging. `fetch_image.py <product-page-url>` grabs the page's main (og:image) photo.
3. **Find online (Claude does it)**:
   - `python3 scripts/find_images.py "iced latte hand" --orient portrait --n 12 --out /tmp/sheet.png` searches Wikimedia Commons (no key) + Pexels/Unsplash official APIs when `PEXELS_API_KEY` / `UNSPLASH_ACCESS_KEY` are set (free keys; add them to your shell profile for much better ad-grade photos). **Open the sheet and look** before choosing: pick photos that look like professional ad photography, with good light, a clean background and the subject filling the frame.
   - Or web-search (WebSearch) for a page with the right photo (retailer, news, blog, brand IG/FB) and pass the page URL to fetch_image.py.
4. **Placeholders** (`.ph-img`) only if the user explicitly asks.

## Download + crop
`python3 scripts/fetch_image.py <page-or-image-url> <project>/assets/<name>.jpg --crop <ratio> [--min 1200]`
| Placement | --crop | min short side |
|---|---|---|
| FB/IG feed | 4:5 (or 1:1) | 1080 |
| FB carousel, LINE square image | 1:1 | 1080 |
| LINE Flex hero | 1.91:1 or 20:13 | 900 |
| Stories / Reels / TikTok | 9:16 | 1080 |
| Desktop rail thumb | 1:1 | 600 |
The script rejects images that are too small (blurry = fake) and never bypasses bot checks/CAPTCHAs. If a site shows "checking your browser", use another source or that site's official API.

## Making the creative look like a real ad
- Photo fills the media area (`object-fit: cover`); keep the product in the safe zone (TikTok/Stories: centre band).
- Add only what real brands add: a small logo mark (`.ad-logo`), one offer/price tag (`.ad-tag`, `.ad-price`), maybe a one-line headline on Stories. Real ads rarely put more than 6–8 words on the image.
- TikTok: add text the way creators do: `.tt-sticker` (white on black box) or `.tt-sticker.plain` (white with shadow).
- Use people/hands holding the product for UGC/Spark ads; product-on-table for brand feed ads; lifestyle for Stories.
- Avoid images with visible third-party logos, watermarks or readable faces of public figures; pick another.

## Gallery demo
`templates/stock/` holds the demo photos (Wikimedia Commons, CC0/CC BY/CC BY-SA). Sources are in `templates/stock/credits.json`.
