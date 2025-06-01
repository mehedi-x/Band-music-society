// ================================
// CONFIGURATION
// ================================

const CONFIG = {
  DAILY_TARGET: 10,
  LANGUAGES_PATH: 'Language/',
  AUDIO_PATH: 'audio/',
  STORAGE_KEYS: {
    selectedLanguage: 'speak_eu_language',
    theme: 'speak_eu_theme',
    dailyProgress: 'speak_eu_daily_progress',
    userStats: 'speak_eu_user_stats',
    userLevel: 'speak_eu_user_level',
    achievements: 'speak_eu_achievements',
    gameStats: 'speak_eu_game_stats',
    vocabulary: 'speak_eu_vocabulary'
  },
  ACHIEVEMENTS: {
    FIRST_WORDS: { id: 'first_10', threshold: 10, name: 'প্রথম ১০টি শব্দ', icon: '🥇', description: 'প্রথম ১০টি শব্দ শিখেছেন' },
    CONSISTENT: { id: 'streak_7', threshold: 7, name: '৭ দিন ধারাবাহিক', icon: '🔥', description: 'টানা ৭ দিন অনুশীলন করেছেন' },
    POLYGLOT: { id: 'languages_3', threshold: 3, name: '৩টি ভাষা শিখেছেন', icon: '🌍', description: '৩টি ভিন্ন দেশের ভাষা শিখেছেন' },
    MASTER: { id: 'words_100', threshold: 100, name: '১০০টি শব্দ আয়ত্ত', icon: '🎓', description: '১০০টি শব্দ সফলভাবে শিখেছেন' },
    PERFECTIONIST: { id: 'perfect_quiz', threshold: 1, name: 'নিখুঁত কুইজ', icon: '💯', description: 'একটি কুইজে ১০০% স্কোর পেয়েছেন' },
    SPEED_LEARNER: { id: 'fast_completion', threshold: 1, name: 'দ্রুত শিক্ষার্থী', icon: '⚡', description: 'দ্রুততম সময়ে একটি গেম সম্পন্ন করেছেন' }
  },
  LEVELS: {
    1: { minWords: 0, maxWords: 25, name: 'শিক্ষানবিস' },
    2: { minWords: 26, maxWords: 75, name: 'প্রাথমিক' },
    3: { minWords: 76, maxWords: 150, name: 'মধ্যম' },
    4: { minWords: 151, maxWords: 300, name: 'উন্নত' },
    5: { minWords: 301, maxWords: 500, name: 'দক্ষ' },
    6: { minWords: 501, maxWords: 1000, name: 'বিশেষজ্ঞ' },
    7: { minWords: 1001, maxWords: Infinity, name: 'মাস্টার' }
  }
};

// ================================
// COUNTRIES DATA
// ================================

const COUNTRIES_DATA = {
  // Schengen Countries
  austria: { 
    name: 'অস্ট্রিয়া', 
    language: 'Deutsch', 
    difficulty: 'medium', 
    flag: '🇦🇹', 
    isSchengen: true,
    capital: 'ভিয়েনা',
    currency: 'ইউরো',
    population: '৮.৯ মিলিয়ন',
    tips: ['জার্মান ভাষা মূল ভাষা', 'ক্লাসিক্যাল মিউজিকের দেশ', 'আল্পস পর্বতমালার জন্য বিখ্যাত']
  },
  belgium: { 
    name: 'বেলজিয়াম', 
    language: 'Nederlands/Français', 
    difficulty: 'hard', 
    flag: '🇧🇪', 
    isSchengen: true,
    capital: 'ব্রাসেলস',
    currency: 'ইউরো',
    population: '১১.৫ মিলিয়ন',
    tips: ['তিনটি সরকারি ভাষা', 'চকলেট ও ওয়াফলের জন্য বিখ্যাত', 'ইউরোপীয় ইউনিয়নের হেডকোয়ার্টার']
  },
  bulgaria: { 
    name: 'বুলগেরিয়া', 
    language: 'Български', 
    difficulty: 'hard', 
    flag: '🇧🇬', 
    isSchengen: true,
    capital: 'সোফিয়া',
    currency: 'লেভ',
    population: '৬.৯ মিলিয়ন',
    tips: ['সিরিলিক বর্ণমালা ব্যবহার করে', 'যোগার্ট ও গোলাপের তেলের জন্য বিখ্যাত', 'বলকান অঞ্চলের দেশ']
  },
  croatia: { 
    name: 'ক্রোয়েশিয়া', 
    language: 'Hrvatski', 
    difficulty: 'medium', 
    flag: '🇭🇷', 
    isSchengen: true,
    capital: 'জাগ্রেব',
    currency: 'ইউরো',
    population: '৩.৯ মিলিয়ন',
    tips: ['অ্যাড্রিয়াটিক সাগরের তীরে অবস্থিত', 'সুন্দর উপকূল ও দ্বীপপুঞ্জ', 'গেম অফ থ্রোনসের শুটিং স্পট']
  },
  cyprus: { 
    name: 'সাইপ্রাস', 
    language: 'Ελληνικά', 
    difficulty: 'hard', 
    flag: '🇨🇾', 
    isSchengen: true,
    capital: 'নিকোসিয়া',
    currency: 'ইউরো',
    population: '১.২ মিলিয়ন',
    tips: ['ভূমধ্যসাগরের দ্বীপ দেশ', 'গ্রিক ও তুর্কি ভাষা প্রচলিত', 'প্রাচীন সভ্যতার নিদর্শন']
  },
  czechia: { 
    name: 'চেক প্রজাতন্ত্র', 
    language: 'Čeština', 
    difficulty: 'hard', 
    flag: '🇨🇿', 
    isSchengen: true,
    capital: 'প্রাগ',
    currency: 'ক্রাউন',
    population: '১০.৭ মিলিয়ন',
    tips: ['সুন্দর স্থাপত্যের জন্য বিখ্যাত', 'বিয়ার প্রেমীদের স্বর্গ', 'মধ্য ইউরোপের হৃদয়']
  },
  denmark: { 
    name: 'ডেনমার্ক', 
    language: 'Dansk', 
    difficulty: 'medium', 
    flag: '🇩🇰', 
    isSchengen: true,
    capital: 'কোপেনহেগেন',
    currency: 'ক্রোনে',
    population: '৫.৮ মিলিয়ন',
    tips: ['বাইসাইকেল-বান্ধব দেশ', 'সুখী দেশের তালিকায় শীর্ষে', 'ভাইকিংদের দেশ']
  },
  estonia: { 
    name: 'এস্তোনিয়া', 
    language: 'Eesti', 
    difficulty: 'hard', 
    flag: '🇪🇪', 
    isSchengen: true,
    capital: 'তাল্লিন',
    currency: 'ইউরো',
    population: '১.৩ মিলিয়ন',
    tips: ['ডিজিটাল নোমাডদের স্বর্গ', 'ই-রেসিডেন্সি প্রোগ্রাম', 'স্কাইপের জন্মস্থান']
  },
  finland: { 
    name: 'ফিনল্যান্ড', 
    language: 'Suomi', 
    difficulty: 'hard', 
    flag: '🇫🇮', 
    isSchengen: true,
    capital: 'হেলসিঙ্কি',
    currency: 'ইউরো',
    population: '৫.৫ মিলিয়ন',
    tips: ['সাউনার জন্মস্থান', 'শিক্ষা ব্যবস্থার জন্য বিখ্যাত', 'সান্তা ক্লজের দেশ']
  },
  france: { 
    name: 'ফ্রান্স', 
    language: 'Français', 
    difficulty: 'medium', 
    flag: '🇫🇷', 
    isSchengen: true,
    capital: 'প্যারিস',
    currency: 'ইউরো',
    population: '৬৭.৪ মিলিয়ন',
    tips: ['ফ্যাশন ও রন্ধনশিল্পের রাজধানী', 'আইফেল টাওয়ার ও লুভর মিউজিয়াম', 'বিশ্বের সবচেয়ে বেশি পর্যটক']
  },
  germany: { 
    name: 'জার্মানি', 
    language: 'Deutsch', 
    difficulty: 'medium', 
    flag: '🇩🇪', 
    isSchengen: true,
    capital: 'বার্লিন',
    currency: 'ইউরো',
    population: '৮৩.২ মিলিয়ন',
    tips: ['ইউরোপের অর্থনৈতিক শক্তি', 'অটোমোবাইল ইন্ডাস্ট্রির জন্য বিখ্যাত', 'বিয়ার ও ব্রেড সংস্কৃতি']
  },
  greece: { 
    name: 'গ্রিস', 
    language: 'Ελληνικά', 
    difficulty: 'hard', 
    flag: '🇬🇷', 
    isSchengen: true,
    capital: 'এথেন্স',
    currency: 'ইউরো',
    population: '১০.৭ মিলিয়ন',
    tips: ['পশ্চিমা সভ্যতার জন্মস্থান', 'সুন্দর দ্বীপ ও সমুদ্র সৈকত', 'অলিম্পিকের জন্মস্থান']
  },
  hungary: { 
    name: 'হাঙ্গেরি', 
    language: 'Magyar', 
    difficulty: 'hard', 
    flag: '🇭🇺', 
    isSchengen: true,
    capital: 'বুদাপেস্ট',
    currency: 'ফরিন্ট',
    population: '৯.৭ মিলিয়ন',
    tips: ['থার্মাল স্প্রিংসের জন্য বিখ্যাত', 'ডানুব নদীর দুই তীরে রাজধানী', 'ইউনিক ম্যাগয়ার ভাষা']
  },
  iceland: { 
    name: 'আইসল্যান্ড', 
    language: 'Íslenska', 
    difficulty: 'hard', 
    flag: '🇮🇸', 
    isSchengen: true,
    capital: 'রেইকিয়াভিক',
    currency: 'ক্রোনা',
    population: '৩.৭ হাজার',
    tips: ['উত্তর মেরুর আলো দেখার জন্য বিখ্যাত', 'আগ্নেয়গিরি ও গিজার', 'বিশ্বের সবচেয়ে নিরাপদ দেশ']
  },
  italy: { 
    name: 'ইতালি', 
    language: 'Italiano', 
    difficulty: 'easy', 
    flag: '🇮🇹', 
    isSchengen: true,
    capital: 'রোম',
    currency: 'ইউরো',
    population: '৫৯.১ মিলিয়ন',
    tips: ['পিজ্জা ও পাস্তার জন্মস্থান', 'রেনেসাঁর কেন্দ্রভূমি', 'কলোসিয়াম ও ভ্যাটিকান সিটি']
  },
  latvia: { 
    name: 'লাটভিয়া', 
    language: 'Latviešu', 
    difficulty: 'hard', 
    flag: '🇱🇻', 
    isSchengen: true,
    capital: 'রিগা',
    currency: 'ইউরো',
    population: '১.৯ মিলিয়ন',
    tips: ['বাল্টিক সাগরের তীরে অবস্থিত', 'মধ্যযুগীয় স্থাপত্য', 'জঙ্গল ও লেকের দেশ']
  },
  liechtenstein: { 
    name: 'লিশটেনস্টাইন', 
    language: 'Deutsch', 
    difficulty: 'medium', 
    flag: '🇱🇮', 
    isSchengen: true,
    capital: 'ভাদুজ',
    currency: 'সুইস ফ্রাঙ্ক',
    population: '৩৮ হাজার',
    tips: ['বিশ্বের চতুর্থ ক্ষুদ্রতম দেশ', 'আল্পসের মাঝে অবস্থিত', 'প্রিন্সিপালিটি']
  },
  lithuania: { 
    name: 'লিথুয়ানিয়া', 
    language: 'Lietuvių', 
    difficulty: 'hard', 
    flag: '🇱🇹', 
    isSchengen: true,
    capital: 'ভিলনিয়াস',
    currency: 'ইউরো',
    population: '২.৮ মিলিয়ন',
    tips: ['বাল্টিক স্টেটসের বৃহত্তম', 'সুন্দর পুরাতন শহর', 'বাস্কেটবল খেলার জন্য বিখ্যাত']
  },
  luxembourg: { 
    name: 'লুক্সেমবার্গ', 
    language: 'Lëtzebuergesch', 
    difficulty: 'hard', 
    flag: '🇱🇺', 
    isSchengen: true,
    capital: 'লুক্সেমবার্গ সিটি',
    currency: 'ইউরো',
    population: '৬.৩ হাজার',
    tips: ['বিশ্বের দ্বিতীয় ধনী দেশ', 'তিনটি সরকারি ভাষা', 'ইউরোপীয় ইউনিয়নের গুরুত্বপূর্ণ কেন্দ্র']
  },
  malta: { 
    name: 'মাল্টা', 
    language: 'Malti', 
    difficulty: 'medium', 
    flag: '🇲🇹', 
    isSchengen: true,
    capital: 'ভালেত্তা',
    currency: 'ইউরো',
    population: '৫.২ হাজার',
    tips: ['ভূমধ্যসাগরের ছোট দ্বীপ দেশ', 'প্রাচীন ইতিহাস ও সংস্কৃতি', 'ইংরেজি ও মাল্টিজ ভাষা']
  },
  netherlands: { 
    name: 'নেদারল্যান্ডস', 
    language: 'Nederlands', 
    difficulty: 'medium', 
    flag: '🇳🇱', 
    isSchengen: true,
    capital: 'আমস্টারডাম',
    currency: 'ইউরো',
    population: '১৭.৪ মিলিয়ন',
    tips: ['টিউলিপ ও উইন্ডমিলের দেশ', 'বাইসাইকেল চালানোর সংস্কৃতি', 'কৃত্রিম দ্বীপ ও ডাইক']
  },
  norway: { 
    name: 'নরওয়ে', 
    language: 'Norsk', 
    difficulty: 'medium', 
    flag: '🇳🇴', 
    isSchengen: true,
    capital: 'অসলো',
    currency: 'ক্রোনে',
    population: '৫.৪ মিলিয়ন',
    tips: ['ফিয়র্ড ও উত্তর মেরুর আলো', 'তেল সম্পদে সমৃদ্ধ', 'উইন্টার স্পোর্টসের জন্য বিখ্যাত']
  },
  poland: { 
    name: 'পোল্যান্ড', 
    language: 'Polski', 
    difficulty: 'hard', 
    flag: '🇵🇱', 
    isSchengen: true,
    capital: 'ওয়ারশ',
    currency: 'জলোটি',
    population: '৩৭.৯ মিলিয়ন',
    tips: ['সমৃদ্ধ ইতিহাস ও সংস্কৃতি', 'পিয়েরোগি ও ভোডকার জন্য বিখ্যাত', 'ক্রাকো ও ওয়ারশর পুরাতন শহর']
  },
  portugal: { 
    name: 'পর্তুগাল', 
    language: 'Português', 
    difficulty: 'medium', 
    flag: '🇵🇹', 
    isSchengen: true,
    capital: 'লিসবন',
    currency: 'ইউরো',
    population: '১০.৩ মিলিয়ন',
    tips: ['অ্যাটলান্টিক উপকূলের সুন্দর সৈকত', 'পোর্ট ওয়াইন ও ফাডো সংগীত', 'আবিষ্কারের যুগের অগ্রদূত']
  },
  romania: { 
    name: 'রোমানিয়া', 
    language: 'Română', 
    difficulty: 'medium', 
    flag: '🇷🇴', 
    isSchengen: true,
    capital: 'বুখারেস্ট',
    currency: 'লেউ',
    population: '১৯.১ মিলিয়ন',
    tips: ['ড্রাকুলার কিংবদন্তির দেশ', 'কার্পেথিয়ান পর্বতমালা', 'অর্থোডক্স খ্রিস্টান সংস্কৃতি']
  },
  slovakia: { 
    name: 'স্লোভাকিয়া', 
    language: 'Slovenčina', 
    difficulty: 'hard', 
    flag: '🇸🇰', 
    isSchengen: true,
    capital: 'ব্রাতিস্লাভা',
    currency: 'ইউরো',
    population: '৫.৫ মিলিয়ন',
    tips: ['মধ্য ইউরোপের হৃদয়ে অবস্থিত', 'পর্বত ও দুর্গের দেশ', 'অটোমোবাইল উৎপাদনে এগিয়ে']
  },
  slovenia: { 
    name: 'স্লোভেনিয়া', 
    language: 'Slovenščina', 
    difficulty: 'hard', 
    flag: '🇸🇮', 
    isSchengen: true,
    capital: 'লুবলিয়ানা',
    currency: 'ইউরো',
    population: '২.১ মিলিয়ন',
    tips: ['আল্পস ও অ্যাড্রিয়াটিকের মধ্যে', 'গুহা ও লেকের জন্য বিখ্যাত', 'পরিবেশ-বান্ধব দেশ']
  },
  spain: { 
    name: 'স্পেন', 
    language: 'Español', 
    difficulty: 'easy', 
    flag: '🇪🇸', 
    isSchengen: true,
    capital: 'মাদ্রিদ',
    currency: 'ইউরো',
    population: '৪৭.৪ মিলিয়ন',
    tips: ['ফ্লামেঙ্কো নৃত্য ও সংগীত', 'তাপাস ও পায়েলার জন্য বিখ্যাত', 'সুন্দর সৈকত ও স্থাপত্য']
  },
  sweden: { 
    name: 'সুইডেন', 
    language: 'Svenska', 
    difficulty: 'medium', 
    flag: '🇸🇪', 
    isSchengen: true,
    capital: 'স্টকহোম',
    currency: 'ক্রোনা',
    population: '১০.৪ মিলিয়ন',
    tips: ['আইকিয়া ও ভলভোর দেশ', 'কল্যাণমূলক রাষ্ট্রের মডেল', 'উত্তরের ভেনিস - স্টকহোম']
  },
  switzerland: { 
    name: 'সুইজারল্যান্ড', 
    language: 'Deutsch/Français', 
    difficulty: 'medium', 
    flag: '🇨🇭', 
    isSchengen: true,
    capital: 'বার্ন',
    currency: 'সুইস ফ্রাঙ্ক',
    population: '৮.৭ মিলিয়ন',
    tips: ['আল্পস ও স্কিইং', 'চকলেট ও ঘড়ির জন্য বিখ্যাত', 'নিরপেক্ষতা ও ব্যাংকিং']
  },
  
  // Non-Schengen European Country
  russia: { 
    name: 'রাশিয়া', 
    language: 'Русский', 
    difficulty: 'hard', 
    flag: '🇷🇺', 
    isSchengen: false,
    capital: 'মস্কো',
    currency: 'রুবল',
    population: '১৪৪ মিলিয়ন',
    tips: ['বিশ্বের বৃহত্তম দেশ', 'সিরিলিক বর্ণমালা', 'সমৃদ্ধ সাহিত্য ও ব্যালে']
  }
};

// ================================
// VOCABULARY DATA GENERATOR
// ================================

const generateVocabularyData = (language, countryCode) => {
  const categories = {
    basic: 'মৌলিক',
    greetings: 'অভিবাদন', 
    numbers: 'সংখ্যা',
    time: 'সময়',
    family: 'পরিবার',
    body: 'শরীর',
    colors: 'রং',
    weather: 'আবহাওয়া',
    directions: 'দিকনির্দেশনা',
    transport: 'পরিবহন',
    accommodation: 'থাকার জায়গা',
    food: 'খাবার',
    drinks: 'পানীয়',
    restaurant: 'রেস্টুরেন্ট',
    shopping: 'কেনাকাটা',
    clothing: 'পোশাক',
    money: 'অর্থ',
    electronics: 'ইলেকট্রনিক্স',
    medical: 'চিকিৎসা',
    pharmacy: 'ফার্মেসি',
    hospital: 'হাসপাতাল',
    emergency: 'জরুরি',
    police: 'পুলিশ',
    business: 'ব্যবসা',
    work: 'কাজ',
    education: 'শিক্ষা',
    technology: 'প্রযুক্তি',
    sports: 'খেলাধুলা',
    entertainment: 'বিনোদন',
    travel: 'ভ্রমণ',
    airport: 'বিমানবন্দর',
    hotel: 'হোটেল'
  };

  // Language-specific vocabulary data
  const vocabularyTemplates = {
    german: {
      basic: [
        { word: 'Hallo', pronunciation: 'হালো', meaning: 'হ্যালো', example: 'Hallo, wie geht es dir? (হ্যালো, তুমি কেমন আছো?)' },
        { word: 'Guten Morgen', pronunciation: 'গুটেন মর্গেন', meaning: 'সুপ্রভাত', example: 'Guten Morgen, Herr Schmidt! (সুপ্রভাত, জনাব শ্মিট!)' },
        { word: 'Danke', pronunciation: 'ডানকে', meaning: 'ধন্যবাদ', example: 'Danke für Ihre Hilfe (আপনার সাহায্যের জন্য ধন্যবাদ)' },
        { word: 'Bitte', pronunciation: 'বিটে', meaning: 'দয়া করে/স্বাগতম', example: 'Bitte schön! (স্বাগতম!)' },
        { word: 'Entschuldigung', pronunciation: 'এন্টশুলডিগুং', meaning: 'দুঃখিত', example: 'Entschuldigung, wo ist der Bahnhof? (দুঃখিত, রেলস্টেশন কোথায়?)' },
        { word: 'Ja', pronunciation: 'ইয়া', meaning: 'হ্যাঁ', example: 'Ja, das ist richtig (হ্যাঁ, এটা ঠিক)' },
        { word: 'Nein', pronunciation: 'নাইন', meaning: 'না', example: 'Nein, ich verstehe nicht (না, আমি বুঝি না)' },
        { word: 'Wie', pronunciation: 'ভি', meaning: 'কেমন/কিভাবে', example: 'Wie heißen Sie? (আপনার নাম কি?)' },
        { word: 'Was', pronunciation: 'ভাস', meaning: 'কি', example: 'Was ist das? (এটা কি?)' },
        { word: 'Wo', pronunciation: 'ভো', meaning: 'কোথায়', example: 'Wo wohnen Sie? (আপনি কোথায় থাকেন?)' }
      ],
      food: [
        { word: 'Brot', pronunciation: 'ব্রোট', meaning: 'রুটি', example: 'Ich esse Brot zum Frühstück (আমি সকালের নাস্তায় রুটি খাই)' },
        { word: 'Wasser', pronunciation: 'ভাসার', meaning: 'পানি', example: 'Ein Glas Wasser, bitte (এক গ্লাস পানি, দয়া করে)' },
        { word: 'Kaffee', pronunciation: 'কাফে', meaning: 'কফি', example: 'Möchten Sie Kaffee? (আপনি কি কফি চান?)' },
        { word: 'Bier', pronunciation: 'বিয়ার', meaning: 'বিয়ার', example: 'Ein Bier, bitte (একটি বিয়ার, দয়া করে)' },
        { word: 'Fleisch', pronunciation: 'ফ্লাইশ', meaning: 'মাংস', example: 'Ich esse kein Fleisch (আমি মাংস খাই না)' }
      ],
      travel: [
        { word: 'Flughafen', pronunciation: 'ফ্লুগহাফেন', meaning: 'বিমানবন্দর', example: 'Zum Flughafen, bitte (বিমানবন্দরে, দয়া করে)' },
        { word: 'Bahnhof', pronunciation: 'বানহোফ', meaning: 'রেলস্টেশন', example: 'Wo ist der Bahnhof? (রেলস্টেশন কোথায়?)' },
        { word: 'Hotel', pronunciation: 'হোটেল', meaning: 'হোটেল', example: 'Ich suche ein Hotel (আমি একটি হোটেল খুঁজছি)' },
        { word: 'Taxi', pronunciation: 'ট্যাক্সি', meaning: 'ট্যাক্সি', example: 'Rufen Sie ein Taxi (একটি ট্যাক্সি ডাকুন)' },
        { word: 'Bus', pronunciation: 'বুস', meaning: 'বাস', example: 'Wann kommt der Bus? (বাস কখন আসবে?)' }
      ]
    },
    french: {
      basic: [
        { word: 'Bonjour', pronunciation: 'বোঁজুর', meaning: 'সুপ্রভাত/হ্যালো', example: 'Bonjour madame! (সুপ্রভাত ম্যাডাম!)' },
        { word: 'Bonsoir', pronunciation: 'বোঁসোয়ার', meaning: 'শুভ সন্ধ্যা', example: 'Bonsoir tout le monde (সবাইকে শুভ সন্ধ্যা)' },
        { word: 'Merci', pronunciation: 'মেরসি', meaning: 'ধন্যবাদ', example: 'Merci beaucoup (অনেক ধন্যবাদ)' },
        { word: 'Excusez-moi', pronunciation: 'এক্সকুজে-মোয়া', meaning: 'দুঃখিত', example: 'Excusez-moi, où est la gare? (দুঃখিত, স্টেশন কোথায়?)' },
        { word: 'Oui', pronunciation: 'উই', meaning: 'হ্যাঁ', example: 'Oui, je comprends (হ্যাঁ, আমি বুঝি)' },
        { word: 'Non', pronunciation: 'নোঁ', meaning: 'না', example: 'Non, merci (না, ধন্যবাদ)' },
        { word: 'Comment', pronunciation: 'কোমাঁ', meaning: 'কেমন/কিভাবে', example: 'Comment allez-vous? (আপনি কেমন আছেন?)' },
        { word: 'Quoi', pronunciation: 'কোয়া', meaning: 'কি', example: 'Quoi de neuf? (নতুন কি খবর?)' },
        { word: 'Où', pronunciation: 'উ', meaning: 'কোথায়', example: 'Où habitez-vous? (আপনি কোথায় থাকেন?)' },
        { word: 'Au revoir', pronunciation: 'ও রেভোয়ার', meaning: 'বিদায়', example: 'Au revoir et bonne journée! (বিদায় এবং শুভ দিন!)' }
      ],
      food: [
        { word: 'Pain', pronunciation: 'পাঁ', meaning: 'রুটি', example: 'Je voudrais du pain (আমি রুটি চাই)' },
        { word: 'Eau', pronunciation: 'ও', meaning: 'পানি', example: 'Une bouteille d\'eau (এক বোতল পানি)' },
        { word: 'Café', pronunciation: 'কাফে', meaning: 'কফি', example: 'Un café, s\'il vous plaît (একটি কফি, দয়া করে)' },
        { word: 'Vin', pronunciation: 'ভাঁ', meaning: 'ওয়াইন', example: 'Un verre de vin rouge (এক গ্লাস লাল ওয়াইন)' },
        { word: 'Fromage', pronunciation: 'ফ্রোমাজ', meaning: 'পনির', example: 'J\'aime le fromage français (আমি ফরাসি পনির পছন্দ করি)' }
      ]
    },
    spanish: {
      basic: [
        { word: 'Hola', pronunciation: 'ওলা', meaning: 'হ্যালো', example: 'Hola, ¿cómo estás? (হ্যালো, তুমি কেমন আছো?)' },
        { word: 'Buenos días', pronunciation: 'বুয়েনোস দিয়াস', meaning: 'সুপ্রভাত', example: 'Buenos días, señor García (সুপ্রভাত, জনাব গার্সিয়া)' },
        { word: 'Gracias', pronunciation: 'গ্রাসিয়াস', meaning: 'ধন্যবাদ', example: 'Gracias por su ayuda (আপনার সাহায্যের জন্য ধন্যবাদ)' },
        { word: 'Por favor', pronunciation: 'পোর ফাভোর', meaning: 'দয়া করে', example: 'Por favor, ayúdeme (দয়া করে, আমাকে সাহায্য করুন)' },
        { word: 'Lo siento', pronunciation: 'লো সিয়েন্তো', meaning: 'দুঃখিত', example: 'Lo siento, no entiendo (দুঃখিত, আমি বুঝি না)' },
        { word: 'Sí', pronunciation: 'সি', meaning: 'হ্যাঁ', example: 'Sí, está bien (হ্যাঁ, ঠিক আছে)' },
        { word: 'No', pronunciation: 'নো', meaning: 'না', example: 'No, no me gusta (না, আমার পছন্দ নয়)' },
        { word: 'Cómo', pronunciation: 'কোমো', meaning: 'কেমন/কিভাবে', example: '¿Cómo se llama? (আপনার নাম কি?)' },
        { word: 'Qué', pronunciation: 'কে', meaning: 'কি', example: '¿Qué es esto? (এটা কি?)' },
        { word: 'Dónde', pronunciation: 'দোন্দে', meaning: 'কোথায়', example: '¿Dónde vive usted? (আপনি কোথায় থাকেন?)' }
      ]
    }
  };

  // Create comprehensive vocabulary for each language
  const generateComprehensiveVocabulary = (languageCode) => {
    const baseVocab = vocabularyTemplates[languageCode] || vocabularyTemplates.german;
    let vocabulary = [];
    let id = 1;

    // Add base vocabulary
    Object.keys(baseVocab).forEach(category => {
      baseVocab[category].forEach(item => {
        vocabulary.push({
          id: id++,
          word: item.word,
          pronunciation: item.pronunciation,
          meaning: item.meaning,
          category: categories[category] || category,
          categoryKey: category,
          example: item.example,
          difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'medium' : 'easy',
          learned: false,
          lastReviewed: null,
          correctCount: 0,
          incorrectCount: 0,
          audio: `${CONFIG.AUDIO_PATH}${languageCode}/${item.word.toLowerCase().replace(/\s+/g, '_')}.mp3`
        });
      });
    });

    // Generate additional vocabulary to reach 1000+ words
    const additionalCategories = Object.keys(categories);
    while (vocabulary.length < 1200) {
      const category = additionalCategories[Math.floor(Math.random() * additionalCategories.length)];
      const wordNumber = vocabulary.length + 1;
      
      vocabulary.push({
        id: id++,
        word: `Word${wordNumber}`,
        pronunciation: `উচ্চারণ${wordNumber}`,
        meaning: `অর্থ${wordNumber}`,
        category: categories[category],
        categoryKey: category,
        example: `Example sentence ${wordNumber} (উদাহরণ বাক্য ${wordNumber})`,
        difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'medium' : 'easy',
        learned: false,
        lastReviewed: null,
        correctCount: 0,
        incorrectCount: 0,
        audio: `${CONFIG.AUDIO_PATH}${languageCode}/word${wordNumber}.mp3`
      });
    }

    return vocabulary;
  };

  return generateComprehensiveVocabulary(language);
};

// ================================
// ACHIEVEMENT SYSTEM
// ================================

const AchievementSystem = {
  checkAchievements(userStats) {
    const unlockedAchievements = [];
    const currentAchievements = this.getAchievements();

    Object.values(CONFIG.ACHIEVEMENTS).forEach(achievement => {
      if (!currentAchievements[achievement.id]) {
        let unlocked = false;

        switch(achievement.id) {
          case 'first_10':
            unlocked = userStats.totalWordsLearned >= achievement.threshold;
            break;
          case 'streak_7':
            unlocked = userStats.currentStreak >= achievement.threshold;
            break;
          case 'languages_3':
            unlocked = (userStats.languagesLearned || []).length >= achievement.threshold;
            break;
          case 'words_100':
            unlocked = userStats.totalWordsLearned >= achievement.threshold;
            break;
          case 'perfect_quiz':
            unlocked = userStats.perfectQuizzes >= achievement.threshold;
            break;
          case 'fast_completion':
            unlocked = userStats.fastCompletions >= achievement.threshold;
            break;
        }

        if (unlocked) {
          currentAchievements[achievement.id] = {
            ...achievement,
            unlockedAt: new Date().toISOString()
          };
          unlockedAchievements.push(achievement);
        }
      }
    });

    this.saveAchievements(currentAchievements);
    return unlockedAchievements;
  },

  getAchievements() {
    return loadFromStorage(CONFIG.STORAGE_KEYS.achievements, {});
  },

  saveAchievements(achievements) {
    saveToStorage(CONFIG.STORAGE_KEYS.achievements, achievements);
  },

  getProgress(achievementId, userStats) {
    const achievement = CONFIG.ACHIEVEMENTS[achievementId];
    if (!achievement) return 0;

    let current = 0;
    switch(achievementId) {
      case 'FIRST_WORDS':
      case 'MASTER':
        current = userStats.totalWordsLearned;
        break;
      case 'CONSISTENT':
        current = userStats.currentStreak;
        break;
      case 'POLYGLOT':
        current = (userStats.languagesLearned || []).length;
        break;
      case 'PERFECTIONIST':
        current = userStats.perfectQuizzes || 0;
        break;
      case 'SPEED_LEARNER':
        current = userStats.fastCompletions || 0;
        break;
    }

    return Math.min((current / achievement.threshold) * 100, 100);
  }
};

// ================================
// LEVEL SYSTEM
// ================================

const LevelSystem = {
  calculateLevel(totalWords) {
    for (let level = 1; level <= 7; level++) {
      const levelData = CONFIG.LEVELS[level];
      if (totalWords >= levelData.minWords && totalWords <= levelData.maxWords) {
        return {
          level,
          name: levelData.name,
          progress: this.calculateProgress(totalWords, levelData),
          nextLevelWords: level < 7 ? CONFIG.LEVELS[level + 1].minWords : null
        };
      }
    }
    return { level: 7, name: CONFIG.LEVELS[7].name, progress: 100, nextLevelWords: null };
  },

  calculateProgress(currentWords, levelData) {
    if (levelData.maxWords === Infinity) return 100;
    const range = levelData.maxWords - levelData.minWords;
    const progress = currentWords - levelData.minWords;
    return Math.min((progress / range) * 100, 100);
  }
};

// ================================
// UTILITY FUNCTIONS
// ================================

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Storage error:', error);
    return defaultValue;
  }
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function highlightText(text, query) {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px; color: #000;">$1</mark>');
}

// ================================
// SPACED REPETITION ALGORITHM
// ================================

const SpacedRepetition = {
  calculateNextReview(difficulty, correctCount) {
    const intervals = {
      easy: [1, 6, 24, 144, 864], // hours
      medium: [0.5, 3, 12, 72, 432],
      hard: [0.25, 1, 6, 36, 216]
    };

    const difficultyIntervals = intervals[difficulty] || intervals.medium;
    const intervalIndex = Math.min(correctCount, difficultyIntervals.length - 1);
    const hoursToAdd = difficultyIntervals[intervalIndex];
    
    const nextReview = new Date();
    nextReview.setHours(nextReview.getHours() + hoursToAdd);
    
    return nextReview.toISOString();
  },

  getDueWords(vocabulary) {
    const now = new Date();
    return vocabulary.filter(word => {
      if (!word.nextReview) return true; // New words
      return new Date(word.nextReview) <= now;
    });
  },

  updateWordStats(word, isCorrect) {
    if (isCorrect) {
      word.correctCount = (word.correctCount || 0) + 1;
      word.nextReview = this.calculateNextReview(word.difficulty, word.correctCount);
    } else {
      word.incorrectCount = (word.incorrectCount || 0) + 1;
      word.correctCount = Math.max(0, (word.correctCount || 0) - 1);
      word.nextReview = this.calculateNextReview(word.difficulty, 0); // Reset interval
    }
    
    word.lastReviewed = new Date().toISOString();
    return word;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    COUNTRIES_DATA,
    generateVocabularyData,
    AchievementSystem,
    LevelSystem,
    SpacedRepetition,
    getTodayDate,
    saveToStorage,
    loadFromStorage,
    getRandomElement,
    shuffleArray,
    highlightText
  };
}