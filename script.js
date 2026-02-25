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

  const leafContainer = document.querySelector(".leaf-rain");

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

  showToast("JS ONLINE");

  // Cult phrases
  const cultPhrases = [
    "Members move in silence.",
    "Stay discreet.",
    "Access is earned.",
    "Eyes open.",
    "Say less.",
    "Not everyone gets in."
  ];

  function rotateCult(){
    if (!cultEl) return;
    cultEl.textContent = cultPhrases[Math.floor(Math.random() * cultPhrases.length)];
  }
  rotateCult();
  setInterval(rotateCult, 8000);

  // Pressure baseline + scroll
  setPressure("STABLE");
  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    setPressure("RISING");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setPressure("STABLE"), 900);
  }, { passive: true });

  // Members reveal: PRESS & HOLD logo (1.2s)
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

    showToast("Access granted.");
    setPressure("CLEARED");
  }

  setLockedUI();

  // Password
  function unlockAttempt(){
    const attempt = (passInput?.value || "").trim();

    if (!attempt) {
      gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      gateMsg.textContent = "";
      setUnlockedUI();
      return;
    }

    gateMsg.textContent = "WRONG PASSWORD.";
    passInput.value = "";
    passInput.focus();
  }

  unlockBtn?.addEventListener("click", unlockAttempt);
  passInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockAttempt();
  });

  // Copy (guarded)
  copyBtn?.addEventListener("click", async () => {
    if (!copyBtn || copyBtn.disabled) return;
    try{
      await navigator.clipboard.writeText(MEMBERS_NUMBER);
      copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = MEMBERS_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1200);
    }
  });

  // POT LEAF RAIN (inline SVG; iPhone-safe)
  if (leafContainer) {
    const count = 38;

    const svgMarkup = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="leaf-svg">
        <path fill="currentColor" d="M32 4c2 8 3 16 2 24 4-6 10-11 18-14-5 10-10 18-18 24 6-1 13-1 22 2-9 6-17 9-24 8 5 5 9 12 10 22-9-5-15-11-18-18-3 7-9 13-18 18 1-10 5-17 10-22-7 1-15-2-24-8 9-3 16-3 22-2-8-6-13-14-18-24 8 3 14 8 18 14-1-8 0-16 2-24z"/>
        <path fill="currentColor" d="M31 26c0 10-1 20-3 30h8c-2-10-3-20-3-30h-2z" opacity="0.9"/>
      </svg>
    `;

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      leaf.innerHTML = svgMarkup;

      leaf.style.left = (Math.random() * 100) + "vw";
      leaf.style.top = (-Math.random() * 120) + "vh";

      const size = 14 + Math.random() * 22;
      leaf.style.width = size + "px";
      leaf.style.height = size + "px";

      leaf.style.opacity = (0.10 + Math.random() * 0.18).toFixed(2);
      leaf.style.animationDuration = (12 + Math.random() * 18) + "s";
      leaf.style.animationDelay = (Math.random() * 6) + "s";

      leaf.style.setProperty("--drift", (Math.random() * 160 - 80).toFixed(0) + "px");
      leaf.style.setProperty("--spin", (Math.random() * 720 - 360).toFixed(0) + "deg");

      leafContainer.appendChild(leaf);
    }
  }
});
