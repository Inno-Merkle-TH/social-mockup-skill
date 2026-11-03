# QA checklist (run before telling anyone it's done)

Automatic (export.cjs prints these, details in `captures/qa.json`):
- [ ] 0 failed requests (fonts, images, sprite)
- [ ] App-drawn text is in the platform font (no brand font in bubbles, Flex, post copy or CTAs); Flex buttons radius 8, filled or link
- [ ] Media ratios: FB feed 4:5 / carousel 1:1 / Stories 9:16, LINE rich message 1:1 full-width, Flex hero 20:13
- [ ] 0 broken images
- [ ] 0 `placeholder` issues, or each one is listed as open in notes.md
- [ ] 0 `overflow-x` / `tiny-img` issues

Manual, every PNG at 100% zoom:
- [ ] Status bar time/battery fit the story; lock-screen date matches the timeline and weekday
- [ ] Platform chrome matches OS (FB tabs, LINE title alignment, back icon, home indicator vs gesture bar)
- [ ] No brand colour in platform chrome
- [ ] Copy: no typos, prices formatted (฿1,290), no invented benefits
- [ ] Thai line breaks: no line that is only a particle (ค่ะ/ครับ/นะ), no word split mid-word, units/prices/dates never broken ("15 ml", "4–24 มี.ค.")
- [ ] Project styles didn't restyle kit parts (a project class like `.kv`/`.hero` colliding with kit CSS shows as wrong colours or spacing)
- [ ] Android battery digits legible; status bar colour matches the screen behind it
- [ ] Every date/price/offer traceable to the brief or flagged as placeholder
- [ ] Images sharp (no upscaling blur), product recognisable at phone size
- [ ] No large empty areas; content anchored where the real app anchors it
- [ ] CTA labels: FB/TikTok native buttons use the platform's fixed CTA list
- [ ] Safe zones respected for TikTok / Stories creative (`--safe` export to check)
- [ ] Overview board matches the brief's order and stage names
- [ ] notes.md updated: open placeholders, assumptions, image sources, timeline
