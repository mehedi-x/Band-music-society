// 🌟 Speak EU - Mobile Friendly Language Learning Platform
// Version 2.0 Mobile - Optimized for touch devices with Scrollable Header

// 🔧 Global Configuration
const CONFIG = {
  version: '2.0-mobile-scroll',
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
  },
  
  // Scroll Settings
  scrollThreshold: 100, // px to scroll before hiding header
  headerAnimationDuration: 300 // ms
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
  menuOpen: false,
  
  // Scroll State
  lastScrollY: 0,
  scrollDirection: 'up',
  headerVisible: true,
  isScrolling: false
};

// 🎨 Scroll Manager for Header Animation
class ScrollManager {
  constructor() {
    this.elements = {
      topHeader: document.getElementById('top-header'),
      mainHeader: document.getElementById('main-header'),
      body: document.body
    };
    
    this.lastScrollY = window.scrollY;
    this.ticking = false;
    
    this.bindScrollEvents();
  }

  bindScrollEvents() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Handle resize events
    window.addEventListener('resize', this.debounce(() => {
      this.updateScrollState();
    }, 150));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - this.lastScrollY;
    
    // Determine scroll direction
    if (scrollDifference > 0) {
      appState.scrollDirection = 'down';
    } else if (scrollDifference < 0) {
      appState.scrollDirection = 'up';
    }

    // Update scroll state
    this.updateScrollState();
    
    this.lastScrollY = currentScrollY;
    appState.lastScrollY = currentScrollY;
  }

  updateScrollState() {
    const scrollY = window.scrollY;
    const shouldHideHeader = scrollY > CONFIG.scrollThreshold && appState.scrollDirection === 'down';
    
    if (shouldHideHeader && appState.headerVisible) {
      this.hideTopHeader();
      appState.headerVisible = false;
    } else if ((!shouldHideHeader || appState.scrollDirection === 'up') && !appState.headerVisible) {
      this.showTopHeader();
      appState.headerVisible = true;
    }

    // Add scroll class to body for additional styling
    if (scrollY > 50) {
      this.elements.body?.classList.add('scrolled');
    } else {
      this.elements.body?.classList.remove('scrolled');
    }
  }

  hideTopHeader() {
    if (this.elements.topHeader) {
      this.elements.topHeader.style.transform = 'translateY(-100%)';
      this.elements.topHeader.style.opacity = '0';
      this.elements.topHeader.setAttribute('aria-hidden', 'true');
    }
    
    // Adjust main header position
    if (this.elements.mainHeader) {
      this.elements.mainHeader.style.top = '0';
    }
  }

  showTopHeader() {
    if (this.elements.topHeader) {
      this.elements.topHeader.style.transform = 'translateY(0)';
      this.elements.topHeader.style.opacity = '1';
      this.elements.topHeader.removeAttribute('aria-hidden');
    }
    
    // Reset main header position
    if (this.elements.mainHeader) {
      this.elements.mainHeader.style.top = '';
    }
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
}

// 🔊 Audio Manager
class AudioManager {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    // Load available voices
    this.voices = this.synthesis.getVoices();
    
    // Handle voice loading on some browsers
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  getBestVoice(languageCode) {
    // Find the best voice for the given language
    const exactMatch = this.voices.find(voice => 
      voice.lang.toLowerCase() === languageCode.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Find partial match (e.g., 'en' matches 'en-US')
    const partialMatch = this.voices.find(voice => 
      voice.lang.toLowerCase().startsWith(languageCode.toLowerCase().split('-')[0])
    );
    
    return partialMatch || this.voices[0];
  }

  async speak(text, language = 'en') {
    if (!appState.audioEnabled || !this.synthesis || !text) return;

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      const languageCode = this.getLanguageCode(language);
      const voice = this.getBestVoice(languageCode);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = languageCode;
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

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
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
      'hu': 'hu-HU', 'ro': 'ro-RO', 'bg': 'bg-BG', 'hr': 'hr-HR',
      'sl': 'sl-SI', 'et': 'et-EE', 'lv': 'lv-LV', 'lt': 'lt-LT',
      'mt': 'mt-MT', 'sq': 'sq-AL', 'mk': 'mk-MK', 'sr': 'sr-RS',
      'bs': 'bs-BA', 'uk': 'uk-UA', 'tr': 'tr-TR', 'ka': 'ka-GE',
      'hy': 'hy-AM', 'az': 'az-AZ', 'is': 'is-IS', 'ga': 'ga-IE',
      'cy': 'cy-GB', 'br': 'br-FR', 'eu': 'eu-ES', 'ca': 'ca-ES'
    };
    return codes[lang] || 'en-US';
  }

  addPlayingIndicator() {
    document.querySelectorAll('.audio-playing').forEach(el => {
      el.classList.remove('audio-playing');
    });
    
    // Add playing indicator to current audio button
    const currentBtn = document.querySelector('.audio-btn:hover, .audio-btn:focus, .audio-btn:active');
    if (currentBtn) {
      currentBtn.classList.add('audio-playing');
    }
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
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
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
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  clear() {
    try {
      // Only clear Speak EU data
      Object.values(CONFIG.storageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  getUsage() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      return {
        used: total,
        total: 5 * 1024 * 1024, // 5MB typical limit
        percentage: Math.round((total / (5 * 1024 * 1024)) * 100)
      };
    } catch (error) {
      console.error('Storage usage error:', error);
      return { used: 0, total: 0, percentage: 0 };
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
    
    // Show achievement if goal reached
    this.checkDailyGoal();
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

  checkDailyGoal() {
    if (appState.todayLearned === appState.dailyGoal) {
      ui?.showMessage('🎉 Congratulations! Daily goal achieved!', 'success');
      
      // Add celebration effect
      this.triggerCelebration();
    }
  }

  triggerCelebration() {
    // Add celebration animation to progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.classList.add('celebration');
      setTimeout(() => {
        progressFill.classList.remove('celebration');
      }, 2000);
    }
  }

  updateProgressUI() {
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    const dailyProgress = document.getElementById('daily-progress');
    const dailyPercentage = document.getElementById('daily-percentage');
    const streakCounter = document.getElementById('streak-counter');

    if (progressFill) {
      const percentage = this.getProgressPercentage();
      progressFill.style.width = `${percentage}%`;
      
      // Add completion class if 100%
      if (percentage >= 100) {
        progressFill.classList.add('completed');
      } else {
        progressFill.classList.remove('completed');
      }
    }

    if (dailyPercentage) {
      dailyPercentage.textContent = `${Math.round(this.getProgressPercentage())}%`;
    }

    if (dailyProgress) {
      dailyProgress.textContent = `${appState.todayLearned}/${appState.dailyGoal} words learned`;
    }

    if (streakCounter) {
      streakCounter.textContent = `🔥 ${appState.currentStreak} day streak`;
    }

    // Update other stats
    const totalLearned = document.getElementById('total-learned');
    const favoritesCount = document.getElementById('favorites-count');
    const accuracyRate = document.getElementById('accuracy-rate');

    if (totalLearned) {
      totalLearned.textContent = appState.learnedWords.size;
    }

    if (favoritesCount) {
      favoritesCount.textContent = appState.favoriteWords.size;
    }

    if (accuracyRate) {
      // Calculate accuracy based on learned vs total attempted
      const totalAttempted = appState.learnedWords.size + (appState.todayLearned * 0.1); // rough estimate
      const accuracy = totalAttempted > 0 ? Math.round((appState.learnedWords.size / totalAttempted) * 100) : 100;
      accuracyRate.textContent = `${Math.min(accuracy, 100)}%`;
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

  getWeeklyProgress() {
    const dailyData = storage.load(CONFIG.storageKeys.dailyProgress, {});
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toDateString();
      
      weekData.push({
        date: dateKey,
        count: dailyData[dateKey] || 0,
        day: date.toLocaleDateString('en', { weekday: 'short' })
      });
    }
    
    return weekData;
  }
}

// 🎨 UI Manager
class UIManager {
  constructor() {
    this.elements = this.getElements();
    this.bindEvents();
    this.loadSettings();
    this.updateUI();
  }

  getElements() {
    return {
      // Loading
      loadingSpinner: document.getElementById('loading-spinner'),
      
      // Headers
      topHeader: document.getElementById('top-header'),
      mainHeader: document.getElementById('main-header'),
      
      // Header controls
      languageSelect: document.getElementById('language-select'),
      modeToggle: document.getElementById('mode-toggle'),
      menuToggle: document.getElementById('menu-toggle'),
      
      // Control panel
      controlPanel: document.getElementById('control-panel'),
      searchBox: document.getElementById('search-box'),
      clearSearch: document.getElementById('clear-search'),
      categoryFilter: document.getElementById('category-filter'),
      favoritesToggle: document.getElementById('favorites-toggle'),
      audioToggle: document.getElementById('audio-toggle'),
      progressToggle: document.getElementById('progress-toggle'),
      
      // Progress dashboard
      progressDashboard: document.getElementById('progress-dashboard'),
      progressFill: document.getElementById('progress-fill'),
      dailyProgress: document.getElementById('daily-progress'),
      dailyPercentage: document.getElementById('daily-percentage'),
      streakCounter: document.getElementById('streak-counter'),
      
      // Filter info
      filterInfo: document.getElementById('filter-info'),
      resultsCount: document.getElementById('results-count'),
      clearFilters: document.getElementById('clear-filters'),
      
      // Content
      mainContent: document.getElementById('main-content'),
      welcomeScreen: document.getElementById('welcome-screen'),
      vocabularyContent: document.getElementById('vocabulary-content'),
      
      // Menu
      sideMenu: document.getElementById('side-menu'),
      menuOverlay: document.getElementById('menu-overlay'),
      closeMenu: document.getElementById('close-menu'),
      
      // Menu links
      homeLink: document.getElementById('home-link'),
      progressLink: document.getElementById('progress-link'),
      favoritesLink: document.getElementById('favorites-link'),
      settingsLink: document.getElementById('settings-link'),
      
      // Settings
      dailyGoalInput: document.getElementById('daily-goal-input'),
      audioSpeedRange: document.getElementById('audio-speed'),
      speedDisplay: document.getElementById('speed-display'),
      autoPlayCheckbox: document.getElementById('auto-play-audio'),
      showProgressAlways: document.getElementById('show-progress-always'),
      
      // Toast container
      toastContainer: document.getElementById('toast-container')
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

    this.elements.progressToggle?.addEventListener('click', () => {
      this.toggleProgress();
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

    this.elements.menuOverlay?.addEventListener('click', () => {
      this.closeMenu();
    });

    // Menu links
    this.elements.homeLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showWelcome();
      this.closeMenu();
    });

    this.elements.progressLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleProgress();
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
    document.addEventListener('click', (e) => {
      if (e.target.matches('.language-card') || e.target.closest('.language-card')) {
        const card = e.target.closest('.language-card') || e.target;
        const lang = card.dataset.lang;
        if (lang && this.elements.languageSelect) {
          this.elements.languageSelect.value = lang;
          this.loadLanguage(lang);
        }
      }
    });

    // Settings
    this.elements.dailyGoalInput?.addEventListener('change', (e) => {
      const goal = parseInt(e.target.value) || CONFIG.defaultDailyGoal;
      appState.dailyGoal = Math.max(5, Math.min(100, goal)); // Limit between 5-100
      storage.save(CONFIG.storageKeys.dailyGoal, appState.dailyGoal);
      progressManager.updateProgressUI();
      this.showMessage(`Daily goal updated to ${appState.dailyGoal} words`, 'success');
    });

    this.elements.audioSpeedRange?.addEventListener('input', (e) => {
      appState.audioSpeed = parseFloat(e.target.value);
      if (this.elements.speedDisplay) {
        this.elements.speedDisplay.textContent = `${appState.audioSpeed}x`;
      }
      storage.save(CONFIG.storageKeys.audioSpeed, appState.audioSpeed);
    });

    this.elements.autoPlayCheckbox?.addEventListener('change', (e) => {
      appState.autoPlay = e.target.checked;
      storage.save(CONFIG.storageKeys.autoPlay, appState.autoPlay);
      const message = appState.autoPlay ? 'Auto-play enabled' : 'Auto-play disabled';
      this.showMessage(message, 'info');
    });

    this.elements.showProgressAlways?.addEventListener('change', (e) => {
      const showAlways = e.target.checked;
      storage.save('speakEU_showProgressAlways', showAlways);
      
      if (showAlways) {
        this.elements.progressDashboard?.classList.remove('hidden');
      } else {
        this.elements.progressDashboard?.classList.add('hidden');
      }
    });

    // Touch/swipe events for mobile
    this.bindTouchEvents();
    
    // Keyboard shortcuts
    this.bindKeyboardEvents();
  }

  bindTouchEvents() {
    let startX = 0;
    let startY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Swipe detection (minimum distance and max duration)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && touchDuration < 500) {
        if (diffX > 0 && !appState.menuOpen) {
          // Swipe left - open menu
          this.openMenu();
        } else if (diffX < 0 && appState.menuOpen) {
          // Swipe right - close menu
          this.closeMenu();
        }
      }

      startX = 0;
      startY = 0;
      touchStartTime = 0;
    }, { passive: true });
  }

  bindKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // ESC key closes menu or clears search
      if (e.key === 'Escape') {
        if (appState.menuOpen) {
          this.closeMenu();
        } else if (this.elements.searchBox?.value) {
          this.clearSearch();
        }
      }
      
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.elements.searchBox?.focus();
      }
      
      // Space for audio (when not typing)
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // Play audio for first visible vocabulary item
        const firstAudioBtn = document.querySelector('.vocabulary-content .audio-btn');
        if (firstAudioBtn) {
          firstAudioBtn.click();
        }
      }
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

  updateUI() {
    // Update UI based on current state
    if (appState.currentLanguage) {
      this.showMainInterface();
    } else {
      this.showWelcome();
    }
    
    progressManager.updateProgressUI();
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
    this.elements.controlPanel?.classList.add('hidden');
    this.elements.progressDashboard?.classList.add('hidden');
    this.elements.filterInfo?.classList.add('hidden');
  }

  showMainInterface() {
    this.elements.welcomeScreen?.classList.add('hidden');
    this.elements.vocabularyContent?.classList.remove('hidden');
    this.elements.controlPanel?.classList.remove('hidden');
    
    // Show progress if enabled
    const showProgressAlways = storage.load('speakEU_showProgressAlways', false);
    if (showProgressAlways) {
      this.elements.progressDashboard?.classList.remove('hidden');
    }
  }

  async loadLanguage(lang) {
    if (!lang || appState.currentLanguage === lang) return;

    try {
      this.showLoading();
      
      const response = await fetch(`languages/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load ${lang}.json`);
      }

      const data = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid vocabulary data format');
      }

      appState.currentLanguage = lang;
      appState.currentVocabulary = data;
      appState.filteredVocabulary = [...data];

      // Save language preference
      storage.save(CONFIG.storageKeys.selectedLanguage, lang);

      // Update UI
      this.showMainInterface();
      this.renderVocabulary();
      this.updateFilterInfo();
      progressManager.updateProgressUI();

      // Show success message
      this.showMessage(`✅ Loaded ${data.length} words for ${this.getLanguageName(lang)}!`, 'success');

    } catch (error) {
      console.error('Error loading language:', error);
      this.showMessage(`❌ Failed to load language: ${error.message}`, 'error');
      
      // Reset to welcome screen on error
      this.showWelcome();
    } finally {
      this.hideLoading();
    }
  }

  getLanguageName(langCode) {
    const names = {
      italy: 'Italian', spain: 'Spanish', germany: 'German', france: 'French',
      greece: 'Greek', portugal: 'Portuguese', russian: 'Russian', netherlands: 'Dutch',
      poland: 'Polish', czech: 'Czech Republic', hungary: 'Hungarian', romania: 'Romanian',
      bulgaria: 'Bulgarian', croatia: 'Croatian', slovakia: 'Slovakia', slovenia: 'Slovenia',
      finland: 'Finnish', sweden: 'Swedish', denmark: 'Danish', norway: 'Norwegian',
      austria: 'Austrian German', belgium: 'Belgian Dutch', estonia: 'Estonian',
      latvia: 'Latvian', lithuania: 'Lithuanian', malta: 'Maltese', luxembourg: 'Luxembourgish',
      iceland: 'Icelandic', liechtenstein: 'Liechtenstein German', switzerland: 'Swiss German'
    };
    return names[langCode] || langCode;
  }

  renderVocabulary() {
    const container = this.elements.vocabularyContent;
    if (!container) return;

    const vocabulary = appState.filteredVocabulary;
    
    if (!vocabulary.length) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No vocabulary found</h3>
          <p>Try adjusting your search or filter criteria.</p>
          <button class="clear-filters-btn" onclick="ui.clearAllFilters()">
            🗑️ Clear All Filters
          </button>
        </div>
      `;
      return;
    }

    const langCode = langCodeMap[appState.currentLanguage];
    const html = vocabulary.map((item, index) => {
      const originalIndex = appState.currentVocabulary.indexOf(item);
      const wordId = `${appState.currentLanguage}_${originalIndex}`;
      const isLearned = appState.learnedWords.has(wordId);
      const isFavorite = appState.favoriteWords.has(wordId);
      
      const localWord = item[langCode] || item.local || '—';
      const bnWord = item.bn || item.phonetic || '—';
      const bnMeaning = item.bnMeaning || item.meaning || '—';
      const enWord = item.en || item.english || '—';

      return `
        <div class="conversation-item ${isLearned ? 'learned' : ''} ${isFavorite ? 'favorite' : ''}" 
             data-word-id="${wordId}" data-index="${originalIndex}">
          
          <div class="vocabulary-controls">
            <button class="control-btn audio-btn" 
                    data-text="${localWord}" 
                    data-lang="${langCode}" 
                    title="Play pronunciation (Space)"
                    aria-label="Play pronunciation">
              🔊
            </button>
            <button class="control-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                    title="Add to favorites"
                    aria-label="Toggle favorite">
              ⭐
            </button>
            <button class="control-btn learned-btn ${isLearned ? 'active' : ''}" 
                    title="Mark as learned"
                    aria-label="Toggle learned">
              ✓
            </button>
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
    
    // Auto-play first word if enabled
    if (appState.autoPlay && vocabulary.length > 0) {
      setTimeout(() => {
        const firstAudioBtn = container.querySelector('.audio-btn');
        if (firstAudioBtn) {
          firstAudioBtn.click();
        }
      }, 1000);
    }
  }

  bindVocabularyEvents() {
    // Audio buttons
    document.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        const lang = btn.dataset.lang;
        
        // Add visual feedback
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 300);
        
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

    // Double-tap to mark as learned (mobile)
    let lastTap = 0;
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
          e.preventDefault();
          const wordId = item.dataset.wordId;
          this.toggleLearned(wordId);
        }
        lastTap = currentTime;
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
        const searchFields = [
          item[langCode], item.local, item.bn, item.phonetic,
          item.bnMeaning, item.meaning, item.en, item.english,
          item.category, item.level
        ];
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
      filtered = filtered.filter((item) => {
        const originalIndex = appState.currentVocabulary.indexOf(item);
        const wordId = `${appState.currentLanguage}_${originalIndex}`;
        return appState.favoriteWords.has(wordId);
      });
    }

    appState.filteredVocabulary = filtered;
    this.renderVocabulary();
    this.updateFilterInfo();
  }

  clearSearch() {
    if (this.elements.searchBox) {
      this.elements.searchBox.value = '';
    }
    appState.searchQuery = '';
    this.applyFilters();
  }

  clearAllFilters() {
    if (this.elements.searchBox) {
      this.elements.searchBox.value = '';
    }
    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.value = '';
    }
    
    appState.searchQuery = '';
    appState.showFavorites = false;
    
    this.elements.favoritesToggle?.classList.remove('active');
    this.applyFilters();
    
    this.showMessage('All filters cleared', 'info');
  }

  updateFilterInfo() {
    if (!this.elements.filterInfo || !this.elements.resultsCount) return;

    const total = appState.currentVocabulary.length;
    const filtered = appState.filteredVocabulary.length;
    
    if (filtered === total && !appState.searchQuery && !appState.showFavorites && !this.elements.categoryFilter?.value) {
      this.elements.filterInfo.classList.add('hidden');
    } else {
      this.elements.filterInfo.classList.remove('hidden');
      this.elements.resultsCount.textContent = `Showing ${filtered} of ${total} words`;
    }
  }

  highlightSearch(text) {
    if (!appState.searchQuery || !text) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(appState.searchQuery)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    const wasLearned = appState.learnedWords.has(wordId);
    
    if (wasLearned) {
      appState.learnedWords.delete(wordId);
      // Decrease today's count if it was learned today
      if (appState.todayLearned > 0) {
        appState.todayLearned--;
      }
    } else {
      appState.learnedWords.add(wordId);
      progressManager.recordWordLearned(wordId);
    }
    
    storage.save(CONFIG.storageKeys.learnedWords, Array.from(appState.learnedWords));
    
    // Update UI
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item?.querySelector('.learned-btn');
    
    if (!wasLearned) {
      item?.classList.add('learned');
      btn?.classList.add('active');
      this.showMessage('Word learned! ✓', 'success');
      
      // Add celebration effect
      item?.classList.add('celebration');
      setTimeout(() => item?.classList.remove('celebration'), 1000);
    } else {
      item?.classList.remove('learned');
      btn?.classList.remove('active');
      this.showMessage('Unmarked as learned', 'info');
    }
    
    progressManager.updateMenuStats();
    progressManager.saveProgress();
  }

  toggleFavorites() {
    appState.showFavorites = !appState.showFavorites;
    this.elements.favoritesToggle?.classList.toggle('active', appState.showFavorites);
    this.applyFilters();
    
    const message = appState.showFavorites ? 'Showing favorites only' : 'Showing all words';
    this.showMessage(message, 'info');
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

  toggleProgress() {
    const isHidden = this.elements.progressDashboard?.classList.contains('hidden');
    
    if (isHidden) {
      this.elements.progressDashboard?.classList.remove('hidden');
      this.elements.progressToggle?.classList.add('active');
      this.showMessage('Progress dashboard shown', 'info');
    } else {
      this.elements.progressDashboard?.classList.add('hidden');
      this.elements.progressToggle?.classList.remove('active');
      this.showMessage('Progress dashboard hidden', 'info');
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    if (this.elements.modeToggle) {
      this.elements.modeToggle.textContent = isDark ? '🌙' : '☀️';
    }
    storage.save(CONFIG.storageKeys.theme, isDark ? 'dark' : 'light');
    
    const message = isDark ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️';
    this.showMessage(message, 'success');
  }

  openMenu() {
    this.elements.sideMenu?.classList.add('active');
    appState.menuOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Update menu stats when opened
    progressManager.updateMenuStats();
  }

  closeMenu() {
    this.elements.sideMenu?.classList.remove('active');
    appState.menuOpen = false;
    document.body.style.overflow = '';
  }

  showMessage(text, type = 'info') {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getToastIcon(type);
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${text}</span>
    `;

    this.elements.toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    // Allow manual dismissal
    toast.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    });
  }

  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  loadSettings() {
    try {
      // Load saved language and auto-load if available
      const savedLang = storage.load(CONFIG.storageKeys.selectedLanguage);
      if (savedLang && this.elements.languageSelect) {
        this.elements.languageSelect.value = savedLang;
        // Don't auto-load on initial page load, let user choose
      }

      // Load theme
      const savedTheme = storage.load(CONFIG.storageKeys.theme);
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (this.elements.modeToggle) {
          this.elements.modeToggle.textContent = '🌙';
        }
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
        if (this.elements.speedDisplay) {
          this.elements.speedDisplay.textContent = `${appState.audioSpeed}x`;
        }
      }
      
      if (this.elements.autoPlayCheckbox) {
        this.elements.autoPlayCheckbox.checked = appState.autoPlay;
      }
      
      if (this.elements.audioToggle) {
        this.elements.audioToggle.classList.toggle('active', appState.audioEnabled);
      }

      // Load progress always setting
      const showProgressAlways = storage.load('speakEU_showProgressAlways', false);
      if (this.elements.showProgressAlways) {
        this.elements.showProgressAlways.checked = showProgressAlways;
      }

      console.log('✅ Settings loaded successfully');

    } catch (error) {
      console.error('❌ Error loading settings:', error);
      this.showMessage('Error loading saved settings', 'warning');
    }
  }
}

// 🚀 Initialize Application
let audioManager, storage, progressManager, ui, scrollManager;

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize managers
    storage = new StorageManager();
    audioManager = new AudioManager();
    progressManager = new ProgressManager();
    scrollManager = new ScrollManager();
    ui = new UIManager();

    // Hide loading spinner after initialization
    setTimeout(() => {
      ui.hideLoading();
    }, 1000);

    console.log('🌟 Speak EU Mobile v2.0 with Scrollable Header initialized successfully!');
    
    // Show welcome message
    setTimeout(() => {
      ui.showMessage('Welcome to Speak EU! Select a language to start learning.', 'info');
    }, 2000);

  } catch (error) {
    console.error('❌ Initialization error:', error);
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: 0.5rem; margin: 1rem;">
        <h3 style="color: #dc2626; margin-bottom: 1rem;">⚠️ Initialization Error</h3>
        <p style="color: #991b1b;">Failed to initialize the application. Please refresh the page.</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
          🔄 Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
});

// 🎯 Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

// 📱 Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (ui && appState.currentLanguage) {
      ui.renderVocabulary();
      progressManager.updateProgressUI();
    }
  }, 100);
});

// 🔄 Handle online/offline status
window.addEventListener('online', () => {
  ui?.showMessage('Connection restored 📶', 'success');
});

window.addEventListener('offline', () => {
  ui?.showMessage('Working offline 📵', 'warning');
});

// 🎯 Handle page visibility changes (for pause/resume)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause audio when page becomes hidden
    audioManager?.stop();
  } else {
    // Resume/update when page becomes visible
    if (ui && appState.currentLanguage) {
      progressManager.updateProgressUI();
    }
  }
});

// 🔧 Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  ui?.showMessage('An unexpected error occurred', 'error');
});

// 🔧 Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  ui?.showMessage('A background error occurred', 'warning');
});

// 🎯 Export for debugging (only in development)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.speakEU = {
    appState,
    audioManager,
    storage,
    progressManager,
    ui,
    scrollManager,
    CONFIG
  };
}
