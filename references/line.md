# LINE

## Surfaces and kit classes

| Surface | Markup root | Notes |
|---|---|---|
| OA chat | `.screen.line-dark` or `.line-light` → `.sb` `.ln-head` `.ln-msgs` `.ln-bar` (or `.ln-input`) `.sysnav` | OA name + green verified badge (`#minibadge`) in header |
| Text bubble | `.ln-row > .ln-av + .ln-col > .ln-line > .ln-bub.tail + .ln-tm` | add `.cont` for follow-up rows (no avatar), `.me` for user bubbles |
| Flex bubble | `.flex` (`.micro` / `.kilo` / `.mega` widths) → `.fx-hero` `.fx-bd` (`.fx-t1` `.fx-t2` `.fx-sep` `.fx-kv`) `.fx-ft` | brand-authored: brand vars allowed |
| Flex carousel | `.ln-car > .flex…` | max 12 bubbles; show 1.5 cards so it reads as swipeable |
| Quick replies | `.ln-qrs > .ln-qr` | sit above the input bar |
| Rich menu | `.rm > .rm-art.g6` (`g4`, `g3`, `big-left`, `banner-top`, `.compact`) + `.ln-bar` with chevron up | ONE image in reality |
| Push / lock screen | `.lock > .date + .clk + .qa.l + .qa.r` and `.notif` (iOS: card in the lower half; add `.top` for the old top position. Android: heads-up card at top) | title = OA name, body = message text or Flex altText |

## Real-platform constraints

- **Rich menu image**: 2500×1686 (large) or 2500×843 (compact); also 1200×810/1200×405/800×540/800×270. JPEG/PNG, ≤1 MB. Up to 20 tap areas. Chat-bar label ≤14 characters ("เมนู", "Menu", "แตะเพื่อดูเมนู").
- **Flex**: bubble width depends on device and size keyword (nano → giga). Carousel ≤12 bubbles. altText ≤1,500 chars and is what shows in the push and chat list, so write it.
- **Message order**: an OA push usually = 1 short text + 1 Flex (or image). More than 3 bubbles per push looks spammy.
- **Chat start**: a new conversation is top-anchored (date chip "Today/วันนี้" then messages). Only long threads fill from the bottom.
- **Timestamps**: right of the last bubble in a group (left for user's own). Use "Read" (อ่านแล้ว) on user bubbles.

## Theme notes

- `.line-dark` values were verified against Android screenshots [V]. `.line-light` is an estimate [~]. Calibrate with `references/screens/` before shipping light-mode work. The chat wallpaper is user-themable, so `--ln-bg` can be any plain colour.
- LINE header and bars are never brand coloured. Brand only appears in avatar, Flex, rich menu art, images.
- Android: header 54 px with back arrow left, title left-aligned. iOS: header 46 px, title centred.
