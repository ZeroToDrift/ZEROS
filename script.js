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

  const pressureEl = document.getElementById("pressureLevel");
  const cultEl = document.getElementById("cultLine");
  const taglineEl = document.getElementById("taglineText");

  let wrongAttempts = 0;

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

  // ===== CULT PHRASES =====
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
    cultEl.textContent =
      cultPhrases[Math.floor(Math.random() * cultPhrases.length)];
  }

  rotateCult();
  setInterval(rotateCult, 8000);

  // ===== AFTER DARK MODE =====
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) {
    document.body.classList.add("after-dark");
    if (taglineEl) taglineEl.textContent = "After Hours Protocol Active.";
  }

  // ===== RARE FLICKER =====
  if (Math.random() < 0.02) {
    document.body.style.opacity = "0.92";
    setTimeout(() => (document.body.style.opacity = "1"), 120);
  }

  // ===== PRESSURE BASELINE =====
  setPressure("STABLE");

  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    setPressure("RISING");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setPressure("STABLE"), 900);
  }, { passive: true });

  // ===== 5 TAP MEMBERS REVEAL =====
  let taps = 0;
  let tapTimer = null;

  function revealMembers(){
    membersSection?.classList.remove("hidden");
    showToast("Members unlocked.");
    setTimeout(() => membersSection?.scrollIntoView({ behavior: "smooth" }), 150);
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

  logoTrigger?.addEventListener("pointerup", (e) => {
    e.preventDefault();
    registerTap();
  });

  logoTrigger?.addEventListener("touchend", (e) => {
    e.preventDefault();
    registerTap();
  }, { passive: false });

  // ===== LOCKED UI =====
  function setLockedUI(){
    if (numberEl) numberEl.textContent = "••• ••• ••••";
    if (copyBtn) copyBtn.disabled = true;
    if (smsLink) {
      smsLink.classList.add("disabled");
      smsLink.href = "#";
    }
  }

  function setUnlockedUI(){
    gate?.classList.add("hidden");
    memberContent?.classList.remove("hidden");

    if (numberEl) numberEl.textContent = MEMBERS_NUMBER;
    if (copyBtn) copyBtn.disabled = false;
    if (smsLink) {
      smsLink.classList.remove("disabled");
      smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;
    }

    setPressure("CLEARED");
    showToast("Access granted.");
  }

  setLockedUI();

  // ===== TYPING AWARENESS =====
  let typingTimer;
  passInput?.addEventListener("focus", () => {
    typingTimer = setTimeout(() => {
      if (gateMsg) gateMsg.textContent = "Proceed when ready.";
      setPressure("MONITORED");
    }, 4000);
  });

  passInput?.addEventListener("input", () => clearTimeout(typingTimer));
  passInput?.addEventListener("blur", () => clearTimeout(typingTimer));

  // ===== GLITCH SEQUENCE =====
  function triggerGlitch(){
    window.scrollTo({ top: 0 });
    document.body.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";

    const text = document.createElement("div");
    text.className = "glitch-text";
    text.textContent = "ACCESS DENIED";

    overlay.appendChild(text);
    document.body.appendChild(overlay);

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
      wrongAttempts = 0;
      setPressure("DENIED");
    }, 1800);
  }

  // ===== PASSWORD LOGIC =====
  function unlockAttempt(){
    const attempt = normalize(passInput?.value);

    if (!attempt) {
      gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      wrongAttempts = 0;
      gateMsg.textContent = "";
      setUnlockedUI();
      return;
    }

    wrongAttempts++;

    if (wrongAttempts === 1) gateMsg.textContent = "WRONG PASSWORD.";
    else if (wrongAttempts === 2) gateMsg.textContent = "Bro.";
    else if (wrongAttempts === 3) gateMsg.textContent = "You serious?";
    else if (wrongAttempts === 4) gateMsg.textContent = "This isn't a guessing game.";
    else if (wrongAttempts >= 5) triggerGlitch();

    setPressure(wrongAttempts >= 3 ? "MONITORED" : "ELEVATED");

    passInput.value = "";
    passInput.focus();
  }

  unlockBtn?.addEventListener("click", unlockAttempt);
  passInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockAttempt();
  });

  // ===== COPY =====
  copyBtn?.addEventListener("click", async () => {
    if (copyBtn.disabled) return;
    await navigator.clipboard.writeText(MEMBERS_NUMBER);
    copyMsg.textContent = "Copied.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  });

  // ===== LEAF RAIN =====
  const leafContainer = document.querySelector(".leaf-rain");
  if (leafContainer) {
    const leafCount = 25;

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
});
