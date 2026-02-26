document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 444-4277";

  const logoTrigger = document.getElementById("logoTrigger");
  const membersSection = document.getElementById("members");

  const toast = document.getElementById("toast");
  const pressureEl = document.getElementById("pressureLevel");
  const cultEl = document.getElementById("cultLine");
  const taglineEl = document.getElementById("taglineText");

  const gate = document.getElementById("gate");
  const memberContent = document.getElementById("memberContent");
  const passInput = document.getElementById("memberPass");
  const unlockBtn = document.getElementById("unlockBtn");
  const gateMsg = document.getElementById("gateMsg");

  const numberEl = document.getElementById("burnerNumber");
  const copyBtn = document.getElementById("copyBtn");
  const copyMsg = document.getElementById("copyMsg");
  const smsLink = document.getElementById("smsLink");

  const leafContainer = document.querySelector(".leaf-rain");

  let isUnlocked = false;

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1200);
  }

  function setPressure(state){
    if (!pressureEl) return;
    pressureEl.textContent = `PRESSURE LEVEL: ${state}`;
  }

  // Prove JS is running
  showToast("JS ONLINE");

  // ===== Time theme (After Dark 10PM–5AM) =====
  const hour = new Date().getHours();
  const afterDark = (hour >= 22 || hour < 5);
  if (afterDark) {
    document.body.classList.add("after-dark");
    if (taglineEl) taglineEl.textContent = "After Hours Protocol Active.";
  }

  // ===== Cult phrases =====
  const cultPhrases = afterDark
    ? [
        "We see you.",
        "Keep your voice low.",
        "You’re closer than you think.",
        "Not everyone gets in.",
        "You weren’t supposed to find this.",
        "Don’t repeat what you learn here."
      ]
    : [
        "Members move in silence.",
        "Stay discreet.",
        "Access is earned.",
        "Not everyone gets in.",
        "Say less."
      ];

  function rotateCult(){
    if (!cultEl) return;
    cultEl.textContent = cultPhrases[Math.floor(Math.random() * cultPhrases.length)];
  }
  rotateCult();
  setInterval(rotateCult, 9000);

  // ===== Pressure behavior =====
  setPressure("STABLE");
  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    setPressure("RISING");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setPressure("STABLE"), 900);
  }, { passive: true });

  // ===== Members reveal (press & hold 1.2s) =====
  let holdTimer = null;
  let holding = false;

  function revealMembers(){
    if (!membersSection) return;
    membersSection.classList.remove("hidden");
    showToast("Members unlocked.");
    setPressure("ELEVATED");
    setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    setTimeout(() => passInput?.focus(), 400);
  }

  function startHold(e){
    e.preventDefault();
    if (holding) return;
    holding = true;
    holdTimer = setTimeout(revealMembers, 1200);
  }

  function endHold(){
    holding = false;
    clearTimeout(holdTimer);
  }

  if (logoTrigger) {
    logoTrigger.addEventListener("touchstart", startHold, { passive:false });
    logoTrigger.addEventListener("touchend", endHold);
    logoTrigger.addEventListener("touchcancel", endHold);

    logoTrigger.addEventListener("mousedown", startHold);
    logoTrigger.addEventListener("mouseup", endHold);
    logoTrigger.addEventListener("mouseleave", endHold);
  }

  // ===== Locked/Unlocked UI (no bypass) =====
  function setLockedUI(){
    isUnlocked = false;
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
    isUnlocked = true;
    gate?.classList.add("hidden");
    memberContent?.classList.remove("hidden");

    if (numberEl) numberEl.textContent = MEMBERS_NUMBER;
    if (copyBtn) copyBtn.disabled = false;

    if (smsLink) {
      smsLink.classList.remove("disabled");
      smsLink.removeAttribute("aria-disabled");
      smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;
    }

    showToast("Access granted.");
    setPressure("CLEARED");
  }

  setLockedUI();

  // ===== ACCESS DENIED escalation =====
  let wrongAttempts = 0;

  function shakeScreen(ms=550){
    const start = performance.now();
    function step(t){
      const dt = t - start;
      const strength = Math.max(0, 1 - dt / ms);
      const x = (Math.random() - 0.5) * 18 * strength;
      const y = (Math.random() - 0.5) * 18 * strength;
      document.documentElement.style.transform = `translate(${x}px, ${y}px)`;
      if (dt < ms) requestAnimationFrame(step);
      else document.documentElement.style.transform = "";
    }
    requestAnimationFrame(step);
  }

  function showDeniedOverlay(){
    const overlay = document.createElement("div");
    overlay.className = "denied-overlay";
    overlay.innerHTML = `
      <div class="denied-box">
        <div class="denied-title">ACCESS DENIED</div>
        <div class="denied-sub">Stop guessing. You’re being logged.</div>
      </div>
    `;
    document.body.appendChild(overlay);
    shakeScreen(700);

    setTimeout(() => overlay.remove(), 1400);
  }

  function unlockAttempt(){
    const attempt = (passInput?.value || "").normalize("NFKC").trim();

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

    if (gateMsg) {
      if (wrongAttempts === 1) gateMsg.textContent = "WRONG PASSWORD.";
      else if (wrongAttempts === 2) gateMsg.textContent = "Try that again… slower.";
      else if (wrongAttempts === 3) gateMsg.textContent = "You’re testing limits.";
      else if (wrongAttempts === 4) gateMsg.textContent = "Last warning.";
      else gateMsg.textContent = "";
    }

    if (wrongAttempts >= 3) setPressure("MONITORED");
    else setPressure("ELEVATED");

    if (wrongAttempts >= 5) {
      showDeniedOverlay();
      wrongAttempts = 0;
      setPressure("DENIED");
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

  // ===== Copy guarded =====
  copyBtn?.addEventListener("click", async () => {
    if (!isUnlocked) return;
    try{
      await navigator.clipboard.writeText(MEMBERS_NUMBER);
      if (copyMsg) copyMsg.textContent = "Copied.";
      setTimeout(() => { if (copyMsg) copyMsg.textContent = ""; }, 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = MEMBERS_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (copyMsg) copyMsg.textContent = "Copied.";
      setTimeout(() => { if (copyMsg) copyMsg.textContent = ""; }, 1200);
    }
  });

  // ===== Pot leaf rain (cinematic) =====
  if (leafContainer) {
    const count = 26;

    const svgMarkup = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="leaf-svg">
        <path fill="currentColor" d="M32 4c2 8 3 16 2 24 4-6 10-11 18-14-5 10-10 18-18 24 6-1 13-1 22 2-9 6-17 9-24 8 5 5 9 12 10 22-9-5-15-11-18-18-3 7-9 13-18 18 1-10 5-17 10-22-7 1-15-2-24-8 9-3 16-3 22-2-8-6-13-14-18-24 8 3 14 8 18 14-1-8 0-16 2-24z"/>
        <path fill="currentColor" d="M31 26c0 10-1 20-3 30h8c-2-10-3-20-3-30h-2z" opacity="0.9"/>
      </svg>
    `;

    leafContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      leaf.innerHTML = svgMarkup;

      leaf.style.left = (Math.random() * 100) + "vw";
      leaf.style.top  = (-Math.random() * 140) + "vh";

      const size = 10 + Math.random() * 14;
      leaf.style.width  = size + "px";
      leaf.style.height = size + "px";

      leaf.style.opacity = (0.06 + Math.random() * 0.08).toFixed(2);
      leaf.style.animationDuration = (18 + Math.random() * 22) + "s";
      leaf.style.animationDelay    = (Math.random() * 8) + "s";

      leaf.style.setProperty("--drift", (Math.random() * 160 - 80).toFixed(0) + "px");
      leaf.style.setProperty("--rot0",  (Math.random() * 360).toFixed(0) + "deg");
      leaf.style.setProperty("--rot1",  (Math.random() * 720 - 360).toFixed(0) + "deg");
      leaf.style.setProperty("--blur",  (Math.random() < 0.35 ? (0.6 + Math.random() * 1.4).toFixed(1) : "0") + "px");

      leafContainer.appendChild(leaf);
    }
  }
});
