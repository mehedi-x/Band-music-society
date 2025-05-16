const container = document.getElementById("lesson-container");
const lang = localStorage.getItem("selectedLanguage");

fetch(`data/${lang}.json`)
  .then(res => res.json())
  .then(data => {
    container.innerHTML = "";
    data.forEach(item => {
      container.innerHTML += `
        <div class="lesson">
          <h3>${item.text} (${item.pronunciation})</h3>
          <p>বাংলা: ${item.translation_bn}</p>
          <p>English: ${item.translation_en}</p>
          <audio controls>
            <source src="assets/audio/${item.audio}" type="audio/mpeg">
          </audio>
        </div>
      `;
    });
  })
  .catch(err => {
    container.innerHTML = "ভাষার ডেটা লোড করতে সমস্যা হয়েছে।";
  });
