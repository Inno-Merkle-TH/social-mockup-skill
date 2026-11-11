# Facebook ad placements: reference spec

Collected 2026-11-03. No login was used. Sources:
- Meta Ads Guide (`/business/ads-guide/update/...`), rendered with Playwright and real Chrome.
- Meta Business Help Center.
- Live DOM of facebook.com/Meta (desktop 1440x900 at DSF2) and m.facebook.com/Meta (iPhone 15 Pro and Pixel 7 emulation), all logged out.
- Press reports, used for the native-app facts.

Scripts are in `/Users/awachi01/.claude/jobs/e0a63b16/tmp/research-fb/`: `adsguide2.js`, `mock2.js`, `frames.js`, `desktop2.js`, `desk3.js`, `mobile2.js`. Raw extractions are in `./data/`.

Confidence tags:
- **[M]** measured from the computed DOM.
- **[O]** official Meta text.
- **[V]** read visually off an official mockup or screenshot.
- **[P]** press or user report, not confirmed by Meta.

---

## 1. Images in this folder

### Official Meta Ads Guide placement mockups

The Ads Guide shows each placement as an iPhone-frame mockup. The frame is a static webp, `official_assets/phoneframe_feed_asset.webp`. The screen content is a looping DASH video (blob) layered on top. The PNGs are element screenshots at DSF3 (~1050x2151 px), so they show the video frame plus the frame.

| File | Source URL (all `https://www.facebook.com/business/ads-guide/update/` + …) | Shows |
|---|---|---|
| `official_adsguide_image_facebook-feed.png` | `image/facebook-feed` | **Feed single image (iOS).** Header: avatar, name "Feroldi's", "Sponsored · 🌐", "•••". Square image. Grey footer containing a bold headline, a 2-line description and a **full-width brand-coloured CTA button** ("Shop now"). Reaction row (👍😮❤ 14 … "2K comments"), a divider, then Like / Comment / Share. Grey separator between posts. iOS bottom tab bar: Home, Video (active, blue), Groups, Bell, Menu. |
| `official_adsguide_video_facebook-feed_t0-3.png` (+ `…video_facebook-feed.png`) | `video/facebook-feed` | **Feed video (iOS).** Verified badge, "Sponsored · 🌐", "•••", "✕". Primary text with "… See more". 4:5 video. Link footer: small thumbnail, domain "lalueur.com", bold headline "Daily foaming face wash", grey **"Shop now"** button on the right. Reaction row, then Like / Comment / Share. Bottom tab bar: Home (active, blue), Video, Groups, Bell, Menu. |
| `official_adsguide_carousel_facebook-feed.png` | `carousel/facebook-feed` | **Feed carousel (iOS).** Header with "•••" and "✕". Square cards (~80% width) with a peek of the next card. Each card has a light-grey footer: 2-line bold title plus a grey **"Shop now"** button. Below: reactions, Like / Comment / Share. |
| `official_adsguide_video_facebook-story_t0-3.png` / `official_adsguide_video_facebook-story.png` | `video/facebook-story` | **Stories video.** Progress bar at top. Avatar, name, "Sponsored" on the line *below* the name. "•••" and "✕" top right. Sound button on the left. Bottom-centre white pill CTA: link icon + **"SHOP NOW"** (condensed caps). Black letterbox bands top and bottom. |
| `official_adsguide_image_facebook-story_t0-3.png` | `image/facebook-story` | **Stories image.** Same chrome as the Stories video. White pill "🔗 SHOP NOW" at the bottom. |
| `official_adsguide_image_facebook-story_t4.png`, `official_adsguide_image_facebook-story.png` | `image/facebook-story` | Later frame showing the **post-click in-app browser** (✕, ‹ ›, domain, bookmark). Not ad chrome. |
| `official_adsguide_carousel_facebook-story.png` | `carousel/facebook-story` | **Stories carousel.** Multi-segment progress bar. "[FB Test Page] Jasper's Market / Sponsored". Image in the top half, large white headline on a dark field, white pill "SHOP NOW". |
| `official_adsguide_video_facebook-facebook-reels_t0-3.png`, `…_t8.png`, `…video_facebook-facebook-reels.png` | `video/facebook-facebook-reels` | **Facebook Reels ad.** Top: back "‹", camera, profile avatar. Right rail: Like (21.1K), Comment (780), Share (52), "•••". Bottom-left: avatar, name, "Sponsored" on its own line below the name, 1-line caption with "… See More", then a **full-width translucent grey CTA bar "Shop Now"** (left of the right rail). Black "Add Comment…" bar at the very bottom. |
| `official_adsguide_image_facebook-facebook-reels_t0-3.png`, `…_t3.png`, `…image_facebook-facebook-reels.png` | `image/facebook-facebook-reels` | Image Reels mockup. **It uses Instagram-style chrome**: heart and paper-plane icons, IG bottom nav, "Learn more ›" pill that turns orange, "Sponsored" with a megaphone icon. This looks like a reused IG asset; don't copy it for FB. |
| `official_adsguide_video_facebook-facebook-reels-overlay.png` | `video/facebook-facebook-reels-overlay` | "Ads on Facebook Reels" (post-loop overlay) placement. The captured frame is mid-click-through (Facebook in-app browser sheet). |
| `official_adsguide_image_facebook-right-hand-column.png` | `image/facebook-right-hand-column` | **Desktop right column ad.** ~1:1 rounded thumbnail on the left, 3-line bold-ish headline, grey domain line, on a #F0F2F5 background. This is the only official desktop placement image. |
| `official_adsguide_image_facebook-search.png` | `image/facebook-search` | Search results ad (mobile). |
| `official_adsguide_image_facebook-marketplace.png` | `image/facebook-marketplace` | Marketplace placement (mobile). |
| `official_help_safezones_page.png` | https://www.facebook.com/business/help/980593475366490 | Screenshot of the Help Center safe-zone article. |
| `official_assets/phoneframe_feed_asset.webp` | https://static.xx.fbcdn.net/mci_ab/public/cms/?ab_b=e&ab_page=CMS&ab_entry=2751573238231713&version=1792888034&transcode_extension=webp | Raw phone frame, 1000x2048, downloaded with curl. |
| `official_assets/right_column_asset.webp` | https://static.xx.fbcdn.net/mci_ab/public/cms/?ab_b=e&ab_page=CMS&ab_entry=980970088988893&version=1790347374&transcode_extension=webp | Raw right-column ad image, 336x147. |
| `official_assets/search_asset.webp` | https://static.xx.fbcdn.net/rsrc.php/yk/r/Cp9sP_JomA-.webp | Raw search placement mockup, 1860x3792. |

Notes on these mockups:
- The Ads Guide mockups are iOS-styled (iPhone notch, 2:04 / 9:41 status bar). Meta publishes **no Android mockups**.
- The Ads Guide has **no desktop News Feed mockup**. Use the live DOM measurements in §3 instead.

### Live DOM screenshots (logged out)

| File | Shows |
|---|---|
| `dom_desktop_top.png`, `dom_desktop_initial.png` | facebook.com/Meta at 1440x900 DSF2: logged-out header (logo plus login form) and Page header. |
| `dom_desktop_scrolled.png` | Intro card and a real post card (video grid, link footer with "WhatsApp" button, reactions, Like / Comment, comments). The logged-out bottom sign-up bar covers the bottom. |
| `dom_desktop_postcard.png` | Element screenshot of the post card. Fixed bars overlap the top and bottom. |
| `dom_iphone-15-pro_scroll0…5.png`, `dom_pixel-7_scroll0…5.png` | m.facebook.com/Meta at 393x852 DSF3 and 412x915 DSF2.625, with the login modal hidden through the DOM. Page header, then the post feed. **Mobile web, not the native app.** |
| `dom_iphone-15-pro_top.png`, `dom_pixel-7_top.png` | First paint. Pixel shows the "See more from Meta" login modal. |

---

## 2. Official ad specs (Meta Ads Guide, captured 2026-11-03) [O]

| Placement | Ratio (recommended) | Resolution | Primary text | Headline | Description | Other |
|---|---|---|---|---|---|---|
| FB Feed, image | **4:5** | 1440x1800 | 50–150 chars | 27 | – | JPG/PNG, ≤30 MB, min width 600, min height 750 (4:5), ratio tolerance 3% |
| FB Feed, video | **4:5** | 1440x1800 | 50–150 | 27 | – | MP4/MOV/GIF, 1 s–241 min, ≤4 GB, min 120x120. With the **Awareness objective** (or reach / 2-s view / impressions / post-engagement goals), the **headline, description and CTA footer are hidden on mobile Feed**. |
| FB Feed, carousel | **1:1** | ≥1080x1080 | 80 | 20 | 18 | 2–10 cards, landing URL required, image ≤30 MB, video ≤4 GB, 1 s–240 min, tolerance 3% |
| FB Feed, collection | 1.91:1 to 1:1 | ≥1080x1080 | 125 | 40 | – | Instant Experience required |
| FB Stories, image | **9:16** | 1440x2560 | 125 | 40 | – | ≤30 MB, min width 500, tolerance 1% |
| FB Stories, video | **9:16** | 1440x2560 | 125 | 40 | – | 1 s–3 min, ≤4 GB, min width 250, tolerance 1% |
| FB Stories, carousel | 1:1 recommended (canvas ≥1080x1920) | – | 125 | 40 | – | 3–10 cards, images only (no video), min width 500 |
| FB Reels, video | **9:16** | 1440x2560 | **40** | **55** | – | No max duration, ≤4 GB, no auto-captioning |
| FB Reels, image | 9:16 | 1440x2560 | 40 | 55 | – | min 600x600, tolerance 3%. Guide advises no text on the image. |
| Ads on FB Reels (post-loop overlay) | 1:1 | 1440x1440 | 60 | – | – | MP4/MOV, 4–15 s |
| FB right column (desktop) | 1:1 | ≥1080x1080 | – | 40 | – | min 254x133. Guide advises no text on the image. |
| FB Marketplace | 1:1 | ≥1080x1080 | 125 | 40 | 30 | ≤30 MB |
| FB Search results | 1.91:1 to 1:1 | ≥1080x1080 | 125 | 40 | 30 | min 600x600 |

### Safe zones [O]
- **Stories (image and video), Ads Guide:** keep about **14% top, 35% bottom and 6% each side** free of text and logos. On a 1080x1920 canvas that is ≈ 269 px top, 672 px bottom and 65 px each side.
- **Stories carousel:** keep **14% (250 px) top and 20% (340 px) bottom** free.
- **Reels:** the Ads Guide links to the Help Center article (https://www.facebook.com/business/help/980593475366490). That article gives no percentages for 9:16 in Stories, Reels, Feed and in-stream reels. It says to keep top, bottom and side edges free, and to use the **Safe Zone guardrail (yellow overlay) in Ads Manager**. If a Reels ad carries disclaimers, **leave the bottom 40% free**.
- **Screens taller than 9:16:** FB may zoom the creative (cropping outside the safe zone) or letterbox it with black. Both cases appear in the Stories mockups.
- **Label change [O]:** the Help article says verbatim that ads "previously marked with a 'Sponsored' label will now display an 'Ad' label instead" (gradual rollout). See §5.

### CTA button options [O]
These come from the Ads Guide "View available calls to action" list, image/facebook-feed. The list changes with objective and conversion location.

- **Awareness** (On your ad), 24: Download, Apply Now, Try in camera, Subscribe, Send message, Shop now, See details, Order now, Find your groups, Book now, Sign up, Learn more, Send WhatsApp message, Get directions, Listen now, Contact us, Get showtimes, Watch more, Apply now, Request time, Get quote, See menu, Call now, Dial Code.
- **Traffic** (Website), 32: Download, Subscribe, Watch more, Shop now, Send message, Send WhatsApp message, Learn more, Sign up, Book now, See details, Remind me, Visit profile, Apply Now, Get tickets, Check Availability, Get updates, Watch live video, Try in camera, Get promotions, Contact us, Order now, Apply now, Get quote, Buy tickets, Get offer, Call now, Get access, Listen now, Request time, Get showtimes, Visit Instagram profile, See menu.
- **Engagement** (Messenger), 39: adds Chat now, Raise money, Get in touch, Ask us, Interested, Chat with us, Start a chat, Ask a question, Join channel, Donate now, View event, Play game, among others.
- **Leads** (Website), 31: adds Pre-register, Vote Now.
- **App promotion** (App), 14: Download, Subscribe, Order now, Shop now, Explore more, Install now, Learn more, Book now, Watch more, Sign up, See details, Listen now, Play game, Use app.
- **Sales** (Website), 38: adds Open link, Start Order.
- **Union of all placements and objectives (54):** Apply Now, Apply now, Ask a question, Ask us, Book now, Buy tickets, Call now, Chat now, Chat with us, Check Availability, Contact us, Dial Code, Donate now, Download, Explore more, Find your groups, Get access, Get directions, Get in touch, Get offer, Get promotions, Get quote, Get showtimes, Get tickets, Get updates, Install now, Interested, Join channel, Learn more, Listen now, Open link, Order now, Play game, Pre-register, Raise money, Remind me, Request time, See details, See menu, Send WhatsApp message, Send message, Shop now, Sign up, Start Order, Start a chat, Subscribe, Try in camera, Use app, View event, Visit Instagram profile, Visit profile, Vote Now, Watch live video, Watch more.
- Per-placement and per-objective lists are in `data/adsguide_specs_ctas.json`.
- Capitalisation is Meta's own and inconsistent ("Apply Now" vs "Apply now"). In-app buttons render sentence case, e.g. "Shop now" and "Learn more". The Stories pill renders **uppercase** ("SHOP NOW"). The Reels mockup shows "Shop Now".

---

## 3. Desktop web (facebook.com), measured [M]

Context: logged out, 1440x900, DSF2, Chrome on macOS, page https://www.facebook.com/Meta. Cookie banner: **none appeared** (non-EU IP), so nothing was declined. The login dialog was closed with its ✕. The logged-out header (logo plus login form) **differs from the logged-in header**, which has search, centre tabs and right icons; the logged-in header could not be measured. The card and post internals are the same Comet components used in News Feed.

### Global tokens (from CSS custom properties; full dump in `data/fb_web_css_vars.json`)

| Token | Value |
|---|---|
| Font stack (macOS) | `system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif` (`--font-family-apple`) |
| Font stack (Windows) | `Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif` (`--font-family-segoe`) |
| Font stack (default) | `Helvetica, Arial, sans-serif` |
| Page background `--web-wash` | **#F0F2F5** |
| Card / surface background | **#FFFFFF** |
| `--primary-text` | **#050505** |
| `--secondary-text` / secondary icon | **#65676B** |
| `--accent` / primary button | **#0866FF** (pressed #77A7FF) |
| `--blue-link` | #0064D1 |
| `--secondary-button-background` / `--wash` | **#E4E6EB** (text #050505) |
| `--attachment-footer-background` (link and CTA footer under media) | **#F0F2F5** |
| `--card-background-flat` | #F7F8FA |
| `--divider` | **#CED0D4** |
| `--media-inner-border` | rgba(0,0,0,0.1) |
| `--comment-background` (comment bubble) | #F0F2F5 |
| `--positive` / `--negative` | #31A24C / hsl(350,87%,55%) |
| `--disabled-icon` | #BCC0C4 |
| `--section-header-text` | #4B4C4F |
| Card radius `--card-corner-radius` | **8px** (Intro card computed `8px`, overflow hidden) |
| Card shadow (computed on feed and Page cards) | **`0 1px 2px rgba(0,0,0,0.2)`** (`--shadow-base`) |
| Elevated or popover shadow | `0 12px 28px 0 rgba(0,0,0,.2), 0 2px 4px 0 rgba(0,0,0,.1)` (`--card-box-shadow`) |
| Button radius | 6px (medium 10px, large 12px). Heights 36px (medium) and 40px (large). Horizontal padding 16px. |
| `--image-corner-radius` | 4px |
| `--header-height` | **56px** |
| Tab underline height | 3px |
| `--fds-blue-60` (legacy brand blue) | #1877F2 |

### Top nav bar (logged out)

| Element | Value |
|---|---|
| Bar | fixed, h **56px**, full width, bg #FFFFFF (`--nav-bar-background`). Logged-out it has a bottom shadow (visible in the screenshot). |
| Wordmark "facebook" (SVG) | x 32, y 17, **124x22px**, colour #0866FF |
| Login inputs | 188x40, radius 6, border 1px #CED0D4, 15px / 500, padding 8 12 10 |
| "Log in" button | 67x40, bg #0866FF, radius 6 |
| Logged-out bottom bar | fixed, h 133, white, shadow `0 0 5px rgba(0,0,0,.2)` |

### Post card (Page timeline post; same component as News Feed)

| Element | Value |
|---|---|
| Card width | **500px** (x 658 at 1440 viewport; Page timeline right column). Radius 8, white, shadow `0 1px 2px rgba(0,0,0,.2)`. |
| Header row | padding 12px. Avatar **40x40** circle at x+12, y+12. |
| Page name | **15px / 600**, lh 20px, #050505. Starts at x+60 (avatar 40 + 8 gap). |
| Meta line ("3d · 🌐") | **13px**, timestamp 600 weight (link), lh 16px, #65676B. Separator "·" weight 400. Starts 22px below the name top. |
| Body text container | padding **4px 12px 16px** |
| Body text | 15px / 400, lh 20px (1.3333), #050505. "See more" is 15px / 600 #050505. |
| Media | full-bleed 500px wide, no radius (multi-video grid: 249+2+249, 2px gaps) |
| Link / CTA footer under media | bg #F0F2F5. Title **17px / 600**, lh 20, #050505. Subtitle 15px / 400 #65676B, one line with ellipsis. Inner padding ≈ 12–16px. |
| CTA button in footer ("WhatsApp") | **h 36**, bg **#E4E6EB**, radius **6**, padding 0 12, label **15px / 600** #050505, 16px icon plus label |
| Reaction summary row | 18x18 reaction emoji (overlapping), count **15px / 400 #65676B**. Right side: comment and share counts 15px #65676B with icons. Row at ~y+608. |
| Action row (Like / Comment / Share) | each button 232x**32**, label **15px / 600 #65676B**, 20px outline icon. Hairline divider #CED0D4 above, inset 12–16px. |
| "View more comments" | 15px / 600 #65676B |
| Comment | avatar 32x32. Bubble bg #F0F2F5 radius 18. Name 13px / 600 #050505. Text 15px / 400 lh 20. "Top fan" badge 10px / 600 #65676B. Time "3d" 12px / 600 #65676B. |
| Section titles ("Intro") | 20px / 700, lh 24, #050505 |
| Page tabs ("Posts" active) | 15px / 600, active #0866FF, inactive #65676B |

Not measurable logged out (no ads are served without login): a real desktop "Sponsored" feed unit, the right-column "Sponsored" section, the logged-in nav (search pill, centre tabs) and the left rail. For those use the official right-column mockup and the same tokens.

---

## 4. Mobile web (m.facebook.com), measured [M]. **Not the native app.**

| Element | iPhone 15 Pro (393 wide, DSF3) | Pixel 7 (412 wide, DSF2.625) |
|---|---|---|
| Font | `system-ui` (SF Pro) | **Roboto** ("Roboto-V2") |
| Top bar | h 56, white, "facebook" wordmark #0866FF, "Log in" link 16/700 #0064D1, "Open app" pill #0866FF | same |
| Post avatar | **48x48** circle at x 7 | 48x48 |
| Name | **16px / 700**, lh 21, #000 | same |
| Verified badge | 16px glyph, #0866FF | same |
| Meta line ("3d · 🌐") | **12px / 400**, lh 16, #65686C | same |
| "•••" | 24px glyph, #65686C | same |
| Body | **16px / 400**, lh 21, #080809. "… See more" #65676B. Padding-left 9px. | same |
| Link / CTA footer | label (domain, uppercase "WHATSAPP") 12px #65686C. Title 16/700 #080809. Subtitle 16/400 #65686C. Button: outlined white pill with 12px / **700 uppercase** label #3B3C3E. | same |
| Reaction summary | 17–18px reaction icons. Text "X and 4K others" 16px #65676B. | same |
| Action row | 3 **pill buttons** (light grey bg, fully rounded), icon plus count, 16px #4B4C4F, row h 43 | same |
| Comment | avatar 42. "Top fan" 12/700 #65686C. Name 14/700. Text 16/400 lh 21. | same |

Mobile web uses a server-driven (Bloks) renderer: inline styles, icon fonts and no semantic article roles. Treat the values as visual guidance for the native app, not exact values.

---

## 5. Native app facts, 2025–26 (with sources)

| Topic | Finding | Source / confidence |
|---|---|---|
| **iOS tab bar** | Bottom tab bar. The official Ads Guide mockups (current) show 5 icons: **Home, Video, Groups/Friends, Notifications (bell), Menu (☰)**. Active tab is filled #0866FF with a blue indicator. | Ads Guide mockups [V] |
| **Android tab bar: did it move to the bottom?** | **Partially / in rollout.** Through 2025 Android kept the tab row **at the top** under the "facebook" header (Home, Video/Reels, Friends, Marketplace, Notifications, Menu), with repeated A/B tests of a bottom bar. In **May 2026** a server-side change moved the Android tab bar **to the bottom** for a subset of users, phones and tablets. Some users bounced back to the top within hours. One report says it only appeared with 3-button system navigation. Meta has made no official announcement. As of Nov 2026 the rollout appears **not universal**, so both layouts exist. | PiunikaWeb, 2026-05-21 [P]; Samsung Community thread (batch rollout) [P]; Androidayuda (Sep 2025: Material redesign, bottom nav, Home/Feeds tabs in testing) [P] |
| Bars hide on scroll | Scrolling down the feed hides **both the top bar and the bottom tab bar**. They reappear on scroll up. | HushFacebook issue #132, Oct 2026 [P] |
| Feed tabs | 2025 "OG Facebook" push: Friends tab revamp, and a "Feeds" tab (chronological friends / groups / pages) separate from the algorithmic Home. | TechCrunch 2025-03-27; Androidayuda [P] |
| **"Sponsored" → "Ad" label** | Meta Help Center (verbatim): ads "previously marked with a 'Sponsored' label will now display an 'Ad' label instead". The rollout is gradual. Instagram switched in March 2026. On Facebook the change was in small-scale testing as of March 2026. **Mockups should support both "Sponsored" and "Ad"**, defaulting to "Sponsored · 🌐" for FB. | Help Center 980593475366490 [O]; Social Media Today 2026-03-16 [P] |
| Feed ad anatomy (iOS, official) | Avatar plus name; "Sponsored · 🌐" beneath the name in secondary grey; "•••" and "✕" top right. Primary text with "… See more". Media full-bleed. **Grey footer (#F0F2F5)**: domain (small caps or grey), bold headline, optional description, grey **"Shop now"** button on the right. A newer variant has a full-width brand-coloured CTA under the headline (image-feed mockup). Below that: reaction emoji plus count, comment count on the right, thin divider, then Like / Comment / Share (newer builds also show Send). | Ads Guide mockups [V] |
| Carousel (feed) | Cards ~80% of viewport width, rounded ~8px, with a 1px light border. Next card peeks. Each card footer: 2-line bold headline (and description) plus a grey CTA button. Horizontal scroll. | Ads Guide mockup [V] |
| Stories ad | Segmented progress bar at top. Avatar, name, and **"Sponsored" on a second line** (white, ~70% opacity). "•••" and "✕" top right. Optional sound toggle. **CTA = white rounded pill at the bottom centre** with a blue link icon and an uppercase label ("SHOP NOW"). Older "swipe up" chevron is no longer used. Black bands when letterboxed. | Ads Guide mockups [V] |
| Reels ad | Top: back chevron, camera and avatar. Right rail: Like, Comment, Share counts and "•••", white icons. Bottom-left: avatar, name, **"Sponsored" below the name**, 1-line caption "… See More". **Full-width translucent grey CTA bar** (~44px, radius ~8) under the caption, left of the rail. Bottom "Add Comment…" input bar on black. | Ads Guide mockup [V] |
| Primary-text and headline limits in Reels | Primary 40 chars, headline 55 chars, so captions are truncated to 1 line. | Ads Guide [O] |
| iOS 26 Liquid Glass | No confirmed Facebook-app adoption found. WhatsApp (Meta) did adopt it on iOS. | Search, no FB result [P] |

### Source URLs
- Meta Ads Guide: https://www.facebook.com/business/ads-guide/update/ (placements: `image/facebook-feed`, `video/facebook-feed`, `carousel/facebook-feed`, `image|video|carousel/facebook-story`, `video|image/facebook-facebook-reels`, `video/facebook-facebook-reels-overlay`, `image/facebook-right-hand-column`, `image/facebook-marketplace`, `image/facebook-search`, `collection/facebook-feed`). The legacy URLs `/business/ads-guide/image/facebook-feed` etc. return HTTP 400 to curl. Slugs differ from the old ones: `facebook-story`, `facebook-facebook-reels`, `facebook-right-hand-column`.
- Safe zones and the "Ad" label: https://www.facebook.com/business/help/980593475366490
- Reels best practices: https://www.facebook.com/business/help/1708053352711643
- [PiunikaWeb, 2026-05-21: Facebook Android bottom navigation](https://piunikaweb.com/2026/05/21/facebook-app-update-bottom-navigation/)
- [Samsung Community: Facebook navigation bar](https://eu.community.samsung.com/t5/mobile-apps-services/facebook-navigation-bar/td-p/8370458)
- [Androidayuda: Facebook Android redesign (≈Sep 2025)](https://en.androidayuda.com/facebook-will-redesign-your-android-application-completely/)
- [Android Central: bottom bar test](https://www.androidcentral.com/facebook-trying-improve-one-handed-experience-its-android-app-bottom-bar)
- [HushFacebook issue #132 (Oct 2026)](https://github.com/SysAdminDoc/HushFacebook/issues/132)
- [Social Media Today, 2026-03-16: Sponsored → Ad](https://www.socialmediatoday.com/news/meta-is-switching-up-its-ad-transparency-labels-in-stream/814890/)
- [TechCrunch, 2025-03-27: Friends tab / OG Facebook](https://techcrunch.com/2025/03/27/facebook-debuts-a-revamped-friends-tab-as-part-of-its-return-to-og-facebook)

---

## 6. Gaps and blockers
- **No logged-in data.** There is no real Sponsored unit on desktop or mobile web, no logged-in desktop header, no left or right rails, and no live right-column ads. Ads are not served logged out.
- **No native-app screenshots.** Android has no official mockup at all. Native values are inferred from the official iOS mockups and from mobile-web DOM.
- The Ads Guide mockups are **video frames**, so the captured state depends on timing. Frames were seeked to t=0.3 s for consistency. The image-Reels mockup uses Instagram chrome.
- The cookie banner never appeared (non-EU region), so the decline flow was not exercised.
- **Not available:** CTA lists for Stories and Reels specifically, beyond what is in `data/adsguide_specs_ctas.json`. Some per-objective lists may have been captured before the UI finished updating, because counts shift between rows. The union list is reliable.
- No CAPTCHAs were hit. No login, posting or personal data entry was done.
