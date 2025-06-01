// 🌟 Speak EU - Mobile Friendly Language Learning Platform
// Version 2.0 Mobile - Optimized for touch devices

// 🔧 Global Configuration
const CONFIG = {
  version: '2.0-mobile',
  defaultDailyGoal: 10,
  audioSpeed: 1.0,
  audioVolume: 0.8,
  autoPlay: false,
  
  // Storage Keys
  storageKeys: {
    selectedLanguage: 'speakEU_selectedLanguage',
    learnedWords: 'speakEU_learnedWords',
    favoriteWords: 'speakEU_favoriteWords',
    dailyGoal: 'speakEU_dailyGoal',
    audioEnabled: 'speakEU_audioEnabled',
    autoPlay: 'speakEU_autoPlay',
    audioSpeed: 'speakEU_audioSpeed',
    currentStreak: 'speakEU_currentStreak',
    lastStudyDate: 'speakEU_lastStudyDate',
    dailyProgress: 'speakEU_dailyProgress',
    theme: 'speakEU_theme'
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
  showFavorites: false,
  
  // User Progress
  learnedWords: new Set(),
  favoriteWords: new Set(),
  dailyGoal: CONFIG.defaultDailyGoal,
  todayLearned: 0,
  currentStreak: 0,
  lastStudyDate: null,
  
  // Settings
  audioEnabled: true,
  autoPlay: CONFIG.autoPlay,
  audioSpeed: CONFIG.audioSpeed,
  
  // UI State
  isLoading: false,
  menuOpen: false
};

// 🔊 Audio Manager
class AudioManager {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
  }

  async speak(text, language = 'en') {
    if (!appState.audioEnabled || !this.synthesis || !text) return;

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = appState.audioSpeed;
      utterance.volume = CONFIG.audioVolume;
      utterance.pitch = 1;

      utterance.onstart = () => {
        this.isPlaying = true;
        this.addPlayingIndicator();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.removePlayingIndicator();
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        this.removePlayingIndicator();
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);

    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  stop() {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.removePlayingIndicator();
    }
  }

  getLanguageCode(lang) {
    const codes = {
      'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
      'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'el': 'el-GR',
      'nl': 'nl-NL', 'sv': 'sv-SE', 'da': 'da-DK', 'no': 'no-NO',
      'fi': 'fi-FI', 'pl': 'pl-PL', 'cs': 'cs-CZ', 'sk': 'sk-SK',
      'hu': 'hu-HU', 'ro': 'ro-RO', 'bg': 'bg-BG', 'hr': 'hr-HR'
    };
    return codes[lang] || 'en-US';
  }

  addPlayingIndicator() {
    document.querySelectorAll('.audio-playing').forEach(el => {
      el.classList.remove('audio-playing');
    });
  }

  removePlayingIndicator() {
    document.querySelectorAll('.audio-playing').forEach(el => {
      el.classList.remove('audio-playing');
    });
  }
}

// 💾 Storage Manager
class StorageManager {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage save error:', error);
    }
  }

  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
}

// 📊 Progress Manager
class ProgressManager {
  constructor() {
    this.loadProgress();
  }

  recordWordLearned(wordId) {
    const today = this.getTodayKey();
    
    // Update today's count
    appState.todayLearned++;
    
    // Update streak
    this.updateStreak();
    
    // Save progress
    this.saveProgress();
    
    // Update UI
    this.updateProgressUI();
  }

  updateStreak() {
    const today = this.getTodayKey();
    
    if (appState.lastStudyDate !== today) {
      if (this.isConsecutiveDay(appState.lastStudyDate, today)) {
        appState.currentStreak++;
      } else {
        appState.currentStreak = 1;
      }
      appState.lastStudyDate = today;
    }
  }

  isConsecutiveDay(lastDate, currentDate) {
    if (!lastDate) return false;
    
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffTime = current - last;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1;
  }

  getTodayKey() {
    return new Date().toDateString();
  }

  getProgressPercentage() {
    return Math.min((appState.todayLearned / appState.dailyGoal) * 100, 100);
  }

  updateProgressUI() {
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const dailyProgress = document.getElementById('daily-progress');
    const streakCounter = document.getElementById('streak-counter');

    if (progressFill) {
      progressFill.style.width = `${this.getProgressPercentage()}%`;
    }

    if (dailyProgress) {
      dailyProgress.textContent = `Today: ${appState.todayLearned}/${appState.dailyGoal} words`;
    }

    if (streakCounter) {
      streakCounter.textContent = `🔥 ${appState.currentStreak} day streak`;
    }

    // Update menu stats
    this.updateMenuStats();
  }

  updateMenuStats() {
    const totalWordsEl = document.getElementById('menu-total-words');
    const streakEl = document.getElementById('menu-streak');
    const favoritesEl = document.getElementById('menu-favorites');

    if (totalWordsEl) totalWordsEl.textContent = appState.learnedWords.size;
    if (streakEl) streakEl.textContent = `${appState.currentStreak} days`;
    if (favoritesEl) favoritesEl.textContent = appState.favoriteWords.size;
  }

  loadProgress() {
    const today = this.getTodayKey();
    
    appState.currentStreak = storage.load(CONFIG.storageKeys.currentStreak, 0);
    appState.lastStudyDate = storage.load(CONFIG.storageKeys.lastStudyDate, null);
    
    // Load today's progress
    const dailyData = storage.load(CONFIG.storageKeys.dailyProgress, {});
    appState.todayLearned = dailyData[today] || 0;
    
    // Reset daily count if it's a new day
    if (appState.lastStudyDate && appState.lastStudyDate !== today && !this.isConsecutiveDay(appState.lastStudyDate, today)) {
      appState.currentStreak = 0;
      appState.todayLearned = 0;
    }
  }

  saveProgress() {
    const today = this.getTodayKey();
    
    storage.save(CONFIG.storageKeys.currentStreak, appState.currentStreak);
    storage.save(CONFIG.storageKeys.lastStudyDate, appState.lastStudyDate);
    
    // Save daily progress
    const dailyData = storage.load(CONFIG.storageKeys.dailyProgress, {});
    dailyData[today] = appState.todayLearned;
    storage.save(CONFIG.storageKeys.dailyProgress, dailyData);
  }
}

// 🎨 UI Manager
class UIManager {
  constructor() {
    this.elements = this.getElements();
    this.bindEvents();
    this.loadSettings();
  }

  getElements() {
    return {
      // Loading
      loadingSpinner: document.getElementById('loading-spinner'),
      
      // Header
      languageSelect: document.getElementById('language-select'),
      modeToggle: document.getElementById('mode-toggle'),
      menuToggle: document.getElementById('menu-toggle'),
      
      // Search section
      searchSection: document.getElementById('search-section'),
      searchBox: document.getElementById('search-box'),
      clearSearch: document.getElementById('clear-search'),
      categoryFilter: document.getElementById('category-filter'),
      favoritesToggle: document.getElementById('favorites-toggle'),
      audioToggle: document.getElementById('audio-toggle'),
      
      // Progress section
      progressSection: document.getElementById('progress-section'),
      progressFill: document.getElementById('progress-fill'),
      dailyProgress: document.getElementById('daily-progress'),
      streakCounter: document.getElementById('streak-counter'),
      
      // Filter info
      filterInfo: document.getElementById('filter-info'),
      resultsCount: document.getElementById('results-count'),
      clearFilters: document.getElementById('clear-filters'),
      
      // Content
      welcomeScreen: document.getElementById('welcome-screen'),
      vocabularyContent: document.getElementById('vocabulary-content'),
      
      // Menu
      sideMenu: document.getElementById('side-menu'),
      closeMenu: document.getElementById('close-menu'),
      modalOverlay: document.getElementById('modal-overlay'),
      
      // Menu links
      homeLink: document.getElementById('home-link'),
      progressLink: document.getElementById('progress-link'),
      favoritesLink: document.getElementById('favorites-link'),
      settingsLink: document.getElementById('settings-link'),
      
      // Settings
      dailyGoalInput: document.getElementById('daily-goal-input'),
      audioSpeedRange: document.getElementById('audio-speed'),
      speedDisplay: document.getElementById('speed-display'),
      autoPlayCheckbox: document.getElementById('auto-play-audio')
    };
  }

  bindEvents() {
    // Language selection
    this.elements.languageSelect?.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (lang) {
        this.loadLanguage(lang);
      }
    });

    // Search functionality
    this.elements.searchBox?.addEventListener('input', this.debounce(() => {
      this.handleSearch();
    }, 300));

    this.elements.clearSearch?.addEventListener('click', () => {
      this.clearSearch();
    });

    // Category filter
    this.elements.categoryFilter?.addEventListener('change', () => {
      this.applyFilters();
    });

    // Toggle buttons
    this.elements.favoritesToggle?.addEventListener('click', () => {
      this.toggleFavorites();
    });

    this.elements.audioToggle?.addEventListener('click', () => {
      this.toggleAudio();
    });

    // Theme toggle
    this.elements.modeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Menu
    this.elements.menuToggle?.addEventListener('click', () => {
      this.openMenu();
    });

    this.elements.closeMenu?.addEventListener('click', () => {
      this.closeMenu();
    });

    this.elements.modalOverlay?.addEventListener('click', () => {
      this.closeMenu();
    });

    // Menu links
    this.elements.homeLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showWelcome();
      this.closeMenu();
    });

    this.elements.favoritesLink?.addEventListener('click', (e) => {
      e.preventDefault();
      appState.showFavorites = true;
      this.applyFilters();
      this.closeMenu();
    });

    // Clear filters
    this.elements.clearFilters?.addEventListener('click', () => {
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

    // Settings
    this.elements.dailyGoalInput?.addEventListener('change', (e) => {
      appState.dailyGoal = parseInt(e.target.value) || CONFIG.defaultDailyGoal;
      storage.save(CONFIG.storageKeys.dailyGoal, appState.dailyGoal);
      progressManager.updateProgressUI();
    });

    this.elements.audioSpeedRange?.addEventListener('input', (e) => {
      appState.audioSpeed = parseFloat(e.target.value);
      this.elements.speedDisplay.textContent = `${appState.audioSpeed}x`;
      storage.save(CONFIG.storageKeys.audioSpeed, appState.audioSpeed);
    });

    this.elements.autoPlayCheckbox?.addEventListener('change', (e) => {
      appState.autoPlay = e.target.checked;
      storage.save(CONFIG.storageKeys.autoPlay, appState.autoPlay);
    });

    // Touch/swipe events for mobile
    this.bindTouchEvents();
  }

  bindTouchEvents() {
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Swipe detection
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - open menu
          this.openMenu();
        } else {
          // Swipe right - close menu
          this.closeMenu();
        }
      }

      startX = 0;
      startY = 0;
    });
  }

  debounce(func, wait) {
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

  showLoading() {
    this.elements.loadingSpinner?.classList.remove('hidden');
    appState.isLoading = true;
  }

  hideLoading() {
    this.elements.loadingSpinner?.classList.add('hidden');
    appState.isLoading = false;
  }

  showWelcome() {
    this.elements.welcomeScreen?.classList.remove('hidden');
    this.elements.vocabularyContent?.classList.add('hidden');
    this.elements.searchSection?.classList.add('hidden');
    this.elements.progressSection?.classList.add('hidden');
    this.elements.filterInfo?.classList.add('hidden');
  }

  hideWelcome() {
    this.elements.welcomeScreen?.classList.add('hidden');
    this.elements.vocabularyContent?.classList.remove('hidden');
    this.elements.searchSection?.classList.remove('hidden');
    this.elements.progressSection?.classList.remove('hidden');
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
      storage.save(CONFIG.storageKeys.selectedLanguage, lang);

      // Update UI
      this.hideWelcome();
      this.renderVocabulary();
      this.updateFilterInfo();
      progressManager.updateProgressUI();

      // Show success message
      this.showMessage(`Loaded ${data.length} words for ${lang}!`, 'success');

    } catch (error) {
      console.error('Error loading language:', error);
      this.showMessage(`Failed to load language: ${error.message}`, 'error');
    } finally {
      this.hideLoading();
    }
  }

  renderVocabulary() {
    const container = this.elements.vocabularyContent;
    if (!container) return;

    const vocabulary = appState.filteredVocabulary;
    
    if (!vocabulary.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
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
    this.bindVocabularyEvents();
  }

  bindVocabularyEvents() {
    // Audio buttons
    document.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        const lang = btn.dataset.lang;
        audioManager.speak(text, lang);
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
  }

  handleSearch() {
    appState.searchQuery = this.elements.searchBox.value.toLowerCase().trim();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...appState.currentVocabulary];

    // Apply search filter
    if (appState.searchQuery) {
      const query = appState.searchQuery;
      const langCode = langCodeMap[appState.currentLanguage];
      
      filtered = filtered.filter(item => {
        const searchFields = [item[langCode], item.bn, item.bnMeaning, item.en];
        return searchFields.some(field => 
          field && field.toLowerCase().includes(query)
        );
      });
    }

    // Apply category filter
    const selectedCategory = this.elements.categoryFilter?.value;
    if (selectedCategory) {
      filtered = filtered.filter(item => {
        const category = item.category || 'basic';
        return category === selectedCategory;
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
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  clearSearch() {
    this.elements.searchBox.value = '';
    appState.searchQuery = '';
    this.applyFilters();
  }

  clearAllFilters() {
    this.elements.searchBox.value = '';
    this.elements.categoryFilter.value = '';
    appState.searchQuery = '';
    appState.showFavorites = false;
    
    this.elements.favoritesToggle?.classList.remove('active');
    this.applyFilters();
  }

  updateFilterInfo() {
    if (!this.elements.filterInfo || !this.elements.resultsCount) return;

    const total = appState.currentVocabulary.length;
    const filtered = appState.filteredVocabulary.length;
    
    if (filtered === total && !appState.searchQuery && !appState.showFavorites) {
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
    
    storage.save(CONFIG.storageKeys.favoriteWords, Array.from(appState.favoriteWords));
    
    // Update UI
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item?.querySelector('.favorite-btn');
    
    if (appState.favoriteWords.has(wordId)) {
      item?.classList.add('favorite');
      btn?.classList.add('active');
      this.showMessage('Added to favorites! ⭐', 'success');
    } else {
      item?.classList.remove('favorite');
      btn?.classList.remove('active');
      this.showMessage('Removed from favorites', 'info');
    }
    
    progressManager.updateMenuStats();
  }

  toggleLearned(wordId) {
    if (appState.learnedWords.has(wordId)) {
      appState.learnedWords.delete(wordId);
    } else {
      appState.learnedWords.add(wordId);
      progressManager.recordWordLearned(wordId);
    }
    
    storage.save(CONFIG.storageKeys.learnedWords, Array.from(appState.learnedWords));
    
    // Update UI
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item?.querySelector('.learned-btn');
    
    if (appState.learnedWords.has(wordId)) {
      item?.classList.add('learned');
      btn?.classList.add('active');
      this.showMessage('Word learned! ✓', 'success');
    } else {
      item?.classList.remove('learned');
      btn?.classList.remove('active');
    }
    
    progressManager.updateMenuStats();
  }

  toggleFavorites() {
    appState.showFavorites = !appState.showFavorites;
    this.elements.favoritesToggle?.classList.toggle('active', appState.showFavorites);
    this.applyFilters();
  }

  toggleAudio() {
    appState.audioEnabled = !appState.audioEnabled;
    this.elements.audioToggle?.classList.toggle('active', appState.audioEnabled);
    storage.save(CONFIG.storageKeys.audioEnabled, appState.audioEnabled);
    
    if (appState.audioEnabled) {
      this.showMessage('Audio enabled 🔊', 'success');
    } else {
      this.showMessage('Audio disabled 🔇', 'info');
      audioManager.stop();
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    this.elements.modeToggle.textContent = isDark ? '🌙' : '☀️';
    storage.save(CONFIG.storageKeys.theme, isDark ? 'dark' : 'light');
  }

  openMenu() {
    this.elements.sideMenu?.classList.add('active');
    this.elements.modalOverlay?.classList.remove('hidden');
    appState.menuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.elements.sideMenu?.classList.remove('active');
    this.elements.modalOverlay?.classList.add('hidden');
    appState.menuOpen = false;
    document.body.style.overflow = '';
  }

  showMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;

    container.appendChild(message);

    // Auto remove after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  loadSettings() {
    // Load saved language and auto-load if available
    const savedLang = storage.load(CONFIG.storageKeys.selectedLanguage);
    if (savedLang && this.elements.languageSelect) {
      this.elements.languageSelect.value = savedLang;
      this.loadLanguage(savedLang);
    }

    // Load theme
    const savedTheme = storage.load(CONFIG.storageKeys.theme);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.elements.modeToggle.textContent = '🌙';
    }

    // Load other settings
    appState.learnedWords = new Set(storage.load(CONFIG.storageKeys.learnedWords, []));
    appState.favoriteWords = new Set(storage.load(CONFIG.storageKeys.favoriteWords, []));
    appState.dailyGoal = storage.load(CONFIG.storageKeys.dailyGoal, CONFIG.defaultDailyGoal);
    appState.audioEnabled = storage.load(CONFIG.storageKeys.audioEnabled, true);
    appState.autoPlay = storage.load(CONFIG.storageKeys.autoPlay, false);
    appState.audioSpeed = storage.load(CONFIG.storageKeys.audioSpeed, CONFIG.audioSpeed);

    // Update UI with loaded settings
    if (this.elements.dailyGoalInput) {
      this.elements.dailyGoalInput.value = appState.dailyGoal;
    }
    
    if (this.elements.audioSpeedRange) {
      this.elements.audioSpeedRange.value = appState.audioSpeed;
      this.elements.speedDisplay.textContent = `${appState.audioSpeed}x`;
    }
    
    if (this.elements.autoPlayCheckbox) {
      this.elements.autoPlayCheckbox.checked = appState.autoPlay;
    }
    
    if (this.elements.audioToggle) {
      this.elements.audioToggle.classList.toggle('active', appState.audioEnabled);
    }
  }
}

// 🚀 Initialize Application
let audioManager, storage, progressManager, ui;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  audioManager = new AudioManager();
  storage = new StorageManager();
  progressManager = new ProgressManager();
  ui = new UIManager();

  // Hide loading spinner after initialization
  setTimeout(() => {
    ui.hideLoading();
  }, 1000);

  console.log('🌟 Speak EU Mobile v2.0 initialized successfully!');
});

// 🎯 Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// 📱 Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (ui && appState.currentLanguage) {
      ui.renderVocabulary();
    }
  }, 100);
});

// 🔄 Handle online/offline status
window.addEventListener('online', () => {
  ui?.showMessage('Connection restored 📶', 'success');
});

window.addEventListener('offline', () => {
  ui?.showMessage('You are offline 📵', 'warning');
});

// 🎯 Prevent default touch behaviors on iOS
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
