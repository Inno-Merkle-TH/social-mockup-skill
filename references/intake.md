# Intake: questions to ask before building

Ask in rounds with AskUserQuestion (max 4 questions per call, multiple-choice with a recommended default first). Skip anything already answered in the brief or an attached sketch. Write **every** answer into `notes.md` → "Brief", word for word for copy, because each shot is checked against it before delivery. Anything you decide without asking goes in `notes.md` → "Assumptions to confirm", and that list is shown to the user in the first delivery.

## Round 0: Preflight (before the first question)

Run `python3 scripts/preflight.py --brand <brand site> --surfaces line,fb,tiktok` (or just the surfaces in play). It tests whether a browser can render, whether this is a Mac, and whether the brand site and image sources are reachable.

- Paste its **TELL THE USER** lines into your **first reply**, before or alongside the Round 1 questions.
- **Brand site or image sources blocked:**
  - say so straight away;
  - name the exact files you need (OA profile logo, rich message hero at its size, rich menu tile images, Flex photos), plus the brand colours (hex) and CTA wording;
  - offer the alternative: allow the domain in network settings, then retry.
  - **Don't build with fake artwork while you wait.** You may build layout-only drafts if the user agrees, clearly labelled as drafts.
- **No browser:** say in the first reply that nothing can be rendered, exported or visually checked here. Deliver the bundle (`scripts/bundle.py`) plus the project ZIP, together with the list of unverified details.
- Copy the result into notes.md → Environment.

## Round 1: Scope (always ask)

| # | Question | Options / default |
|---|---|---|
| 1 | Which platforms? (multi-select) | LINE · Facebook · TikTok |
| 2 | Which devices? (multi-select) | Android (Galaxy, default for TH market) · iOS (iPhone) · Desktop |
| 3 | Which surfaces? (multi-select, depends on 1). For any LINE chat, also ask Round 3a (rich menu open? previous messages?) | LINE: OA chat · Flex message · rich menu · push/lock screen. FB: feed single image · carousel · video · Stories/Reels. TikTok: in-feed ad · Spark Ad (creator) · organic post · desktop web |
| 3c | **LINE only: rich message, Flex, or both?** Show the comparison from `references/line.md` ("Rich message vs Flex") as the option `preview` | Rich message (one designed image, text inside the art, no card) · **Flex** (white card: photo + live text + buttons) · Both (e.g. rich message then Flex carousel; ask the order). No silent default: if the user says "just go", use Flex for product/coupon cards and rich message for a promo banner, and list it under Assumptions to confirm |
| 4 | **Screens: do you already know which screens you want, or should I help you plan them?** Then follow Round 1b | **I know what I want** (list them) · **Help me plan** (Claude proposes) · A mix: I know some, fill in the rest |

## Round 1b: Screens (storyboard): ALWAYS settle this before building

Some users arrive with an exact shot list; others are exploring. Q4 decides which path, and both paths end with the same **confirmed storyboard table**. Write that table into notes.md → Storyboard. Every later question (copy, chat state, rich menu) is asked **per screen** from that table.

**Path A: "I know what I want"**
1. Ask: *"How many screens, and what's on each one? One line per screen is enough, e.g. '1. LINE chat with the promo message, 2. rich menu, 3. FB feed ad'."*
2. Turn the answer into the storyboard table (below), filling platform and device from Round 1. Ask only about gaps (for example which device screen 3 is on). Don't add, merge or drop screens on your own. If you think something is missing (e.g. no screen shows where the CTA leads), **suggest** it as an optional extra.

**Path B: "Help me plan"** (exploring)
1. Ask at most two short questions first, if the brief doesn't already say:
   - **Goal**: pitch / concept visuals · CRM journey (stages) · ad previews for approval · single hero shot.
   - **Audience / moment**: who sees it and when (e.g. new followers in launch week, members before a sale).
2. Propose **2–3 storyboard options of different sizes**, each as a short numbered list with one line per screen and why it's there. For example:
   - **Lean (3 screens)**: 1 LINE push on the lock screen · 2 LINE chat with the Flex offer · 3 rich menu.
   - **Standard (5)**: Lean, plus 4 FB feed ad · 5 TikTok in-feed ad.
   - **Full journey (8)**: teaser → launch → reminder → purchase → thank-you across LINE, FB and TikTok.

   Base them on the brief, the platforms from Round 1, and real patterns (`line.md`, `facebook.md`, `tiktok.md`). Ask with AskUserQuestion (options = the storyboards, recommended one first, `preview` = its numbered list), or as a numbered list in plain chat.
3. The user picks one and edits it ("drop 4, add a coupon screen"). Repeat the final list back as the storyboard table and get a clear yes.

**Path C: a mix.** Take the screens the user named as fixed, mark them "user", and propose the rest as "suggested". Confirm the whole table.

Storyboard table (repeat it in chat for confirmation, then copy it into notes.md):

| # | Platform · device | Surface | Purpose / stage | Key content | Source |
|---|---|---|---|---|---|
| 1 | LINE · Android | lock-screen push | teaser | "New drop Friday" notification | user |
| 2 | LINE · Android | OA chat + Flex | launch offer | Flex card, CTA "Shop now" | suggested |

Rules:
- **Default if the user says "you decide":** the Lean storyboard for their platforms, listed under Assumptions to confirm.
- More than about 10 screens: confirm that's intended, and offer to deliver in batches (first 3 for direction, then the rest).
- Once confirmed, the storyboard is the build list and the overview-board order. Changing it later means asking, not silently adding or removing screens.

## Round 2: Brand

| # | Question | Notes |
|---|---|---|
| 5 | Brand name + LINE OA / FB page / TikTok handle as it should appear | handles must look real but avoid real third-party accounts |
| 6 | Brand assets: **logo file, brand colours (hex), fonts, exact CTA wording**? Or may I pull them from the brand's public website? Ask in the first round of brand questions, because these are the guesses that most often turn out wrong | if fetching: record source URLs in notes.md. Fonts: only use files the brand/agency is licensed for; else fall back to the kit's OFL fonts |
| 7 | **Images: where should they come from?** Options: (a) I'll provide them · (b) use the brand's website / press kit · (c) **let Claude find images from the internet** (recommended when nothing is supplied) · (d) placeholders for now | default (c). See `references/image-sourcing.md`. Every image is logged in `assets/credits.json` |
| 8 | Brand voice + CTA style (pill / rounded / square; solid / outline) | default: brand's website button style |

## Round 3: Content

| # | Question | Notes |
|---|---|---|
| 9 | Copy: will you supply it, or should I write it? Language(s)? | default: write in the market language (TH) with EN notes |
| 10 | Offer details: product, price, discount, dates, conditions, legal line | never invent. Unknown → placeholder in notes.md |
| 11 | Campaign timeline (teaser / launch / pre-order / on-sale / sustain dates) | all screens must agree. Check weekdays |
| 12 | Persona(s): name, segment, what they own/did (for personalised CRM screens) | default: plausible local first name, no real people |

## Round 3a: LINE chat screen state (ask for EVERY LINE chat mockup)

| # | Question | Options / default | Kit |
|---|---|---|---|
| L1 | **Rich menu: open or not?** | **Open** (menu shown under the chat; most OAs set "Shown") · Collapsed (bar only: "⌨ Menu ▾") · No rich menu (normal input bar "+ 📷 🖼 Aa") | open: `.rm` + `.ln-bar` with `.tri.up` · collapsed: `.ln-bar` with `.tri` · none: `.ln-input` (+ `.ln-qrs` quick replies if any) |
| L2 | **Only the new message(s), or with previous messages too?** | **With previous messages** (realistic: older broadcasts/Flex scroll under the header, newest at the bottom) · Only the new message(s) (fresh chat: "Today" + message at the top, rest of the screen empty wallpaper) | with history: `.ln-msgs.bottom` + 1–3 older messages above "Today" (a past broadcast, Flex or rich message) · fresh: `.ln-msgs` (top-anchored) |

L2 wording matters. "Only the new message" = **top-anchored** fresh chat. Never bottom-anchor it, and never drop a message from it.

If the content doesn't fit (for example a square rich message plus a text bubble with the large menu open), **don't remove or move anything on your own**. Tell the user and offer options: a compact menu, a shorter text, the rich message at 1040×700 (only if their OA Manager template allows it), or an extra screen with the menu collapsed.

If L1 = open and L2 = previous messages, the visible chat area is small (~250 pt on iPhone with a large menu). Keep the new message short, or suggest a compact menu (Round 3b) so the message isn't hidden. Write both answers in notes.md → Brief.

## Round 3b: LINE rich menu (only if "rich menu" was picked in Q3)

**Always show the layout picker first, before asking R1/R2.** People choose a layout by looking, not by reading codes. The picker shows every layout: the 7 large and 5 compact OA Manager templates, plus custom and tabbed (API). Each one has its reply code, tap areas, area count and a "good for" hint:
- `templates/richmenu-picker.png` (2432×2612, 260 KB) and `templates/richmenu-picker.svg` (16 KB, self-contained: no fonts, images or scripts). Regenerate both with `python3 scripts/richmenu_picker.py --png` after any layout change in `kit.css`.

Show it so it actually appears in the conversation, depending on where you run:

| Where | How to show it |
|---|---|
| **Claude app** (web / desktop) | Create an **SVG artifact** (`image/svg+xml`) whose content is `templates/richmenu-picker.svg` copied **unchanged**, so it renders inline. If artifacts aren't available, copy the PNG to the outputs folder (`/mnt/user-data/outputs/` when it exists) so it appears as a file card |
| **Cowork** | Copy `richmenu-picker.png` into the user's working/outputs folder and name it in your message, so it shows as an image the user can open. Then ask the question |
| **Claude Code** | Run `open templates/richmenu-picker.png` (macOS; `xdg-open` on Linux) so it pops up, **and** print its path. Then ask with AskUserQuestion using the ASCII previews below |
| Nothing can display images | Paste the ASCII block below as a code block in your message |

Then ask. **AskUserQuestion takes at most 4 options**, so split the choice:
1. **R1 size**: Large (7 layouts, default) · Compact (5 layouts, more chat visible) · Advanced: custom or tabbed (Messaging API).
2. **R2 layout**, options from the chosen group with ASCII `preview`s:
   - Large: **L6** (default) · L4b · L4 · "Other: type L3, L2r, L2c or L1 from the picture".
   - Compact: **C3** (default) · C2 · C2l · "Other: type C2r or C1".
   - Advanced: custom · tabbed.
3. In plain chat without AskUserQuestion, ask one short question: *"Which layout? Reply with a code from the picture (L6, L4b, C3…), or say 'you choose'."* Accept codes, area counts ("the 4-button one") or descriptions, repeat back the code you understood, and record it in notes.md → Brief.

If the user can't decide, propose one layout from the brief's number of actions (6 actions → L6, banner + 3 → L4b, 3 actions with chat focus → C3). Mark it in Assumptions to confirm.

| # | Question | Options / default |
|---|---|---|
| R1 | Size? | **Large 2500×1686** (default, half the chat) · Compact 2500×843 (keeps more chat visible) |
| R2 | Layout? (show the previews) | Large: **L6** 3×2 (default) · L4 2×2 · L4b wide top + 3 · L3 big left + 2 · L2r 2 rows · L2c 2 columns · L1 full. Compact: **C3** 3 columns (default) · C2 halves · C2l ⅔+⅓ · C2r ⅓+⅔ · C1 full. Advanced (Messaging API, the client's dev team must build it): **custom** areas (≤20) · **tabbed** (tab strip, one menu per tab) |
| R3 | What goes in each area (A, B, C…)? Label + action (link / coupon / text / reward card / switch tab) | default: propose from the brief (order, coupons, stamps, store finder, help) and confirm |
| R4 | Look? | **Photo + type** (default, most realistic) · icons + labels on brand colour · mixed (photo hero + icon tiles) |
| R5 | Chat-bar label + default state | label **"Menu"/"เมนู"** (default) or custom ≤14 chars · default **Shown** (menu open) or Collapsed (bar only) |

Rules to remember: OA Manager allows **only** the 12 templates (no 5-area option; ≤6 areas). Custom and tabbed menus need the Messaging API (say so in notes.md). Rich menus never show on LINE for PC/Mac. Area action labels are ≤20 chars (accessibility only, not displayed).

ASCII previews (copy into AskUserQuestion `preview`):

```
L6  3×2            L4  2×2            L4b wide top + 3   L3  big left + 2
┌───┬───┬───┐      ┌─────┬─────┐      ┌───────────┐      ┌───────┬───┐
│ A │ B │ C │      │  A  │  B  │      │     A     │      │       │ B │
├───┼───┼───┤      ├─────┼─────┤      ├───┬───┬───┤      │   A   ├───┤
│ D │ E │ F │      │  C  │  D  │      │ B │ C │ D │      │       │ C │
└───┴───┴───┘      └─────┴─────┘      └───┴───┴───┘      └───────┴───┘
L2r 2 rows         L2c 2 columns      L1  full
┌───────────┐      ┌─────┬─────┐      ┌───────────┐
│     A     │      │     │     │      │           │
├───────────┤      │  A  │  B  │      │     A     │
│     B     │      │     │     │      │           │
└───────────┘      └─────┴─────┘      └───────────┘
C3  3 columns      C2  halves         C2l ⅔ + ⅓          C2r ⅓ + ⅔          C1  full
┌───┬───┬───┐      ┌─────┬─────┐      ┌───────┬───┐      ┌───┬───────┐      ┌───────────┐
│ A │ B │ C │      │  A  │  B  │      │   A   │ B │      │ A │   B   │      │     A     │
└───┴───┴───┘      └─────┴─────┘      └───────┴───┘      └───┴───────┘      └───────────┘
tabbed (API)                custom (API, any ≤20 areas)
┌─────┬─────┬─────┐         ┌───────┬───┐
│Menu▔│Rewds│Store│         │       │ B │
├───┬─┴─┬───┴─────┤         │   A   ├───┤
│ A │ B │ C │               │       │ C │
├───┼───┼───┤               │       ├───┤
│ D │ E │ F │               │       │ D │
└───┴───┴───┘               └───────┴───┘
```

## Round 4: Output

| # | Question | Default |
|---|---|---|
| 13 | Theme | LINE dark on Android, light on iOS; FB light; TikTok always dark |
| 14 | Export | transparent PNG per screen (3× phone, 2× desktop) + overview board |
| 14a | In a phone frame, or the screen only (like a real screenshot, no phone)? | in the phone frame; screen only → `--bare` (rounded corners kept → `--bare round`) |
| 14b | Also a video walking through the screens? If yes: which screens in which order, what gets tapped, and the format (MP4 on a plain background, 9:16 canvas, 16:9 for slides, or transparent .mov for editing). See `references/video.md` | no video; if yes, MP4 of the confirmed storyboard order, phone on light grey |
| 15 | Show TikTok/Stories safe-zone guides? | no (internal review only) |
| 16 | Deadline / where to deliver | project `captures/` folder |

## Defaults when the user says "just go"

Android Galaxy frame, LINE dark mode, LINE message format per the 3c rule (listed as an assumption), rich message 1040×1040, rich menu Large L6 shown with label "Menu", LINE chats with previous messages (bottom-anchored), FB light, TikTok dark; Thai copy; kit OFL fonts; **real photos found online for every image slot** (placeholders only for offers/prices); one storyboard screen per stage in the brief; overview board on.
