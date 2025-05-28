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

// ✅ পেজ লোড হলে লোকালস্টোরেজ থেকে ভাষা ও থিম লোড
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
  }
});

// ✅ ভাষা সিলেক্ট করলে সেটিংস স্মৃতি থাকে
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) return;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

// ✅ ভাষা JSON লোড করে UI রেন্ডার
function loadLanguage(lang) {
  fetch(`languages/${lang}.json`)
    .then(res => res.json())
    .then(data => renderVocabulary(data, langCodeMap[lang]))
    .catch(error => {
      conversationArea.innerHTML = `<p style="color:red;">Error loading data: ${error}</p>`;
    });
}

// ✅ কথাবার্তা রেন্ডার
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

// ✅ থিম টগল ও লোকালস্টোরেজে সংরক্ষণ
modeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
