// 🎯 গ্লোবাল ভেরিয়েবল এবং কনফিগারেশন
const CONFIG = {
  DAILY_TARGET: 10,
  STORAGE_KEYS: {
    selectedLanguage: 'selectedLanguage',
    theme: 'theme',
    wordsLearned: 'wordsLearned',
    dailyProgress: 'dailyProgress',
    weeklyProgress: 'weeklyProgress',
    userStats: 'userStats',
    lastActiveDate: 'lastActiveDate'
  },
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000
};

// 🎮 DOM এলিমেন্ট রেফারেন্স
const DOM = {
  languageSelect: document.getElementById('language-select'),
  conversationArea: document.getElementById('conversation-area'),
  welcomeContent: document.getElementById('welcome-content'),
  vocabularyContent: document.getElementById('vocabulary-content'),
  loadingContainer: document.getElementById('loading-container'),
  
  // হেডার এলিমেন্টস
  modeToggle: document.getElementById('mode-toggle'),
  statsToggle: document.getElementById('stats-toggle'),
  menuToggle: document.getElementById('menu-toggle'),
  
  // সার্চ এবং ফিল্টার
  vocabularySearch: document.getElementById('vocabulary-search'),
  searchBtn: document.getElementById('search-btn'),
  filterPanel: document.getElementById('filter-panel'),
  categoryFilter: document.getElementById('category-filter'),
  difficultyFilter: document.getElementById('difficulty-filter'),
  statusFilter: document.getElementById('status-filter'),
  clearFilters: document.getElementById('clear-filters'),
  
  // প্রগ্রেস এলিমেন্টস
  dailyProgress: document.getElementById('daily-progress'),
  wordsLearnedToday: document.getElementById('words-learned-today'),
  
  // স্ট্যাটিস্টিক্স প্যানেল
  statsPanel: document.getElementById('stats-panel'),
  totalWordsLearned: document.getElementById('total-words-learned'),
  currentStreak: document.getElementById('current-streak'),
  wordsThisWeek: document.getElementById('words-this-week'),
  accuracyRate: document.getElementById('accuracy-rate'),
  weeklyChart: document.getElementById('weekly-chart'),
  
  // সাইড মেনু
  sideMenu: document.getElementById('side-menu'),
  closeMenu: document.getElementById('close-menu'),
  
  // টোস্ট কনটেইনার
  toastContainer: document.getElementById('toast-container')
};

// 🗺️ ভাষা ম্যাপিং
const langCodeMap = {
  austria: 'de', belgium: 'nl', czech: 'cs', denmark: 'da',
  estonia: 'et', finland: 'fi', france: 'fr', germany: 'de',
  greece: 'el', hungary: 'hu', iceland: 'is', italy: 'it',
  latvia: 'lv', liechtenstein: 'de', lithuania: 'lt', luxembourg: 'lb',
  malta: 'mt', netherlands: 'nl', norway: 'no', poland: 'pl',
  portugal: 'pt', slovakia: 'sk', slovenia: 'sl', spain: 'es',
  sweden: 'sv', switzerland: 'de', russian: 'ru', albania: 'sq',
  andorra: 'ca', armenia: 'hy', azerbaijan: 'az', bosnia: 'bs',
  bulgaria: 'bg', croatia: 'hr', cyprus: 'el', georgia: 'ka',
  ireland: 'en', kosovo: 'sq', moldova: 'ro', monaco: 'fr',
  montenegro: 'sr', northmacedonia: 'mk', romania: 'ro',
  sanmarino: 'it', serbia: 'sr', turkey: 'tr', ukraine: 'uk',
  unitedkingdom: 'en', vatican: 'la'
};

// 📊 গ্লোবাল স্টেট
let currentLanguage = '';
let vocabularyData = [];
let filteredData = [];
let searchQuery = '';
let currentFilters = {
  category: 'all',
  difficulty: 'all',
  status: 'all'
};

// 🎛️ ইউটিলিটি ফাংশন
class Utils {
  // 📅 আজকের তারিখ ISO ফরম্যাটে
  static getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }
  
  // 🎲 র্যান্ডম আইডি জেনারেট
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // ⏱️ ডিলে ফাংশন
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // 🎨 এলিমেন্টে অ্যানিমেশন যোগ
  static addAnimation(element, animationClass, duration = CONFIG.ANIMATION_DURATION) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  }
  
  // 🔤 টেক্সট হাইলাইট
  static highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  // 📊 পার্সেন্টেজ ক্যালকুলেট
  static calculatePercentage(current, total) {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  }
}

// 💾 লোকাল স্টোরেজ ম্যানেজার
class StorageManager {
  // ডেটা সেভ করা
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage save error:', error);
    }
  }
  
  // ডেটা লোড করা
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  }
  
  // ডেটা মুছে ফেলা
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
  
  // সব ডেটা ক্লিয়ার
  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
}

// 🎉 টোস্ট নোটিফিকেশন সিস্টেম
class ToastManager {
  static show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
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
    
    // অটো রিমুভ
    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
    
    // ক্লিক করে রিমুভ
    toast.addEventListener('click', () => {
      toast.style.animation = 'slideOutToast 0.3s ease-out forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  }
  
  static success(message) {
    this.show(message, 'success');
  }
  
  static error(message) {
    this.show(message, 'error');
  }
  
  static warning(message) {
    this.show(message, 'warning');
  }
  
  static info(message) {
    this.show(message, 'info');
  }
}

// 📈 প্রগ্রেস ট্র্যাকার
class ProgressTracker {
  static initializeUserStats() {
    const today = Utils.getTodayDate();
    let userStats = StorageManager.get(CONFIG.STORAGE_KEYS.userStats, {
      totalWordsLearned: 0,
      currentStreak: 0,
      lastActiveDate: null,
      accuracyRate: 100,
      wordsThisWeek: 0,
      weekStartDate: null
    });
    
    // স্ট্রিক আপডেট চেক
    this.updateStreak(userStats, today);
    
    // সাপ্তাহিক রিসেট চেক
    this.checkWeeklyReset(userStats, today);
    
    StorageManager.set(CONFIG.STORAGE_KEYS.userStats, userStats);
    return userStats;
  }
  
  static updateStreak(userStats, today) {
    if (!userStats.lastActiveDate) {
      userStats.currentStreak = 0;
    } else {
      const lastDate = new Date(userStats.lastActiveDate);
      const todayDate = new Date(today);
      const daysDifference = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDifference > 1) {
        userStats.currentStreak = 0;
      }
    }
  }
  
  static checkWeeklyReset(userStats, today) {
    const todayDate = new Date(today);
    const weekStart = new Date(userStats.weekStartDate);
    
    if (!userStats.weekStartDate || todayDate - weekStart >= 7 * 24 * 60 * 60 * 1000) {
      userStats.wordsThisWeek = 0;
      userStats.weekStartDate = today;
    }
  }
  
  static getDailyProgress() {
    const today = Utils.getTodayDate();
    return StorageManager.get(CONFIG.STORAGE_KEYS.dailyProgress, {
      date: today,
      wordsLearned: 0,
      target: CONFIG.DAILY_TARGET
    });
  }
  
  static updateDailyProgress(increment = 1) {
    const today = Utils.getTodayDate();
    let dailyProgress = this.getDailyProgress();
    
    // নতুন দিন হলে রিসেট
    if (dailyProgress.date !== today) {
      dailyProgress = {
        date: today,
        wordsLearned: 0,
        target: CONFIG.DAILY_TARGET
      };
    }
    
    dailyProgress.wordsLearned += increment;
    StorageManager.set(CONFIG.STORAGE_KEYS.dailyProgress, dailyProgress);
    
    // ইউজার স্ট্যাটস আপডেট
    this.updateUserStats(increment);
    
    return dailyProgress;
  }
  
  static updateUserStats(increment = 1) {
    const today = Utils.getTodayDate();
    let userStats = StorageManager.get(CONFIG.STORAGE_KEYS.userStats, {});
    
    userStats.totalWordsLearned = (userStats.totalWordsLearned || 0) + increment;
    userStats.wordsThisWeek = (userStats.wordsThisWeek || 0) + increment;
    
    // স্ট্রিক আপডেট
    if (userStats.lastActiveDate !== today) {
      const lastDate = userStats.lastActiveDate ? new Date(userStats.lastActiveDate) : null;
      const todayDate = new Date(today);
      
      if (lastDate) {
        const daysDifference = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDifference === 1) {
          userStats.currentStreak = (userStats.currentStreak || 0) + 1;
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
    const percentage = Utils.calculatePercentage(dailyProgress.wordsLearned, dailyProgress.target);
    
    // প্রগ্রেস বার আপডেট
    if (DOM.dailyProgress) {
      DOM.dailyProgress.style.width = `${Math.min(percentage, 100)}%`;
    }
    
    // কাউন্ট আপডেট
    if (DOM.wordsLearnedToday) {
      DOM.wordsLearnedToday.textContent = `${dailyProgress.wordsLearned}/${dailyProgress.target}`;
    }
  }
  
  static updateStatsPanel() {
    const userStats = StorageManager.get(CONFIG.STORAGE_KEYS.userStats, {});
    
    if (DOM.totalWordsLearned) {
      DOM.totalWordsLearned.textContent = userStats.totalWordsLearned || 0;
    }
    
    if (DOM.currentStreak) {
      DOM.currentStreak.textContent = userStats.currentStreak || 0;
    }
    
    if (DOM.wordsThisWeek) {
      DOM.wordsThisWeek.textContent = userStats.wordsThisWeek || 0;
    }
    
    if (DOM.accuracyRate) {
      DOM.accuracyRate.textContent = `${userStats.accuracyRate || 100}%`;
    }
    
    this.updateWeeklyChart();
  }
  
  static updateWeeklyChart() {
    if (!DOM.weeklyChart) return;
    
    // সাধারণ চার্ট তৈরি (বার চার্ট স্টাইল)
    const weeklyData = this.getWeeklyData();
    DOM.weeklyChart.innerHTML = '';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.cssText = `
      display: flex;
      align-items: end;
      justify-content: space-between;
      height: 150px;
      padding: 10px;
      gap: 8px;
    `;
    
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];
    const maxValue = Math.max(...weeklyData, 1);
    
    weeklyData.forEach((value, index) => {
      const barContainer = document.createElement('div');
      barContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        height: 100%;
      `;
      
      const bar = document.createElement('div');
      const height = (value / maxValue) * 80;
      bar.style.cssText = `
        width: 100%;
        height: ${height}%;
        background: linear-gradient(to top, var(--primary-color), var(--primary-light));
        border-radius: 4px 4px 0 0;
        margin-bottom: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
      `;
      
      const label = document.createElement('div');
      label.textContent = days[index];
      label.style.cssText = `
        font-size: 12px;
        color: var(--gray-600);
        text-align: center;
      `;
      
      const valueLabel = document.createElement('div');
      valueLabel.textContent = value;
      valueLabel.style.cssText = `
        font-size: 10px;
        color: var(--gray-500);
        margin-bottom: 4px;
      `;
      
      barContainer.appendChild(bar);
      barContainer.appendChild(valueLabel);
      barContainer.appendChild(label);
      chartContainer.appendChild(barContainer);
      
      // হোভার ইফেক্ট
      bar.addEventListener('mouseenter', () => {
        bar.style.transform = 'scaleY(1.1)';
        bar.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      });
      
      bar.addEventListener('mouseleave', () => {
        bar.style.transform = 'scaleY(1)';
        bar.style.boxShadow = 'none';
      });
    });
    
    DOM.weeklyChart.appendChild(chartContainer);
  }
  
  static getWeeklyData() {
    // সিমুলেটেড ডেটা - ভবিষ্যতে রিয়েল ডেটা দিয়ে রিপ্লেস করা হবে
    const today = new Date().getDay();
    const data = [0, 0, 0, 0, 0, 0, 0];
    
    // বর্তমান সপ্তাহের জন্য র্যান্ডম ডেটা জেনারেট
    for (let i = 0; i <= today; i++) {
      data[i] = Math.floor(Math.random() * 15) + 1;
    }
    
    return data;
  }
}

// 🔍 সার্চ এবং ফিল্টার সিস্টেম
class SearchAndFilter {
  static initializeFilters() {
    // সার্চ ইভেন্ট
    if (DOM.vocabularySearch) {
      DOM.vocabularySearch.addEventListener('input', this.handleSearch.bind(this));
      DOM.vocabularySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }
    
    if (DOM.searchBtn) {
      DOM.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    }
    
    // ফিল্টার ইভেন্ট
    if (DOM.categoryFilter) {
      DOM.categoryFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }
    
    if (DOM.difficultyFilter) {
      DOM.difficultyFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }
    
    if (DOM.statusFilter) {
      DOM.statusFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }
    
    if (DOM.clearFilters) {
      DOM.clearFilters.addEventListener('click', this.clearAllFilters.bind(this));
    }
  }
  
  static handleSearch() {
    searchQuery = DOM.vocabularySearch.value.toLowerCase().trim();
    this.applyFilters();
    
    if (searchQuery) {
      ToastManager.info(`"${searchQuery}" এর জন্য অনুসন্ধান করা হচ্ছে...`);
    }
  }
  
  static handleFilterChange() {
    currentFilters.category = DOM.categoryFilter?.value || 'all';
    currentFilters.difficulty = DOM.difficultyFilter?.value || 'all';
    currentFilters.status = DOM.statusFilter?.value || 'all';
    
    this.applyFilters();
    
    // ফিল্টার প্যানেল টগল
    const hasActiveFilters = Object.values(currentFilters).some(filter => filter !== 'all') || searchQuery;
    if (DOM.filterPanel) {
      DOM.filterPanel.classList.toggle('active', hasActiveFilters);
    }
  }
  
  static applyFilters() {
    if (!vocabularyData.length) return;
    
    filteredData = vocabularyData.filter(item => {
      // সার্চ ফিল্টার
      if (searchQuery) {
        const searchableText = [
          item[langCodeMap[currentLanguage]] || '',
          item.bn || '',
          item.bnMeaning || '',
          item.en || ''
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchQuery)) {
          return false;
        }
      }
      
      // ক্যাটেগরি ফিল্টার (ভবিষ্যতে ইমপ্লিমেন্ট)
      if (currentFilters.category !== 'all') {
        // এখানে ক্যাটেগরি চেক করা হবে
      }
      
      // কঠিনতা ফিল্টার (ভবিষ্যতে ইমপ্লিমেন্ট)
      if (currentFilters.difficulty !== 'all') {
        // এখানে কঠিনতা চেক করা হবে
      }
      
      // স্ট্যাটাস ফিল্টার (ভবিষ্যতে ইমপ্লিমেন্ট)
      if (currentFilters.status !== 'all') {
        // এখানে স্ট্যাটাস চেক করা হবে
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
          <p>অন্য কীওয়ার্ড বা ফিল্টার ব্যবহার করে দেখুন</p>
        </div>
      `;
    } else {
      filteredData.forEach((item, index) => {
        const vocabItem = this.createVocabularyItem(item, index);
        grid.appendChild(vocabItem);
      });
    }
    
    // কনটেন্ট আপডেট
    DOM.vocabularyContent.innerHTML = '';
    DOM.vocabularyContent.appendChild(header);
    DOM.vocabularyContent.appendChild(grid);
    
    // অ্যানিমেশন
    Utils.addAnimation(DOM.vocabularyContent, 'fade-in');
  }
  
  static createVocabularyItem(item, index) {
    const localLang = item[langCodeMap[currentLanguage]] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';
    
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.style.animationDelay = `${index * 50}ms`;
    
    // হাইলাইট টেক্সট
    const highlightedLocal = Utils.highlightText(localLang, searchQuery);
    const highlightedBn = Utils.highlightText(bn, searchQuery);
    const highlightedMeaning = Utils.highlightText(bnMeaning, searchQuery);
    const highlightedEn = Utils.highlightText(en, searchQuery);
    
    div.innerHTML = `
      <div>
        <span style="font-size: 20px;">🗣️</span>
        <strong>${highlightedLocal}</strong>
        <button class="learn-btn" onclick="VocabularyManager.markAsLearned(${index})" 
                style="margin-left: auto; padding: 4px 8px; background: var(--secondary-color); 
                       color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          ✓ শিখেছি
        </button>
      </div>
      <div>
        <span style="font-size: 16px;">📝</span>
        <span>${highlightedBn}</span>
      </div>
      <div>
        <span style="font-size: 16px;">📘</span>
        <em>${highlightedMeaning}</em>
      </div>
      <div>
        <span style="font-size: 16px;">🔤</span>
        <span>${highlightedEn}</span>
      </div>
    `;
    
    // ক্লিক ইভেন্ট
    div.addEventListener('click', (e) => {
      if (!e.target.classList.contains('learn-btn')) {
        Utils.addAnimation(div, 'scale-in');
        
        // টেক্সট টু স্পিচ (ভবিষ্যতে ইমপ্লিমেন্ট)
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(localLang);
          utterance.lang = this.getSpeechLang(currentLanguage);
          speechSynthesis.speak(utterance);
        }
      }
    });
    
    return div;
  }
  
  static clearAllFilters() {
    // ফিল্টার রিসেট
    searchQuery = '';
    currentFilters = {
      category: 'all',
      difficulty: 'all',
      status: 'all'
    };
    
    // UI রিসেট
    if (DOM.vocabularySearch) DOM.vocabularySearch.value = '';
    if (DOM.categoryFilter) DOM.categoryFilter.value = 'all';
    if (DOM.difficultyFilter) DOM.difficultyFilter.value = 'all';
    if (DOM.statusFilter) DOM.statusFilter.value = 'all';
    
    // ফিল্টার প্যানেল লুকান
    if (DOM.filterPanel) {
      DOM.filterPanel.classList.remove('active');
    }
    
    // ফলাফল রিফ্রেশ
    this.applyFilters();
    
    ToastManager.success('সব ফিল্টার মুছে ফেলা হয়েছে');
  }
  
  static getLanguageName(langKey) {
    const names = {
      italy: 'ইতালিয়ান',
      spain: 'স্প্যানিশ',
      russian: 'রুশ',
      france: 'ফ্রেঞ্চ',
      germany: 'জার্মান',
      greece: 'গ্রিক'
    };
    return names[langKey] || 'অজানা ভাষা';
  }
  
  static getSpeechLang(langKey) {
    const speechLangs = {
      italy: 'it-IT',
      spain: 'es-ES',
      russian: 'ru-RU',
      france: 'fr-FR',
      germany: 'de-DE',
      greece: 'el-GR'
    };
    return speechLangs[langKey] || 'en-US';
  }
}

// 📚 ভোকাবুলারি ম্যানেজার
class VocabularyManager {
  static async loadLanguage(lang) {
    try {
      this.showLoading();
      
      currentLanguage = lang;
      
      // ডেটা লোড
      const response = await fetch(`${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      vocabularyData = await response.json();
      filteredData = [...vocabularyData];
      
      // UI আপডেট
      this.hideLoading();
      this.showVocabularyContent();
      
      // ফিল্টার এপ্লাই
      SearchAndFilter.applyFilters();
      
      // সফল মেসেজ
      ToastManager.success(`${SearchAndFilter.getLanguageName(lang)} ভাষার ডেটা লোড হয়েছে!`);
      
    } catch (error) {
      console.error('Language loading error:', error);
      this.hideLoading();
      this.showError(error.message);
      ToastManager.error('ভাষার ডেটা লোড করতে সমস্যা হয়েছে');
    }
  }
  
  static showLoading() {
    if (DOM.loadingContainer) {
      DOM.loadingContainer.style.display = 'flex';
    }
    if (DOM.welcomeContent) {
      DOM.welcomeContent.style.display = 'none';
    }
    if (DOM.vocabularyContent) {
      DOM.vocabularyContent.style.display = 'none';
    }
  }
  
  static hideLoading() {
    if (DOM.loadingContainer) {
      DOM.loadingContainer.style.display = 'none';
    }
  }
  
  static showVocabularyContent() {
    if (DOM.welcomeContent) {
      DOM.welcomeContent.style.display = 'none';
    }
    if (DOM.vocabularyContent) {
      DOM.vocabularyContent.style.display = 'block';
    }
  }
  
  static showWelcomeContent() {
    if (DOM.vocabularyContent) {
      DOM.vocabularyContent.style.display = 'none';
    }
    if (DOM.welcomeContent) {
      DOM.welcomeContent.style.display = 'block';
    }
  }
  
  static showError(message) {
    if (DOM.conversationArea) {
      DOM.conversationArea.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--danger-color);">
          <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
          <h3>ডেটা লোড করতে সমস্যা</h3>
          <p>${message}</p>
          <button onclick="location.reload()" 
                  style="margin-top: 16px; padding: 8px 16px; background: var(--primary-color); 
                         color: white; border: none; border-radius: 8px; cursor: pointer;">
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      `;
    }
  }
  
  static markAsLearned(index) {
    // প্রগ্রেস আপডেট
    const progress = ProgressTracker.updateDailyProgress(1);
    
    // UI আপডেট
    UIUpdater.updateProgressDisplay();
    UIUpdater.updateStatsPanel();
    
    // সফল মেসেজ
    ToastManager.success('নতুন শব্দ শিখেছেন! 🎉');
    
    // দৈনিক লক্ষ্য পূরণ চেক
    if (progress.wordsLearned >= progress.target) {
      setTimeout(() => {
        ToastManager.success('🏆 অভিনন্দন! আজকের লক্ষ্য পূরণ হয়েছে!');
      }, 500);
    }
  }
}

// 🎛️ UI কন্ট্রোলার
class UIController {
  static initializeEventListeners() {
    // ভাষা নির্বাচন
    if (DOM.languageSelect) {
      DOM.languageSelect.addEventListener('change', () => {
        const lang = DOM.languageSelect.value;
        if (lang) {
          StorageManager.set(CONFIG.STORAGE_KEYS.selectedLanguage, lang);
          VocabularyManager.loadLanguage(lang);
        } else {
          VocabularyManager.showWelcomeContent();
        }
      });
    }
    
    // থিম টগল
    if (DOM.modeToggle) {
      DOM.modeToggle.addEventListener('click', this.toggleTheme);
    }
    
    // স্ট্যাটিস্টিক্স টগল
    if (DOM.statsToggle) {
      DOM.statsToggle.addEventListener('click', this.toggleStatsPanel);
    }
    
    // মেনু টগল
    if (DOM.menuToggle) {
      DOM.menuToggle.addEventListener('click', this.toggleSideMenu);
    }
    
    if (DOM.closeMenu) {
      DOM.closeMenu.addEventListener('click', this.closeSideMenu);
    }
    
    // ল্যাঙ্গুয়েজ কার্ড ক্লিক
    document.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        if (lang && DOM.languageSelect) {
          DOM.languageSelect.value = lang;
          DOM.languageSelect.dispatchEvent(new Event('change'));
        }
      });
    });
    
    // ওভারলে ক্লিক (প্যানেল বন্ধ করার জন্য)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#stats-panel') && !e.target.closest('#stats-toggle')) {
        this.closeStatsPanel();
      }
      
      if (!e.target.closest('#side-menu') && !e.target.closest('#menu-toggle')) {
        this.closeSideMenu();
      }
    });
    
    // কীবোর্ড শর্টকাট
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            DOM.vocabularySearch?.focus();
            break;
          case 'd':
            e.preventDefault();
            this.toggleTheme();
            break;
        }
      }
      
      if (e.key === 'Escape') {
        this.closeAllPanels();
      }
    });
  }
  
  static toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    
    if (DOM.modeToggle) {
      DOM.modeToggle.textContent = isDark ? '🌙' : '☀️';
    }
    
    StorageManager.set(CONFIG.STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
    
    ToastManager.info(`${isDark ? 'ডার্ক' : 'লাইট'} মোড চালু করা হয়েছে`);
  }
  
  static toggleStatsPanel() {
    if (DOM.statsPanel) {
      DOM.statsPanel.classList.toggle('active');
      UIUpdater.updateStatsPanel();
    }
  }
  
  static closeStatsPanel() {
    if (DOM.statsPanel) {
      DOM.statsPanel.classList.remove('active');
    }
  }
  
  static toggleSideMenu() {
    if (DOM.sideMenu) {
      DOM.sideMenu.classList.toggle('active');
    }
  }
  
  static closeSideMenu() {
    if (DOM.sideMenu) {
      DOM.sideMenu.classList.remove('active');
    }
  }
  
  static closeAllPanels() {
    this.closeStatsPanel();
    this.closeSideMenu();
    if (DOM.filterPanel) {
      DOM.filterPanel.classList.remove('active');
    }
  }
}

// 🎯 অ্যাপ্লিকেশন ইনিশিয়ালাইজার
class App {
  static async initialize() {
    try {
      console.log('🚀 Speak EU অ্যাপ্লিকেশন শুরু হচ্ছে...');
      
      // ইউজার স্ট্যাটস ইনিশিয়ালাইজ
      ProgressTracker.initializeUserStats();
      
      // UI আপডেট
      UIUpdater.updateProgressDisplay();
      UIUpdater.updateStatsPanel();
      
      // ইভেন্ট লিসেনার সেটআপ
      UIController.initializeEventListeners();
      SearchAndFilter.initializeFilters();
      
      // সেভ করা সেটিংস লোড
      await this.loadSavedSettings();
      
      // স্বাগতম বার্তা
      ToastManager.success('Speak EU এ স্বাগতম! 🎉');
      
      console.log('✅ অ্যাপ্লিকেশন সফলভাবে লোড হয়েছে');
      
    } catch (error) {
      console.error('❌ অ্যাপ্লিকেশন ইনিশিয়ালাইজেশন ত্রুটি:', error);
      ToastManager.error('অ্যাপ্লিকেশন লোড করতে সমস্যা হয়েছে');
    }
  }
  
  static async loadSavedSettings() {
    // থিম লোড
    const savedTheme = StorageManager.get(CONFIG.STORAGE_KEYS.theme);
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (DOM.modeToggle) {
        DOM.modeToggle.textContent = '🌙';
      }
    }
    
    // সেভ করা ভাষা লোড
    const savedLang = StorageManager.get(CONFIG.STORAGE_KEYS.selectedLanguage);
    if (savedLang && DOM.languageSelect) {
      DOM.languageSelect.value = savedLang;
      await VocabularyManager.loadLanguage(savedLang);
    }
  }
}

// 🎬 CSS অ্যানিমেশন যোগ করা
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutToast {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  mark {
    background: yellow;
    color: black;
    padding: 2px 4px;
    border-radius: 3px;
  }
  
  body.dark-mode mark {
    background: #ffc107;
    color: #000;
  }
  
  .learn-btn:hover {
    background: var(--secondary-color) !important;
    transform: scale(1.05);
  }
`;
document.head.appendChild(style);

// 🚀 অ্যাপ্লিকেশন স্টার্ট
document.addEventListener('DOMContentLoaded', () => {
  App.initialize();
});

// গ্লোবাল ফাংশন (HTML থেকে কল করার জন্য)
window.VocabularyManager = VocabularyManager;
window.ToastManager = ToastManager;
window.UIController = UIController;

console.log('📚 Speak EU - ইউরোপীয় ভাষা শিক্ষার প্ল্যাটফর্ম');
console.log('🔧 সব ফিচার লোড হয়েছে');
