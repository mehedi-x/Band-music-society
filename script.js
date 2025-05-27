const languageSelector = document.getElementById('language-selector');
const conversationArea = document.getElementById('conversation-area');
const themeToggle = document.getElementById('theme-toggle');

const languageData = {
  french: typeof FRENCH_DATA !== 'undefined' ? FRENCH_DATA : null,
  german: typeof GERMAN_DATA !== 'undefined' ? GERMAN_DATA : null,
  russian: typeof RUSSIAN_DATA !== 'undefined' ? RUSSIAN_DATA : null
};

// Load saved language
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang && languageData[savedLang]) {
  languageSelector.value = savedLang;
  loadLanguage(savedLang);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

languageSelector.addEventListener('change', () => {
  const lang = languageSelector.value;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function loadLanguage(lang) {
  const data = languageData[lang];
  conversationArea.innerHTML = '';

  if (!data || !Array.isArray(data) || data.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'fallback-message';
    msg.textContent = 'No data available for this language.';
    conversationArea.appendChild(msg);
    return;
  }

  data.forEach(item => {
    const entry = document.createElement('div');
    entry.innerHTML = `
      <p><strong>${item.en}</strong></p>
      <p>বাংলা: ${item.bnMeaning}</p>
      <p>উচ্চারণ: ${item.bn}</p>
      <hr>
    `;
    conversationArea.appendChild(entry);
  });
}
