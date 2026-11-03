/* social-mockup-studio · kit.js
   - inlines icons.svg so <svg class="i"><use href="#id"/></svg> works
   - fills .sb (status bar) and .sysnav per device OS (.dev.ios / .dev.android)
   - ?only=<data-shot id>  → render one shot on a transparent page (export mode)
   - ?safe=1               → show TikTok safe-zone guides
   - sets <html data-ready="1"> once fonts + images are loaded (export waits on it)
*/
(function () {
  const KIT = document.currentScript.src.replace(/kit\.js.*$/, "");
  const q = new URLSearchParams(location.search);

  const ICON = {
    ios: {
      sig: '<svg width="19" height="12" viewBox="0 0 19 12"><g fill="currentColor"><rect x="0" y="8" width="3.2" height="4" rx=".9"/><rect x="5" y="5.5" width="3.2" height="6.5" rx=".9"/><rect x="10" y="3" width="3.2" height="9" rx=".9"/><rect x="15" y="0" width="3.2" height="12" rx=".9"/></g></svg>',
      wifi: '<svg width="17" height="12" viewBox="0 0 17 12"><g fill="currentColor"><path d="M8.5 2.3c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8.5.6 10.4 10.4 0 0 0 1.1 3.6l1.2 1.2a8.7 8.7 0 0 1 6.2-2.5Z"/><path d="M8.5 5.6c1.5 0 2.9.6 3.9 1.5l1.2-1.2a7.2 7.2 0 0 0-10.2 0l1.2 1.2c1-.9 2.4-1.5 3.9-1.5Z"/><path d="M8.5 8.9c.6 0 1.1.2 1.6.6L8.5 11.2 6.9 9.5c.5-.4 1-.6 1.6-.6Z"/></g></svg>'
    },
    android: {
      wifi: '<svg width="17" height="13" viewBox="0 0 24 18"><path d="M12 17.5 23.5 4.3A17.6 17.6 0 0 0 12 .2C7.6.2 3.6 1.7.5 4.3Z" fill="currentColor"/></svg>',
      sig: '<svg width="15" height="15" viewBox="0 0 16 16"><path d="M15.5 .5v15H.5Z" fill="currentColor"/></svg>',
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

  function fillStatus(sb) {
    if (sb.dataset.filled) return; sb.dataset.filled = 1;
    const os = osOf(sb), t = sb.dataset.time || (os === "ios" ? "9:41" : "10:24"), bat = +(sb.dataset.bat || 82);
    if (os === "ios") {
      sb.innerHTML = `<div class="l">${t}</div><div class="r">${ICON.ios.sig}${ICON.ios.wifi}<span class="ibat"><i style="width:${bat}%"></i></span></div>`;
    } else if (os === "android") {
      sb.innerHTML = `<div class="l">${t}</div><div class="r">${ICON.android.wifi}${ICON.android.sig}<span class="bat" style="--lvl:${bat}%"><i style="width:${bat}%"></i><b>${bat}</b></span></div>`;
    }
  }
  function fillNav(n) {
    if (n.dataset.filled) return; n.dataset.filled = 1;
    if (osOf(n) === "android" && n.classList.contains("btn3")) n.innerHTML = ICON.android.rec + ICON.android.home + ICON.android.back;
  }

  async function inlineSprite() {
    try {
      const r = await fetch(KIT + "icons.svg"); const svg = await r.text();
      const d = document.createElement("div"); d.innerHTML = svg; document.body.prepend(d.firstElementChild);
    } catch (e) { console.warn("[kit] icons.svg not loaded – serve over http, not file://", e); }
  }

  function onlyMode() {
    const id = q.get("only"); if (!id) return;
    const shot = document.querySelector(`[data-shot="${id}"]`);
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
