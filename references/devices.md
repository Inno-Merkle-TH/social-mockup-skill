# Devices, frames and OS chrome

| Class | Screen (CSS px) | Frame look | Export |
|---|---|---|---|
| `.dev.android` | 360×780 (Galaxy S-class, 19.5:9) | thin black bezel, silver rim, punch-hole camera, side keys right | 3× → ~1131×2382 |
| `.dev.ios` | 402×874 (iPhone 17 Pro class) | rounded 62 px corners, Dynamic Island 124×36, titanium rim | 3× |
| `.dev.desktop` | set inline, e.g. 1280×800 or 1440×900 | macOS window, traffic lights, shadow; add `.chrome-tabs` + `.chrome-bar` for a browser | 2× |

Need another device (Pixel 412×915, iPhone Pro Max 440×956, Galaxy Z Fold)? Copy the `.dev.android`/`.dev.ios` rules with new width/height/radius. Keep `.screen` structure.

## Screen only, no phone (`--bare`)
When the user wants just the screen (to drop into their own device template, a slide, or a deck that already has phones), export with `node scripts/export.cjs <project> --bare` (same flag on `video.cjs`). Preview with `?bare=1`, or put class `bare` on `<html>`, a `.shot` or a `.frame` to do it in the page.
- It looks like a real screenshot: no bezel, side buttons, Dynamic Island or punch hole, square corners. The status bar and home indicator stay, as in a real screenshot.
- At the default 3× an iPhone screen exports at **1206×2622** and a Galaxy at **1080×2340**: the same size as a real screenshot from those phones.
- `--bare round` (`?bare=round`, class `bare round`) keeps the rounded screen corners, for slides where a soft shape looks better.
- Same markup, so one project can export both: run the export twice, once with `--bare`, and keep the two folders apart (move the first `captures/` aside).

## Status bar + system nav (filled automatically by kit.js)

```html
<div class="sb" data-time="10:24" data-bat="78"></div>   <!-- top -->
<div class="sysnav"></div>                               <!-- bottom: gesture pill / home indicator -->
<div class="sysnav btn3"></div>                          <!-- Android 3-button nav -->
```
- Colour follows `.light`/`.dark` on the screen (or add `.light`/`.dark` on the bar itself). Add `.over` to lay it transparently over full-bleed content (TikTok, Stories, lock screen).
- Android One UI 8.5: semibold clock 12 dp from the left; wifi arcs, four signal bars and a 20.7×12 dp battery pill with the % cut into it on the right, measured against a Galaxy S25 1080×2340 capture (SamMobile, Dec 2025) to within 1 px @3x [V]. The fill turns red at 15% or below. iOS 26: time centred-left beside the island; signal, wifi and a solid battery pill with the % cut out of it on the right, measured against IMG_0906-0910 to within 1 px @3x [V].
- `data-bat` sets the level (default 82). iOS turns the fill red at 20% or below. `data-pct="0"` gives the classic outlined iOS battery without a number (battery percentage switched off in Settings).
- Default times: iOS "9:41" (Apple marketing convention), Android "10:24". Set `data-time` so times follow the story.

## Lock screens (`<div class="lock"><div class="date">…</div><div class="clk">9:41</div></div>` + `.sb.over` + `.notif` + `.sysnav.over`)
- iOS 26 [V] (Apple WWDC25 images, MacStories review): the status bar has **no time** on the lock screen (empty, or `data-carrier="AIS"`), with the Control Centre grabber under the icons (automatic). Small bold date, glass clock (`.lock.solid` for a plain white clock, `.lock.tall` for the stretched one), dark frosted notification cards 20 pt from the edges just above the glass torch (`#torch`) and camera (`#cam`) buttons.
- Android One UI 8 [~]: padlock at the top centre (automatic), date and a thin clock at the top left, light frosted notification cards.
- Wallpaper: set `--wall: url(…)` on `.lock` to a photo. The default is an abstract dusk gradient; never a flat colour.
- App icon in a notification: `<div class="appi" data-app="line|facebook|tiktok"></div>`. kit.js fills in the official app icon. Never draw a logo by hand.
- In a flow, `.screen.splash[data-app]` draws the LINE / Facebook / TikTok launch screen measured from real iPhone captures, and the optional `{"unlock": true}` plays Face ID / the padlock opening (see `video.md`).

## OS differences that make or break realism

| Thing | Android | iOS |
|---|---|---|
| System font | Roboto (One UI: SamsungOne, if licensed) | SF Pro (renders natively when exported on a Mac) |
| Thai system font | Noto Sans Thai (loopless) | Sukhumvit Set / Thonburi |
| Back | arrow ← | chevron ‹ |
| LINE header title | left-aligned | centred |
| Facebook tabs | top | bottom tab bar with labels |
| Bottom | gesture pill 24 px or 3-button bar 48 px | home indicator, 34 px safe area |
| Push | One UI heads-up card, dark, rounded 24 | frosted lock-screen card, rounded 22 |

## Frame proportions (hardware-accurate, 2026-11)

Frames are drawn from the manufacturers' mm specs, not from screenshots. The outer body has the same ratio as the real phone:

| Device | Body (mm) | Screen (CSS px) | Bezel per side | Display radius | Body ratio |
|---|---|---|---|---|---|
| iPhone 17 Pro (`.dev.ios`) | 71.9 × 150.0 | 402 × 874 pt (1206×2622 @3x, ≈6.04 pt/mm) | 16 pt | 62 pt | 0.479 |
| Galaxy S26 (`.dev.android`) | 71.7 × 149.6 | 360 × 780 dp (1080×2340 @3x, ≈5.37 dp/mm) | 12.4 dp | 30 dp | 0.479 |

### Brand logos are copied, never redrawn
Every app logo in the kit is the brand's own vector artwork, stored once in `assets/icons.svg`: `#line-app` and `#line-mark` (LINE's own logo file), `#lineicon`, `#fb-f`, `#fb-app` (Facebook 2023 logo), `#meta-logo` (Meta brand resources), `#tt-logo`, `#tt-wordmark`, `#tt-app` (TikTok note and wordmark). Sources are listed in the comment above them. TikTok's colour logo is built the way TikTok builds it: a cyan note and a red note offset diagonally, white where they overlap, with offsets fitted to a real iPhone splash capture. If a logo is missing, get the brand's own file (the brand's press/brand page, Simple Icons, Wikimedia Commons) and add it there. Don't trace or approximate one: people notice immediately.

Side buttons are injected by kit.js at their real positions: on the iPhone, Action, volume ± and Camera Control on the left/right; on the Galaxy, the volume rocker and side key on the right. Device screenshots (`references/screens/device/`) only show *what the app looks like*. They are never used to size the frame.
