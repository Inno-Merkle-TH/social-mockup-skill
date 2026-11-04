---
name: social-mockup-studio
description: Build realistic, client-ready mockups of LINE (OA chat, Flex messages, rich menus, push notifications), Facebook (feed, carousel, Stories/Reels ads) and TikTok (For You in-feed, Spark Ads) on iOS, Android and desktop, for any brand, exported as high-res transparent PNGs plus an overview board. Use this whenever someone wants to show how a campaign, CRM journey, ad, chatbot or LINE OA flow will look on a phone or desktop. That includes "mock up this LINE message", "show the FB ad on iPhone", "make a TikTok ad preview", "visualise the CRM journey", "rich menu per segment", "pitch visuals for social", or a sketch/brief of social screens, even if they never say the word "mockup".
---

# Social Mockup Studio

Turns a brief into pixel-faithful mockups of LINE, Facebook and TikTok screens, for any brand, on iOS, Android or desktop. The kit separates two things that must never mix:

- **Platform chrome** (status bar, LINE header, FB tab bar, TikTok rail…) lives in `assets/kit.css`. It always looks like the real app, never like the brand.
- **Brand content** (Flex messages, rich menu art, ad creative, avatar, CTA style) is driven only by `<project>/brand.css` variables.

Swapping brands = swapping `brand.css` + images + copy. That is what makes results apple-to-apple across brands.

## Workflow

0. **Preflight (before the first question).** Run `python3 scripts/preflight.py --brand <brand site> --surfaces <line,fb,tiktok>`. Put its **TELL THE USER** lines in your first reply:
   - **No browser:** say that nothing can be rendered, exported or visually checked here.
   - **Brand site or image sources blocked:** say so, name the exact files to upload (logo, rich message hero, tile images…, plus brand hex colours and CTA wording), or ask the user to allow the domain.
   - **Never** build with made-up artwork to fill the gap.
   - Copy the result into notes.md → Environment.
1. **Intake (ask, don't guess).** Read `references/intake.md` and ask the questions in rounds with AskUserQuestion. For every LINE chat screen, always ask whether the rich menu is open (open / collapsed / none) and whether to show only the new message (top-anchored) or the previous messages too. For LINE, always ask **rich message, Flex, or both** (Q3c, with the visual comparison from `references/line.md`). Ask early for the logo, the brand colours (hex) and the exact CTA wording. Record every answer in `notes.md` → Brief, and every guess in → Assumptions to confirm. Only skip a question if the user already answered it or a sensible default is listed. Never invent offers, prices, dates, loyalty programs or product claims. Ask, or mark them as placeholders.
2. **Scaffold.** `bash scripts/new_project.sh <path/to/project-name>` → copies the kit, a starter `index.html`, `brand.css` and `notes.md`.
3. **Brand + images.** Fill `brand.css` from the intake. Put licensed fonts in `brand/fonts/` and the logo (one-colour mark for avatars) in `brand/`.
   **Clean every upload first:** `python3 scripts/clean_image.py <files> --for <placement> --edges /tmp/edges.png`. It trims white edge strips and logs them to `assets/clean-log.txt`, checks the size against `references/line-image-sizes.md`, and writes an edge sheet. Open the sheet and look at it. A rich message is 1040×1040 unless the user confirms another OA Manager size. Any platform limit you quote needs two or more sources; if they conflict, say so and pick the safest.
   Every image slot gets a **real photo**. CSS gradients or placeholder text in place of photography is what makes a mockup look fake. Follow `references/image-sourcing.md`:
   user-supplied → brand website/press kit → find online (`scripts/find_images.py "<query>" --orient portrait` builds a contact sheet you look at; then `scripts/fetch_image.py <url> assets/<name>.jpg --crop 4:5`). You can also web-search any page (news, retailer, brand social) and pass its URL to fetch_image.py; it reads the page's main image. Each download is logged in `assets/credits.json`.
4. **Build shots.** The gallery has one example per surface, not every surface × OS combination (see the matrix below). Copy the closest block from `templates/gallery.html` into `index.html`, then switch the device using `references/devices.md`: swap `.dev.android` ↔ `.dev.ios` and apply that OS's chrome differences (e.g. FB tabs top ↔ bottom tab bar). Edit copy and images. Platform specifics are in `references/line.md`, `facebook.md`, `tiktok.md`.
   - Give every shot a unique `data-shot` id; it becomes the file name. Per-shot CSS may be scoped with `[data-shot="id"]`.
   - Name project classes with a project prefix (e.g. `.sb-hero`, not `.kv`/`.hero`) so they never collide with kit classes.
   - **Fonts and ratios (read `references/typography-and-ratios.md`):** text the app draws (bubbles, Flex, post copy, CTA buttons, captions) is always the platform font, so never put `--brand-head`/`--brand-body` on it. Brand fonts go only inside images. Media boxes take a ratio, never a fixed height: FB feed 4:5, carousel 1:1, Stories/Reels/TikTok 9:16, LINE rich message 1040×1040 by default (other sizes only after confirmation, see `references/line-image-sizes.md`; edge-to-edge geometry is UNVERIFIED), Flex hero 20:13.
   - **Never drop, shorten or move brief content to make it fit** (e.g. removing the text bubble so a square image fits with the menu open, or bottom-anchoring a "new message only" chat). Tell the user and offer options: a compact menu, shorter text, or an extra screen with the menu collapsed.
   - Kit details marked UNVERIFIED (currently the rich message margin, radius and width in `references/line.md`) go in notes.md → Unverified and in your delivery message.
   - Thai copy: wrap prices, dates, units and final particles in `<span style="white-space:nowrap">` so lines never end with an orphan "ค่ะ", "ml" or a split word.
5. **Export (on a Mac, so iOS text renders in real SF Pro + Thonburi).** `node scripts/export.cjs <project>` (first time on a machine: `cd scripts && npm install`; it falls back to the installed Google Chrome if Playwright's browser isn't downloaded). It serves only the project folder. → `captures/NN-<shot-id>.png` (3× phones, 2× desktop, transparent), `00-overview.png`, `qa.json`. Fix every failed request and QA issue it prints.
   - **If the export can't run here** (Claude app / Cowork sandbox without Node, Playwright or internet): try `cd scripts && npm install && npx playwright install chromium` once. If that still fails, try Python (`pip install playwright && python -m playwright install chromium`) and screenshot each `.frame` at 3× yourself. As the last resort, run `python3 scripts/bundle.py <project>` to make **one self-contained HTML** (`dist/<name>.html`, which opens by double-click). Deliver it with the project ZIP, and tell the user plainly: "I couldn't render anything here, so these screens haven't been visually checked. Open the HTML in Chrome; to save a screen, right-click → Inspect → Capture node screenshot on the phone frame, or run the export on a Mac." Then list the unverified details. Never present an unrendered result as checked, and never stop with nothing to show.
   - **Single-file HTML:** always build it with `scripts/bundle.py`, never with an ad-hoc script. It syntax-checks every inline script (`node --check`), fails if any icon id or file is missing, and when a browser exists it confirms status bars and icons render. An ad-hoc bundler once corrupted the icon sprite and killed kit.js, leaving no status bar or icons.
   - Off macOS, iOS text uses Inter instead of SF Pro (kit.js swaps it in). Say so in notes.md, and offer a Mac re-export for final client files.
6. **Review like a client would.** Open every PNG at full size (not just the overview) and run `references/qa-checklist.md`. Fill in notes.md → "Pre-delivery check against the Brief" for every shot: all brief copy present, anchoring, menu state and message format as asked, nothing removed. Put your mockup side by side with a real device capture from `references/screens/device/` (or ask the user for fresh phone screenshots of the same surface). Platform UIs change every few months, and a real capture is the only ground truth.
7. **Record and deliver honestly.** Update `notes.md`: placeholders, assumptions, unverified details, image sources and cleaning log, timeline. The delivery message must contain:
   (a) the file paths;
   (b) **what was and wasn't checked**, e.g. "rendered and checked at 100%" vs "not rendered here";
   (c) **Assumptions to confirm**, as a short list (first delivery especially);
   (d) **Unverified details**;
   (e) any brief item you couldn't fit, with the options you're offering.

### Gallery matrix (✓ = ready-made shot; others = adapt from the same row)

| Surface | Android | iOS | Desktop |
|---|---|---|---|
| LINE OA chat + Flex | ✓ dark | ✓ light | – (not in kit yet) |
| LINE rich menu (12 OA Manager templates + custom + tabs) | ✓ dark L6, ✓ tabbed | ✓ large L4b, ✓ compact C2l | – (not shown on LINE PC) |
| LINE push / lock screen | adapt (`.android .notif`) | ✓ | – |
| FB feed single image | ✓ light | ✓ dark | ✓ |
| FB carousel | adapt | ✓ light | adapt |
| FB Stories/Reels | adapt | ✓ | – |
| TikTok in-feed / Spark / product card | ✓ in-feed | ✓ Spark, ✓ product card | ✓ |

## Realism rules (learned the hard way)

Read `references/realism-rules.md` once per project. The short version:

- Platform chrome is never brand-coloured. LINE headers, FB/TikTok UI stay native.
- One coherent timeline across every screen (teaser → launch → pre-order → on-sale → sustain). Dates, days of week, countdowns and "valid until" must agree. Check the weekday of every date.
- Don't invent benefits (points, membership tiers, free gifts) the brand doesn't run. If the brief doesn't say it, it's a placeholder or a question.
- Content anchors where the real app anchors it. A fresh LINE thread starts at the top; a long one is bottom-aligned (`.ln-msgs.bottom`). Big empty voids look fake.
- Images must read at phone size. A product thumbnail under ~60 px is invisible, so crop tighter or go bigger.
- Use plausible numbers (likes, comments, times, battery) and keep status-bar times consistent with the story (a 07:30 push shouldn't show 21:14).
- A LINE rich menu is one designed image (2500×1686 or 2500×843), not native UI tiles. Design it as artwork.

## When something isn't in the kit

Build it in the project's `index.html` `<style>` using the same conventions (platform vs brand variables). If it's reusable (a new surface like LINE VOOM, FB Messenger, TikTok TopView), add it to `assets/kit.css` + `templates/gallery.html` and mention it so the team can upstream it.

## Files

| Path | What |
|---|---|
| `assets/kit.css`, `kit.js`, `icons.svg`, `fonts/` | the kit (copied into each project as `kit/`) |
| `templates/gallery.html` | every surface × OS, copy blocks from here |
| `templates/brand.example.css` | brand variables with comments |
| `templates/index.starter.html`, `notes.template.md` | project starters |
| `scripts/new_project.sh` | scaffold a project |
| `scripts/preflight.py` | step 0: can we render? is it a Mac? are the brand site and image sources reachable? prints what to tell the user |
| `scripts/clean_image.py` | trim white edges from uploads (logged), size check per placement, edge-zoom QA sheet |
| `scripts/bundle.py` | one self-contained HTML (CSS/JS/fonts/images/sprite inlined), with syntax, icon and render checks |
| `references/line-image-sizes.md` | LINE rich message / rich menu / Flex / image sizes per sending route, with sources and conflicts |
| `scripts/find_images.py`, `fetch_image.py` | find real photos online (contact sheet) · download + crop + log source |
| `references/image-sourcing.md` | where images come from, crops per placement, ad-craft rules |
| `scripts/export.cjs` | render + QA (needs `npm install` in `scripts/` once) |
| `references/intake.md` | the question rounds + defaults |
| `references/line.md`, `facebook.md`, `tiktok.md` | anatomy, limits, class map per platform |
| `references/devices.md` | frames, status bars, OS differences |
| `references/realism-rules.md`, `qa-checklist.md`, `localization-th.md` | quality bars |
| `references/screens/` | dated real-app screenshots + `calibrate/` replicas |
| `references/typography-and-ratios.md` | which font every platform really uses, measured sizes, media ratios |
| `scripts/calibrate.cjs` | overlay a kit replica on a real screenshot (side/blend/diff + per-band score) |
