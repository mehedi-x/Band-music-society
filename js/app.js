// 🎯 Speak EU - Advanced Language Learning Platform
// Main Application JavaScript

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
    'lt': 'lt-LT'
  }
};

// 🗺️ Language Data Structure
const LANGUAGES = {
  // Schengen Countries
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
    categories: 22,
    priority: 'high'
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
    categories: 22,
    priority: 'high'
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
    categories: 21,
    priority: 'high'
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
    categories: 22,
    priority: 'high'
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
    categories: 20,
    priority: 'medium'
  },
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
    categories: 19,
    priority: 'medium'
  },
  austria: {
    code: 'de',
    name: 'জার্মান',
    nativeName: 'Deutsch',
    country: 'অস্ট্রিয়া',
    flag: '🇦🇹',
    type: 'schengen',
    population: '9M',
    difficulty: 'intermediate',
    wordCount: 4892,
    categories: 21,
    priority: 'medium'
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
    categories: 20,
    priority: 'medium'
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
    categories: 18,
    priority: 'medium'
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
    categories: 19,
    priority: 'medium'
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
    categories: 19,
    priority: 'medium'
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
    categories: 18,
    priority: 'medium'
  },
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
    categories: 17,
    priority: 'low'
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
    categories: 20,
    priority: 'high'
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
    categories: 18,
    priority: 'medium'
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
    categories: 17,
    priority: 'low'
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
    categories: 16,
    priority: 'low'
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
    categories: 15,
    priority: 'low'
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
    categories: 16,
    priority: 'low'
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
    categories: 14,
    priority: 'low'
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
    categories: 15,
    priority: 'low'
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
    categories: 15,
    priority: 'low'
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
    categories: 13,
    priority: 'low'
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
    categories: 12,
    priority: 'low'
  },
  cyprus: {
    code: 'el',
    name: 'গ্রিক',
    nativeName: 'Ελληνικά',
    country: 'সাইপ্রাস',
    flag: '🇨🇾',
    type: 'schengen',
    population: '1M',
    difficulty: 'advanced',
    wordCount: 2789,
    categories: 13,
    priority: 'low'
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
    categories: 11,
    priority: 'low'
  },
  liechtenstein: {
    code: 'de',
    name: 'জার্মান',
    nativeName: 'Deutsch',
    country: 'লিচেনস্টাইন',
    flag: '🇱🇮',
    type: 'schengen',
    population: '0.04M',
    difficulty: 'intermediate',
    wordCount: 1987,
    categories: 10,
    priority: 'low'
  },
  
  // Non-Schengen
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
    priority: 'high'
  }
};

// 📊 Categories Configuration
const CATEGORIES = {
  daily: { name: 'দৈনন্দিন কথোপকথন', icon: '💬', priority: 1 },
  greetings: { name: 'শুভেচ্ছা ও পরিচয়', icon: '👋', priority: 2 },
  numbers: { name: 'সংখ্যা ও সময়', icon: '🔢', priority: 3 },
  food: { name: 'খাবার ও পানীয়', icon: '🍽️', priority: 4 },
  travel: { name: 'ভ্রমণ ও পরিবহন', icon: '✈️', priority: 5 },
  accommodation: { name: 'থাকার ব্যবস্থা', icon: '🏨', priority: 6 },
  work: { name: 'কাজ ও পেশা', icon: '💼', priority: 7 },
  education: { name: 'শিক্ষা ও বিশ্ববিদ্যালয়', icon: '🎓', priority: 8 },
  health: { name: 'স্বাস্থ্য ও চিকিৎসা', icon: '🏥', priority: 9 },
  emergency: { name: 'জরুরি অবস্থা', icon: '🚨', priority: 10 },
  shopping: { name: 'কেনাকাটা ও বাজার', icon: '🛍️', priority: 11 },
  banking: { name: 'ব্যাংকিং ও আর্থিক', icon: '🏦', priority: 12 },
  government: { name: 'সরকারি কাজ', icon: '🏛️', priority: 13 },
  legal: { name: 'আইনি বিষয়', icon: '⚖️', priority: 14 },
  technology: { name: 'প্রযুক্তি ও ইন্টারনেট', icon: '💻', priority: 15 },
  weather: { name: 'আবহাওয়া ও প্রকৃতি', icon: '🌤️', priority: 16 },
  family: { name: 'পরিবার ও সম্পর্ক', icon: '👨‍👩‍👧‍👦', priority: 17 },
  hobbies: { name: 'শখ ও বিনোদন', icon: '🎮', priority: 18 },
  sports: { name: 'খেলাধুলা ও ব্যায়াম', icon: '⚽', priority: 19 },
  culture: { name: 'সংস্কৃতি ও ঐতিহ্য', icon: '🎭', priority: 20 },
  directions: { name: 'দিকনির্দেশনা', icon: '🧭', priority: 21 },
  clothing: { name: 'পোশাক ও ফ্যাশন', icon: '👕', priority: 22 },
  body: { name: 'শরীর ও অঙ্গপ্রত্যঙ্গ', icon: '🧑‍⚕️', priority: 23 }
};

// 🎯 Application State
class AppState {
  constructor() {
    this.currentLanguage = null;
    this.currentSection = 'home';
    this.vocabularyData = new Map();
    this.userProgress = new Map();
    this.favorites = new Set();
    this.searchResults = [];
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
      notifications: true
    };
    this.isLoading = false;
    this.loadProgress = 0;
  }

  // 💾 Storage Methods
  save() {
    try {
      localStorage.setItem(CONFIG.STORAGE_PREFIX + 'state', JSON.stringify({
        currentLanguage: this.currentLanguage,
        userProgress: Array.from(this.userProgress.entries()),
        favorites: Array.from(this.favorites),
        settings: this.settings,
        filters: this.filters
      }));
    } catch (error) {
      console.error('Failed to save state:', error);
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
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }

  // 📊 Progress Methods
  getTodayProgress(language = null) {
    const lang = language || this.currentLanguage;
    const today = new Date().toDateString();
    const key = `${lang}_${today}`;
    return this.userProgress.get(key) || { learned: 0, target: CONFIG.DAILY_TARGET };
  }

  updateProgress(language, increment = 1) {
    const today = new Date().toDateString();
    const key = `${language}_${today}`;
    const current = this.getTodayProgress(language);
    current.learned += increment;
    this.userProgress.set(key, current);
    this.save();
    this.notifyProgressUpdate(language, current);
  }

  getStreak(language = null) {
    const lang = language || this.currentLanguage;
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toDateString();
      const key = `${lang}_${dateStr}`;
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

  getTotalLearned(language = null) {
    const lang = language || this.currentLanguage;
    let total = 0;
    for (const [key, progress] of this.userProgress) {
      if (key.startsWith(lang + '_')) {
        total += progress.learned;
      }
    }
    return total;
  }

  notifyProgressUpdate(language, progress) {
    const event = new CustomEvent('progressUpdate', {
      detail: { language, progress, streak: this.getStreak(language) }
    });
    document.dispatchEvent(event);
  }
}

// 🎯 Core Application Class
class SpeakEU {
  constructor() {
    this.state = new AppState();
    this.speechSynth = window.speechSynthesis;
    this.recognition = null;
    this.currentAudio = null;
    this.searchTimeout = null;
    this.intersectionObserver = null;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  // 🚀 Initialization
  async init() {
    try {
      console.log('🚀 Initializing Speak EU...');
      
      // Load saved state
      this.state.load();
      
      // Initialize components
      await this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Apply saved settings
      this.applySettings();
      
      // Start loading process
      await this.startLoadingProcess();
      
      // Initialize PWA features
      this.initializePWA();
      
      console.log('✅ Speak EU initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError('অ্যাপ লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।');
    }
  }

  async initializeComponents() {
    // Initialize UI components
    this.initializeNavigation();
    this.initializeSearch();
    this.initializeThemeToggle();
    this.initializeMobileMenu();
    this.initializeLanguageSelector();
    this.initializeIntersectionObserver();
    
    // Load initial data
    await this.loadInitialData();
  }

  async startLoadingProcess() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('loadingProgress');
    const progressText = document.getElementById('loadingPercentage');
    
    const steps = [
      { name: 'থিম লোড হচ্ছে...', duration: 200 },
      { name: 'ভাষার ডেটা প্রস্তুত করা হচ্ছে...', duration: 500 },
      { name: 'UI কম্পোনেন্ট সেটআপ...', duration: 300 },
      { name: 'অডিও সিস্টেম চেক...', duration: 400 },
      { name: 'ব্যবহারকারীর ডেটা লোড...', duration: 200 },
      { name: 'চূড়ান্ত প্রস্তুতি...', duration: 300 }
    ];
    
    let currentProgress = 0;
    const totalSteps = steps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const step = steps[i];
      document.querySelector('.loading-text').textContent = step.name;
      
      // Animate progress
      const targetProgress = ((i + 1) / totalSteps) * 100;
      await this.animateProgress(progressFill, progressText, currentProgress, targetProgress);
      currentProgress = targetProgress;
      
      // Wait for step duration
      await this.delay(step.duration);
    }
    
    // Hide loading screen
    await this.delay(200);
    loadingScreen.classList.add('hidden');
    document.body.setAttribute('data-loading', 'false');
    
    // Show main content with animation
    this.showMainContent();
  }

  async animateProgress(progressFill, progressText, start, end) {
    return new Promise(resolve => {
      const duration = 200;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * progress;
        progressFill.style.width = `${currentValue}%`;
        progressText.textContent = `${Math.round(currentValue)}%`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  showMainContent() {
    const mainContent = document.getElementById('mainContent');
    mainContent.classList.add('animate-fadeInUp');
    
    // Animate homepage elements
    this.animateHomepageElements();
  }

  animateHomepageElements() {
    const elements = document.querySelectorAll('.hero-section, .quick-access, .popular-languages, .learning-paths');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fadeInUp');
      }, index * 100);
    });
  }

  // 🎯 Navigation System
  initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
      });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const section = e.state?.section || 'home';
      this.navigateToSection(section, false);
    });
  }

  navigateToSection(section, pushState = true) {
    // Update URL
    if (pushState) {
      history.pushState({ section }, '', `#${section}`);
    }
    
    // Update navigation
    this.updateActiveNavigation(section);
    
    // Show section
    this.showSection(section);
    
    // Update state
    this.state.currentSection = section;
    this.state.save();
    
    // Close mobile menu if open
    this.closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateActiveNavigation(section) {
    const allNavItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    allNavItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-section') === section);
    });
  }

  showSection(section) {
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(sec => {
      sec.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.classList.add('animate-fadeIn');
      
      // Load section-specific content
      this.loadSectionContent(section);
    }
  }

  async loadSectionContent(section) {
    switch (section) {
      case 'home':
        this.loadHomepageContent();
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

  // 🏠 Homepage Content
  loadHomepageContent() {
    this.loadPopularLanguages();
    this.setupQuickAccess();
    this.setupLearningPaths();
    this.updateHomepageStats();
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
    
    // Add stagger animation
    container.classList.add('stagger-children');
  }

  createLanguageCard(key, lang, variant = 'full') {
    const progress = this.state.getTodayProgress(key);
    const totalLearned = this.state.getTotalLearned(key);
    const streak = this.state.getStreak(key);
    
    const compactClass = variant === 'compact' ? 'language-card-compact' : '';
    
    return `
      <div class="language-card ${compactClass} grid-animate" data-language="${key}">
        <div class="language-header">
          <span class="language-flag">${lang.flag}</span>
          <span class="language-type">${lang.type === 'schengen' ? 'শেনজেন' : 'নন-শেনজেন'}</span>
        </div>
        <div class="language-content">
          <h3 class="language-name">${lang.name}</h3>
          <p class="language-info">${lang.country} • ${lang.population} জনসংখ্যা</p>
          <div class="language-stats">
            <div class="language-stat">
              <span class="stat-number">${lang.wordCount.toLocaleString()}</span>
              <span class="stat-label">শব্দ</span>
            </div>
            <div class="language-stat">
              <span class="stat-number">${lang.categories}</span>
              <span class="stat-label">ক্যাটাগরি</span>
            </div>
            <div class="language-stat">
              <span class="stat-number">${totalLearned}</span>
              <span class="stat-label">শিখেছি</span>
            </div>
          </div>
          ${variant === 'full' ? `
            <div class="language-progress">
              <div class="progress-info">
                <span>আজকের অগ্রগতি: ${progress.learned}/${progress.target}</span>
                <span>${Math.round((progress.learned / progress.target) * 100)}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min((progress.learned / progress.target) * 100, 100)}%"></div>
              </div>
            </div>
          ` : ''}
          <div class="language-actions">
            <button class="btn btn-primary btn-small" onclick="app.selectLanguage('${key}')">
              <span class="btn-icon">🚀</span>
              <span>শুরু করুন</span>
            </button>
            ${variant === 'full' ? `
              <button class="btn btn-outline btn-small" onclick="app.showLanguageDetails('${key}')">
                <span class="btn-icon">ℹ️</span>
                <span>বিস্তারিত</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  setupQuickAccess() {
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
  }

  handleQuickAction(action) {
    switch (action) {
      case 'emergency':
        this.showEmergencyPhrases();
        break;
      case 'daily':
        this.showDailyConversation();
        break;
      case 'work':
        this.showWorkplacePhrases();
        break;
      case 'travel':
        this.showTravelPhrases();
        break;
    }
  }

  setupLearningPaths() {
    const pathCards = document.querySelectorAll('.path-card');
    pathCards.forEach(card => {
      card.addEventListener('click', () => {
        const path = card.getAttribute('data-path');
        this.startLearningPath(path);
      });
    });
  }

  startLearningPath(path) {
    // Store selected path
    this.state.selectedPath = path;
    this.state.save();
    
    // Navigate to languages section with path filter
    this.navigateToSection('languages');
    
    // Show toast
    this.showToast(`${path === 'student' ? 'স্টুডেন্ট' : path === 'worker' ? 'ওয়ার্কার' : 'ট্যুরিস্ট'} পাথ নির্বাচিত হয়েছে`, 'success');
  }

  updateHomepageStats() {
    const totalLanguages = Object.keys(LANGUAGES).length;
    const totalWords = Object.values(LANGUAGES).reduce((sum, lang) => sum + lang.wordCount, 0);
    const totalCategories = Object.keys(CATEGORIES).length;
    
    // Update stats in hero section
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
      statCards[0].querySelector('.stat-number').textContent = totalLanguages;
      statCards[1].querySelector('.stat-number').textContent = `${Math.round(totalWords / 1000)}K+`;
      statCards[2].querySelector('.stat-number').textContent = `${totalCategories}+`;
    }
  }

  // 🌍 Languages Content
  loadLanguagesContent() {
    this.setupLanguageFilter();
    this.renderLanguagesGrid();
    this.updateLanguageStats();
  }

  setupLanguageFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('languageSearchInput');
    
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        this.applyLanguageFilter(filter);
        
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.searchLanguages(e.target.value);
        }, CONFIG.SEARCH_DEBOUNCE);
      });
    }
  }

  applyLanguageFilter(filter) {
    this.state.filters.type = filter;
    this.renderLanguagesGrid();
  }

  searchLanguages(query) {
    const filteredLanguages = Object.entries(LANGUAGES).filter(([key, lang]) => {
      const searchText = query.toLowerCase();
      return lang.name.toLowerCase().includes(searchText) ||
             lang.country.toLowerCase().includes(searchText) ||
             lang.nativeName.toLowerCase().includes(searchText);
    });
    
    this.renderLanguagesGrid(filteredLanguages);
  }

  renderLanguagesGrid(filteredData = null) {
    const container = document.getElementById('languagesGrid');
    if (!container) return;
    
    let languagesToShow = filteredData || Object.entries(LANGUAGES);
    
    // Apply type filter
    if (this.state.filters.type !== 'all') {
      languagesToShow = languagesToShow.filter(([_, lang]) => {
        if (this.state.filters.type === 'schengen') return lang.type === 'schengen';
        if (this.state.filters.type === 'non-schengen') return lang.type === 'non-schengen';
        if (this.state.filters.type === 'popular') return lang.priority === 'high';
        return true;
      });
    }
    
    // Sort by priority and name
    languagesToShow.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a[1].priority] || 3;
      const bPriority = priorityOrder[b[1].priority] || 3;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a[1].name.localeCompare(b[1].name);
    });
    
    container.innerHTML = languagesToShow.map(([key, lang]) => 
      this.createLanguageCard(key, lang, 'full')
    ).join('');
    
    // Add grid animation
    container.classList.add('stagger-children');
    
    // Update counts in filter tabs
    this.updateFilterCounts();
  }

  updateFilterCounts() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      const filter = tab.getAttribute('data-filter');
      let count = 0;
      
      switch (filter) {
        case 'all':
          count = Object.keys(LANGUAGES).length;
          break;
        case 'schengen':
          count = Object.values(LANGUAGES).filter(lang => lang.type === 'schengen').length;
          break;
        case 'non-schengen':
          count = Object.values(LANGUAGES).filter(lang => lang.type === 'non-schengen').length;
          break;
        case 'popular':
          count = Object.values(LANGUAGES).filter(lang => lang.priority === 'high').length;
          break;
      }
      
      const countElement = tab.querySelector('.tab-count');
      if (countElement) {
        countElement.textContent = count;
      }
    });
  }

  // 🎯 Language Selection
  selectLanguage(languageKey) {
    this.state.currentLanguage = languageKey;
    this.state.save();
    
    // Navigate to learn section
    this.navigateToSection('learn');
    
    // Show success message
    const language = LANGUAGES[languageKey];
    this.showToast(`${language.name} ভাষা নির্বাচিত হয়েছে`, 'success');
  }

  showLanguageDetails(languageKey) {
    const language = LANGUAGES[languageKey];
    // Implement language details modal
    this.showModal('languageDetails', { language, key: languageKey });
  }

  // 🔍 Search System
  initializeSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const globalSearch = document.getElementById('globalSearch');
    const searchInput = document.getElementById('globalSearchInput');
    const searchClose = document.getElementById('searchClose');
    const searchBtn = document.getElementById('globalSearchBtn');
    
    if (searchToggle) {
      searchToggle.addEventListener('click', () => {
        globalSearch.classList.toggle('hidden');
        if (!globalSearch.classList.contains('hidden')) {
          searchInput.focus();
        }
      });
    }
    
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        globalSearch.classList.add('hidden');
        searchInput.value = '';
      });
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performGlobalSearch(e.target.value);
        }, CONFIG.SEARCH_DEBOUNCE);
      });
      
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performGlobalSearch(e.target.value);
        }
        if (e.key === 'Escape') {
          globalSearch.classList.add('hidden');
        }
      });
    }
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.performGlobalSearch(searchInput.value);
      });
    }
  }

  async performGlobalSearch(query) {
    if (!query.trim()) return;
    
    this.showSearchSuggestions([]);
    
    const results = await this.searchAcrossLanguages(query);
    this.showSearchSuggestions(results);
  }

  async searchAcrossLanguages(query) {
    const results = [];
    const searchTerm = query.toLowerCase().trim();
    
    for (const [langKey, language] of Object.entries(LANGUAGES)) {
      try {
        const vocabularyData = await this.loadLanguageData(langKey);
        
        const matches = vocabularyData.filter(item => {
          return item.bn && item.bn.toLowerCase().includes(searchTerm) ||
                 item.bnMeaning && item.bnMeaning.toLowerCase().includes(searchTerm) ||
                 item.en && item.en.toLowerCase().includes(searchTerm) ||
                 (item[language.code] && item[language.code].toLowerCase().includes(searchTerm));
        });
        
        matches.forEach(match => {
          results.push({
            ...match,
            language: langKey,
            languageName: language.name,
            flag: language.flag
          });
        });
        
      } catch (error) {
        console.warn(`Failed to search in ${langKey}:`, error);
      }
    }
    
    return results.slice(0, 10); // Limit results
  }

  showSearchSuggestions(results) {
    const container = document.getElementById('searchSuggestions');
    if (!container) return;
    
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">কোনো ফলাফল পাওয়া যায়নি</div>';
      return;
    }
    
    container.innerHTML = results.map(result => `
      <div class="search-suggestion" onclick="app.selectSearchResult('${result.language}', ${JSON.stringify(result).replace(/"/g, '&quot;')})">
        <div class="suggestion-header">
          <span class="suggestion-flag">${result.flag}</span>
          <span class="suggestion-language">${result.languageName}</span>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-phrase">${result[LANGUAGES[result.language].code] || ''}</div>
          <div class="suggestion-meaning">${result.bnMeaning || result.bn || ''}</div>
        </div>
      </div>
    `).join('');
  }

  selectSearchResult(languageKey, result) {
    // Close search
    document.getElementById('globalSearch').classList.add('hidden');
    
    // Select language and navigate
    this.selectLanguage(languageKey);
    
    // Highlight the selected phrase in learning interface
    setTimeout(() => {
      this.highlightPhrase(result);
    }, 1000);
  }

  // 🎨 Theme System
  initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
    
    // Set initial theme
    this.applyTheme(this.state.settings.theme);
  }

  toggleTheme() {
    const newTheme = this.state.settings.theme === 'light' ? 'dark' : 'light';
    this.state.settings.theme = newTheme;
    this.state.save();
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    document.body.className = document.body.className.replace(/\b(light|dark)-theme\b/g, '');
    document.body.classList.add(`${theme}-theme`);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.btn-icon');
      icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    // Update meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'light' ? '#2563eb' : '#1e293b';
    }
  }

  // 📱 Mobile Menu
  initializeMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('mobileMenuClose');
    const overlay = mobileMenu?.querySelector('.mobile-menu-overlay');
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        this.openMobileMenu();
      });
    }
    
    if (menuClose) {
      menuClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
  }

  openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Update mobile stats
      this.updateMobileMenuStats();
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  updateMobileMenuStats() {
    const wordsElement = document.getElementById('mobileStatsWords');
    const streakElement = document.getElementById('mobileStatsStreak');
    
    if (wordsElement && this.state.currentLanguage) {
      const total = this.state.getTotalLearned(this.state.currentLanguage);
      wordsElement.textContent = total;
    }
    
    if (streakElement && this.state.currentLanguage) {
      const streak = this.state.getStreak(this.state.currentLanguage);
      streakElement.textContent = streak;
    }
  }

  // 🎵 Audio System
  async playAudio(text, languageCode) {
    try {
      // Stop any current audio
      if (this.currentAudio) {
        this.speechSynth.cancel();
      }
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = CONFIG.SPEECH_LANG_MAP[languageCode] || languageCode;
      utterance.rate = this.state.settings.speechRate;
      utterance.volume = 1;
      
      // Get available voices
      const voices = this.speechSynth.getVoices();
      const voice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
      if (voice) {
        utterance.voice = voice;
      }
      
      // Speak
      this.speechSynth.speak(utterance);
      this.currentAudio = utterance;
      
      return new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // 💾 Data Loading
  async loadLanguageData(languageKey) {
    if (this.state.vocabularyData.has(languageKey)) {
      return this.state.vocabularyData.get(languageKey);
    }
    
    try {
      // In a real implementation, this would load from JSON files
      // For now, we'll return sample data
      const sampleData = await this.generateSampleData(languageKey);
      this.state.vocabularyData.set(languageKey, sampleData);
      return sampleData;
    } catch (error) {
      console.error(`Failed to load data for ${languageKey}:`, error);
      return [];
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
    
    container.innerHTML = languages.map(([key, lang]) => 
      this.createLanguageCard(key, lang, 'full')
    ).join('');
    
    // Add animations
    this.animateGridItems(container);
  }

  animateGridItems(container) {
    const items = container.querySelectorAll('.language-card');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 50}ms`;
      item.classList.add('animate-fadeInUp');
    });
  }

  updateLanguageStats() {
    const schengenCount = Object.values(LANGUAGES).filter(lang => lang.type === 'schengen').length;
    const nonSchengenCount = Object.values(LANGUAGES).filter(lang => lang.type === 'non-schengen').length;
    const popularCount = Object.values(LANGUAGES).filter(lang => lang.priority === 'high').length;
    
    // Update filter tab counts
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      const filter = tab.getAttribute('data-filter');
      const countSpan = tab.querySelector('.tab-count');
      if (countSpan) {
        switch (filter) {
          case 'all':
            countSpan.textContent = Object.keys(LANGUAGES).length;
            break;
          case 'schengen':
            countSpan.textContent = schengenCount;
            break;
          case 'non-schengen':
            countSpan.textContent = nonSchengenCount;
            break;
          case 'popular':
            countSpan.textContent = popularCount;
            break;
        }
      }
    });
  }

  // 📚 Learning Content
  loadLearningContent() {
    this.setupLanguageSelection();
    this.loadLearningInterface();
  }

  setupLanguageSelection() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    
    // Populate language options
    languageSelect.innerHTML = '<option value="">একটি ভাষা নির্বাচন করুন...</option>' +
      Object.entries(LANGUAGES)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([key, lang]) => 
          `<option value="${key}">${lang.flag} ${lang.name} (${lang.country})</option>`
        ).join('');
    
    // Set current language if any
    if (this.state.currentLanguage) {
      languageSelect.value = this.state.currentLanguage;
      this.loadLanguageContent(this.state.currentLanguage);
    }
    
    // Handle language change
    languageSelect.addEventListener('change', (e) => {
      const language = e.target.value;
      if (language) {
        this.selectLanguage(language);
      }
    });
  }

  async selectLanguage(languageKey) {
    try {
      this.state.currentLanguage = languageKey;
      this.state.save();
      
      // Update UI
      const languageSelect = document.getElementById('languageSelect');
      if (languageSelect) {
        languageSelect.value = languageKey;
      }
      
      // Load language content
      await this.loadLanguageContent(languageKey);
      
      // Navigate to learn section if not already there
      if (this.state.currentSection !== 'learn') {
        this.navigateToSection('learn');
      }
      
      // Show success message
      const language = LANGUAGES[languageKey];
      this.showToast(`${language.name} ভাষা নির্বাচিত হয়েছে`, 'success');
      
    } catch (error) {
      console.error('Failed to select language:', error);
      this.showToast('ভাষা নির্বাচনে সমস্যা হয়েছে', 'error');
    }
  }

  async loadLanguageContent(languageKey) {
    const language = LANGUAGES[languageKey];
    if (!language) return;
    
    try {
      // Show loading
      this.showLanguageLoading(true);
      
      // Load vocabulary data
      const vocabularyData = await this.loadVocabularyData(languageKey);
      this.state.vocabularyData.set(languageKey, vocabularyData);
      
      // Update learning interface
      this.updateLearningInterface(languageKey, language, vocabularyData);
      
      // Show learning interface
      this.showLearningInterface();
      
    } catch (error) {
      console.error('Failed to load language content:', error);
      this.showToast('ভাষার ডেটা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      this.showLanguageLoading(false);
    }
  }

  async loadVocabularyData(languageKey) {
    // For demo, return mock data. In production, this would load from JSON files
    return this.generateMockVocabularyData(languageKey);
  }

  generateMockVocabularyData(languageKey) {
    const language = LANGUAGES[languageKey];
    const mockData = [];
    
    // Generate sample vocabulary for each category
    Object.keys(CATEGORIES).forEach(categoryKey => {
      const category = CATEGORIES[categoryKey];
      const sampleSize = Math.floor(language.wordCount / Object.keys(CATEGORIES).length);
      
      for (let i = 0; i < sampleSize; i++) {
        mockData.push({
          id: `${languageKey}_${categoryKey}_${i}`,
          category: categoryKey,
          difficulty: this.getRandomDifficulty(),
          [language.code]: this.generateMockPhrase(language.code, categoryKey, i),
          bn: this.generateMockBengaliTranslation(categoryKey, i),
          bnMeaning: this.generateMockMeaning(categoryKey, i),
          en: this.generateMockEnglishTranslation(categoryKey, i),
          pronunciation: this.generateMockPronunciation(language.code, categoryKey, i),
          tags: this.generateMockTags(categoryKey),
          priority: Math.floor(Math.random() * 3) + 1,
          audioUrl: null // Would be populated in production
        });
      }
    });
    
    return mockData;
  }

  getRandomDifficulty() {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  generateMockPhrase(langCode, category, index) {
    // Mock phrase generation - in production, this would come from actual data
    const mockPhrases = {
      de: ['Guten Tag', 'Wie geht es Ihnen?', 'Danke schön'],
      fr: ['Bonjour', 'Comment allez-vous?', 'Merci beaucoup'],
      it: ['Buongiorno', 'Come stai?', 'Grazie mille'],
      es: ['Hola', '¿Cómo estás?', 'Muchas gracias'],
      ru: ['Здравствуйте', 'Как дела?', 'Спасибо']
    };
    
    const phrases = mockPhrases[langCode] || ['Hello', 'How are you?', 'Thank you'];
    return phrases[index % phrases.length] + ` (${category} ${index + 1})`;
  }

  generateMockBengaliTranslation(category, index) {
    const bengaliPhrases = ['নমস্কার', 'আপনি কেমন আছেন?', 'ধন্যবাদ'];
    return bengaliPhrases[index % bengaliPhrases.length] + ` (${category} ${index + 1})`;
  }

  generateMockMeaning(category, index) {
    return `এই বাক্যটি ${CATEGORIES[category]?.name || category} ক্যাটাগরিতে ব্যবহৃত হয় (${index + 1})`;
  }

  generateMockEnglishTranslation(category, index) {
    const englishPhrases = ['Hello', 'How are you?', 'Thank you'];
    return englishPhrases[index % englishPhrases.length] + ` (${category} ${index + 1})`;
  }

  generateMockPronunciation(langCode, category, index) {
    // Mock pronunciation - would be actual IPA or simplified pronunciation
    return `[pronunciation for ${langCode} phrase ${index + 1}]`;
  }

  generateMockTags(category) {
    const allTags = ['essential', 'polite', 'formal', 'informal', 'common', 'beginner', 'daily'];
    return allTags.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  updateLearningInterface(languageKey, language, vocabularyData) {
    // Update language header
    this.updateLanguageHeader(languageKey, language);
    
    // Update category filter
    this.updateCategoryFilter();
    
    // Update vocabulary display
    this.updateVocabularyDisplay(vocabularyData);
    
    // Update progress stats
    this.updateLearningStats(languageKey);
  }

  updateLanguageHeader(languageKey, language) {
    const flagElement = document.getElementById('currentLanguageFlag');
    const nameElement = document.getElementById('currentLanguageName');
    const infoElement = document.getElementById('currentLanguageInfo');
    
    if (flagElement) flagElement.textContent = language.flag;
    if (nameElement) nameElement.textContent = `${language.name} (${language.nativeName})`;
    if (infoElement) infoElement.textContent = `${language.country} • ${language.population} জনসংখ্যা • ${language.wordCount.toLocaleString()} শব্দ`;
  }

  updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    categoryFilter.innerHTML = '<option value="all">সব ক্যাটাগরি</option>' +
      Object.entries(CATEGORIES)
        .sort((a, b) => a[1].priority - b[1].priority)
        .map(([key, category]) => 
          `<option value="${key}">${category.icon} ${category.name}</option>`
        ).join('');
    
    categoryFilter.addEventListener('change', (e) => {
      this.state.filters.category = e.target.value;
      this.filterVocabulary();
    });
  }

  updateVocabularyDisplay(vocabularyData) {
    const container = document.getElementById('vocabularyList');
    if (!container) return;
    
    // Display first 20 items
    const displayData = vocabularyData.slice(0, 20);
    
    container.innerHTML = displayData.map(item => this.createVocabularyCard(item)).join('');
    
    // Add event listeners
    this.setupVocabularyInteractions(container);
  }

  createVocabularyCard(item) {
    const language = LANGUAGES[this.state.currentLanguage];
    const category = CATEGORIES[item.category];
    const isFavorite = this.state.favorites.has(item.id);
    
    return `
      <div class="vocabulary-card" data-id="${item.id}">
        <div class="vocabulary-header">
          <div class="vocabulary-category">
            <span class="category-icon">${category?.icon || '📝'}</span>
            <span class="category-name">${category?.name || item.category}</span>
          </div>
          <div class="vocabulary-actions">
            <button class="vocab-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                    data-id="${item.id}" title="পছন্দের তালিকায় যোগ করুন">
              <span>${isFavorite ? '❤️' : '🤍'}</span>
            </button>
            <button class="vocab-btn audio-btn" data-id="${item.id}" title="উচ্চারণ শুনুন">
              <span>🔊</span>
            </button>
          </div>
        </div>
        
        <div class="vocabulary-content">
          <div class="original-phrase">
            <div class="phrase-text">${item[language.code]}</div>
            <div class="pronunciation">${item.pronunciation || ''}</div>
          </div>
          
          <div class="translations">
            <div class="bengali-translation">
              <strong>বাংলা:</strong> ${item.bn}
            </div>
            <div class="meaning">
              <strong>অর্থ:</strong> ${item.bnMeaning}
            </div>
            <div class="english-translation">
              <strong>English:</strong> ${item.en}
            </div>
          </div>
          
          <div class="vocabulary-footer">
            <div class="difficulty-badge difficulty-${item.difficulty}">
              ${item.difficulty === 'beginner' ? 'সহজ' : 
                item.difficulty === 'intermediate' ? 'মধ্যম' : 'কঠিন'}
            </div>
            <div class="tags">
              ${item.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
            </div>
          </div>
        </div>
        
        <div class="vocabulary-progress">
          <button class="btn btn-outline btn-small mark-learned" data-id="${item.id}">
            <span class="btn-icon">✓</span>
            <span>শিখেছি</span>
          </button>
        </div>
      </div>
    `;
  }

  setupVocabularyInteractions(container) {
    // Favorite buttons
    container.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.toggleFavorite(id);
      });
    });
    
    // Audio buttons
    container.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.playAudio(id);
      });
    });
    
    // Mark learned buttons
    container.querySelectorAll('.mark-learned').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.markAsLearned(id);
      });
    });
  }

  showLearningInterface() {
    const selectionContainer = document.getElementById('languageSelection');
    const interfaceContainer = document.getElementById('learningInterface');
    
    if (selectionContainer) selectionContainer.classList.add('hidden');
    if (interfaceContainer) {
      interfaceContainer.classList.remove('hidden');
      interfaceContainer.classList.add('animate-fadeInUp');
    }
  }

  showLanguageLoading(show) {
    const loadingContainer = document.getElementById('languageLoading');
    if (loadingContainer) {
      loadingContainer.classList.toggle('hidden', !show);
    }
  }

  updateLearningStats(languageKey) {
    const progress = this.state.getTodayProgress(languageKey);
    const totalLearned = this.state.getTotalLearned(languageKey);
    const streak = this.state.getStreak(languageKey);
    
    const todayElement
        </div>
      </div>
    `;
  }

  renderLanguageProgress() {
    const container = document.getElementById('languageProgressList');
    if (!container) return;
    
    const languageProgress = Object.keys(LANGUAGES).map(langKey => {
      const language = LANGUAGES[langKey];
      const totalLearned = this.state.getTotalLearned(langKey);
      const todayProgress = this.state.getTodayProgress(langKey);
      const streak = this.state.getStreak(langKey);
      
      return {
        key: langKey,
        language,
        totalLearned,
        todayProgress,
        streak,
        percentage: Math.min((totalLearned / language.wordCount) * 100, 100)
      };
    }).filter(item => item.totalLearned > 0)
      .sort((a, b) => b.totalLearned - a.totalLearned);
    
    container.innerHTML = languageProgress.map(item => `
      <div class="language-progress-item">
        <div class="language-info">
          <span class="language-flag">${item.language.flag}</span>
          <div class="language-details">
            <h4>${item.language.name}</h4>
            <p>${item.totalLearned}/${item.language.wordCount} শব্দ</p>
          </div>
        </div>
        <div class="progress-details">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${item.percentage}%"></div>
          </div>
          <div class="progress-stats">
            <span>আজ: ${item.todayProgress.learned}</span>
            <span>স্ট্রিক: ${item.streak}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderStreakCalendar() {
    const container = document.getElementById('streakCalendar');
    if (!container) return;
    
    // Generate last 30 days
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toDateString();
      const key = `${this.state.currentLanguage}_${dateStr}`;
      const progress = this.state.userProgress.get(key);
      const hasActivity = progress && progress.learned > 0;
      
      days.push({
        date,
        hasActivity,
        learned: progress?.learned || 0
      });
    }
    
    container.innerHTML = `
      <div class="calendar-grid">
        ${days.map(day => `
          <div class="calendar-day ${day.hasActivity ? 'has-activity' : ''}" 
               title="${day.date.toLocaleDateString('bn-BD')} - ${day.learned} শব্দ">
            <span class="day-number">${day.date.getDate()}</span>
          </div>
        `).join('')}
      </div>
      <div class="calendar-legend">
        <span class="legend-item">
          <div class="legend-color no-activity"></div>
          <span>কোনো কার্যকলাপ নেই</span>
        </span>
        <span class="legend-item">
          <div class="legend-color has-activity"></div>
          <span>শিখেছেন</span>
        </span>
      </div>
    `;
  }

  renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    const achievements = this.calculateAchievements();
    
    container.innerHTML = achievements.map(achievement => `
      <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-details">
          <h4>${achievement.title}</h4>
          <p>${achievement.description}</p>
          <div class="achievement-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${achievement.progress}%"></div>
            </div>
            <span>${achievement.current}/${achievement.target}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  calculateAchievements() {
    const totalLearned = this.state.getTotalLearned(this.state.currentLanguage);
    const streak = this.state.getStreak(this.state.currentLanguage);
    const favoriteCount = this.state.favorites.size;
    
    return [
      {
        id: 'first_words',
        title: 'প্রথম পদক্ষেপ',
        description: 'প্রথম ১০টি শব্দ শিখুন',
        icon: '🌟',
        target: 10,
        current: Math.min(totalLearned, 10),
        progress: Math.min((totalLearned / 10) * 100, 100),
        unlocked: totalLearned >= 10
      },
      {
        id: 'hundred_words',
        title: 'শব্দ সংগ্রাহক',
        description: '১০০টি শব্দ শিখুন',
        icon: '📚',
        target: 100,
        current: Math.min(totalLearned, 100),
        progress: Math.min((totalLearned / 100) * 100, 100),
        unlocked: totalLearned >= 100
      },
      {
        id: 'week_streak',
        title: 'নিয়মিত শিক্ষার্থী',
        description: '৭ দিন ধারাবাহিক শিখুন',
        icon: '🔥',
        target: 7,
        current: Math.min(streak, 7),
        progress: Math.min((streak / 7) * 100, 100),
        unlocked: streak >= 7
      },
      {
        id: 'favorite_collector',
        title: 'পছন্দের সংগ্রাহক',
        description: '২৫টি বাক্য পছন্দের তালিকায় রাখুন',
        icon: '❤️',
        target: 25,
        current: Math.min(favoriteCount, 25),
        progress: Math.min((favoriteCount / 25) * 100, 100),
        unlocked: favoriteCount >= 25
      }
    ];
  }

  // 🛠️ Utility Methods
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('toast-visible'), 100);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  // 🎯 Event Listeners
  setupEventListeners() {
    // Global event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('keydown', this.handleKeyboard);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Progress update listener
    document.addEventListener('progressUpdate', (e) => {
      this.handleProgressUpdate(e.detail);
    });
    
    // Online/offline listeners
    window.addEventListener('online', () => {
      this.showToast('ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.showToast('ইন্টারনেট সংযোগ নেই - অফলাইন মোডে কাজ করছে', 'warning');
    });
  }

  handleResize() {
    // Handle responsive adjustments
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile-view', isMobile);
  }

  handleScroll() {
    // Handle scroll effects
    const header = document.getElementById('mainHeader');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
  }

  handleKeyboard(e) {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          document.getElementById('searchToggle')?.click();
          break;
        case '/':
          e.preventDefault();
          document.getElementById('globalSearchInput')?.focus();
          break;
      }
    }
    
    if (e.key === 'Escape') {
      // Close any open modals/menus
      document.getElementById('globalSearch')?.classList.add('hidden');
      this.closeMobileMenu();
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Pause any audio
      if (this.currentAudio) {
        this.speechSynth.cancel();
      }
    }
  }

  handleProgressUpdate(detail) {
    // Update progress displays
    this.updateLearningStats(detail.language);
    
    // Show milestone notifications
    if (detail.progress.learned === detail.progress.target) {
      this.showDailyTargetReached();
    }
  }

  // 🎯 Intersection Observer for Animations
  initializeIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  // 🔧 Settings Management
  applySettings() {
    // Apply theme
    this.applyTheme(this.state.settings.theme);
    
    // Apply font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${this.state.settings.fontSize}`);
    
    // Other settings...
  }

  updateSetting(key, value) {
    this.state.settings[key] = value;
    this.state.save();
    this.applySettings();
  }

  // 📱 PWA Features
  initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
    
    // Handle install prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installBtn = document.getElementById('installBtn');
      if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.addEventListener('click', () => {
          this.promptInstall(deferredPrompt);
        });
      }
    });
    
    // Handle app installed
    window.addEventListener('appinstalled', () => {
      this.showToast('অ্যাপ সফলভাবে ইনস্টল হয়েছে!', 'success');
      document.getElementById('installBtn')?.classList.add('hidden');
    });
  }

  async promptInstall(deferredPrompt) {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    deferredPrompt = null;
  }

  // 🧹 Cleanup
  cleanup() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeyboard);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Cancel any ongoing audio
    if (this.currentAudio) {
      this.speechSynth.cancel();
    }
    
    // Disconnect observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Clear timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  // 📊 Analytics & Tracking (Privacy-focused)
  trackEvent(eventName, eventData = {}) {
    // Simple analytics tracking - could integrate with privacy-focused analytics
    console.log('Event:', eventName, eventData);
    
    // Store locally for insights
    const events = JSON.parse(localStorage.getItem(CONFIG.STORAGE_PREFIX + 'events') || '[]');
    events.push({
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem(CONFIG.STORAGE_PREFIX + 'events', JSON.stringify(events));
  }

  // 🎮 Quick Actions
  showEmergencyPhrases() {
    this.state.filters.category = 'emergency';
    this.navigateToSection('learn');
    this.trackEvent('quick_action', { type: 'emergency' });
  }

  showDailyConversation() {
    this.state.filters.category = 'daily';
    this.navigateToSection('learn');
    this.trackEvent('quick_action', { type: 'daily' });
  }

  showWorkplacePhrases() {
    this.state.filters.category = 'work';
    this.navigateToSection('learn');
    this.trackEvent('quick_action', { type: 'work' });
  }

  showTravelPhrases() {
    this.state.filters.category = 'travel';
    this.navigateToSection('learn');
    this.trackEvent('quick_action', { type: 'travel' });
  }

  showLanguageDetails(languageKey) {
    const language = LANGUAGES[languageKey];
    if (!language) return;
    
    // Create and show language details modal
    const modal = this.createLanguageDetailsModal(languageKey, language);
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('modal-visible'), 100);
    
    this.trackEvent('language_details_viewed', { language: languageKey });
  }

  createLanguageDetailsModal(languageKey, language) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const totalLearned = this.state.getTotalLearned(languageKey);
    const progress = this.state.getTodayProgress(languageKey);
    const streak = this.state.getStreak(languageKey);
    const progressPercentage = Math.round((totalLearned / language.wordCount) * 100);
    
    modal.innerHTML = `
      <div class="modal-content language-details-modal">
        <div class="modal-header">
          <div class="language-title">
            <span class="language-flag-large">${language.flag}</span>
            <div>
              <h2>${language.name}</h2>
              <p>${language.nativeName} • ${language.country}</p>
            </div>
          </div>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="language-stats-grid">
            <div class="stat-item">
              <div class="stat-number">${language.wordCount.toLocaleString()}</div>
              <div class="stat-label">মোট শব্দ</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${totalLearned}</div>
              <div class="stat-label">শিখেছি</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${progressPercentage}%</div>
              <div class="stat-label">সম্পূর্ণতা</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${streak}</div>
              <div class="stat-label">স্ট্রিক</div>
            </div>
          </div>
          
          <div class="language-info-sections">
            <div class="info-section">
              <h3>দেশের তথ্য</h3>
              <ul>
                <li><strong>জনসংখ্যা:</strong> ${language.population}</li>
                <li><strong>ধরন:</strong> ${language.type === 'schengen' ? 'শেনজেন দেশ' : 'নন-শেনজেন'}</li>
                <li><strong>কঠিনতা:</strong> ${
                  language.difficulty === 'beginner' ? 'সহজ' :
                  language.difficulty === 'intermediate' ? 'মধ্যম' : 'কঠিন'
                }</li>
              </ul>
            </div>
            
            <div class="info-section">
              <h3>শেখার তথ্য</h3>
              <ul>
                <li><strong>ক্যাটাগরি:</strong> ${language.categories}টি</li>
                <li><strong>অগ্রাধিকার:</strong> ${
                  language.priority === 'high' ? 'উচ্চ' :
                  language.priority === 'medium' ? 'মধ্যম' : 'নিম্ন'
                }</li>
                <li><strong>আজকের অগ্রগতি:</strong> ${progress.learned}/${progress.target}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="app.selectLanguage('${languageKey}'); this.closest('.modal-overlay').remove();">
            <span class="btn-icon">🚀</span>
            <span>শেখা শুরু করুন</span>
          </button>
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove();">
            বন্ধ করুন
          </button>
        </div>
      </div>
    `;
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  }

  // 🎯 Initial Data Loading
  async loadInitialData() {
    // Load popular languages data first
    const popularLanguages = Object.entries(LANGUAGES)
      .filter(([_, lang]) => lang.priority === 'high')
      .map(([key, _]) => key);
    
    // Pre-generate some data for popular languages
    for (const langKey of popularLanguages.slice(0, 3)) {
      const mockData = this.generateMockVocabularyData(langKey);
      this.state.vocabularyData.set(langKey, mockData.slice(0, 50)); // Load first 50 items
    }
  }

  // 🔄 Vocabulary Filtering
  filterVocabulary() {
    if (!this.state.currentLanguage) return;
    
    const vocabularyData = this.state.vocabularyData.get(this.state.currentLanguage);
    if (!vocabularyData) return;
    
    let filtered = [...vocabularyData];
    
    // Apply category filter
    if (this.state.filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === this.state.filters.category);
    }
    
    // Apply difficulty filter
    if (this.state.filters.difficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === this.state.filters.difficulty);
    }
    
    // Update display
    this.updateVocabularyDisplay(filtered);
  }
}

// 🌟 Global App Instance
const app = new SpeakEU();

// 🚀 Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(error => {
    console.error('Failed to start app:', error);
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
        <div>
          <h1>😔 অ্যাপ লোড করতে সমস্যা হয়েছে</h1>
          <p>দয়া করে পেজ রিফ্রেশ করুন অথবা পরে চেষ্টা করুন।</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
            রিফ্রেশ করুন
          </button>
        </div>
      </div>
    `;
  });
});

// 🧹 Cleanup on page unload
window.addEventListener('beforeunload', () => {
  app.cleanup();
});

// 🎯 Export for global use
window.SpeakEU = SpeakEU;
window.app = app;

// 🎨 Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes confetti-fall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 16px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  }
  
  .toast-visible {
    transform: translateX(0);
  }
  
  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .toast-success { border-left: 4px solid #22c55e; }
  .toast-error { border-left: 4px solid #ef4444; }
  .toast-warning { border-left: 4px solid #f59e0b; }
  .toast-info { border-left: 4px solid #3b82f6; }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .modal-visible {
    opacity: 1;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    transform: scale(0.95);
    transition: transform 0.3s ease;
  }
  
  .modal-visible .modal-content {
    transform: scale(1);
  }
  
  .highlighted {
    background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
    border-color: #f59e0b !important;
    animation: highlight-pulse 2s ease-out;
  }
  
  @keyframes highlight-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .scrolled {
    backdrop-filter: blur(10px);
    background: rgba(255,255,255,0.95) !important;
  }
  
  .dark-theme .scrolled {
    background: rgba(30,41,59,0.95) !important;
  }
  
  .font-small { font-size: 14px; }
  .font-medium { font-size: 16px; }
  .font-large { font-size: 18px; }
  
  .calendar-day {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    transition: all 0.2s ease;
  }
  
  .calendar-day.has-activity {
    background: var(--primary-500);
    color: white;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 16px;
  }
  
  .learning-interface.hidden {
    display: none;
  }
  
  .vocabulary-card.learned {
    opacity: 0.7;
    background: var(--success-bg);
  }
  
  .vocabulary-card.learned .mark-learned {
    background: var(--success);
    color: white;
  }
`;

document.head.appendChild(style);

console.log('🎉 Speak EU JavaScript loaded successfully!');
