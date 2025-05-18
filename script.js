const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    { ru: 'Привет', bn: 'প্রিভিয়েত', bnMeaning: 'হ্যালো', en: 'Hello' },
{ ru: 'Спасибо', bn: 'স্পাসিবো', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
{ ru: 'Как дела?', bn: 'কাক দেলা?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
{ ru: 'Здравствуйте', bn: 'জদরাভস্তভুইত্যে', bnMeaning: 'শুভ দিন', en: 'Hello (formal)' },
{ ru: 'Пожалуйста', bn: 'পাঝালুস্তা', bnMeaning: 'দয়া করে / স্বাগতম', en: "Please / You're welcome" },
{ ru: 'Извините', bn: 'ইজভিনিতিয়ে', bnMeaning: 'মাফ করবেন', en: 'Excuse me / Sorry' },
{ ru: 'Где находится больница?', bn: 'গ্দে নাখোডিতসা বলনিতসা?', bnMeaning: 'হাসপাতাল কোথায়?', en: 'Where is the hospital?' },
{ ru: 'Сколько это стоит?', bn: 'স্কলকো এইতা স্তোইত?', bnMeaning: 'এটার দাম কত?', en: 'How much does it cost?' },
{ ru: 'Я не понимаю', bn: 'ইয়া নি পনিমায়ু', bnMeaning: 'আমি বুঝতে পারছি না', en: "I don't understand" },
{ ru: 'Говорите медленнее, пожалуйста', bn: 'গাভারিতে মেদলেন্নিয়ে, পাঝালুস্তা', bnMeaning: 'দয়া করে ধীরে বলুন', en: 'Please speak slowly' },
{ ru: 'Я хочу воды', bn: 'ইয়া খাচু ভাদি', bnMeaning: 'আমার পানি দরকার', en: 'I want water' },
{ ru: 'Который час?', bn: 'কাতোরি চাস?', bnMeaning: 'কয়টা বাজে?', en: 'What time is it?' },
{ ru: 'Мне нужна помощь', bn: 'মনে নুঝনা পোমোশ', bnMeaning: 'আমার সাহায্য দরকার', en: 'I need help' },
{ ru: 'Где ближайший магазин?', bn: 'গ্দে ব্লিজাইশি মাগাজিন?', bnMeaning: 'নিকটতম দোকান কোথায়?', en: 'Where is the nearest shop?' },
{ ru: 'Я студент', bn: 'ইয়া স্টুডেন্ট', bnMeaning: 'আমি একজন ছাত্র', en: 'I am a student' },
{ ru: 'Можно меню?', bn: 'মোজনো মেন্যু?', bnMeaning: 'মেনু পেতে পারি?', en: 'Can I have the menu?' },
{ ru: 'Где автобусная остановка?', bn: 'গ্দে আফতোবুসনায়া অস্তানোভকা?', bnMeaning: 'বাস স্টপ কোথায়?', en: 'Where is the bus stop?' },
{ ru: 'Мне нужно такси', bn: 'মনে নুঝনা তাকসি', bnMeaning: 'আমার ট্যাক্সি দরকার', en: 'I need a taxi' },
{ ru: 'Как пройти к университету?', bn: 'কাক প্রাইটি ক ইউনিভার্সিতেতু?', bnMeaning: 'বিশ্ববিদ্যালয়ে যাওয়ার রাস্তা কী?', en: 'How to get to the university?' },
{ ru: 'У меня аллергия', bn: 'উ মেনিয়া অ্যালারগিয়া', bnMeaning: 'আমার অ্যালার্জি আছে', en: 'I have an allergy' },
{ ru: 'Я заблудился', bn: 'ইয়া জাবলুদিলসা', bnMeaning: 'আমি পথ হারিয়েছি', en: 'I am lost' }

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
