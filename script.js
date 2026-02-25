document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 332-9902";

  const logoTrigger = document.getElementById("logoTrigger");
  const membersSection = document.getElementById("members");
  const toast = document.getElementById("toast");

  const passInput = document.getElementById("memberPass");
  const unlockBtn = document.getElementById("unlockBtn");
  const gateMsg = document.getElementById("gateMsg");

  const numberEl = document.getElementById("burnerNumber");
  const copyBtn = document.getElementById("copyBtn");
  const copyMsg = document.getElementById("copyMsg");
  const smsLink = document.getElementById("smsLink");

  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1400);
  }

  // ----- Secret tap logic (5 taps within 3s) -----
  let taps = 0;
  let timer = null;

  function registerTap(){
    taps++;
    clearTimeout(timer);
    timer = setTimeout(() => (taps = 0), 3000);

    if (taps >= 5) {
      taps = 0;
      membersSection.classList.remove("hidden");
      showToast("Members unlocked");
      setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth" }), 150);
      setTimeout(() => passInput?.focus(), 400);
    }
  }

  logoTrigger?.addEventListener("pointerup", (e) => {
    e.preventDefault();
    registerTap();
  });

  // Fallback touch
  logoTrigger?.addEventListener("touchend", (e) => {
    e.preventDefault();
    registerTap();
  }, { passive: false });

  // ----- Password unlock -----
  function normalize(str){
    return (str || "").normalize("NFKC").trim();
  }

  function unlock(){
    const attempt = normalize(passInput?.value);

    if (!attempt) {
      gateMsg.textContent = "Enter the password.";
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      gateMsg.textContent = "";
      numberEl.textContent = MEMBERS_NUMBER;

      copyBtn.disabled = false;

      smsLink.classList.remove("disabled");
      smsLink.removeAttribute("aria-disabled");
      smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;

      showToast("Access granted");
    } else {
      gateMsg.textContent = "WRONG PASSWORD.";
      passInput.value = "";
      passInput.focus();
    }
  }

  unlockBtn?.addEventListener("click", unlock);
  passInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
  });

  // Copy (only works after unlock)
  copyBtn?.addEventListener("click", async () => {
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
