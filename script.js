function copyNumber() {
  const number = document.getElementById("phone").innerText;
  navigator.clipboard.writeText(number);

  const message = document.getElementById("copied");
  message.innerText = "Number Copied ✅";

  setTimeout(() => {
    message.innerText = "";
  }, 1500);
}