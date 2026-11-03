# LINE

## Surfaces and kit classes

| Surface | Markup root | Notes |
|---|---|---|
| OA chat | `.screen.line-dark` or `.line-light` → `.sb` `.ln-head` `.ln-msgs` `.ln-bar` (or `.ln-input`) `.sysnav` | OA name + green verified badge (`#minibadge`) in header |
| Text bubble | `.ln-row > .ln-av + .ln-col > .ln-line > .ln-bub.tail + .ln-tm` | add `.cont` for follow-up rows (no avatar), `.me` for user bubbles |
| Flex bubble | `.flex` (`.micro` / `.kilo` / `.mega` widths) → `.fx-hero` `.fx-bd` (`.fx-t1` `.fx-t2` `.fx-sep` `.fx-kv`) `.fx-ft` | brand colours allowed (button/text/bg colours, images); text is ALWAYS the system font (Flex has no custom fonts); buttons radius 8, filled or link only |
| Flex carousel | `.ln-car > .flex…` | max 12 bubbles; show 1.5 cards so it reads as swipeable |
| Quick replies | `.ln-qrs > .ln-qr` | sit above the input bar |
| Rich menu | `.rm > .rm-art.<template>` + `.ln-bar` with `<i class="tri up">` (open) / `<i class="tri">` (collapsed: omit `.rm`) | ONE image in reality. Templates: large `L6 L4 L4b L3 L2r L2c L1`, compact `C3 C2 C2l C2r C1` (= the 12 in OA Manager); API: `.custom` (children `data-area="x,y,w,h"` in 2500-px image space, ≤20) and `.tabbed` (first child `.rm-tabs`). Tiles: `.rm-t` (icon + label), `.rm-t.hl` (brand fill), `.rm-t.ph` (photo + `<b>` title + `<span>` sub). `?areas=1` outlines tap areas A, B, C… Template sheet: `templates/gallery.html#line-richmenu-templates` |
| Rich message (imagemap) | `.ln-imap > img` (`style="--r:1"`) | full width, no avatar, no radius: the most common OA broadcast format |
| Quoted reply / link / jump button | `.ln-quote > b + span`, `.lk`, `.ln-down` | 2026 iOS details |
| Push / lock screen | `.lock > .date + .clk + .qa.l + .qa.r` and `.notif` (iOS: card in the lower half; add `.top` for the old top position. Android: heads-up card at top) | title = OA name, body = message text or Flex altText |

## Real-platform constraints

- **Rich menu image**: 2500×1686 (large) or 2500×843 (compact); also 1200×810/1200×405/800×540/800×270. JPEG/PNG, ≤1 MB. Up to 20 tap areas. Chat-bar label ≤14 characters ("เมนู", "Menu", "แตะเพื่อดูเมนู").
- **Flex**: bubble width depends on device and size keyword (nano → giga). Carousel ≤12 bubbles. altText ≤1,500 chars and is what shows in the push and chat list, so write it.
- **Message order**: an OA push usually = 1 short text + 1 Flex (or image). More than 3 bubbles per push looks spammy.
- **Chat state (always ask, intake Round 3a)**:
  - **Rich menu:** open (`.rm` + bar `.tri.up`), collapsed (bar `.tri`) or none (`.ln-input`).
  - **Thread:** with history, the thread is bottom-anchored (`.ln-msgs.bottom`, older messages scroll under the header; fill with real past content, never a sliver of empty card). A fresh chat is top-anchored (`.ln-msgs`: "Today" + message at the top, wallpaper below).
- **Timestamps**: right of the last bubble in a group (left for user's own). Use "Read" (อ่านแล้ว) on user bubbles.

## Themes (verified)

- `.line-light`: **2026 iOS app** (iPhone capture, Nov 2026): grey header `#EBEEF0` incl. status bar, "‹ 99+" + icons `#1175BD`, green shield + OA name in blue, "Automated responses" subtitle; white chat; white bubbles with `#DAE9F5` hairline; "Today" pill `#B7D5EB`; rich-menu bar white with blue "เมนู ▾". The user's LINE theme can change header/wallpaper.
- `.line-classic`: the look in LINE Developers docs (blue wallpaper `#8BABD7`, header on wallpaper, green sent bubble `#6CE67B`).
- `.line-dark`: Android dark, verified on earlier client projects.
- Flex geometry from the Flex Simulator renderer: mega 300 px max (80% of chat width) radius 17; kilo 260 / micro 160 radius 10; carousel starts 7 px from the edge, 9 px gap; text xs 13, sm 14, md 16, lg 19, xl 22; button md 52 px / sm 40 px, radius 8, primary `#17C950`, secondary `#DCDFE5`, link `#42659A`; separator `#D4D6DA`.

## Theme notes

- `.line-dark` values were verified against Android screenshots [V]. `.line-light` is calibrated pixel-by-pixel to IMG_0910 [V] (replica: `screens/calibrate/line-ios-0910.html`). Calibrate with `references/screens/` before shipping light-mode work. The chat wallpaper is user-themable, so `--ln-bg` can be any plain colour.
- LINE header and bars are never brand coloured. Brand only appears in avatar, Flex, rich menu art, images.
- Android: header 54 px with back arrow left, title left-aligned. iOS 2026 (`.line-light`): header 48 px, title **left-aligned** after "‹ 99+" (the old centred title is gone).
