// 🎯 গ্লোবাল কনফিগারেশন
const CONFIG = {
  DAILY_TARGET: 10,
  STORAGE_KEYS: {
    selectedLanguage: 'selectedLanguage',
    theme: 'theme',
    wordsLearned: 'wordsLearned',
    dailyProgress: 'dailyProgress',
    userStats: 'userStats',
    lastActiveDate: 'lastActiveDate'
  }
};

// 🎮 DOM এলিমেন্ট রেফারেন্স
const DOM = {
  languageSelect: document.getElementById('language-select'),
  conversationArea: document.getElementById('conversation-area'),
  welcomeContent: document.getElementById('welcome-content'),
  vocabularyContent: document.getElementById('vocabulary-content'),
  loadingContainer: document.getElementById('loading-container'),
  searchSection: document.getElementById('search-section'),
  progressSection: document.getElementById('progress-section'),
  
  // হেডার এলিমেন্টস
  modeToggle: document.getElementById('mode-toggle'),
  menuToggle: document.getElementById('menu-toggle'),
  
  // সার্চ এবং ফিল্টার
  vocabularySearch: document.getElementById('vocabulary-search'),
  searchBtn: document.getElementById('search-btn'),
  categoryFilter: document.getElementById('category-filter'),
  clearFilters: document.getElementById('clear-filters'),
  
  // প্রগ্রেস এলিমেন্টস
  dailyProgress: document.getElementById('daily-progress'),
  wordsLearnedToday: document.getElementById('words-learned-today'),
  totalWordsLearned: document.getElementById('total-words-learned'),
  currentStreak: document.getElementById('current-streak'),
  
  // সাইড মেনু
  sideMenu: document.getElementById('side-menu'),
  closeMenu: document.getElementById('close-menu'),
  
  // টোস্ট কনটেইনার
  toastContainer: document.getElementById('toast-container')
};

// 🗺️ ভাষা ম্যাপিং (সরলীকৃত)
const langCodeMap = {
  italy: 'it',
  spain: 'es', 
  russian: 'ru',
  france: 'fr',
  germany: 'de',
  greece: 'el',
  portugal: 'pt',
  netherlands: 'nl',
  austria: 'de',
  belgium: 'nl'
};

// 📊 গ্লোবাল স্টেট
let currentLanguage = '';
let vocabularyData = [];
let filteredData = [];
let searchQuery = '';

// 💾 স্টোরেজ ম্যানেজার
class StorageManager {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage save error:', error);
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  }
}

// 🎉 টোস্ট নোটিফিকেশন
class ToastManager {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span>${message}</span>
      </div>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    toast.addEventListener('click', () => {
      toast.style.animation = 'slideOutToast 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  }
  
  static success(message) { this.show(message, 'success'); }
  static error(message) { this.show(message, 'error'); }
  static warning(message) { this.show(message, 'warning'); }
  static info(message) { this.show(message, 'info'); }
}

// 📈 প্রগ্রেস ট্র্যাকার
class ProgressTracker {
  static getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }
  
  static getDailyProgress() {
    const today = this.getTodayDate();
    let progress = StorageManager.get(CONFIG.STORAGE_KEYS.dailyProgress, {
      date: today,
      wordsLearned: 0,
      target: CONFIG.DAILY_TARGET
    });
    
    // নতুন দিন হলে রিসেট
    if (progress.date !== today) {
      progress = {
        date: today,
        wordsLearned: 0,
        target: CONFIG.DAILY_TARGET
      };
      StorageManager.set(CONFIG.STORAGE_KEYS.dailyProgress, progress);
    }
    
    return progress;
  }
  
  static updateDailyProgress(increment = 1) {
    const progress = this.getDailyProgress();
    progress.wordsLearned += increment;
    StorageManager.set(CONFIG.STORAGE_KEYS.dailyProgress, progress);
    
    // ইউজার স্ট্যাটস আপডেট
    this.updateUserStats(increment);
    
    return progress;
  }
  
  static updateUserStats(increment = 1) {
    const today = this.getTodayDate();
    let userStats = StorageManager.get(CONFIG.STORAGE_KEYS.userStats, {
      totalWordsLearned: 0,
      currentStreak: 0,
      lastActiveDate: null
    });
    
    userStats.totalWordsLearned += increment;
    
    // স্ট্রিক আপডেট
    if (userStats.lastActiveDate !== today) {
      const lastDate = userStats.lastActiveDate ? new Date(userStats.lastActiveDate) : null;
      const todayDate = new Date(today);
      
      if (lastDate) {
        const daysDifference = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDifference === 1) {
          userStats.currentStreak += 1;
        } else if (daysDifference > 1) {
          userStats.currentStreak = 1;
        }
      } else {
        userStats.currentStreak = 1;
      }
      
      userStats.lastActiveDate = today;
    }
    
    StorageManager.set(CONFIG.STORAGE_KEYS.userStats, userStats);
    return userStats;
  }
}

// 🎨 UI আপডেটার
class UIUpdater {
  static updateProgressDisplay() {
    const dailyProgress = ProgressTracker.getDailyProgress();
    const percentage = Math.min((dailyProgress.wordsLearned / dailyProgress.target) * 100, 100);
    
    if (DOM.dailyProgress) {
      DOM.dailyProgress.style.width = `${percentage}%`;
    }
    
    if (DOM.wordsLearnedToday) {
      DOM.wordsLearnedToday.textContent = `${dailyProgress.wordsLearned}/${dailyProgress.target}`;
    }
  }
  
  static updateStatsDisplay() {
    const userStats = StorageManager.get(CONFIG.STORAGE_KEYS.userStats, {
      totalWordsLearned: 0,
      currentStreak: 0
    });
    
    if (DOM.totalWordsLearned) {
      DOM.totalWordsLearned.textContent = userStats.totalWordsLearned;
    }
    
    if (DOM.currentStreak) {
      DOM.currentStreak.textContent = userStats.currentStreak;
    }
  }
  
  static showSearchSection() {
    if (DOM.searchSection) {
      DOM.searchSection.style.display = 'block';
    }
  }
  
  static showProgressSection() {
    if (DOM.progressSection) {
      DOM.progressSection.style.display = 'block';
    }
  }
}

// 🔍 সার্চ এবং ফিল্টার
class SearchAndFilter {
  static initializeFilters() {
    if (DOM.vocabularySearch) {
      DOM.vocabularySearch.addEventListener('input', this.handleSearch.bind(this));
    }
    
    if (DOM.searchBtn) {
      DOM.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    }
    
    if (DOM.categoryFilter) {
      DOM.categoryFilter.addEventListener('change', this.handleSearch.bind(this));
    }
    
    if (DOM.clearFilters) {
      DOM.clearFilters.addEventListener('click', this.clearAllFilters.bind(this));
    }
  }
  
  static handleSearch() {
    searchQuery = DOM.vocabularySearch?.value.toLowerCase().trim() || '';
    this.applyFilters();
  }
  
  static applyFilters() {
    if (!vocabularyData.length) return;
    
    filteredData = vocabularyData.filter(item => {
      if (searchQuery) {
        const searchableText = [
          item[langCodeMap[currentLanguage]] || '',
          item.bn || '',
          item.bnMeaning || '',
          item.en || ''
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchQuery);
      }
      return true;
    });
    
    this.renderFilteredResults();
  }
  
  static renderFilteredResults() {
    if (!DOM.vocabularyContent) return;
    
    // ফলাফল হেডার
    const header = document.createElement('div');
    header.className = 'vocabulary-header';
    header.innerHTML = `
      <div class="vocabulary-title">
        <span>📚</span>
        <span>${this.getLanguageName(currentLanguage)} শব্দভাণ্ডার</span>
      </div>
      <div class="vocabulary-stats">
        <span>মোট: ${vocabularyData.length}</span>
        <span>ফিল্টার: ${filteredData.length}</span>
        ${searchQuery ? `<span>অনুসন্ধান: "${searchQuery}"</span>` : ''}
      </div>
    `;
    
    // ভোকাবুলারি গ্রিড
    const grid = document.createElement('div');
    grid.className = 'vocabulary-grid';
    
    if (filteredData.length === 0) {
      grid.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--gray-500);">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <h3>কোন ফলাফল পাওয়া যায়নি</h3>
          <p>অন্য কীওয়ার্ড ব্যবহার করে দেখুন</p>
        </div>
      `;
    } else
