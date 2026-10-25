// Fills the hint popup with the browser-language text.
document.getElementById("t").textContent = chrome.i18n.getMessage("hintTitle");
document.getElementById("p").textContent = chrome.i18n.getMessage("hintText");
