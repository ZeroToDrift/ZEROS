const PASSWORD = "BigJigglyBalls";
const MEMBER_LINE = "646 332-9902";
const HOLD_MS = 700;

const toast = document.getElementById("toast");
const zerosLogo = document.getElementById("zerosLogo");
const membersOverlay = document.getElementById("membersOverlay");
const pwInput = document.getElementById("pwInput");
const pwBtn = document.getElementById("pwBtn");
const pwMsg = document.getElementById("pwMsg");

const lockedBox = document.getElementById("membersLocked");
const unlockedBox = document.getElementById("membersUnlocked");

const copyBtn = document.getElementById("copyBtn");
const textBtn = document.getElementById("textBtn");
const lockBtn = document.getElementById("lockBtn");
const memberLineEl = document.getElementById("memberLine");

const liveMenuMount = document.getElementById("liveMenuMount");

const lockedSplash = document.getElementById("lockedSplash");
const publicMenu = document.getElementById("publicMenu");

let holdTimer = null;
let isUnlocked = false;

function showToast(msg = "JS ONLINE") {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1400);
}

function openMembers() {
  membersOverlay.classList.remove("hidden");
  membersOverlay.setAttribute("aria-hidden", "false");
  setTimeout(() => pwInput?.focus(), 0);
}
function closeMembers() {
  membersOverlay.classList.add("hidden");
  membersOverlay.setAttribute("aria-hidden", "true");
}

function normalize(s) { return (s || "").trim(); }

/* ===== Live items (media injected only after unlock) ===== */
const LIVE_ITEMS = [
  { id:"runtz-35", category:"Flower", name:"RUNTZ", price:"3.5g $30", details:"Sweet gas • colorful nugs • smooth smoke", stockNote:"", mediaType:"image", mediaSrc:"media/runtz.jpg" },
  { id:"lcg-35", category:"Flower", name:"Lemon Cherry Gumbo", price:"3.5g $25", details:"Citrus + candy • chill body", stockNote:"", mediaType:"image", mediaSrc:"media/lemon-cherry-gumbo.jpg" },
  { id:"smoothie-2g", category:"Disposables", name:"Smoothie Bar", price:"2g $40", details:"Smooth pull • fruity finish", stockNote:"Only 1 left", mediaType:"video", mediaSrc:"media/smoothie-bar.mp4" },
  { id:"boutiq-v5", category:"Disposables", name:"BOUTIQ SWITCH V5", price:"Triple Tank 2G $45", details:"Heavy clouds • consistent hit", stockNote:"", mediaType:"video", mediaSrc:"media/boutiq-switch-v5.mp4" },
  { id:"lemon-skunk-live", category:"Concentrates", name:"Lemon Skunk — Live Resin", price:"1g $25", details:"Loud terp profile • clean melt", stockNote:"", mediaType:"image", mediaSrc:"media/lemon-skunk-live-resin.jpg" },
  { id:"empire-papers", category:"Accessories", name:"Empire Papers", price:"$3", details:"Clean burn • slow roll", stockNote:"", mediaType:"image", mediaSrc:"media/empire-papers.jpg" },
  { id:"rolling-tray", category:"Accessories", name:"Rolling Trays", price:"$10", details:"Keeps it neat • portable", stockNote:"", mediaType:"image", mediaSrc:"media/rolling-tray.jpg" }
];

function escapeHtml(str) {
  return (str ?? "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) { return escapeHtml(str).replaceAll("`", "&#096;"); }

function buildLiveMenuShell() {
  const wrap = document.createElement("section");
  wrap.className = "liveMenu";
  wrap.id = "liveMenu";

  wrap.innerHTML = `
    <div class="liveMenu__head">
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="dot"></span>
        <strong style="letter-spacing:.14em;text-transform:uppercase;">LIVE MENU</strong>
        <span style="padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.22);font-size:12px;opacity:.9;">Members Only</span>
      </div>
      <div class="filters" id="filters">
        ${["All","Flower","Disposables","Concentrates","Accessories"].map((c,i)=>`
          <button type="button" class="filterBtn ${i===0?"active":""}" data-filter="${c}">${c}</button>
        `).join("")}
      </div>
    </div>
    <div class="menuGrid" id="menuGrid"></div>
  `;
  return wrap;
}

function renderMenuItems(filter="All") {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const items = LIVE_ITEMS.filter(it => filter==="All" ? true : it.category===filter);
  grid.innerHTML = "";

  for (const it of items) {
    const card = document.createElement("div");
    card.className = "itemCard";

    const low = it.stockNote && it.stockNote.toLowerCase().includes("only");
    const badgeHtml = it.stockNote ? `<div class="badge ${low ? "low" : ""}">${escapeHtml(it.stockNote)}</div>` : "";

    const mediaHtml = it.mediaType === "video"
      ? `<video muted loop playsinline preload="none" data-src="${escapeAttr(it.mediaSrc)}"><source data-src="${escapeAttr(it.mediaSrc)}" type="video/mp4"></video>`
      : `<img alt="${escapeAttr(it.name)}" loading="lazy" data-src="${escapeAttr(it.mediaSrc)}" />`;

    card.innerHTML = `
      <div class="mediaBox">
        ${badgeHtml}
        ${it.mediaSrc ? mediaHtml : `<div style="width:100%;height:100%;display:grid;place-items:center;opacity:.65;font-size:12px;">NO MEDIA YET</div>`}
      </div>
      <div class="itemBody">
        <p class="itemTitle">${escapeHtml(it.name)}</p>
        <div class="itemMeta">
          <span>${escapeHtml(it.category)}</span>
          <span>${escapeHtml(it.price)}</span>
        </div>
        <p class="itemDesc">${escapeHtml(it.details)}</p>
      </div>
    `;

    grid.appendChild(card);
  }

  if (isUnlocked) loadVisibleMedia();
}

function loadVisibleMedia() {
  document.querySelectorAll("#liveMenu img[data-src]").forEach(img => {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-src");
  });

  document.querySelectorAll("#liveMenu video").forEach(v => {
    const source = v.querySelector("source");
    const src = source?.getAttribute("data-src") || v.getAttribute("data-src");
    if (!src) return;

    if (source && source.getAttribute("data-src")) {
      source.src = src;
      source.removeAttribute("data-src");
    }
    if (v.getAttribute("data-src")) v.removeAttribute("data-src");

    try { v.load(); v.play().catch(()=>{}); } catch(_){}
  });
}

function mountLiveMenu() {
  if (document.getElementById("liveMenu")) return;

  const shell = buildLiveMenuShell();
  liveMenuMount.appendChild(shell);

  const filters = document.getElementById("filters");
  filters?.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("button[data-filter]");
    if (!btn) return;
    filters.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenuItems(btn.getAttribute("data-filter") || "All");
  });

  renderMenuItems("All");
  loadVisibleMedia();
}

/* ===== Unlock / Lock ===== */
function setUnlockedUI() {
  lockedSplash.classList.add("hidden");
  publicMenu.classList.remove("hidden");

  lockedBox.classList.add("hidden");
  unlockedBox.classList.remove("hidden");

  memberLineEl.textContent = MEMBER_LINE;
  textBtn.setAttribute("href", "sms:" + MEMBER_LINE.replace(/\s+/g, ""));

  mountLiveMenu();
}

function unlock() {
  isUnlocked = true;
  localStorage.setItem("zeros_members_unlocked", "1");

  pwMsg.textContent = "";
  pwInput.value = "";

  showToast("MEMBERS UNLOCKED");
  setUnlockedUI();
}

function lockBack() {
  isUnlocked = false;
  localStorage.removeItem("zeros_members_unlocked");

  // remove live menu from DOM
  const live = document.getElementById("liveMenu");
  if (live) live.remove();
  liveMenuMount.innerHTML = "";

  // UI back to locked
  lockedSplash.classList.remove("hidden");
  publicMenu.classList.add("hidden");

  lockedBox.classList.remove("hidden");
  unlockedBox.classList.add("hidden");

  showToast("LOCKED");
  closeMembers();
}

function tryUnlock() {
  const entered = normalize(pwInput.value);
  if (!entered) { pwMsg.textContent = "Enter the password."; return; }
  if (entered === PASSWORD) unlock();
  else { pwMsg.textContent = "Wrong password."; showToast("ACCESS DENIED"); }
}

/* ===== Press & hold ===== */
function startHold() {
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    openMembers();
    showToast("MEMBERS");
  }, HOLD_MS);
}
function cancelHold() { clearTimeout(holdTimer); }

zerosLogo.addEventListener("mousedown", startHold);
zerosLogo.addEventListener("mouseup", cancelHold);
zerosLogo.addEventListener("mouseleave", cancelHold);

zerosLogo.addEventListener("touchstart", (e) => { e.preventDefault(); startHold(); }, { passive:false });
zerosLogo.addEventListener("touchend", cancelHold);
zerosLogo.addEventListener("touchcancel", cancelHold);

/* Overlay close */
membersOverlay.addEventListener("click", (e) => {
  if (e.target?.getAttribute?.("data-close")) closeMembers();
});
document.addEventListener("keydown", (e) => {
  if (!membersOverlay.classList.contains("hidden") && e.key === "Escape") closeMembers();
});

/* Unlock controls */
pwBtn.addEventListener("click", tryUnlock);
pwInput.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });

lockBtn.addEventListener("click", lockBack);

/* Copy */
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(MEMBER_LINE);
    showToast("COPIED");
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = MEMBER_LINE;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("COPIED");
  }
});

/* Leaf rain */
function makeLeaf() {
  const leaf = document.createElement("div");
  leaf.className = "leaf";

  leaf.style.left = (Math.random() * 100) + "vw";
  leaf.style.animationDuration = (6 + Math.random() * 8) + "s";
  leaf.style.animationDelay = (Math.random() * 4) + "s";
  leaf.style.opacity = (0.10 + Math.random() * 0.22).toFixed(2);

  const size = 18 + Math.random() * 18;
  leaf.innerHTML = `
    <svg style="width:${size}px;height:${size}px;" viewBox="0 0 64 64" aria-hidden="true">
      <use href="#leafIcon"></use>
    </svg>
  `;
  return leaf;
}

function initLeafRain() {
  const rain = document.getElementById("leafRain");
  if (!rain) return;

  for (let i = 0; i < 26; i++) {
    const leaf = makeLeaf();
    rain.appendChild(leaf);
    leaf.addEventListener("animationend", () => {
      leaf.remove();
      rain.appendChild(makeLeaf());
    });
  }
}

/* Boot */
(function boot(){
  showToast("JS ONLINE");
  initLeafRain();

  // If already unlocked from last time, skip password
  if (localStorage.getItem("zeros_members_unlocked") === "1") {
    isUnlocked = true;
    setUnlockedUI();
  } else {
    // keep it locked on load
    lockedSplash.classList.remove("hidden");
    publicMenu.classList.add("hidden");
  }
})();
