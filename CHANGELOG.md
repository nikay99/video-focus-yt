# Changelog

## 1.0.5 (2026-10-25)
- Fixed: in YouTube's normal layout (theater mode off) the video sat at the bottom of the window with black space above. It is now centred in the window, like in theater mode.

## 1.0.4 (2026-10-25)
- Store text and extension description now describe the main use: watching a video in one half of the screen while working in the other.
- No change in behaviour.

## 1.0.3 (2026-10-25)
- Clicking the toolbar icon (or pressing Alt+Shift+F) on a page without a video no longer switches the mode. A short hint is shown instead.
- Fixed: the release ZIP of 1.0.2 was missing the hint files (`hint.html`, `hint.js`). 1.0.2 was removed and this version replaces it.

## 1.0.1 (2026-10-25)
- The toolbar icon shows the state only on a YouTube video page and per tab: dark with a small grey ON label when focus mode is on, normal everywhere else.
- New logo. Host permission for `www.youtube.com` added so the extension can read the tab address.

## 1.0.0 (2026-10-25)
- First release. On regular YouTube video pages everything except the video is hidden: recommendations, sidebar, header, title, description, comments, live chat, end cards and pause overlays.
- Switch with the toolbar icon or Alt+Shift+F, leave with a double-click on the video.
- English and German texts.
