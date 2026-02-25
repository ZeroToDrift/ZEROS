document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 332-9902";

  // ===== Elements =====
  const logoTrigger = document.getElementById("logoTrigger");
  const membersSection = document.getElementById("members");

  const toast = document.getElementById("toast");

  const gate = document.getElementById("gate");
  const memberContent = document.getElementById("memberContent");

  const passInput = document.getElementById("memberPass");
  const unlockBtn = document.getElementById("unlockBtn");
  const gateMsg = document.getElementById("gateMsg");

  const numberEl = document.getElementById("burnerNumber");
  const copyBtn = document.getElementById("copyBtn");
  const copyMsg = document.getElementById("copyMsg");
  const smsLink = document.getElementById("smsLink");

  // Optional “always watching” UI (only works if you added these IDs in HTML)
  const pressureEl = document.getElementById("pressureLevel");
  const cultEl = document.getElementById("cultLine");
  const taglineEl = document.getElementById("taglineText");

  // ===== Helpers =====
  function normalize(str){
    return (str || "").normalize("NFKC").trim();
  }

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1600);
  }

  function setPressure(state){
    if (!pressureEl) return;
    pressureEl.textContent = `PRESSURE LEVEL: ${state}`;
  }

  // ===== Cult phrases (rotating) =====
  const cultPhrases = [
    "Members move in silence.",
    "Stay discreet.",
    "Eyes open.",
    "Access is earned.",
    "Not everyone gets in.",
    "Say less.",
    "You weren’t invited."
  ];

  function rotateCult(){
    if (!cultEl) return;
    cultEl.textContent = cultPhrases[Math.floor(Math.random() * cultPhrases.length)];
  }

  rotateCult();
  setInterval(rotateCult, 8000);

  // ===== After dark mode (10PM–5AM) =====
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) {
    document.body.classList.add("after-dark");
    if (taglineEl) taglineEl.textContent = "After Hours Protocol Active.";
  }

  // ===== Rare silent flicker (2%) =====
  if (Math.random() < 0.02) {
    document.body.style.opacity = "0.92";
    setTimeout(() => (document.body.style.opacity = "1"), 120);
  }

  // ===== Pressure baseline + behavior =====
  setPressure("STABLE");

  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    setPressure("RISING");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setPressure("STABLE"), 900);
  }, { passive: true });

  // ===== Stealth Members Reveal (5 taps in 3s) =====
  const REVEAL_KEY = "zeros_members_revealed";
  let taps = 0;
  let tapTimer = null;

  function revealMembers(){
    if (!membersSection) return;
    membersSection.classList.remove("hidden");
    sessionStorage.setItem(REVEAL_KEY, "1");
    showToast("Members unlocked.");
    setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    setTimeout(() => passInput?.focus(), 400);
    setPressure("ELEVATED");
  }

  function registerTap(){
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => (taps = 0), 3000);
    if (taps >= 5) {
      taps = 0;
      revealMembers();
    }
  }

  // If already revealed this session, keep it visible
  if (sessionStorage.getItem(REVEAL_KEY) === "1") {
    membersSection?.classList.remove("hidden");
  }

  // iOS-friendly: pointer + touch fallback
  if (logoTrigger) {
    logoTrigger.addEventListener("pointerup", (e) => {
      e.preventDefault();
      registerTap();
    });

    logoTrigger.addEventListener("touchend", (e) => {
      e.preventDefault();
      registerTap();
    }, { passive: false });
  }

  // ===== Locked UI by default =====
  function setLockedUI(){
    if (numberEl) numberEl.textContent = "••• ••• ••••";
    if (copyBtn) copyBtn.disabled = true;
    if (smsLink) {
      smsLink.classList.add("disabled");
      smsLink.setAttribute("aria-disabled", "true");
      smsLink.href = "#";
    }
    if (copyMsg) copyMsg.textContent = "";
  }

  function setUnlockedUI(){
    gate?.classList.add("hidden");
    memberContent?.classList.remove("hidden");

    if (numberEl) numberEl.textContent = MEMBERS_NUMBER;

    if (copyBtn) copyBtn.disabled = false;

    if (smsLink) {
      smsLink.classList.remove("disabled");
      smsLink.removeAttribute("aria-disabled");
      smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;
    }

    setPressure("CLEARED");
    showToast("Access granted.");
  }

  setLockedUI();

  // ===== Typing awareness =====
  let typingTimer = null;

  passInput?.addEventListener("focus", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      if (gateMsg) gateMsg.textContent = "Proceed when ready.";
      setPressure("MONITORED");
    }, 4000);
  });

  passInput?.addEventListener("input", () => {
    clearTimeout(typingTimer);
  });

  passInput?.addEventListener("blur", () => {
    clearTimeout(typingTimer);
  });

  // ===== Glitch overlay (force visible) =====
  function triggerGlitch(){
    // Make sure user sees it
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";

    const text = document.createElement("div");
    text.className = "glitch-text";
    text.textContent = "ACCESS DENIED";

    overlay.appendChild(text);
    document.body.appendChild(overlay);

    // Strong shake
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      document.body.style.transform = `translate(${x}px, ${y}px)`;
      shakeCount++;
      if (shakeCount > 10) {
        clearInterval(shakeInterval);
        document.body.style.transform = "translate(0,0)";
      }
    }, 40);

    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      if (gateMsg) gateMsg.textContent = "";
      wrongAttempts = 0;
      setPressure("DENIED");
    }, 1800);
  }

  // ===== Password logic with escalating messages =====
  let wrongAttempts = 0;

  function unlockAttempt(){
    const attempt = normalize(passInput?.value);

    if (!attempt) {
      if (gateMsg) gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      wrongAttempts = 0;
      if (gateMsg) gateMsg.textContent = "";
      setUnlockedUI();
      return;
    }

    // Wrong attempt
    wrongAttempts++;
    setPressure(wrongAttempts >= 3 ? "MONITORED" : "ELEVATED");

    if (gateMsg) {
      if (wrongAttempts === 1) gateMsg.textContent = "WRONG PASSWORD.";
      else if (wrongAttempts === 2) gateMsg.textContent = "Bro.";
      else if (wrongAttempts === 3) gateMsg.textContent = "You serious?";
      else if (wrongAttempts === 4) gateMsg.textContent = "This isn't a guessing game.";
      else if (wrongAttempts >= 5) triggerGlitch();
    }

    if (passInput) {
      passInput.value = "";
      passInput.focus();
    }
  }

  unlockBtn?.addEventListener("click", unlockAttempt);
  passInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockAttempt();
  });

  // ===== Copy (guarded) =====
  copyBtn?.addEventListener("click", async () => {
    if (copyBtn.disabled) {
      if (copyMsg) {
        copyMsg.textContent = "Locked.";
        setTimeout(() => (copyMsg.textContent = ""), 1200);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(MEMBERS_NUMBER);
      if (copyMsg) copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = MEMBERS_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (copyMsg) copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1500);
    }
  });
});
// ===== LEAF RAIN GENERATOR =====
const leafContainer = document.querySelector(".leaf-rain");

if (leafContainer) {
  const leafCount = 25; // adjust amount here

  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.textContent = "🍃";

    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.animationDuration = (8 + Math.random() * 12) + "s";
    leaf.style.animationDelay = Math.random() * 10 + "s";
    leaf.style.fontSize = (16 + Math.random() * 20) + "px";

    leafContainer.appendChild(leaf);
  }
}
