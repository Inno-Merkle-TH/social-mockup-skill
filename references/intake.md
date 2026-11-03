# Intake: questions to ask before building

Ask in rounds with AskUserQuestion (max 4 questions per call, multiple-choice with a recommended default first). Skip anything already answered in the brief or an attached sketch. Write answers into `notes.md` → "Brief" so the next person can see what was decided.

## Round 1: Scope (always ask)

| # | Question | Options / default |
|---|---|---|
| 1 | Which platforms? (multi-select) | LINE · Facebook · TikTok |
| 2 | Which devices? (multi-select) | Android (Galaxy, default for TH market) · iOS (iPhone) · Desktop |
| 3 | Which surfaces? (multi-select, depends on 1) | LINE: OA chat · Flex message · rich menu · push/lock screen. FB: feed single image · carousel · video · Stories/Reels. TikTok: in-feed ad · Spark Ad (creator) · organic post · desktop web |
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

## Round 4: Output

| # | Question | Default |
|---|---|---|
| 13 | Theme | LINE dark on Android, light on iOS; FB light; TikTok always dark |
| 14 | Export | transparent PNG per screen (3× phone, 2× desktop) + overview board |
| 15 | Show TikTok/Stories safe-zone guides? | no (internal review only) |
| 16 | Deadline / where to deliver | project `captures/` folder |

## Defaults when the user says "just go"

Android Galaxy frame, LINE dark mode, FB light, TikTok dark; Thai copy; kit OFL fonts; **real photos found online for every image slot** (placeholders only for offers/prices); one storyboard screen per stage in the brief; overview board on.
