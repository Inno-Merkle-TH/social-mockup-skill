/* social-mockup-studio · kit.js
   - inlines icons.svg so <svg class="i"><use href="#id"/></svg> works
   - fills .sb (status bar) and .sysnav per device OS (.dev.ios / .dev.android)
   - ?only=<data-shot id>  → render one shot on a transparent page (export mode)
   - [data-flow] figures   → several screens + a timeline, played in the browser, recorded by scripts/video.cjs
   - ?flow=<id>[&rec=1]    → render one flow on its own (rec=1: don't autoplay, video.cjs drives kitFlows[id].render(t))
   - ?safe=1               → show TikTok safe-zone guides
   - sets <html data-ready="1"> once fonts + images are loaded (export waits on it)
*/
(function () {
  const KIT = (document.currentScript.src || "").replace(/kit\.js.*$/, "");
  const q = new URLSearchParams(location.search);
  // ?bare=1 → screen only, no phone frame (?bare=round keeps the rounded screen corners). See kit.css "SCREEN ONLY".
  if (q.get("bare")) document.documentElement.classList.add("bare", ...(q.get("bare") === "round" ? ["round"] : []));

  const ICON = {
    ios: {
      // [V] measured on iPhone 17 Pro / iOS 26 captures IMG_0906-0910 (pt): signal 19.3x12.3, wifi 17x12.3, battery 25x13.3 + cap
      sig: '<svg width="19.3" height="12.3" viewBox="0 0 19.3 12.3"><g fill="currentColor"><rect x="0" y="7.6" width="3.3" height="4.7" rx="1"/><rect x="5.33" y="5.3" width="3.3" height="7" rx="1"/><rect x="10.67" y="2.6" width="3.3" height="9.7" rx="1"/><rect x="16" y="0" width="3.3" height="12.3" rx="1"/></g></svg>',
      wifi: '<svg width="17.4" height="12.3" viewBox="-0.2 0 17.4 12.3"><g fill="currentColor"><path d="M-0.20 3.60 A12.30 12.30 0 0 1 17.20 3.60 L15.43 5.37 A9.80 9.80 0 0 0 1.57 5.37Z"/><path d="M2.84 6.64 A8.00 8.00 0 0 1 14.16 6.64 L12.39 8.41 A5.50 5.50 0 0 0 4.61 8.41Z"/><path d="M8.50 12.30 L5.67 9.47 A4.00 4.00 0 0 1 11.33 9.47Z"/></g></svg>'
    },
    android: {
      // [V] One UI 8.5, Galaxy S25 1080x2340 capture (SamMobile, 2025-12): wifi 10.4x8.9 dp, 4 signal bars 1.7 dp, battery pill 20.7x12 dp
      wifi: '<svg width="10.4" height="9" viewBox="0 0 10.4 9"><g fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M-0.09 2.99A7.35 7.35 0 0 1 10.49 2.99"/><path d="M1.86 4.87A4.65 4.65 0 0 1 8.54 4.87"/><path d="M3.76 6.71A2.00 2.00 0 0 1 6.64 6.71"/></g><circle cx="5.2" cy="8.1" r=".9" fill="currentColor"/></svg>',
      sig: '<svg width="10.4" height="10.7" viewBox="0 0 10.4 10.7"><g fill="currentColor"><rect x="0" y="7.7" width="1.7" height="3" rx=".85"/><rect x="2.9" y="5" width="1.7" height="5.7" rx=".85"/><rect x="5.8" y="2.4" width="1.7" height="8.3" rx=".85"/><rect x="8.7" y="0" width="1.7" height="10.7" rx=".85"/></g></svg>',
      back: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      home: '<svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
      rec: '<svg width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 5v14M12 5v14M17 5v14"/></g></svg>'
    }
  };

  // Off macOS, system-ui is Segoe UI / Cantarell, not SF Pro: swap iOS + desktop stacks to the closest open fonts.
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    const st = document.createElement("style");
    st.textContent = ':root{--f-ios:"Inter","Noto Sans Thai Looped",sans-serif;--f-desktop:"Segoe UI","Inter","Noto Sans Thai",sans-serif}' +
      '.dev.ios .screen{--f-tiktok:"TikTok Sans App","Inter","Noto Sans Thai Looped",sans-serif}';
    document.head.appendChild(st);
    console.warn("[kit] not macOS: iOS mockups use Inter as SF Pro stand-in. Export on a Mac for exact SF Pro + Thonburi.");
  }

  function osOf(el) { const d = el.closest(".dev"); return d ? (d.classList.contains("ios") ? "ios" : d.classList.contains("android") ? "android" : "desktop") : "desktop"; }

  // iOS 26 battery: solid pill, level in currentColor, rest at 40%, percentage knocked out of the body (data-pct="0" → classic outline)
  let batN = 0;
  function iosBattery(bat, pct) {
    bat = Math.max(0, Math.min(100, bat)); const id = "kitbat" + (++batN), w = 25 * bat / 100;
    const lvl = bat <= 20 ? "#FF3B30" : "currentColor";
    if (!pct) return `<svg class="ibat" width="27.3" height="13.3" viewBox="0 0 27.3 13.3"><rect x=".5" y=".5" width="24" height="12.3" rx="3.8" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="2" y="2" width="${21 * bat / 100}" height="9.3" rx="2.2" fill="${lvl}"/><path d="M25.9 4.65a1.4 2 0 0 1 0 4Z" fill="currentColor" fill-opacity=".4"/></svg>`;
    return `<svg class="ibat" width="27.3" height="13.3" viewBox="0 0 27.3 13.3"><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="13.3"><rect width="25" height="13.3" fill="#fff"/>` +
      `<text x="12.5" y="10.95" text-anchor="middle" fill="#000" style="font:700 ${bat === 100 ? 10.6 : 11.8}px var(--f-ios);letter-spacing:-.2px">${bat}</text></mask></defs>` +
      `<g mask="url(#${id})"><rect width="25" height="13.3" rx="4.3" fill="currentColor" fill-opacity=".4"/>` +
      `<rect width="25" height="13.3" rx="4.3" fill="${lvl}" style="clip-path:inset(0 ${25 - w}px 0 0)"/></g>` +
      `<path d="M25.9 4.65a1.4 2 0 0 1 0 4Z" fill="currentColor" fill-opacity="${bat === 100 ? 1 : .4}"/></svg>`;
  }

  // One UI 8.5 battery: pill, level in currentColor, rest at 55%, dark number cut into it
  function androidBattery(bat) {
    bat = Math.max(0, Math.min(100, bat)); const id = "kitbat" + (++batN), W = 20.7, w = W * bat / 100;
    return `<svg class="bat" width="${W}" height="12" viewBox="0 0 ${W} 12"><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="12"><rect width="${W}" height="12" fill="#fff"/>` +
      `<text x="${W / 2}" y="9.35" text-anchor="middle" fill="#000" fill-opacity=".82" style="font:700 ${bat === 100 ? 8.4 : 9.4}px var(--f-android)">${bat}</text></mask></defs>` +
      `<g mask="url(#${id})"><rect width="${W}" height="12" rx="6" fill="currentColor" fill-opacity=".55"/>` +
      `<rect width="${W}" height="12" rx="6" fill="${bat <= 15 ? "#FF4B4B" : "currentColor"}" fill-opacity=".93" style="clip-path:inset(0 ${W - w}px 0 0)"/></g></svg>`;
  }

  function fillStatus(sb) {
    if (sb.dataset.filled) return; sb.dataset.filled = 1;
    const os = osOf(sb), t = sb.dataset.time || (os === "ios" ? "9:41" : "10:24"), bat = +(sb.dataset.bat || 82);
    const onLock = !!(sb.closest(".screen") && sb.closest(".screen").querySelector(":scope > .lock"));
    if (onLock && os === "ios") { sb.classList.add("lock-sb"); }   // iOS lock screen: carrier name (data-carrier) or nothing on the left, never the time
    if (os === "ios") {
      sb.innerHTML = `<div class="l">${onLock ? (sb.dataset.carrier || "") : t}</div><div class="r">${ICON.ios.sig}${ICON.ios.wifi}${iosBattery(bat, sb.dataset.pct !== "0")}</div>`;
    } else if (os === "android") {
      sb.innerHTML = `<div class="l">${t}</div><div class="r">${ICON.android.wifi}${ICON.android.sig}${androidBattery(bat)}</div>`;
    }
  }
  function fillNav(n) {
    if (n.dataset.filled) return; n.dataset.filled = 1;
    if (osOf(n) === "android" && n.classList.contains("btn3")) n.innerHTML = ICON.android.rec + ICON.android.home + ICON.android.back;
  }

  const PAD = '<svg viewBox="0 0 14 18"><path class="shk" d="M3.6 8.2V5.6a3.4 3.4 0 0 1 6.8 0v2.6" fill="none" stroke="currentColor" stroke-width="1.9"/><rect x="1.2" y="8" width="11.6" height="9.4" rx="2.4" fill="currentColor"/></svg>';
  // Launch screens, measured on real iPhone captures (see kit.css "APP LAUNCH SCREENS"). None of them shows a status bar.
  // Every logo is the brand's own artwork from assets/icons.svg (#line-mark, #fb-f, #meta-logo, #tt-logo, #tt-wordmark), never redrawn.
  const SPLASH = {
    line: '<div class="sp-logo"><svg><use href="#line-mark"/></svg></div>',
    facebook: '<div class="sp-logo"><svg><use href="#fb-f"/></svg></div><div class="sp-foot"><span>from</span><svg class="meta"><use href="#meta-logo"/></svg></div>',
    // laid out in the capture's own points (390 pt wide screen): note at x 156.7 y 246.2, wordmark 118.1 × 26.3 at x 134.9 y 355.7
    tiktok: '<div class="sp-logo"><svg viewBox="130 245 130 140"><use href="#tt-logo" x="156.65" y="246.15" width="87.1" height="87.1"/><use href="#tt-wordmark" x="134.9" y="355.7" width="118.1" height="26.3" fill="#fff"/></svg></div>',
    "tiktok-loading": '<div class="sp-logo"><svg><use href="#tt-logo"/></svg></div><div class="tt-dots"><i></i><i></i></div>'
  };
  // App icons for notifications: <div class="appi" data-app="line|facebook|tiktok"></div>
  const APPICON = { line: "line-app", facebook: "fb-app", tiktok: "tt-app" };
  // <div class="screen splash" data-app="line|facebook|tiktok|tiktok-loading"></div> → the app's launch screen (logo + home indicator)
  function fillSplash(sc) {
    const html = SPLASH[sc.dataset.app]; if (!html || sc.dataset.filled) return; sc.dataset.filled = 1;
    sc.classList.add("splash-" + sc.dataset.app);
    sc.innerHTML = `${html}<div class="grow"></div><div class="sysnav"></div>`;
  }
  // TikTok loader: the red and cyan dots circle past each other (period 0.75 s); t = seconds (flows drive it, otherwise a rAF loop)
  function ttDots(root, t) {
    root.querySelectorAll(".tt-dots").forEach(d => { const [r, c] = d.children, a = t / .75 * 2 * Math.PI, x = 5.35 * Math.cos(a), z = Math.sin(a);
      r.style.transform = `translateX(${-x}px) scale(${1 + .12 * z})`; c.style.transform = `translateX(${x}px) scale(${1 - .12 * z})`;
      r.style.zIndex = z > 0 ? 2 : 1; c.style.zIndex = z > 0 ? 1 : 2; });
  }

  async function inlineSprite() {
    if (document.querySelector("svg[data-kit-sprite]")) return;   // bundle.py already inlined it (single-file HTML)
    try {
      const r = await fetch(KIT + "icons.svg"); const svg = await r.text();
      const d = document.createElement("div"); d.innerHTML = svg; document.body.prepend(d.firstElementChild);
    } catch (e) { console.warn("[kit] icons.svg not loaded – serve over http, not file://", e); }
  }

  /* =====================================================================
     FLOWS · one phone, several screens, a scripted timeline (→ scripts/video.cjs)
     <figure class="shot" data-flow="id" [data-poster="2.5"]>
       <div class="frame"><div class="dev ios">
         <div class="screen …" data-scene="lock">…</div>
         <div class="screen …" data-scene="chat">…</div>
       </div></div>
       <script type="application/json" data-flow-script>[ {"wait":1}, {"tap":".notif"}, {"go":"chat","with":"zoom"} ]</script>
     </figure>
     Steps run one after another; add "together": true to start a step with the previous one.
     Selectors are looked up in the screen that is showing at that point (or "scene": "name").
     See references/video.md for every step and option.
     ===================================================================== */
  function bez(x1, y1, x2, y2) {
    return t => { if (t <= 0) return 0; if (t >= 1) return 1; let lo = 0, hi = 1, u = t;
      for (let i = 0; i < 26; i++) { u = (lo + hi) / 2; const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u; if (x < t) lo = u; else hi = u; }
      return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u; };
  }
  const EASE = { ios: bez(.32, .72, 0, 1), android: bez(.2, 0, 0, 1), inout: bez(.45, 0, .25, 1), linear: t => t };
  const KINDS = ["wait", "go", "tap", "unlock", "reveal", "hide", "scroll", "type", "class"];
  const DUR = { wait: 1, go: .5, tap: .45, unlock: .85, reveal: .4, hide: .3, scroll: .9, type: null, class: 0 };
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;

  function makeFlow(fig, issues) {
    const id = fig.dataset.flow, dev = fig.querySelector(".dev");
    const bad = m => { issues.push("flow " + id + ": " + m); };
    if (!dev) { bad("no .dev"); return null; }
    const scenes = [...dev.querySelectorAll(":scope > .screen")], os = dev.classList.contains("android") ? "android" : "ios";
    const ease = EASE[os];
    // clip moving screens to the glass: they share one viewport with the screen's own corner radius
    const vp = document.createElement("div"); vp.className = "kit-vp"; vp.style.borderRadius = getComputedStyle(scenes[0]).borderRadius;
    dev.insertBefore(vp, scenes[0]); scenes.forEach(s => vp.appendChild(s));
    let script = [];
    try { script = JSON.parse((fig.querySelector("script[data-flow-script]") || {}).textContent || "[]"); } catch (e) { bad("script is not valid JSON: " + e.message); }
    const named = n => scenes.find(s => s.dataset.scene === n);
    const saved = new Map(), typed = new Map(), hiddenAtStart = new Set();
    const keep = el => { if (el && !saved.has(el)) saved.set(el, { css: el.getAttribute("style"), cls: el.getAttribute("class"), disp: el.style.display }); return el; };
    const restore = (el, v) => { v.css == null ? el.removeAttribute("style") : el.setAttribute("style", v.css); v.cls == null ? el.removeAttribute("class") : el.setAttribute("class", v.cls); };
    scenes.forEach(s => { keep(s); s.querySelectorAll(":scope > .sb, :scope > .sysnav").forEach(keep); });

    // system bars stay put while screens move: a fixed copy of each screen's status bar + home indicator
    const sys = new Map();
    scenes.forEach(s => {
      const w = document.createElement("div");
      w.className = "kit-sys " + s.className.replace(/\bscreen\b/, "");
      const sb = s.querySelector(":scope > .sb"), nav = s.querySelector(":scope > .sysnav");
      w.appendChild(sb ? sb.cloneNode(true) : document.createElement("i"));
      if (nav) w.appendChild(nav.cloneNode(true));
      dev.appendChild(keep(w)); sys.set(s, w);
    });
    const touch = keep(Object.assign(document.createElement("i"), { className: "kit-touch" })); dev.appendChild(touch);
    // Face ID: the Dynamic Island grows and shows a padlock that opens (iOS); the lock-screen padlock opens (Android)
    const island = keep(Object.assign(document.createElement("i"), { className: "kit-island", innerHTML: `<i class="lk-pad">${PAD}</i>` })); dev.appendChild(island);
    const islandPad = keep(island.firstChild);
    let tapRect = null;

    // compile the script into timed items
    let cur = scenes[0], t = 0, prev0 = 0;
    const first = script[0] && script[0].show ? named(script.shift().show) || cur : cur;
    cur = first;
    const items = [];
    for (const s of script) {
      const k = KINDS.find(k => k in s);
      if (!k) { bad("unknown step " + JSON.stringify(s)); continue; }
      const scope = s.scene ? named(s.scene) : cur;
      if (!scope) { bad("no scene " + s.scene); continue; }
      const it = { k, s, t0: s.together ? prev0 : t + (+s.delay || 0) };
      let dur = s.dur != null ? +s.dur : k === "wait" ? +s.wait : k === "type" ? .07 * (s.text || "").length : DUR[k];
      if (k === "go") {
        it.from = cur; it.to = named(s.go);
        if (!it.to) { bad("no scene " + s.go); continue; }
        if ((s.with || "push") === "none") dur = 0;
        cur = it.to;
      } else if (k === "unlock") {
        it.scene = scope;
      } else if (k !== "wait") {
        const sel = s[k];
        it.el = scope.querySelector(sel) || dev.querySelector(sel);
        if (!it.el) { bad(`no element "${sel}" in scene ${scope.dataset.scene || "?"}`); continue; }
        if (k === "scroll") it.el.classList.add("kit-scroll");
        keep(it.el);
        if (k === "reveal") hiddenAtStart.add(it.el);
        if (k === "type" && !typed.has(it.el)) typed.set(it.el, it.el.innerHTML);
      }
      it.t1 = it.t0 + dur; prev0 = it.t0; t = Math.max(t, it.t1); items.push(it);
    }
    const duration = t + (+fig.dataset.hold || 1.5);

    function setBars(scene, hide) { scene.querySelectorAll(":scope > .sb, :scope > .sysnav").forEach(b => b.style.color = hide ? "transparent" : ""); }

    function go(it, p) {
      const { from, to } = it, mode = it.s.with || "push";
      if (p >= 1 || from === to) { from.style.visibility = "hidden"; to.style.visibility = ""; return; }
      const e = ease(p), W = dev.offsetWidth, H = dev.offsetHeight;
      from.style.visibility = to.style.visibility = "";
      const top = mode === "pop" || mode === "down" ? from : to, under = top === to ? from : to;
      top.style.zIndex = 2; under.style.zIndex = 1;
      const A = os === "android";
      if (mode === "push" || mode === "pop") {
        const q = mode === "push" ? e : 1 - e;           // 0 = from showing, 1 = to showing (push direction)
        const [inc, out] = mode === "push" ? [to, from] : [from, to];
        if (A) { inc.style.transform = `translateX(${(1 - q) * 30}px)`; inc.style.opacity = clamp((q - .3) / .7);
                 out.style.transform = `translateX(${-q * 30}px)`; out.style.opacity = clamp(1 - q / .35); }
        else { inc.style.transform = `translateX(${(1 - q) * W}px)`; inc.style.boxShadow = "-6px 0 24px rgba(0,0,0,.18)";
               out.style.transform = `translateX(${-.3 * q * W}px)`; out.style.filter = `brightness(${1 - .14 * q})`; }
      } else if (mode === "up") { to.style.transform = `translateY(${(1 - e) * H}px)`; from.style.filter = `brightness(${1 - .1 * e})`; }
      else if (mode === "down") { from.style.transform = `translateY(${e * H}px)`; to.style.filter = `brightness(${.9 + .1 * e})`; }
      else if (mode === "zoom") {                        // the app grows out of what was tapped (notification, icon), like iOS / One UI
        const r = tapRect || { x: W / 2 - 30, y: H / 2 - 30, w: 60, h: 60 }, R = parseFloat(vp.style.borderRadius) || 40;
        const z = EASE.ios(p);
        to.style.clipPath = `inset(${r.y * (1 - z)}px ${(W - r.x - r.w) * (1 - z)}px ${(H - r.y - r.h) * (1 - z)}px ${r.x * (1 - z)}px round ${22 + (R - 22) * z}px)`;
        to.style.transformOrigin = `${r.x + r.w / 2}px ${r.y + r.h / 2}px`; to.style.transform = `scale(${.94 + .06 * z})`;
        to.style.opacity = clamp(p * 20);   // an opaque snapshot of the app, not a cross-fade
        from.style.filter = `brightness(${1 - .4 * e}) blur(${4 * e}px)`;
      }
      else { to.style.opacity = e; }                     // fade
      // fixed system bars, cross-faded when their colours differ
      setBars(from, true); setBars(to, true);
      const a = sys.get(from), b = sys.get(to), same = getComputedStyle(a).color === getComputedStyle(b).color;
      a.style.visibility = b.style.visibility = "visible";
      a.style.opacity = same ? 1 : 1 - e; b.style.opacity = same ? 0 : e;
    }

    function tap(it, p) {
      if (p >= 1) return;
      const el = it.el, r = el.getBoundingClientRect(), d = dev.getBoundingClientRect(), k = d.width / dev.offsetWidth || 1;
      const [fx, fy] = it.s.at || [.5, .5];
      touch.style.left = (r.left + r.width * fx - d.left) / k + "px"; touch.style.top = (r.top + r.height * fy - d.top) / k + "px";
      const a = clamp(p / .3), o = clamp((p - .62) / .38);
      touch.style.opacity = a * (1 - o); touch.style.transform = `scale(${.6 + .4 * a + .25 * o})`;
      if (p > .18 && p < .78) el.style.opacity = .6;
    }

    function unlock(it, p) {
      if (p >= 1) return;
      const pad = it.scene.querySelector(".lk-pad");
      if (os === "android") { if (pad) { pad.classList.toggle("open", p > .45); pad.style.opacity = 1 - clamp((p - .75) / .25); } return; }
      const g = clamp(p / .25) * (1 - clamp((p - .72) / .28)), ge = EASE.ios(g);   // grow in, hold, shrink back
      island.style.visibility = "visible"; island.style.width = 126 + 22 * ge + "px"; island.style.height = 37 + 25 * ge + "px"; island.style.marginLeft = -(126 + 22 * ge) / 2 + "px";
      islandPad.style.opacity = clamp((g - .5) * 2); islandPad.classList.toggle("open", p > .48);
    }

    function reveal(it, p, show) {
      const el = it.el, mode = it.s.with || "fade";
      let v = show ? ease(p) : 1 - ease(p);
      if (!show && p >= 1) { el.style.display = "none"; return; }
      el.style.display = saved.get(el).disp || "";
      if (show && p >= 1) return;
      if (mode === "grow") {
        el.style.height = ""; el.style.marginTop = el.style.marginBottom = "";
        const cs = getComputedStyle(el), h = el.offsetHeight, mt = parseFloat(cs.marginTop), mb = parseFloat(cs.marginBottom);
        el.style.height = h * v + "px"; el.style.marginTop = mt * v + "px"; el.style.marginBottom = mb * v + "px"; el.style.overflow = "hidden";
        el.style.opacity = clamp((v - .35) / .65); el.style.transform = `translateY(${(1 - v) * 10}px)`;
      } else {
        el.style.opacity = mode === "pop" ? clamp(v * 2) : v;
        if (mode === "pop") el.style.transform = `scale(${.86 + .14 * v})`;
        if (mode === "up") el.style.transform = `translateY(${(1 - v) * 28}px)`;
        if (mode === "down") el.style.transform = `translateY(${-(1 - v) * 28}px)`;
      }
    }

    function render(time) {
      saved.forEach((v, el) => restore(el, v));
      typed.forEach((h, el) => { el.innerHTML = h; });
      hiddenAtStart.forEach(el => { el.style.display = "none"; });
      scenes.forEach(s => { s.style.visibility = s === first ? "" : "hidden"; });
      const scroll = new Map(); tapRect = null;
      ttDots(dev, time);
      for (const it of items) {
        if (time < it.t0) continue;
        const p = it.t1 > it.t0 ? clamp((time - it.t0) / (it.t1 - it.t0)) : 1;
        switch (it.k) {
          case "go": go(it, p); break;
          case "tap": { const r = it.el.getBoundingClientRect(), d = dev.getBoundingClientRect(), k = d.width / dev.offsetWidth || 1;
            tapRect = { x: (r.left - d.left) / k, y: (r.top - d.top) / k, w: r.width / k, h: r.height / k }; tap(it, p); break; }
          case "unlock": unlock(it, p); break;
          case "reveal": reveal(it, p, true); break;
          case "hide": reveal(it, p, false); break;
          case "scroll": { const y0 = scroll.get(it.el) || 0, y = y0 + (+it.s.by || 0) * EASE.inout(p); scroll.set(it.el, y); it.el.style.setProperty("--kit-sy", y + "px"); break; }
          case "type": { const tx = it.s.text || ""; it.el.textContent = tx.slice(0, Math.round(tx.length * p)); break; }
          case "class": ["add", "remove", "toggle"].forEach(m => it.s[m] && it.s[m].split(/\s+/).forEach(c => it.el.classList[m](c))); break;
        }
      }
    }
    return { id, duration, render, fig };
  }

  function initFlows(issues) {
    const flows = [];
    document.querySelectorAll("[data-flow]").forEach(fig => { const f = makeFlow(fig, issues); if (f) flows.push(f); });
    window.kitFlows = Object.fromEntries(flows.map(f => [f.id, f]));
    const auto = !navigator.webdriver && !q.get("rec");
    flows.forEach(f => {
      f.render(+(f.fig.dataset.poster || 0));
      if (!auto) return;
      let start = performance.now(), at = 0, paused = false;
      const loop = now => { if (!paused) { at = ((now - start) / 1000) % f.duration; f.render(at); } requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      f.fig.querySelector(".frame").addEventListener("click", () => { paused = !paused; if (!paused) start = performance.now() - at * 1000; });
      f.fig.querySelector(".frame").title = "click to pause / play";
    });
  }

  function onlyMode() {
    const id = q.get("only") || q.get("flow"); if (!id) return;
    const shot = document.querySelector(q.get("flow") ? `[data-flow="${id}"]` : `[data-shot="${id}"]`);
    if (!shot) { console.error("[kit] no shot", id); return; }
    // keep the whole <figure data-shot> so project CSS scoped to [data-shot="…"] still applies; labels hide in .capture
    document.body.className += " capture"; document.body.innerHTML = ""; document.body.appendChild(shot);
  }

  async function ready() {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    // QA hooks the export script reads
    const issues = [];
    document.querySelectorAll("img").forEach(i => { if (!i.naturalWidth) issues.push("broken-img " + i.getAttribute("src")); });
    document.querySelectorAll(".ph-img").forEach(p => issues.push("placeholder " + (p.textContent || "").trim().slice(0, 40)));
    document.querySelectorAll(".flex, .fb-tx, .tt-cap, .rm-t, .fb-link .t").forEach(el => { if (!el.classList.contains("one") && el.scrollWidth > el.clientWidth + 1) issues.push("overflow-x " + el.className + ": " + el.textContent.trim().slice(0, 30)); });
    document.querySelectorAll(".flex img, .fb-media img, .rm-t img, .notif img").forEach(i => { const r = i.getBoundingClientRect(); if (r.width && (r.width < 28 || r.height < 28)) issues.push("tiny-img " + i.getAttribute("src")); });
    // status bars and icons must actually render (an empty .sb / unresolved <use> = kit.js or sprite broke)
    document.querySelectorAll(".sb").forEach(sb => { if (!sb.textContent.trim() && !sb.querySelector("svg")) issues.push("statusbar-empty"); });
    const badUse = new Set();
    document.querySelectorAll("use").forEach(u => { const h = u.getAttribute("href") || ""; if (h.startsWith("#") && !document.getElementById(h.slice(1))) badUse.add(h); });
    badUse.forEach(h => issues.push("icon-missing " + h));
    // LINE rich message (imagemap) shape vs. references/line-image-sizes.md: 1040 wide, square by default
    document.querySelectorAll(".ln-imap").forEach(m => { const b = (m.querySelector("img") || m).getBoundingClientRect(); if (!b.width) return;
      const h = Math.round(1040 * b.height / b.width), std = [1040, 350, 585, 700, 1300, 1850];
      if (h < 250 || h > 2080) issues.push("imap-size 1040x" + h + " is outside every LINE limit");
      else if (h !== 1040 && !m.dataset.sizeOk) issues.push("imap-shape 1040x" + h + (std.some(s => Math.abs(s - h) <= 4) ? " (OA Manager template)" : " (custom height)") + ": not square; confirm with the user, then set data-size-ok on .ln-imap"); });
    initFlows(issues);
    window.__kitIssues = issues;
    document.documentElement.dataset.ready = "1";
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (q.get("safe")) document.body.classList.add("safe");
    // --brand-logo-src is a path relative to the PAGE (url() inside a custom property would resolve against kit.css)
    const src = getComputedStyle(document.documentElement).getPropertyValue("--brand-logo-src").trim().replace(/^["']|["']$/g, "");
    if (src) document.documentElement.style.setProperty("--brand-logo", `url("${new URL(src, location.href).href}")`);
    onlyMode();
    await inlineSprite();
    document.querySelectorAll(".appi[data-app]").forEach(e => { const id = APPICON[e.dataset.app]; if (id && !e.firstElementChild) e.innerHTML = `<svg><use href="#${id}"/></svg>`; });
    document.querySelectorAll(".screen.splash").forEach(fillSplash);
    document.querySelectorAll(".dev.android .lock").forEach(l => { if (!l.querySelector(".lk-pad")) l.insertAdjacentHTML("beforeend", `<i class="lk-pad">${PAD}</i>`); });
    document.querySelectorAll(".sb").forEach(fillStatus);
    document.querySelectorAll(".sysnav").forEach(fillNav);
    document.querySelectorAll(".dev.ios .screen, .dev.android .screen").forEach(s => { if (!s.parentElement.querySelector(".cam")) { const c = document.createElement("div"); c.className = "cam"; s.parentElement.appendChild(c); } });
    // rich menu: custom areas (data-area in 2500-px image space) + area letters; ?areas=1 shows tap areas
    document.querySelectorAll(".rm-art").forEach(r => {
      const H = getComputedStyle(r).aspectRatio.includes("843") || /\bC[123]|compact\b/.test(r.className) ? 843 : 1686;
      let n = 0;
      r.querySelectorAll(":scope > .rm-t, :scope > [data-area]").forEach(el => { el.dataset.l = String.fromCharCode(65 + n++);
        if (el.dataset.area) { const [x, y, w, h] = el.dataset.area.split(",").map(Number);
          Object.assign(el.style, { left: x / 25 + "%", top: y / H * 100 + "%", width: w / 25 + "%", height: h / H * 100 + "%" }); } });
      if (n > 20) (window.__kitIssues = window.__kitIssues || []).push({ type: "richmenu-areas", msg: "rich menu has " + n + " areas (max 20)" });
      if (q.get("areas")) r.classList.add("show-areas");
    });
    // hardware side buttons at their real positions (mm from body top → px from screen top)
    const HW = { ios: [["l", 141, 42], ["l", 220, 78], ["l", 322, 79], ["r", 232, 114], ["r cc", 516, 96]],   // action, vol+, vol−, side, camera control
                 android: [["r", 214, 118], ["r", 364, 65]] };                                              // volume rocker, side key
    document.querySelectorAll(".dev.ios, .dev.android").forEach(d => { if (d.querySelector(":scope > .hw")) return;
      (HW[d.classList.contains("ios") ? "ios" : "android"]).forEach(([c, y, h]) => { const i = document.createElement("i"); i.className = "hw " + c; i.style.top = y + "px"; i.style.height = h + "px"; d.appendChild(i); }); });
    ready();
  });
})();
