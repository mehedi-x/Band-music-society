// 🎯 কনফিগারেশন
const CONFIG = {
  DAILY_TARGET: 10,
  LANGUAGES_PATH: 'Language/', // ভাষার ফাইলের পথ (আপডেট করেছি)
  AUDIO_PATH: 'audio/',
  STORAGE_KEYS: {
    selectedLanguage: 'speak_eu_language',
    theme: 'speak_eu_theme',
    dailyProgress: 'speak_eu_daily_progress',
    userStats: 'speak_eu_user_stats',
    userLevel: 'speak_eu_user_level',
    achievements: 'speak_eu_achievements'
  },
  ACHIEVEMENTS: {
    FIRST_WORDS: { id: 'first_10', threshold: 10, name: 'প্রথম ১০টি শব্দ', icon: '🥇' },
    CONSISTENT: { id: 'streak_7', threshold: 7, name: '৭ দিন ধারাবাহিক', icon: '🔥' },
    POLYGLOT: { id: 'languages_3', threshold: 3, name: '৩টি ভাষা শিখেছেন', icon: '🌍' },
    MASTER: { id: 'words_100', threshold: 100, name: '১০০টি শব্দ আয়ত্ত', icon: '🎓' }
  }
};

// 🎮 DOM এলিমেন্টস
const elements = {
  languageSelect: document.getElementById('language-select'),
  languageSearch: document.getElementById('language-search'),
  startLearningBtn: document.getElementById('start-learning-btn'),
  conversationArea: document.getElementById('conversation-area'),
  welcomeContent: document.getElementById('welcome-content'),
  vocabularyContent: document.getElementById('vocabulary-content'),
  gameContent: document.getElementById('game-content'),
  loadingContainer: document.getElementById('loading-container'),
  searchSection: document.getElementById('search-section'),
  progressSection: document.getElementById('progress-section'),
  miniGamesSection: document.getElementById('mini-games-section'),
  
  // কন্ট্রোলস
  modeToggle: document.getElementById('mode-toggle'),
  menuToggle: document.getElementById('menu-toggle'),
  closeMenu: document.getElementById('close-menu'),
  sideMenu: document.getElementById('side-menu'),
  
  // সার্চ
  vocabularySearch: document.getElementById('vocabulary-search'),
  searchBtn: document.getElementById('search-btn'),
  voiceSearchBtn: document.getElementById('voice-search-btn'),
  clearFilters: document.getElementById('clear-filters'),
  
  // ফিল্টার ট্যাগস
  filterTags: document.querySelectorAll('.filter-tag'),
  
  // প্রগ্রেস
  dailyProgress: document.getElementById('daily-progress'),
  wordsLearnedToday: document.getElementById('words-learned-today'),
  totalWordsLearned: document.getElementById('total-words-learned'),
  currentStreak: document.getElementById('current-streak'),
  accuracyRate: document.getElementById('accuracy-rate'),
  headerStreak: document.getElementById('header-streak'),
  
  // গোল সিলেক্টর
  goalBtns: document.querySelectorAll('.goal-btn'),
  
  // গেমস
  gameCards: document.querySelectorAll('.game-card'),
  
  // ভাষার কার্ড
  languageCards: document.querySelectorAll('.language-card'),
  
  // মেনু
  menuItems: {
    home: document.getElementById('menu-home'),
    countries: document.getElementById('menu-countries'),
    progress: document.getElementById('menu-progress'),
    vocabulary: document.getElementById('menu-vocabulary'),
    games: document.getElementById('menu-games'),
    schengen: document.getElementById('menu-schengen'),
    achievements: document.getElementById('menu-achievements'),
    settings: document.getElementById('menu-settings'),
    about: document.getElementById('menu-about'),
    help: document.getElementById('menu-help')
  },
  
  // অন্যান্য
  toastContainer: document.getElementById('toast-container'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalBody: document.getElementById('modal-body'),
  audioPlayer: document.getElementById('audio-player'),
  
  // ইউজার প্রোফাইল
  userStats: document.getElementById('user-stats'),
  userLevel: document.getElementById('user-level'),
  levelProgress: document.getElementById('level-progress')
};

// 🗺️ সম্পূর্ণ ভাষা ম্যাপিং (২৯টি দেশ)
const COUNTRIES_DATA = {
  // শেনজেন দেশসমূহ
  austria: { name: 'অস্ট্রিয়া', language: 'Deutsch', difficulty: 'medium', flag: '🇦🇹', isSchengen: true },
  belgium: { name: 'বেলজিয়াম', language: 'Nederlands/Français', difficulty: 'hard', flag: '🇧🇪', isSchengen: true },
  bulgaria: { name: 'বুলগেরিয়া', language: 'Български', difficulty: 'hard', flag: '🇧🇬', isSchengen: true },
  croatia: { name: 'ক্রোয়েশিয়া', language: 'Hrvatski', difficulty: 'medium', flag: '🇭🇷', isSchengen: true },
  cyprus: { name: 'সাইপ্রাস', language: 'Ελληνικά', difficulty: 'hard', flag: '🇨🇾', isSchengen: true },
  czechia: { name: 'চেক প্রজাতন্ত্র', language: 'Čeština', difficulty: 'hard', flag: '🇨🇿', isSchengen: true },
  denmark: { name: 'ডেনমার্ক', language: 'Dansk', difficulty: 'medium', flag: '🇩🇰', isSchengen: true },
  estonia: { name: 'এস্তোনিয়া', language: 'Eesti', difficulty: 'hard', flag: '🇪🇪', isSchengen: true },
  finland: { name: 'ফিনল্যান্ড', language: 'Suomi', difficulty: 'hard', flag: '🇫🇮', isSchengen: true },
  france: { name: 'ফ্রান্স', language: 'Français', difficulty: 'medium', flag: '🇫🇷', isSchengen: true },
  germany: { name: 'জার্মানি', language: 'Deutsch', difficulty: 'medium', flag: '🇩🇪', isSchengen: true },
  greece: { name: 'গ্রিস', language: 'Ελληνικά', difficulty: 'hard', flag: '🇬🇷', isSchengen: true },
  hungary: { name: 'হাঙ্গেরি', language: 'Magyar', difficulty: 'hard', flag: '🇭🇺', isSchengen: true },
  iceland: { name: 'আইসল্যান্ড', language: 'Íslenska', difficulty: 'hard', flag: '🇮🇸', isSchengen: true },
  italy: { name: 'ইতালি', language: 'Italiano', difficulty: 'easy', flag: '🇮🇹', isSchengen: true },
  latvia: { name: 'লাটভিয়া', language: 'Latviešu', difficulty: 'hard', flag: '🇱🇻', isSchengen: true },
  liechtenstein: { name: 'লিশটেনস্টাইন', language: 'Deutsch', difficulty: 'medium', flag: '🇱🇮', isSchengen: true },
  lithuania: { name: 'লিথুয়ানিয়া', language: 'Lietuvių', difficulty: 'hard', flag: '🇱🇹', isSchengen: true },
  luxembourg: { name: 'লুক্সেমবার্গ', language: 'Lëtzebuergesch', difficulty: 'hard', flag: '🇱🇺', isSchengen: true },
  malta: { name: 'মাল্টা', language: 'Malti', difficulty: 'medium', flag: '🇲🇹', isSchengen: true },
  netherlands: { name: 'নেদারল্যান্ডস', language: 'Nederlands', difficulty: 'medium', flag: '🇳🇱', isSchengen: true },
  norway: { name: 'নরওয়ে', language: 'Norsk', difficulty: 'medium', flag: '🇳🇴', isSchengen: true },
  poland: { name: 'পোল্যান্ড', language: 'Polski', difficulty: 'hard', flag: '🇵🇱', isSchengen: true },
  portugal: { name: 'পর্তুগাল', language: 'Português', difficulty: 'medium', flag: '🇵🇹', isSchengen: true },
  romania: { name: 'রোমানিয়া', language: 'Română', difficulty: 'medium', flag: '🇷🇴', isSchengen: true },
  slovakia: { name: 'স্লোভাকিয়া', language: 'Slovenčina', difficulty: 'hard', flag: '🇸🇰', isSchengen: true },
  slovenia: { name: 'স্লোভেনিয়া', language: 'Slovenščina', difficulty: 'hard', flag: '🇸🇮', isSchengen: true },
  spain: { name: 'স্পেন', language: 'Español', difficulty: 'easy', flag: '🇪🇸', isSchengen: true },
  sweden: { name: 'সুইডেন', language: 'Svenska', difficulty: 'medium', flag: '🇸🇪', isSchengen: true },
  switzerland: { name: 'সুইজারল্যান্ড', language: 'Deutsch/Français', difficulty: 'medium', flag: '🇨🇭', isSchengen: true },
  
  // অন্যান্য ইউরোপীয় দেশ
  russia: { name: 'রাশিয়া', language: 'Русский', difficulty: 'hard', flag: '🇷🇺', isSchengen: false }
};

// 📊 গ্লোবাল স্টেট
let currentLanguage = '';
let currentLanguageData = null;
let vocabularyData = [];
let filteredData = [];
let searchQuery = '';
let currentCategory = 'all';
let currentGameData = null;
let isGameMode = false;

// 🎛️ ইউটিলিটি ফাংশন
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

function showElement(element) {
  if (element) element.style.display = 'block';
}

function hideElement(element) {
  if (element) element.style.display = 'none';
}

function toggleElement(element) {
  if (element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  }
}

function highlightText(text, query) {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px; color: #000;">$1</mark>');
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

// 🎉 টোস্ট সিস্টেম
function showToast(message, type = 'info', duration = 4000) {
  if (!elements.toastContainer) return;
  
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
  
  toast.className = 'toast-notification';
  toast.style.cssText = `
    background: white;
    padding: 16px 20px;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    border-left: 4px solid ${colors[type] || colors.info};
    transform: translateX(100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    z-index: 1002;
    max-width: 350px;
    word-wrap: break-word;
  `;
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; color: #333;">
      <span style="font-size: 18px; flex-shrink: 0;">${icons[type] || icons.info}</span>
      <span style="flex: 1; font-weight: 500; line-height: 1.4;">${message}</span>
      <button style="background: none; border: none; font-size: 16px; cursor: pointer; padding: 4px; opacity: 0.6; transition: opacity 0.2s;" onclick="removeToast(this.parentElement.parentElement)">✖</button>
    </div>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    removeToast(toast);
  }, duration);
  
  toast.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
      removeToast(toast);
    }
  });
  
  return toast;
}

function removeToast(toast) {
  if (toast && toast.parentNode) {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// 📈 প্রগ্রেস ট্র্যাকার
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
      target: CONFIG.DAILY_TARGET,
      correctAnswers: 0,
      totalAttempts: 0
    };
    saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, progress);
  }
  
  return progress;
}

function updateDailyProgress(increment = 1, isCorrect = true) {
  const progress = getDailyProgress();
  progress.wordsLearned += increment;
  progress.totalAttempts += 1;
  if (isCorrect) progress.correctAnswers += 1;
  
  saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, progress);
  
  updateUserStats(increment);
  updateProgressDisplay();
  checkAchievements();
  
  return progress;
}

function updateUserStats(increment = 1) {
  const today = getTodayDate();
  let stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {
    totalWordsLearned: 0,
    currentStreak: 0,
    lastActiveDate: null,
    languagesLearned: [],
    totalSessions: 0
  });
  
  stats.totalWordsLearned += increment;
  stats.totalSessions += 1;
  
  // ভাষা ট্র্যাকিং
  if (currentLanguage && !stats.languagesLearned.includes(currentLanguage)) {
    stats.languagesLearned.push(currentLanguage);
  }
  
  // স্ট্রিক ক্যালকুলেশন
  if (stats.lastActiveDate !== today) {
    if (stats.lastActiveDate) {
      const lastDate = new Date(stats.lastActiveDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        stats.currentStreak += 1;
      } else if (daysDiff > 1) {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    
    stats.lastActiveDate = today;
  }
  
  saveToStorage(CONFIG.STORAGE_KEYS.userStats, stats);
  updateStatsDisplay();
  updateUserLevel();
}

function updateProgressDisplay() {
  const progress = getDailyProgress();
  const percentage = Math.round((progress.wordsLearned / progress.target) * 100);
  
  if (elements.dailyProgress) {
    elements.dailyProgress.style.width = `${Math.min(percentage, 100)}%`;
    elements.dailyProgress.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  
  if (elements.wordsLearnedToday) {
    elements.wordsLearnedToday.textContent = `${progress.wordsLearned}/${progress.target}`;
  }
  
  // Accuracy calculation
  if (elements.accuracyRate && progress.totalAttempts > 0) {
    const accuracy = Math.round((progress.correctAnswers / progress.totalAttempts) * 100);
    elements.accuracyRate.textContent = `${accuracy}%`;
  }
}

function updateStatsDisplay() {
  const stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {
    totalWordsLearned: 0,
    currentStreak: 0,
    languagesLearned: []
  });
  
  if (elements.totalWordsLearned) {
    elements.totalWordsLearned.textContent = stats.totalWordsLearned;
  }
  
  if (elements.currentStreak) {
    elements.currentStreak.textContent = stats.currentStreak;
  }
  
  if (elements.headerStreak) {
    elements.headerStreak.textContent = stats.currentStreak;
    if (stats.currentStreak > 0) {
      showElement(elements.userStats);
    }
  }
}

function updateUserLevel() {
  const stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, { totalWordsLearned: 0 });
  const level = Math.floor(stats.totalWordsLearned / 50) + 1;
  const levelProgress = (stats.totalWordsLearned % 50) / 50 * 100;
  
  if (elements.userLevel) {
    elements.userLevel.textContent = level;
  }
  
  if (elements.levelProgress) {
    elements.levelProgress.style.width = `${levelProgress}%`;
  }
  
  saveToStorage(CONFIG.STORAGE_KEYS.userLevel, { level, progress: levelProgress });
}

// 🏆 অর্জন সিস্টেম
function checkAchievements() {
  const stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {
    totalWordsLearned: 0,
    currentStreak: 0,
    languagesLearned: []
  });
  
  const achievements = loadFromStorage(CONFIG.STORAGE_KEYS.achievements, []);
  
  Object.values(CONFIG.ACHIEVEMENTS).forEach(achievement => {
    if (!achievements.includes(achievement.id)) {
      let unlocked = false;
      
      switch (achievement.id) {
        case 'first_10':
          unlocked = stats.totalWordsLearned >= 10;
          break;
        case 'streak_7':
          unlocked = stats.currentStreak >= 7;
          break;
        case 'languages_3':
          unlocked = stats.languagesLearned.length >= 3;
          break;
        case 'words_100':
          unlocked = stats.totalWordsLearned >= 100;
          break;
      }
      
      if (unlocked) {
        achievements.push(achievement.id);
        saveToStorage(CONFIG.STORAGE_KEYS.achievements, achievements);
        showAchievementUnlock(achievement);
      }
    }
  });
}

function showAchievementUnlock(achievement) {
  const toast = showToast(
    `🎉 নতুন অর্জন আনলক! ${achievement.icon} ${achievement.name}`,
    'success',
    6000
  );
  
  // স্পেশাল এফেক্ট
  if (toast) {
    toast.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    toast.style.color = 'white';
    toast.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      toast.style.transform = 'scale(1)';
    }, 200);
  }
}

// 📚 ভোকাবুলারি ম্যানেজার
async function loadLanguage(countryCode) {
  try {
    showLoading();
    currentLanguage = countryCode;
    
    console.log(`Loading ${CONFIG.LANGUAGES_PATH}${countryCode}.json...`);
    
    // Language ফোল্ডার থেকে ফাইল লোড
    const response = await fetch(`${CONFIG.LANGUAGES_PATH}${countryCode}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ফাইল পাওয়া যায়নি: ${CONFIG.LANGUAGES_PATH}${countryCode}.json`);
    }
    
    const text = await response.text();
    
    if (!text.trim()) {
      throw new Error('ফাইলটি খালি বা অবৈধ');
    }
    
    try {
      currentLanguageData = JSON.parse(text);
    } catch (parseError) {
      throw new Error('JSON ফাইল ভুল ফরম্যাটে আছে');
    }
    
    // নতুন JSON স্ট্রাকচার অনুযায়ী ডেটা প্রসেসিং
    vocabularyData = processLanguageData(currentLanguageData);
    
    if (!vocabularyData || vocabularyData.length === 0) {
      throw new Error('ভোকাবুলারি ডেটা খালি বা অবৈধ');
    }
    
    filteredData = [...vocabularyData];
    
    console.log(`সফলভাবে ${vocabularyData.length}টি শব্দ লোড হয়েছে`);
    
    hideLoading();
    showVocabularyMode();
    renderVocabulary();
    
    const countryInfo = COUNTRIES_DATA[countryCode];
    showToast(
      `${countryInfo.flag} ${countryInfo.name} ভাষার ${vocabularyData.length}টি শব্দ লোড হয়েছে!`, 
      'success'
    );
    
    // ভাষা নির্বাচন সেভ করুন
    saveToStorage(CONFIG.STORAGE_KEYS.selectedLanguage, countryCode);
    
  } catch (error) {
    console.error('ভাষা লোড করতে সমস্যা:', error);
    hideLoading();
    showError(error.message);
    showToast(`ভাষা লোড করতে সমস্যা: ${error.message}`, 'error');
  }
}

// নতুন JSON স্ট্রাকচার প্রসেসিং
function processLanguageData(data) {
  const processedData = [];
  
  if (data.categories) {
    Object.entries(data.categories).forEach(([categoryKey, category]) => {
      if (category.words && Array.isArray(category.words)) {
        category.words.forEach(word => {
          processedData.push({
            ...word,
            categoryKey,
            categoryName: category.name,
            country: data.country,
            countryBangla: data.countryBangla,
            flag: data.flag,
            language: data.language,
            difficulty: word.difficulty || data.difficulty
          });
        });
      }
    });
  }
  
  return processedData;
}

function showLoading() {
  hideElement(elements.welcomeContent);
  hideElement(elements.vocabularyContent);
  hideElement(elements.gameContent);
  showElement(elements.loadingContainer);
}

function hideLoading() {
  hideElement(elements.loadingContainer);
}

function showVocabularyMode() {
  hideElement(elements.welcomeContent);
  hideElement(elements.gameContent);
  showElement(elements.vocabularyContent);
  showElement(elements.searchSection);
  showElement(elements.progressSection);
  showElement(elements.miniGamesSection);
  isGameMode = false;
}

function showGameMode() {
  hideElement(elements.welcomeContent);
  hideElement(elements.vocabularyContent);
  showElement(elements.gameContent);
  hideElement(elements.searchSection);
  showElement(elements.progressSection);
  hideElement(elements.miniGamesSection);
  isGameMode = true;
}

function showWelcomeMode() {
  showElement(elements.welcomeContent);
  hideElement(elements.vocabularyContent);
  hideElement(elements.gameContent);
  hideElement(elements.searchSection);
  hideElement(elements.progressSection);
  hideElement(elements.miniGamesSection);
  isGameMode = false;
}

function showError(message) {
  showWelcomeMode();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-container';
  errorDiv.style.cssText = `
    text-align: center; 
    padding: 40px 20px; 
    background: white;
    border-radius: 16px;
    margin: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border-left: 6px solid #dc3545;
    max-width: 600px;
    margin: 20px auto;
  `;
  
  errorDiv.innerHTML = `
    <div style="font-size: 64px; margin-bottom: 20px; animation: shake 0.5s ease-in-out;">❌</div>
    <h3 style="color: #dc3545; margin-bottom: 16px; font-size: 24px;">ডেটা লোড করতে সমস্যা</h3>
    <p style="color: #666; margin-bottom: 24px; line-height: 1.6; font-size: 16px;">${message}</p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
      <button onclick="location.reload()" 
              style="padding: 14px 28px; background: linear-gradient(135deg, #0066cc, #004499); 
                     color: white; border: none; border-radius: 10px; cursor: pointer; 
                     font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,102,204,0.3);">
        🔄 পুনরায় চেষ্টা করুন
      </button>
      <button onclick="goHome()" 
              style="padding: 14px 28px; background: linear-gradient(135deg, #6c757d, #495057); 
                     color: white; border: none; border-radius: 10px; cursor: pointer; 
                     font-weight: 600; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(108,117,125,0.3);">
        🏠 হোমে ফিরুন
      </button>
    </div>
    <div style="margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); 
                border-radius: 12px; font-size: 14px; color: #666; text-align: left;">
      <strong style="color: #495057; display: block; margin-bottom: 12px;">📋 সমাধানের উপায়:</strong>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>নিশ্চিত করুন যে <code style="background: #fff; padding: 2px 6px; border-radius: 4px; color: #d63384;">Language</code> ফোল্ডার রুট ডিরেক্টরিতে আছে</li>
        <li>চেক করুন <code style="background: #fff; padding: 2px 6px; border-radius: 4px; color: #d63384;">Language/${currentLanguage}.json</code> ফাইলটি সঠিক জায়গায় আছে কি না</li>
        <li>JSON ফাইলের ফরম্যাট সঠিক আছে কি না দেখুন</li>
        <li>ইন্টারনেট সংযোগ চেক করুন</li>
      </ul>
    </div>
  `;
  
  elements.conversationArea.appendChild(errorDiv);
  
  // অ্যানিমেশন
  setTimeout(() => {
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
      errorDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      errorDiv.style.opacity = '1';
      errorDiv.style.transform = 'translateY(0)';
    }, 50);
  }, 100);
}

function goHome() {
  if (elements.languageSelect) {
    elements.languageSelect.value = '';
  }
  if (elements.startLearningBtn) {
    hideElement(elements.startLearningBtn);
  }
  showWelcomeMode();
  // এরর মেসেজ ডিভ রিমুভ করুন
  const errorDivs = elements.conversationArea.querySelectorAll('.error-container');
  errorDivs.forEach(div => div.remove());
}

// 🔍 সার্চ এবং ফিল্টার
function handleSearch() {
  if (!vocabularyData.length) return;
  
  searchQuery = elements.vocabularySearch ? elements.vocabularySearch.value.toLowerCase().trim() : '';
  applyFilters();
}

function handleCategoryFilter(category) {
  currentCategory = category;
  
  // আপডেট ফিল্টার ট্যাগ UI
  elements.filterTags.forEach(tag => {
    tag.classList.remove('active');
    if (tag.dataset.category === category) {
      tag.classList.add('active');
    }
  });
  
  applyFilters();
}

function applyFilters() {
  if (!vocabularyData.length) return;
  
  filteredData = vocabularyData.filter(item => {
    // ক্যাটেগরি ফিল্টার
    if (currentCategory !== 'all' && item.categoryKey !== currentCategory) {
      return false;
    }
    
    // সার্চ ফিল্টার
    if (searchQuery) {
      const searchableText = [
        item.word || '',
        item.meaning || '',
        item.bengaliMeaning || '',
        item.example || '',
        item.exampleMeaning || ''
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchQuery);
    }
    
    return true;
  });
  
  renderVocabulary();
  
  if (searchQuery) {
    showToast(`"${searchQuery}" এর জন্য ${filteredData.length}টি ফলাফল পাওয়া গেছে`, 'info');
  }
}

function clearSearch() {
  searchQuery = '';
  currentCategory = 'all';
  
  if (elements.vocabularySearch) {
    elements.vocabularySearch.value = '';
  }
  
  // রিসেট ফিল্টার ট্যাগস
  elements.filterTags.forEach(tag => {
    tag.classList.remove('active');
    if (tag.dataset.category === 'all') {
      tag.classList.add('active');
    }
  });
  
  filteredData = [...vocabularyData];
  renderVocabulary();
  showToast('সার্চ এবং ফিল্টার মুছে ফেলা হয়েছে', 'success');
}

// এখানে আরও ফাংশন থাকবে...
// আমি পুরো কোডটি দেখার জন্য পরবর্তী অংশ স্ক্রল করব
