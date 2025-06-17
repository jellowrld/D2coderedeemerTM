// ==UserScript==
// @name         Destiny 2 Auto Code Redeemer (With Resume/Reset)
// @version      1.4
// @description  Redeems Destiny 2 codes one-by-one, handles success and errors, supports resume/reset using localStorage.
// @match        https://www.bungie.net/7/en/codes/redeem
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "d2_last_code_index";

  const d2codes = [
  "3CV-D6K-RD4", "3DA-P4X-F6A", "3J9-AMM-7MG", "3VF-LGC-RLX", "473-MXR-3X9",
  "69P-KRM-JJA", "69P-VCH-337", "69R-CKD-X7L", "69R-DDD-FCP", "69R-F99-AXG",
  "69R-VL7-J6A", "69X-DJN-74V", "6A7-7NP-3X7", "6A9-DTG-YGN", "6AJ-XFR-9ND",
  "6LJ-GH7-TPA", "7CP-94V-LFP", "7D4-PKR-MD7", "7F9-767-F74", "7LV-GTK-T7J",
  "7MM-VPD-MHP", "993-H3H-M6K", "9FY-KDD-PRT", "9LX-7YC-6TX", "A67-C7X-3GN",
  "D6T-3JR-CKX", "D97-YCX-7JK", "F99-KPX-NCF", "FJ9-LAM-67F", "FMM-44A-RKP",
  "HC3-H44-DKC", "HDX-ALM-V4K", "HG7-YRG-HHF", "HN3-7K9-93G", "J6P-9YH-LLP",
  "JD7-4CM-HJG", "JDT-NLC-JKM", "JGN-PX4-DFN", "JMR-LFN-4A3", "JND-HLR-L69",
  "JNX-DMH-XLA", "JVG-VNT-GGG", "JYN-JAA-Y7D", "L3P-XXR-GJ4", "L7T-CVV-3RD",
  "ML3-FD4-ND9", "MVD-4N3-NKH", "N3L-XN6-PXF", "PAH-JL6-L4R", "PHV-6LF-9CP",
  "PKH-JL6-L4R", "PTD-GKG-CVN", "RA9-XPH-6KJ", "R9J-79M-J6C", "RXC-9XJ-4MH",
  "T67-JXY-PH6", "TCN-HCD-TGY", "THR-33A-YKC", "TK7-D3P-FDF", "TNN-DKM-6LG",
  "VA7-L7H-PNC", "VHT-6A7-3MM", "VXN-V3T-MRP", "X4C-FGX-MX3", "X9F-GMA-H6D",
  "XFV-KHP-N97", "XMY-G9M-6XH", "XVK-RLA-RAM", "XVX-DKJ-CVM", "YAA-37T-FCN",
  "YKA-RJG-MH9", "YRC-C3D-YNC"
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
    try {
      const input = await waitForSelector('input[placeholder="XXX-XXX-XXX"]', 5000);
      updatePopup(`⏳ Redeeming: ${code}`);

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, code);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const redeemBtn = [...document.querySelectorAll('button')]
        .find(btn => btn.textContent.trim().toLowerCase() === "redeem" && !btn.disabled);

      if (!redeemBtn) {
        updatePopup("❌ Submit button not found.");
        return;
      }

      redeemBtn.click();
      await new Promise(res => setTimeout(res, 1000));

      const errorTitle = document.querySelector('h3.CodesRedemptionForm_errorTitle__1wFhu');
      if (errorTitle) {
        updatePopup(`⚠️ Already Redeemed or Invalid: ${code}`);
        const okayBtn = [...document.querySelectorAll('button')]
          .find(btn => btn.textContent.trim().toUpperCase() === "OKAY");

        if (okayBtn) {
          okayBtn.click();
          await waitUntilGone('h3.CodesRedemptionForm_errorTitle__1wFhu', 5000);
        }
      } else {
        await new Promise(res => setTimeout(res, 1000));
        const redeemAnotherBtn = [...document.querySelectorAll('button')]
          .find(btn => btn.textContent.trim() === "Redeem Another Code");

        if (redeemAnotherBtn) {
          updatePopup(`✅ Redeemed: ${code}`);
          redeemAnotherBtn.click();
          await new Promise(res => setTimeout(res, 1000));
        } else {
          updatePopup(`✅ Redeemed: ${code} (button not found)`);
        }
      }

      localStorage.setItem(STORAGE_KEY, i + 1);
    } catch (err) {
      updatePopup(`❌ Error during code ${code}: ${err}`);
    }
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
