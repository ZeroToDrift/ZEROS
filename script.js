// ===== ZEROS Members Gate =====

// PASSWORD
const MEMBER_PASSWORD = "BigJigglyBalls";
const SESSION_KEY = "zeros_members_ok";

function $(id){ return document.getElementById(id); }

// Tabs
const tabButtons = document.querySelectorAll(".tab");
const panels = {
  public: $("tab-public"),
  members: $("tab-members"),
};

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const which = btn.dataset.tab;
    Object.values(panels).forEach(p => p.classList.remove("active"));
    panels[which].classList.add("active");

    if (which === "members") {
      maybeReveal();
      setTimeout(() => $("memberPass")?.focus(), 150);
    }
  });
});

// Gate elements
const gate = $("gate");
const memberContent = $("memberContent");
const passInput = $("memberPass");
const unlockBtn = $("unlockBtn");
const gateMsg = $("gateMsg");

const burnerEl = $("burnerNumber");
const copyBtn = $("copyBtn");
const copyMsg = $("copyMsg");
const smsLink = $("smsLink");

// Set burner number
const BURNER_NUMBER = "(646) 332-9902";

function revealMembers(){
  burnerEl.textContent = BURNER_NUMBER;
  burnerEl.dataset.number = BURNER_NUMBER;

  smsLink.href = `sms:${encodeURIComponent(BURNER_NUMBER)}`;

  gate.classList.add("hidden");
  memberContent.classList.remove("hidden");
}

function lockMembers(){
  sessionStorage.removeItem(SESSION_KEY);
  gate.classList.remove("hidden");
  memberContent.classList.add("hidden");
  burnerEl.textContent = "••• ••• ••••";
  copyMsg.textContent = "";
}

function maybeReveal(){
  const ok = sessionStorage.getItem(SESSION_KEY) === "1";
  if (ok) revealMembers();
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
    revealMembers();
  } else {
    gateMsg.textContent = "Wrong password.";
    passInput.value = "";
    passInput.focus();
  }
}

unlockBtn.addEventListener("click", tryUnlock);
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

// Copy to clipboard
copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(BURNER_NUMBER);
    copyMsg.textContent = "Copied.";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  } catch (err) {
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

// Auto reveal if already unlocked this session
maybeReveal();
