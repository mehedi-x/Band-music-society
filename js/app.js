// 🎯 Speak EU - Advanced Language Learning Platform
// Main Application JavaScript for Bangladeshi Expatriates in Europe

'use strict';

// 🌍 Global Configuration
const CONFIG = {
  APP_NAME: 'Speak EU',
  VERSION: '2.0.0',
  STORAGE_PREFIX: 'speak_eu_',
  
  // Learning Settings
  DAILY_TARGET: 15,
  STREAK_THRESHOLD: 24, // hours
  
  // Performance Settings
  LAZY_LOAD_THRESHOLD: 100,
  SEARCH_DEBOUNCE: 300,
  ANIMATION_DURATION: 300,
  
  // API Settings
  SPEECH_LANG_MAP: {
    'de': 'de-DE',
    'fr': 'fr-FR',
    'it': 'it-IT',
    'es': 'es-ES',
    'ru': 'ru-RU',
    'pl': 'pl-PL',
    'nl': 'nl-NL',
    'pt': 'pt-PT',
    'sv': 'sv-SE',
    'da': 'da-DK',
    'no': 'nb-NO',
    'fi': 'fi-FI',
    'el': 'el-GR',
    'cs': 'cs-CZ',
    'sk': 'sk-SK',
    'hu': 'hu-HU',
    'hr': 'hr-HR',
    'sl': 'sl-SI',
    'et': 'et-EE',
    'lv': 'lv-LV',
    'lt': 'lt-LT',
    'is': 'is-IS'
  }
};

// 🗺️ Complete Language Data Structure (28 Countries)
const LANGUAGES = {
  // High Priority Schengen Countries (Major Destinations)
  germany: {
    code: 'de',
    name: 'জার্মান',
    nativeName: 'Deutsch',
    country: 'জার্মানি',
    flag: '🇩🇪',
    type: 'schengen',
    population: '83M',
    difficulty: 'intermediate',
    wordCount: 5284,
    categories: 23,
    priority: 'high',
    capital: 'বার্লিন'
  },
  france: {
    code: 'fr',
    name: 'ফরাসি',
    nativeName: 'Français',
    country: 'ফ্রান্স',
    flag: '🇫🇷',
    type: 'schengen',
    population: '68M',
    difficulty: 'intermediate',
    wordCount: 5156,
    categories: 23,
    priority: 'high',
    capital: 'প্যারিস'
  },
  italy: {
    code: 'it',
    name: 'ইতালিয়ান',
    nativeName: 'Italiano',
    country: 'ইতালি',
    flag: '🇮🇹',
    type: 'schengen',
    population: '60M',
    difficulty: 'beginner',
    wordCount: 4987,
    categories: 23,
    priority: 'high',
    capital: 'রোম'
  },
  spain: {
    code: 'es',
    name: 'স্প্যানিশ',
    nativeName: 'Español',
    country: 'স্পেন',
    flag: '🇪🇸',
    type: 'schengen',
    population: '47M',
    difficulty: 'beginner',
    wordCount: 5342,
    categories: 23,
    priority: 'high',
    capital: 'মাদ্রিদ'
  },
  netherlands: {
    code: 'nl',
    name: 'ডাচ',
    nativeName: 'Nederlands',
    country: 'নেদারল্যান্ডস',
    flag: '🇳🇱',
    type: 'schengen',
    population: '17M',
    difficulty: 'intermediate',
    wordCount: 4723,
    categories: 22,
    priority: 'high',
    capital: 'আমস্টার্ডাম'
  },
  poland: {
    code: 'pl',
    name: 'পোলিশ',
    nativeName: 'Polski',
    country: 'পোল্যান্ড',
    flag: '🇵🇱',
    type: 'schengen',
    population: '38M',
    difficulty: 'advanced',
    wordCount: 4432,
    categories: 22,
    priority: 'high',
    capital: 'ওয়ারশ'
  },

  // Medium Priority Countries
  belgium: {
    code: 'nl',
    name: 'ডাচ/ফরাসি',
    nativeName: 'Nederlands/Français',
    country: 'বেলজিয়াম',
    flag: '🇧🇪',
    type: 'schengen',
    population: '11M',
    difficulty: 'intermediate',
    wordCount: 4156,
    categories: 21,
    priority: 'medium',
    capital: 'ব্রাসেলস'
  },
  austria: {
    code: 'de',
    name: 'জার্মান',
    nativeName: 'Deutsch (Österreich)',
    country: 'অস্ট্রিয়া',
    flag: '🇦🇹',
    type: 'schengen',
    population: '9M',
    difficulty: 'intermediate',
    wordCount: 4892,
    categories: 21,
    priority: 'medium',
    capital: 'ভিয়েনা'
  },
  portugal: {
    code: 'pt',
    name: 'পর্তুগিজ',
    nativeName: 'Português',
    country: 'পর্তুগাল',
    flag: '🇵🇹',
    type: 'schengen',
    population: '10M',
    difficulty: 'intermediate',
    wordCount: 4567,
    categories: 21,
    priority: 'medium',
    capital: 'লিসবন'
  },
  greece: {
    code: 'el',
    name: 'গ্রিক',
    nativeName: 'Ελληνικά',
    country: 'গ্রিস',
    flag: '🇬🇷',
    type: 'schengen',
    population: '11M',
    difficulty: 'advanced',
    wordCount: 3987,
    categories: 20,
    priority: 'medium',
    capital: 'এথেন্স'
  },
  sweden: {
    code: 'sv',
    name: 'সুইডিশ',
    nativeName: 'Svenska',
    country: 'সুইডেন',
    flag: '🇸🇪',
    type: 'schengen',
    population: '10M',
    difficulty: 'intermediate',
    wordCount: 4234,
    categories: 20,
    priority: 'medium',
    capital: 'স্টকহোম'
  },
  norway: {
    code: 'no',
    name: 'নরওয়েজিয়ান',
    nativeName: 'Norsk',
    country: 'নরওয়ে',
    flag: '🇳🇴',
    type: 'schengen',
    population: '5M',
    difficulty: 'intermediate',
    wordCount: 4156,
    categories: 20,
    priority: 'medium',
    capital: 'অসলো'
  },
  denmark: {
    code: 'da',
    name: 'ডেনিশ',
    nativeName: 'Dansk',
    country: 'ডেনমার্ক',
    flag: '🇩🇰',
    type: 'schengen',
    population: '6M',
    difficulty: 'intermediate',
    wordCount: 3987,
    categories: 19,
    priority: 'medium',
    capital: 'কোপেনহেগেন'
  },
  czechia: {
    code: 'cs',
    name: 'চেক',
    nativeName: 'Čeština',
    country: 'চেক প্রজাতন্ত্র',
    flag: '🇨🇿',
    type: 'schengen',
    population: '11M',
    difficulty: 'advanced',
    wordCount: 3876,
    categories: 19,
    priority: 'medium',
    capital: 'প্রাগ'
  },

  // Lower Priority Schengen Countries
  finland: {
    code: 'fi',
    name: 'ফিনিশ',
    nativeName: 'Suomi',
    country: 'ফিনল্যান্ড',
    flag: '🇫🇮',
    type: 'schengen',
    population: '6M',
    difficulty: 'advanced',
    wordCount: 3765,
    categories: 18,
    priority: 'low',
    capital: 'হেলসিঙ্কি'
  },
  slovakia: {
    code: 'sk',
    name: 'স্লোভাক',
    nativeName: 'Slovenčina',
    country: 'স্লোভাকিয়া',
    flag: '🇸🇰',
    type: 'schengen',
    population: '5M',
    difficulty: 'advanced',
    wordCount: 3654,
    categories: 18,
    priority: 'low',
    capital: 'ব্রাতিস্লাভা'
  },
  hungary: {
    code: 'hu',
    name: 'হাঙ্গেরিয়ান',
    nativeName: 'Magyar',
    country: 'হাঙ্গেরি',
    flag: '🇭🇺',
    type: 'schengen',
    population: '10M',
    difficulty: 'advanced',
    wordCount: 3543,
    categories: 17,
    priority: 'low',
    capital: 'বুদাপেস্ট'
  },
  slovenia: {
    code: 'sl',
    name: 'স্লোভেনিয়ান',
    nativeName: 'Slovenščina',
    country: 'স্লোভেনিয়া',
    flag: '🇸🇮',
    type: 'schengen',
    population: '2M',
    difficulty: 'advanced',
    wordCount: 3234,
    categories: 16,
    priority: 'low',
    capital: 'লুবলিয়ানা'
  },
  croatia: {
    code: 'hr',
    name: 'ক্রোয়েশিয়ান',
    nativeName: 'Hrvatski',
    country: 'ক্রোয়েশিয়া',
    flag: '🇭🇷',
    type: 'schengen',
    population: '4M',
    difficulty: 'advanced',
    wordCount: 3456,
    categories: 17,
    priority: 'low',
    capital: 'জাগ্রেব'
  },
  estonia: {
    code: 'et',
    name: 'এস্তোনিয়ান',
    nativeName: 'Eesti',
    country: 'এস্তোনিয়া',
    flag: '🇪🇪',
    type: 'schengen',
    population: '1M',
    difficulty: 'advanced',
    wordCount: 2987,
    categories: 15,
    priority: 'low',
    capital: 'তালিন'
  },
  latvia: {
    code: 'lv',
    name: 'লাটভিয়ান',
    nativeName: 'Latviešu',
    country: 'লাটভিয়া',
    flag: '🇱🇻',
    type: 'schengen',
    population: '2M',
    difficulty: 'advanced',
    wordCount: 3123,
    categories: 16,
    priority: 'low',
    capital: 'রিগা'
  },
  lithuania: {
    code: 'lt',
    name: 'লিথুয়ানিয়ান',
    nativeName: 'Lietuvių',
    country: 'লিথুয়ানিয়া',
    flag: '🇱🇹',
    type: 'schengen',
    population: '3M',
    difficulty: 'advanced',
    wordCount: 3234,
    categories: 16,
    priority: 'low',
    capital: 'ভিলনিউস'
  },
  luxembourg: {
    code: 'fr',
    name: 'ফরাসি/জার্মান',
    nativeName: 'Français/Deutsch',
    country: 'লুক্সেমবার্গ',
    flag: '🇱🇺',
    type: 'schengen',
    population: '0.6M',
    difficulty: 'intermediate',
    wordCount: 2876,
    categories: 14,
    priority: 'low',
    capital: 'লুক্সেমবার্গ'
  },
  malta: {
    code: 'en',
    name: 'মাল্টিজ/ইংরেজি',
    nativeName: 'Malti/English',
    country: 'মাল্টা',
    flag: '🇲🇹',
    type: 'schengen',
    population: '0.5M',
    difficulty: 'beginner',
    wordCount: 2456,
    categories: 13,
    priority: 'low',
    capital: 'ভ্যালেত্তা'
  },
  cyprus: {
    code: 'el',
    name: 'গ্রিক',
    nativeName: 'Ελληνικά (Κύπρος)',
    country: 'সাইপ্রাস',
    flag: '🇨🇾',
    type: 'schengen',
    population: '1M',
    difficulty: 'advanced',
    wordCount: 2789,
    categories: 14,
    priority: 'low',
    capital: 'নিকোসিয়া'
  },
  iceland: {
    code: 'is',
    name: 'আইসল্যান্ডিক',
    nativeName: 'Íslenska',
    country: 'আইসল্যান্ড',
    flag: '🇮🇸',
    type: 'schengen',
    population: '0.4M',
    difficulty: 'advanced',
    wordCount: 2234,
    categories: 12,
    priority: 'low',
    capital: 'রেইকিয়াভিক'
  },
  liechtenstein: {
    code: 'de',
    name: 'জার্মান',
    nativeName: 'Deutsch (Liechtenstein)',
    country: 'লিচেনস্টাইন',
    flag: '🇱🇮',
    type: 'schengen',
    population: '0.04M',
    difficulty: 'intermediate',
    wordCount: 1987,
    categories: 11,
    priority: 'low',
    capital: 'ভাদুৎস'
  },

  // Non-Schengen (Special Case: Russia)
  russia: {
    code: 'ru',
    name: 'রুশ',
    nativeName: 'Русский',
    country: 'রাশিয়া',
    flag: '🇷🇺',
    type: 'non-schengen',
    population: '146M',
    difficulty: 'advanced',
    wordCount: 5678,
    categories: 23,
    priority: 'high',
    capital: 'মস্কো'
  }
};

// 📊 Learning Categories (23 Categories)
const CATEGORIES = {
  emergency: { 
    name: 'জরুরি অবস্থা', 
    icon: '🚨', 
    priority: 1, 
    description: 'জরুরি পরিস্থিতিতে সাহায্যের জন্য',
    color: '#ff4757'
  },
  daily: { 
    name: 'দৈনন্দিন কথোপকথন', 
    icon: '💬', 
    priority: 2,
    description: 'প্রতিদিনের সাধারণ কথোপকথন',
    color: '#3742fa'
  },
  greetings: { 
    name: 'শুভেচ্ছা ও পরিচয়', 
    icon: '👋', 
    priority: 3,
    description: 'অভিবাদন ও পরিচয় পর্ব',
    color: '#2ed573'
  },
  work: { 
    name: 'কাজ ও পেশা', 
    icon: '💼', 
    priority: 4,
    description: 'কর্মক্ষেত্রে প্রয়োজনীয় কথোপকথন',
    color: '#ff6348'
  },
  travel: { 
    name: 'ভ্রমণ ও পরিবহন', 
    icon: '✈️', 
    priority: 5,
    description: 'ভ্রমণ ও যাতায়াতের জন্য',
    color: '#ff7675'
  },
  accommodation: { 
    name: 'থাকার ব্যবস্থা', 
    icon: '🏨', 
    priority: 6,
    description: 'হোটেল ও আবাসনের জন্য',
    color: '#a29bfe'
  },
  education: { 
    name: 'শিক্ষা ও বিশ্ববিদ্যালয়', 
    icon: '🎓', 
    priority: 7,
    description: 'শিক্ষা প্রতিষ্ঠানে ব্যবহার',
    color: '#6c5ce7'
  },
  health: { 
    name: 'স্বাস্থ্য ও চিকিৎসা', 
    icon: '🏥', 
    priority: 8,
    description: 'চিকিৎসা ও স্বাস্থ্য সেবা',
    color: '#fd79a8'
  },
  shopping: { 
    name: 'কেনাকাটা ও বাজার', 
    icon: '🛍️', 
    priority: 9,
    description: 'বাজার ও দোকানে কেনাকাটা',
    color: '#fdcb6e'
  },
  banking: { 
    name: 'ব্যাংকিং ও আর্থিক', 
    icon: '🏦', 
    priority: 10,
    description: 'ব্যাংক ও আর্থিক লেনদেন',
    color: '#00b894'
  },
  government: { 
    name: 'সরকারি কাজ', 
    icon: '🏛️', 
    priority: 11,
    description: 'সরকারি অফিস ও কাগজপত্র',
    color: '#00cec9'
  },
  legal: { 
    name: 'আইনি বিষয়', 
    icon: '⚖️', 
    priority: 12,
    description: 'আইনি সাহায্য ও পরামর্শ',
    color: '#74b9ff'
  },
  numbers: { 
    name: 'সংখ্যা ও সময়', 
    icon: '🔢', 
    priority: 13,
    description: 'সংখ্যা, সময় ও তারিখ',
    color: '#0984e3'
  },
  food: { 
    name: 'খাবার ও পানীয়', 
    icon: '🍽️', 
    priority: 14,
    description: 'রেস্তোরাঁ ও খাবারের অর্ডার',
    color: '#e84393'
  },
  technology: { 
    name: 'প্রযুক্তি ও ইন্টারনেট', 
    icon: '💻', 
    priority: 15,
    description: 'কম্পিউটার ও ইন্টারনেট সেবা',
    color: '#9b59b6'
  },
  weather: { 
    name: 'আবহাওয়া ও প্রকৃতি', 
    icon: '🌤️', 
    priority: 16,
    description: 'আবহাওয়া ও প্রাকৃতিক বিষয়',
    color: '#f39c12'
  },
  family: { 
    name: 'পরিবার ও সম্পর্ক', 
    icon: '👨‍👩‍👧‍👦', 
    priority: 17,
    description: 'পারিবারিক সম্পর্ক ও পরিচয়',
    color: '#e67e22'
  },
  hobbies: { 
    name: 'শখ ও বিনোদন', 
    icon: '🎮', 
    priority: 18,
    description: 'বিনোদন ও অবসর সময়',
    color: '#27ae60'
  },
  sports: { 
    name: 'খেলাধুলা ও ব্যায়াম', 
    icon: '⚽', 
    priority: 19,
    description: 'খেলা ও শারীরিক ব্যায়াম',
    color: '#16a085'
  },
  culture: { 
    name: 'সংস্কৃতি ও ঐতিহ্য', 
    icon: '🎭', 
    priority: 20,
    description: 'স্থানীয় সংস্কৃতি ও ঐতিহ্য',
    color: '#8e44ad'
  },
  directions: { 
    name: 'দিকনির্দেশনা', 
    icon: '🧭', 
    priority: 21,
    description: 'রাস্তা ও দিক জিজ্ঞাসা',
    color: '#2c3e50'
  },
  clothing: { 
    name: 'পোশাক ও ফ্যাশন', 
    icon: '👕', 
    priority: 22,
    description: 'কাপড়চোপড় ও ফ্যাশন',
    color: '#34495e'
  },
  body: { 
    name: 'শরীর ও অঙ্গপ্রত্যঙ্গ', 
    icon: '🧑‍⚕️', 
    priority: 23,
    description: 'শরীরের অংশ ও স্বাস্থ্য',
    color: '#95a5a6'
  }
};

// 🎯 Application State Management
class AppState {
  constructor() {
    this.currentLanguage = null;
    this.currentSection = 'home';
    this.vocabularyData = new Map();
    this.userProgress = new Map();
    this.favorites = new Set();
    this.searchResults = [];
    this.currentVocabularyIndex = 0;
    this.displayedVocabulary = [];
    this.filters = {
      category: 'all',
      difficulty: 'all',
      type: 'all'
    };
    this.settings = {
      theme: 'light',
      autoPlay: true,
      speechRate: 1,
      fontSize: 'medium',
      notifications: true,
      language: 'bn'
    };
    this.isLoading = false;
    this.loadProgress = 0;
  }

  // 💾 Storage Methods
  save() {
    try {
      const stateData = {
        currentLanguage: this.currentLanguage,
        userProgress: Array.from(this.userProgress.entries()),
        favorites: Array.from(this.favorites),
        settings: this.settings,
        filters: this.filters,
        currentVocabularyIndex: this.currentVocabularyIndex
      };
      localStorage.setItem(CONFIG.STORAGE_PREFIX + 'state', JSON.stringify(stateData));
      console.log('✅ State saved successfully');
    } catch (error) {
      console.error('❌ Failed to save state:', error);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'state');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentLanguage = data.currentLanguage;
        this.userProgress = new Map(data.userProgress || []);
        this.favorites = new Set(data.favorites || []);
        this.settings = { ...this.settings, ...data.settings };
        this.filters = { ...this.filters, ...data.filters };
        this.currentVocabularyIndex = data.currentVocabularyIndex || 0;
        console.log('✅ State loaded successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load state:', error);
    }
  }

  // 📈 Progress Methods
  updateProgress(languageKey, wordsLearned = 1) {
    const today = new Date().toDateString();
    const key = `${languageKey}_${today}`;
    
    const current = this.userProgress.get(key) || {
      date: today,
      language: languageKey,
      learned: 0,
      target: CONFIG.DAILY_TARGET,
      streak: 0
    };
    
    current.learned += wordsLearned;
    this.userProgress.set(key, current);
    this.save();
    
    return current;
  }

  getTodayProgress(languageKey) {
    const today = new Date().toDateString();
    const key = `${languageKey}_${today}`;
    return this.userProgress.get(key) || {
      date: today,
      language: languageKey,
      learned: 0,
      target: CONFIG.DAILY_TARGET,
      streak: 0
    };
  }

  getTotalLearned(languageKey) {
    let total = 0;
    for (const [key, progress] of this.userProgress) {
      if (key.startsWith(languageKey + '_')) {
        total += progress.learned;
      }
    }
    return total;
  }

  getStreak(languageKey) {
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 365) { // Prevent infinite loop
      const dateStr = currentDate.toDateString();
      const key = `${languageKey}_${dateStr}`;
      const progress = this.userProgress.get(key);
      
      if (progress && progress.learned > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }
}

// 🚀 Main Application Class
class SpeakEU {
  constructor() {
    console.log('🏗️ Initializing Speak EU Application...');
    
    this.state = new AppState();
    this.speechSynth = window.speechSynthesis;
    this.currentAudio = null;
    this.searchTimeout = null;
    this.intersectionObserver = null;
    this.loadingProgress = 0;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  // 🚀 Initialize Application
  async init() {
    try {
      console.log('🚀 Starting Speak EU initialization...');
      
      // Show loading screen
      this.showLoadingScreen(true);
      
      // Load saved state
      this.updateLoadingProgress(10, 'সেভ করা ডেটা লোড হচ্ছে...');
      this.state.load();
      
      // Initialize core components
      this.updateLoadingProgress(20, 'মূল কম্পোনেন্ট চালু হচ্ছে...');
      await this.initializeComponents();
      
      // Setup event listeners
      this.updateLoadingProgress(40, 'ইভেন্ট লিসেনার সেটআপ হচ্ছে...');
      this.setupEventListeners();
      
      // Apply saved settings
      this.updateLoadingProgress(60, 'সেটিংস প্রয়োগ হচ্ছে...');
      this.applySettings();
      
      // Initialize navigation
      this.updateLoadingProgress(70, 'নেভিগেশন সিস্টেম চালু হচ্ছে...');
      this.initializeNavigation();
      
      // Initialize PWA features
      this.updateLoadingProgress(80, 'PWA ফিচার চালু হচ্ছে...');
      this.initializePWA();
      
      // Load initial content
      this.updateLoadingProgress(90, 'প্রাথমিক কন্টেন্ট লোড হচ্ছে...');
      await this.loadInitialContent();
      
      // Complete initialization
      this.updateLoadingProgress(100, 'সম্পূর্ণ হয়েছে!');
      
      // Hide loading screen
      setTimeout(() => {
        this.showLoadingScreen(false);
        this.showWelcomeMessage();
      }, 500);
      
      console.log('✅ Speak EU initialized successfully');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      this.showError('অ্যাপ্লিকেশন লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করুন।');
      this.showLoadingScreen(false);
    }
  }

  // 📊 Loading Progress
  updateLoadingProgress(percentage, message) {
    this.loadingProgress = percentage;
    
    const progressBar = document.querySelector('.loading-progress-fill');
    const progressText = document.querySelector('.loading-text');
    const progressPercent = document.querySelector('.loading-percentage');
    
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = message;
    }
    
    if (progressPercent) {
      progressPercent.textContent = `${percentage}%`;
    }
    
    console.log(`📊 Loading Progress: ${percentage}% - ${message}`);
  }

  showLoadingScreen(show) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      if (show) {
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('fade-out');
      } else {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }
  }

  showWelcomeMessage() {
    // Show welcome toast
    this.showToast('স্বাগতম! Speak EU তে আপনাকে স্বাগত জানাই', 'success', 4000);
    
    // If first time user, show tour
    const isFirstTime = !localStorage.getItem(CONFIG.STORAGE_PREFIX + 'visited');
    if (isFirstTime) {
      localStorage.setItem(CONFIG.STORAGE_PREFIX + 'visited', 'true');
      setTimeout(() => {
        this.showAppTour();
      }, 2000);
    }
  }

  showAppTour() {
    const tourSteps = [
      {
        element: '.hero-content',
        title: 'স্বাগতম!',
        content: 'Speak EU তে ২৮টি ইউরোপীয় দেশের ভাষা শিখুন। বাংলাদেশী প্রবাসীদের জন্য বিশেষভাবে তৈরি।'
      },
      {
        element: '.quick-actions',
        title: 'দ্রুত কাজ',
        content: 'জরুরি প্রয়োজনে দ্রুত ফ্রেজ খুঁজুন। কাজ, ভ্রমণ বা দৈনন্দিন কথোপকথনের জন্য।'
      },
      {
        element: '.nav-item[data-section="languages"]',
        title: 'ভাষা তালিকা',
        content: 'সব ইউরোপীয় দেশের ভাষা দেখুন এবং আপনার পছন্দের ভাষা বেছে নিন।'
      }
    ];
    
    this.showToast('💡 টিপ: অ্যাপটি কীভাবে ব্যবহার করবেন তা জানতে গাইড দেখুন', 'info', 3000);
  }

  // 🔧 Initialize Core Components
  async initializeComponents() {
    console.log('🔧 Initializing core components...');
    
    // Initialize network status
    this.initializeNetworkStatus();
    
    // Initialize error handlers
    this.initializeErrorHandlers();
    
    // Initialize intersection observer
    this.initializeIntersectionObserver();
    
    // Initialize search
    this.initializeSearch();
    
    // Initialize mobile menu
    this.initializeMobileMenu();
    
    // Initialize theme toggle
    this.initializeThemeToggle();
    
    // Simulate loading delay
    await this.delay(300);
  }

  // 📡 Network Status
  initializeNetworkStatus() {
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;
      const networkStatus = document.getElementById('networkStatus');
      
      if (networkStatus) {
        if (isOnline) {
          networkStatus.className = 'network-status online';
          networkStatus.innerHTML = '<span class="network-icon">📶</span><span>অনলাইন</span>';
          setTimeout(() => {
            networkStatus.classList.remove('visible');
          }, 2000);
        } else {
          networkStatus.className = 'network-status offline visible';
          networkStatus.innerHTML = '<span class="network-icon">📴</span><span>অফলাইন মোড</span>';
        }
      }
    };
    
    // Initial check
    updateNetworkStatus();
    
    // Listen for network changes
    window.addEventListener('online', () => {
      updateNetworkStatus();
      this.showToast('ইন্টারনেট সংযোগ পুনরায় স্থাপিত হয়েছে', 'success');
    });
    
    window.addEventListener('offline', () => {
      updateNetworkStatus();
      this.showToast('অফলাইন মোডে কাজ করছে', 'warning');
    });
  }

  // ⚠️ Error Handlers
  initializeErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.trackError('javascript_error', event.error?.message || 'Unknown error');
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.trackError('promise_rejection', event.reason?.message || 'Promise rejection');
    });
  }

  trackError(type, message) {
    // In production, this would send to analytics
    console.log(`📊 Error tracked: ${type} - ${message}`);
  }

  // 🧭 Navigation System
  initializeNavigation() {
    // Desktop navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
      });
    });
    
    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
        this.closeMobileMenu();
      });
    });
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
  }

  navigateToSection(sectionName) {
    // Update navigation state
    this.state.currentSection = sectionName;
    this.state.save();
    
    // Update active nav items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionName) {
        item.classList.add('active');
      }
    });
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Load section content
      this.loadSectionContent(sectionName);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    console.log(`📍 Navigated to: ${sectionName}`);
  }

  async loadSectionContent(sectionName) {
    switch (sectionName) {
      case 'home':
        this.loadHomeContent();
        break;
      case 'languages':
        this.loadLanguagesContent();
        break;
      case 'learn':
        this.loadLearningContent();
        break;
      case 'progress':
        this.loadProgressContent();
        break;
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case 'start-learning':
        this.navigateToSection('learn');
        break;
      case 'browse-languages':
        this.navigateToSection('languages');
        break;
      case 'emergency':
        this.showQuickPhrases('emergency');
        break;
      case 'daily':
        this.showQuickPhrases('daily');
        break;
      case 'work':
        this.showQuickPhrases('work');
        break;
      case 'travel':
        this.showQuickPhrases('travel');
        break;
    }
  }

  showQuickPhrases(category) {
    // Show modal with quick phrases for the category
    const modal = this.createQuickPhrasesModal(category);
    document.body.appendChild(modal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }

  createQuickPhrasesModal(category) {
    const categoryInfo = CATEGORIES[category];
    const modal = document.createElement('div');
    modal.className = 'quick-phrases-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${categoryInfo.icon} ${categoryInfo.name}</h3>
          <button class="modal-close" onclick="this.closest('.quick-phrases-modal').remove()">
            <span>✕</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="category-description">${categoryInfo.description}</p>
          <div class="quick-phrases-list">
            ${this.generateQuickPhrases(category)}
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" onclick="app.selectQuickCategory('${category}')">
              <span class="btn-icon">🚀</span>
              <span>এই ক্যাটাগরি শিখুন</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add click handler for backdrop
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      modal.remove();
    });
    
    return modal;
  }

  generateQuickPhrases(category) {
    const samplePhrases = this.getSamplePhrasesForCategory(category);
    
    return samplePhrases.map(phrase => `
      <div class="quick-phrase-item">
        <div class="phrase-content">
          <div class="phrase-text">${phrase.text}</div>
          <div class="phrase-translation">${phrase.translation}</div>
        </div>
        <button class="phrase-audio-btn" onclick="app.speakText('${phrase.text}', 'en')">
          <span>🔊</span>
        </button>
      </div>
    `).join('');
  }

  getSamplePhrasesForCategory(category) {
    const phrases = {
      emergency: [
        { text: "Help me!", translation: "আমাকে সাহায্য করুন!" },
        { text: "Call the police!", translation: "পুলিশ ডাকুন!" },
        { text: "I need a doctor", translation: "আমার ডাক্তার দরকার" },
        { text: "Where is the hospital?", translation: "হাসপাতাল কোথায়?" }
      ],
      work: [
        { text: "I have an appointment", translation: "আমার একটি অ্যাপয়েন্টমেন্ট আছে" },
        { text: "Where is the office?", translation: "অফিস কোথায়?" },
        { text: "I work here", translation: "আমি এখানে কাজ করি" },
        { text: "Can you help me?", translation: "আপনি কি আমাকে সাহায্য করতে পারেন?" }
      ],
      travel: [
        { text: "Where is the train station?", translation: "ট্রেন স্টেশন কোথায়?" },
        { text: "How much is the ticket?", translation: "টিকিটের দাম কত?" },
        { text: "When does the bus arrive?", translation: "বাস কখন আসবে?" },
        { text: "I want to go to...", translation: "আমি যেতে চাই..." }
      ],
      daily: [
        { text: "Good morning", translation: "সুপ্রভাত" },
        { text: "Thank you", translation: "ধন্যবাদ" },
        { text: "Excuse me", translation: "দুঃখিত" },
        { text: "How are you?", translation: "আপনি কেমন আছেন?" }
      ]
    };
    
    return phrases[category] || phrases.daily;
  }

  selectQuickCategory(category) {
    // Close modal
    document.querySelector('.quick-phrases-modal')?.remove();
    
    // Navigate to learn section with category filter
    this.state.filters.category = category;
    this.navigateToSection('learn');
    
    // Show success message
    const categoryInfo = CATEGORIES[category];
    this.showToast(`${categoryInfo.name} ক্যাটাগরি নির্বাচিত হয়েছে`, 'success');
  }

  // 🏠 Home Content
  loadHomeContent() {
    this.loadPopularLanguages();
    this.updateHomeStats();
    this.loadRecentActivity();
  }

  loadPopularLanguages() {
    const container = document.getElementById('popularLanguagesGrid');
    if (!container) return;
    
    const popularLanguages = Object.entries(LANGUAGES)
      .filter(([_, lang]) => lang.priority === 'high')
      .slice(0, 6);
    
    container.innerHTML = popularLanguages.map(([key, lang]) => 
      this.createLanguageCard(key, lang, 'compact')
    ).join('');
    
    // Add click handlers
    container.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const languageKey = card.getAttribute('data-language');
        if (languageKey) {
          this.selectLanguage(languageKey);
        }
      });
    });
  }

  updateHomeStats() {
    // Calculate total statistics
    const totalWords = Object.values(LANGUAGES)
      .reduce((sum, lang) => sum + lang.wordCount, 0);
    
    const totalCountries = Object.keys(LANGUAGES).length;
    const totalCategories = Object.keys(CATEGORIES).length;
    
    // Update stat displays
    const statsElements = [
      { selector: '[data-stat="countries"]', value: totalCountries },
      { selector: '[data-stat="words"]', value: (totalWords / 1000).toFixed(0) + 'K+' },
      { selector: '[data-stat="categories"]', value: totalCategories },
    ];
    
    statsElements.forEach(({ selector, value }) => {
      const element = document.querySelector(selector);
      if (element) {
        this.animateNumber(element, value);
      }
    });
  }

  animateNumber(element, finalValue) {
    const isNumeric = !isNaN(finalValue);
    if (isNumeric) {
      let current = 0;
      const increment = finalValue / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          current = finalValue;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current);
      }, 50);
    } else {
      element.textContent = finalValue;
    }
  }

  loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Get recent learning activity
    const recentLearning = Array.from(this.state.userProgress.entries())
      .sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
      .slice(0, 5);
    
    if (recentLearning.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>আপনি এখনো কোনো ভাষা শিখতে শুরু করেননি</p>
          <button class="btn btn-primary" onclick="app.navigateToSection('learn')">
            <span class="btn-icon">🚀</span>
            <span>শিখতে শুরু করুন</span>
          </button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = recentLearning.map(([key, progress]) => {
      const language = LANGUAGES[progress.language];
      return `
        <div class="activity-item">
          <div class="activity-icon">${language?.flag || '🏳️'}</div>
          <div class="activity-content">
            <div class="activity-title">${language?.name || 'Unknown'}</div>
            <div class="activity-details">${progress.learned} টি শব্দ শেখা হয়েছে</div>
          </div>
          <div class="activity-date">${this.formatDate(progress.date)}</div>
        </div>
      `;
    }).join('');
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'আজ';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'গতকাল';
    } else {
      return date.toLocaleDateString('bn-BD');
    }
  }

  // 🌍 Languages Content
  loadLanguagesContent() {
    this.renderLanguagesGrid();
    this.setupLanguageFilters();
    this.setupLanguageSearch();
    this.updateLanguageStats();
  }

  setupLanguageFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update filter
        const filter = tab.getAttribute('data-filter');
        this.state.filters.type = filter;
        
        // Re-render with animation
        this.renderLanguagesGrid();
      });
    });
  }

  setupLanguageSearch() {
    const searchInput = document.getElementById('languageSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchLanguages(e.target.value);
      }, CONFIG.SEARCH_DEBOUNCE);
    });
    
    // Clear search
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.renderLanguagesGrid();
      });
    }
  }

  searchLanguages(query) {
    if (!query.trim()) {
      this.renderLanguagesGrid();
      return;
    }
    
    const filtered = Object.entries(LANGUAGES).filter(([key, lang]) => 
      lang.name.toLowerCase().includes(query.toLowerCase()) ||
      lang.country.toLowerCase().includes(query.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(query.toLowerCase())
    );
    
    this.renderLanguagesGrid(filtered);
    
    // Show search results count
    const resultsCount = document.getElementById('searchResultsCount');
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} টি ফলাফল`;
      resultsCount.style.display = filtered.length > 0 ? 'block' : 'none';
    }
  }

  renderLanguagesGrid(languageList = null) {
    const container = document.getElementById('languagesGrid');
    if (!container) return;
    
    let languages = languageList || Object.entries(LANGUAGES);
    
    // Apply filters
    if (this.state.filters.type !== 'all') {
      if (this.state.filters.type === 'popular') {
        languages = languages.filter(([_, lang]) => lang.priority === 'high');
      } else {
        languages = languages.filter(([_, lang]) => lang.type === this.state.filters.type);
      }
    }
    
    // Sort by priority and name
    languages.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a[1].priority] - priorityOrder[b[1].priority] || 
             a[1].name.localeCompare(b[1].name);
    });
    
    // Show loading state
    container.innerHTML = '<div class="loading-spinner">ভাষার তালিকা লোড হচ্ছে...</div>';
    
    // Render with delay for smooth transition
    setTimeout(() => {
      container.innerHTML = languages.map(([key, lang]) => 
        this.createLanguageCard(key, lang, 'full')
      ).join('');
      
      // Add click handlers
      this.setupLanguageCardHandlers(container);
      
      // Add animations
      this.animateGridItems(container);
    }, 100);
  }

  setupLanguageCardHandlers(container) {
    // Language selection
    container.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest('button')) return;
        
        const languageKey = card.getAttribute('data-language');
        if (languageKey) {
          this.selectLanguage(languageKey);
        }
      });
    });
    
    // Quick start buttons
    container.querySelectorAll('.quick-start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const languageKey = btn.getAttribute('data-language');
        this.selectLanguage(languageKey);
      });
    });
    
    // Info buttons
    container.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const languageKey = btn.getAttribute('data-language');
        this.showLanguageDetails(languageKey);
      });
    });
  }

  createLanguageCard(languageKey, language, variant = 'full') {
    const totalLearned = this.state.getTotalLearned(languageKey);
    const progress = this.state.getTodayProgress(languageKey);
    const progressPercentage = Math.round((totalLearned / language.wordCount) * 100);
    
    const isCompact = variant === 'compact';
    const difficultyClass = `difficulty-${language.difficulty}`;
    const difficultyText = {
      'beginner': 'সহজ',
      'intermediate': 'মধ্যম',
      'advanced': 'কঠিন'
    }[language.difficulty];
    
    return `
      <div class="language-card ${isCompact ? 'compact' : ''} ${difficultyClass}" 
           data-language="${languageKey}">
        <div class="language-header">
          <div class="language-flag">${language.flag}</div>
          <div class="language-info">
            <h3 class="language-name">${language.name}</h3>
            <p class="language-native">${language.nativeName}</p>
            <p class="language-country">${language.country} • ${language.capital}</p>
          </div>
          ${language.priority === 'high' ? '<div class="priority-badge">জনপ্রিয়</div>' : ''}
        </div>
        
        ${!isCompact ? `
        <div class="language-stats">
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-label">জনসংখ্যা</span>
              <span class="stat-value">${language.population}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">শব্দভাণ্ডার</span>
              <span class="stat-value">${language.wordCount.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">ক্যাটাগরি</span>
              <span class="stat-value">${language.categories}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">কঠিনতা</span>
              <span class="stat-value ${difficultyClass}">${difficultyText}</span>
            </div>
          </div>
        </div>
        ` : ''}
        
        ${totalLearned > 0 ? `
        <div class="progress-section">
          <div class="progress-info">
            <span class="progress-label">অগ্রগতি</span>
            <span class="progress-percentage">${progressPercentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="progress-text">
            <span>শিখেছি: ${totalLearned}/${language.wordCount}</span>
          </div>
        </div>
        ` : ''}
        
        <div class="language-actions">
          <button class="btn btn-primary quick-start-btn" data-language="${languageKey}">
            <span class="btn-icon">🚀</span>
            <span>${totalLearned > 0 ? 'চালিয়ে যান' : 'শুরু করুন'}</span>
          </button>
          ${!isCompact ? `
          <button class="btn btn-outline info-btn" data-language="${languageKey}">
            <span class="btn-icon">ℹ️</span>
            <span>বিস্তারিত</span>
          </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  animateGridItems(container) {
    const items = container.querySelectorAll('.language-card');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  updateLanguageStats() {
    const schengenCount = Object.values(LANGUAGES).filter(lang => lang.type === 'schengen').length;
    const nonSchengenCount = Object.values(LANGUAGES).filter(lang => lang.type === 'non-schengen').length;
    const popularCount = Object.values(LANGUAGES).filter(lang => lang.priority === 'high').length;
    
    // Update filter tab counts
    const tabCounts = {
      'all': Object.keys(LANGUAGES).length,
      'schengen': schengenCount,
      'non-schengen': nonSchengenCount,
      'popular': popularCount
    };
    
    Object.entries(tabCounts).forEach(([filter, count]) => {
      const tab = document.querySelector(`[data-filter="${filter}"] .tab-count`);
      if (tab) {
        tab.textContent = count;
      }
    });
  }

  async selectLanguage(languageKey) {
    try {
      this.state.currentLanguage = languageKey;
      this.state.save();
      
      const language = LANGUAGES[languageKey];
      
      // Show selection feedback
      this.showToast(`${language.name} ভাষা নির্বাচিত হয়েছে`, 'success');
      
      // Navigate to learn section
      this.navigateToSection('learn');
      
      // Load language data in background
      setTimeout(() => {
        this.loadLanguageVocabulary(languageKey);
      }, 500);
      
    } catch (error) {
      console.error('Failed to select language:', error);
      this.showToast('ভাষা নির্বাচনে সমস্যা হয়েছে', 'error');
    }
  }

  showLanguageDetails(languageKey) {
    const language = LANGUAGES[languageKey];
    const modal = this.createLanguageDetailsModal(languageKey, language);
    document.body.appendChild(modal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }

  createLanguageDetailsModal(languageKey, language) {
    const totalLearned = this.state.getTotalLearned(languageKey);
    const progressPercentage = Math.round((totalLearned / language.wordCount) * 100);
    
    const modal = document.createElement('div');
    modal.className = 'language-details-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="language-flag-large">${language.flag}</div>
          <div class="language-title">
            <h2>${language.name}</h2>
            <p>${language.nativeName}</p>
          </div>
          <button class="modal-close" onclick="this.closest('.language-details-modal').remove()">
            <span>✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="language-overview">
            <h3>ভাষার তথ্য</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">দেশ</span>
                <span class="info-value">${language.country}</span>
              </div>
              <div class="info-item">
                <span class="info-label">রাজধানী</span>
                <span class="info-value">${language.capital}</span>
              </div>
              <div class="info-item">
                <span class="info-label">জনসংখ্যা</span>
                <span class="info-value">${language.population}</span>
              </div>
              <div class="info-item">
                <span class="info-label">কঠিনতা</span>
                <span class="info-value difficulty-${language.difficulty}">
                  ${language.difficulty === 'beginner' ? 'সহজ' : 
                    language.difficulty === 'intermediate' ? 'মধ্যম' : 'কঠিন'}
                </span>
              </div>
            </div>
          </div>
          
          <div class="vocabulary-overview">
            <h3>শব্দভাণ্ডার</h3>
            <div class="vocab-stats">
              <div class="vocab-stat">
                <span class="stat-number">${language.wordCount.toLocaleString()}</span>
                <span class="stat-label">মোট শব্দ</span>
              </div>
              <div class="vocab-stat">
                <span class="stat-number">${language.categories}</span>
                <span class="stat-label">ক্যাটাগরি</span>
              </div>
              <div class="vocab-stat">
                <span class="stat-number">${totalLearned}</span>
                <span class="stat-label">শিখেছি</span>
              </div>
            </div>
            
            ${totalLearned > 0 ? `
            <div class="progress-overview">
              <div class="progress-header">
                <span>অগ্রগতি</span>
                <span>${progressPercentage}%</span>
              </div>
              <div class="progress-bar-large">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="app.selectLanguage('${languageKey}'); this.closest('.language-details-modal').remove();">
            <span class="btn-icon">🚀</span>
            <span>${totalLearned > 0 ? 'চালিয়ে যান' : 'শিখতে শুরু করুন'}</span>
          </button>
        </div>
      </div>
    `;
    
    // Add click handler for backdrop
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      modal.remove();
    });
    
    return modal;
  }

  // Continue in next part...
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility method to speak text
  speakText(text, lang = 'en') {
    if (this.speechSynth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      this.speechSynth.speak(utterance);
    }
  }

  // More methods continue...
}

// Initialize when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 DOM loaded, initializing Speak EU...');
    app = new SpeakEU();
    await app.init();
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
  }
});

// Export for global access
window.app = app;
