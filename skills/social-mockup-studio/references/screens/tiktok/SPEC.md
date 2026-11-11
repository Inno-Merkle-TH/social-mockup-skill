# TikTok For You: UI spec sheet (ground truth, captured 2026-11-03)

Sources:
- **Desktop web**: live `https://www.tiktok.com/foryou`, logged out, Playwright plus Chrome (headless), 1440×900 at DSF 2, locale en-US. No cookie banner appeared in this region, so nothing was declined.
- **Mobile web**: same URL with the Playwright `iPhone 15 Pro` and `Pixel 7` descriptors. The "Open app" interstitial was closed with **Not now**. This is mobile web, not the app. The iPhone run uses Chromium with an iOS user agent, not WebKit.
- **App / ads**: official TikTok Ads Help Center images and safe-zone templates, listed in section 4.

All values are CSS px (desktop and mobile web) or pt at 1× for the official app mocks (375-wide frame). Colors are hex, and `a=` is alpha. Raw dumps (computed styles and bounding boxes) are in `raw/*.json`.

No ad came up in 25 desktop feed swipes while logged out, so the **live web "Sponsored" chrome was not captured**. The ad anatomy below comes from official TikTok images.

---

## 0. Tokens / fonts

| Token | Value |
|---|---|
| Brand red (primary) | `#FE2C55` (Log in, Follow, active nav, progress elapsed, follow "+") |
| Text primary (light UI) | `#161823` (body color); nav labels are `#000000` |
| Text secondary | `rgba(22,24,35,0.5)` (footer headings, copyright) |
| Divider | `rgba(22,24,35,0.12)`, 1px |
| On-video text | `#FFFFFF`; desktop overlay text `#F6F6F6`; desktop counts `rgba(255,255,255,0.75)`; desktop @mention `rgba(255,255,255,0.88)` |
| Logo cyan / pink (create button) | `#20D5EC` / `#FA2D6C` |
| Body font stack | `TikTokFont, Arial, Tahoma, PingFangSC, sans-serif` |
| TUX button / text stack | `TikTokFont, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, Roboto, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| New TUX canary text (Follow, Get Coins) | `TikTokSans, TikTokSans16pt, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif` (variable 300–900) |
| Display font | `TikTokDisplayFont` (700 loaded): footer headings, big time scrub label |
| Loaded weights | TikTokFont 400/500/600/700; TikTokDisplayFont 700; TikTokSans 300–900 |
| Mock fallback | TikTok fonts are proprietary. Use the stack above, then `-apple-system`/`SF Pro` (iOS) and `Roboto` (Android). Proxima Nova is the historical in-app font. |

---

## 1. Desktop web (1440×900), screenshot `desktop-foryou-1440x900@2x.png`

The 2026 layout has no top header (the header element exists but is hidden at 0×0). It is a 240px left sidebar plus one large rounded "cinema" card holding the video, with the action rail and nav arrows overlaid **inside** the card.

### 1.1 Page frame
| Element | Box (x,y,w,h) | Style |
|---|---|---|
| Page bg | full | `#FFFFFF` |
| Sidebar `DivSideNavContainer` | 0,0,240,900 | bg `#FFF`, padding `0 16px` |
| Main column | 240,0,1200,900 | none |
| Feed card `article[recommend-list-item-container]` | 256,16,1168,868 | 16px inset from main column on all sides; cards stack vertically with 0 gap (next card at y=884) |
| Card chrome host | same | `border-radius:16px`, overflow hidden |
| Card ambient bg | same | bg `#0D0D0D` + `radial-gradient(536.8px 954.8px, rgba(255,255,255,.17) 0%, rgba(255,255,255,.15) 32%, rgba(255,255,255,.094) 54%, rgba(255,255,255,.04) 72%, transparent 100%)` (soft glow behind the video) |
| Video (`object-fit:contain`) | 595.9,16,488.3,868 | 9:16 video is centered in the card at full card height. Source 720×1280. |

### 1.2 Sidebar
| Element | Box | Font / color / misc |
|---|---|---|
| Logo (svg, full wordmark) | 24,20,105,28 | `#161823` glyphs with cyan/pink note icon. Collapse-sidebar icon at the right (~x 206). |
| Search pill (button) | 16,64,208,40 | radius 999, bg `rgba(0,0,0,.05)` (renders `#F2F2F2`), padding `6px 10px`; icon 19×19 at x 26.5, `rgba(0,0,0,.48)`; placeholder "Search" at x 56, 14px/400, lh 21, `rgba(0,0,0,.34)` |
| Nav item row (TUXButton default medium) | x16, w208, **h40**, pitch **44** (y = 116,160,204,248,292,336,380,424) | radius 6, no bg; label x=64, **16px / 500**, lh 21, `#000`; active (For You) label and icon `#FE2C55` |
| Nav icons | For You / Explore / LIVE: **32×32** at x20; Following / Short dramas / Upload / Profile: **24×24** at x24; More: 19×19 at x26.5 with a 6×6 `#FE2C55` dot badge at (42.5,431.5) | filled glyphs, `#000` |
| Items (order) | For You, Explore, Following, Short dramas, LIVE, Upload, Profile, More | none |
| Log in button | 20,480,200,40 | bg `#FE2C55`, radius 6, 16px/500 white, padding `1px 16px` |
| Divider (::before of footer) | 24,544, w192, h1 | `rgba(22,24,35,.12)` |
| Footer headings | x24, y 560/587/614, h22 | "Company", "Program", "Terms & Policies": `TikTokDisplayFont` **15px/700**, lh 22, `rgba(22,24,35,.5)` |
| Copyright | 24,641 | "© 2026 TikTok", 12px/600, lh 16, `rgba(22,24,35,.5)` |
| Utilities pills | Get Coins 16,856,100,28; Get App 124,856,100,28 | pill bg ~`#F2F2F2`, 14px icon, label TikTokSans **13px/600**, lh 16.9 |
| Followed-accounts list | not present when logged out | none |

### 1.3 Caption / author block (bottom-left, over video)
| Element | Box | Style |
|---|---|---|
| Description layer | 256,730,1080,90 | padding `16px 20px`, gap 12 |
| Content column | 276,746,**480**,58 | max width 480 |
| Identity row | 276,746,480,28 | flex, gap 8 |
| Avatar | 276,748,**24×24** | circle; placeholder bg `rgba(136,136,136,.5)` |
| Display name ("Dev") | 308,749 | TikTokFont **17px/500**, lh 22.1, `#F6F6F6` |
| Follow pill | 347.1,746,57.5,**28** | bg `#FE2C55`, radius 9999, padding `1px 8px`; text TikTokSans **13px/600**, lh 16.9, ls .126px, white |
| Caption / desc | 276,786 | 14px/400 (mentions 500), lh **18.2**, ls .094px, `#F6F6F6`; links `rgba(255,255,255,.88)` |
| Row gap name→caption | 12px | none |

### 1.4 Action rail (right, overlaid inside the card)
| Element | Box | Style |
|---|---|---|
| Rail container | 1356,614,48,198 | column, gap **10** |
| Item | e.g. like 1365.8,614,28.3,**42** | icon above count, gap 6 |
| Icon | **20×20**, centered (x 1370) | **no circle background**, fill `rgba(255,255,255,.9)` |
| Count | h16 | TikTokFont **12px/700**, lh 16, `rgba(255,255,255,.75)`, centered |
| Order | Like (heart), Comment (bubble), Favorite (bookmark), Share (arrow) | y = 614 / 666 / 718 / 770 (pitch 52) |
| No avatar or music disc on the rail (desktop) | none | none |

### 1.5 Up/down nav arrows
| Element | Box | Style |
|---|---|---|
| Container | 1360,402,40,96 | column, gap 16, vertically centered in card |
| Prev / Next button | 40×40 at y 402 / 458 | radius 999, bg `rgba(255,255,255,.19)` (renders `#1F1F1F`–`#3B3B3B` over the dark ambient); chevron 20×20 white, `drop-shadow(0 1px 1px rgba(0,0,0,.2))` |

### 1.6 Playback chrome (bottom of card)
| Element | Box | Style |
|---|---|---|
| Chrome | 256,820,1168,64 | idle opacity **0.28** on the progress slot and controls row; full opacity on hover (`desktop-foryou-hover-*.png`) |
| Progress hit area | 264,820,1152,12 | none |
| Track | 264,828,1152,**4** | `rgba(255,255,255,.4)` |
| Elapsed | same y, h4 | `#FE2C55` |
| Scrub head | 12×12 | white, 50%, `0 0 1px 1px rgba(0,0,0,.15)`; shown on hover |
| Controls row | 256,832,1168,52 | padding `8px 12px 8px 8px`, gap 8 |
| Play/Pause | 264,840,36×36 | icon 20, white, radius 999 |
| Time "00:10 / 00:21" | 304,849 | 14px/400, lh 18.2, `#F6F6F6` |
| Right group | 1228–1412 | Speed "1.0x" 52×32 14px/600; Captions 36×36; Volume 36×36; More (…) 48×48 with 24 icon |

### 1.7 Top-right buttons
None in this layout. The header (`top-login-button`: `#FE2C55`, radius 4, 16px/700) exists in the DOM but is hidden (0×0). Log in lives in the sidebar.

---

## 2. Mobile web (not the app)
Screenshots: `mweb-iphone15pro-foryou.png` (393×659 viewport, DPR 3) and `mweb-pixel7-foryou.png` (412×839, DPR 2.625). The layout is the same on both. Values below are iPhone; for Pixel add 19px to x on right-aligned items and 180px to y on bottom-anchored items.

### 2.1 Frame
| Element | Box | Style |
|---|---|---|
| Video slide | 0,0,393,**610** (Pixel 412×790) | video `object-fit:cover`, full-bleed |
| Top bar | 0,0,393,87 | `linear-gradient(rgba(0,0,0,.24), transparent)`, padding `0 12px 43px` |
| Hamburger | icon 24×24 at (20,10) | white |
| "Open app" pill | 152.7,10,87.6,24 | bg `rgba(84,84,84,.5)`, radius 12, padding `4px 8px 4px 4px`, gap 4, 16px logo, 12px/500 white |
| Search icon | top-right, ~24px | white |
| Bottom tab bar | 0,610,393,**49** | bg `#000000` |
| Tab item | 78.6 wide, padding `2px 8px 17px` | icon **32×32**, label **10px/600**, lh 15, white; inactive labels opacity **.75** |
| Create (+) button | 159,610,75×49 svg | white rect ~36×28 with `#20D5EC` (left) and `#FA2D6C` (right) offset layers, plus `#161823` 13×13 |
| Tabs | Home, Discover, +, Inbox, Profile | none |

### 2.2 Right rail
| Element | Box | Style |
|---|---|---|
| Rail column | x 331–393 (**62 wide**), y 273–602 | right-anchored |
| Avatar | 340,282,**44×44** | circle, **1px solid #FFF** border |
| Follow "+" | svg 23×23 at (350.5,316) | `#FE2C55` circle 19.7 with drop shadow; white plus bars 8.2×1.6. Centered on the avatar's bottom edge. |
| Like / Comment / Share item | 62×**65** each, y 347 / 412 / 477 | icon **32×32** at item top +8 (white fill with built-in SVG drop-shadow filter); count at +40 |
| Count | h17 | **13px/600**, lh 17, white, centered |
| Music disc | 335.2,547.2,**53.6** | dark vinyl ring svg; inner cover 37.5 circle (39.1 with wrapper), rotates |
| (No bookmark/favorite on mobile web) | none | none |

### 2.3 Caption block (bottom-left)
| Element | Box | Style |
|---|---|---|
| Caption container | x **12**, y 532, w **274**, h 78 | white, no text-shadow (legibility comes from the video) |
| Username (`strong`) | 12,532, h17 | **17px/600**, lh 17, white (display name; no "@" on mobile web) |
| Description | y 557, h18/line | **15px/400**, lh **18**, white, `-webkit-line-clamp:2`; hashtags `strong` 600 |
| Music row | y 583, h15 | ♫ icon 15×15, then text at x31 (w180 marquee), **15px/400**, lh 15, ls −0.2px |
| Vertical rhythm | name→desc 8, desc→music 8, music→slide bottom 12 | none |

---

## 3. In-app In-Feed Ad anatomy (official Help Center material)

### 3.1 Measured from the official CTA mock (`official/cta/*.png`, 375×812 iPhone X frame, 1×)
| Element | Measured | Notes |
|---|---|---|
| Status bar / top tabs | "Following" (dim) and "For You" (white, bold) centered at y≈67, red live dot above Following | none |
| Rail | avatar ~48 circle with white ring at x≈316–364, y≈350; Like / Comment / Share icons ~36 with counts ~11–12px semibold; music disc ~48 at bottom right (y≈670–716) | Ad mocks show **no "+" follow badge** on non-Spark ads |
| @username | x 12, cap-height rows y 587–594 (≈16px semibold) | display name line, 1 line only |
| Ad caption | 2 lines at 14px regular, lh ≈20, x 12 → ≈273 | white |
| **"Sponsored" label** | pill **x154 y627, 59×16**, bg ≈ `rgba(255,255,255,.12–.15)`, radius ≈2, text ≈10px/400–500, light grey ≈ `rgba(255,255,255,.75)` | **inline, right after the last caption word** (4px gap, same baseline). In the safe-zone mocks with long captions it sits on its own line under the caption, left-aligned at x 12. |
| Music row | "♫ Promoted music", ≈14px, y≈652–665 | non-Spark ads say "Promoted music" |
| **CTA bar** | **x12–270 (w 259), y683–716 (h 34), radius ≈2–3** | spans the caption column, not full width; label centered, ≈13px/600 white + `›` chevron ("Install now ›") |
| CTA state 1 (content only) | bg = translucent light overlay ≈ `rgba(255,255,255,.15)` over video | `cta-step1-content-only.png` |
| CTA state 2 (bg color added) | solid color auto-picked from the video (here `#98ABB6`) | `cta-step2-background-color.png`. Live app usually shows brand-ish colors; red `#FE2C55` is common for Download / Shop. |
| Gap CTA → tab bar | ≈12 | tab bar black, ≈83 incl. home indicator |

### 3.2 Official 540×960 safe-zone mock with Sponsored and CTA (`official/safezone-infeed-anchor/1. Vertical Feed- 540x960/feed_1..4.png`, 750×1334 px)
The stack, top to bottom: anchor/product chip (rounded grey bar with an icon, for example "Viewproduct…"), **@username**, caption (1–4 lines), **Sponsored** grey pill on its own line, **♫ music** row, **CTA bar "Download ›"** (full caption width, translucent grey), then the tab bar. The rail ends with "•••" (more) above the music disc.

### 3.3 Rules from the help center
| Topic | Rule | Source |
|---|---|---|
| Display name | One line only; **max 20 chars** (10 for CJK). App ads pull the name from the store. | Video ads specifications |
| Profile image | 98×98, 1:1, < 50 KB, key art inside the central 66×66 | Video ads specifications |
| Ad caption (non-Spark) | White, uniform font, not customizable; **no clickable links, @, or hashtags** | Video ads specifications |
| Ad caption (Spark) | Pulled from the organic post; **max 4 lines displayed**, emoji, @ and hashtags allowed; can be blank | Video ads specs / About Spark Ads |
| Caption char limit | Not stated on the official spec page. Third-party guides commonly cite **12–100 chars (Latin)**, unverified. | none |
| CTA structure | Two parts: **CTA content** (text + link) and **CTA background color**. Content appears first; bg color appears later. Color is "automatically selected by the system based on the colors in your video". | About the CTA button |
| CTA timing (Reservation / R&F in-feed) | Content: persistent. **Bg color after 2 s.** | Available timing… |
| CTA timing (Auction CPM/CPC) | Content persistent; bg after 5 s | same |
| CTA timing (Auction oCPM) | Content after **3, 4 or 5 s**; bg after **4–7 s** (dynamic per user) | same |
| CTA timing (Auction CPV) | Content after 5 or 6 s; bg after 4–8 s | same |
| TopView | Content after 3 s; bg after 5 s | same |
| CTA placements | In-feed bottom bar while playing; in the comment panel (pinned card); at the video end card (non-Spark); on the Spark identity's profile page ("Download App" / "Official Page" link) | Available placements… |
| Taps (non-Spark) | CTA, avatar, nickname, caption, swipe-left → landing page | About Spark Ads |
| Taps (Spark) | CTA and caption → landing page; avatar, nickname, swipe-left → profile; "+" → follow; music → sound page | About Spark Ads |
| Progress bar | In-app feed shows a thin progress/scrub bar only on long videos or on pause/drag. Ad mocks show none. Desktop web always shows a 4px bar (sec. 1.6). | observation (no official statement found) |
| Safe zone (official 720×1280 template) | Unsafe: **top 160**, **left 80**, **right 80**, **bottom 440**, plus the **right rail column x ≥ 520 for the bottom 720px** (from y 560). Safe = x80–640 / y160–560 ∪ x80–520 / y560–840. | `official/safezone-infeed-standard/In-Feed/Feed.png` |
| Safe zone with anchor (540×960) | top 126, left 60, right 120 (60 above the rail), bottom 406–507 depending on caption lines (1–4) | `official/safezone-infeed-anchor/…` |

---

## 4. Reference images

| File | Source URL | Shows |
|---|---|---|
| `desktop-foryou-1440x900@2x.png` | https://www.tiktok.com/foryou (live capture) | Desktop For You, logged out, idle chrome |
| `desktop-foryou-hover-1440x900@2x.png` | same | Hover state (full-opacity controls, scrub head) |
| `desktop-foryou-reload-1440x900@2x.png` | same | Second load (same layout) |
| `desktop-explore-1440x900@2x.png` | https://www.tiktok.com/explore | Explore grid |
| `mweb-iphone15pro-foryou.png` | https://www.tiktok.com/foryou (iPhone 15 Pro emulation) | Mobile web feed: rail, caption, tab bar |
| `mweb-pixel7-foryou.png` | same (Pixel 7 emulation) | Same at 412 wide |
| `official/cta/cta-step1-content-only.png` | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-6pEYSirP81Sh2khf8MmQbF.png (on https://ads.tiktok.com/help/article/in-app-behavior-call-to-action-button) | In-app ad, **CTA before bg color** (translucent), Sponsored pill inline, Promoted music |
| `official/cta/cta-step2-background-color.png` | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-3cTsFB4NM8PD9Jkm41uHB.png (same page) | Same frame with **CTA bg color filled** |
| `official/placements/cta-placements-non-spark.jpg` | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-70OD54bWfjC2lq9OpfCBN7.jpg (on https://ads.tiktok.com/help/article/available-placements-for-the-call-to-action-button) | Non-Spark CTA placements: in-feed, comment panel, end card |
| `official/placements/cta-placements-spark.jpg` | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-J0rBbjTkxtZJpJVgVxbOI.jpg (same page) | Spark CTA placements: in-feed, comment panel, profile page (Download / Landing), video end page |
| `official/safezone-infeed-standard/In-Feed/Feed.png` (+ .zip) | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-10e7f5Vig4uhAscNP8XPB0.zip (on https://ads.tiktok.com/help/article/video-ads-specifications) | Official in-feed safe zone, 720×1280 (file 2880×5120) |
| `official/safezone-infeed-anchor/{1. Vertical,2. Square,3. Horizontal}/feed_1..4.png` (+ .zip) | https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/5jqet0ab9qci-2ECwVwzIZXPqszI99UlWm3.zip (same page) | **Full in-app ad UI overlays** (anchor chip, @username, 1–4 caption lines, Sponsored, music, "Download ›" CTA, rail, tab bar) with safe-zone dimensions, 750×1334 |

Other official zips on that page that were not downloaded: Arabic RTL variants (`…1UHlc1zKkFHTtnoYGercvt.zip`, `…24L99TDQGUfv3umzp7uQ7D.zip`) and Profile cover (`…3fDaMQplHjpclE6aM3W9P2.zip`).

---

## 5. Expected differences: these captures vs the native app (2025–26)

1. **Rail contents**: the app shows avatar + red "+", Like, Comment, **Bookmark/Favorite**, Share, and a spinning music disc. Mobile web drops Bookmark. Desktop web drops the avatar and disc and uses small 20px icons.
2. **Icon size**: the app uses ~36–40pt icons with soft drop shadows and ~12–13pt semibold counts. Mobile web uses 32px with 13px/600. Desktop uses 20px with 12px/700 at 75% white.
3. **Top bar**: the app has centered tabs (e.g. "Explore · Following · **For You**", with a 2px white underline on the active tab), a LIVE icon at left, and search at right. Mobile web replaces this with hamburger + "Open app" pill + search.
4. **Bottom tab bar**: the app uses Home / Friends (or Shop) / + / Inbox / Profile depending on region. Mobile web uses Home / Discover / + / Inbox / Profile at 49px. The app bar is ~49pt + home indicator (34pt on iOS).
5. **Ad chrome is app-only on these captures**: "Sponsored" pill, CTA bar (translucent → colored after 2–7 s), "Promoted music", the optional anchor/product chip, and the comment-panel pinned CTA card. Ads were not observed on logged-out web.
6. **Caption**: the app shows **@handle or display name** at ~15–17pt semibold with the caption at ~14–15pt and "more" truncation. Spark ads show up to 4 lines; non-Spark captions have no hashtags/mentions.
7. **Fonts**: the app uses the TikTok Sans / TikTokDisplay family natively (Proxima Nova on older builds), and Android falls back to Roboto. Web uses TikTokFont / TikTokSans webfonts.
8. **Progress bar**: the app shows a thin progress bar only on longer videos or on interaction. Desktop web always shows a 4px red/white track with time readout and controls.
9. **Desktop**: the cinema layout (rounded 16px card, ambient glow, arrows inside the card) is new in 2026. Older desktop layouts (centered 9:16 card with circular grey action buttons beside it) are no longer what users see.
10. **Official ad mocks are older device frames** (iPhone 8 / iPhone X, ~2021–2023 UI). Proportions are reliable. Exact pt sizes of the 2026 app may differ by a few points (the 2025+ app uses a wider CTA, ~full-width minus the rail, with radius ~4).

---

## 6. Method / scripts
Scripts are in `/Users/awachi01/.claude/jobs/e0a63b16/tmp/research-tt/`:
- `desktop.js`: desktop screenshot and broad extraction
- `probe.js`: deep subtree computed-style dump (desktop and mobile)
- `extra.js`: pseudo-elements, hover state, 25-swipe ad search
- `caption.js`: mobile caption block
- `help.js` / `extract_help.py`: help-center scraping

Not done (per constraints): no login, no consent beyond the defaults, no CAPTCHA. No captcha or login wall appeared. Logged-out feeds served no ads.
