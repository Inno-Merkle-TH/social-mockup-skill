# <Project name>: mockup notes

## Environment (from `scripts/preflight.py`, paste its result)
- Render/export possible here: yes / **no**. If no, nothing was visually checked; say so in every delivery.
- macOS (real SF Pro): yes / no
- Brand site reachable: yes / **no**. If no, list the files the user was asked to upload.
- Image sources reachable:

## Brief (intake answers: every shot is checked against this before delivery)
- Brand / OA / page / handle:
- Platforms × devices:
- Screens (order):
- Language / theme:
- **LINE message format** (rich message / Flex / both, and order):
- **LINE chat state per shot**: rich menu open / collapsed / none · only the new message (top-anchored) / with previous messages (bottom-anchored)
- **Exact copy per shot** (text bubble, CTA wording): every item listed here must appear in the shot
- Rich menu: size · template · areas A–… · look · bar label
- Brand colours (hex), logo file, CTA wording: confirmed by user? yes / no

## Pre-delivery check against the Brief
| Shot | Brief items present? | Anchoring as asked? | Format as asked? | Anything removed or moved? (must be "no", or agreed with the user) |
|---|---|---|---|---|

## Assumptions to confirm (show this list to the user in the FIRST delivery)
| # | Assumption | Why guessed | Status (open / confirmed / changed) |
|---|---|---|---|

## Unverified details (tell the user)
- e.g. "Rich message margin, radius and width not yet verified against a real phone (references/line.md)"
- e.g. "No browser here: nothing rendered; layout checked only in code"

## Timeline (all screens must agree)
| Phase | Dates |
|---|---|
| Teaser | |
| Launch | |
| Pre-order | |
| On-sale | |
| Sustain | |

## Open placeholders (must be confirmed by client)
| Screen | Item | Current value | Owner |
|---|---|---|---|

## Image log
- Sources: see `assets/credits.json`
- Cleaning: see `assets/clean-log.txt` (`scripts/clean_image.py`, run on every upload)
- Size checks (`clean_image.py --for …`): warnings and how they were resolved

## Export
`node <skill>/scripts/export.cjs .` → captures/ · single file: `python3 <skill>/scripts/bundle.py .` → dist/
