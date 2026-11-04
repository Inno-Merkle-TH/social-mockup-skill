# Typography and ratios: what the real apps use

Calibrated 2026-11 against iPhone 17 Pro captures (`screens/device/IMG_0906-0910`) and the platforms' own renderers and docs, using `scripts/calibrate.cjs`. The kit already encodes all of this. Use this page to check work and to avoid breaking it.

## Rule 1: platform text uses the platform font, never the brand font

The app draws its own text (bubbles, Flex text, buttons, captions, post copy, names, CTA labels, nav) in the system or app font. Brand fonts appear only **inside images**: the creative, rich-menu art, imagemap (rich message) art, story/video overlays, and product shots.

| Where | Font the real app uses | Kit stack |
|---|---|---|
| iOS (LINE, FB, system UI) | SF Pro + **Thonburi** for Thai | `--f-ios`: `system-ui` first. Chromium on macOS resolves it to SF Pro + Thonburi. `-apple-system` does **not** resolve in Chromium, which caused the old bug. |
| Android (LINE, FB) | Roboto + Noto Sans Thai UI (loopless) | `--f-android` (bundled) |
| TikTok app (iOS + Android) | TikTok Sans at its **display cut** (opsz 36), slightly narrow | `"TikTok Sans App"`, a bundled instance pinned to opsz 36 / wdth 95. Thai falls back to the OS Thai font. |
| facebook.com | `system-ui` (SF Pro on Mac, Segoe UI on Windows) | `--f-desktop` |
| tiktok.com | TikTokFont ≈ TikTok Sans, Thai via Tahoma | `--f-tiktok` (root) |
| LINE Flex Message | system font (Flex has **no** custom-font option) | inherits the OS stack |

Exports must run on a Mac to get real SF Pro + Thonburi. Elsewhere, kit.js swaps in Inter + Noto Sans Thai Looped and warns in the console.

## Measured sizes (pt = CSS px on the 402-pt iPhone)

**LINE iOS 2026 (light):**
- **Header and status bar:** status bar 58 + header 48. "‹ 99+" 18/500. OA name 17/600 `#1175BD` with a green shield. "Automated responses" 10/400.
- **Bubbles and text:** bubble text 16 / line 19.2, colour `#35556D` (slate blue, not black). Bubble x 48–315 (max 267 wide), radius 15, 0.75 pt `#DAE9F5` border, top-left horn tail. Links `#047BFD`, underlined, break anywhere. Timestamps 11 pt `#BCD6E9`.
- **Other elements:**
  - "Today" pill: 12 pt, `#B7D5EB`, 24 pt tall.
  - Avatar: 32 pt at x 7.
  - Emoji: drawn about 118% of the text size.
  - Rich-menu bar: 50 pt, bold 16 pt "Menu ▾" `#0F82C5`.

**LINE Flex** (LINE's renderer CSS):
- **Text sizes:** xxs 11, xs 13, sm 14, md 16, lg 19, xl 22, xxl 29.
- **Buttons:** 52 (sm 40) tall, radius **8 fixed**, label 16 regular. Primary is filled (any colour, default `#17C950`), secondary is filled (default `#DCDFE5`), link is `#42659A`. No outline or pill buttons.
- **Bubble radius:** mega 17, others 10.

**Facebook iOS 2026:**
- **Header:** 60 pt. ☰ glyph at x 12.7, wordmark x 44–171, right icons 44 pt apart.
- **Post:** name 15/600, "Ad · 🌐" 13. Primary text 16 / 20.8, 2 lines, then "… See more".
- **Link bar:** 48 pt. Title 15/400 (600 under a domain line). CTA 30 pt tall, 14/600, radius 6.
- **Feed and tab bar:** units separated by a 2 pt `#101011` line. Floating capsule 51 pt tall, 21 pt above the bottom.

**TikTok iOS 2026:**
- **Top tabs:** 16 pt (selected 700, others 500), centre y 84. The underline is 23×1.7 pt, 11 pt below the text.
- **Rail:** icons about 29 pt with a 66 pt pitch; labels 11/600; the "Share" label ends at y≈713.
- **Product card and "Ad" pill:** card x 10–280, 116 pt tall, bottom 97. "Ad" pill at x 12.7, bottom 208.
- **Nav:** 83 pt, labels 10.5/600. "+" button 31×22 with 3 pt cyan/red edges.

## Media ratios (the #1 cause of "looks off")

| Placement | Ratio | Kit |
|---|---|---|
| FB/IG feed image or video | **4:5** (1080×1350) is the default and maximum; 1:1 is allowed; 1.91:1 for link ads | `.fb-media` defaults to 4:5. `.r11`, `.r191` |
| FB carousel card | 1:1 | `.fb-cc .im` |
| FB/IG Stories, Reels | 9:16 | `.fb-full` |
| TikTok in-feed | 9:16, full screen behind the UI | `.tt .vid` |
| LINE Flex hero | 20:13 is the common template ratio (1:1, 1.51:1, 16:9 also used) | `style="aspect-ratio:20/13"` on `.fx-hero` |
| LINE rich message (imagemap) | 1040 px base, **1:1 default**; other OA Manager heights need confirmation (`line-image-sizes.md`). No avatar or bubble. Edge-to-edge is ⚠ UNVERIFIED (`line.md`) | `.ln-imap` (`--r`) |
| LINE rich menu | 2500×1686 (large, 1.48:1) or 2500×843 (compact) | `.rm-art` |
| LINE image message | the image's own ratio, rounded corners, max ~220 pt wide | — |

Never set a fixed pixel height on a media box. Set the ratio, so the box holds its shape on every device width.

## Calibrating again

When an app redesigns, take a new device screenshot and copy the closest replica in `screens/calibrate/`. Then run:

```
node scripts/calibrate.cjs references/screens/calibrate/<replica>.html references/screens/device/<capture>.PNG
```

It writes side, blend and diff images and prints a mismatch bar per 20 pt band. Adjust kit.css until the chrome bands are near 0, then mark the values `[V]` with the capture name.
