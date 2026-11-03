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

1. **Intake (ask, don't guess).** Read `references/intake.md` and ask the questions in rounds with AskUserQuestion. Only skip a question if the user already answered it or a sensible default is listed. Never invent offers, prices, dates, loyalty programs or product claims. Ask, or mark them as placeholders.
2. **Scaffold.** `bash scripts/new_project.sh <path/to/project-name>` → copies the kit, a starter `index.html`, `brand.css` and `notes.md`.
3. **Brand.** Fill `brand.css` from the intake. Put licensed fonts in `brand/fonts/`, logo (one-colour mark for avatars) in `brand/`, product/KV images in `assets/`. If allowed to fetch from the brand's site, download the highest resolution available (≥2× display size) and keep the source URL in notes.md.
4. **Build shots.** The gallery has one example per surface, not every surface × OS combination (see the matrix below). Copy the closest block from `templates/gallery.html` into `index.html`, then switch the device using `references/devices.md`: swap `.dev.android` ↔ `.dev.ios` and apply that OS's chrome differences (e.g. FB tabs top ↔ bottom tab bar). Edit copy and images. Platform specifics are in `references/line.md`, `facebook.md`, `tiktok.md`.
   - Give every shot a unique `data-shot` id; it becomes the file name. Per-shot CSS may be scoped with `[data-shot="id"]`.
   - Name project classes with a project prefix (e.g. `.sb-hero`, not `.kv`/`.hero`) so they never collide with kit classes.
   - Thai copy: wrap prices, dates, units and final particles in `<span style="white-space:nowrap">` so lines never end with an orphan "ค่ะ", "ml" or a split word.
5. **Export.** `node scripts/export.cjs <project>` (first time on a machine: `cd scripts && npm install`; it falls back to the installed Google Chrome if Playwright's browser isn't downloaded). It serves only the project folder. → `captures/NN-<shot-id>.png` (3× phones, 2× desktop, transparent), `00-overview.png`, `qa.json`. Fix every failed request and QA issue it prints.
6. **Review like a client would.** Open every PNG at full size (not just the overview) and run `references/qa-checklist.md`. Compare against `references/screens/` if real app screenshots exist there.
7. **Record.** Update `notes.md`: placeholders still open, assumptions, image sources, timeline. Then report the capture paths to the user.

### Gallery matrix (✓ = ready-made shot; others = adapt from the same row)

| Surface | Android | iOS | Desktop |
|---|---|---|---|
| LINE OA chat + Flex | ✓ dark | ✓ light | – (not in kit yet) |
| LINE rich menu | ✓ | adapt | – |
| LINE push / lock screen | adapt (`.android .notif`) | ✓ | – |
| FB feed single image | ✓ | adapt | ✓ |
| FB carousel | adapt | ✓ | adapt |
| FB Stories/Reels | adapt | ✓ | – |
| TikTok in-feed / Spark | ✓ in-feed | ✓ Spark | ✓ |

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
| `scripts/export.cjs` | render + QA (needs `npm install` in `scripts/` once) |
| `references/intake.md` | the question rounds + defaults |
| `references/line.md`, `facebook.md`, `tiktok.md` | anatomy, limits, class map per platform |
| `references/devices.md` | frames, status bars, OS differences |
| `references/realism-rules.md`, `qa-checklist.md`, `localization-th.md` | quality bars |
| `references/screens/` | dated real-app screenshots for calibration |
