# QA checklist (run before telling anyone it's done)

**If nothing could be rendered here** (preflight said no browser), you can't tick the visual items. Say so in the delivery message, list them under notes.md → Unverified, and never describe the result as "checked".

## Automatic

`export.cjs` prints these, with details in `captures/qa.json`. `bundle.py` runs the same kit checks with `--verify`.
- [ ] 0 failed requests (fonts, images, sprite)
- [ ] 0 `statusbar-empty` / `icon-missing` issues (an empty status bar or a blank icon means kit.js or the sprite broke)
- [ ] 0 `imap-size`. Each `imap-shape` (a non-square rich message) is confirmed by the user and marked `data-size-ok`
- [ ] 0 broken images
- [ ] 0 `placeholder` issues, or each one is listed as open in notes.md
- [ ] 0 `overflow-x` / `tiny-img` issues
- [ ] Single-file delivery: `python3 scripts/bundle.py <project>` ends with ✓. It fails if any inline script fails `node --check`, any `<use href="#id">` has no symbol, or a status bar renders empty.

## Images (before placing)
- [ ] Every user upload went through `python3 scripts/clean_image.py <files> --edges <sheet.png>`, and the trim log is in `assets/clean-log.txt`
- [ ] You **looked** at the edge sheet. No light strip along any edge of any placed image (the usual cause of "white space under the tile")
- [ ] Every LINE image was checked with `clean_image.py --for <placement>` against `line-image-sizes.md`. Rich message is 1040×1040 unless confirmed
- [ ] When the user reports a visual defect, inspect the source file and a zoomed crop before changing CSS

## Brief compliance (compare every shot with notes.md → Brief)
- [ ] Every copy item from the Brief is present (text bubble, CTA wording, labels). Nothing dropped to make space
- [ ] Anchoring matches L2: "only new message" = top (`.ln-msgs`), "with previous" = bottom (`.ln-msgs.bottom`)
- [ ] Rich menu state matches L1. Message format matches 3c (rich message / Flex / both)
- [ ] Anything that couldn't fit was raised with the user as options, not solved silently
- [ ] The "Pre-delivery check against the Brief" table in notes.md is filled in for every shot
- [ ] Assumptions to confirm and Unverified details are listed in notes.md **and** in the delivery message

## Rich menu design rubric (`line.md`)
- [ ] One icon style (stroke weight, filled vs line), and no kit icons mixed with brand icons
- [ ] One text-alignment rule across tiles; the hero tile's text follows a stated rule too
- [ ] Thai label plus a small English caption (or the reverse), the same sizes on every tile
- [ ] Brand colours plus a subtle brand pattern; no default grey
- [ ] Hairlines and padding consistent; tap areas match the template (`?areas=1`)
- [ ] Labels at least 80 px in the 2500 px artwork (reads as about 13 pt on a phone)

## Manual, every PNG at 100% zoom
- [ ] App-drawn text in the platform font (no brand font in bubbles, Flex, post copy or CTAs); Flex buttons radius 8, filled or link
- [ ] Media ratios: FB feed 4:5, carousel 1:1, Stories 9:16; LINE rich message 1040×1040 unless confirmed; Flex hero 20:13
- [ ] Status bar time and battery fit the story; lock-screen date matches the timeline and the weekday
- [ ] Platform chrome matches the OS (FB tabs, LINE title alignment, back icon, home indicator vs gesture bar)
- [ ] No brand colour in platform chrome
- [ ] Copy: no typos, prices formatted (฿1,290), no invented benefits
- [ ] Thai line breaks: no line made of only a particle (ค่ะ/ครับ/นะ), no word split mid-word, units, prices and dates never broken ("15 ml", "4–24 มี.ค.")
- [ ] Project styles didn't restyle kit parts (a project class like `.kv`/`.hero` colliding with kit CSS shows up as wrong colours or spacing)
- [ ] Android battery digits legible; status bar colour matches the screen behind it
- [ ] Every date, price and offer traceable to the brief, or flagged as a placeholder
- [ ] Images sharp (no upscaling blur), product recognisable at phone size
- [ ] No large empty areas; content anchored where the real app anchors it
- [ ] CTA labels: FB and TikTok native buttons use the platform's fixed CTA list
- [ ] Safe zones respected for TikTok and Stories creative (check with `--safe` export)
- [ ] Overview board matches the brief's order and stage names
- [ ] Unverified kit geometry used (e.g. rich message margins, `line.md`) is listed in notes.md and told to the user
- [ ] notes.md updated: open placeholders, assumptions, image sources, timeline
