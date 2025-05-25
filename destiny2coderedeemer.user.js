// ==UserScript==
// @name         Destiny 2 Auto Code Redeemer
// @version      1.0
// @description  Automatically enters Destiny 2 codes, handles already redeemed errors, and proceeds to the next code.
// @author       JellxWrld/JelloWrld/LiginSax
// @match        https://www.bungie.net/7/en/codes/redeem
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

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
    "7MM-VPD-MHP", "RXC-9XJ-4MH"
  ];

  let i = 0;
  const delay = 2500;

  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed", bottom: "20px", right: "20px",
    backgroundColor: "#111", color: "#0f0", padding: "12px 16px",
    borderRadius: "8px", fontSize: "14px", fontFamily: "monospace",
    zIndex: 9999, boxShadow: "0 0 10px rgba(0, 255, 0, 0.4)"
  });
  popup.textContent = "⏸️ Waiting to start...";
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

  function waitForErrorThenContinue() {
    const errorCheck = setInterval(() => {
      const errorTitle = document.querySelector('h3.CodesRedemptionForm_errorTitle__1wFhu');
      const okayBtn = [...document.querySelectorAll('button')]
        .find(btn => btn.textContent.trim().toUpperCase() === "OKAY");

      if (errorTitle && okayBtn) {
        clearInterval(errorCheck);
        updatePopup(`⚠️ Already Redeemed: ${d2codes[i]}`);
        setTimeout(() => {
          okayBtn.click();
          i++;
          setTimeout(enterCodeLoop, delay);
        }, 500);
      }
    }, 500);
  }

  function enterCodeLoop() {
    if (i >= d2codes.length) {
      updatePopup("✅ All codes submitted!");
      return;
    }

    const input = document.querySelector('input[placeholder="XXX-XXX-XXX"]');
    if (!input) {
      updatePopup("❌ Input field not found.");
      return;
    }

    const currentCode = d2codes[i];
    updatePopup(`⏳ Redeeming: ${currentCode}`);

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, currentCode);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const waitSubmit = setInterval(() => {
      const submitBtn = [...document.querySelectorAll('button')]
        .find(btn => btn.textContent.trim().toLowerCase() === "redeem" && !btn.disabled);

      if (submitBtn) {
        clearInterval(waitSubmit);

        setTimeout(() => {
          submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

          // Check for ERROR popup while waiting for Redeem Another
          waitForErrorThenContinue();

          // Fallback to "Redeem Another Code" button
          const waitReset = setInterval(() => {
            const resetBtn = [...document.querySelectorAll('button')]
              .find(btn => btn.textContent.toLowerCase().includes("redeem another"));

            if (resetBtn) {
              clearInterval(waitReset);
              updatePopup(`✅ Redeemed: ${d2codes[i]}`);
              resetBtn.click();
              i++;
              setTimeout(enterCodeLoop, delay);
            }
          }, 500);
        }, 500);
      }
    }, 500);
  }

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.textContent = "⏳ Running...";
    updatePopup("▶ Starting code redemption...");
    setTimeout(enterCodeLoop, 1000);
  });
})();
