# Intake: questions to ask before building

Ask in rounds with AskUserQuestion (max 4 questions per call, multiple-choice with a recommended default first). Skip anything already answered in the brief or an attached sketch. Write answers into `notes.md` → "Brief" so the next person can see what was decided.

## Round 1: Scope (always ask)

| # | Question | Options / default |
|---|---|---|
| 1 | Which platforms? (multi-select) | LINE · Facebook · TikTok |
| 2 | Which devices? (multi-select) | Android (Galaxy, default for TH market) · iOS (iPhone) · Desktop |
| 3 | Which surfaces? (multi-select, depends on 1). For any LINE chat, also ask Round 3a (rich menu open? previous messages?) | LINE: OA chat · Flex message · rich menu · push/lock screen. FB: feed single image · carousel · video · Stories/Reels. TikTok: in-feed ad · Spark Ad (creator) · organic post · desktop web |
| 4 | How many screens and in what order? Is it a journey (CRM stages / campaign phases) or standalone ads? | free text; offer "I'll propose a storyboard" |

## Round 2: Brand

| # | Question | Notes |
|---|---|---|
| 5 | Brand name + LINE OA / FB page / TikTok handle as it should appear | handles must look real but avoid real third-party accounts |
| 6 | Brand assets: logo files, colours, fonts? Or may I pull them from the brand's public website? | if fetching: record source URLs in notes.md. Fonts: only use files the brand/agency is licensed for; else fall back to the kit's OFL fonts |
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

If L1 = open and L2 = previous messages, the visible chat area is small (~250 pt on iPhone with a large menu). Keep the new message short, or suggest a compact menu (Round 3b) so the message isn't hidden. Write both answers in notes.md → Brief.

## Round 3b: LINE rich menu (only if "rich menu" was picked in Q3)

Ask these with AskUserQuestion. Use the **ASCII previews** below as option `preview`s so the user can see the layouts side by side, and/or show them `templates/captures/*-line-richmenu-templates.png`.

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
| 15 | Show TikTok/Stories safe-zone guides? | no (internal review only) |
| 16 | Deadline / where to deliver | project `captures/` folder |

## Defaults when the user says "just go"

Android Galaxy frame, LINE dark mode, rich menu Large L6 shown with label "Menu", LINE chats with previous messages (bottom-anchored), FB light, TikTok dark; Thai copy; kit OFL fonts; **real photos found online for every image slot** (placeholders only for offers/prices); one storyboard screen per stage in the brief; overview board on.
