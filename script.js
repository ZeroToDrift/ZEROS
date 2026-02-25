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

  // Visible proof the NEW script loaded
  if (gateMsg) gateMsg.textContent = "JS LOADED ✅";

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1400);
  }

  function normalize(str){
    return (str || "").normalize("NFKC").trim();
  }

  // --- Reveal members (5 taps in 3 sec) ---
  let taps = 0;
  let timer = null;

  function revealMembers(){
    membersSection?.classList.remove("hidden");
    showToast("Members unlocked");
    setTimeout(() => membersSection?.scrollIntoView({ behavior: "smooth" }), 150);
    setTimeout(() => passInput?.focus(), 350);
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

  // --- Locked UI on load ---
  function setLockedUI(){
    numberEl.textContent = "••• ••• ••••";
    copyBtn.disabled = true;

    smsLink.classList.add("disabled");
    smsLink.setAttribute("aria-disabled", "true");
    smsLink.href = "#";

    copyMsg.textContent = "";
  }

  // --- Unlock UI (THIS is the important part) ---
  function setUnlockedUI(){
    gate.classList.add("hidden");
    memberContent.classList.remove("hidden");

    numberEl.textContent = MEMBERS_NUMBER;
    copyBtn.disabled = false;

    smsLink.classList.remove("disabled");
    smsLink.removeAttribute("aria-disabled");
    smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;

    showToast("Access granted");
  }

  setLockedUI();

  function unlock(){
    const attempt = normalize(passInput.value);

    if (!attempt) {
      gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      gateMsg.textContent = "";
      setUnlockedUI();
    } else {
      gateMsg.textContent = "WRONG PASSWORD.";
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

    try {
      await navigator.clipboard.writeText(MEMBERS_NUMBER);
      copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = MEMBERS_NUMBER;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyMsg.textContent = "Copied.";
      setTimeout(() => (copyMsg.textContent = ""), 1500);
    }
  });
});
