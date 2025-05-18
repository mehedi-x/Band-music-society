const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    { ru: 'Привет', bn: 'প্রিভিয়েত', en: 'Hello' },
    { ru: 'Спасибо', bn: 'স্পাসিবো', en: 'Thank you' },
    { ru: 'Как дела?', bn: 'কাক দেলা?', en: 'How are you?' },
    { ru: 'Привет', bn: 'প্রিভিয়েত', en: 'Hello' },
{ ru: 'Спасибо', bn: 'স্পাসিবো', en: 'Thank you' },
{ ru: 'Здравствуйте', bn: 'জদরাশভুতই', en: 'Hello' },
{ ru: 'Как дела?', bn: 'কাক দেলা?', en: 'How are you?' },
{ ru: 'Пожалуйста', bn: 'পজালুস্তা', en: "Please/You're welcome" },
{ ru: 'Извините', bn: 'ইজভিনিতয়ে', en: 'Excuse me/Sorry' },
{ ru: 'Где находится больница?', bn: 'গ্দে নাখোডিতসা বলনিতসা?', en: 'Where is the hospital?' },
{ ru: 'Сколько это стоит?', bn: 'স্কলকো এতো স্তোইত?', en: 'How much does it cost?' },
{ ru: 'Я не понимаю', bn: 'ইয়া নি পোনিমায়ু', en: "I don't understand" },
{ ru: 'Говорите медленнее, пожалуйста', bn: 'গাভোরিতে মেদলেননে, পজালুস্তা', en: 'Please speak slowly' },
{ ru: 'Я хочу воды', bn: 'ইয়া খাচু ভোদি', en: 'I want water' },
{ ru: 'Который час?', bn: 'কতোরি চাস?', en: 'What time is it?' },
{ ru: 'Мне нужна помощь', bn: 'মনে নুজনা পোমোশ', en: 'I need help' },
{ ru: 'Где ближайший магазин?', bn: 'গ্দে ব্লিযেশি মাগাজিন?', en: 'Where is the nearest shop?' },
{ ru: 'Я студент', bn: 'ইয়া স্তুডেণ্ত', en: 'I am a student' },
{ ru: 'Можно меню?', bn: 'মনঝনা মেন্যু?', en: 'Can I have the menu?' },
{ ru: 'Где автобусная остановка?', bn: 'গ্দে অবতুবস্নায়া ওস্তানোভকা?', en: 'Where is the bus stop?' },
{ ru: 'Мне нужно такси', bn: 'মনে নুজনা তাছি', en: 'I need a taxi' },
{ ru: 'Как пройти к университету?', bn: 'কাক প্রচতাই কু ইউনিভার্সিতেতু?', en: 'How to get to the university?' },
{ ru: 'У меня аллергия', bn: 'উ মেন্যা আলারগিয়া', en: 'I have an allergy' },
{ ru: 'Я заблудился', bn: 'ইয়া জাবলুদিলসা', en: 'I am lost' }

  ],
  german: [
    { ru: 'Hallo', bn: 'হালো', en: 'Hello' },
    { ru: 'Danke', bn: 'ডাঙ্কে', en: 'Thank you' },
    { ru: 'Wie geht\'s?', bn: 'ভি গেটস?', en: 'How are you?' },
  ]
};

function renderVocabulary(lang) {
  const data = vocabulary[lang] || [];
  conversationArea.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('conversation-item');
    div.innerHTML = `
      <p>${item.ru}</p>
      <p>📢 ${item.bn}</p>
      <p>🔤 ${item.en}</p>
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
