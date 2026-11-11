# Social Mockup Studio

**Realistic LINE, Facebook and TikTok mockups for any brand, on iPhone, Android and desktop, made by Claude.**

You describe the campaign in plain words. Claude asks you a few questions, finds real photos, builds the screens so they look like real app screenshots, and gives you ready-to-use images (PNG) for your slides.

![Example phone screens](docs/preview-phones.jpg)
![Example desktop screen](docs/preview-desktop.jpg)

---

## Contents

1. [What you can make](#1-what-you-can-make)
2. [Which Claude are you using?](#2-which-claude-are-you-using)
3. [Set up in the Claude app (Desktop, web, Cowork)](#3-set-up-in-the-claude-app-desktop-web-cowork)
4. [Set up in Claude Code](#4-set-up-in-claude-code)
5. [How to use it, step by step](#5-how-to-use-it-step-by-step)
6. [The questions Claude will ask you](#6-the-questions-claude-will-ask-you)
7. [Getting your images](#7-getting-your-images)
8. [Asking for changes](#8-asking-for-changes)
9. [Tips for the best results](#9-tips-for-the-best-results)
10. [Troubleshooting](#10-troubleshooting)
11. [Good to know (usage rules)](#11-good-to-know-usage-rules)
12. [For the people who maintain this skill](#12-for-the-people-who-maintain-this-skill)

---

## 1. What you can make

| Platform | Screens | iPhone | Android | Desktop |
|---|---|---|---|---|
| **LINE** | Official Account chat, Flex message cards, promo images (rich messages), rich menus (all 12 official layouts plus tab style), lock-screen notifications | ✓ | ✓ | – |
| **Facebook** | Feed ad (single image), carousel, Stories, the home feed on facebook.com | ✓ | ✓ | ✓ |
| **TikTok** | For You in-feed ad, Spark Ad, product card ad, tiktok.com | ✓ | ✓ | ✓ |

What makes these look real:
- **Phone frames** are drawn to the real iPhone 17 Pro and Samsung Galaxy S26 sizes.
- **App screens** (header, buttons, fonts, spacing) are matched to real 2026 screenshots of each app.
- **Status bars** (time, signal, Wi-Fi, battery) are measured on real iPhone (iOS 26) and Samsung (One UI 8.5) screenshots, down to the battery percentage inside the pill.
- **Lock screens and app launch screens** look like the real ones: the iOS 26 lock screen with glass notifications, and the actual LINE, Facebook and TikTok screens you see while each app opens.
- **Fonts** are the ones each app actually uses: SF Pro and Thonburi on iPhone, Roboto on Android, TikTok's own font in TikTok.
- **Image shapes** are correct for each placement. For example, a Facebook feed image is 4:5 portrait and a TikTok video fills the whole screen.
- **Photos are real.** Your brand's photos are used if you have them. If not, Claude finds suitable photos online, **in Cowork and Claude Code only**. In a normal Claude chat you upload the photos yourself ([how](#step-4-photos-who-gets-them)).
- **Thai or English copy**, with correct Thai line breaks.

**Walk-through videos.** Claude can also turn the screens into a short video on one phone. The notification arrives on a real-looking lock screen, a finger taps it, LINE (or Facebook, or TikTok) opens on its real launch screen, then the rich menu slides up and a reply comes in. You get an MP4 for slides or chat, a 9:16 version for phones, or a transparent `.mov` for video editors. Ask for it, e.g. *"also make a video of the journey from the push to the reply"*. (Needs Claude Code or Cowork on a Mac; in the Claude chat app you get a file that plays the animation in Chrome, which you can screen-record.)

All the rich-menu layouts Claude can make:

<img src="templates/richmenu-picker.png" width="620" alt="LINE rich menu layout picker: every layout with its code">

This is the same picture Claude shows you when you ask for a rich menu.

---

## 2. Which Claude are you using?

| You use… | Follow | What you get | Photos from the internet? |
|---|---|---|---|
| **Chat** in the Claude app on Mac/Windows, or **claude.ai** in the browser | [Section 3](#3-set-up-in-the-claude-app-desktop-web-cowork) | Claude chats with you and produces the screens in its built-in workspace | ✗ **No.** Chat can't download photos from websites. You upload them yourself |
| **Cowork** (Claude doing tasks on your computer) | [Section 3](#3-set-up-in-the-claude-app-desktop-web-cowork) | Same as above. Files can go straight into a folder on your computer | ✓ Yes. Claude finds and downloads photos into your folder |
| **Claude Code** (the terminal / coding tool) | [Section 4](#4-set-up-in-claude-code) | The best quality: exact iPhone fonts when run on a Mac, and full control over the files | ✓ Yes. Works out of the box |

Not sure? If you chat with Claude in a normal window, use Section 3. **No photos of your own?** Use Cowork or Claude Code, so Claude can find photos online for you.

---

## 3. Set up in the Claude app (Desktop, web, Cowork)

You do this **once**. It takes about 2 minutes.

### Step 1: Download the skill file
1. Open the repo on GitHub: **https://github.com/Inno-Merkle-TH/social-mockup-skill**
2. In the file list, click **`social-mockup-studio.skill`**.
3. Click the **download button** (the ⬇ arrow at the top right of the file view, "Download raw file").
4. You now have `social-mockup-studio.skill` (about 9 MB) in your Downloads folder. **Don't unzip it and don't rename it**: Claude takes it as it is.

> Don't use the green **Code → Download ZIP** button for the Claude app. That ZIP contains the whole repo in a folder called `social-mockup-skill-main`, which isn't the file Claude needs.
>
> Uploading fails or your computer won't accept a `.skill` file? Rename it to `social-mockup-studio.zip` and upload that. It's the same file.

### Step 2: Turn on file creation
1. Open Claude and go to **Settings → Capabilities**.
2. Turn on **"Code execution and file creation"**. Newer versions call it **"Create and edit files"**.

> On a **Team or Enterprise** plan, your company admin may need to allow skills first: **Organization settings → Plugins & skills → Policy**, then turn on code execution, file creation and Skills.

### Step 3: Upload the skill
1. Go to **Customize → Skills**.
2. Click **+**, then **+ Create skill**, then **Upload a skill**.
3. Choose the file from Step 1 (`.skill` or `.zip`).
4. Make sure the switch next to **social-mockup-studio** is **on**.

### Step 4: Photos: who gets them?

**Claude chat (claude.ai or a normal chat in the app) can't download photos from the internet.** Its workspace can't fetch images from brand websites or photo sites. So in chat, **you** provide the photos:
1. Start your request. Claude replies with a list of exactly which photos it needs, with sizes (for example *logo, square PNG*; *rich message image 1040×1040*; *one photo per menu button*).
2. Save those photos to your computer: from the brand's website (right-click → **Save image as…**), your brand folder, Google Drive or the client's assets.
3. Attach them to the chat: click the **paperclip / +** button, or drag the files into the message box. Use the largest version you have (at least 1500 px wide is best).
4. Tell Claude which photo goes where, for example *"photo 1 is the hero, photo 2 for button A"*. If you're not sure, let Claude decide.

Don't have the photos? Use **Cowork** or **Claude Code** for that project instead. There, Claude finds and downloads real photos itself.

**Cowork: Claude downloads photos for you**
1. Open the Claude Desktop app and switch to **Cowork**.
2. Start a task and choose (or create) a **folder** on your computer for the project, for example `Desktop/Client X mockups`.
3. Type your request, for example *"…find real photos online"*. Claude searches the brand's website and free photo sites, downloads the photos into your folder, and lists each source in `assets/credits.json`.
4. If Claude says a site is blocked, open **Settings → Capabilities** and allow network access for code, or add the site to the allowed domains. On a company plan, ask your admin to allow it. Then tell Claude *"try again"*.

**Claude Code: Claude downloads photos for you**
Nothing to set up: Claude Code can download photos as soon as the skill is installed ([Section 4](#4-set-up-in-claude-code)). Optionally add free Pexels/Unsplash keys for more stock photos (Section 4, step 3).

> Either way, Claude tells you in its **first reply** whether it can download photos in your current setup, and which files it needs from you if it can't.

### Step 5: Try it
Start a **new chat** (or a new Cowork task) and type:

> Make a LINE OA mockup on iPhone for a coffee brand called Morrow Coffee: a morning promo message with the rich menu open.

Claude should reply with questions. That means the skill is working. 🎉

---

## 4. Set up in Claude Code

You do this once on each computer.

1. Put the skill into your personal skills folder. The folder **must be named `social-mockup-studio`**. Pick one way:
   - **With git (easiest to update later with `git pull`):**
     ```bash
     git clone https://github.com/Inno-Merkle-TH/social-mockup-skill.git ~/.claude/skills/social-mockup-studio
     ```
   - **Without git:** on GitHub click the green **Code → Download ZIP** and unzip it. You get a folder called **`social-mockup-skill-main`**. **Rename it to `social-mockup-studio`** (removing `-main` alone isn't enough, because the repo name is different), then move it:
     ```bash
     mv ~/Downloads/social-mockup-skill-main ~/.claude/skills/social-mockup-studio
     ```
   To share it with a whole project, put it in `<your-repo>/.claude/skills/social-mockup-studio/` and commit it.
2. Install the screenshot tool. This needs Node.js 18 or newer; Google Chrome is used automatically if it's installed.
   ```bash
   cd ~/.claude/skills/social-mockup-studio/scripts && npm install
   ```
3. Optional: get better stock photos by adding free API keys to your shell profile:
   ```bash
   export PEXELS_API_KEY=...        # free at pexels.com/api
   export UNSPLASH_ACCESS_KEY=...   # free at unsplash.com/developers
   ```
4. Start Claude Code and just ask, for example *"mock up a TikTok ad for our new drink on Android"*, or type `/social-mockup-studio`.

> **Tip:** run it on a **Mac** for final client files. Only macOS has the real iPhone fonts (SF Pro and Thonburi). On Windows or Linux, iPhone screens use a close look-alike font.

---

## 5. How to use it, step by step

**1. Ask in plain words.** You don't need to say "skill" or "mockup". For example:
- *"Show how our LINE broadcast for the 11.11 sale will look on iPhone and Android."*
- *"I need a Facebook feed ad and a Story for Brand X, Thai copy, for a pitch tomorrow."*
- *"Visualise our CRM journey: welcome message, coupon reminder and birthday message on LINE."*
- *"Make a TikTok product card ad on iPhone using this product photo"* (attach the photo).

**2. Answer Claude's questions.** Claude asks a few at a time, usually as clickable choices. If you're not sure, pick the option marked **(Recommended)**. See the full list in [Section 6](#6-the-questions-claude-will-ask-you).

**3. Give what you have.** Attach logos, brand guidelines, product photos, copy documents or a sketch. Anything you don't have, Claude can find, write or mark as "to be confirmed".

**4. Wait while Claude builds.** It sets up the project, finds and crops photos, builds each screen, takes high-resolution screenshots, and checks them for problems such as broken images, text that doesn't fit or blurry photos.

**5. Review the images.** Claude shows you the screens and a list of anything still open (for example "price not confirmed yet").

**6. Ask for changes** in normal words ([Section 8](#8-asking-for-changes)), then download the final files.

---

## 6. The questions Claude will ask you

Claude only asks what it needs. Anything you already said in your first message is skipped.

**About the job**
- Which platforms: LINE, Facebook, TikTok?
- Which devices: iPhone, Android, desktop?
- Which screens: for example LINE chat, rich menu, Facebook feed ad, TikTok ad?
- **How many screens, and what's on each one?** Two ways to answer:
  - **You already know:** just list them, one line each, e.g. *"1. LINE chat with the promo, 2. rich menu, 3. Facebook feed ad"*. Claude builds exactly that and only asks about gaps.
  - **You're exploring:** say *"help me plan"*. Claude asks your goal (a pitch, a CRM journey, ad previews) and who it's for, then suggests 2–3 storyboards (for example a 3-screen lean version, a 5-screen standard and a full 8-screen journey). Pick one and change anything you like.
  - Or mix them: name the screens you're sure of and let Claude suggest the rest.

  Claude repeats the final numbered list back to you before it builds, so you always know what's coming.

**About the brand**
- The brand name, and the LINE / Facebook / TikTok account name to show.
- Logo, colours and fonts, or permission to take them from the brand's website.
- **Where photos should come from:** you provide them, the brand's website, or **Claude finds photos online** (the usual choice in Cowork and Claude Code; in a normal chat you upload them, see [Step 4](#step-4-photos-who-gets-them)).

**About the content**
- Should you or Claude write the copy, and in which language?
- Offer details: product, price, discount, dates, conditions. **Claude never makes these up.** Unknown details become clearly marked placeholders.
- Campaign dates, so every screen shows matching dates and times.

**For LINE chats (asked every time)**
- **Is the rich menu open?** Open (most common), collapsed (only the "Menu" bar), or no rich menu (normal typing bar).
- **Only the new message, or previous messages too?** With previous messages looks like a real, lived-in chat; only the new message looks like a brand-new chat.
- **Rich message, Flex message, or both?** A rich message is one designed picture, with all the text inside the image. A Flex message is a white card with a photo, real text and buttons. Claude shows you a small drawing of each.

**For LINE rich menus**
- Large (half the screen) or compact (a smaller strip)?
- Which layout? Claude first shows you a picture of every layout (the 12 official ones, plus custom and tab-style). Each layout has a short code like **L6** or **C3**, so you just reply with the code, or say "you choose".
- What goes in each button area, and should it use photos or icons?
- The text on the menu bar ("Menu" or your own, up to 14 characters).

**About the output**
- Light or dark mode, safe-zone guides, and where to deliver the files.
- **Do you also want a video?** If yes: which screens in which order, what gets tapped, and the format (MP4 on a plain background, 9:16 for phones, 16:9 for slides, or a transparent `.mov` for video editors). No video unless you say yes.

> **In a hurry?** Say *"just go with the defaults"*. Claude will then use: Android Galaxy, LINE with the rich menu open and previous messages, Facebook light mode, TikTok, Thai copy, and real photos found online (Cowork and Claude Code; in chat it asks you for the photos).

---

## 7. Getting your images

You get one image per screen, and one overview board with all screens together.

| File | Use it for |
|---|---|
| `captures/01-…png`, `02-…png` … | One screen each, with a transparent background, high resolution (3× for phones), ready for PowerPoint, Keynote or Figma |
| `captures/00-overview.png` | All screens on one board, for a quick review or email |
| `captures/video/<name>.mp4` | Only if you asked for a video: the walk-through, ready for PowerPoint, Keynote, Slack or LINE. Also `.gif` (small preview) or `.mov` (transparent, for video editors) if you asked |
| `notes.md` | What was decided, what's still a placeholder, and where every photo came from |
| `assets/credits.json` | The source of each photo that was found online |

- **Claude app / web:** the files appear in the chat. Click to download, or ask *"zip everything for me"*.
- **Cowork:** ask Claude to save them in a folder you choose, for example *"put the final PNGs in my Desktop/Client X folder"*.
- **Claude Code:** they're in the project folder, under `captures/`.

> If Claude says the screenshot tool can't run in its workspace, it tells you so in its **first reply** and gives you **one HTML file** (it opens by double-click, with everything built in) plus the project ZIP. Open the HTML in **Google Chrome** to see all the screens. Claude will also say plainly that it couldn't check them visually, and list what is unverified. For final high-resolution files, ask a teammate with Claude Code on a Mac to run the export.
>
> **Claude will also tell you at the start** if it can't reach the brand's website or photo sites from its workspace. It then asks you to upload specific files (logo, rich message image, menu tile images, brand colours, CTA wording) instead of building with made-up artwork. With your first delivery it lists its **"Assumptions to confirm"**, everything it had to guess. Reply to that list first; it saves several rounds of changes.

---

## 8. Asking for changes

Just say what you want, as you would to a designer:
- *"Make the headline shorter and the price bigger."*
- *"Change screen 3 to dark mode."*
- *"Use a compact rich menu with 3 buttons instead."*
- *"Show the previous messages above the new one."*
- *"Swap the photo for something brighter, with people in it."*
- *"Same screens but on iPhone."*
- *"Translate everything to English."*
- *"Add a TikTok version of the same ad."*
- *"In the video, hold longer on the reply and make it 9:16."*
- *"Make the video open TikTok instead of LINE."*

Claude rebuilds only what changed and re-exports the images (and the video, if there is one).

---

## 9. Tips for the best results

- **Real offers only.** Give the real prices, dates and conditions, or let Claude mark them as placeholders. Invented promotions are the number-one reason mockups get rejected.
- **Give your best photos.** Product shots and lifestyle photos of at least 1500 px make the biggest difference. Logos work best as PNG or SVG.
- **One story, one timeline.** If screens are a journey, tell Claude the dates so status-bar times and "valid until" dates agree.
- **Keep LINE messages short.** In a real chat with the rich menu open, only about a third of the screen shows messages.
- **Desktop Facebook** uses a 1920×1080 screen so the whole ad fits in one image.
- **Check at 100%.** Open the PNGs full size before sending them to the client.

---

## 10. Troubleshooting

| Problem | What to do |
|---|---|
| Claude doesn't ask questions or doesn't seem to use the skill | Check the skill is switched **on** (Customize → Skills), start a **new chat**, and say *"use the social-mockup-studio skill"*. |
| Upload of the skill file fails | Make sure you're uploading the original file (`.skill` or renamed to `.zip`), not a folder. Check that "Code execution and file creation" is on. On Team/Enterprise, ask your admin to allow skills. If you get a server error, try again later or in the other app (web vs desktop). |
| "Can't download photos" or "no internet" | **In a normal Claude chat this is expected**: chat can't download photos. Attach your own (paperclip / drag in), or move the project to **Cowork** or **Claude Code** ([Step 4](#step-4-photos-who-gets-them)). In Cowork, allow network access for code in Settings → Capabilities (or ask your admin to allow the site). Claude lists exactly which files it needs. |
| A white line or gap shows at the edge of a picture | Usually it's in the uploaded file itself (screenshots often have a white strip). Claude trims uploads automatically. If you still see one, say *"check the edges of the image on screen 2"*. |
| The screen lost something you asked for (a message, a button) | It shouldn't happen: Claude must ask before removing or moving anything. Point to it, e.g. *"bring back the text message above the image, top of the chat"*. |
| Rich message vs card looks wrong | Say which you want: a **rich message** (one designed picture) or a **Flex message** (a white card with photo, text and buttons). |
| iPhone text looks slightly different from a real iPhone | The real iPhone fonts only exist on Macs. For final files, export with Claude Code on a Mac. |
| A photo looks blurry or wrong | Tell Claude: *"replace the photo on screen 2 with a sharper one of …"*, or attach your own. |
| Text is cut off or overlaps | Tell Claude which screen. It also checks this automatically, but copy changes can introduce it. |
| Asked for a video but only got an HTML file | The Claude chat app can't record video in its workspace. Open the HTML in Chrome (the video plays there) and screen-record it (Mac: ⇧⌘5 → Record Selected Portion), or ask a teammate with Claude Code on a Mac to run the export. In Claude Code, install ffmpeg once with `brew install ffmpeg`. |
| The app's look has changed (new LINE / Facebook / TikTok design) | Send a fresh phone screenshot of the real app to the skill maintainer (see Section 12). |

---

## 11. Good to know (usage rules)

- These mockups are for **internal reviews and client pitches**, not for publishing as real app screenshots.
- Photos found online are fine for internal mockups. Before anything is published, replace them with licensed or client-supplied photos. `credits.json` lists every one.
- LINE, Facebook, TikTok, their logos and app designs belong to their owners.
- Don't put real customers' names or personal data into mockups. Claude uses plausible made-up names.
- See `LICENSES.md` for the fonts and files included.

---

## 12. For the people who maintain this skill

<details>
<summary>Folder map, recalibrating, adding screens, packaging (click to open)</summary>

**What's inside**

| Path | What it is |
|---|---|
| `SKILL.md` | The workflow Claude follows (intake → scaffold → images → build → export → review → notes) |
| `assets/kit.css`, `kit.js`, `icons.svg`, `fonts/` | The kit: phone frames, status bars, LINE/FB/TikTok screens, fonts |
| `templates/gallery.html` | One ready-made example of every screen type (fictional brand "Morrow Coffee") |
| `templates/stock/` | Demo photos (Wikimedia Commons, see `credits.json`) |
| `references/` | Intake questions, platform rules, fonts and ratios, devices (status bars, lock screens), realism rules, QA checklist, Thai notes, image sourcing, video flows (`video.md`) |
| `references/screens/` | Real-app screenshots (local only, git-ignored) and `calibrate/` replica pages |
| `scripts/export.cjs` | Renders every screen to PNG and runs QA (`qa.json`) |
| `scripts/video.cjs` | Records each flow (`data-flow`: several screens + a step script, see `references/video.md`) to MP4, transparent ProRes or GIF. Needs ffmpeg |
| `scripts/calibrate.cjs` | Overlays a rebuilt screen on a real phone screenshot and reports where they differ |
| `scripts/find_images.py`, `fetch_image.py` | Find and download real photos and log their sources |
| `scripts/new_project.sh` | Creates a new project folder with the kit |
| `scripts/preflight.py` | Checks first whether this computer can render, and whether the brand site and photo sites are reachable |
| `scripts/richmenu_picker.py` | Rebuilds `templates/richmenu-picker.svg` and `.png`, the layout picture shown at intake. Run with `--png` after changing rich menu layouts in `kit.css` |
| `scripts/clean_image.py` | Trims white edges off uploaded images (logged), checks sizes, makes an edge-zoom sheet |
| `scripts/bundle.py` | Packs a project into one HTML file and checks that scripts, status bars and icons work |
| `templates/captures/` | Only `04-line-richmenu-templates.png` is kept (shown during intake). Regenerate the rest with the gallery export below; they're git-ignored |

**Use without Claude**
```bash
bash scripts/new_project.sh ~/work/acme-launch        # new project
# edit brand.css, add images, copy screens from templates/gallery.html into index.html
node scripts/export.cjs ~/work/acme-launch            # → captures/*.png + qa.json
node scripts/video.cjs ~/work/acme-launch             # → captures/video/*.mp4 (flows only; needs ffmpeg)
python3 scripts/bundle.py ~/work/acme-launch           # → dist/acme-launch.html (one file, checked)
node scripts/export.cjs templates --root . --page gallery.html   # rebuild the gallery
```
Preview while editing: `python3 -m http.server 8000` in the parent folder, then open `http://127.0.0.1:8000/acme-launch/`. Add `?only=<shot-id>` for one screen, `?safe=1` for safe zones, and `?areas=1` for rich-menu tap areas.

**When an app changes its design**
1. Take a real phone screenshot and put it in `references/screens/device/`.
2. Copy the closest page in `references/screens/calibrate/`, then run:
   `node scripts/calibrate.cjs references/screens/calibrate/<page>.html references/screens/device/<shot>.PNG`
3. Adjust `assets/kit.css` until the overlay lines up, mark the values `[V]`, re-export the gallery, and commit.

**Adding a new screen type** (Instagram, Messenger, LINE VOOM…): add CSS to `kit.css`, an example to `gallery.html`, notes to the platform reference, then re-export and commit.

**Updating the shareable `.skill` file** (it lives in the repo root so teammates download it from GitHub; Claude accepts up to 30 MB, and this one is about 9 MB). **Rebuild it after every change and commit it with that change**, otherwise people download an old version. `.gitattributes` keeps the `.skill` out of `git archive`, so it never packs itself. The folder must be named `social-mockup-studio`.
```bash
rm -rf /tmp/pkg && mkdir -p /tmp/pkg/social-mockup-studio && git archive HEAD | tar -x -C /tmp/pkg/social-mockup-studio
# from the skill-creator skill folder:
python3 -m scripts.package_skill /tmp/pkg/social-mockup-studio <this repo folder>   # writes social-mockup-studio.skill here
```
Keep client-specific material (client logos, paid fonts) **out** of this skill; it belongs in client projects.

</details>
