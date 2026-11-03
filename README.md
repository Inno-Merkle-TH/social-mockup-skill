# social-mockup-studio (Claude Code skill)

Realistic LINE / Facebook / TikTok mockups for **any brand**, on **iOS, Android and Desktop**, exported as 3× transparent PNGs + an overview board. Claude asks the brief questions first (platforms, devices, brand, copy, offers, timeline), then builds and QA's the screens.

![gallery](templates/captures/00-overview.png)

## Install (each team member, once)

```bash
# 1. put the skill where Claude Code finds it
#    personal:   ~/.claude/skills/social-mockup-studio
#    per repo:   <repo>/.claude/skills/social-mockup-studio   (commit it → whole team gets it)
cp -R social-mockup-studio ~/.claude/skills/

# 2. export dependency (Node 18+). Uses your installed Google Chrome if Playwright's browser isn't downloaded.
cd ~/.claude/skills/social-mockup-studio/scripts && npm install
```

Then in Claude Code just ask, e.g. *"mock up a LINE OA push + rich menu for our coffee brand on iPhone and Android"*. It triggers the skill and starts the intake questions. Or type `/social-mockup-studio`.

## Use without Claude

```bash
bash scripts/new_project.sh ~/work/acme-launch      # scaffold
# edit brand.css, add images, paste shots from templates/gallery.html into index.html
node scripts/export.cjs ~/work/acme-launch          # → captures/*.png + qa.json
# regenerate the gallery captures:  node scripts/export.cjs templates --root . --page gallery.html
```
Preview while editing: `cd ~/work && python3 -m http.server 8000` → `http://127.0.0.1:8000/acme-launch/` (needs http, not file://). `?only=<shot-id>` shows one screen; `?safe=1` shows TikTok safe zones.

## What's inside

- `SKILL.md`: the workflow Claude follows
- `assets/`: kit.css (platform chrome), kit.js (status bars, sprite, QA hooks), icons.svg, OFL fonts
- `templates/gallery.html`: 11 reference shots (LINE chat/Flex/rich menu/push, FB feed/carousel/Stories/desktop, TikTok in-feed/Spark/desktop) with a fictional demo brand
- `references/`: intake questions, platform specs, device/OS differences, realism rules, QA checklist, Thai localisation, real-app screenshots for calibration

## Contributing

- New surface (LINE VOOM, Messenger, Instagram, TikTok TopView…)? Add CSS to `assets/kit.css`, a shot to `templates/gallery.html`, a row to the platform reference, run the export, commit the captures.
- Recalibrated a value against a real screenshot? Put the screenshot in `references/screens/` and flip the value's marker from `[~]` to `[V]`.
- Keep brand-specific things (Samsung fonts, client logos) **out** of this repo; they belong in client projects.

## Licences

See `LICENSES.md`. Platform names, UI and logos belong to their owners; mockups are for internal/pitch previews, not for publishing as platform UI.
