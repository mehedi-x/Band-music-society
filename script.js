const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    { ru: 'Что это?', bn: 'শতো এইতা?', bnMeaning: 'এটা কী?', en: 'What is this?' },
{ ru: 'Я хочу есть', bn: 'ইয়া খাচু ইইস্ত', bnMeaning: 'আমি খেতে চাই', en: 'I want to eat' },
{ ru: 'Где я?', bn: 'গ্দে ইয়া?', bnMeaning: 'আমি কোথায়?', en: 'Where am I?' },
{ ru: 'Как вас зовут?', bn: 'কাক ভাস জাভুত?', bnMeaning: 'আপনার নাম কী?', en: 'What’s your name?' },
{ ru: 'Мне плохо', bn: 'মনে প্লোখা', bnMeaning: 'আমার খারাপ লাগছে', en: 'I feel bad' },
{ ru: 'Я не знаю', bn: 'ইয়া নি zna-yu', bnMeaning: 'আমি জানি না', en: 'I don’t know' },
{ ru: 'Где гостиница?', bn: 'গ্দে গস্তিনিৎসা?', bnMeaning: 'হোটেল কোথায়?', en: 'Where is the hotel?' },
{ ru: 'Сколько вам лет?', bn: 'স্কলকো ভাম লিয়েত?', bnMeaning: 'আপনার বয়স কত?', en: 'How old are you?' },
{ ru: 'У меня болит голова', bn: 'উ মেনিয়া বলিত গালাভা', bnMeaning: 'আমার মাথা ব্যথা করছে', en: 'I have a headache' },
{ ru: 'Я из Бангладеш', bn: 'ইয়া ইজ বাংলাদেশ', bnMeaning: 'আমি বাংলাদেশ থেকে এসেছি', en: 'I am from Bangladesh' },
{ ru: 'Я люблю Россию', bn: 'ইয়া লিউব্লু রাসিয়ু', bnMeaning: 'আমি রাশিয়া ভালোবাসি', en: 'I love Russia' },
{ ru: 'Можно фотографировать?', bn: 'মোজনো ফোতোগ্রাফিরোভাত?', bnMeaning: 'আমি কি ছবি তুলতে পারি?', en: 'Can I take a photo?' },
{ ru: 'У вас есть Wi-Fi?', bn: 'উ ভাস ইইস্ত Wi-Fi?', bnMeaning: 'আপনার কি Wi-Fi আছে?', en: 'Do you have Wi-Fi?' },
{ ru: 'Счёт, пожалуйста', bn: 'শচёт, পাঝালুস্তা', bnMeaning: 'বিল দিন অনুগ্রহ করে', en: 'The bill, please' },
{ ru: 'Где метро?', bn: 'গ্দে মেত্রো?', bnMeaning: 'মেট্রো কোথায়?', en: 'Where is the metro?' },

    { ru: 'Привет', bn: 'প্রিভিয়েত', bnMeaning: 'হ্যালো', en: 'Hello' },
    { ru: 'Спасибо', bn: 'স্পাসিবো', bnMeaning: 'ধন্যবাদ', en: 'Thank you' },
    { ru: 'Как дела?', bn: 'কাক দেলা?', bnMeaning: 'আপনি কেমন আছেন?', en: 'How are you?' },
    { ru: 'Здравствуйте', bn: 'জদরাভস্তভুইত্যে', bnMeaning: 'শুভ দিন', en: 'Hello (formal)' },
    { ru: 'Пожалуйста', bn: 'পাঝালুস্তা', bnMeaning: 'দয়া করে / স্বাগতম', en: "Please / You're welcome" },
    { ru: 'Извините', bn: 'ইজভিনিতিয়ে', bnMeaning: 'মাফ করবেন', en: 'Excuse me / Sorry' },
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
      <p><strong>🇷🇺 ${item.ru}</strong></p>
      <p>🔊 উচ্চারণ: ${item.bn}</p>
      <p>📝 বাংলা অর্থ: ${item.bnMeaning}</p>
      <p>🔤 English: ${item.en}</p>
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

// Dark mode memory
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
