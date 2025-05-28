const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const langCodeMap = {
  russian: 'ru',
  german: 'de',
  french: 'fr',
  spanish: 'es',
  italian: 'it'
};

// Language restore on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }
});

languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) return;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

function loadLanguage(lang) {
  fetch(`languages/${lang}.json`)
    .then(res => res.json())
    .then(data => renderVocabulary(data, langCodeMap[lang]))
    .catch(error => {
      conversationArea.innerHTML = `<p style="color:red;">Error loading data: ${error}</p>`;
    });
}

function renderVocabulary(list, langKey) {
  conversationArea.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
      <strong>${item.en}</strong><br>
      <em>${item.bnMeaning}</em><br>
      <div>${item.bn}</div>
      <span>${item[langKey]}</span>
    `;
    conversationArea.appendChild(div);
  });
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});
