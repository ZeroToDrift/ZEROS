document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 332-9902";

  const toast = document.getElementById("toast");
  const membersSection = document.getElementById("members");
  const logoTrigger = document.getElementById("logoTrigger");

  const gate = document.getElementById("gate");
  const memberContent = document.getElementById("memberContent");

  const passInput = document.getElementById("memberPass");
  const unlockBtn = document.getElementById("unlockBtn");
  const gateMsg = document.getElementById("gateMsg");

  const numberEl = document.getElementById("burnerNumber");
  const copyBtn = document.getElementById("copyBtn");
  const copyMsg = document.getElementById("copyMsg");
  const smsLink = document.getElementById("smsLink");

  let wrongAttempts = 0;

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
  }

  function normalize(str){
    return (str || "").normalize("NFKC").trim();
  }

  // ---- 5 Tap Reveal ----
  let taps = 0;
  let timer = null;

  function revealMembers(){
    membersSection.classList.remove("hidden");
    showToast("Members unlocked.");
    setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth" }), 150);
    setTimeout(() => passInput.focus(), 350);
  }

  function registerTap(){
    taps++;
    clearTimeout(timer);
    timer = setTimeout(() => (taps = 0), 3000);
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

  function setLockedUI(){
    numberEl.textContent = "••• ••• ••••";
    copyBtn.disabled = true;
    smsLink.classList.add("disabled");
    smsLink.setAttribute("aria-disabled", "true");
    smsLink.href = "#";
  }

  setLockedUI();

  function dramaticUnlock(){
    gate.classList.add("hidden");
    memberContent.classList.remove("hidden");

    numberEl.textContent = MEMBERS_NUMBER;
    copyBtn.disabled = false;

    smsLink.classList.remove("disabled");
    smsLink.removeAttribute("aria-disabled");
    smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;

    showToast("Access granted.");
  }

  // ===== GLITCH SEQUENCE =====
  function triggerGlitch(){
    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";

    const text = document.createElement("div");
    text.className = "glitch-text";
    text.textContent = "ACCESS DENIED";

    overlay.appendChild(text);
    document.body.appendChild(overlay);

    // Shake effect
    document.body.style.transform = "translateX(5px)";
    setTimeout(() => document.body.style.transform = "translateX(-5px)", 50);
    setTimeout(() => document.body.style.transform = "translateX(0px)", 100);

    setTimeout(() => {
      overlay.remove();
      wrongAttempts = 0;
      gateMsg.textContent = "";
    }, 1500);
  }

  function unlock(){
    const attempt = normalize(passInput.value);

    if (!attempt) {
      gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      wrongAttempts = 0;
      gateMsg.textContent = "";
      dramaticUnlock();
    } else {
      wrongAttempts++;

      if (wrongAttempts === 1) gateMsg.textContent = "WRONG PASSWORD.";
      else if (wrongAttempts === 2) gateMsg.textContent = "Bro.";
      else if (wrongAttempts === 3) gateMsg.textContent = "You serious?";
      else if (wrongAttempts === 4) gateMsg.textContent = "This isn't a guessing game.";
      else if (wrongAttempts >= 5) triggerGlitch();

      passInput.value = "";
      passInput.focus();
    }
  }

  unlockBtn.addEventListener("click", unlock);
  passInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
  });

  copyBtn.addEventListener("click", async () => {
    if (copyBtn.disabled) {
      copyMsg.textContent = "Locked.";
      setTimeout(() => (copyMsg.textContent = ""), 1200);
      return;
    }

    await navigator.clipboard.writeText(MEMBERS_NUMBER);
    copyMsg.textContent = "Copied.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  });
});
