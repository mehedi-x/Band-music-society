// 🌟 Speak EU - Complete Mobile Friendly Language Learning Platform
// Version 2.0 Mobile - Optimized with Scrollable Header

const CONFIG = {
  version: '2.0-mobile-scroll',
  defaultDailyGoal: 10,
  audioSpeed: 1.0,
  audioVolume: 0.8,
  autoPlay: false,
  
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
  
  scrollThreshold: 100,
  headerAnimationDuration: 300
};

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

let appState = {
  currentLanguage: '',
  currentVocabulary: [],
  filteredVocabulary: [],
  searchQuery: '',
  selectedCategory: '',
  showFavorites: false,
  learnedWords: new Set(),
  favoriteWords: new Set(),
  dailyGoal: CONFIG.defaultDailyGoal,
  todayLearned: 0,
  currentStreak: 0,
  lastStudyDate: null,
  audioEnabled: true,
  autoPlay: CONFIG.autoPlay,
  audioSpeed: CONFIG.audioSpeed,
  isLoading: false,
  menuOpen: false,
  progressVisible: false,
  lastScrollY: 0,
  scrollDirection: 'up',
  headerVisible: true
};

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

    window.addEventListener('resize', this.debounce(() => {
      this.updateScrollState();
    }, 150));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - this.lastScrollY;
    
    if (scrollDifference > 0) {
      appState.scrollDirection = 'down';
    } else if (scrollDifference < 0) {
      appState.scrollDirection = 'up';
    }

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
    }
    
    if (this.elements.mainHeader) {
      this.elements.mainHeader.style.top = '0';
    }
  }

  showTopHeader() {
    if (this.elements.topHeader) {
      this.elements.topHeader.style.transform = 'translateY(0)';
      this.elements.topHeader.style.opacity = '1';
    }
    
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

class AudioManager {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  getBestVoice(languageCode) {
    const exactMatch = this.voices.find(voice => 
      voice.lang.toLowerCase() === languageCode.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
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
}

class ProgressManager {
  constructor() {
    this.loadProgress();
  }

  recordWordLearned(wordId) {
    const today = this.getTodayKey();
    
    appState.todayLearned++;
    this.updateStreak();
    this.saveProgress();
    this.updateProgressUI();
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
      ui?.showMessage('🎉 অভিনন্দন! আজকের লক্ষ্য অর্জিত!', 'success');
      this.triggerCelebration();
    }
  }

  triggerCelebration() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.classList.add('celebration');
      setTimeout(() => {
        progressFill.classList.remove('celebration');
      }, 2000);
    }
  }

  updateProgressUI() {
    const progressFill = document.getElementById('progress-fill');
    const dailyProgress = document.getElementById('daily-progress');
    const dailyPercentage = document.getElementById('daily-percentage');
    const streakCounter = document.getElementById('streak-counter');

    if (progressFill) {
      const percentage = this.getProgressPercentage();
      progressFill.style.width = `${percentage}%`;
      
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
      const totalAttempted = appState.learnedWords.size + (appState.todayLearned * 0.1);
      const accuracy = totalAttempted > 0 ? Math.round((appState.learnedWords.size / totalAttempted) * 100) : 100;
      accuracyRate.textContent = `${Math.min(accuracy, 100)}%`;
    }

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
    
    const dailyData = storage.load(CONFIG.storageKeys.dailyProgress, {});
    appState.todayLearned = dailyData[today] || 0;
    
    if (appState.lastStudyDate && appState.lastStudyDate !== today && !this.isConsecutiveDay(appState.lastStudyDate, today)) {
      appState.currentStreak = 0;
      appState.todayLearned = 0;
    }
  }

  saveProgress() {
    const today = this.getTodayKey();
    
    storage.save(CONFIG.storageKeys.currentStreak, appState.currentStreak);
    storage.save(CONFIG.storageKeys.lastStudyDate, appState.lastStudyDate);
    
    const dailyData = storage.load(CONFIG.storageKeys.dailyProgress, {});
    dailyData[today] = appState.todayLearned;
    storage.save(CONFIG.storageKeys.dailyProgress, dailyData);
  }
}

class UIManager {
  constructor() {
    this.elements = this.getElements();
    this.bindEvents();
    this.loadSettings();
    this.updateUI();
  }

  getElements() {
    return {
      loadingSpinner: document.getElementById('loading-spinner'),
      topHeader: document.getElementById('top-header'),
      mainHeader: document.getElementById('main-header'),
      languageSelect: document.getElementById('language-select'),
      modeToggle: document.getElementById('mode-toggle'),
      menuToggle: document.getElementById('menu-toggle'),
      controlPanel: document.getElementById('control-panel'),
      searchBox: document.getElementById('search-box'),
      clearSearch: document.getElementById('clear-search'),
      categoryFilter: document.getElementById('category-filter'),
      favoritesToggle: document.getElementById('favorites-toggle'),
      audioToggle: document.getElementById('audio-toggle'),
      progressToggle: document.getElementById('progress-toggle'),
      progressDashboard: document.getElementById('progress-dashboard'),
      progressFill: document.getElementById('progress-fill'),
      dailyProgress: document.getElementById('daily-progress'),
      dailyPercentage: document.getElementById('daily-percentage'),
      streakCounter: document.getElementById('streak-counter'),
      filterInfo: document.getElementById('filter-info'),
      resultsCount: document.getElementById('results-count'),
      clearFilters: document.getElementById('clear-filters'),
      mainContent: document.getElementById('main-content'),
      welcomeScreen: document.getElementById('welcome-screen'),
      vocabularyContent: document.getElementById('vocabulary-content'),
      sideMenu: document.getElementById('side-menu'),
      menuOverlay: document.getElementById('menu-overlay'),
      closeMenu: document.getElementById('close-menu'),
      homeLink: document.getElementById('home-link'),
      progressLink: document.getElementById('progress-link'),
      favoritesLink: document.getElementById('favorites-link'),
      settingsLink: document.getElementById('settings-link'),
      dailyGoalInput: document.getElementById('daily-goal-input'),
      audioSpeedRange: document.getElementById('audio-speed'),
      speedDisplay: document.getElementById('speed-display'),
      autoPlayCheckbox: document.getElementById('auto-play-audio'),
      showProgressAlways: document.getElementById('show-progress-always'),
      toastContainer: document.getElementById('toast-container')
    };
  }

  bindEvents() {
    this.elements.languageSelect?.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (lang) {
        this.loadLanguage(lang);
      }
    });

    this.elements.searchBox?.addEventListener('input', this.debounce(() => {
      this.handleSearch();
    }, 300));

    this.elements.clearSearch?.addEventListener('click', () => {
      this.clearSearch();
    });

    this.elements.categoryFilter?.addEventListener('change', () => {
      this.applyFilters();
    });

    this.elements.favoritesToggle?.addEventListener('click', () => {
      this.toggleFavorites();
    });

    this.elements.audioToggle?.addEventListener('click', () => {
      this.toggleAudio();
    });

    this.elements.progressToggle?.addEventListener('click', () => {
      this.toggleProgress();
    });

    this.elements.modeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });

    this.elements.menuToggle?.addEventListener('click', () => {
      this.openMenu();
    });

    this.elements.closeMenu?.addEventListener('click', () => {
      this.closeMenu();
    });

    this.elements.menuOverlay?.addEventListener('click', () => {
      this.closeMenu();
    });

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

    this.elements.clearFilters?.addEventListener('click', () => {
      this.clearAllFilters();
    });

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

    this.elements.dailyGoalInput?.addEventListener('change', (e) => {
      const goal = parseInt(e.target.value) || CONFIG.defaultDailyGoal;
      appState.dailyGoal = Math.max(5, Math.min(100, goal));
      storage.save(CONFIG.storageKeys.dailyGoal, appState.dailyGoal);
      progressManager.updateProgressUI();
      this.showMessage(`দৈনিক লক্ষ্য ${appState.dailyGoal} শব্দে আপডেট হয়েছে`, 'success');
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
      const message = appState.autoPlay ? 'অটো-প্লে চালু হয়েছে' : 'অটো-প্লে বন্ধ হয়েছে';
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

    this.bindTouchEvents();
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

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && touchDuration < 500) {
        if (diffX > 0 && !appState.menuOpen) {
          this.openMenu();
        } else if (diffX < 0 && appState.menuOpen) {
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
      if (e.key === 'Escape') {
        if (appState.menuOpen) {
          this.closeMenu();
        } else if (this.elements.searchBox?.value) {
          this.clearSearch();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.elements.searchBox?.focus();
      }
      
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
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
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid vocabulary data format');
      }

      appState.currentLanguage = lang;
      appState.currentVocabulary = data;
      appState.filteredVocabulary = [...data];

      storage.save(CONFIG.storageKeys.selectedLanguage, lang);

      this.showMainInterface();
      this.renderVocabulary();
      this.updateFilterInfo();
      progressManager.updateProgressUI();

      this.showMessage(`✅ ${data.length} শব্দ লোড হয়েছে!`, 'success');

    } catch (error) {
      console.error('Error loading language:', error);
      this.showMessage(`❌ ভাষা লোড করতে ব্যর্থ: ${error.message}`, 'error');
      this.showWelcome();
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
          <h3>কোন শব্দভান্ডার খুঁজে পাওয়া যায়নি</h3>
          <p>আপনার অনুসন্ধান বা ফিল্টার সংশোধন করুন।</p>
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
                    title="উচ্চারণ শুনুন">🔊</button>
            <button class="control-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                    title="পছন্দের তালিকায় যোগ করুন">⭐</button>
            <button class="control-btn learned-btn ${isLearned ? 'active' : ''}" 
                    title="শেখা হিসেবে চিহ্নিত করুন">✓</button>
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
    document.querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.text;
        const lang = btn.dataset.lang;
        audioManager.speak(text, lang);
      });
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordId = btn.closest('.conversation-item').dataset.wordId;
        this.toggleFavorite(wordId);
      });
    });

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

    const selectedCategory = this.elements.categoryFilter?.value;
    if (selectedCategory) {
      filtered = filtered.filter(item => {
        const category = item.category || 'basic';
        return category === selectedCategory;
      });
    }

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
    
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item?.querySelector('.favorite-btn');
    
    if (appState.favoriteWords.has(wordId)) {
      item?.classList.add('favorite');
      btn?.classList.add('active');
      this.showMessage('পছন্দের তালিকায় যোগ হয়েছে! ⭐', 'success');
    } else {
      item?.classList.remove('favorite');
      btn?.classList.remove('active');
      this.showMessage('পছন্দের তালিকা থেকে সরানো হয়েছে', 'info');
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
    
    const item = document.querySelector(`[data-word-id="${wordId}"]`);
    const btn = item?.querySelector('.learned-btn');
    
    if (appState.learnedWords.has(wordId)) {
      item?.classList.add('learned');
      btn?.classList.add('active');
      this.showMessage('শব্দটি শেখা হয়েছে! ✓', 'success');
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
      this.showMessage('অডিও চালু করা হয়েছে 🔊', 'success');
    } else {
      this.showMessage('অডিও বন্ধ করা হয়েছে 🔇', 'info');
      audioManager.stop();
    }
  }

  toggleProgress() {
    appState.progressVisible = !appState.progressVisible;
    this.elements.progressToggle?.classList.toggle('active', appState.progressVisible);
    
    if (appState.progressVisible) {
      this.elements.progressDashboard?.classList.remove('hidden');
      this.showMessage('প্রগ্রেস ড্যাশবোর্ড দেখানো হচ্ছে', 'info');
    } else {
      this.elements.progressDashboard?.classList.add('hidden');
      this.showMessage('প্রগ্রেস ড্যাশবোর্ড লুকানো হয়েছে', 'info');
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    this.elements.modeToggle.textContent = isDark ? '🌙' : '☀️';
    storage.save(CONFIG.storageKeys.theme, isDark ? 'dark' : 'light');
  }

  openMenu() {
    this.elements.sideMenu?.classList.add('active');
    appState.menuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.elements.sideMenu?.classList.remove('active');
    appState.menuOpen = false;
    document.body.style.overflow = '';
  }

  showMessage(text, type = 'info') {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="toast-text">${text}</span>
      </div>
      <button class="toast-close">✕</button>
    `;

    this.elements.toastContainer.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  loadSettings() {
    const savedLang = storage.load(CONFIG.storageKeys.selectedLanguage);
    if (savedLang && this.elements.languageSelect) {
      this.elements.languageSelect.value = savedLang;
      this.loadLanguage(savedLang);
    }

    const savedTheme = storage.load(CONFIG.storageKeys.theme);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.elements.modeToggle.textContent = '🌙';
    }

    appState.learnedWords = new Set(storage.load(CONFIG.storageKeys.learnedWords, []));
    appState.favoriteWords = new Set(storage.load(CONFIG.storageKeys.favoriteWords, []));
    appState.dailyGoal = storage.load(CONFIG.storageKeys.dailyGoal, CONFIG.defaultDailyGoal);
    appState.audioEnabled = storage.load(CONFIG.storageKeys.audioEnabled, true);
    appState.autoPlay = storage.load(CONFIG.storageKeys.autoPlay, false);
    appState.audioSpeed = storage.load(CONFIG.storageKeys.audioSpeed, CONFIG.audioSpeed);

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

let audioManager, storage, progressManager, ui, scrollManager;

document.addEventListener('DOMContentLoaded', () => {
  audioManager = new AudioManager();
  storage = new StorageManager();
  progressManager = new ProgressManager();
  ui = new UIManager();
  scrollManager = new ScrollManager();

  setTimeout(() => {
    ui.hideLoading();
  }, 1000);

  console.log('🌟 Speak EU Mobile v2.0 initialized successfully!');
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (ui && appState.currentLanguage) {
      ui.renderVocabulary();
    }
  }, 100);
});

window.addEventListener('online', () => {
  ui?.showMessage('ইন্টারনেট সংযোগ পুনরায় স্থাপিত হয়েছে 📶', 'success');
});

window.addEventListener('offline', () => {
  ui?.showMessage('ইন্টারনেট সংযোগ বিচ্ছিন্ন হয়েছে 📵', 'info');
});
