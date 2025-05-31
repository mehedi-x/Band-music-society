// 🎯 Speak EU - European Language Learning Platform
// Optimized Version - No Loading Issues
// For Bangladeshi Expatriates in Europe

'use strict';

console.log('🚀 Speak EU Starting...');

// 🌍 Global Configuration
const CONFIG = {
  APP_NAME: 'Speak EU',
  VERSION: '3.0.0',
  STORAGE_PREFIX: 'speak_eu_',
  DAILY_TARGET: 15,
  ANIMATION_DURATION: 300,
  SPEECH_LANG_MAP: {
    'de': 'de-DE', 'fr': 'fr-FR', 'it': 'it-IT', 'es': 'es-ES', 'ru': 'ru-RU',
    'pl': 'pl-PL', 'nl': 'nl-NL', 'pt': 'pt-PT', 'sv': 'sv-SE', 'da': 'da-DK',
    'no': 'nb-NO', 'fi': 'fi-FI', 'el': 'el-GR', 'cs': 'cs-CZ', 'sk': 'sk-SK',
    'hu': 'hu-HU', 'hr': 'hr-HR', 'sl': 'sl-SI', 'et': 'et-EE', 'lv': 'lv-LV',
    'lt': 'lt-LT', 'is': 'is-IS'
  }
};

// 🗺️ Complete Language Data (28 European Countries)
const LANGUAGES = {
  // 🔥 High Priority Countries
  germany: {
    code: 'de', name: 'জার্মান', nativeName: 'Deutsch', country: 'জার্মানি',
    flag: '🇩🇪', type: 'schengen', population: '83M', difficulty: 'intermediate',
    wordCount: 5284, categories: 23, priority: 'high', capital: 'বার্লিন'
  },
  france: {
    code: 'fr', name: 'ফরাসি', nativeName: 'Français', country: 'ফ্রান্স',
    flag: '🇫🇷', type: 'schengen', population: '68M', difficulty: 'intermediate',
    wordCount: 5156, categories: 23, priority: 'high', capital: 'প্যারিস'
  },
  italy: {
    code: 'it', name: 'ইতালিয়ান', nativeName: 'Italiano', country: 'ইতালি',
    flag: '🇮🇹', type: 'schengen', population: '60M', difficulty: 'beginner',
    wordCount: 4987, categories: 23, priority: 'high', capital: 'রোম'
  },
  spain: {
    code: 'es', name: 'স্প্যানিশ', nativeName: 'Español', country: 'স্পেন',
    flag: '🇪🇸', type: 'schengen', population: '47M', difficulty: 'beginner',
    wordCount: 5342, categories: 23, priority: 'high', capital: 'মাদ্রিদ'
  },
  netherlands: {
    code: 'nl', name: 'ডাচ', nativeName: 'Nederlands', country: 'নেদারল্যান্ডস',
    flag: '🇳🇱', type: 'schengen', population: '17M', difficulty: 'intermediate',
    wordCount: 4723, categories: 22, priority: 'high', capital: 'আমস্টার্ডাম'
  },
  poland: {
    code: 'pl', name: 'পোলিশ', nativeName: 'Polski', country: 'পোল্যান্ড',
    flag: '🇵🇱', type: 'schengen', population: '38M', difficulty: 'advanced',
    wordCount: 4432, categories: 22, priority: 'high', capital: 'ওয়ারশ'
  },
  russia: {
    code: 'ru', name: 'রুশ', nativeName: 'Русский', country: 'রাশিয়া',
    flag: '🇷🇺', type: 'non-schengen', population: '146M', difficulty: 'advanced',
    wordCount: 5678, categories: 23, priority: 'high', capital: 'মস্কো'
  },

  // 🟡 Medium Priority Countries
  belgium: {
    code: 'nl', name: 'ডাচ/ফরাসি', nativeName: 'Nederlands/Français', country: 'বেলজিয়াম',
    flag: '🇧🇪', type: 'schengen', population: '11M', difficulty: 'intermediate',
    wordCount: 4156, categories: 21, priority: 'medium', capital: 'ব্রাসেলস'
  },
  austria: {
    code: 'de', name: 'জার্মান', nativeName: 'Deutsch (Österreich)', country: 'অস্ট্রিয়া',
    flag: '🇦🇹', type: 'schengen', population: '9M', difficulty: 'intermediate',
    wordCount: 4892, categories: 21, priority: 'medium', capital: 'ভিয়েনা'
  },
  portugal: {
    code: 'pt', name: 'পর্তুগিজ', nativeName: 'Português', country: 'পর্তুগাল',
    flag: '🇵🇹', type: 'schengen', population: '10M', difficulty: 'intermediate',
    wordCount: 4567, categories: 21, priority: 'medium', capital: 'লিসবন'
  },
  greece: {
    code: 'el', name: 'গ্রিক', nativeName: 'Ελληνικά', country: 'গ্রিস',
    flag: '🇬🇷', type: 'schengen', population: '11M', difficulty: 'advanced',
    wordCount: 3987, categories: 20, priority: 'medium', capital: 'এথেন্স'
  },
  sweden: {
    code: 'sv', name: 'সুইডিশ', nativeName: 'Svenska', country: 'সুইডেন',
    flag: '🇸🇪', type: 'schengen', population: '10M', difficulty: 'intermediate',
    wordCount: 4234, categories: 20, priority: 'medium', capital: 'স্টকহোম'
  },
  norway: {
    code: 'no', name: 'নরওয়েজিয়ান', nativeName: 'Norsk', country: 'নরওয়ে',
    flag: '🇳🇴', type: 'schengen', population: '5M', difficulty: 'intermediate',
    wordCount: 4156, categories: 20, priority: 'medium', capital: 'অসলো'
  },
  denmark: {
    code: 'da', name: 'ডেনিশ', nativeName: 'Dansk', country: 'ডেনমার্ক',
    flag: '🇩🇰', type: 'schengen', population: '6M', difficulty: 'intermediate',
    wordCount: 3987, categories: 19, priority: 'medium', capital: 'কোপেনহেগেন'
  },
  czechia: {
    code: 'cs', name: 'চেক', nativeName: 'Čeština', country: 'চেক প্রজাতন্ত্র',
    flag: '🇨🇿', type: 'schengen', population: '11M', difficulty: 'advanced',
    wordCount: 3876, categories: 19, priority: 'medium', capital: 'প্রাগ'
  },

  // 🔵 Lower Priority Countries
  finland: {
    code: 'fi', name: 'ফিনিশ', nativeName: 'Suomi', country: 'ফিনল্যান্ড',
    flag: '🇫🇮', type: 'schengen', population: '6M', difficulty: 'advanced',
    wordCount: 3765, categories: 18, priority: 'low', capital: 'হেলসিঙ্কি'
  },
  slovakia: {
    code: 'sk', name: 'স্লোভাক', nativeName: 'Slovenčina', country: 'স্লোভাকিয়া',
    flag: '🇸🇰', type: 'schengen', population: '5M', difficulty: 'advanced',
    wordCount: 3654, categories: 18, priority: 'low', capital: 'ব্রাতিস্লাভা'
  },
  hungary: {
    code: 'hu', name: 'হাঙ্গেরিয়ান', nativeName: 'Magyar', country: 'হাঙ্গেরি',
    flag: '🇭🇺', type: 'schengen', population: '10M', difficulty: 'advanced',
    wordCount: 3543, categories: 17, priority: 'low', capital: 'বুদাপেস্ট'
  },
  slovenia: {
    code: 'sl', name: 'স্লোভেনিয়ান', nativeName: 'Slovenščina', country: 'স্লোভেনিয়া',
    flag: '🇸🇮', type: 'schengen', population: '2M', difficulty: 'advanced',
    wordCount: 3234, categories: 16, priority: 'low', capital: 'লুবলিয়ানা'
  },
  croatia: {
    code: 'hr', name: 'ক্রোয়েশিয়ান', nativeName: 'Hrvatski', country: 'ক্রোয়েশিয়া',
    flag: '🇭🇷', type: 'schengen', population: '4M', difficulty: 'advanced',
    wordCount: 3456, categories: 17, priority: 'low', capital: 'জাগ্রেব'
  },
  estonia: {
    code: 'et', name: 'এস্তোনিয়ান', nativeName: 'Eesti', country: 'এস্তোনিয়া',
    flag: '🇪🇪', type: 'schengen', population: '1M', difficulty: 'advanced',
    wordCount: 2987, categories: 15, priority: 'low', capital: 'তালিন'
  },
  latvia: {
    code: 'lv', name: 'লাটভিয়ান', nativeName: 'Latviešu', country: 'লাটভিয়া',
    flag: '🇱🇻', type: 'schengen', population: '2M', difficulty: 'advanced',
    wordCount: 3123, categories: 16, priority: 'low', capital: 'রিগা'
  },
  lithuania: {
    code: 'lt', name: 'লিথুয়ানিয়ান', nativeName: 'Lietuvių', country: 'লিথুয়ানিয়া',
    flag: '🇱🇹', type: 'schengen', population: '3M', difficulty: 'advanced',
    wordCount: 3234, categories: 16, priority: 'low', capital: 'ভিলনিউস'
  },
  luxembourg: {
    code: 'fr', name: 'ফরাসি/জার্মান', nativeName: 'Français/Deutsch', country: 'লুক্সেমবার্গ',
    flag: '🇱🇺', type: 'schengen', population: '0.6M', difficulty: 'intermediate',
    wordCount: 2876, categories: 14, priority: 'low', capital: 'লুক্সেমবার্গ'
  },
  malta: {
    code: 'en', name: 'মাল্টিজ/ইংরেজি', nativeName: 'Malti/English', country: 'মাল্টা',
    flag: '🇲🇹', type: 'schengen', population: '0.5M', difficulty: 'beginner',
    wordCount: 2456, categories: 13, priority: 'low', capital: 'ভ্যালেত্তা'
  },
  cyprus: {
    code: 'el', name: 'গ্রিক', nativeName: 'Ελληνικά (Κύπρος)', country: 'সাইপ্রাস',
    flag: '🇨🇾', type: 'schengen', population: '1M', difficulty: 'advanced',
    wordCount: 2789, categories: 14, priority: 'low', capital: 'নিকোসিয়া'
  },
  iceland: {
    code: 'is', name: 'আইসল্যান্ডিক', nativeName: 'Íslenska', country: 'আইসল্যান্ড',
    flag: '🇮🇸', type: 'schengen', population: '0.4M', difficulty: 'advanced',
    wordCount: 2234, categories: 12, priority: 'low', capital: 'রেইকিয়াভিক'
  },
  liechtenstein: {
    code: 'de', name: 'জার্মান', nativeName: 'Deutsch (Liechtenstein)', country: 'লিচেনস্টাইন',
    flag: '🇱🇮', type: 'schengen', population: '0.04M', difficulty: 'intermediate',
    wordCount: 1987, categories: 11, priority: 'low', capital: 'ভাদুৎস'
  }
};

// 📊 Learning Categories (23 Essential Categories)
const CATEGORIES = {
  emergency: { name: 'জরুরি অবস্থা', icon: '🚨', priority: 1, color: '#ff4757' },
  daily: { name: 'দৈনন্দিন কথোপকথন', icon: '💬', priority: 2, color: '#3742fa' },
  greetings: { name: 'শুভেচ্ছা ও পরিচয়', icon: '👋', priority: 3, color: '#2ed573' },
  work: { name: 'কাজ ও পেশা', icon: '💼', priority: 4, color: '#ff6348' },
  travel: { name: 'ভ্রমণ ও পরিবহন', icon: '✈️', priority: 5, color: '#ff7675' },
  accommodation: { name: 'থাকার ব্যবস্থা', icon: '🏨', priority: 6, color: '#a29bfe' },
  education: { name: 'শিক্ষা ও বিশ্ববিদ্যালয়', icon: '🎓', priority: 7, color: '#6c5ce7' },
  health: { name: 'স্বাস্থ্য ও চিকিৎসা', icon: '🏥', priority: 8, color: '#fd79a8' },
  shopping: { name: 'কেনাকাটা ও বাজার', icon: '🛍️', priority: 9, color: '#fdcb6e' },
  banking: { name: 'ব্যাংকিং ও আর্থিক', icon: '🏦', priority: 10, color: '#00b894' },
  government: { name: 'সরকারি কাজ', icon: '🏛️', priority: 11, color: '#00cec9' },
  legal: { name: 'আইনি বিষয়', icon: '⚖️', priority: 12, color: '#74b9ff' },
  numbers: { name: 'সংখ্যা ও সময়', icon: '🔢', priority: 13, color: '#0984e3' },
  food: { name: 'খাবার ও পানীয়', icon: '🍽️', priority: 14, color: '#e84393' },
  technology: { name: 'প্রযুক্তি ও ইন্টারনেট', icon: '💻', priority: 15, color: '#9b59b6' },
  weather: { name: 'আবহাওয়া ও প্রকৃতি', icon: '🌤️', priority: 16, color: '#f39c12' },
  family: { name: 'পরিবার ও সম্পর্ক', icon: '👨‍👩‍👧‍👦', priority: 17, color: '#e67e22' },
  hobbies: { name: 'শখ ও বিনোদন', icon: '🎮', priority: 18, color: '#27ae60' },
  sports: { name: 'খেলাধুলা ও ব্যায়াম', icon: '⚽', priority: 19, color: '#16a085' },
  culture: { name: 'সংস্কৃতি ও ঐতিহ্য', icon: '🎭', priority: 20, color: '#8e44ad' },
  directions: { name: 'দিকনির্দেশনা', icon: '🧭', priority: 21, color: '#2c3e50' },
  clothing: { name: 'পোশাক ও ফ্যাশন', icon: '👕', priority: 22, color: '#34495e' },
  body: { name: 'শরীর ও অঙ্গপ্রত্যঙ্গ', icon: '🧑‍⚕️', priority: 23, color: '#95a5a6' }
};

// 🎯 Simple Application State
class SimpleAppState {
  constructor() {
    this.currentLanguage = null;
    this.currentSection = 'home';
    this.vocabularyData = new Map();
    this.userProgress = new Map();
    this.favorites = new Set();
    this.settings = {
      theme: 'light',
      autoPlay: true,
      speechRate: 1,
      fontSize: 'medium'
    };
    this.isReady = false;
  }

  save() {
    try {
      const data = {
        currentLanguage: this.currentLanguage,
        userProgress: Array.from(this.userProgress.entries()),
        favorites: Array.from(this.favorites),
        settings: this.settings
      };
      localStorage.setItem(CONFIG.STORAGE_PREFIX + 'state', JSON.stringify(data));
    } catch (error) {
      console.warn('Save failed:', error);
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
      }
    } catch (error) {
      console.warn('Load failed:', error);
    }
  }

  updateProgress(languageKey, increment = 1) {
    const today = new Date().toDateString();
    const key = `${languageKey}_${today}`;
    const current = this.userProgress.get(key) || { learned: 0, target: CONFIG.DAILY_TARGET };
    current.learned += increment;
    this.userProgress.set(key, current);
    this.save();
    return current;
  }

  getTodayProgress(languageKey) {
    const today = new Date().toDateString();
    const key = `${languageKey}_${today}`;
    return this.userProgress.get(key) || { learned: 0, target: CONFIG.DAILY_TARGET };
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
}

// 🚀 Main Application Class (Simplified & Fast)
class SpeakEU {
  constructor() {
    console.log('🏗️ Creating Speak EU instance...');
    this.state = new SimpleAppState();
    this.speechSynth = window.speechSynthesis;
    this.currentAudio = null;
    this.searchTimeout = null;
  }

  // 🚀 Quick Initialize (No Loading Screen)
  async init() {
    try {
      console.log('🚀 Quick initialization starting...');
      
      // Load saved state immediately
      this.state.load();
      
      // Setup core functionality right away
      this.setupEventListeners();
      this.initializeNavigation();
      this.initializeSearch();
      this.initializeMobileMenu();
      this.initializeThemeToggle();
      
      // Load initial content
      this.loadHomeContent();
      
      // Apply saved settings
      this.applySettings();
      
      // Mark as ready
      this.state.isReady = true;
      
      console.log('✅ Speak EU ready!');
      
      // Show welcome message
      setTimeout(() => {
        this.showToast('স্বাগতম! Speak EU তে আপনাকে স্বাগত জানাই 🎉', 'success');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Quick init failed:', error);
      this.showError('অ্যাপ্লিকেশন লোড করতে সমস্যা। পেজ রিফ্রেশ করুন।');
    }
  }

  // 🎮 Event Listeners Setup
  setupEventListeners() {
    // Window events
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Network status
    window.addEventListener('online', () => this.showToast('অনলাইন সংযোগ পুনরায় স্থাপিত', 'success'));
    window.addEventListener('offline', () => this.showToast('অফলাইন মোডে কাজ করছে', 'warning'));
  }

  handleResize() {
    // Handle responsive changes
    this.updateMobileMenu();
  }

  handleScroll() {
    // Handle scroll animations
    this.updateScrollEffects();
  }

  handleKeyboard(e) {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          this.focusSearch();
          break;
        case 'h':
          e.preventDefault();
          this.navigateToSection('home');
          break;
      }
    }
  }

  // 🧭 Navigation System
  initializeNavigation() {
    // Desktop navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
      });
    });
    
    // Mobile navigation
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
        this.closeMobileMenu();
      });
    });
    
    // Quick action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
    
    // Browser back/forward
    window.addEventListener('popstate', (e) => {
      const section = e.state?.section || 'home';
      this.navigateToSection(section, false);
    });
  }

  navigateToSection(sectionName, pushState = true) {
    console.log(`📍 Navigate to: ${sectionName}`);
    
    this.state.currentSection = sectionName;
    this.state.save();
    
    if (pushState) {
      history.pushState({ section: sectionName }, '', `#${sectionName}`);
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-section') === sectionName);
    });
    
    // Show section
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
      targetSection.classList.add('active');
      this.loadSectionContent(sectionName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadSectionContent(sectionName) {
    switch (sectionName) {
      case 'home': this.loadHomeContent(); break;
      case 'languages': this.loadLanguagesContent(); break;
      case 'learn': this.loadLearningContent(); break;
      case 'progress': this.loadProgressContent(); break;
      case 'favorites': this.loadFavoritesContent(); break;
      case 'settings': this.loadSettingsContent(); break;
    }
  }

  handleQuickAction(action) {
    console.log(`⚡ Quick action: ${action}`);
    
    switch (action) {
      case 'start-learning': this.navigateToSection('learn'); break;
      case 'browse-languages': this.navigateToSection('languages'); break;
      case 'emergency': this.showQuickPhrases('emergency'); break;
      case 'daily': this.showQuickPhrases('daily'); break;
      case 'work': this.showQuickPhrases('work'); break;
      case 'travel': this.showQuickPhrases('travel'); break;
      case 'view-progress': this.navigateToSection('progress'); break;
      case 'open-favorites': this.navigateToSection('favorites'); break;
    }
  }

  // 🏠 Home Content
  loadHomeContent() {
    console.log('🏠 Loading home...');
    this.loadPopularLanguages();
    this.updateHomeStats();
    this.loadQuickActions();
  }

  loadPopularLanguages() {
    const container = document.getElementById('popularLanguagesGrid');
    if (!container) return;
    
    const popular = Object.entries(LANGUAGES)
      .filter(([_, lang]) => lang.priority === 'high')
      .slice(0, 6);
    
    container.innerHTML = popular.map(([key, lang]) => 
      this.createLanguageCard(key, lang, true)
    ).join('');
    
    // Add click handlers
    container.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const languageKey = card.getAttribute('data-language');
        this.selectLanguage(languageKey);
      });
    });
  }

  updateHomeStats() {
    const totalWords = Object.values(LANGUAGES).reduce((sum, lang) => sum + lang.wordCount, 0);
    const totalCountries = Object.keys(LANGUAGES).length;
    const totalCategories = Object.keys(CATEGORIES).length;
    
    // Update displays safely
    this.updateElement('.stat-countries .stat-number', totalCountries);
    this.updateElement('.stat-words .stat-number', (totalWords / 1000).toFixed(0) + 'K+');
    this.updateElement('.stat-categories .stat-number', totalCategories);
  }

  loadQuickActions() {
    const container = document.getElementById('quickActionsGrid');
    if (!container) return;
    
    const actions = [
      { action: 'emergency', icon: '🚨', title: 'জরুরি অবস্থা', desc: 'জরুরি পরিস্থিতির জন্য' },
      { action: 'daily', icon: '💬', title: 'দৈনন্দিন কথা', desc: 'প্রতিদিনের কথোপকথন' },
      { action: 'work', icon: '💼', title: 'কাজের ভাষা', desc: 'অফিস ও কর্মক্ষেত্রে' },
      { action: 'travel', icon: '✈️', title: 'ভ্রমণ', desc: 'যাতায়াত ও ভ্রমণে' }
    ];
    
    container.innerHTML = actions.map(action => `
      <div class="quick-action-card" data-action="${action.action}">
        <div class="action-icon">${action.icon}</div>
        <div class="action-content">
          <h3>${action.title}</h3>
          <p>${action.desc}</p>
        </div>
      </div>
    `).join('');
    
    container.querySelectorAll('.quick-action-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
  }

  // 🌍 Languages Content
  loadLanguagesContent() {
    console.log('🌍 Loading languages...');
    this.renderLanguagesGrid();
    this.setupLanguageFilters();
    this.setupLanguageSearch();
  }

  setupLanguageFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        this.filterLanguages(filter);
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
      }, 300);
    });
  }

  filterLanguages(filter) {
    const languages = Object.entries(LANGUAGES);
    let filtered = languages;
    
    if (filter === 'popular') {
      filtered = languages.filter(([_, lang]) => lang.priority === 'high');
    } else if (filter !== 'all') {
      filtered = languages.filter(([_, lang]) => lang.type === filter);
    }
    
    this.renderLanguagesGrid(filtered);
  }

  searchLanguages(query) {
    if (!query.trim()) {
      this.renderLanguagesGrid();
      return;
    }
    
    const filtered = Object.entries(LANGUAGES).filter(([_, lang]) => 
      lang.name.toLowerCase().includes(query.toLowerCase()) ||
      lang.country.toLowerCase().includes(query.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(query.toLowerCase())
    );
    
    this.renderLanguagesGrid(filtered);
  }

  renderLanguagesGrid(languageList = null) {
    const container = document.getElementById('languagesGrid');
    if (!container) return;
    
    const languages = languageList || Object.entries(LANGUAGES);
    
    // Sort by priority
    languages.sort((a, b) => {
      const order = { high: 1, medium: 2, low: 3 };
      return order[a[1].priority] - order[b[1].priority];
    });
    
    if (languages.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>কোন ফলাফল পাওয়া যায়নি</h3>
          <p>আপনার সার্চ পরিবর্তন করে চেষ্টা করুন</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = languages.map(([key, lang]) => 
      this.createLanguageCard(key, lang, false)
    ).join('');
    
    // Add click handlers
    container.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const languageKey = card.getAttribute('data-language');
        this.selectLanguage(languageKey);
      });
    });
  }

  createLanguageCard(languageKey, language, isCompact = false) {
    const totalLearned = this.state.getTotalLearned(languageKey);
    const progressPercentage = Math.round((totalLearned / language.wordCount) * 100);
    
    const difficultyColors = { beginner: '#2ed573', intermediate: '#ffa502', advanced: '#ff4757' };
    const difficultyTexts = { beginner: 'সহজ', intermediate: 'মধ্যম', advanced: 'কঠিন' };
    
    return `
      <div class="language-card ${isCompact ? 'compact' : ''}" data-language="${languageKey}">
        <div class="language-header">
          <div class="language-flag">${language.flag}</div>
          <div class="language-info">
            <h3 class="language-name">${language.name}</h3>
            <p class="language-native">${language.nativeName}</p>
            <p class="language-country">${language.country}</p>
            ${!isCompact ? `<p class="language-capital">রাজধানী: ${language.capital}</p>` : ''}
          </div>
          ${language.priority === 'high' ? '<div class="priority-badge">জনপ্রিয়</div>' : ''}
        </div>
        
        ${!isCompact ? `
        <div class="language-stats">
          <div class="stat-row">
            <span class="stat-icon">👥</span>
            <span>জনসংখ্যা: ${language.population}</span>
          </div>
          <div class="stat-row">
            <span class="stat-icon">📚</span>
            <span>শব্দ: ${language.wordCount.toLocaleString()}</span>
          </div>
          <div class="stat-row">
            <span class="stat-icon">📊</span>
            <span style="color: ${difficultyColors[language.difficulty]}">
              ${difficultyTexts[language.difficulty]}
            </span>
          </div>
        </div>
        ` : ''}
        
        ${totalLearned > 0 ? `
        <div class="progress-section">
          <div class="progress-info">
            <span>অগ্রগতি: ${progressPercentage}%</span>
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
          <button class="btn btn-primary btn-small" onclick="app.selectLanguage('${languageKey}')">
            <span class="btn-icon">🚀</span>
            <span>শিখুন</span>
          </button>
          ${!isCompact ? `
          <button class="btn btn-outline btn-small" onclick="app.showLanguageDetails('${languageKey}')">
            <span class="btn-icon">ℹ️</span>
            <span>বিস্তারিত</span>
          </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 📚 Learning System
  loadLearningContent() {
    console.log('📚 Loading learning...');
    this.setupLanguageSelection();
    
    if (this.state.currentLanguage) {
      this.loadLanguageContent(this.state.currentLanguage);
    }
  }

  setupLanguageSelection() {
    const select = document.getElementById('languageSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">ভাষা নির্বাচন করুন...</option>' +
      Object.entries(LANGUAGES)
        .sort((a, b) => {
          const order = { high: 1, medium: 2, low: 3 };
          return order[a[1].priority] - order[b[1].priority];
        })
        .map(([key, lang]) => 
          `<option value="${key}">${lang.flag} ${lang.name} (${lang.country})</option>`
        ).join('');
    
    if (this.state.currentLanguage) {
      select.value = this.state.currentLanguage;
    }
    
    select.addEventListener('change', (e) => {
      if (e.target.value) {
        this.selectLanguage(e.target.value);
      }
    });
  }

  async selectLanguage(languageKey) {
    try {
      console.log(`🎯 Selecting: ${languageKey}`);
      
      this.state.currentLanguage = languageKey;
      this.state.save();
      
      const select = document.getElementById('languageSelect');
      if (select) select.value = languageKey;
      
      await this.loadLanguageContent(languageKey);
      
      if (this.state.currentSection !== 'learn') {
        this.navigateToSection('learn');
      }
      
      const language = LANGUAGES[languageKey];
      this.showToast(`${language.name} ভাষা নির্বাচিত হয়েছে`, 'success');
      
    } catch (error) {
      console.error('Select language failed:', error);
      this.showToast('ভাষা নির্বাচনে সমস্যা', 'error');
    }
  }

  async loadLanguageContent(languageKey) {
    const language = LANGUAGES[languageKey];
    if (!language) return;
    
    try {
      console.log(`📖 Loading: ${language.name}`);
      
      // Generate vocabulary if not exists
      if (!this.state.vocabularyData.has(languageKey)) {
        const vocab = this.generateVocabularyData(languageKey);
        this.state.vocabularyData.set(languageKey, vocab);
      }
      
      const vocab = this.state.vocabularyData.get(languageKey);
      this.updateLearningInterface(languageKey, language, vocab);
      this.showLearningInterface();
      
    } catch (error) {
      console.error('Load language content failed:', error);
      this.showToast('ভাষার ডেটা লোড করতে সমস্যা', 'error');
    }
  }

  generateVocabularyData(languageKey) {
    const language = LANGUAGES[languageKey];
    const vocab = [];
    
    // Generate for each category
    Object.keys(CATEGORIES).forEach(categoryKey => {
      const category = CATEGORIES[categoryKey];
      const count = Math.min(20, Math.floor(language.wordCount / Object.keys(CATEGORIES).length));
      
      for (let i = 0; i < count; i++) {
        vocab.push({
          id: `${languageKey}_${categoryKey}_${i}`,
          category: categoryKey,
          difficulty: this.getRandomDifficulty(),
          [language.code]: this.getMockPhrase(language.code, categoryKey, i),
          bn: this.getMockBengali(categoryKey, i),
          en: this.getMockEnglish(categoryKey, i),
          pronunciation: `[${language.code} pronunciation]`,
          priority: category.priority
        });
      }
    });
    
    // Sort by priority
    vocab.sort((a, b) => a.priority - b.priority);
    
    console.log(`✅ Generated ${vocab.length} items for ${language.name}`);
    return vocab;
  }

  getRandomDifficulty() {
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  getMockPhrase(langCode, category, index) {
    const phrases = {
      de: {
        emergency: ['Hilfe!', 'Polizei rufen!', 'Arzt brauchen', 'Feuer!', 'Notfall!'],
        daily: ['Guten Tag', 'Wie geht es?', 'Danke', 'Bitte', 'Entschuldigung'],
        work: ['Ich arbeite', 'Mein Beruf', 'Büro', 'Termin', 'Hilfe brauchen']
      },
      fr: {
        emergency: ['Au secours!', 'Police!', 'Médecin', 'Feu!', 'Urgence!'],
        daily: ['Bonjour', 'Comment allez-vous?', 'Merci', 'De rien', 'Excusez-moi'],
        work: ['Je travaille', 'Mon métier', 'Bureau', 'Rendez-vous', 'Aide']
      }
    };
    
    const langPhrases = phrases[langCode] || phrases.de;
    const catPhrases = langPhrases[category] || langPhrases.daily;
    return catPhrases[index % catPhrases.length] || `Phrase ${index + 1}`;
  }

  getMockBengali(category, index) {
    const bengali = {
      emergency: ['সাহায্য!', 'পুলিশ ডাকুন!', 'ডাক্তার দরকার', 'আগুন!', 'জরুরি!'],
      daily: ['শুভ দিন', 'কেমন আছেন?', 'ধন্যবাদ', 'স্বাগতম', 'দুঃখিত'],
      work: ['আমি কাজ করি', 'আমার পেশা', 'অফিস', 'অ্যাপয়েন্টমেন্ট', 'সাহায্য']
    };
    
    const phrases = bengali[category] || bengali.daily;
    return phrases[index % phrases.length] || `বাংলা ${index + 1}`;
  }

  getMockEnglish(category, index) {
    const english = {
      emergency: ['Help!', 'Call police!', 'Need doctor', 'Fire!', 'Emergency!'],
      daily: ['Good day', 'How are you?', 'Thank you', 'Welcome', 'Sorry'],
      work: ['I work', 'My profession', 'Office', 'Appointment', 'Help']
    };
    
    const phrases = english[category] || english.daily;
    return phrases[index % phrases.length] || `English ${index + 1}`;
  }

  updateLearningInterface(languageKey, language, vocab) {
    // Update language header
    this.updateElement('#currentLanguageFlag', language.flag);
    this.updateElement('#currentLanguageName', `${language.name} (${language.nativeName})`);
    this.updateElement('#currentLanguageInfo', `${language.country} • ${language.population} জনসংখ্যা`);
    
    // Setup category filter
    this.setupCategoryFilter();
    
    // Display vocabulary
    this.displayVocabulary(vocab.slice(0, 20));
    
    // Update progress
    this.updateLearningStats(languageKey);
    
    // Setup controls
    this.setupLearningControls();
  }

  setupCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;
    
    filter.innerHTML = '<option value="all">সব ক্যাটাগরি</option>' +
      Object.entries(CATEGORIES)
        .sort((a, b) => a[1].priority - b[1].priority)
        .map(([key, cat]) => `<option value="${key}">${cat.icon} ${cat.name}</option>`)
        .join('');
    
    filter.addEventListener('change', () => this.filterVocabulary());
  }

  setupLearningControls() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.filterVocabulary());
    }
    
    // Shuffle button
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => this.shuffleVocabulary());
    }
  }

  displayVocabulary(vocab) {
    const container = document.getElementById('vocabularyList');
    if (!container) return;
    
    container.innerHTML = vocab.map(item => this.createVocabularyCard(item)).join('');
    
    // Add event listeners
    container.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn.dataset.id);
      });
    });
    
    container.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playAudio(btn.dataset.id);
      });
    });
    
    container.querySelectorAll('.mark-learned').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.markAsLearned(btn.dataset.id);
      });
    });
  }

  createVocabularyCard(item) {
    const language = LANGUAGES[this.state.currentLanguage];
    const category = CATEGORIES[item.category];
    const isFavorite = this.state.favorites.has(item.id);
    
    const difficultyColors = { beginner: '#2ed573', intermediate: '#ffa502', advanced: '#ff4757' };
    const difficultyTexts = { beginner: 'সহজ', intermediate: 'মধ্যম', advanced: 'কঠিন' };
    
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
              ${isFavorite ? '❤️' : '🤍'}
            </button>
            <button class="vocab-btn audio-btn" data-id="${item.id}" title="উচ্চারণ শুনুন">
              🔊
            </button>
          </div>
        </div>
        
        <div class="vocabulary-content">
          <div class="original-phrase">
            <div class="phrase-text">${item[language.code]}</div>
            <div class="pronunciation">${item.pronunciation}</div>
          </div>
          
          <div class="translations">
            <div class="bengali-translation">
              <strong>বাংলা:</strong> ${item.bn}
            </div>
            <div class="english-translation">
              <strong>English:</strong> ${item.en}
            </div>
          </div>
          
          <div class="vocabulary-footer">
            <div class="difficulty-badge" style="background: ${difficultyColors[item.difficulty]}20; color: ${difficultyColors[item.difficulty]}">
              ${difficultyTexts[item.difficulty]}
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

  filterVocabulary() {
    if (!this.state.currentLanguage) return;
    
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter?.value || 'all';
    
    const vocab = this.state.vocabularyData.get(this.state.currentLanguage);
    if (!vocab) return;
    
    let filtered = vocab;
    if (selectedCategory !== 'all') {
      filtered = vocab.filter(item => item.category === selectedCategory);
    }
    
    this.displayVocabulary(filtered.slice(0, 20));
  }

  shuffleVocabulary() {
    if (!this.state.currentLanguage) return;
    
    const vocab = this.state.vocabularyData.get(this.state.currentLanguage);
    if (!vocab) return;
    
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    this.displayVocabulary(shuffled.slice(0, 20));
    
    this.showToast('শব্দগুলি এলোমেলো করা হয়েছে', 'info');
  }

  updateLearningStats(languageKey) {
    const progress = this.state.getTodayProgress(languageKey);
    const totalLearned = this.state.getTotalLearned(languageKey);
    
    this.updateElement('#todayLearned', progress.learned);
    this.updateElement('#totalLearned', totalLearned);
    this.updateElement('#todayProgress', progress.learned);
  }

  showLearningInterface() {
    const selection = document.getElementById('languageSelection');
    const interface = document.getElementById('learningInterface');
    
    if (selection) selection.classList.add('hidden');
    if (interface) interface.classList.remove('hidden');
  }

  // 🎵 Audio System
  async playAudio(itemId) {
    try {
      const vocab = this.state.vocabularyData.get(this.state.currentLanguage);
      const item = vocab?.find(v => v.id === itemId);
      if (!item) return;
      
      const language = LANGUAGES[this.state.currentLanguage];
      const text = item[language.code];
      const langCode = CONFIG.SPEECH_LANG_MAP[language.code] || 'en-US';
      
      // Stop current audio
      if (this.currentAudio) {
        this.speechSynth.cancel();
      }
      
      // Create speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = this.state.settings.speechRate || 1;
      
      // Visual feedback
      const audioBtn = document.querySelector(`[data-id="${itemId}"].audio-btn`);
      if (audioBtn) {
        audioBtn.innerHTML = '⏸️';
        audioBtn.classList.add('playing');
      }
      
      utterance.onend = () => {
        if (audioBtn) {
          audioBtn.innerHTML = '🔊';
          audioBtn.classList.remove('playing');
        }
      };
      
      utterance.onerror = () => {
        if (audioBtn) {
          audioBtn.innerHTML = '🔊';
          audioBtn.classList.remove('playing');
        }
        this.showToast('অডিও প্লে করতে সমস্যা', 'error');
      };
      
      this.speechSynth.speak(utterance);
      this.currentAudio = utterance;
      
    } catch (error) {
      console.error('Audio play failed:', error);
      this.showToast('অডিও প্লে করতে সমস্যা', 'error');
    }
  }

  // 💖 Favorites System
  toggleFavorite(itemId) {
    if (this.state.favorites.has(itemId)) {
      this.state.favorites.delete(itemId);
    } else {
      this.state.favorites.add(itemId);
    }
    
    this.state.save();
    this.updateFavoriteButton(itemId);
  }

  updateFavoriteButton(itemId) {
    const btn = document.querySelector(`[data-id="${itemId}"].favorite-btn`);
    if (!btn) return;
    
    const isFavorite = this.state.favorites.has(itemId);
    btn.classList.toggle('active', isFavorite);
    btn.innerHTML = isFavorite ? '❤️' : '🤍';
  }

  // 📈 Progress Tracking
  markAsLearned(itemId) {
    this.state.updateProgress(this.state.currentLanguage, 1);
    
    const btn = document.querySelector(`[data-id="${itemId}"].mark-learned`);
    if (btn) {
      btn.classList.add('learned');
      btn.innerHTML = '<span class="btn-icon">✅</span><span>শিখেছি!</span>';
      btn.disabled = true;
    }
    
    const card = document.querySelector(`[data-id="${itemId}"]`);
    if (card) card.classList.add('learned');
    
    this.updateLearningStats(this.state.currentLanguage);
    
    const progress = this.state.getTodayProgress(this.state.currentLanguage);
    if (progress.learned >= progress.target) {
      this.showToast('🎉 আজকের লক্ষ্য পূরণ হয়েছে!', 'success');
    }
  }

  // 🔍 Search System
  initializeSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const globalSearch = document.getElementById('globalSearch');
    const searchInput = document.getElementById('globalSearchInput');
    const searchClose = document.getElementById('searchClose');
    
    if (searchToggle) {
      searchToggle.addEventListener('click', () => {
        globalSearch?.classList.toggle('hidden');
        if (!globalSearch?.classList.contains('hidden')) {
          searchInput?.focus();
        }
      });
    }
    
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        globalSearch?.classList.add('hidden');
        if (searchInput) searchInput.value = '';
      });
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performGlobalSearch(e.target.value);
        }, 300);
      });
    }
  }

  performGlobalSearch(query) {
    // Simple search implementation
    if (!query.trim()) return;
    
    this.showToast(`সার্চ করা হচ্ছে: "${query}"`, 'info');
    
    // In a full implementation, this would search across all vocabulary
    console.log(`🔍 Searching for: ${query}`);
  }

  focusSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const globalSearch = document.getElementById('globalSearch');
    
    if (globalSearch) globalSearch.classList.remove('hidden');
    if (searchInput) searchInput.focus();
  }

  // 📱 Mobile Menu
  initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.closeMobileMenu());
    }
  }

  toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu && overlay) {
      const isOpen = menu.classList.contains('open');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.classList.add('menu-open');
  }

  closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
  }

  updateMobileMenu() {
    // Update mobile menu based on screen size
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  // 🎨 Theme System
  initializeThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    toggle.addEventListener('click', () => this.toggleTheme());
    
    // Apply saved theme
    this.applyTheme(this.state.settings.theme);
  }

  toggleTheme() {
    const newTheme = this.state.settings.theme === 'light' ? 'dark' : 'light';
    this.state.settings.theme = newTheme;
    this.state.save();
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  applySettings() {
    this.applyTheme(this.state.settings.theme);
    
    // Apply other settings
    if (this.state.settings.fontSize) {
      document.body.classList.add(`font-${this.state.settings.fontSize}`);
    }
  }

  // 📊 Progress Content
  loadProgressContent() {
    console.log('📊 Loading progress...');
    this.updateProgressStats();
    this.updateProgressCharts();
  }

  updateProgressStats() {
    if (!this.state.currentLanguage) return;
    
    const progress = this.state.getTodayProgress(this.state.currentLanguage);
    const totalLearned = this.state.getTotalLearned(this.state.currentLanguage);
    
    this.updateElement('#progressTodayLearned', progress.learned);
    this.updateElement('#progressTotalLearned', totalLearned);
    this.updateElement('#progressDailyTarget', progress.target);
    
    const percentage = Math.round((progress.learned / progress.target) * 100);
    this.updateElement('#progressPercentage', `${percentage}%`);
    
    const progressBar = document.querySelector('.progress-bar .progress-fill');
    if (progressBar) {
      progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }
  }

  updateProgressCharts() {
    // Simple progress visualization
    const container = document.getElementById('progressCharts');
    if (!container) return;
    
    container.innerHTML = `
      <div class="progress-chart">
        <h3>আজকের অগ্রগতি</h3>
        <p>আপনি আজ ${this.state.getTodayProgress(this.state.currentLanguage || 'germany').learned} টি শব্দ শিখেছেন</p>
      </div>
    `;
  }

  // ❤️ Favorites Content
  loadFavoritesContent() {
    console.log('❤️ Loading favorites...');
    this.displayFavorites();
  }

  displayFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    if (this.state.favorites.size === 0) {
      container.innerHTML = `
        <div class="no-favorites">
          <div class="no-favorites-icon">💔</div>
          <h3>কোন পছন্দের শব্দ নেই</h3>
          <p>শব্দ শিখার সময় ❤️ বাটনে ক্লিক করে পছন্দের তালিকায় যোগ করুন</p>
        </div>
      `;
      return;
    }
    
    // Display favorite items
    const favoriteItems = [];
    for (const [languageKey, vocab] of this.state.vocabularyData) {
      vocab.forEach(item => {
        if (this.state.favorites.has(item.id)) {
          favoriteItems.push({ ...item, languageKey });
        }
      });
    }
    
    container.innerHTML = favoriteItems.map(item => {
      const language = LANGUAGES[item.languageKey];
      return this.createVocabularyCard(item);
    }).join('');
  }

  // ⚙️ Settings Content
  loadSettingsContent() {
    console.log('⚙️ Loading settings...');
    this.setupSettingsControls();
  }

  setupSettingsControls() {
    // Theme setting
    const themeSelect = document.getElementById('settingsTheme');
    if (themeSelect) {
      themeSelect.value = this.state.settings.theme;
      themeSelect.addEventListener('change', (e) => {
        this.state.settings.theme = e.target.value;
        this.state.save();
        this.applyTheme(e.target.value);
      });
    }
    
    // Speech rate setting
    const speechRate = document.getElementById('settingsSpeechRate');
    if (speechRate) {
      speechRate.value = this.state.settings.speechRate;
      speechRate.addEventListener('change', (e) => {
        this.state.settings.speechRate = parseFloat(e.target.value);
        this.state.save();
      });
    }
    
    // Font size setting
    const fontSize = document.getElementById('settingsFontSize');
    if (fontSize) {
      fontSize.value = this.state.settings.fontSize;
      fontSize.addEventListener('change', (e) => {
        this.state.settings.fontSize = e.target.value;
        this.state.save();
        this.applySettings();
      });
    }
  }

  // 🚨 Quick Phrases
  showQuickPhrases(category) {
    console.log(`🚨 Showing quick phrases for: ${category}`);
    
    // Create modal with quick phrases
    const modal = this.createQuickPhrasesModal(category);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeQuickPhrasesModal(modal);
      }
    });
  }

  createQuickPhrasesModal(category) {
    const cat = CATEGORIES[category];
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const quickPhrases = this.getQuickPhrasesForCategory(category);
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${cat.icon} ${cat.name}</h2>
          <button class="modal-close" onclick="app.closeQuickPhrasesModal(this.closest('.modal-overlay'))">&times;</button>
        </div>
        <div class="modal-body">
          <div class="quick-phrases-list">
            ${quickPhrases.map(phrase => `
              <div class="quick-phrase-item">
                <div class="phrase-original">${phrase.text}</div>
                <div class="phrase-bengali">${phrase.bengali}</div>
                <button class="btn btn-small btn-outline" onclick="app.playQuickPhrase('${phrase.text}')">
                  🔊 শুনুন
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  getQuickPhrasesForCategory(category) {
    const phrases = {
      emergency: [
        { text: 'Help!', bengali: 'সাহায্য!' },
        { text: 'Call the police!', bengali: 'পুলিশ ডাকুন!' },
        { text: 'I need a doctor', bengali: 'আমার ডাক্তার দরকার' },
        { text: 'Where is the hospital?', bengali: 'হাসপাতাল কোথায়?' },
        { text: 'I don\'t understand', bengali: 'আমি বুঝতে পারছি না' }
      ],
      daily: [
        { text: 'Hello', bengali: 'হ্যালো' },
        { text: 'Thank you', bengali: 'ধন্যবাদ' },
        { text: 'Excuse me', bengali: 'দুঃখিত' },
        { text: 'How much?', bengali: 'কত দাম?' },
        { text: 'Where is the toilet?', bengali: 'টয়লেট কোথায়?' }
      ],
      work: [
        { text: 'I work here', bengali: 'আমি এখানে কাজ করি' },
        { text: 'Can you help me?', bengali: 'আপনি কি সাহায্য করতে পারেন?' },
        { text: 'Where is the office?', bengali: 'অফিস কোথায়?' },
        { text: 'I have an appointment', bengali: 'আমার অ্যাপয়েন্টমেন্ট আছে' },
        { text: 'I am new here', bengali: 'আমি এখানে নতুন' }
      ],
      travel: [
        { text: 'Where is the station?', bengali: 'স্টেশন কোথায়?' },
        { text: 'How much is the ticket?', bengali: 'টিকেটের দাম কত?' },
        { text: 'What time does it leave?', bengali: 'কখন ছাড়বে?' },
        { text: 'Is this the right way?', bengali: 'এটা কি সঠিক পথ?' },
        { text: 'I am lost', bengali: 'আমি হারিয়ে গেছি' }
      ]
    };
    
    return phrases[category] || phrases.daily;
  }

  playQuickPhrase(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    this.speechSynth.speak(utterance);
  }

  closeQuickPhrasesModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }

  // 🛠️ Utility Functions
  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  updateScrollEffects() {
    // Add scroll-based animations
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  }

  showLanguageDetails(languageKey) {
    const language = LANGUAGES[languageKey];
    this.showToast(`${language.name} ভাষার বিস্তারিত তথ্য দেখানো হবে`, 'info');
    console.log(`ℹ️ Showing details for: ${language.name}`);
  }

  // 🎯 Toast Notification System
  showToast(message, type = 'info', duration = 3000) {
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
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    // Add to page
    const container = document.getElementById('toastContainer') || this.createToastContainer();
    container.appendChild(toast);
    
    // Show animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  showError(message) {
    this.showToast(message, 'error', 5000);
  }

  // 🌟 Additional Features
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 📱 PWA Features (Basic)
  initializePWA() {
    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ SW registered:', registration);
        })
        .catch(error => {
          console.log('❌ SW registration failed:', error);
        });
    }
    
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.showInstallPrompt(e);
    });
  }

  showInstallPrompt(e) {
    setTimeout(() => {
      this.showToast('এই অ্যাপটি আপনার ফোনে ইনস্টল করুন! 📱', 'info', 5000);
      
      // Create install button
      const installBtn = document.createElement('button');
      installBtn.textContent = 'ইনস্টল করুন';
      installBtn.className = 'btn btn-primary install-btn';
      installBtn.onclick = () => {
        e.prompt();
        e.userChoice.then(result => {
          if (result.outcome === 'accepted') {
            this.showToast('অ্যাপ ইনস্টল হচ্ছে...', 'success');
          }
        });
      };
      
      document.body.appendChild(installBtn);
      
      setTimeout(() => {
        if (installBtn.parentNode) {
          installBtn.parentNode.removeChild(installBtn);
        }
      }, 10000);
    }, 5000);
  }
}

// 🚀 Initialize Application
console.log('🌟 Creating Speak EU app...');

const app = new SpeakEU();

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, starting app...');
    app.init();
  });
} else {
  console.log('📄 DOM already ready, starting app...');
  app.init();
}

// Global error handler
window.addEventListener('error', (e) => {
  console.error('💥 Global error:', e.error);
  
  // Show user-friendly error
  if (app && app.showError) {
    app.showError('কিছু একটা সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।');
  } else {
    // Fallback error display
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #ff4757; color: white; padding: 15px; border-radius: 8px; z-index: 10000;">
        ❌ কিছু একটা সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।
      </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
});

console.log('✅ Speak EU app.js loaded successfully!');

// Export for global access
window.app = app;
