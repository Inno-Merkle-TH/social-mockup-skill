# Flows → video (walk-through of several screens)

A **flow** is one phone that plays several mockup screens in order: notifications arrive, a finger taps, screens slide in, messages appear, the rich menu opens. It plays live in the browser and `scripts/video.cjs` records it to MP4 (or transparent ProRes, or GIF).

Use it when the user wants to *show the journey* (CRM flow, chatbot conversation, "what happens after the push"), for a pitch video or a slide that plays. Build and check the still screens first; a flow re-uses the same markup.

## Markup

```html
<figure class="shot" data-flow="line-ios-journey" data-poster="3.2" data-hold="1.5">
  <figcaption class="label">…</figcaption>
  <div class="frame"><div class="dev ios">
    <div class="screen dark" data-scene="lock">…lock screen + .notif…</div>
    <div class="screen line-light" data-scene="chat">…chat, with hidden parts marked by class…</div>
  </div></div>
  <script type="application/json" data-flow-script>[
    {"wait": 0.8},
    {"reveal": ".notif", "with": "up"},
    {"wait": 1.6},
    {"tap": ".notif"},
    {"go": "chat", "with": "zoom"},
    {"tap": ".ln-bar"},
    {"reveal": ".my-menu", "with": "grow"},
    {"class": ".ln-bar .tri", "add": "up", "together": true}
  ]</script>
</figure>
```

- Every `.screen` inside the `.dev` is a scene, named by `data-scene`. The first one shows at the start (or start with `{"show": "name"}`).
- Each screen keeps its own `.sb` and `.sysnav`. During a transition the kit pins the status bar and home indicator so they don't slide away, and cross-fades them when the colours differ (light ↔ dark), like the real OS.
- Anything that should **appear later** (a new message, the rich menu, a notification) is written in the markup normally and listed in a `reveal` step. The kit hides it until then.
- `data-poster` (seconds): the moment shown in still exports and the overview board (default 0). `data-hold`: seconds held on the last frame (default 1.5).
- A complete example is `line-ios-journey` in `templates/gallery.html`.

## Lock screen, unlock and app launch (how a real phone opens an app)

Tapping a push on a locked phone is never a straight cut to the chat. The real sequence, and the steps for it:

1. **Lock screen** with the notification (`.lock` + `.notif`, see `devices.md`). iOS shows no time in the status bar on the lock screen (the kit leaves it empty, or set `data-carrier="AIS"`), plus the Control Centre grabber under the icons.
2. **Tap** the notification: `{"tap": ".notif"}`.
3. **Unlock (optional, off by default)**: `{"unlock": true}` plays Face ID in the Dynamic Island (iOS) or opens the lock-screen padlock (Android). Leave it out unless the user asks; most demo videos skip it.
4. **The app grows out of the notification** you tapped: `{"go": "splash", "with": "zoom"}`. `zoom` always expands from the last tapped element (a notification, an app icon). Without a tap it grows from the centre.
5. **Launch screen**, held ~0.6–0.9 s: `{"wait": 0.7}`. Add it as a scene with one line; the kit draws it:
   `<div class="screen splash" data-app="line" data-scene="splash" data-time="9:41"></div>`
   `data-app`: `line` (LINE green #06C755, big white bubble logo, centred), `facebook` (white, blue f, "from ∞ Meta" at the bottom; add class `dark` for dark mode), `tiktok` (black, colour logo + "TikTok" wordmark) and `tiktok-loading` (the dark screen with a faint logo and the animated red/cyan dots that follows the TikTok splash). All four are measured on real iPhone captures, use the brands' own logo artwork (`assets/icons.svg`, never redrawn) and, like the real apps, show **no status bar**. TikTok cold start = `tiktok` ~0.6 s → `fade` to `tiktok-loading` ~0.8 s → `fade` to the For You screen. See them in the gallery (`launch-ios-*`).
6. **The app's screen appears**: `{"go": "chat", "with": "fade", "dur": 0.25}`.

Leave out step 5 only when the brief says the app was already open in the background (a warm start shows the app straight away). Android launch screens re-use the iPhone measurements scaled to the screen width [~].

## Steps

Steps run one after another. Add `"together": true` to start a step at the same time as the previous one, or `"delay": s` to wait first. Every step takes `"dur"` (seconds) to override its default. Selectors are looked up in the screen that is showing at that point; add `"scene": "name"` to target another one.

| Step | Default dur | What it does |
|---|---|---|
| `{"wait": 1.2}` | given | hold still. Give viewers ~1.2–2 s to read each new thing |
| `{"tap": ".sel"}` | 0.45 | touch circle on the element + pressed state. `"at": [0.3, 0.5]` = point inside it (fractions) |
| `{"unlock": true}` | 0.85 | Face ID in the Dynamic Island (iOS) / lock-screen padlock opens (Android) |
| `{"go": "scene", "with": "push"}` | 0.5 | change screen. `push` (iOS: slides in from the right over a dimmed, parallax screen; Android: Material shared-axis fade), `pop` (back), `up` (sheet / modal from the bottom), `down` (dismiss it), `zoom` (the app grows out of the last tapped notification or icon), `fade`, `none` |
| `{"reveal": ".sel", "with": "grow"}` | 0.4 | show a hidden element. `grow` = it takes space and pushes the rest (new chat message in a bottom-anchored thread, rich menu opening); `fade`, `pop`, `up`, `down` = in place |
| `{"hide": ".sel", "with": "grow"}` | 0.3 | the reverse |
| `{"scroll": ".ln-msgs", "by": 240}` | 0.9 | scroll a container's content up by 240 px (negative = back down). Steps add up |
| `{"type": ".sel", "text": "Hello"}` | 0.07 s/char | types text into the element |
| `{"class": ".sel", "add": "up"}` | 0 | add / `remove` / `toggle` classes instantly (e.g. the rich-menu bar arrow) |

Timing that looks natural: a 0.8–1 s pause before the first action, a tap right before the screen it opens, 1.2–2 s after anything new appears, chat replies 0.6–1 s after the user's message. Keep a flow to 8–25 s; split longer journeys into several flows.

## Realism rules for flows

- Same rules as the stills (`realism-rules.md`): one timeline. Status-bar times move forward or stay the same (`data-time` on each screen), message timestamps match, battery doesn't jump.
- A tap must hit something that really reacts on the platform: a notification, a rich-menu area, a Flex button, the "Menu" bar. A rich-menu tap with a message action sends the label as **the user's** green bubble first, then the OA replies.
- Use the transition the real app uses: opening an app from a push or icon is tap → (unlock) → `zoom` into its launch screen → `fade` into the screen; screens inside an app use `push`/`pop`; LIFF pages and share sheets use `up`.
- The chat must already be bottom-anchored (`.ln-msgs.bottom`) for `grow` messages to push older ones up like LINE does.

## Recording

```bash
node scripts/video.cjs <project>                              # every flow → captures/video/<id>.mp4 (phone on #F2F2F4, 2×, 30 fps)
node scripts/video.cjs <project> --only line-ios-journey --gif   # + a 480 px GIF for email / chat
node scripts/video.cjs <project> --canvas 1080x1920           # phone centred on a 9:16 canvas (Reels / Stories / phone viewing)
node scripts/video.cjs <project> --canvas 1920x1080 --bg "#FFFFFF"   # for 16:9 slides
node scripts/video.cjs <project> --bg transparent             # ProRes 4444 .mov with alpha: drop onto any slide background (Keynote, Premiere, After Effects)
node scripts/video.cjs <project> --stills 0,3.5,7             # PNG frames at those seconds only: check a moment fast
node scripts/video.cjs <project> --bare                        # screen only, no phone (a screen recording look); --bare round keeps the corners
```

- Frames are rendered one by one, so the motion is perfectly smooth whatever the machine. A 13 s flow takes ~40 s at 30 fps.
- Needs Playwright (as for `export.cjs`) and **ffmpeg** (`brew install ffmpeg`). Without ffmpeg the PNG frames are kept and the exact ffmpeg command is printed.
- It stops before recording if a step points to a missing scene or element.
- **Check the video like the stills:** watch it once at full size, then use `--stills` at every transition midpoint (e.g. 0.25 s into a `go`). Look for screens showing outside the glass, double exposures, a status bar that jumps, or a tap that lands off target.

## When there's no browser or ffmpeg (Claude app / Cowork sandbox)

The flow still plays in the single-file HTML from `scripts/bundle.py`: open it in Chrome and it loops (click the phone to pause). Tell the user plainly that the video wasn't rendered or checked here, and offer two options: screen-record the HTML (macOS: ⇧⌘5 → record selected portion), or run `video.cjs` on a Mac.
