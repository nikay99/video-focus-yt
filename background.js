// Toggle via toolbar icon or keyboard shortcut. State lives in chrome.storage.local;
// the content scripts of all open tabs react to it.
async function toggle() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.storage.local.set({ focusOn: !focusOn });
}

async function updateBadge() {
  const { focusOn = false } = await chrome.storage.local.get("focusOn");
  await chrome.action.setBadgeText({ text: focusOn ? chrome.i18n.getMessage("badgeOn") : "" });
  await chrome.action.setBadgeBackgroundColor({ color: "#e50914" });
  await chrome.action.setTitle({
    title: chrome.i18n.getMessage(focusOn ? "actionTitleOn" : "actionTitleOff"),
  });
}

chrome.action.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener((cmd) => { if (cmd === "toggle-focus") toggle(); });
chrome.storage.onChanged.addListener((changes) => { if (changes.focusOn) updateBadge(); });
chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);
updateBadge();
