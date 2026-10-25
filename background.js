// Toggle via toolbar icon or keyboard shortcut. The on/off setting lives in chrome.storage.local
// and is global; the content scripts of all YouTube tabs react to it.
//
// The toolbar icon shows the state only on a YouTube video page, per tab:
//   focus mode ON + video page  = dark icon with a small grey "ON" label
//   everything else             = normal bright icon, no label
const ICONS_BRIGHT = { 16: "icons/icon16.png",     48: "icons/icon48.png",     128: "icons/icon128.png" };
const ICONS_DIM    = { 16: "icons/dim/icon16.png", 48: "icons/dim/icon48.png", 128: "icons/dim/icon128.png" };

const isWatchPage = (url) => {
  try {
    const u = new URL(url);
    return u.origin === "https://www.youtube.com" && u.pathname === "/watch" && u.searchParams.has("v");
  } catch { return false; }   // url is undefined for tabs outside youtube.com
};

async function toggle() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.storage.local.set({ focusOn: !focusOn });
}

async function applyToTab(tab, focusOn) {
  if (!tab || tab.id === undefined || tab.id < 0) return;
  const onVideo = isWatchPage(tab.url);
  const active = focusOn && onVideo;
  const title = onVideo
    ? chrome.i18n.getMessage(focusOn ? "actionTitleOn" : "actionTitleOff")
    : chrome.i18n.getMessage("actionTitle");
  await chrome.action.setIcon({ tabId: tab.id, path: active ? ICONS_DIM : ICONS_BRIGHT });
  await chrome.action.setBadgeText({ tabId: tab.id, text: active ? "ON" : "" });   // always English
  if (active) {
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#6b7280" });
    if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ tabId: tab.id, color: "#ffffff" });
  }
  await chrome.action.setTitle({ tabId: tab.id, title });
}

async function refreshAll() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs.map((t) => applyToTab(t, focusOn).catch(() => {})));
}

async function refreshTab(tabId) {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  try { await applyToTab(await chrome.tabs.get(tabId), focusOn); } catch { /* tab is gone */ }
}

chrome.action.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener((cmd) => { if (cmd === "toggle-focus") toggle(); });
chrome.storage.onChanged.addListener((changes) => { if (changes.focusOn) refreshAll(); });
chrome.tabs.onUpdated.addListener((tabId, info) => { if (info.url || info.status) refreshTab(tabId); });
chrome.tabs.onActivated.addListener(({ tabId }) => refreshTab(tabId));
chrome.tabs.onCreated.addListener((tab) => refreshTab(tab.id));
chrome.runtime.onStartup.addListener(refreshAll);
chrome.runtime.onInstalled.addListener(refreshAll);
refreshAll();
