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
