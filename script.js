// DOM Elements
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

// Sample vocabulary (আপনার বাস্তব ডেটা এখানে থাকবে)
const vocabulary = {
  russian: [
    { ru: 'Привет', bn: 'প্রিভিয়েত', en: 'Hello' },
    { ru: 'Спасибо', bn: 'স্পাসিবো', en: 'Thank you' },
  ],
  spanish: [
    { ru: 'Hola', bn: 'ওলা', en: 'Hello' },
    { ru: 'Gracias', bn: 'গ্রাসিয়াস', en: 'Thank you' },
  ],
  french: [
    { ru: 'Bonjour', bn: 'বঁজুর', en: 'Hello' },
    { ru: 'Merci', bn: 'মেরসি', en: 'Thank you' },
  ]
};

// Render vocabulary function
function renderVocabulary(lang) {
  const data = vocabulary[lang] || [];
  conversationArea.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('conversation-item');
    div.innerHTML = `
      <p><strong>${item.ru}</strong></p>
      <p>📢 ${item.bn}</p>
      <p>🔤 ${item.en}</p>
    `;
    conversationArea.appendChild(div);
  });
}

// --- Initial Setup with localStorage support ---

// Load selected language from localStorage or set default
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang && vocabulary[savedLang]) {
  languageSelect.value = savedLang;
  renderVocabulary(savedLang);
} else {
  const defaultLang = languageSelect.value;
  localStorage.setItem('selectedLanguage', defaultLang);
  renderVocabulary(defaultLang);
}

// Save language on change
languageSelect.addEventListener('change', () => {
  const selected = languageSelect.value;
  localStorage.setItem('selectedLanguage', selected);
  renderVocabulary(selected);
});

// --- Dark/Light Mode toggle with memory ---
const isDark = localStorage.getItem('darkMode') === 'true';
if (isDark) {
  document.body.classList.add('dark-mode');
  modeToggle.textContent = '☀️';
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isNowDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isNowDark);
  modeToggle.textContent = isNowDark ? '☀️' : '🌙';
});
