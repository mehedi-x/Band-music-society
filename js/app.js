// ================================
// MAIN APPLICATION
// ================================

// Global Variables
let currentLanguage = '';
let currentLanguageData = null;
let vocabularyData = [];
let filteredData = [];
let searchQuery = '';
let currentCategory = 'all';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// DOM Elements
const elements = {
  // Navigation
  menuToggle: document.getElementById('menu-toggle'),
  closeMenu: document.getElementById('close-menu'),
  sideMenu: document.getElementById('side-menu'),
  modeToggle: document.getElementById('mode-toggle'),
  
  // Content sections
  welcomeContent: document.getElementById('welcome-content'),
  vocabularyContent: document.getElementById('vocabulary-content'),
  gameContent: document.getElementById('game-content'),
  
  // Language selection
  languageSearch: document.getElementById('language-search'),
  countriesGrid: document.getElementById('countries-grid'),
  startLearningBtn: document.getElementById('start-learning-btn'),
  
  // Vocabulary
  vocabularySearch: document.getElementById('vocabulary-search'),
  vocabularyGrid: document.getElementById('vocabulary-grid'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  
  // Progress
  dailyProgress: document.getElementById('daily-progress'),
  wordsLearnedToday: document.getElementById('words-learned-today'),
  currentStreak: document.getElementById('current-streak'),
  accuracyRate: document.getElementById('accuracy-rate'),
  userLevel: document.getElementById('user-level'),
  levelProgress: document.getElementById('level-progress'),
  
  // Loading
  loadingScreen: document.getElementById('loading-screen')
};

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    showLoading();
    
    // Initialize theme
    initializeTheme();
    
    // Load user data
    loadUserStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render countries
    renderCountries();
    
    // Update progress displays
    updateProgressDisplays();
    
    // Load saved language if any
    const savedLanguage = loadFromStorage(CONFIG.STORAGE_KEYS.selectedLanguage);
    if (savedLanguage && COUNTRIES_DATA[savedLanguage]) {
      await selectLanguage(savedLanguage);
    }
    
    hideLoading();
    showSection('welcome-content');
    
  } catch (error) {
    console.error('App initialization failed:', error);
    showToast('অ্যাপ লোড করতে সমস্যা হয়েছে', 'error');
    hideLoading();
  }
}

function showLoading() {
  if (elements.loadingScreen) {
    elements.loadingScreen.classList.remove('hidden');
  }
}

function hideLoading() {
  if (elements.loadingScreen) {
    elements.loadingScreen.classList.add('hidden');
  }
}

// ================================
// EVENT LISTENERS SETUP
// ================================

function setupEventListeners() {
  // Menu toggle
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', toggleMenu);
  }
  
  if (elements.closeMenu) {
    elements.closeMenu.addEventListener('click', closeMenu);
  }
  
  // Theme toggle
  if (elements.modeToggle) {
    elements.modeToggle.addEventListener('click', toggleTheme);
  }
  
  // Language search
  if (elements.languageSearch) {
    elements.languageSearch.addEventListener('input', handleLanguageSearch);
  }
  
  // Vocabulary search
  if (elements.vocabularySearch) {
    elements.vocabularySearch.addEventListener('input', handleVocabularySearch);
  }
  
  // Start learning button
  if (elements.startLearningBtn) {
    elements.startLearningBtn.addEventListener('click', startLearning);
  }
  
  // Load more button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.addEventListener('click', loadMoreVocabulary);
  }
  
  // Menu navigation
  setupMenuNavigation();
  
  // Filter tabs
  setupFilterTabs();
  
  // Goal buttons
  setupGoalButtons();
  
  // Category tags
  setupCategoryTags();
  
  // Voice search
  setupVoiceSearch();
  
  // Keyboard shortcuts
  setupKeyboardShortcuts();
}

function setupMenuNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.id.replace('menu-', '') + '-content';
      
      // Special handling for different sections
      switch(this.id) {
        case 'menu-home':
          showSection('welcome-content');
          break;
        case 'menu-vocabulary':
          if (currentLanguageData) {
            showSection('vocabulary-content');
          } else {
            showToast('প্রথমে একটি দেশ নির্বাচন করুন', 'warning');
          }
          break;
        case 'menu-games':
          if (currentLanguageData) {
            showSection('game-content');
          } else {
            showToast('প্রথমে একটি দেশ নির্বাচন করুন', 'warning');
          }
          break;
        case 'menu-achievements':
          showAchievements();
          break;
        case 'menu-settings':
          showSettings();
          break;
        default:
          showSection('welcome-content');
      }
      
      // Update active menu item
      menuItems.forEach(mi => mi.classList.remove('active'));
      this.classList.add('active');
      
      closeMenu();
    });
  });
}

function setupFilterTabs() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      filterCountries(filter);
    });
  });
}

function setupGoalButtons() {
  const goalButtons = document.querySelectorAll('.goal-btn');
  goalButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      goalButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const goal = parseInt(this.getAttribute('data-goal'));
      setDailyGoal(goal);
    });
  });
}

function setupCategoryTags() {
  const categoryTags = document.querySelectorAll('.category-tag');
  categoryTags.forEach(tag => {
    tag.addEventListener('click', function() {
      categoryTags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      currentCategory = this.getAttribute('data-category');
      filterVocabulary();
    });
  });
}

function setupVoiceSearch() {
  const voiceBtn = document.getElementById('voice-search-btn');
  if (voiceBtn && 'webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', function() {
      recognition.start();
      this.classList.add('recording');
      showToast('বলুন...', 'info', 3000);
    });
    
    recognition.onresult = function(event) {
      const result = event.results[0][0].transcript;
      elements.vocabularySearch.value = result;
      handleVocabularySearch();
      voiceBtn.classList.remove('recording');
    };
    
    recognition.onerror = function() {
      voiceBtn.classList.remove('recording');
      showToast('ভয়েস রিকগনিশন ব্যর্থ হয়েছে', 'error');
    };
  } else if (voiceBtn) {
    voiceBtn.style.display = 'none';
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(event) {
    // Only handle shortcuts when not typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch(event.key) {
      case '/':
        event.preventDefault();
        if (elements.vocabularySearch) {
          elements.vocabularySearch.focus();
        }
        break;
      case 'Escape':
        closeMenu();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        if (event.ctrlKey) {
          event.preventDefault();
          const sections = ['welcome-content', 'vocabulary-content', 'game-content'];
          const index = parseInt(event.key) - 1;
          if (sections[index]) {
            showSection(sections[index]);
          }
        }
        break;
    }
  });
}

// ================================
// THEME MANAGEMENT
// ================================

function initializeTheme() {
  const savedTheme = loadFromStorage(CONFIG.STORAGE_KEYS.theme, 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  saveToStorage(CONFIG.STORAGE_KEYS.theme, newTheme);
  updateThemeIcon(newTheme);
  
  showToast(`${newTheme === 'dark' ? 'ডার্ক' : 'লাইট'} থিম সক্রিয় করা হয়েছে`, 'success');
}

function updateThemeIcon(theme) {
  const icon = elements.modeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// ================================
// MENU MANAGEMENT
// ================================

function toggleMenu() {
  if (elements.sideMenu) {
    elements.sideMenu.classList.toggle('open');
  }
}

function closeMenu() {
  if (elements.sideMenu) {
    elements.sideMenu.classList.remove('open');
  }
}

// ================================
// SECTION MANAGEMENT
// ================================

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update current country display
  updateCurrentCountryDisplay();
}

// ================================
// COUNTRY MANAGEMENT
// ================================

function renderCountries() {
  if (!elements.countriesGrid) return;
  
  const countries = Object.entries(COUNTRIES_DATA);
  const countryCards = countries.map(([code, data]) => {
    return createCountryCard(code, data);
  }).join('');
  
  elements.countriesGrid.innerHTML = countryCards;
  
  // Add click handlers
  const countryCards_elements = elements.countriesGrid.querySelectorAll('.country-card');
  countryCards_elements.forEach(card => {
    card.addEventListener('click', function() {
      const countryCode = this.getAttribute('data-country');
      selectCountry(countryCode);
    });
  });
}

function createCountryCard(code, data) {
  const isSelected = currentLanguage === code;
  const schengBadge = data.isSchengen ? '<div class="schengen-badge">শেনজেন</div>' : '';
  
  return `
    <div class="country-card ${isSelected ? 'selected' : ''}" data-country="${code}">
      ${schengBadge}
      <div class="country-flag">${data.flag}</div>
      <div class="country-info">
        <h4>${data.name}</h4>
        <div class="country-language">${data.language}</div>
        <div class="country-features">
          <span class="feature-tag difficulty-${data.difficulty}">${getDifficultyText(data.difficulty)}</span>
          <span class="feature-tag">${data.capital}</span>
        </div>
      </div>
    </div>
  `;
}

function getDifficultyText(difficulty) {
  const difficultyMap = {
    'easy': 'সহজ',
    'medium': 'মাঝারি',
    'hard': 'কঠিন'
  };
  return difficultyMap[difficulty] || 'মাঝারি';
}

function selectCountry(countryCode) {
  // Update selection visual
  const countryCards = document.querySelectorAll('.country-card');
  countryCards.forEach(card => {
    card.classList.remove('selected');
  });
  
  const selectedCard = document.querySelector(`[data-country="${countryCode}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  // Load language data
  selectLanguage(countryCode);
  
  // Show start button
  if (elements.startLearningBtn) {
    elements.startLearningBtn.style.display = 'flex';
  }
}

async function selectLanguage(countryCode) {
  try {
    currentLanguage = countryCode;
    const countryData = COUNTRIES_DATA[countryCode];
    
    if (!countryData) {
      throw new Error('দেশের ডেটা পাওয়া যায়নি');
    }
    
    showToast(`${countryData.name} নির্বাচিত হয়েছে`, 'success');
    
    // Generate vocabulary data
    const languageKey = LANGUAGE_FILES[countryCode] || 'german';
    currentLanguageData = generateVocabularyData(countryData.language, languageKey);
    vocabularyData = currentLanguageData;
    
    // Save selection
    saveToStorage(CONFIG.STORAGE_KEYS.selectedLanguage, countryCode);
    
    // Update displays
    updateCurrentCountryDisplay();
    
    return true;
  } catch (error) {
    console.error('Language selection failed:', error);
    showToast('ভাষা নির্বাচনে সমস্যা হয়েছে', 'error');
    return false;
  }
}

function updateCurrentCountryDisplay() {
  const currentCountryElement = document.getElementById('current-country');
  if (currentCountryElement && currentLanguage && COUNTRIES_DATA[currentLanguage]) {
    const countryData = COUNTRIES_DATA[currentLanguage];
    currentCountryElement.querySelector('.country-flag').textContent = countryData.flag;
    currentCountryElement.querySelector('.country-name').textContent = countryData.name;
  }
}

// ================================
// SEARCH AND FILTERING
// ================================

function handleLanguageSearch() {
  const query = elements.languageSearch.value.toLowerCase();
  const countryCards = document.querySelectorAll('.country-card');
  
  countryCards.forEach(card => {
    const countryCode = card.getAttribute('data-country');
    const countryData = COUNTRIES_DATA[countryCode];
    const searchText = `${countryData.name} ${countryData.language}`.toLowerCase();
    
    if (searchText.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterCountries(filter) {
  const countryCards = document.querySelectorAll('.country-card');
  
  countryCards.forEach(card => {
    const countryCode = card.getAttribute('data-country');
    const countryData = COUNTRIES_DATA[countryCode];
    let show = false;
    
    switch(filter) {
      case 'all':
        show = true;
        break;
      case 'schengen':
        show = countryData.isSchengen;
        break;
      case 'easy':
        show = countryData.difficulty === 'easy';
        break;
      case 'popular':
        show = ['germany', 'france', 'spain', 'italy'].includes(countryCode);
        break;
    }
    
    card.style.display = show ? 'block' : 'none';
  });
}

function handleVocabularySearch() {
  searchQuery = elements.vocabularySearch.value.toLowerCase();
  currentPage = 1;
  filterVocabulary();
}

function filterVocabulary() {
  if (!vocabularyData) return;
  
  filteredData = vocabularyData.filter(word => {
    const matchesSearch = !searchQuery || 
      word.word.toLowerCase().includes(searchQuery) ||
      word.meaning.toLowerCase().includes(searchQuery) ||
      word.pronunciation.toLowerCase().includes(searchQuery);
    
    const matchesCategory = currentCategory === 'all' || word.categoryKey === currentCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  renderVocabulary();
}

// ================================
// VOCABULARY RENDERING
// ================================

function renderVocabulary() {
  if (!elements.vocabularyGrid || !filteredData) return;
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = filteredData.slice(0, endIndex);
  
  if (currentPage === 1) {
    elements.vocabularyGrid.innerHTML = '';
  }
  
  const vocabularyCards = pageData.slice(startIndex).map(word => {
    return createVocabularyCard(word);
  }).join('');
  
  elements.vocabularyGrid.insertAdjacentHTML('beforeend', vocabularyCards);
  
  // Update load more button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = endIndex < filteredData.length ? 'block' : 'none';
  }
  
  // Add click handlers for new cards
  const newCards = elements.vocabularyGrid.querySelectorAll('.vocabulary-card:not([data-initialized])');
  newCards.forEach(card => {
    card.setAttribute('data-initialized', 'true');
    setupVocabularyCardEvents(card);
  });
}

function createVocabularyCard(word) {
  const isLearned = word.learned;
  const learnedBadge = isLearned ? '<div class="learned-badge">শিখেছেন</div>' : '';
  
  return `
    <div class="vocabulary-card ${isLearned ? 'learned' : ''}" data-word-id="${word.id}">
      ${learnedBadge}
      <div class="word-header">
        <div class="word-info">
          <h3>${highlightText(word.word, searchQuery)}</h3>
          <div class="word-pronunciation">[${word.pronunciation}]</div>
        </div>
        <div class="word-actions">
          <button class="word-btn audio-btn" title="উচ্চারণ শুনুন">
            <i class="fas fa-volume-up"></i>
          </button>
          <button class="word-btn favorite-btn" title="পছন্দের তালিকায় যোগ করুন">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="word-meaning">${highlightText(word.meaning, searchQuery)}</div>
      <div class="word-category">${word.category}</div>
      <div class="word-example">${word.example}</div>
    </div>
  `;
}

function setupVocabularyCardEvents(card) {
  const wordId = parseInt(card.getAttribute('data-word-id'));
  const word = vocabularyData.find(w => w.id === wordId);
  
  if (!word) return;
  
  // Audio button
  const audioBtn = card.querySelector('.audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      playWordAudio(word);
    });
  }
  
  // Favorite button
  const favoriteBtn = card.querySelector('.favorite-btn');
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFavorite(word);
    });
  }
  
  // Card click to mark as learned
  card.addEventListener('click', function() {
    toggleWordLearned(word, card);
  });
}

function playWordAudio(word) {
  const languageKey = LANGUAGE_FILES[currentLanguage] || 'german';
  audioSystem.playWord(word.word, languageKey);
}

function toggleFavorite(word) {
  // Implementation for favorites
  showToast('পছন্দের তালিকায় যোগ করা হয়েছে', 'success');
}

function toggleWordLearned(word, card) {
  word.learned = !word.learned;
  word.lastReviewed = Date.now();
  
  if (word.learned) {
    card.classList.add('learned');
    if (!card.querySelector('.learned-badge')) {
      card.insertAdjacentHTML('afterbegin', '<div class="learned-badge">শিখেছেন</div>');
    }
    showToast('শব্দটি শেখা হয়েছে বলে চিহ্নিত করা হয়েছে!', 'success');
    updateWordsLearned(1);
  } else {
    card.classList.remove('learned');
    const badge = card.querySelector('.learned-badge');
    if (badge) badge.remove();
    showToast('শব্দটি আনলার্নড করা হয়েছে', 'info');
    updateWordsLearned(-1);
  }
  
  // Save progress
  saveVocabularyProgress();
}

function loadMoreVocabulary() {
  currentPage++;
  renderVocabulary();
}

// ================================
// PROGRESS MANAGEMENT
// ================================

function loadUserStats() {
  const defaultStats = {
    totalWordsLearned: 0,
    currentStreak: 0,
    bestStreak: 0,
    accuracyRate: 0,
    gamesPlayed: 0,
    timeSpent: 0,
    lastActiveDate: null,
    languageProgress: {}
  };
  
  const userStats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, defaultStats);
  
  // Check if streak should be reset
  const today = getTodayDate();
  if (userStats.lastActiveDate && userStats.lastActiveDate !== today) {
    const lastDate = new Date(userStats.lastActiveDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      userStats.currentStreak = 0;
    }
  }
  
  return userStats;
}

function updateWordsLearned(increment) {
  const userStats = loadUserStats();
  const dailyProgress = getDailyProgress();
  
  userStats.totalWordsLearned = Math.max(0, userStats.totalWordsLearned + increment);
  dailyProgress.wordsLearned = Math.max(0, dailyProgress.wordsLearned + increment);
  
  // Update streak
  const today = getTodayDate();
  if (userStats.lastActiveDate !== today && increment > 0) {
    userStats.currentStreak++;
    userStats.bestStreak = Math.max(userStats.bestStreak, userStats.currentStreak);
    userStats.lastActiveDate = today;
  }
  
  // Save data
  saveToStorage(CONFIG.STORAGE_KEYS.userStats, userStats);
  saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, dailyProgress);
  
  // Update displays
  updateProgressDisplays();
  
  // Check achievements
  const achievements = achievementSystem.checkAchievements(userStats, loadFromStorage(CONFIG.STORAGE_KEYS.gameStats, {}));
  achievements.forEach(achievement => {
    console.log('New achievement unlocked:', achievement.name);
  });
}

function updateProgressDisplays() {
  const userStats = loadUserStats();
  const dailyProgress = getDailyProgress();
  
  // Update progress elements
  if (elements.wordsLearnedToday) {
    elements.wordsLearnedToday.textContent = dailyProgress.wordsLearned;
  }
  
  if (elements.currentStreak) {
    elements.currentStreak.textContent = userStats.currentStreak;
  }
  
  const headerStreak = document.getElementById('header-streak');
  if (headerStreak) {
    headerStreak.textContent = userStats.currentStreak;
  }
  
  if (elements.accuracyRate) {
    const accuracy = dailyProgress.totalAttempts > 0 
      ? Math.round((dailyProgress.correctAnswers / dailyProgress.totalAttempts) * 100)
      : 0;
    elements.accuracyRate.textContent = `${accuracy}%`;
  }
  
  // Update daily progress bar
  if (elements.dailyProgress) {
    const progressPercentage = Math.min(100, (dailyProgress.wordsLearned / dailyProgress.target) * 100);
    elements.dailyProgress.style.width = `${progressPercentage}%`;
  }
  
  const dailyTarget = document.getElementById('daily-target');
  if (dailyTarget) {
    dailyTarget.textContent = `${dailyProgress.wordsLearned}/${dailyProgress.target}`;
  }
  
  // Update user level
  updateUserLevel(userStats.totalWordsLearned);
}

function updateUserLevel(totalWords) {
  const level = calculateUserLevel(totalWords);
  const levelData = CONFIG.LEVELS[level];
  
  if (elements.userLevel) {
    elements.userLevel.textContent = `লেভেল ${level}: ${levelData.name}`;
  }
  
  if (elements.levelProgress) {
    const progress = ((totalWords - levelData.minWords) / (levelData.maxWords - levelData.minWords)) * 100;
    elements.levelProgress.style.width = `${Math.min(100, progress)}%`;
  }
}

function setDailyGoal(goal) {
  const dailyProgress = getDailyProgress();
  dailyProgress.target = goal;
  saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, dailyProgress);
  updateProgressDisplays();
  showToast(`দৈনিক লক্ষ্য ${goal}টি শব্দে সেট করা হয়েছে`, 'success');
}

function saveVocabularyProgress() {
  if (vocabularyData && currentLanguage) {
    const progressData = {
      language: currentLanguage,
      vocabulary: vocabularyData,
      lastUpdated: Date.now()
    };
    saveToStorage(CONFIG.STORAGE_KEYS.vocabulary + '_' + currentLanguage, progressData);
  }
}

// ================================
// ADDITIONAL FEATURES
// ================================

function startLearning() {
  if (currentLanguageData && currentLanguageData.length > 0) {
    showSection('vocabulary-content');
    currentPage = 1;
    filterVocabulary();
    showToast('শেখা শুরু করুন! 📚', 'success');
  } else {
    showToast('প্রথমে একটি দেশ নির্বাচন করুন', 'warning');
  }
}

function showAchievements() {
  const userStats = loadUserStats();
  const gameStats = loadFromStorage(CONFIG.STORAGE_KEYS.gameStats, {});
  
  let achievementsHTML = '<div class="achievements-grid">';
  
  Object.values(CONFIG.ACHIEVEMENTS).forEach(achievement => {
    const isUnlocked = achievementSystem.isUnlocked(achievement.id);
    const progress = achievementSystem.getAchievementProgress(achievement, userStats, gameStats);
    
    achievementsHTML += `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${!isUnlocked ? `
          <div class="achievement-progress">
            <div class="progress-text">${progress.current}/${progress.total}</div>
            <div class="achievement-progress-bar">
              <div class="achievement-progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  achievementsHTML += '</div>';
  
  showModal('অর্জনসমূহ', achievementsHTML);
}

function showSettings() {
  const settingsHTML = `
    <div class="settings-content">
      <div class="setting-item">
        <h4>থিম</h4>
        <button class="action-btn" onclick="toggleTheme()">
          <i class="fas fa-palette"></i>
          <span>থিম পরিবর্তন করুন</span>
        </button>
      </div>
      <div class="setting-item">
        <h4>ডেটা</h4>
        <button class="action-btn" onclick="exportData()">
          <i class="fas fa-download"></i>
          <span>ডেটা এক্সপোর্ট করুন</span>
        </button>
        <button class="action-btn" onclick="clearAllData()">
          <i class="fas fa-trash"></i>
          <span>সব ডেটা মুছুন</span>
        </button>
      </div>
      <div class="setting-item">
        <h4>সাহায্য</h4>
        <button class="action-btn" onclick="showHelp()">
          <i class="fas fa-question-circle"></i>
          <span>সাহায্য দেখুন</span>
        </button>
      </div>
    </div>
  `;
  
  showModal('সেটিংস', settingsHTML);
}

function exportData() {
  const data = {
    userStats: loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {}),
    vocabulary: loadFromStorage(CONFIG.STORAGE_KEYS.vocabulary, {}),
    achievements: loadFromStorage(CONFIG.STORAGE_KEYS.achievements, []),
    gameStats: loadFromStorage(CONFIG.STORAGE_KEYS.gameStats, {}),
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `euroLang_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  showToast('ডেটা এক্সপোর্ট সম্পন্ন হয়েছে', 'success');
}

function clearAllData() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।')) {
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reset app state
    currentLanguage = '';
    currentLanguageData = null;
    vocabularyData = [];
    filteredData = [];
    
    showToast('সব ডেটা মুছে ফেলা হয়েছে', 'success');
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

function showHelp() {
  const helpHTML = `
    <div class="help-content">
      <h4>কীভাবে ব্যবহার করবেন:</h4>
      <ul>
        <li>একটি দেশ নির্বাচন করুন</li>
        <li>"শেখা শুরু করুন" বাটনে ক্লিক করুন</li>
        <li>শব্দের উপর ক্লিক করে শিখেছেন বলে চিহ্নিত করুন</li>
        <li>গেমস খেলে অনুশীলন করুন</li>
      </ul>
      
      <h4>কীবোর্ড শর্টকাট:</h4>
      <ul>
        <li><kbd>/</kbd> - অনুসন্ধান বক্সে ফোকাস</li>
        <li><kbd>Esc</kbd> - মেনু বন্ধ করুন</li>
        <li><kbd>Ctrl + 1-3</kbd> - বিভিন্ন বিভাগে যান</li>
      </ul>
    </div>
  `;
  
  showModal('সাহায্য', helpHTML);
}

// ================================
// MODAL SYSTEM
// ================================

function showModal(title, content) {
  const modal = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modal && modalTitle && modalBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('show');
  }
}

function hideModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('modal-overlay');
  const modalContent = document.querySelector('.modal');
  
  if (modal && modal.classList.contains('show') && 
      !modalContent.contains(event.target)) {
    hideModal();
  }
});

// Close modal button
document.addEventListener('DOMContentLoaded', function() {
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
});

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

function highlightText(text, query) {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function getDailyProgress() {
  const today = getTodayDate();
  let progress = loadFromStorage(CONFIG.STORAGE_KEYS.dailyProgress, {
    date: today,
    wordsLearned: 0,
    target: CONFIG.DAILY_TARGET,
    correctAnswers: 0,
    totalAttempts: 0
  });
  
  if (progress.date !== today) {
    progress = {
      date: today,
      wordsLearned: 0,
      target: progress.target || CONFIG.DAILY_TARGET,
      correctAnswers: 0,
      totalAttempts: 0
    };
    saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, progress);
  }
  
  return progress;
}

// ================================
// TOAST SYSTEM
// ================================

function showToast(message, type = 'info', duration = 4000) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#0066cc'
  };
  
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.className = 'toast-notification show';
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; color: #333;">
      <span style="font-size: 18px;">${icons[type] || icons.info}</span>
      <span style="flex: 1; font-weight: 500;">${message}</span>
      <button style="background: none; border: none; font-size: 16px; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">✖</button>
    </div>
  `;
  
  toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, duration);
}

// ================================
// EXPORT GLOBAL FUNCTIONS
// ================================

window.showSection = showSection;
window.showModal = showModal;
window.hideModal = hideModal;
window.showToast = showToast;
window.toggleTheme = toggleTheme;
window.exportData = exportData;
window.clearAllData = clearAllData;
window.showHelp = showHelp;
