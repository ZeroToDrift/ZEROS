function copyNumber() {
  const number = "5186946569";

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(number)
      .then(() => showToast("Number copied ✅"))
      .catch(() => fallbackCopy(number));
  } else {
    fallbackCopy(number);
  }
}

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToast("Number copied ✅");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}
