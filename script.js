// Smooth Scroll on Open
document.querySelectorAll("details").forEach(section => {
  section.addEventListener("toggle", function () {
    if (this.open) {
      this.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
