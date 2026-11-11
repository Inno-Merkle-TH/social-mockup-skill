#!/usr/bin/env python3
"""Builds dist/social-mockup-studio.skill (the file people upload to the Claude app) + dist/release-notes.md.

usage:  python3 tools/build_skill.py [--tag v1.2.0]
- packs the git-tracked files of skills/social-mockup-studio/ into a zip whose top folder is social-mockup-studio/
  (local-only files such as reference screenshots and gallery exports are git-ignored, so they never ship)
- checks: SKILL.md name, VERSION = --tag (when given), a "## <version>" section in CHANGELOG.md, size under Claude's 30 MB limit
Run by .github/workflows/release.yml when a v* tag is pushed. Run it locally to test a release before tagging.
"""
import os, re, subprocess, sys, zipfile

NAME = "social-mockup-studio"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.path.join("skills", NAME)
os.chdir(ROOT)

def fail(msg):
    print("✗ " + msg); sys.exit(1)

version = open(os.path.join(SKILL, "VERSION")).read().strip()
if not re.fullmatch(r"\d+\.\d+\.\d+", version): fail(f"VERSION must look like 1.2.0, got {version!r}")
args = sys.argv[1:]
if "--tag" in args:
    tag = args[args.index("--tag") + 1]
    if tag.lstrip("v") != version: fail(f"tag {tag} doesn't match {SKILL}/VERSION ({version}). Bump VERSION or fix the tag.")

head = open(os.path.join(SKILL, "SKILL.md")).read().split("---")[1]
if not re.search(rf"^name:\s*{NAME}\s*$", head, re.M): fail(f"SKILL.md frontmatter name must be {NAME}")

log = open("CHANGELOG.md").read()
m = re.search(rf"^## {re.escape(version)}\b.*?$(.*?)(?=^## |\Z)", log, re.M | re.S)
if not m or not m.group(1).strip(): fail(f"CHANGELOG.md has no '## {version}' section with notes")

files = subprocess.run(["git", "ls-files", "-z", SKILL], capture_output=True, text=True, check=True).stdout.split("\0")
files = [f for f in files if f and os.path.isfile(f)]
os.makedirs("dist", exist_ok=True)
out = os.path.join("dist", NAME + ".skill")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(files):
        z.write(f, NAME + "/" + os.path.relpath(f, SKILL))
mb = os.path.getsize(out) / 1048576
if mb > 30: fail(f"{out} is {mb:.1f} MB; Claude accepts up to 30 MB")
notes = m.group(1).strip() + "\n\n**Install or update:** see the [README](https://github.com/Inno-Merkle-TH/social-mockup-skill#updating-to-a-new-version)."
open(os.path.join("dist", "release-notes.md"), "w").write(notes + "\n")
print(f"✓ {out}  version {version} · {len(files)} files · {mb:.1f} MB")
print("✓ dist/release-notes.md")
