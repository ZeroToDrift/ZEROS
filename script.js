/* =========================
   Pressure Season — ZEROS
   Members unlock + live media menu
   ========================= */

const PASSWORD = "BigJigglyBalls";
const MEMBER_LINE = "646 332-9902";

// Press & hold config
const HOLD_MS = 700;

// DOM
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
const memberLineEl = document.getElementById("memberLine");

const liveMenuMount = document.getElementById("liveMenuMount");

// Modal
let modalEl = null;

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

function normalize(s) {
  return (s || "").trim();
}

/* =========================
   Live Menu (Injected only AFTER unlock)
   Media is lazy-loaded only after unlock
   ========================= */

// Put your media in: /media/...
// Example paths below:
//   media/runtz.jpg
//   media/boutiq.mp4
// If you don't have a file yet, leave placeholder as "" and it will show a fallback tile.
const LIVE_ITEMS = [
  {
    id: "runtz-35",
    category: "Flower",
    name: "RUNTZ",
    price: "3.5g $30",
    details: "Sweet gas • colorful nugs • smooth smoke",
    stockNote: "",
    mediaType: "image",
    mediaSrc: "media/runtz.jpg"
  },
  {
    id: "lcg-35",
    category: "Flower",
    name: "Lemon Cherry Gumbo",
    price: "3.5g $25",
    details: "Citrus + candy • chill body",
    stockNote: "",
    mediaType: "image",
    mediaSrc: "media/lemon-cherry-gumbo.jpg"
  },
  {
    id: "smoothie-2g",
    category: "Disposables",
    name: "Smoothie Bar",
    price: "2g $40",
    details: "Smooth pull • fruity finish",
    stockNote: "Only 1 left",
    mediaType: "video",
    mediaSrc: "media/smoothie-bar.mp4"
  },
  {
    id: "boutiq-v5",
    category: "Disposables",
    name: "BOUTIQ SWITCH V5",
    price: "Triple Tank 2G $45",
    details: "Heavy clouds • consistent hit",
    stockNote: "",
    mediaType: "video",
    mediaSrc: "media/boutiq-switch-v5.mp4"
  },
  {
    id: "lemon-skunk-live",
    category: "Concentrates",
    name: "Lemon Skunk — Live Resin",
    price: "1g $25",
    details: "Loud terp profile • clean melt",
    stockNote: "",
    mediaType: "image",
    mediaSrc: "media/lemon-skunk-live-resin.jpg"
  },
  {
    id: "empire-papers",
    category: "Accessories",
    name: "Empire Papers",
    price: "$3",
    details: "Clean burn • slow roll",
    stockNote: "",
    mediaType: "image",
    mediaSrc: "media/empire-papers.jpg"
  },
  {
    id: "rolling-tray",
    category: "Accessories",
    name: "Rolling Trays",
    price: "$10",
    details: "Keeps it neat • portable",
    stockNote: "",
    mediaType: "image",
    mediaSrc: "media/rolling-tray.jpg"
  }
];

function buildLiveMenuShell() {
  const wrap = document.createElement("section");
  wrap.className = "liveMenu";
  wrap.id = "liveMenu";

  wrap.innerHTML = `
    <div class="liveMenu__head">
      <div class="liveMenu__title">
        <span class="dot"></span>
        <strong style="letter-spacing:.14em;text-transform:uppercase;">LIVE MENU</strong>
        <span class="pill">Members Only</span>
      </div>

      <div class="filters" id="filters">
        ${["All", "Flower", "Disposables", "Concentrates", "Accessories"]
          .map((c, i) => `<button type="button" class="filterBtn ${i===0?"active":""}" data-filter="${c}">${c}</button>`)
          .join("")}
      </div>
    </div>

    <div class="menuGrid" id="menuGrid"></div>
  `;

  return wrap;
}

function renderMenuItems(filter = "All") {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const items = LIVE_ITEMS.filter(it => filter === "All" ? true : it.category === filter);
  grid.innerHTML = "";

  for (const it of items) {
    const card = document.createElement("div");
    card.className = "itemCard";
    card.setAttribute("data-id", it.id);

    const low = it.stockNote && it.stockNote.toLowerCase().includes("only");
    const badgeHtml = it.stockNote
      ? `<div class="badge ${low ? "low" : ""}">${escapeHtml(it.stockNote)}</div>`
      : "";

    // IMPORTANT:
    // We do NOT set real src until AFTER unlock.
    // We store in data-src and swap in after.
    const mediaHtml = (it.mediaType === "video")
      ? `
        <video muted loop playsinline preload="none" data-src="${escapeAttr(it.mediaSrc)}">
          <source data-src="${escapeAttr(it.mediaSrc)}" type="video/mp4">
        </video>`
      : `
        <img alt="${escapeAttr(it.name)}" loading="lazy" data-src="${escapeAttr(it.mediaSrc)}" />
      `;

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

    card.addEventListener("click", () => openItemModal(it));
    grid.appendChild(card);
  }

  // After rendering, if already unlocked, load media immediately
  if (isUnlocked) loadVisibleMedia();
}

function loadVisibleMedia() {
  // Swap all data-src -> src (images)
  document.querySelectorAll("#liveMenu img[data-src]").forEach(img => {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-src");
  });

  // Videos: set src for <source>, then load + play
  document.querySelectorAll("#liveMenu video").forEach(v => {
    const source = v.querySelector("source");
    const src = source?.getAttribute("data-src") || v.getAttribute("data-src");
    if (!src) return;

    if (source && source.getAttribute("data-src")) {
      source.src = src;
      source.removeAttribute("data-src");
    }
    if (v.getAttribute("data-src")) v.removeAttribute("data-src");

    try {
      v.load();
      v.play().catch(() => {});
    } catch (_) {}
  });
}

function mountLiveMenu() {
  // Inject only once
  if (document.getElementById("liveMenu")) return;

  const shell = buildLiveMenuShell();
  liveMenuMount.appendChild(shell);

  // Filter buttons
  const filters = document.getElementById("filters");
  filters?.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("button[data-filter]");
    if (!btn) return;

    filters.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenuItems(btn.getAttribute("data-filter") || "All");
  });

  renderMenuItems("All");
}

/* =========================
   Modal
   ========================= */

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement("div");
  modalEl.className = "modal hidden";
  modalEl.innerHTML = `
    <div class="modal__backdrop" data-close="1"></div>
    <div class="modal__panel">
      <button class="modal__close" type="button" data-close="1" aria-label="Close">✕</button>
      <div id="modalContent" class="modalContent"></div>
    </div>
  `;

  document.body.appendChild(modalEl);

  modalEl.addEventListener("click", (e) => {
    const close = e.target?.getAttribute?.("data-close");
    if (close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modalEl.classList.contains("hidden") && e.key === "Escape") closeModal();
  });

  return modalEl;
}

function openItemModal(item) {
  ensureModal();

  const content = document.getElementById("modalContent");
  if (!content) return;

  const mediaBlock = (() => {
    if (!item.mediaSrc) {
      return `<div class="modalMedia" style="display:grid;place-items:center;opacity:.65;">NO MEDIA YET</div>`;
    }
    if (item.mediaType === "video") {
      return `
        <div class="modalMedia">
          <video muted loop playsinline controls preload="none">
            <source src="${escapeAttr(item.mediaSrc)}" type="video/mp4">
          </video>
        </div>
      `;
    }
    return `
      <div class="modalMedia">
        <img src="${escapeAttr(item.mediaSrc)}" alt="${escapeAttr(item.name)}" />
      </div>
    `;
  })();

  content.innerHTML = `
    ${mediaBlock}
    <div class="modalInfo">
      <h3 id="modalTitle">${escapeHtml(item.name)}</h3>
      <div class="muted">${escapeHtml(item.details)}</div>

      <div class="list">
        <div class="kv"><span>Category</span><span>${escapeHtml(item.category)}</span></div>
        <div class="kv"><span>Price</span><span>${escapeHtml(item.price)}</span></div>
        ${item.stockNote ? `<div class="kv"><span>Status</span><span>${escapeHtml(item.stockNote)}</span></div>` : ""}
      </div>
    </div>
  `;

  modalEl.classList.remove("hidden");
}

function closeModal() {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
}

/* =========================
   Unlock logic
   ========================= */

function setUnlockedUI() {
  lockedBox.classList.add("hidden");
  unlockedBox.classList.remove("hidden");

  memberLineEl.textContent = MEMBER_LINE;

  // enable SMS link
  const sms = "sms:" + MEMBER_LINE.replace(/\s+/g, "");
  textBtn.setAttribute("href", sms);

  // Inject + render menu ONLY NOW
  mountLiveMenu();

  // Now that it exists, load media
  loadVisibleMedia();
}

function unlock() {
  isUnlocked = true;
  pwMsg.textContent = "";
  pwInput.value = "";
  showToast("MEMBERS UNLOCKED");
  setUnlockedUI();
}

function tryUnlock() {
  const entered = normalize(pwInput.value);
  if (!entered) {
    pwMsg.textContent = "Enter the password.";
    return;
  }
  if (entered === PASSWORD) {
    unlock();
  } else {
    pwMsg.textContent = "Wrong password.";
    showToast("ACCESS DENIED");
  }
}

/* =========================
   Press & hold to open members
   ========================= */

function startHold() {
  clearTimeout(holdTimer);
  holdTimer = setTimeout(() => {
    openMembers();
    showToast("MEMBERS");
  }, HOLD_MS);
}
function cancelHold() {
  clearTimeout(holdTimer);
}

// Press & hold: mouse + touch
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

/* Unlock button + enter key */
pwBtn.addEventListener("click", tryUnlock);
pwInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

/* Copy button only works after unlock (button exists only in unlocked UI) */
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(MEMBER_LINE);
    showToast("COPIED");
  } catch (_) {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = MEMBER_LINE;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("COPIED");
  }
});

/* =========================
   Leaf Rain
   ========================= */

function makeLeaf() {
  const leaf = document.createElement("div");
  leaf.className = "leaf";

  const left = Math.random() * 100;
  const dur = 6 + Math.random() * 8;      // 6–14s
  const delay = Math.random() * 4;        // 0–4s
  const size = 18 + Math.random() * 18;   // 18–36px
  const opacity = 0.10 + Math.random() * 0.22;

  leaf.style.left = left + "vw";
  leaf.style.animationDuration = dur + "s";
  leaf.style.animationDelay = delay + "s";
  leaf.style.opacity = opacity.toFixed(2);

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

  // spawn a bunch
  const count = 26;
  for (let i = 0; i < count; i++) {
    const leaf = makeLeaf();
    rain.appendChild(leaf);

    // recycle leaves
    leaf.addEventListener("animationend", () => {
      leaf.remove();
      rain.appendChild(makeLeaf());
    });
  }
}

/* =========================
   Helpers
   ========================= */

function escapeHtml(str) {
  return (str ?? "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

/* =========================
   Boot
   ========================= */
(function boot() {
  showToast("JS ONLINE");
  initLeafRain();
})();
