# Devices, frames and OS chrome

| Class | Screen (CSS px) | Frame look | Export |
|---|---|---|---|
| `.dev.android` | 360×780 (Galaxy S-class, 19.5:9) | thin black bezel, silver rim, punch-hole camera, side keys right | 3× → ~1131×2382 |
| `.dev.ios` | 402×874 (iPhone 17 Pro class) | rounded 62 px corners, Dynamic Island 124×36, titanium rim | 3× |
| `.dev.desktop` | set inline, e.g. 1280×800 or 1440×900 | macOS window, traffic lights, shadow; add `.chrome-tabs` + `.chrome-bar` for a browser | 2× |

Need another device (Pixel 412×915, iPhone Pro Max 440×956, Galaxy Z Fold)? Copy the `.dev.android`/`.dev.ios` rules with new width/height/radius. Keep `.screen` structure.

## Status bar + system nav (filled automatically by kit.js)

```html
<div class="sb" data-time="10:24" data-bat="78"></div>   <!-- top -->
<div class="sysnav"></div>                               <!-- bottom: gesture pill / home indicator -->
<div class="sysnav btn3"></div>                          <!-- Android 3-button nav -->
```
- Colour follows `.light`/`.dark` on the screen (or add `.light`/`.dark` on the bar itself). Add `.over` to lay it transparently over full-bleed content (TikTok, Stories, lock screen).
- Android One UI: time left, wifi + signal + pill battery with % right [V]. iOS: time centred-left beside the island, signal + wifi + battery right [~].
- Default times: iOS "9:41" (Apple marketing convention), Android "10:24". Set `data-time` so times follow the story.

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

Side buttons are injected by kit.js at their real positions: on the iPhone, Action, volume ± and Camera Control on the left/right; on the Galaxy, the volume rocker and side key on the right. Device screenshots (`references/screens/device/`) only show *what the app looks like*. They are never used to size the frame.
