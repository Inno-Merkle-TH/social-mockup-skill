# Facebook

## Surfaces and kit classes

| Surface | Markup | Notes |
|---|---|---|
| Feed (Android) | `.screen.light.fb` → `.sb` `.fb-top` `.fb-tabs` `.fb-gap` `.fb-post.grow` `.sysnav` | **tabs on top** on Android |
| Feed (iOS) | same but `.fb-tabbar` at the bottom (above `.sysnav`) | **tab bar at the bottom** on iOS, with labels |
| Post header | `.fb-ph` → `.av` `.nm` `.mt` ("Sponsored · 🌐") `.ac` (… ✕) | ads always show "Sponsored"/"ได้รับการสนับสนุน" |
| Primary text | `.fb-tx` (+ `.more` "See more") | |
| Single image/video | `.fb-media` (default **4:5**; `.r11` 1:1, `.r191` link ad) + `.fb-link` | never a fixed height |
| Carousel | `.fb-car > .fb-cc` | show 1.3 cards |
| Reactions/actions | `.fb-rx` + `.fb-act` | |
| Stories / Reels ad | `.screen.dark` → `.fb-full` + `.fb-prog` `.fb-who` `.fb-swipe` | 9:16 |
| Desktop | `.dev.desktop` → `.chrome-tabs` `.chrome-bar` `.fbd` (`.fbd-nav` `.fbd-body` 3 cols, feed 590 px) | |
| Dark mode | add `.dark` next to `.fb` | |

## 2026 app anatomy (verified on iPhone 17 Pro captures, Nov 2026, and Meta Help Center)

- **Label**: "**Ad** · 🌐" under the page name. Meta is replacing "Sponsored" with "Ad" (Instagram done Mar 2026; Facebook rolling out, already live on the captured device). Default to "Ad"; use "Sponsored" only if the client asks for the older look. Desktop still shows "Sponsored" in our measurements.
- **iOS header**: ☰ · facebook wordmark … + · search · Messenger (badge). Classes `.fb-hdr`.
- **iOS tab bar**: floating glass capsule (iOS 26), icons only, 54 px tall, 16 px above the bottom, selected tab on a grey pill. Feed scrolls underneath. Class `.fb-capsule`.
- **Android tabs**: top row is still the majority; some accounts got bottom tabs in May 2026. Ask which, default top.
- **Primary text**: often a single line ending "… See more" (`.fb-tx.one`).
- **Link bar**: domain (13 px, grey) + title (16 px, 600) + grey CTA button radius 8 (`.fb-link`).
- **Actions**: icons with counts, no labels (👍 822 💬 40 ↗ 231) + blue like-reaction at right (`.fb-cnt`).
- **Social context** line on organic posts: "Name reacted" (`.fb-ctx`).
- **Dark mode**: bg `#252728`, text `#F2F4F7`, secondary `#B0B3B8`, link bar `#333334`, button `#474748`.
- **Desktop (measured)**: card 500 px, radius 8, shadow `0 1px 2px rgba(0,0,0,.2)`, name 15/600, body 15/20, page bg `#F0F2F5`, top bar 56 px.

## Real-platform constraints (Meta Ads)

- Ads Guide 2026: feed image/video 4:5 (1440×1800), primary text 50–150, headline 27; carousel 1:1, 2–10 cards, primary 80, headline 20, description 18; Stories 9:16, primary 125, headline 40, keep 14% top / 35% bottom / 6% sides clear; Reels primary 40, headline 55. Full CTA list (54 options) in `references/screens/facebook/SPEC.md`.

- Primary text: ~125 characters show before "See more" in feed. Put the hook first.
- Headline (link bar `.fb-link .t`): ≤40 chars recommended, truncates with ellipsis on mobile around 25–30.
- CTA button: must be one of Meta's fixed CTA options (Shop now, Learn more, Sign up, Book now, Get offer, Order now, Contact us, Download, Subscribe, Apply now, Send message, Watch more…). In Thai UI these are Meta's own translations (e.g. ซื้อเลย, ดูข้อมูลเพิ่มเติม). Don't write custom CTA labels on the native button; custom CTAs belong inside the creative.
- Creative ratios: feed 1:1 or 4:5; Stories/Reels 9:16 with ~14% top and ~20% bottom kept free of key text.
- Carousel: 2–10 cards, 1:1, each with its own headline + link.

## Realism

- Plausible engagement: reactions in the hundreds to low thousands for brand ads; comments roughly 3–10% of reactions.
- The FB wordmark/glyphs in `icons.svg` may appear in internal reviews **and** pitch/presentation mockups, where they depict the platform. Never place them inside the brand's own creative or deliverable ad assets.
- Viewer avatar (tab bar "me", desktop top-right): use the user-supplied photo or an initial; never a real third party.

## Desktop (facebook.com, logged-in home) · `.fbw`

- **Structure:** a fixed 56 px top bar holds the blue "f" (40 px), a 240 px "Search Facebook" pill, 5 centred tabs and 4 round 40 px buttons (grid, Messenger, bell, avatar). Below it are the left nav (360 px), the feed column (590 px, centred between the rails) and the right rail (360 px). Both rails are sticky; only the feed scrolls (`.fbw-col` `--scroll`).
- **Left nav:**
  - Items: you, Meta AI, Friends, Memories, Saved, Groups, Video, Marketplace, Feeds, Events, Ads Manager, See more.
  - Item style: 52 px rows with 36 px coloured glyphs.
  - Below the items: "Your shortcuts".
- **Feed:** the Stories tray (140×250 cards, "Create story" first), then the composer ("What's on your mind, …?" with Live video / Photo/video / Feeling/activity), then posts.
  - **Post:** radius 8. Header: 40 px avatar, name 15/600, "Sponsored · 🌐" 13 px.
  - **Text and link footer:** text 15/20 with padding 4 16 16. The link footer is `#F0F2F5` with an UPPERCASE domain, a 17/600 headline and a grey CTA.
  - **Engagement:** a reactions row, then **labelled** Like / Comment / Share.
- **Right rail:** Sponsored (130 px square thumbnail + headline + domain), Birthdays, Contacts (with video, search and ••• icons, plus online dots). A floating new-message button sits bottom right.
- **Creative ratio:** use 1:1 on desktop so the whole ad fits in a 1440×900 window. A 4:5 creative is about 737 px tall in the 590 column; show it with `.fbw-media` (default 4:5) and the `fb-desktop-home` composition if needed.
- **Status:** built from the live site's structure; widths are not yet pixel-calibrated. Add a desktop screenshot to `references/screens/device/` and copy `screens/calibrate/` to tune it.
