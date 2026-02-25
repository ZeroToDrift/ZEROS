document.addEventListener("DOMContentLoaded", () => {
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MEMBERS_NUMBER = "(646) 332-9902";

  const pressureLevel = document.getElementById("pressureLevel");
  const cultLine = document.getElementById("cultLine");
  const taglineText = document.getElementById("taglineText");

  const passInput = document.getElementById("memberPass");
  const gateMsg = document.getElementById("gateMsg");

  let wrongAttempts = 0;

  // ===== CULT PHRASES =====
  const cultPhrases = [
    "Members move in silence.",
    "Stay discreet.",
    "Eyes open.",
    "Access is earned.",
    "Not everyone gets in."
  ];

  function rotateCult(){
    cultLine.textContent =
      cultPhrases[Math.floor(Math.random() * cultPhrases.length)];
  }

  rotateCult();
  setInterval(rotateCult, 8000);

  // ===== PRESSURE LEVEL =====
  function setPressure(text){
    pressureLevel.textContent = "PRESSURE LEVEL: " + text;
  }

  setPressure("STABLE");

  document.addEventListener("scroll", () => {
    setPressure("RISING");
  });

  // ===== WRONG PASSWORD REACTION =====
  function updatePressureFromAttempts(){
    if (wrongAttempts === 1) setPressure("ELEVATED");
    if (wrongAttempts >= 3) setPressure("MONITORED");
    if (wrongAttempts >= 5) setPressure("DENIED");
  }

  // Hook into your existing unlock button
  const unlockBtn = document.getElementById("unlockBtn");
  unlockBtn?.addEventListener("click", () => {
    const attempt = passInput.value.trim();

    if (attempt !== MEMBER_PASSWORD) {
      wrongAttempts++;
      updatePressureFromAttempts();
    } else {
      wrongAttempts = 0;
      setPressure("CLEARED");
    }
  });

  // ===== TYPING AWARENESS =====
  let typingTimer;

  passInput?.addEventListener("focus", () => {
    typingTimer = setTimeout(() => {
      gateMsg.textContent = "Proceed when ready.";
    }, 4000);
  });

  passInput?.addEventListener("input", () => {
    clearTimeout(typingTimer);
  });

  passInput?.addEventListener("blur", () => {
    clearTimeout(typingTimer);
  });

  // ===== AFTER DARK MODE =====
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) {
    document.body.classList.add("after-dark");
    taglineText.textContent = "After Hours Protocol Active.";
  }

  // ===== RARE SILENT FLICKER =====
  if (Math.random() < 0.02) {
    document.body.style.opacity = "0.92";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 120);
  }

});
