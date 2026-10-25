// Focus mode is only applied on regular video pages (youtube.com/watch?v=...).
// Home, search, channels, playlists, Shorts and everything else stay untouched.
(() => {
  const CLS = "vf-on";
  const root = document.documentElement;
  let enabled = false;   // the user's on/off setting
  let hint = null;
  let lastHref = "";

  const isWatchPage = () =>
    location.pathname === "/watch" && new URLSearchParams(location.search).has("v");

  const nudgeLayout = () => {
    // The player size is computed in JS: nudge a re-layout after toggling.
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 400);
  };

  // small exit button, top right, only visible while hovered
  const ensureHint = () => {
    if (hint || !document.body) return;
    hint = document.createElement("button");
    hint.id = "vf-exit";
    hint.textContent = chrome.i18n.getMessage("exitButton");
    hint.title = "Alt+Shift+F";
    hint.addEventListener("click", () => chrome.storage.local.set({ focusOn: false }));
    document.body.appendChild(hint);
  };
  const removeHint = () => { if (hint) { hint.remove(); hint = null; } };

  const update = () => {
    const shouldBeOn = enabled && isWatchPage();
    const isOn = root.classList.contains(CLS);
    if (shouldBeOn === isOn) { if (shouldBeOn) ensureHint(); return; }
    root.classList.toggle(CLS, shouldBeOn);
    if (shouldBeOn) { ensureHint(); } else { removeHint(); }
    nudgeLayout();
  };

  chrome.storage.local.get("focusOn", ({ focusOn }) => {
    enabled = !!focusOn;
    update();
    // body does not exist yet at document_start
    document.addEventListener("DOMContentLoaded", update, { once: true });
  });
  chrome.storage.onChanged.addListener((c) => {
    if (c.focusOn) { enabled = !!c.focusOn.newValue; update(); }
  });

  // YouTube is a single-page app: re-check whenever the address changes.
  const checkUrl = () => {
    if (location.href !== lastHref) { lastHref = location.href; update(); }
  };
  document.addEventListener("yt-navigate-start", checkUrl);
  document.addEventListener("yt-navigate-finish", checkUrl);
  window.addEventListener("popstate", checkUrl);
  setInterval(checkUrl, 500);   // safety net if an event is missed

  // Double-click on the video area leaves focus mode. Captured early so the player's own
  // double-click handler (fullscreen) does not fire. Clicks on the control bar are ignored.
  window.addEventListener("dblclick", (e) => {
    if (!root.classList.contains(CLS)) return;
    if (e.target.closest && e.target.closest(".ytp-chrome-bottom, .ytp-chrome-top, .ytp-popup, #vf-exit")) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    chrome.storage.local.set({ focusOn: false });
  }, true);
})();
