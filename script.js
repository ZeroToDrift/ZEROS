document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 332-9902";

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

  const leafContainer = document.querySelector(".leaf-rain");

  function normalize(str){ return (str || "").normalize("NFKC").trim(); }

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1400);
  }

  function setPressure(state){
    if (!pressureEl) return;
    pressureEl.textContent = `PRESSURE LEVEL: ${state}`;
  }

  // ✅ PROOF JS IS RUNNING
  showToast("JS ONLINE");

  // Cult phrases
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

  // After dark (10PM–5AM)
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) {
    document.body.classList.add("after-dark");
    if (taglineEl) taglineEl.textContent = "After Hours Protocol Active.";
  }

  // Pressure baseline + scroll reaction
  setPressure("STABLE");
  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    setPressure("RISING");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setPressure("STABLE"), 900);
  }, { passive: true });

  // ✅ Members reveal (5 taps in 3 sec)
  let taps = 0;
  let tapTimer = null;

  function revealMembers(){
    if (!membersSection) return;
    membersSection.classList.remove("hidden");
    showToast("Members unlocked.");
    setPressure("ELEVATED");
    setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    setTimeout(() => passInput?.focus(), 400);
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

  // iOS: bind multiple events (some browsers ignore pointer)
  if (logoTrigger) {
    logoTrigger.addEventListener("pointerup", (e) => { e.preventDefault(); registerTap(); });
    logoTrigger.addEventListener("click", (e) => { e.preventDefault(); registerTap(); });
    logoTrigger.addEventListener("touchend", (e) => { e.preventDefault(); registerTap(); }, { passive:false });
  }

  // Locked UI
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

  // Typing awareness
  let typingTimer = null;
  passInput?.addEventListener("focus", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      if (gateMsg) gateMsg.textContent = "Proceed when ready.";
      setPressure("MONITORED");
    }, 4000);
  });
  passInput?.addEventListener("input", () => clearTimeout(typingTimer));
  passInput?.addEventListener("blur", () => clearTimeout(typingTimer));

  // Glitch overlay (force visible)
  function triggerGlitch(){
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";

    const text = document.createElement("div");
    text.className = "glitch-text";
    text.textContent = "ACCESS DENIED";

    overlay.appendChild(text);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      if (gateMsg) gateMsg.textContent = "";
      wrongAttempts = 0;
      setPressure("DENIED");
    }, 1500);
  }

  // Password logic
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

  // Copy guarded
  copyBtn?.addEventListener("click", async () => {
    if (!copyBtn || copyBtn.disabled) return;
    try {
      await navigator.clipboard.writeText(MEMBERS_NUMBER);
      if (copyMsg) copyMsg.textContent = "Copied.";
      setTimeout(() => { if (copyMsg) copyMsg.textContent = ""; }, 1500);
    } catch {}
  });

// ===== POT LEAF RAIN (INLINE SVG - iPhone proof) =====
if (leafContainer) {
  const count = 34;

  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="leaf-svg">
      <path fill="currentColor" d="M32 4c2 8 3 16 2 24 4-6 10-11 18-14-5 10-10 18-18 24 6-1 13-1 22 2-9 6-17 9-24 8 5 5 9 12 10 22-9-5-15-11-18-18-3 7-9 13-18 18 1-10 5-17 10-22-7 1-15-2-24-8 9-3 16-3 22-2-8-6-13-14-18-24 8 3 14 8 18 14-1-8 0-16 2-24z"/>
      <path fill="currentColor" d="M31 26c0 10-1 20-3 30h8c-2-10-3-20-3-30h-2z" opacity="0.9"/>
    </svg>
  `;

  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";

    // Put the SVG inside the element so it always renders
    leaf.innerHTML = svgMarkup;

    leaf.style.left = (Math.random() * 100) + "vw";
    leaf.style.top = (-Math.random() * 100) + "vh";

    const size = 14 + Math.random() * 18;
    leaf.style.width = size + "px";
    leaf.style.height = size + "px";

    leaf.style.opacity = (0.08 + Math.random() * 0.12).toFixed(2);
    leaf.style.animationDuration = (14 + Math.random() * 16) + "s";
    leaf.style.animationDelay = (Math.random() * 6) + "s";

    // drift + spin
    const drift = (Math.random() * 120 - 60).toFixed(0) + "px";
    const spin = (Math.random() * 720 - 360).toFixed(0) + "deg";
    leaf.style.setProperty("--drift", drift);
    leaf.style.setProperty("--spin", spin);

    leafContainer.appendChild(leaf);
  }
}
