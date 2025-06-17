// ==UserScript==
// @name         Destiny 2 Auto Code Redeemer (With Resume/Reset)
// @version      1.3
// @description  Redeems Destiny 2 codes one-by-one, waits for error box to close, supports resume/reset progress using localStorage.
// @author
// @match        https://www.bungie.net/7/en/codes/redeem
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "d2_last_code_index";

  const d2codes = [
    "YRC-C3D-YNC", "7D4-PKR-MD7", "X9F-GMA-H6D", "XFV-KHP-N97", "A7L-FYC-44X",
    "JDT-NLC-JKM", "N3L-XN6-PXF", "7CP-94V-LFP", "FJ9-LAM-67F", "7F9-767-F74",
    "X4C-FGX-MX3", "JD7-4CM-HJG", "JNX-DMH-XLA", "3VF-LGC-RLX", "RA9-XPH-6KJ",
    "JYN-JAA-Y7D", "7LV-GTK-T7J", "ML3-FD4-ND9", "HG7-YRG-HHF", "VHT-6A7-3MM",
    "6AJ-XFR-9ND", "JVG-VNT-GGG", "9LX-7YC-6TX", "XVX-DKJ-CVM", "TNN-DKM-6LG",
    "PHV-6LF-9CP", "6LJ-GH7-TPA", "L7T-CVV-3RD", "PKH-JL6-L4R", "D97-YCX-7JK",
    "T67-JXY-PH6", "VA7-L7H-PNC", "F99-KPX-NCF", "YAA-37T-FCN", "XVK-RLA-RAM",
    "J6P-9YH-LLP", "993-H3H-M6K", "XMY-G9M-6XH", "HN3-7K9-93G", "VXN-V3T-MRP",
    "JND-HLR-L69", "A67-C7X-3GN", "9FY-KDD-PRT", "THR-33A-YKC", "3CV-D6K-RD4",
    "FMM-44A-RKP", "3J9-AMM-7MG", "PTD-GKG-CVN", "R9J-79M-J6C", "TK7-D3P-FDF",
    "7MM-VPD-MHP", "RXC-9XJ-4MH", "D6T-3JR-CKX"
  ];

  let i = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  const delay = 1000;

  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed", bottom: "20px", right: "20px",
    backgroundColor: "#111", color: "#0f0", padding: "12px 16px",
    borderRadius: "8px", fontSize: "14px", fontFamily: "monospace",
    zIndex: 9999, boxShadow: "0 0 10px rgba(0, 255, 0, 0.4)"
  });
  popup.textContent = `⏸️ Ready. Last Code Index: ${i}`;
  document.body.appendChild(popup);

  function updatePopup(msg) {
    popup.textContent = msg;
  }

  const startBtn = document.createElement("button");
  startBtn.textContent = "▶ Start Code Redemption";
  Object.assign(startBtn.style, {
    position: "fixed", bottom: "80px", right: "20px",
    padding: "12px 18px", backgroundColor: "#0a0", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px",
    cursor: "pointer", zIndex: 9999,
    boxShadow: "0 0 10px rgba(0,255,0,0.5)"
  });
  document.body.appendChild(startBtn);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "⛔ Reset Progress";
  Object.assign(resetBtn.style, {
    position: "fixed", bottom: "140px", right: "20px",
    padding: "10px 16px", backgroundColor: "#800", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "13px",
    cursor: "pointer", zIndex: 9999,
    boxShadow: "0 0 10px rgba(255,0,0,0.5)"
  });
  document.body.appendChild(resetBtn);

  function waitForSelector(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(`Timeout waiting for ${selector}`);
        }
      }, 300);
    });
  }

  function waitUntilGone(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (!el) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(`Timeout waiting for ${selector} to disappear`);
        }
      }, 300);
    });
  }

  async function redeemCode(code) {
    const input = document.querySelector('input[placeholder="XXX-XXX-XXX"]');
    if (!input) {
      updatePopup("❌ Input field not found.");
      return;
    }

    updatePopup(`⏳ Redeeming: ${code}`);
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(input, code);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const submitBtn = [...document.querySelectorAll('button')]
      .find(btn => btn.textContent.trim().toLowerCase() === "redeem" && !btn.disabled);
    if (!submitBtn) {
      updatePopup("❌ Submit button not found.");
      return;
    }

    submitBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 800));

    const errorTitle = document.querySelector('h3.CodesRedemptionForm_errorTitle__1wFhu');
    if (errorTitle) {
      updatePopup(`⚠️ Already Redeemed: ${code}`);
      const okayBtn = [...document.querySelectorAll('button')].find(btn => btn.textContent.trim().toUpperCase() === "OKAY");
      if (okayBtn) okayBtn.click();
      await waitUntilGone('h3.CodesRedemptionForm_errorTitle__1wFhu');
    } else {
      const resetBtn = await waitForSelector('button:contains("Redeem Another Code")').catch(() => null);
      if (resetBtn) {
        updatePopup(`✅ Redeemed: ${code}`);
        resetBtn.click();
      } else {
        updatePopup(`✅ Possibly Redeemed: ${code}`);
      }
    }

    // Save progress
    localStorage.setItem(STORAGE_KEY, i + 1);
  }

  async function startRedeeming() {
    for (; i < d2codes.length; i++) {
      try {
        await redeemCode(d2codes[i]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        updatePopup(`❌ Error on code ${d2codes[i]}: ${err}`);
        break;
      }
    }
    updatePopup("🎉 All codes processed!");
  }

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "⏳ Running...";
    updatePopup(`▶ Starting code redemption from index ${i}...`);
    setTimeout(startRedeeming, 1000);
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    i = 0;
    updatePopup("🔁 Progress reset. Ready to start from beginning.");
  });
})();
