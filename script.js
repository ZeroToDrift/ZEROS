document.addEventListener("DOMContentLoaded", () => {

  const MEMBERS_NUMBER = "(646) 444-4277";
  const MEMBER_PASSWORD = "BigJigglyBalls";
  const MENU_JSON_PATH = "menu.json";

  const logo = document.getElementById("logoTrigger");
  const members = document.getElementById("members");
  const pass = document.getElementById("memberPass");
  const unlock = document.getElementById("unlockBtn");
  const msg = document.getElementById("gateMsg");
  const menuContainer = document.getElementById("menuContainer");

  let holdTimer = null;

  /* -----------------------------
     PRESS & HOLD TO SHOW MEMBERS
  ------------------------------*/
  function startHold(e){
    e.preventDefault();
    holdTimer = setTimeout(() => {
      members.classList.remove("hidden");
      members.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  }

  function endHold(){
    clearTimeout(holdTimer);
  }

  logo.addEventListener("mousedown", startHold);
  logo.addEventListener("touchstart", startHold, { passive: false });
  logo.addEventListener("mouseup", endHold);
  logo.addEventListener("mouseleave", endHold);
  logo.addEventListener("touchend", endHold);

  /* -----------------------------
     PASSWORD UNLOCK
  ------------------------------*/
  unlock.addEventListener("click", () => {

    if (pass.value.trim() === MEMBER_PASSWORD) {

      msg.textContent = "Access granted";
      revealNumber();
      loadMenu();

    } else {
      msg.textContent = "Wrong password";
    }

  });

  /* -----------------------------
     REVEAL NUMBER
  ------------------------------*/
  function revealNumber(){
    const numEl = document.getElementById("burnerNumber");
    if(numEl){
      numEl.textContent = MEMBERS_NUMBER;
    }
  }

  /* -----------------------------
     VIDEO DETECTION (NOW SUPPORTS .MOV)
  ------------------------------*/
  function isVideo(path=""){
    return /\.(mp4|webm|ogg|mov)$/i.test(path);
  }

  /* -----------------------------
     LOAD MENU
  ------------------------------*/
  async function loadMenu(){
    try{
      const res = await fetch(MENU_JSON_PATH);
      const data = await res.json();

      renderMenu(data.items || []);

    }catch(err){
      console.error("Menu load failed", err);
      if(menuContainer){
        menuContainer.innerHTML = "<p>Menu failed to load.</p>";
      }
    }
  }

  /* -----------------------------
     RENDER MENU
  ------------------------------*/
  function renderMenu(items){

    if(!menuContainer) return;

    menuContainer.innerHTML = "";

    items.forEach(item => {

      const card = document.createElement("div");
      card.className = "menu-item";

      const title = document.createElement("h3");
      title.textContent = item.name;

      const price = document.createElement("p");
      price.className = "menu-price";
      price.textContent = item.price || "";

      const desc = document.createElement("p");
      desc.className = "menu-desc";
      desc.textContent = item.desc || item.description || "";

      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(desc);

      if(item.media){

        if(isVideo(item.media)){

          const video = document.createElement("video");
          video.src = item.media;
          video.controls = true;
          video.playsInline = true;
          video.muted = true;
          video.className = "menu-media";

          card.appendChild(video);

        } else {

          const img = document.createElement("img");
          img.src = item.media;
          img.className = "menu-media";

          card.appendChild(img);

        }

      }

      menuContainer.appendChild(card);

    });

  }

});
