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

  // Visible debug so you KNOW JS is running
  function setMsg(msg) {
    if (gateMsg) gateMsg.textContent = msg;
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1400);
  }

  // If core elements are missing, tell you exactly what
  const missing = [];
  if (!membersSection) missing.push("#members");
  if (!passInput) missing.push("#memberPass");
  if (!unlockBtn) missing.push("#unlockBtn");
  if (!gateMsg) missing.push("#gateMsg");
  if (!numberEl) missing.push("#burnerNumber");
  if (!copyBtn) missing.push("#copyBtn");
  if (!smsLink) missing.push("#smsLink");

  if (missing.length) {
    alert("JS loaded, but HTML is missing: " + missing.join(", "));
    return;
  }

  // Confirm JS is loaded (you'll see this under the password box)
  setMsg("JS LOADED ✅");

  // ----- Secret reveal (5 taps) -----
  let taps = 0;
  let timer = null;

  function revealMembers() {
    membersSection.classList.remove("hidden");
    showToast("Members unlocked");
    setTimeout(() => membersSection.scrollIntoView({ behavior: "smooth" }), 150);
    setTimeout(() => passInput.focus(), 400);
  }

  function registerTap() {
    taps++;
    clearTimeout(timer);
    timer = setTimeout(() => (taps = 0), 3000);
    if (taps >= 5) {
      taps = 0;
      revealMembers();
    }
  }

  if (logoTrigger) {
    logoTrigger.addEventListener("pointerup", (e) => {
      e.preventDefault();
      registerTap();
    });

    logoTrigger.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        registerTap();
      },
      { passive: false }
    );
  }

  // ----- Unlock logic -----
  function normalize(str) {
    return (str || "").normalize("NFKC").trim();
  }

  function lockUI() {
    copyBtn.disabled = true;
    smsLink.classList.add("disabled");
    smsLink.setAttribute("aria-disabled", "true");
    smsLink.href = "#";
    numberEl.textContent = "••• ••• ••••";
    copyMsg.textContent = "";
  }

  function unlockUI() {
    numberEl.textContent = MEMBERS_NUMBER;

    copyBtn.disabled = false;

    smsLink.classList.remove("disabled");
    smsLink.removeAttribute("aria-disabled");
    smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;

    showToast("Access granted");
  }

  lockUI();

  function unlock() {
    const attempt = normalize(passInput.value);

    if (!attempt) {
      setMsg("Enter the password.");
      return;
    }

    if (attempt === MEMBER_PASSWORD) {
      setMsg("");
      unlockUI();
    } else {
      setMsg("WRONG PASSWORD.");
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
