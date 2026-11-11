#!/usr/bin/env python3
"""social-mockup-studio · check_update.py
Compares this skill's VERSION with the latest GitHub release. Prints one line and never fails the job:
  up to date: 1.0.0
  update available: 1.0.0 → 1.1.0  (what's new + how to update: <url>)
  offline: couldn't reach GitHub (fine, skip the check)
usage: python3 scripts/check_update.py
"""
import json, os, re, subprocess, urllib.error, urllib.request

REPO = "Inno-Merkle-TH/social-mockup-skill"
here = os.path.dirname(os.path.abspath(__file__))
try:
    local = open(os.path.join(here, "..", "VERSION")).read().strip()
except OSError:
    local = "0.0.0"

def parse(v):
    return tuple(int(x) for x in re.findall(r"\d+", v)[:3]) or (0,)

API = f"https://api.github.com/repos/{REPO}/releases/latest"

def fetch():
    """(status, json|None). urllib first; python.org Pythons on macOS often lack SSL certificates, so fall back to curl."""
    try:
        req = urllib.request.Request(API, headers={"Accept": "application/vnd.github+json", "User-Agent": "social-mockup-studio-update-check"})
        with urllib.request.urlopen(req, timeout=4) as r:
            return 200, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception:
        pass
    try:
        out = subprocess.run(["curl", "-sS", "-m", "5", "-H", "User-Agent: social-mockup-studio-update-check", "-w", "\n%{http_code}", API],
                             capture_output=True, text=True, timeout=8).stdout
        body, _, code = out.rpartition("\n")
        return int(code or 0), (json.loads(body) if code == "200" else None)
    except Exception:
        return 0, None

status, rel = fetch()
if status == 0:
    print(f"offline: couldn't reach GitHub (fine, skip the check). This is version {local}.")
    raise SystemExit(0)
if status != 200:
    print(f"no published release found (HTTP {status}); this is version {local}.")
    raise SystemExit(0)
latest = rel.get("tag_name", "").lstrip("v")

if latest and parse(latest) > parse(local):
    print(f"update available: {local} → {latest}  (what's new + how to update: https://github.com/{REPO}/releases/latest)")
else:
    print(f"up to date: {local}")
