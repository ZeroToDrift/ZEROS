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

// Toast
function showToast(msg){
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(()=>toast.classList.add("hidden"),1400);
}

// Secret tap logic
let taps = 0;
let timer = null;

function registerTap(){
  taps++;
  clearTimeout(timer);
  timer = setTimeout(()=>taps=0,3000);

  if(taps>=5){
    taps=0;
    membersSection.classList.remove("hidden");
    showToast("Members unlocked");
    setTimeout(()=>{
      membersSection.scrollIntoView({behavior:"smooth"});
    },150);
  }
}

logoTrigger.addEventListener("pointerup",(e)=>{
  e.preventDefault();
  registerTap();
});

// Password logic
function unlock(){
  if(passInput.value.trim()===MEMBER_PASSWORD){
    numberEl.textContent=MEMBERS_NUMBER;
    copyBtn.disabled=false;
    smsLink.classList.remove("disabled");
    smsLink.href=`sms:${encodeURIComponent(MEMBERS_NUMBER)}`;
    showToast("Access granted");
  }else{
    gateMsg.textContent="YOU SUCK DUDE.";
    passInput.value="";
  }
}

unlockBtn.addEventListener("click",unlock);
passInput.addEventListener("keydown",(e)=>{
  if(e.key==="Enter") unlock();
});

copyBtn.addEventListener("click",()=>{
  if(copyBtn.disabled){
    copyMsg.textContent="Locked.";
    return;
  }
  navigator.clipboard.writeText(MEMBERS_NUMBER);
  copyMsg.textContent="Copied.";
  setTimeout(()=>copyMsg.textContent="",1500);
});
