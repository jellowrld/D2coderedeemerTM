# Destiny 2 Auto Code Redeemer Userscript

[![Userscript](https://img.shields.io/badge/userscript-install-green.svg?logo=greasemonkey)](https://www.bungie.net/7/en/codes/redeem)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

---

> ⚡ Automatically redeem Destiny 2 codes one-by-one with resume, skip, and reset support built-in. Designed for [bungie.net/7/en/codes/redeem](https://www.bungie.net/7/en/codes/redeem)

---

## 🚀 Features

- ✅ Automatically inputs Destiny 2 codes into Bungie's redemption form
- ⚠️ Detects “Already Redeemed” popups and waits for full dismissal
- ⏩ Automatically proceeds to next code after each attempt
- 💾 **Resume support** – remembers progress with `localStorage`
- ⛔ **Reset button** to clear progress and restart from the beginning
- 🧼 Clean overlay UI with status display and control buttons

---

## 📦 Installation

### ✅ 1. Install a userscript manager:
- [Tampermonkey (Chrome, Edge)](https://tampermonkey.net/)
- [Violentmonkey (Firefox, Chrome)](https://violentmonkey.github.io/)
- [Greasemonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

### ✅ 2. Add this script:
- Click "New Script"
- Paste the script from [`/destiny2coderedeemer.user.js`](./destiny2coderedeemer.user.js)
- Save and enable it
- You might be able to install it also here https://github.com/jellowrld/D2coderedeemerTM/blob/main/destiny2coderedeemer.user.js

### ✅ 3. Go to:
- [https://www.bungie.net/7/en/codes/redeem](https://www.bungie.net/7/en/codes/redeem)
- Click **▶ Start Code Redemption**

---

## 🔁 Resume & Reset

### ✔️ Resume
- Progress is saved using `localStorage` with key: `d2_last_code_index`
- Automatically resumes from the last code after refresh or browser restart

### ⛔ Reset
- Click the **“Reset Progress”** button to wipe saved index and start over

---

## 🧠 Customization

To update the code list:

```js
const d2codes = [
  "YRC-C3D-YNC",
  "7D4-PKR-MD7",
  "X9F-GMA-H6D",
  // Add more codes here...
];
