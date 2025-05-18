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
{ ru: 'Рад вас видеть', bn: 'রাত ভাস ভিদিত', bnMeaning: 'আপনাকে দেখে ভালো লাগলো', en: 'Nice to see you' },
{ ru: 'До свидания', bn: 'দা সভিদানিয়া', bnMeaning: 'বিদায়', en: 'Goodbye' },
{ ru: 'Добро пожаловать', bn: 'দাব্রো পাঝালাভাত', bnMeaning: 'স্বাগতম', en: 'Welcome' },
{ ru: 'Хорошо', bn: 'হারাশো', bnMeaning: 'ভালো', en: 'Good' },
{ ru: 'Плохо', bn: 'পলোখা', bnMeaning: 'খারাপ', en: 'Bad' },
{ ru: 'Где туалет?', bn: 'গ্দে তুয়ালেত?', bnMeaning: 'টয়লেট কোথায়?', en: 'Where is the toilet?' },
{ ru: 'Мне это нравится', bn: 'মনে এইতা ন্রাভিতসা', bnMeaning: 'আমার এটা পছন্দ', en: 'I like it' },
{ ru: 'Я не говорю по-русски', bn: 'ইয়া নি গাভারু পা রুস্কি', bnMeaning: 'আমি রাশিয়ান বলতে পারি না', en: "I don't speak Russian" },
{ ru: 'Повторите, пожалуйста', bn: 'পাফতারিতে পাঝালুস্তা', bnMeaning: 'অনুগ্রহ করে আবার বলুন', en: 'Please repeat' },
{ ru: 'Один билет, пожалуйста', bn: 'আদিন বিলিয়েত, পাঝালুস্তা', bnMeaning: 'একটি টিকিট দিন অনুগ্রহ করে', en: 'One ticket, please' },
{ ru: 'Где аптека?', bn: 'গ্দে আপত্যেকা?', bnMeaning: 'ফার্মেসি কোথায়?', en: 'Where is the pharmacy?' },
{ ru: 'Помогите мне!', bn: 'পামাগিতে ম্নে!', bnMeaning: 'আমাকে সাহায্য করুন!', en: 'Help me!' },
{ ru: 'Я потерялся', bn: 'ইয়া পাতেরিয়ালসা', bnMeaning: 'আমি পথ হারিয়েছি', en: 'I am lost' },
{ ru: 'Сколько это?', bn: 'স্কলকো এইতা?', bnMeaning: 'এটার দাম কত?', en: 'How much is this?' },
{ ru: 'Я устал', bn: 'ইয়া উস্তাল', bnMeaning: 'আমি ক্লান্ত', en: 'I am tired' },
{ ru: 'Я работаю здесь', bn: 'ইয়া রাবোতাইু জ্দেস', bnMeaning: 'আমি এখানে কাজ করি', en: 'I work here' },
{ ru: 'У меня есть работа', bn: 'উ মেনিয়া ইয়েস্ত রাবোতা', bnMeaning: 'আমার চাকরি আছে', en: 'I have a job' },
{ ru: 'Я ищу работу', bn: 'ইয়া ইশু রাবোতু', bnMeaning: 'আমি চাকরি খুঁজছি', en: 'I am looking for a job' },
{ ru: 'Где офис?', bn: 'গ্দে অফিস?', bnMeaning: 'অফিস কোথায়?', en: 'Where is the office?' },
{ ru: 'Когда начинается работа?', bn: 'কাগদা নাচিনায়েৎসা রাবোতা?', bnMeaning: 'কাজ কখন শুরু?', en: 'When does work start?' },
{ ru: 'У меня нет денег', bn: 'উ মেনিয়া নিৎ দেনেক', bnMeaning: 'আমার টাকা নেই', en: 'I have no money' },
{ ru: 'Сколько я получу?', bn: 'স্কলকো ইয়া পালুচু?', bnMeaning: 'আমি কত পাব?', en: 'How much will I get?' },
{ ru: 'Я живу в общежитии', bn: 'ইয়া জিভু ফ আফশিজিতিই', bnMeaning: 'আমি হোস্টেলে থাকি', en: 'I live in a hostel' },
{ ru: 'Где находится университет?', bn: 'গ্দে নাখোডিতসা ইউনিভার্সিতেত?', bnMeaning: 'বিশ্ববিদ্যালয় কোথায়?', en: 'Where is the university?' },
{ ru: 'Я студент медицинского факультета', bn: 'ইয়া স্টুডেন্ট মেদিত্সিনস্কাভা ফাকুল্তেতা', bnMeaning: 'আমি মেডিকেল ছাত্র', en: 'I am a medical student' },
{ ru: 'Когда у нас экзамен?', bn: 'কাগদা উ নাস একজামেন?', bnMeaning: 'আমাদের পরীক্ষা কখন?', en: 'When is our exam?' },
{ ru: 'У меня есть домашнее задание', bn: 'উ মেনিয়া ইয়েস্ত দামাশনিয়ে জাদানিয়ে', bnMeaning: 'আমার হোমওয়ার্ক আছে', en: 'I have homework' },
{ ru: 'Я изучаю русский язык', bn: 'ইয়া ইজুচায়ু রুস্কি ইয়াজিক', bnMeaning: 'আমি রাশিয়ান ভাষা শিখছি', en: 'I am learning Russian' },
{ ru: 'Можно войти?', bn: 'মোজনো ভাইটি?', bnMeaning: 'আমি কি ভিতরে আসতে পারি?', en: 'May I come in?' },
{ ru: 'У меня нет интернета', bn: 'উ মেনিয়া নিৎ ইন্টারনেতা', bnMeaning: 'আমার ইন্টারনেট নেই', en: 'I have no internet' },
{ ru: 'Это очень трудно', bn: 'এইতা ওচিন ত্রুদনা', bnMeaning: 'এটা খুব কঠিন', en: 'It is very difficult' },
{ ru: 'Повторите, пожалуйста, медленно', bn: 'পাফতারিতে, পাঝালুস্তা, মেদলেন্নো', bnMeaning: 'অনুগ্রহ করে ধীরে আবার বলুন', en: 'Please repeat slowly' },
{ ru: 'Я не понимаю задание', bn: 'ইয়া নি পনিমায়ু জাদানিয়ে', bnMeaning: 'আমি প্রশ্নটা বুঝতে পারছি না', en: 'I don’t understand the assignment' },
{ ru: 'Могу я задать вопрос?', bn: 'মাগু ইয়া জাদাত ভাপরোস?', bnMeaning: 'আমি কি প্রশ্ন করতে পারি?', en: 'Can I ask a question?' },
{ ru: 'Спасибо за помощь', bn: 'স্পাসিবো যা পোমোশ', bnMeaning: 'সাহায্যের জন্য ধন্যবাদ', en: 'Thank you for the help' },
{ ru: 'Мне нужна помощь', bn: 'মনে নুঝনা পোমোশ', bnMeaning: 'আমার সাহায্য দরকার', en: 'I need help' },
{ ru: 'Вы говорите по-английски?', bn: 'ভি গাভারিতে পা-আংলিস্কি?', bnMeaning: 'আপনি কি ইংরেজি বলেন?', en: 'Do you speak English?' },
{ ru: 'Где больница?', bn: 'গ্দে বালনিৎসা?', bnMeaning: 'হাসপাতাল কোথায়?', en: 'Where is the hospital?' },
{ ru: 'Мне нужно лекарство', bn: 'মনে নুঝনা লেকারস্তভো', bnMeaning: 'আমার ওষুধ দরকার', en: 'I need medicine' },
{ ru: 'Где ближайшая аптека?', bn: 'গ্দে ব্লিজাইশ্যায়া আপতেকা?', bnMeaning: 'নিকটতম ফার্মেসি কোথায়?', en: 'Where is the nearest pharmacy?' },
{ ru: 'Я потерял паспорт', bn: 'ইয়া পতেরিয়াল পাস্পর্ট', bnMeaning: 'আমি পাসপোর্ট হারিয়ে ফেলেছি', en: 'I lost my passport' },
{ ru: 'Позвоните в полицию', bn: 'পাজভানিতে ফ পলিতসিউ', bnMeaning: 'পুলিশে ফোন করুন', en: 'Call the police' },
{ ru: 'Где общественный транспорт?', bn: 'গ্দে আফশেস্তভেনি ট্রান্সপোর্ট?', bnMeaning: 'সার্বজনীন পরিবহন কোথায়?', en: 'Where is the public transport?' },
{ ru: 'Сколько стоит билет?', bn: 'স্কলকো স্তোইত বিলিয়েত?', bnMeaning: 'টিকিটের দাম কত?', en: 'How much is the ticket?' },
{ ru: 'Где ближайший банкомат?', bn: 'গ্দে ব্লিজাইশ্যি ব্যাংকোমাত?', bnMeaning: 'নিকটতম এটিএম কোথায়?', en: 'Where is the nearest ATM?' },
{ ru: 'Как снять деньги?', bn: 'কাক স্ন্যাৎ দেনগি?', bnMeaning: 'কিভাবে টাকা তুলবো?', en: 'How to withdraw money?' },
{ ru: 'Я иностранец', bn: 'ইয়া ইনাস্ত্রানিয়েত্স', bnMeaning: 'আমি বিদেশি', en: 'I am a foreigner' },
{ ru: 'Я здесь по учебе', bn: 'ইয়া জ্দেস পা উচোবে', bnMeaning: 'আমি পড়াশোনার জন্য এখানে', en: 'I am here for study' },
{ ru: 'Мне нужна виза', bn: 'মনে নুঝনা ভিজা', bnMeaning: 'আমার ভিসা দরকার', en: 'I need a visa' },
{ ru: 'У меня аллергия', bn: 'উ মেনিয়া অ্যালেরগিয়া', bnMeaning: 'আমার অ্যালার্জি আছে', en: 'I have an allergy' },
{ ru: 'Мне плохо', bn: 'মনে প্লোখা', bnMeaning: 'আমার খারাপ লাগছে', en: 'I feel sick' },
{ ru: 'Где я могу зарядить телефон?', bn: 'গ্দে ইয়া মাগু জরিয়াদিত তেলেফোন?', bnMeaning: 'আমি কোথায় ফোন চার্জ করতে পারি?', en: 'Where can I charge my phone?' },
{ ru: 'Как подключиться к Wi-Fi?', bn: 'কাক পদক্লুচিৎসা ক ওয়াইফাই?', bnMeaning: 'Wi-Fi-তে কিভাবে কানেক্ট করব?', en: 'How to connect to Wi-Fi?' },
{ ru: 'Моя квартира рядом', bn: 'মায়া কোয়ারতিরা রিয়াদম', bnMeaning: 'আমার অ্যাপার্টমেন্ট কাছেই', en: 'My apartment is nearby' },
{ ru: 'Сколько стоит аренда?', bn: 'স্কলকো স্তোইত অ্যারেনদা?', bnMeaning: 'ভাড়াটা কত?', en: 'How much is the rent?' },






  // আমার উপরে ডাটা লোড করুন...  
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
