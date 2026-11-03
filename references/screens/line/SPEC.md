# LINE Official Account UI — Reference Spec (collected 2026-11-03)

Confidence key: **H** = documented by LINE / exact from official CSS-equivalent; **M** = measured from official screenshot or community reverse-engineering of LINE's renderer; **L** = estimate / third-party / inferred.

Scripts and raw page dumps: `/Users/awachi01/.claude/jobs/e0a63b16/tmp/research-line/` (`sample.py`, `measure.py`, `html/ref.md` = full Messaging API reference markdown, `html/flex2html.css`).

---

## 1. Images in this folder

| File | Source URL | Shows | UI era |
|---|---|---|---|
| dev_messages_carousel.webp (844x1650) | https://developers.line.biz/media/messaging-api/messages/carousel.webp | **Current iOS OA chat**: header (back, shield badge, bold "Bot", search / notes / ☰ icons), "Today" pill, carousel template, timestamp, white input bar (+, camera, image, "Aa" pill field with emoji, mic), default blue cloud wallpaper | 2023+ (current) |
| dev_messages_buttons.webp (844x1650) | https://developers.line.biz/media/messaging-api/messages/buttons.webp | Same chat frame with single buttons-template bubble | current |
| dev_sending-messages_quote-message.webp (1170x1411, iOS @3x) | https://developers.line.biz/media/messaging-api/sending-messages/quote-message.webp | Sent green bubbles w/ "Read" + time, received white bubbles, quote-reply bubble, sticker | current |
| dev_rich-menu_default-rich-menu-example.png (1125x981, @3x) | https://developers.line.biz/media/messaging-api/rich-menu/default-rich-menu-example.png | **Current rich-menu chat bar** (white, keyboard icon left, "Tap to open ▾" center) + 2500x1686 menu | current |
| dev_rich-menu_switching-richmenu-ja.webp | https://developers.line.biz/media/messaging-api/rich-menu/switching-richmenu-ja.webp | Full iPhone (notch) OA chat with rich menu open, tab-style rich menu switching, "MENU ▾" bar | current |
| lycbiz_richmenus01.png | https://www.lycbiz.com/sites/default/files/inline-images/richmenus01.png | Official OA Manager manual: "Brown Cafe" OA chat, rich menu (large, 2x2) open, bar "Menu ▴", status subtitle under OA name | ~2022+ |
| lycbiz_richmenu_size.jpg | https://www.lycbiz.com/sites/default/files/media/jp/manual/line-official-account/68_リッチメニュー/richmenu_size.jpg | Large/compact rich-menu image size table | doc |
| dev_rich-menu_bot-demo-rich-menu-image.webp | https://developers.line.biz/media/messaging-api/rich-menu/bot-demo-rich-menu-image.webp | Annotated rich menu anatomy (image / tap areas / chat bar). **Legacy navy chat bar** | legacy (pre-2020) |
| dev_using-quick-reply_quickReplySample.png (750x1334) | https://developers.line.biz/media/messaging-api/using-quick-reply/quickReplySample.png | Quick reply chips above rich-menu bar | legacy (navy bar, grey bg) |
| dev_using-quick-reply_quickReplySample2.webp | https://developers.line.biz/media/messaging-api/using-quick-reply/quickReplySample2.webp | Quick reply chips (icon + label pills) | legacy-ish |
| dev_messages_text-v2.png | https://developers.line.biz/media/messaging-api/messages/text-v2.png | Received text bubble in group w/ sender name, mentions, emoji | current |
| dev_messages_image-full.webp | https://developers.line.biz/media/messaging-api/messages/image-full.webp | Image message in chat | — |
| dev_using-flex-messages_bubbleSamples-Update1.webp | https://developers.line.biz/media/messaging-api/using-flex-messages/bubbleSamples-Update1.webp | Flex bubble size comparison (nano…giga) | current |
| dev_using-flex-messages_overviewSample.png | https://developers.line.biz/media/messaging-api/using-flex-messages/overviewSample.png | Flex message example | — |
| dev_flex-message-elements_{bubble,carousel,button}Sample.png | https://developers.line.biz/media/messaging-api/flex-message-elements/… | Bubble blocks, carousel, button styles (primary/secondary/link) | — |
| dev_flex-message-layout_scaling-sample-{small,extra-large}-en.jpg | https://developers.line.biz/media/messaging-api/flex-message-layout/… | Flex rendering at small vs XL font setting | current |
| lds_fm_anatomy_9320c5b114.png / lds_fm_structure_ec16680b4b.png | https://vos.line-scdn.net/strapi-cluster-instance-bucket-474/fm_anatomy_9320c5b114.png (and fm_structure_…) | LINE Design System: Flex Message anatomy & Header→Hero→Body→Footer structure | 2021 doc |
| lds_Do_and_Dont_{1,2}_….png | https://designsystem.line.me/static/…/Do_and_Dont_1_24d1f9ba33.png | LDS Flex do/don't | 2021 |
| lds_chat_01_33808be282.png | https://vos.line-scdn.net/strapi-cluster-instance-bucket-474/chat_01_33808be282.png | LDS: Chats list incl. "Official accounts" filter tab (chat-list context, for notifications/list mockups) | 2021–23 |
| lds_service_chat_4_3_2x_294a078ae1.png | https://vos.line-scdn.net/strapi-cluster-instance-bucket-474/service_chat_4_3_2x_294a078ae1.png | LDS: group chat room (dark-blue wallpaper, sent/received bubbles) + share sheet | 2021–23 |
| 3p_appllio_dark-chat-ios-2026.jpg (301x651, low-res) | https://appllio.com/sites/default/files/styles/portrait_lg_1/public/2026/10/07/line-darkmode-black-theme-2026-oct01.jpg (article https://appllio.com/line-darkmode-black-theme) | **THIRD-PARTY.** iOS dark-mode 1:1 chat, Oct 2026: header w/ search/call/calendar/☰, received dark bubble, green sent bubble, flex-like calendar card, input bar, new AI suggestion chips row (日程調整/返信提案/…) | 2026 |
| 3p_appllio_desktop-dark-2026.jpg | https://appllio.com/sites/default/files/styles/landscape_lg_1/public/2026/10/07/line-darkmode-black-theme-2026-oct08.jpg | **THIRD-PARTY.** LINE desktop (Mac/PC) dark mode chat list, tabs すべて/友だち/グループ/AI/公式アカウント/オープンチャット | 2026 |

No Android chat-room or push-notification screenshot from an official source was found (see Gaps).

---

## 2. Documented limits (developers.line.biz Messaging API reference — **H**)

| Item | Value |
|---|---|
| Flex `altText` | max 1500 chars; shown in push notification, chat list preview and quote |
| Flex bubble JSON | max 30 KB; carousel JSON max 50 KB |
| Carousel | max **12 bubbles** |
| Bubble `size` | `nano, micro, deca, hecto, kilo, mega, giga`; default **mega** (`deca`/`hecto` need LINE iOS/Android 13.6.0+, else render as kilo) |
| Text message | max 5000 chars |
| Flex button action label | max 40 chars (shown) |
| Quick reply | max **13** buttons; label max **20** chars; icon PNG 1:1 ≤1 MB; only on iOS/Android (not PC) |
| Quick reply visibility | only the last message's quickReply shows; disappears on tap (except camera/camera roll/datetime/location) or when any new message arrives |
| Rich menu image | JPEG/PNG, width 800–2500 px, height ≥250 px, aspect w/h ≥1.45, ≤1 MB |
| Rich menu `chatBarText` | max **14** chars |
| Rich menu action label | max 20 chars (a11y only) |
| Rich menu areas | max 20 tappable areas (API) |
| Rich menu on PC | **Not displayed on LINE for PC (macOS/Windows/Chrome)** |
| OA Manager rich menu sizes | Large: 2500×1686, 1200×810, 800×540; Compact: 2500×843, 1200×405, 800×270 (lycbiz manual) |
| Box `cornerRadius` default | `none` |
| Text defaults | size `md`, weight regular, wrap false, gravity top, maxLines 0 |
| Image component defaults | size `md`, aspectRatio 1:1, aspectMode `fit` |
| Button defaults | style **`link`**, height `md` |
| Animated image | APNG up to 10 per message, ≤300 KB |

## 3. Flex rendering values (px at 1x / CSS px)

Source: `flex2html.css` (https://github.com/PamornT/flex2html, community port of the LINE Flex Simulator renderer — class names LyMe/T1/MdBtn match LINE's internal renderer). The official simulator render API (`/api/v1/fx/render`) requires login, so it was not used. Confidence **M** (widely used, matches LINE renders; LINE does not publish px values; docs say bubble width depends on device).

### Bubble widths (rendered `max-width`, item width = 80% of chat area)
| size | max width | corner radius |
|---|---|---|
| giga | 500 | 5 |
| mega (default) | 300 | **17** |
| kilo | 260 | 10 |
| hecto | 241 | 10 |
| deca | 220 | 10 |
| micro | 160 | 10 |
| nano | 120 | 10 |

Carousel: first bubble margin-left 7px, gap between bubbles 9px, 7px trailing; horizontally scrollable. Bubble bg #FFFFFF, overflow hidden; hero inherits top radius.

Block padding (mega): header 20px; body 20px (top 19px; bottom 10px when footer exists); footer 10px. kilo 13px; hecto/deca 11/14/13; micro/nano 10px.

### Text / icon / span `size` keywords
| xxs | xs | sm | md | lg | xl | xxl | 3xl | 4xl | 5xl |
|---|---|---|---|---|---|---|---|---|---|
| 11 | 13 | 14 | **16** | 19 | 22 | 29 | 35 | 48 | 74 |

Line-height 1.4; base text color #444 in renderer (LINE app default ≈ #111/black in screenshots — **L**); `Ex2nd` secondary #AAAAAA. Font stack -apple-system / Roboto.

### Image `size` keywords
xxs 40, xs 60, sm 80, md 100 (default), lg 120, xl 140, xxl 160, 3xl 180, 4xl 200, 5xl 220, full 100%.

### Spacing / margin / offset / cornerRadius keywords
| none | xs | sm | md | lg | xl | xxl |
|---|---|---|---|---|---|---|
| 0 | 2 | 4 | 8 | 12 | 16 | 20 |

(Same scale for `spacing`, `margin`, `offset*`, box `cornerRadius`. Padding keywords assumed same scale — **L**, not in CSS.)
Border width: light 0.5, normal 1, medium 2, semi-bold 3, bold 4 px.

### Buttons
| style | bg | text | notes |
|---|---|---|---|
| primary | **#17C950** | #FFFFFF | (LINE brand green is #06C755; #17C950 is the Flex renderer default — M) |
| secondary | #DCDFE5 | #111111 | |
| link (default) | transparent | **#42659A** | measured in template screenshot: #3C567B (M) |
Height md **52px**, sm **40px**; radius 8px; font 16px; padding 0 16px; label nowrap + ellipsis.

### Separator
Color **#D4D6DA**, 1px border scaled 0.5 (hairline). Measured in screenshots: #E8E8E8 (template footer, dev_messages_buttons.webp), #EEEEEE (quote divider). **M**

### Aspect ratios
1:1, 1.51:1, 1.91:1, 20:13 (hero common), 4:3, 16:9, 2:1, 3:1, 3:4, 9:16, 1:2, 1:3.

---

## 4. Brand palette — LINE Design System (designsystem.line.me "LINE Color Guide", **H**)

| Token | Hex | Usage |
|---|---|---|
| Green iOS | **#06C755** | brand |
| Green Android | **#4CC764** | brand on Android |
| Gray 100/150/200/250/300/350/400/500/600/650/700/750/770/800/850/870/900 | #FCFCFC / #F5F5F5 / #EFEFEF / #E8E8E8 / #DFDFDF / #C8C8C8 / #B7B7B7 / #949494 / #777777 / #616161 / #555555 / #3F3F3F / #383838 / #2A2A2A / #1F1F1F / #1A1A1A / #111111 | neutrals |
| Blue 400/500/600/700 | #96B2FF / #638DFF / #4270ED / #2F59CC | 500 = button bg, tooltip |
| Navy 400/500/600/700/800/850/900 | #C8CFDC / #98A0B3 / #707991 / #464F69 / #323B54 / #262F4A / #202A43 | 800 search bar, 850 Android header, 900 iOS nav bar (legacy dark chrome) |
| Red 400 | #FF334B | iOS badge/alert |

Typography (LDS, system font per OS — SF Pro / Roboto; Thai uses system Thai): H1 Heavy 24, H2 Bold 17, H3 Bold 14, H4 Reg 13, Title1 Bold 23, Title2 Semibold/Bold 19, Title3 Med/Semibold 16, Title4 15, Title5 14, Body1 16, Body2 14, Body3 13, Body4 12 (pt). Don't go below 12pt. **H**

---

## 5. Chat-room values measured from screenshots (PIL, `sample.py` / `measure.py`)

Scale notes: quote-message.webp and default-rich-menu-example.png are iOS @3x (1170/1125 px → 390/375 pt). carousel/buttons.webp are 844 px wide (≈ @2.16 of 390pt, status bar cropped). Dark image is 301 px wide (~0.77 of 393pt).

### Light mode (iOS, current UI)
| Element | Value | Source image | Conf |
|---|---|---|---|
| Default chat wallpaper (OA) | **#8BABD7** base, soft white cloud texture toward bottom | dev_messages_buttons.webp, quote-message.webp | M |
| Header | transparent over wallpaper (same #8BABD7), no bar color; icons/text #000000 | buttons.webp | M |
| Header layout | back chevron · grey shield/verified badge · **bold OA name left-aligned** (≈18–20pt) · right: search, notes(≡ doc), ☰ menu (1:1 users: search, call, ☰). Optional status subtitle under name (e.g. "担当者が返信します") | buttons.webp, lycbiz_richmenus01.png | M/L |
| Date pill "Today" | bg #7892B6 (darker wallpaper tint), white text, ≈51×24pt, full radius | buttons.webp | M |
| Received bubble | #FFFFFF, text #000000; 1-line height ≈36pt; right corners fully round (r ≈18pt); tail at top-left | quote-message.webp | M |
| Sent bubble | **#6CE67B** (JPEG/webp-measured; legacy value often cited #85E249 — **L**), text #000000, tail top-right | quote-message.webp | M |
| Bubble gap (same sender) | ≈7pt | quote-message.webp | M |
| Avatar | ≈30pt circle at x≈8pt; bubble starts x≈44pt; text inset ≈15pt | quote-message.webp | M |
| Timestamp / "Read" | #324B6B–#354B6A on wallpaper (≈ wallpaper darkened), ≈10–11pt, stacked "Read" above time, bottom-aligned beside bubble | quote-message.webp | M |
| Quote block in bubble | name bold #000, quoted text #6A6A6A, divider #EEEEEE | quote-message.webp | M |
| Flex/template bubble | white; template message corner ≈9–10pt (Flex mega renders 17px) | buttons.webp | M |
| Template body text | title #000, body #454545; link buttons #3C567B | buttons.webp | M |
| Input bar | bg #FFFFFF; icons + / camera / image; field "Aa" pill bg **#F6F6F6**, placeholder #BDBDBD, emoji icon inside right; mic right | buttons.webp | M |
| Rich-menu chat bar (current) | bg #FFFFFF, keyboard icon left, label #111111 centered + ▾ (open) / ▴ (closed) | default-rich-menu-example.png, lycbiz_richmenus01.png | M |
| Rich-menu chat bar (legacy, pre-2020) | navy #38425C (≈ LDS Navy 700/800), white text | quickReplySample.png | M |
| Quick reply chips (legacy shots) | pill, bg #636E7E (≈ Navy-600-ish, slightly translucent), white label, 28pt round icon left, height ≈34pt, horizontally scrollable, sits directly above input/menu bar | quickReplySample2.webp | M (current UI chip color unverified) |
| Default avatar (bot with no image) | #C7E9F9 circle with white person glyph | buttons.webp | M |

### Dark mode (iOS, Oct 2026, third-party low-res JPEG — **L**)
| Element | Value |
|---|---|
| Chat bg / header | #1B1B1B (header blends with bg) |
| Received bubble | #282828, text #FFFFFF |
| Sent bubble | green ≈#6BDF7C (unchanged from light), text black |
| Date pill text | #D1D1D1 |
| Input bar bg | #121212; field #1F1F1F |
| Flex/card bubble | stays **#FFFFFF** in dark mode (Flex bg is sender-defined) |
| AI chips row under input | chip bg ≈#111111, light text (new 2026 feature, JP) |
Note: OA chat rooms may keep their own default wallpaper in dark mode (per third-party report) — unverified.

---

## 6. Version / redesign notes
- 2020-12 (LINE 10.21.0): big redesign "Simple, Wide and Bright" — removed navy top bars, chat background extended up under header (iphone-mania.jp/news-333235). This is why legacy docs images show navy bars.
- 2021-12 (11.20.0): chat-list top entrance changes (search results summary).
- 2025-09-16 (JP): rollout of redesign — Shopping tab added, VOOM moved (roboin.io 2025-09-09).
- 2026 (help.line.me contentId=200001630, updated 2026-10-14): LINE VOOM ended (JP 2026-09-30, TH 2026-09-28); TH: Voom tab → **OpenChat tab** in bottom nav (LINE ≤26.12.0 just removes it); **Friends tab added at top of Chats screen** (JP/TW/TH). Chat *room* layout itself not documented as changed.
- Rich menus and quick replies not shown on LINE for PC/desktop.

## 7. Gaps
- No official Android chat-room screenshot (Android header uses Material back arrow; LDS lists Android brand green #4CC764 and Android header navy #262F4A for legacy). Need real device capture.
- No official push-notification image. Content rule (H): notification body = altText (Flex) or text; title = OA name. Render with OS-native notification styles.
- Dark-mode values only from a low-res third-party JPEG.
- Compact rich menu (2500×843) on-device render not captured; height = width × 843/2500 of screen width (large = ×1686/2500).
- Current-UI quick-reply chip colors unverified (only legacy images).
- Flex px values from community renderer, not an official LINE table.
