// Toggle via toolbar icon or keyboard shortcut. State lives in chrome.storage.local;
// the content scripts of all open tabs react to it.
// The toolbar icon shows the state: full colour = ON, dark grey = OFF.
const ICONS_ON  = { 16: "icons/icon16.png",     48: "icons/icon48.png",     128: "icons/icon128.png" };
const ICONS_OFF = { 16: "icons/off/icon16.png", 48: "icons/off/icon48.png", 128: "icons/off/icon128.png" };

async function toggle() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.storage.local.set({ focusOn: !focusOn });
}

async function updateIcon() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.action.setIcon({ path: focusOn ? ICONS_ON : ICONS_OFF });
  await chrome.action.setBadgeText({ text: "" });
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
