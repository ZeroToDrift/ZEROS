 function copyNumber() {
  const number = "(518) 694-6569";

  navigator.clipboard.writeText(number)
    .then(() => {
      alert("Number copied!");
    })
    .catch(() => {
      alert("Copy failed.");
    });
}
