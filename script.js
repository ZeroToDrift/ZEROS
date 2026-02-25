// ===== ZEROS Members Gate (no tabs) =====

const MEMBER_PASSWORD = "BigJigglyBalls";
const BURNER_NUMBER = "(646) 332-9902";
const SESSION_KEY = "zeros_members_ok";

function $(id){ return document.getElementById(id); }

const gate = $("gate");
const memberContent = $("memberContent");
const passInput = $("memberPass");
const unlockBtn = $("unlockBtn");
const gateMsg = $("gateMsg");

const numberEl = $("burnerNumber");
const copyBtn = $("copyBtn");
const copyMsg = $("copyMsg");
const smsLink = $("smsLink");

function reveal(){
  if (!gate || !memberContent || !numberEl) return;

  numberEl.textContent = BURNER_NUMBER;
  smsLink.href = `sms:${encodeURIComponent(BURNER_NUMBER)}`;

  gate.classList.add("hidden");
  memberContent.classList.remove("hidden");
}

function lock(){
  sessionStorage.removeItem(SESSION_KEY);
  gate.classList.remove("hidden");
  memberContent.classList.add("hidden");
  numberEl.textContent = "••• ••• ••••";
  copyMsg.textContent = "";
}

function tryUnlock(){
  const attempt = (passInput.value || "").trim();

  if (!attempt) {
    gateMsg.textContent = "Enter the password.";
    return;
  }

  if (attempt === MEMBER_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    gateMsg.textContent = "";
    reveal();
  } else {
    gateMsg.textContent = "Try Again Nigga.";
    passInput.value = "";
    passInput.focus();
  }
}

unlockBtn?.addEventListener("click", tryUnlock);
passInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(BURNER_NUMBER);
    copyMsg.textContent = "Copied.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = BURNER_NUMBER;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    copyMsg.textContent = "Copied.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  }
});

// Auto-reveal if already unlocked this session
if (sessionStorage.getItem(SESSION_KEY) === "1") {
  reveal();
}
