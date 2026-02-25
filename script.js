// ===== ZEROS Stealth Members + Password Gate (iOS-friendly) =====

const MEMBER_PASSWORD = "BigJigglyBalls";
const MEMBERS_NUMBER = "(646) 332-9902";

const SESSION_UNLOCK_KEY = "zeros_members_ok";
const SESSION_REVEAL_KEY = "zeros_members_revealed";

function $(id){ return document.getElementById(id); }

const logoTrigger = $("logoTrigger");
const membersSection = $("members");
const toast = $("toast");

const gate = $("gate");
const memberContent = $("memberContent");
const passInput = $("memberPass");
const unlockBtn = $("unlockBtn");
const gateMsg = $("gateMsg");

const numberEl = $("burnerNumber");
const copyBtn = $("copyBtn");
const copyMsg = $("copyMsg");
const smsLink = $("smsLink");

// ----- Toast -----
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1400);
}

// ----- Stealth reveal (5 taps within 3s) -----
let tapCount = 0;
let tapTimer = null;
const TAP_WINDOW_MS = 3000;
const TAP_TARGET = 5;

function revealMembersSection(){
  if (!membersSection) return;

  membersSection.classList.remove("hidden");
  sessionStorage.setItem(SESSION_REVEAL_KEY, "1");

  showToast("Members unlocked");

  setTimeout(() => {
    membersSection.scrollIntoView({ behavior: "smooth", block: "start" });
    passInput?.focus();
  }, 150);
}

function registerTap(){
  tapCount += 1;

  if (tapTimer) clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    tapCount = 0;
    tapTimer = null;
  }, TAP_WINDOW_MS);

  if (tapCount >= TAP_TARGET) {
    tapCount = 0;
    clearTimeout(tapTimer);
    tapTimer = null;
    revealMembersSection();
  }
}

// Use pointer events (more reliable on iOS)
logoTrigger?.addEventListener("pointerup", (e) => {
  e.preventDefault();
  registerTap();
});

// Fallback for older iOS Safari
logoTrigger?.addEventListener("touchend", (e) => {
  e.preventDefault();
  registerTap();
}, { passive: false });

// Keyboard accessibility (optional)
logoTrigger?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    registerTap();
  }
});

// Keep revealed if already revealed this session
if (sessionStorage.getItem(SESSION_REVEAL_KEY) === "1") {
  membersSection?.classList.remove("hidden");
}

// ----- Gate logic -----
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
    showToast("Access granted");
    revealNumber();
  } else {
    gateMsg.textContent = "WRONG PASSWORD.";
    passInput.value = "";
    passInput.focus();
  }
}

unlockBtn?.addEventListener("click", tryUnlock);
passInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

// Copy is guarded
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
