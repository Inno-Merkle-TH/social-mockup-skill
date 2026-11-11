# Realism rules

Each of these came from a real client round. They are the difference between "nice slide" and "that's a screenshot".

## Truth
1. **Don't invent programs.** A mockup once promised "+500 Samsung Rewards points" for linking an account. The client doesn't run that, and the whole screen had to be reworked. Any benefit, price, tier, gift, warranty or date not in the brief is a question or a labelled placeholder (in notes.md, never silently in the PNG).
2. **One timeline.** Teaser → launch event → pre-order window → on-sale → sustain. Every screen (badges, countdowns, "valid until", status-bar date, lock-screen date) must agree. Compute weekdays; don't guess them.
3. **Real products, real names.** Use the actual product name/model the brand sells in that market. If the product is unreleased, use the previous generation and say so in notes.md.

## Platform fidelity
4. **Chrome is native, content is brand.** Never colour LINE/FB/TikTok UI with brand colours. Brand lives in Flex, rich menu art, creative, avatar.
5. **Use the real anatomy.** Facebook tabs top on Android / bottom on iOS. LINE rich menu = one image. FB CTA from Meta's fixed list. TikTok ad shows "Sponsored" + CTA bar. Stories have progress bars.
6. **Anchor like the app.** Fresh LINE chats start at the top; big empty gaps above the first message look fake. Feeds show the next post peeking or the tab bar, so never leave a blank screen bottom.
7. **Plausible micro-data.** Engagement counts, timestamps (push at 08:00–20:00), battery (not 100%), read receipts.

## Craft
0. **Real photos, real ad craft.** Ad creative = a real photo + small brand mark (+ maybe a price/offer tag). Not big headline text on a gradient. TikTok frames look like video stills, with text in TikTok's native sticker style (`.tt-sticker`). Find photos online if the user didn't provide them (`references/image-sourcing.md`).
8. **Legible at phone size.** Body text ≥13 px CSS, product thumbnails ≥60 px, no logos smaller than the OA avatar. Open every PNG at 100%.
9. **High-res assets.** Use images ≥2× their displayed size (≥3× for heroes). Upscaled or JPEG-crunched product shots read as fake immediately.
10. **Brand CI correct, but only where the brand controls it.** Use the brand font (licensed) only *inside images*: the creative, rich-menu art, rich-message art, video text. Text the app draws itself (bubbles, Flex, post copy, CTA buttons, captions) is always the platform font. Flex buttons are always radius 8 and never outlined. Use the correct logo lockup. See `typography-and-ratios.md`.
13. **Right ratios.** FB feed is 4:5, carousel 1:1, Stories/Reels/TikTok 9:16, LINE rich message 1040×1040 unless the user confirmed another size, Flex hero 20:13. Never give media boxes a fixed px height.
11. **Copy fits the platform.** FB primary text hook in first 125 chars; TikTok caption 1–2 lines; LINE bubble ≤3 lines; Flex title ≤2 lines.
12. **Captures are deliverables.** Transparent background, consistent scale (3× phones), no stray labels, no placeholder stripes left unless agreed.

## Honesty (learned from an 11-round LINE OA project)
14. **Never drop or move content to make it fit.** If the brief's content doesn't fit, for example a square rich message plus a text bubble with the menu open, say so and offer options: a compact menu, shorter text, or an extra screen with the menu collapsed. Removing the bubble, or switching to bottom-anchoring on your own, is a brief violation.
15. **"Only the new message" means top-anchored** (`.ln-msgs`): "Today" plus the message at the top. "With previous messages" means bottom-anchored (`.ln-msgs.bottom`).
16. **Guesses are listed, not hidden.** Every guess (colour, logo, wording, layout, size) goes in notes.md → Assumptions to confirm and is shown to the user in the first delivery.
17. **Unverified is said out loud.** If something wasn't rendered, measured or checked against a real phone, the delivery message says so. Never call a result "checked" when nothing was rendered.
18. **Platform limits need two sources.** If they disagree, say so and use the safest value (`line-image-sizes.md` shows the format).
19. **Fix from evidence.** When the user reports a visual bug ("white space under the tile"), look at the source file and a zoomed crop first, then fix the cause. Don't guess at a CSS change.
