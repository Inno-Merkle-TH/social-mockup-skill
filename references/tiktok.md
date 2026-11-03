# TikTok

## Surfaces and kit classes

| Surface | Markup | Notes |
|---|---|---|
| For You (mobile) | `.screen.dark > .tt` → `.vid` `.sb.over` `.tt-top` `.tt-rail` `.tt-cap` `.tt-nav` `.sysnav.over` | always dark; status bar overlays the video |
| In-feed ad | `.tt-cap` with brand name, `.sp` "Sponsored", `.tt-ctab` CTA bar | add `.lit` to show the CTA after it turns colour (~3–6 s into the ad), using `--tt-cta` |
| Spark Ad | creator handle in `.tt-cap .nm` + `.sp`, creator avatar in rail | boosts an organic creator post, so it reads as a creator video |
| Organic post | no `.sp`, no `.tt-ctab` | |
| Safe-zone guide | `.tt-safe` inside `.tt`, visible with `?safe=1` or `export.cjs --safe` | approximate, internal only |
| Desktop web | `.dev.desktop` → `.ttd` (`.ttd-side`, `.ttd-main > .ttd-vid + .ttd-rail`) | white UI; add `class="wt"` to white sprite icons |

## Real-platform constraints

- Video 9:16 (1080×1920). TikTok publishes downloadable safe-zone templates rather than pixel values. Practical guide: keep key text/logo out of the right ~14% (rail), bottom ~25% (caption + CTA), top ~13% (tabs). Longer captions shrink the safe area.
- Ad caption ~ 1–100 characters (keep to 1–2 lines + "more"). Display name for non-Spark ads = brand name.
- CTA comes from TikTok's fixed list (Shop now, Learn more, Order now, Download, Sign up, Contact us, Book now…).
- iOS vs Android: same layout; iOS has the taller status area (tabs at ~56 px) and home indicator; Android has the punch-hole and gesture bar.

## Realism

- TikTok's own UI uses TikTok Sans (OFL, bundled). Video overlay text belongs to the creative (brand font or TikTok's in-app text styles).
- Counts: in-feed brand ads, likes ~1K–50K, comments ~1–3% of likes, saves ~3–8%, shares ~2–5%. Spark Ads carry the creator's organic numbers (can be 10× higher). Use K/M abbreviations above 10,000 (48.2K).
- The rail sits over the video, so creative text that runs under it looks like a real video. Keep it out of the rail for client polish (use `?safe=1` to check).
