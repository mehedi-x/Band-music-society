const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    { ru: 'Привет', bn: 'প্রিভিয়েত', bnMeaning: 'হ্যালো', en: 'Hello' },
    { ru: 'Спасибо', bn: 'স্পাসিবো', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
    { ru: 'Как дела?', bn: 'কাক দেলা?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
    { ru: 'Здравствуйте', bn: 'জদরাভস্তভুইত্যে', bnMeaning: 'শুভ দিন', en: 'Hello (formal)' },
    { ru: 'Пожалуйста', bn: 'পাঝালুস্তা', bnMeaning: 'দয়া করে / স্বাগতম', en: "Please / You're welcome" }
  ],
  german: [
    { ru: 'Hallo', bn: 'হালো', bnMeaning: 'হ্যালো', en: 'Hello' },
    { ru: 'Danke', bn: 'ডাঙ্কে', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
    { ru: 'Wie geht\'s?', bn: 'ভি গেটস?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
  ]
};

function renderVocabulary(lang) {
  const data = vocabulary[lang] || [];
  conversationArea.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('conversation-item');
    div.innerHTML = `
      <p><strong>RU:</strong> ${item.ru}</p>
      <p><strong>📢 উচ্চারণ:</strong> ${item.bn}</p>
      <p><strong>🇧🇩 বাংলা অর্থ:</strong> ${item.bnMeaning ? item.bnMeaning : '—'}</p>
      <p><strong>🔤 English:</strong> ${item.en}</p>
    `;
    conversationArea.appendChild(div);
  });
}

// Load saved language
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang && vocabulary[savedLang]) {
  languageSelect.value = savedLang;
  renderVocabulary(savedLang);
} else {
  const defaultLang = languageSelect.value;
  localStorage.setItem('selectedLanguage', defaultLang);
  renderVocabulary(defaultLang);
}

// Save on change
languageSelect.addEventListener('change', () => {
  const selected = languageSelect.value;
  localStorage.setItem('selectedLanguage', selected);
  renderVocabulary(selected);
});

// Theme memory
const isDark = localStorage.getItem('darkMode') === 'true';
if (isDark) {
  document.body.classList.add('dark-mode');
  modeToggle.textContent = '☀️';
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkNow = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkNow);
  modeToggle.textContent = isDarkNow ? '☀️' : '🌙';
});
