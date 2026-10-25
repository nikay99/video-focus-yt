// Toggle via toolbar icon or keyboard shortcut. State lives in chrome.storage.local;
// the content scripts of all open tabs react to it.
// The toolbar icon follows the page: focus mode ON = the page goes dark = dark icon,
// focus mode OFF = bright icon in full colour.
const ICONS_BRIGHT = { 16: "icons/icon16.png",     48: "icons/icon48.png",     128: "icons/icon128.png" };
const ICONS_DIM    = { 16: "icons/dim/icon16.png", 48: "icons/dim/icon48.png", 128: "icons/dim/icon128.png" };

async function toggle() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.storage.local.set({ focusOn: !focusOn });
}

async function updateIcon() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.action.setIcon({ path: focusOn ? ICONS_DIM : ICONS_BRIGHT });
  // Small grey label only while focus mode is on (dark icon = on is unusual, so say it in words).
  await chrome.action.setBadgeText({ text: focusOn ? chrome.i18n.getMessage("badgeOn") : "" });
  await chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
  if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ color: "#ffffff" });
  await chrome.action.setTitle({
    title: chrome.i18n.getMessage(focusOn ? "actionTitleOn" : "actionTitleOff"),
  });
}

chrome.action.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener((cmd) => { if (cmd === "toggle-focus") toggle(); });
chrome.storage.onChanged.addListener((changes) => { if (changes.focusOn) updateIcon(); });
chrome.runtime.onStartup.addListener(updateIcon);
chrome.runtime.onInstalled.addListener(updateIcon);
updateIcon();
