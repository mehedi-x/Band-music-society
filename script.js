
// Clock Display
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Scroll to top button
const scrollBtn = document.getElementById("scrollTopBtn");
window.onscroll = function() {
  scrollBtn.style.display = (document.documentElement.scrollTop > 100) ? "block" : "none";
};
scrollBtn.onclick = function() {
  document.documentElement.scrollTop = 0;
};

// Text-to-Speech
document.querySelectorAll(".speak-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const msg = new SpeechSynthesisUtterance(btn.dataset.text);
    msg.lang = "ru-RU";
    speechSynthesis.speak(msg);
  });
});

// LocalStorage - Completion Tracker & Favorite
document.querySelectorAll(".done").forEach((box, i) => {
  box.checked = localStorage.getItem("done-" + i) === "true";
  box.addEventListener("change", () => localStorage.setItem("done-" + i, box.checked));
});
document.querySelectorAll(".fav-btn").forEach((btn, i) => {
  btn.classList.toggle("favorited", localStorage.getItem("fav-" + i) === "true");
  btn.addEventListener("click", () => {
    const isFav = btn.classList.toggle("favorited");
    localStorage.setItem("fav-" + i, isFav);
  });
});
