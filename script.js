// ===== ZEROS Stealth Members + Password Gate =====

const MEMBER_PASSWORD = "BigJigglyBalls";
const MEMBERS_NUMBER = "(646) 332-9902";

const SESSION_UNLOCK_KEY = "zeros_members_ok";
const SESSION_REVEAL_KEY = "zeros_members_revealed";

function $(id){ return document.getElementById(id); }

// Elements
const logoTrigger = $("logoTrigger");
const secretHint = $("secretHint");

const membersSection = $("members");

const gate = $("gate");
const memberContent = $("memberContent");
const passInput = $("memberPass");
const unlockBtn = $("unlockBtn");
const gateMsg = $("gateMsg");

const numberEl = $("burnerNumber");
const copyBtn = $("copyBtn");
const copyMsg = $("copyMsg");
const smsLink = $("smsLink");

// ---------- Stealth reveal (5 taps) ----------
let tapCount = 0;
let tapTimer = null;
const TAP_WINDOW_MS = 3000;
const TAP_TARGET = 5;

function revealMembersSection(){
  if (!membersSection) return;

  membersSection.classList.remove("hidden");
  sessionStorage.setItem(SESSION_REVEAL_KEY, "1");

  // Scroll it into view smoothly
  membersSection.scrollIntoView({ behavior: "smooth", block: "start" });

  if (secretHint) {
    secretHint.textContent = "";
  }
}

function handleSecretTap(){
  tapCount += 1;

  // Start/reset timer window
  if (tapTimer) clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    tapCount = 0;
    if (secretHint) secretHint.textContent = "";
  }, TAP_WINDOW_MS);

  // Optional tiny feedback (subtle)
  if (secretHint) {
    const left = Math.max(0, TAP_TARGET - tapCount);
    secretHint.textContent = left ? "" : "";
  }

  if (tapCount >= TAP_TARGET) {
    tapCount = 0;
    clearTimeout(tapTimer);
    tapTimer = null;
    revealMembersSection();
  }
}

logoTrigger?.addEventListener("click", handleSecretTap);
logoTrigger?.addEventListener("touchend", (e) => {
  // Prevent double firing on some mobile browsers
  e.preventDefault();
  handleSecretTap();
}, { passive: false });

// If previously revealed this session, keep it revealed
if (sessionStorage.getItem(SESSION_REVEAL_KEY) === "1") {
  membersSection?.classList.remove("hidden");
}

// ---------- Gate logic ----------
function setLockedUI(isLocked){
  if (copyBtn) copyBtn.disabled = isLocked;

  if (smsLink) {
    if (isLocked) {
      smsLink.classList.add("disabled");
      smsLink.setAttribute("aria-disabled", "true");
      smsLink.href = "#";
    } else {
      smsLink.classList.remove("disabled");
      smsLink.removeAttribute("aria-disabled");
      smsLink.href = `sms:${encodeURIComponent(MEMBERS_NUMBER)}`;
    }
  }
}

function revealNumber(){
  if (!gate || !memberContent || !numberEl) return;

  numberEl.textContent = MEMBERS_NUMBER;

  gate.classList.add("hidden");
  memberContent.classList.remove("hidden");

  setLockedUI(false);
}

function tryUnlock(){
  const attempt = (passInput?.value || "").trim();

  if (!attempt) {
    gateMsg.textContent = "Enter the password.";
    return;
  }

  if (attempt === MEMBER_PASSWORD) {
    sessionStorage.setItem(SESSION_UNLOCK_KEY, "1");
    gateMsg.textContent = "";
    revealNumber();
  } else {
    gateMsg.textContent = "Try Again Nigga.";
    if (passInput) {
      passInput.value = "";
      passInput.focus();
    }
  }
}

unlockBtn?.addEventListener("click", tryUnlock);
passInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

// Copy is guarded (no bypass)
copyBtn?.addEventListener("click", async () => {
  const unlocked = sessionStorage.getItem(SESSION_UNLOCK_KEY) === "1";
  if (!unlocked) {
    copyMsg.textContent = "Locked. Enter password first.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
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

// Auto-unlock if already unlocked this session
if (sessionStorage.getItem(SESSION_UNLOCK_KEY) === "1") {
  revealNumber();
} else {
  setLockedUI(true);
}
