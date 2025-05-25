# Destiny 2 Auto Code Redeemer (Tampermonkey Script)

Automatically redeems a list of Destiny 2 emblem and reward codes on [Bungie's Code Redemption page](https://www.bungie.net/7/en/codes/redeem).  
Handles successful redemptions, already-redeemed codes, and errors — fully automated with a single click.

---

## ✨ Features

- ✅ Auto-fills and submits Destiny 2 reward codes
- ⚠️ Detects and skips already redeemed codes
- 🧠 Waits for Bungie UI elements to become interactable
- 🖱️ Includes a floating **Start** button to begin the flow
- 📋 Displays current status in a popup overlay
- ⏱️ Customizable delay for slow connections or throttled browsers

---

## 🚀 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click the button below to install the script:

   [👉 Install the Script (Raw Link)](https://github.com/jellowrld/D2coderedeemerTM/raw/refs/heads/main/destiny2coderedeemer.user.js)

3. Visit: [https://www.bungie.net/7/en/codes/redeem](https://www.bungie.net/7/en/codes/redeem)
4. Press the `▶ Start Code Redemption` button on the bottom right of the screen

---

## 🔢 How It Works

- Injects your list of Destiny 2 reward codes into the Bungie redemption form
- Clicks the redeem button
- Detects if the code was already redeemed
- Closes the error modal and continues to the next code
- Displays status in a floating popup at the bottom right

---

## 📂 Example Code List

The script includes a full list of working Destiny 2 codes such as:

YRC-C3D-YNC
RA9-XPH-6KJ
XVX-DKJ-CVM
7D4-PKR-MD7
XFV-KHP-N97
...

All Current as of 05/26/2025

Increase the delay if you're experiencing timeouts or issues with slow network.


🛠️ Troubleshooting

    Q: Nothing happens when I click start?
    A: Ensure you're on the correct Bungie redemption page and that Tampermonkey is enabled.

    Q: It gets stuck after clicking redeem?
    A: The script includes fallbacks for errors and slow responses. Make sure the DOM hasn't changed.

    Q: How do I add my own codes?
    A: Edit the d2codes array in the script and add your codes as strings.

