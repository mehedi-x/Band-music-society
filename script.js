// 🌟 Speak EU - Advanced Language Learning Platform
// Version 2.0 - Enhanced with all features

// 🔧 Global Configuration
const CONFIG = {
  version: '2.0',
  defaultLanguage: '',
  defaultDailyGoal: 10,
  audioEnabled: true,
  autoPlay: false,
  audioSpeed: 1.0,
  audioVolume: 0.8,
  animationsEnabled: true,
  compactMode: false,
  showPhonetics: true,
  
  // Spaced Repetition Settings
  spacedRepetition: {
    easyInterval: 4,      // days
    normalInterval: 1,    // days
    hardInterval: 0.5,    // days
    maxInterval: 30       // days
  },
  
  // Categories mapping
  categories: {
    basic: 'Basic (1-500)',
    intermediate: 'Intermediate (501-1000)',
    advanced: 'Advanced (1001+)',
    greetings: 'Greetings',
    numbers: 'Numbers',
    food: 'Food & Dining',
    travel: 'Travel',
    work: 'Work',
    health: 'Health',
    family: 'Family',
    emergency: 'Emergency'
  }
};

// 🗺️ Language Code Mapping
const langCodeMap = {
  austria: 'de', belgium: 'nl', czech: 'cs', denmark: 'da', estonia: 'et',
  finland: 'fi', france: 'fr', germany: 'de', greece: 'el', hungary: 'hu',
  iceland: 'is', italy: 'it', latvia: 'lv', liechtenstein: 'de', lithuania: 'lt',
  luxembourg: 'lb', malta: 'mt', netherlands: 'nl', norway: 'no', poland: 'pl',
  portugal: 'pt', slovakia: 'sk', slovenia: 'sl', spain: 'es', sweden: 'sv',
  switzerland: 'de', russian: 'ru', albania: 'sq', andorra: 'ca', armenia: 'hy',
  azerbaijan: 'az', bosnia: 'bs', bulgaria: 'bg', croatia: 'hr', cyprus: 'el',
  georgia: 'ka', ireland: 'en', kosovo: 'sq', moldova: 'ro', monaco: 'fr',
  montenegro: 'sr', northmacedonia: 'mk', romania: 'ro', sanmarino: 'it',
  serbia: 'sr', turkey: 'tr', ukraine: 'uk', unitedkingdom: 'en', vatican: 'la'
};

// 🎯 Application State
let appState = {
  currentLanguage: '',
  currentVocabulary: [],
  filteredVocabulary: [],
  searchQuery: '',
  selectedCategory: '',
  currentPage: 1,
  itemsPerPage: 20,
  
  // User Progress
  learnedWords: new Set(),
  favoriteWords: new Set(),
  wordProgress: new Map(),
  dailyStats: new Map(),
  weeklyStats: [],
  currentStreak: 0,
  lastStudyDate: null,
  
  // Settings
  dailyGoal: CONFIG.defaultDailyGoal,
  audioEnabled: CONFIG.audioEnabled,
  autoPlay: CONFIG.autoPlay,
  audioSpeed: CONFIG.audioSpeed,
  
  // UI State
  showProgress: false,
  showFavorites: false,
  isLoading: false
};

// 🔊 Audio System
class AudioManager {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
  }

  async speak(text, language = 'en', speed = 1.0, volume = 0.8) {
    if (!appState.audioEnabled || !this.synthesis) return;

    try {
      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = speed;
      utterance.volume = volume;
      utterance.pitch = 1;

      utterance.onstart = () => {
        this.isPlaying = true;
        this.addAudioIndicator();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.removeAudioIndicator();
      };

      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
        this.isPlaying = false;
        this.removeAudioIndicator();
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);

    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  stop() {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.removeAudioIndicator();
    }
  }

  getLanguageCode(language) {
    const codes = {
      'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
      'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'el': 'el-GR',
      'nl': 'nl-NL', 'sv': 'sv-SE', 'da': 'da-DK', 'no': 'no-NO',
      'fi': 'fi-FI', 'pl': 'pl-PL', 'cs': 'cs-CZ', 'sk': 'sk-SK',
      'hu': 'hu-HU', 'ro': 'ro-RO', 'bg': 'bg-BG', 'hr': 'hr-HR'
    };
    return codes[language] || 'en-US';
  }

  addAudioIndicator() {
    document.querySelectorAll('.audio-playing').forEach(el => {
      el.classList.remove('audio-playing');
    });
    
    const activeButton = document.querySelector('.control-btn.audio-btn:focus');
    if (activeButton) {
      activeButton.closest('.conversation-item').classList.add('audio-playing');
    }
  }

  removeAudioIndicator() {
    document.querySelectorAll('.audio-playing').forEach(el => {
      el.classList.remove('audio-playing');
    });
  }
}

// 💾 Storage Manager
class StorageManager {
  constructor() {
    this.prefix = 'speakEU_';
  }

  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }

  export() {
    const data = {};
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => {
      data[key.replace(this.prefix, '')] = localStorage.getItem(key);
    });
    return data;
  }

  import(data) {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(this.prefix + key, value);
    });
  }
}

// 🧠 Spaced Repetition System
class SpacedRepetitionManager {
  constructor() {
    this.reviews = new Map();
  }

  addWord(wordId, difficulty = 'normal') {
    const now = new Date();
    const intervals = CONFIG.spacedRepetition;
    
    let nextReview;
    switch (difficulty) {
      case 'easy':
        nextReview = new Date(now.getTime() + intervals.easyInterval * 24 * 60 * 60 * 1000);
        break;
      case 'hard':
        nextReview = new Date(now.getTime() + intervals.hardInterval * 24 * 60 * 60 * 1000);
        break;
      default:
        nextReview = new Date(now.getTime() + intervals.normalInterval * 24 * 60 * 60 * 1000);
    }

    this.reviews.set(wordId, {
      nextReview: nextReview.toISOString(),
      difficulty: difficulty,
      reviewCount: 1,
      lastReviewed: now.toISOString()
    });

    this.saveReviews();
  }

  updateWord(wordId, difficulty) {
    const review = this.reviews.get(wordId);
    if (!review) return this.addWord(wordId, difficulty);

    const now = new Date();
    const intervals = CONFIG.spacedRepetition;
    let multiplier = 1;

    // Adjust interval based on performance
    switch (difficulty) {
      case 'easy':
        multiplier = 2.5;
        break;
      case 'normal':
        multiplier = 1.3;
        break;
      case 'hard':
        multiplier = 0.5;
        break;
    }

    const currentInterval = intervals.normalInterval * Math.pow(multiplier, review.reviewCount);
    const maxInterval = intervals.maxInterval;
    const nextInterval = Math.min(currentInterval, maxInterval);
    
    const nextReview = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000);

    this.reviews.set(wordId, {
      ...review,
      nextReview: nextReview.toISOString(),
      difficulty: difficulty,
      reviewCount: review.reviewCount + 1,
      lastReviewed: now.toISOString()
    });

    this.saveReviews();
  }

  getDueWords() {
    const now = new Date();
    const dueWords = [];

    this.reviews.forEach((review, wordId) => {
      const nextReview = new Date(review.nextReview);
      if (nextReview <= now) {
        dueWords.push(wordId);
      }
    });

    return dueWords;
  }

  getReviewStats() {
    const now = new Date();
    const today = now.toDateString();
    let todayReviews = 0;
    let totalWords = this.reviews.size;
    let dueWords = this.getDueWords().length;

    this.reviews.forEach(review => {
      const lastReviewed = new Date(review.lastReviewed);
      if (lastReviewed.toDateString() === today) {
        todayReviews++;
      }
    });

    return { todayReviews, totalWords, dueWords };
  }

  loadReviews() {
    const saved = storage.load('spacedRepetition', {});
    this.reviews = new Map(Object.entries(saved));
  }

  saveReviews() {
    const obj = Object.fromEntries(this.reviews);
    storage.save('spacedRepetition', obj);
  }
}

// 📊 Progress Tracker
class ProgressTracker {
  constructor() {
    this.dailyStats = new Map();
    this.weeklyStats = [];
    this.loadStats();
  }

  recordWordLearned(wordId, language) {
    const today = new Date().toDateString();
    const stats = this.dailyStats.get(today) || {
      date: today,
      wordsLearned: 0,
      timeSpent: 0,
      languages: new Set(),
      accuracy: 100
    };

    stats.wordsLearned++;
    stats.languages.add(language);
    this.dailyStats.set(today, stats);

    // Update weekly stats
    this.updateWeeklyStats();
    this.saveStats();
    
    // Update streak
    this.updateStreak();
  }

  updateStreak() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toDateString();
    const yesterdayKey = yesterday.toDateString();

    if (this.dailyStats.has(todayKey)) {
      appState.lastStudyDate = todayKey;
      
      if (this.dailyStats.has(yesterdayKey) || appState.currentStreak === 0) {
        appState.currentStreak++;
      }
    } else if (appState.lastStudyDate !== todayKey) {
      // Reset streak if missed a day
      appState.currentStreak = 0;
    }

    storage.save('currentStreak', appState.currentStreak);
    storage.save('lastStudyDate', appState.lastStudyDate);
  }

  updateWeeklyStats() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateKey = date.toDateString();
      const dayStats = this.dailyStats.get(dateKey);
      
      weeklyData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: dateKey,
        words: dayStats ? dayStats.wordsLearned : 0
      });
    }
    
    this.weeklyStats = weeklyData;
  }

  getTodayProgress() {
    const today = new Date().toDateString();
    const stats = this.dailyStats.get(today);
    return {
      wordsLearned: stats ? stats.wordsLearned : 0,
      goal: appState.dailyGoal,
      percentage: stats ? Math.min((stats.wordsLearned / appState.dailyGoal) * 100, 100) : 0
    };
  }

  getTotalStats() {
    let totalWords = 0;
    let totalLanguages = new Set();
    
    this.dailyStats.forEach(stats => {
      totalWords += stats.wordsLearned;
      stats.languages.forEach(lang => totalLanguages.add(lang));
    });

    return {
      totalWords,
      totalLanguages: totalLanguages.size,
      totalDays: this.dailyStats.size,
      currentStreak: appState.currentStreak
    };
  }

  loadStats() {
    const savedDaily = storage.load('dailyStats', {});
    this.dailyStats = new Map(Object.entries(savedDaily));
    
    this.weeklyStats = storage.load('weeklyStats', []);
    appState.currentStreak = storage.load('currentStreak', 0);
    appState.lastStudyDate = storage.load('lastStudyDate', null);
    
    this.updateWeeklyStats();
  }

  saveStats() {
    const dailyObj = Object.fromEntries(
      Array.from(this.dailyStats.entries()).map(([key, value]) => [
        key, 
        {
          ...value,
          languages: Array.from(value.languages)
        }
      ])
    );
    
    storage.save('dailyStats', dailyObj);
    storage.save('weeklyStats', this.weeklyStats);
  }
}

// 🎨 UI Manager
class UIManager {
  constructor() {
    this.elements = this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    return {
      // Header elements
      languageSelect: document.getElementById('language-select'),
      searchBox: document.getElementById('search-box'),
      clearSearch: document.getElementById('clear-search'),
      categoryFilter: document.getElementById('category-filter'),
      favoritesToggle: document.getElementById('favorites-toggle'),
      audioToggle: document.getElementById('audio-toggle'),
      progressToggle: document.getElementById('progress-toggle'),
      settingsToggle: document.getElementById('settings-toggle'),
      modeToggle: document.getElementById('mode-toggle'),
      menuToggle: document.getElementById('menu-toggle'),

      // Content areas
      loadingSpinner: document.getElementById('loading-spinner'),
      welcomeScreen: document.getElementById('welcome-screen'),
      vocabularyContent: document.getElementById('vocabulary-content'),
      conversationArea: document.getElementById('conversation-area'),

      // Progress elements
      progressBarContainer: document.getElementById('progress-bar-container'),
      progressFill: document.getElementById('progress-fill'),
      dailyProgress: document.getElementById('daily-progress'),
      totalProgress: document.getElementById('total-progress'),
      streakCounter: document.getElementById('streak-counter'),

      // Stats elements
      quickStats: document.getElementById('quick-stats'),
      dailyGoalStat: document.getElementById('daily-goal-stat'),
      favoritesStat: document.getElementById('favorites-stat'),
      accuracyStat: document.getElementById('accuracy-stat'),
      reviewStat: document.getElementById('review-stat'),

      // Filter info
      filterInfo: document.getElementById('filter-info'),
      resultsCount: document.getElementById('results-count'),
      clearFilters: document.getElementById('clear-filters'),

      // Side menu
      sideMenu: document.getElementById('side-menu'),
      closeMenu: document.getElementById('close-menu'),

      // Modals
      settingsModal: document.getElementById('settings-modal'),
      progressModal: document.getElementById('progress-modal'),
      modalOverlay: document.getElementById('modal-overlay')
    };
  }

  bindEvents() {
    // Language selection
    this.elements.languageSelect.addEventListener('change', () => {
      const lang = this.elements.languageSelect.value;
      if (lang) {
        this.loadLanguage(lang);
      }
    });

    // Search functionality
    this.elements.searchBox.addEventListener('input', debounce(() => {
      this.handleSearch();
    }, 300));

    this.elements.clearSearch.addEventListener('click', () => {
      this.clearSearch();
    });

    // Category filter
    this.elements.categoryFilter.addEventListener('change', () => {
      this.handleCategoryFilter();
    });

    // Toggle buttons
    this.elements.favoritesToggle.addEventListener('click', () => {
      this.toggleFavorites();
    });

    this.elements.audioToggle.addEventListener('click', () => {
      this.toggleAudio();
    });

    this.elements.progressToggle.addEventListener('click', () => {
      this.toggleProgress();
    });

    this.elements.settingsToggle.addEventListener('click', () => {
      this.openSettings();
    });

    this.elements.modeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.elements.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Menu and modals
    this.elements.closeMenu.addEventListener('click', () => {
      this.closeMenu();
    });

    this.elements.modalOverlay.addEventListener('click', () => {
      this.closeAllModals();
    });

    // Clear filters
    this.elements.clearFilters.addEventListener('click', () => {
      this.clearAllFilters();
    });

    // Popular language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        this.elements.languageSelect.value = lang;
        this.loadLanguage(lang);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  showLoading() {
    this.elements.loadingSpinner.classList.remove('hidden');
    appState.isLoading = true;
  }

  hideLoading() {
    this.elements.loadingSpinner.classList.add('hidden');
    appState.isLoading = false;
  }

  showWelcome() {
    this.elements.welcomeScreen.classList.remove('hidden');
    this.elements.vocabularyContent.classList.add('hidden');
  }

  hideWelcome() {
    this.elements.welcomeScreen.classList.add('hidden');
    this.elements.vocabularyContent.classList.remove('hidden');
  }

  async loadLanguage(lang) {
    if (!lang || appState.currentLanguage === lang) return;

    try {
      this.showLoading();
      
      const response = await fetch(`languages/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }

      const data = await response.json();
      
      appState.currentLanguage = lang;
      appState.currentVocabulary = data;
      appState.filteredVocabulary = [...data];

      // Save language preference
      storage.save('selectedLanguage', lang);

      // Hide welcome and show content
      this.hideWelcome();
      this.renderVocabulary();
      this.updateUI();

      // Show success message
      this.showSuccessMessage(`Loaded ${data.length} words for ${lang}!`);

    } catch (error) {
      console.error('Error loading language:', error);
      this.showErrorMessage(`Failed to load language data: ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  renderVocabulary() {
    const container = this.elements.vocabularyContent;
    const vocabulary = appState.filteredVocabulary;
    
    if (!vocabulary.length) {
      container.innerHTML = `
        <div class="text-center" style="padding: 3rem;">
          <h3>No vocabulary found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    const langCode = langCodeMap[appState.currentLanguage];
    const html = vocabulary.map((item, index) => {
      const wordId = `${appState.currentLanguage}_${index}`;
      const isLearned = appState.learnedWords.has(wordId);
      const isFavorite = appState.favoriteWords.has(wordId);
      const localWord = item[langCode] || '—';
      const bnWord = item.bn || '—';
      const bnMeaning = item.bnMeaning || '—';
      const enWord = item.en || '—';

      return `
        <div class="conversation-item ${isLearned ? 'learned' : ''} ${isFavorite ? 'favorite' : ''}" 
             data-word-id="${wordId}" data-index="${index}">
          
          <div class="vocabulary-controls">
            <button class="control-btn audio-btn" data-text="${localWord}" data-lang="${langCode}" 
                    title="Play pronunciation">🔊</button>
            <button class="control-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                    title="Add to favorites">⭐</button>
            <button class="control-btn learned-btn ${isLearned ? 'active' : ''}" 
                    title="Mark as learned">✓</button>
          </div>

          <div class="vocabulary-row">
            <span class="vocabulary-icon">🗣️</span>
            <div class="vocabulary-text">
              <strong>${this.highlightSearch(localWord)}</strong>
            </div>
          </div>

          <div class="vocabulary-row">
            <span class="vocabulary-icon">📝</span>
            <div class="vocabulary-text">
              <span>${this.highlightSearch(bnWord)}</span>
            </div>
          </div>

          <div class="vocabulary-row">
            <span class="vocabulary-icon">📘</span>
            <div class="vocabulary-text">
              <em>${this.highlightSearch(bnMeaning)}</em>
            </div>
          </div>

          <div class="vocabulary-row">
            <span class="vocabulary-icon">🔤</span>
            <div class="vocabulary-text">
              <span>${this.highlightSearch(enWord)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;

    // Add event listeners to vocabulary items
    this.bindVocabularyEvents();
    
    // Add animations
    if (CONFIG.animationsEnabled) {
      this.animateVocabularyItems();
    }
  }

  bindVocabularyEvents() {
    // Audio buttons
    document.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        const lang = btn.dataset.lang;
        audioManager.speak(text, lang, appState.audioSpeed, CONFIG.audioVolume);
      });
    });

    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.closest('.conversation-item').dataset.wordId;
        this.toggleFavorite(wordId);
      });
    });

    // Learned buttons
    document.querySelectorAll('.learned-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.closest('.conversation-item').dataset.wordId;
        this.toggleLearned(wordId);
      });
    });

    // Auto-play audio if enabled
    if (appState.autoPlay && appState.audioEnabled) {
      const firstAudioBtn = document.querySelector('.audio-btn');
      if (firstAudioBtn) {
        setTimeout(() => firstAudioBtn.click(), 500);
      }
    }
  }

  animateVocabularyItems() {
    const items = document.querySelectorAll('.conversation-item');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  handleSearch() {
    const query = this.elements.searchBox.value.toLowerCase().trim();
    appState.searchQuery = query;

    if (!query) {
      appState.filteredVocabulary = [...appState.currentVocabulary];
    } else {
      appState.filteredVocabulary = appState.currentVocabulary.filter(item => {
        const langCode = langCodeMap[appState.currentLanguage];
        const searchFields = [
          item[langCode],
          item.bn,
          item.bnMeaning,
          item.en
        ];

        return searchFields.some(field => 
          field && field.toLowerCase().includes(query)
        );
      });
    }

    this.applyFilters();
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  handleCategoryFilter() {
    appState.selectedCategory = this.elements.categoryFilter.value;
    this.applyFilters();
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  applyFilters() {
    let filtered = [...appState.currentVocabulary];

    // Apply search filter
    if (appState.searchQuery) {
      const query = appState.searchQuery.toLowerCase();
      const langCode = langCodeMap[appState.currentLanguage];
      
      filtered = filtered.filter(item => {
        const searchFields = [item[langCode], item.bn, item.bnMeaning, item.en];
        return searchFields.some(field => 
          field && field.toLowerCase().includes(query)
        );
      });
    }

    // Apply category filter
    if (appState.selectedCategory) {
      filtered = filtered.filter(item => {
        const category = item.category || 'basic';
        return category === appState.selectedCategory;
      });
    }

    // Apply favorites filter
    if (appState.showFavorites) {
      filtered = filtered.filter((item, index) => {
        const wordId = `${appState.currentLanguage}_${index}`;
        return appState.favoriteWords.has(wordId);
      });
    }

    appState.filteredVocabulary = filtered;
  }

  clearSearch() {
    this.elements.searchBox.value = '';
    appState.searchQuery = '';
    this.handleSearch();
  }

  clearAllFilters() {
    this.elements.searchBox.value = '';
    this.elements.categoryFilter.value = '';
    appState.searchQuery = '';
    appState.selectedCategory = '';
    appState.showFavorites = false;
    
    this.elements.favoritesToggle.classList.remove('active');
    this.applyFilters();
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  updateFilterInfo() {
    const total = appState.currentVocabulary.length;
    const filtered = appState.filteredVocabulary.length;
    
    if (filtered === total && !appState.searchQuery && !appState.selectedCategory && !appState.showFavorites) {
      this.elements.filterInfo.classList.add('hidden');
    } else {
      this.elements.filterInfo.classList.remove('hidden');
      this.elements.resultsCount.textContent = `Showing ${filtered} of ${total} words`;
    }
  }

  highlightSearch(text) {
    if (!appState.searchQuery || !text) return text;
    
    const regex = new RegExp(`(${appState.searchQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  toggleFavorite(wordId) {
    if (appState.favoriteWords.has(wordId)) {
      appState.favoriteWords.delete(wordId);
    } else {
      appState.favoriteWords.add(wordId);
    }
    
    storage.save('favoriteWords', Array.from(appState.favoriteWords));
    
    // Update UI
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item.querySelector('.favorite-btn');
    
    if (appState.favoriteWords.has(wordId)) {
      item.classList.add('favorite');
      btn.classList.add('active');
      this.showSuccessMessage('Added to favorites! ⭐');
    } else {
      item.classList.remove('favorite');
      btn.classList.remove('active');
      this.showSuccessMessage('Removed from favorites');
    }
    
    this.updateStats();
  }

  toggleLearned(wordId) {
    if (appState.learnedWords.has(wordId)) {
      appState.learnedWords.delete(wordId);
    } else {
      appState.learnedWords.add(wordId);
      
      // Record progress
      progressTracker.recordWordLearned(wordId, appState.currentLanguage);
      
      // Add to spaced repetition
      spacedRepetitionManager.addWord(wordId, 'normal');
    }
    
    storage.save('learnedWords', Array.from(appState.learnedWords));
    
    // Update UI
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item.querySelector('.learned-btn');
    
    if (appState.learnedWords.has(wordId)) {
      item.classList.add('learned');
      btn.classList.add('active');
      this.showSuccessMessage('Word learned! ✓');
    } else {
      item.classList.remove('learned');
      btn.classList.remove('active');
    }
    
    this.updateStats();
    this.updateProgress();
  }

  toggleFavorites() {
    appState.showFavorites = !appState.showFavorites;
    this.elements.favoritesToggle.classList.toggle('active', appState.showFavorites);
    
    this.applyFilters();
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  toggleAudio() {
    appState.audioEnabled = !appState.audioEnabled;
    this.elements.audioToggle.classList.toggle('active', appState.audioEnabled);
    storage.save('audioEnabled', appState.audioEnabled);
    
    if (appState.audioEnabled) {
      this.showSuccessMessage('Audio enabled 🔊');
    } else {
      this.showSuccessMessage('Audio disabled 🔇');
      audioManager.stop();
    }
  }

  toggleProgress() {
    appState.showProgress = !appState.showProgress;
    this.elements.progressBarContainer.classList.toggle('hidden', !appState.showProgress);
    this.elements.quickStats.classList.toggle('hidden', !appState.showProgress);
    this.elements.progressToggle.classList.toggle('active', appState.showProgress);
    
    if (appState.showProgress) {
      this.updateProgress();
      this.updateStats();
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    this.elements.modeToggle.textContent = isDark ? '🌙' : '☀️';
    storage.save('theme', isDark ? 'dark' : 'light');
  }

  toggleMenu() {
    this.elements.sideMenu.classList.toggle('active');
    this.updateMenuStats();
  }

  closeMenu() {
    this.elements.sideMenu.classList.remove('active');
  }

  openSettings() {
    this.elements.settingsModal.classList.remove('hidden');
    this.elements.modalOverlay.classList.remove('hidden');
    this.loadSettingsValues();
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
    this.elements.modalOverlay.classList.add('hidden');
  }

  updateProgress() {
    const progress = progressTracker.getTodayProgress();
    
    // Update progress bar
    this.elements.progressFill.style.width = `${progress.percentage}%`;
    
    // Update progress text
    this.elements.dailyProgress.textContent = `Today: ${progress.wordsLearned}/${progress.goal} words`;
    this.elements.totalProgress.textContent = `Total: ${appState.learnedWords.size} words learned`;
    this.elements.streakCounter.textContent = `🔥 ${appState.currentStreak} day streak`;
  }

  updateStats() {
    const reviewStats = spacedRepetitionManager.getReviewStats();
    
    // Update quick stats
    this.elements.dailyGoalStat.textContent = `${progressTracker.getTodayProgress().wordsLearned}/${appState.dailyGoal}`;
    this.elements.favoritesStat.textContent = appState.favoriteWords.size;
    this.elements.accuracyStat.textContent = '100%'; // Placeholder
    this.elements.reviewStat.textContent = reviewStats.dueWords;
  }

  updateMenuStats() {
    const totalStats = progressTracker.getTotalStats();
    
    document.getElementById('menu-total-words').textContent = totalStats.totalWords;
    document.getElementById('menu-streak').textContent = totalStats.currentStreak;
    document.getElementById('menu-favorites').textContent = appState.favoriteWords.size;
  }

  loadSettingsValues() {
    // Load current settings into modal
    const dailyGoalInput = document.getElementById('modal-daily-goal');
    const audioSpeedInput = document.getElementById('modal-audio-speed');
    const autoPlayInput = document.getElementById('modal-auto-play');
    
    if (dailyGoalInput) dailyGoalInput.value = appState.dailyGoal;
    if (audioSpeedInput) audioSpeedInput.value = appState.audioSpeed;
    if (autoPlayInput) autoPlayInput.checked = appState.autoPlay;
  }

  showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }

  showErrorMessage(message) {
    console.error(message);
    // Could implement a toast notification system here
  }

  updateUI() {
    this.updateProgress();
    this.updateStats();
    this.updateFilterInfo();
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      this.elements.searchBox.focus();
    }
    
    // Escape to close modals/menu
    if (e.key === 'Escape') {
      this.closeAllModals();
      this.closeMenu();
    }
  }
}

// 🚀 Application Initialization
class App {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Initialize managers
      window.storage = new StorageManager();
      window.audioManager = new AudioManager();
      window.spacedRepetitionManager = new SpacedRepetitionManager();
      window.progressTracker = new ProgressTracker();
      window.uiManager = new UIManager();

      // Load saved data
      this.loadSavedData();
      
      // Initialize UI
      this.initializeUI();
      
      // Load saved language if exists
      const savedLang = storage.load('selectedLanguage');
      if (savedLang) {
        uiManager.elements.languageSelect.value = savedLang;
        await uiManager.loadLanguage(savedLang);
      }

      // Hide loading spinner
      uiManager.hideLoading();
      
      console.log('✅ Speak EU initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Speak EU:', error);
      uiManager.hideLoading();
    }
  }

  loadSavedData() {
    // Load user preferences
    appState.dailyGoal = storage.load('dailyGoal', CONFIG.defaultDailyGoal);
    appState.audioEnabled = storage.load('audioEnabled', CONFIG.audioEnabled);
    appState.autoPlay = storage.load('autoPlay', CONFIG.autoPlay);
    appState.audioSpeed = storage.load('audioSpeed', CONFIG.audioSpeed);
    
    // Load user progress
    const savedLearned = storage.load('learnedWords', []);
    const savedFavorites = storage.load('favoriteWords', []);
    
    appState.learnedWords = new Set(savedLearned);
    appState.favoriteWords = new Set(savedFavorites);
    
    // Load theme
    const savedTheme = storage.load('theme', 'light');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      uiManager.elements.modeToggle.textContent = '🌙';
    }

    // Load spaced repetition data
    spacedRepetitionManager.loadReviews();
  }

  initializeUI() {
    // Set up daily goal input
    const dailyGoalInput = document.getElementById('daily-goal-input');
    if (dailyGoalInput) {
      dailyGoalInput.value = appState.dailyGoal;
      dailyGoalInput.addEventListener('change', (e) => {
        appState.dailyGoal = parseInt(e.target.value) || CONFIG.defaultDailyGoal;
        storage.save('dailyGoal', appState.dailyGoal);
        uiManager.updateProgress();
      });
    }

    // Set up audio speed control
    const audioSpeedInput = document.getElementById('audio-speed');
    const speedDisplay = document.getElementById('speed-display');
    if (audioSpeedInput && speedDisplay) {
      audioSpeedInput.value = appState.audioSpeed;
      speedDisplay.textContent = `${appState.audioSpeed}x`;
      
      audioSpeedInput.addEventListener('input', (e) => {
        appState.audioSpeed = parseFloat(e.target.value);
        speedDisplay.textContent = `${appState.audioSpeed}x`;
        storage.save('audioSpeed', appState.audioSpeed);
      });
    }

    // Set up auto-play checkbox
    const autoPlayCheckbox = document.getElementById('auto-play-audio');
    if (autoPlayCheckbox) {
      autoPlayCheckbox.checked = appState.autoPlay;
      autoPlayCheckbox.addEventListener('change', (e) => {
        appState.autoPlay = e.target.checked;
        storage.save('autoPlay', appState.autoPlay);
      });
    }

    // Initialize button states
    uiManager.elements.audioToggle.classList.toggle('active', appState.audioEnabled);
  }
}

// 🛠️ Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 🎯 Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 Starting Speak EU v2.0...');
  new App();
});

// 💾 Save data before page unload
window.addEventListener('beforeunload', () => {
  if (window.progressTracker) {
    progressTracker.saveStats();
  }
  if (window.spacedRepetitionManager) {
    spacedRepetitionManager.saveReviews();
  }
});

// 🔄 Handle online/offline status
window.addEventListener('online', () => {
  console.log('✅ Back online');
});

window.addEventListener('offline', () => {
  console.log('📴 Offline mode');
});

// Export for debugging (development only)
if (typeof window !== 'undefined') {
  window.SpeakEU = {
    appState,
    CONFIG,
    storage,
    audioManager,
    spacedRepetitionManager,
    progressTracker,
    uiManager
  };
}
