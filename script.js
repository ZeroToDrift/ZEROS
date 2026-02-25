document.addEventListener("DOMContentLoaded",()=>{

  const MEMBER_PASSWORD="BigJigglyBalls"
  const logo=document.getElementById("logoTrigger")
  const members=document.getElementById("members")
  const pass=document.getElementById("memberPass")
  const unlock=document.getElementById("unlockBtn")
  const msg=document.getElementById("gateMsg")
  const toast=document.getElementById("toast")
  const leafContainer=document.querySelector(".leaf-rain")

  function showToast(t){
    toast.textContent=t
    toast.classList.remove("hidden")
    setTimeout(()=>toast.classList.add("hidden"),1200)
  }

  showToast("JS ONLINE")

  // PRESS & HOLD MEMBERS UNLOCK
  let holdTimer=null
  logo.addEventListener("mousedown",startHold)
  logo.addEventListener("touchstart",startHold,{passive:false})
  logo.addEventListener("mouseup",endHold)
  logo.addEventListener("mouseleave",endHold)
  logo.addEventListener("touchend",endHold)

  function startHold(e){
    e.preventDefault()
    holdTimer=setTimeout(()=>{
      members.classList.remove("hidden")
      showToast("Members unlocked")
    },1000)
  }

  function endHold(){
    clearTimeout(holdTimer)
  }

  unlock.addEventListener("click",()=>{
    if(pass.value.trim()===MEMBER_PASSWORD){
      msg.textContent="Access granted"
    }else{
      msg.textContent="Wrong password"
    }
  })

  // LEAF RAIN (Guaranteed Working)
  const leafSVG=`url("data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
  <path fill='lime' d='M32 4c2 8 3 16 2 24 4-6 10-11 18-14-5 10-10 18-18 24 6-1 13-1 22 2-9 6-17 9-24 8 5 5 9 12 10 22-9-5-15-11-18-18-3 7-9 13-18 18 1-10 5-17 10-22-7 1-15-2-24-8 9-3 16-3 22-2-8-6-13-14-18-24 8 3 14 8 18 14-1-8 0-16 2-24z'/>
  </svg>")`

  for(let i=0;i<30;i++){
    const leaf=document.createElement("div")
    leaf.className="leaf"
    leaf.style.left=Math.random()*100+"vw"
    leaf.style.animationDuration=8+Math.random()*8+"s"
    leaf.style.backgroundImage=leafSVG
    leafContainer.appendChild(leaf)
  }

})
