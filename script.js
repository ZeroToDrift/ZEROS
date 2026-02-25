document.addEventListener("DOMContentLoaded", () => {

  alert("SCRIPT LOADED ✅"); // Debug check

  const leafContainer = document.querySelector(".leaf-rain");

  if (leafContainer) {
    const leafCount = 80; // VERY visible test

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      leaf.textContent = "🍃";

      leaf.style.left = Math.random() * 100 + "vw";
      leaf.style.animationDuration = (5 + Math.random() * 8) + "s";
      leaf.style.animationDelay = Math.random() * 5 + "s";

      leafContainer.appendChild(leaf);
    }
  }

  // Cult phrases
  const cultEl = document.getElementById("cultLine");
  const phrases = [
    "Members move in silence.",
    "Stay discreet.",
    "Access is earned.",
    "You weren’t invited."
  ];

  function rotate(){
    cultEl.textContent =
      phrases[Math.floor(Math.random()*phrases.length)];
  }

  rotate();
  setInterval(rotate, 4000);

});
