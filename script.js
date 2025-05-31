// 🎯 কনফিগারেশন
const CONFIG = {
  DAILY_TARGET: 10,
  LANGUAGES_PATH: 'languages/', // ভাষার ফাইলের পথ
  STORAGE_KEYS: {
    selectedLanguage: 'speak_eu_language',
    theme: 'speak_eu_theme',
    dailyProgress: 'speak_eu_daily_progress',
    userStats: 'speak_eu_user_stats'
  }
};

// 🎮 DOM এলিমেন্টস
const elements = {
  languageSelect: document.getElementById('language-select'),
  conversationArea: document.getElementById('conversation-area'),
  welcomeContent: document.getElementById('welcome-content'),
  vocabularyContent: document.getElementById('vocabulary-content'),
  loadingContainer: document.getElementById('loading-container'),
  searchSection: document.getElementById('search-section'),
  progressSection: document.getElementById('progress-section'),
  
  // কন্ট্রোলস
  modeToggle: document.getElementById('mode-toggle'),
  menuToggle: document.getElementById('menu-toggle'),
  closeMenu: document.getElementById('close-menu'),
  sideMenu: document.getElementById('side-menu'),
  
  // সার্চ
  vocabularySearch: document.getElementById('vocabulary-search'),
  searchBtn: document.getElementById('search-btn'),
  clearFilters: document.getElementById('clear-filters'),
  
  // প্রগ্রেস
  dailyProgress: document.getElementById('daily-progress'),
  wordsLearnedToday: document.getElementById('words-learned-today'),
  totalWordsLearned: document.getElementById('total-words-learned'),
  currentStreak: document.getElementById('current-streak'),
  
  // অন্যান্য
  toastContainer: document.getElementById('toast-container')
};

// 🗺️ ভাষা ম্যাপিং
const langMap = {
  italy: 'it',
  spain: 'es',
  russian: 'ru',
  france: 'fr',
  germany: 'de',
  greece: 'el',
  portugal: 'pt',
  netherlands: 'nl'
};

// 📊 গ্লোবাল স্টেট
let currentLanguage = '';
let vocabularyData = [];
let filteredData = [];
let searchQuery = '';

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

function highlightText(text, query) {
  if (!query || typeof text !== 'string') return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: yellow; padding: 2px;">$1</mark>');
}

// 🎉 টোস্ট সিস্টেম
function showToast(message, type = 'info') {
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
  
  toast.style.cssText = `
    background: white;
    padding: 16px 20px;
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-left: 4px solid ${colors[type] || colors.info};
    transform: translateX(100%);
    transition: transform 0.3s ease;
    cursor: pointer;
    position: relative;
    z-index: 1002;
  `;
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; color: #333;">
      <span style="font-size: 18px;">${icons[type] || icons.info}</span>
      <span style="flex: 1; font-weight: 500;">${message}</span>
    </div>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    removeToast(toast);
  }, 4000);
  
  toast.addEventListener('click', () => {
    removeToast(toast);
  });
}

function removeToast(toast) {
  if (toast && toast.parentNode) {
    toast.style.transform = 'translateX(100%)';
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
    target: CONFIG.DAILY_TARGET
  });
  
  if (progress.date !== today) {
    progress = {
      date: today,
      wordsLearned: 0,
      target: CONFIG.DAILY_TARGET
    };
    saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, progress);
  }
  
  return progress;
}

function updateDailyProgress(increment = 1) {
  const progress = getDailyProgress();
  progress.wordsLearned += increment;
  saveToStorage(CONFIG.STORAGE_KEYS.dailyProgress, progress);
  
  updateUserStats(increment);
  updateProgressDisplay();
  
  return progress;
}

function updateUserStats(increment = 1) {
  const today = getTodayDate();
  let stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {
    totalWordsLearned: 0,
    currentStreak: 0,
    lastActiveDate: null
  });
  
  stats.totalWordsLearned += increment;
  
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
}

function updateProgressDisplay() {
  const progress = getDailyProgress();
  const percentage = Math.round((progress.wordsLearned / progress.target) * 100);
  
  if (elements.dailyProgress) {
    elements.dailyProgress.style.width = `${Math.min(percentage, 100)}%`;
  }
  
  if (elements.wordsLearnedToday) {
    elements.wordsLearnedToday.textContent = `${progress.wordsLearned}/${progress.target}`;
  }
}

function updateStatsDisplay() {
  const stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {
    totalWordsLearned: 0,
    currentStreak: 0
  });
  
  if (elements.totalWordsLearned) {
    elements.totalWordsLearned.textContent = stats.totalWordsLearned;
  }
  
  if (elements.currentStreak) {
    elements.currentStreak.textContent = stats.currentStreak;
  }
}

// 📚 ভোকাবুলারি ম্যানেজার
async function loadLanguage(lang) {
  try {
    showLoading();
    currentLanguage = lang;
    
    console.log(`Loading ${CONFIG.LANGUAGES_PATH}${lang}.json...`);
    
    // languages ফোল্ডার থেকে ফাইল লোড
    const response = await fetch(`${CONFIG.LANGUAGES_PATH}${lang}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ফাইল পাওয়া যায়নি: ${CONFIG.LANGUAGES_PATH}${lang}.json`);
    }
    
    const text = await response.text();
    
    if (!text.trim()) {
      throw new Error('ফাইলটি খালি বা অবৈধ');
    }
    
    try {
      vocabularyData = JSON.parse(text);
    } catch (parseError) {
      throw new Error('JSON ফাইল ভুল ফরম্যাটে আছে');
    }
    
    if (!Array.isArray(vocabularyData) || vocabularyData.length === 0) {
      throw new Error('ভোকাবুলারি ডেটা খালি বা অবৈধ');
    }
    
    filteredData = [...vocabularyData];
    
    console.log(`সফলভাবে ${vocabularyData.length}টি শব্দ লোড হয়েছে`);
    
    hideLoading();
    showVocabularyMode();
    renderVocabulary();
    
    showToast(`${getLanguageName(lang)} ভাষার ${vocabularyData.length}টি শব্দ লোড হয়েছে!`, 'success');
    
  } catch (error) {
    console.error('ভাষা লোড করতে সমস্যা:', error);
    hideLoading();
    showError(error.message);
    showToast(`ভাষা লোড করতে সমস্যা: ${error.message}`, 'error');
  }
}

function showLoading() {
  hideElement(elements.welcomeContent);
  hideElement(elements.vocabularyContent);
  showElement(elements.loadingContainer);
}

function hideLoading() {
  hideElement(elements.loadingContainer);
}

function showVocabularyMode() {
  hideElement(elements.welcomeContent);
  showElement(elements.vocabularyContent);
  showElement(elements.searchSection);
  showElement(elements.progressSection);
}

function showWelcomeMode() {
  showElement(elements.welcomeContent);
  hideElement(elements.vocabularyContent);
  hideElement(elements.searchSection);
  hideElement(elements.progressSection);
}

function showError(message) {
  showWelcomeMode();
  
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    text-align: center; 
    padding: 40px 20px; 
    background: white;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-left: 4px solid #dc3545;
  `;
  
  errorDiv.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
    <h3 style="color: #dc3545; margin-bottom: 12px;">ডেটা লোড করতে সমস্যা</h3>
    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">${message}</p>
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <button onclick="location.reload()" 
              style="padding: 12px 24px; background: #0066cc; color: white; border: none; 
                     border-radius: 8px; cursor: pointer; font-weight: 500;">
        🔄 পুনরায় চেষ্টা করুন
      </button>
      <button onclick="goHome()" 
              style="padding: 12px 24px; background: #6c757d; color: white; border: none; 
                     border-radius: 8px; cursor: pointer; font-weight: 500;">
        🏠 হোমে ফিরুন
      </button>
    </div>
    <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
      <strong>সমাধান:</strong><br>
      • নিশ্চিত করুন যে <code>languages</code> ফোল্ডার রুট ডিরেক্টরিতে আছে<br>
      • চেক করুন <code>languages/${currentLanguage}.json</code> ফাইলটি সঠিক জায়গায় আছে কি না<br>
      • JSON ফাইলের ফরম্যাট সঠিক আছে কি না দেখুন
    </div>
  `;
  
  elements.conversationArea.appendChild(errorDiv);
}

function goHome() {
  if (elements.languageSelect) {
    elements.languageSelect.value = '';
  }
  showWelcomeMode();
  // এরর মেসেজ ডিভ রিমুভ করুন
  const errorDivs = elements.conversationArea.querySelectorAll('div[style*="border-left: 4px solid #dc3545"]');
  errorDivs.forEach(div => div.remove());
}

// 🔍 সার্চ এবং রেন্ডার
function handleSearch() {
  if (!vocabularyData.length) return;
  
  searchQuery = elements.vocabularySearch ? elements.vocabularySearch.value.toLowerCase().trim() : '';
  
  if (searchQuery) {
    filteredData = vocabularyData.filter(item => {
      const searchableText = [
        item[langMap[currentLanguage]] || '',
        item.bn || '',
        item.bnMeaning || '',
        item.en || ''
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchQuery);
    });
    
    showToast(`"${searchQuery}" এর জন্য ${filteredData.length}টি ফলাফল পাওয়া গেছে`, 'info');
  } else {
    filteredData = [...vocabularyData];
  }
  
  renderVocabulary();
}

function clearSearch() {
  searchQuery = '';
  if (elements.vocabularySearch) {
    elements.vocabularySearch.value = '';
  }
  filteredData = [...vocabularyData];
  renderVocabulary();
  showToast('সার্চ মুছে ফেলা হয়েছে', 'success');
}

function renderVocabulary() {
  if (!elements.vocabularyContent) return;
  
  // হেডার তৈরি
  const header = document.createElement('div');
  header.className = 'vocabulary-header';
  header.innerHTML = `
    <div class="vocabulary-title">
      📚 ${getLanguageName(currentLanguage)} শব্দভাণ্ডার
    </div>
    <div class="vocabulary-stats">
      মোট: ${vocabularyData.length} | দেখানো হচ্ছে: ${filteredData.length}
      ${searchQuery ? ` | খুঁজেছেন: "${searchQuery}"` : ''}
    </div>
  `;
  
  // গ্রিড তৈরি
  const grid = document.createElement('div');
  grid.className = 'vocabulary-grid';
  
  if (filteredData.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--gray-500);">
        <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
        <h3 style="margin-bottom: 12px;">কোন ফলাফল পাওয়া যায়নি</h3>
        <p>অন্য কীওয়ার্ড দিয়ে অনুসন্ধান করে দেখুন</p>
      </div>
    `;
  } else {
    filteredData.forEach((item, index) => {
      const vocabItem = createVocabularyItem(item, index);
      grid.appendChild(vocabItem);
    });
  }
  
  // কনটেন্ট আপডেট
  elements.vocabularyContent.innerHTML = '';
  elements.vocabularyContent.appendChild(header);
  elements.vocabularyContent.appendChild(grid);
}

function createVocabularyItem(item, index) {
  const localLang = item[langMap[currentLanguage]] || '—';
  const bn = item.bn || '—';
  const bnMeaning = item.bnMeaning || '—';
  const en = item.en || '—';
  
  const div = document.createElement('div');
  div.className = 'conversation-item';
  
  div.innerHTML = `
    <div>
      <span style="font-size: 20px;">🗣️</span>
      <strong>${highlightText(localLang, searchQuery)}</strong>
      <button class="learn-btn" onclick="markAsLearned()" title="শেখা হয়েছে হিসেবে চিহ্নিত করুন">
        ✓ শিখেছি
      </button>
    </div>
    <div>
      <span style="font-size: 16px;">📝</span>
      <span>${highlightText(bn, searchQuery)}</span>
    </div>
    <div>
      <span style="font-size: 16px;">📘</span>
      <em>${highlightText(bnMeaning, searchQuery)}</em>
    </div>
    <div>
      <span style="font-size: 16px;">🔤</span>
      <span>${highlightText(en, searchQuery)}</span>
    </div>
  `;
  
  // ক্লিক ইভেন্ট - উচ্চারণ
  div.addEventListener('click', (e) => {
    if (!e.target.classList.contains('learn-btn')) {
      speakText(localLang);
    }
  });
  
  return div;
}

function speakText(text) {
  if ('speechSynthesis' in window && text !== '—') {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLang(currentLanguage);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      showToast('🔊 উচ্চারণ শোনানো হচ্ছে...', 'info');
    } catch (error) {
      console.error('Speech error:', error);
    }
  }
}

function getSpeechLang(langKey) {
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

function markAsLearned() {
  const progress = updateDailyProgress(1);
  showToast('🎉 নতুন শব্দ শিখেছেন!', 'success');
  
  if (progress.wordsLearned >= progress.target) {
    setTimeout(() => {
      showToast('🏆 অভিনন্দন! আজকের লক্ষ্য পূরণ হয়েছে!', 'success');
    }, 1000);
  }
}

function getLanguageName(langKey) {
  const names = {
    italy: 'ইতালিয়ান',
    spain: 'স্প্যানিশ', 
    russian: 'রুশ',
    france: 'ফ্রেঞ্চ',
    germany: 'জার্মান',
    greece: 'গ্রিক',
    portugal: 'পর্তুগিজ',
    netherlands: 'ডাচ'
  };
  return names[langKey] || 'অজানা ভাষা';
}

// 🎛️ UI কন্ট্রোলার
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  if (elements.modeToggle) {
    elements.modeToggle.textContent = isDark ? '🌙' : '☀️';
  }
  saveToStorage(CONFIG.STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  showToast(`${isDark ? 'ডার্ক' : 'লাইট'} মোড চালু করা হয়েছে`, 'success');
}

function toggleSideMenu() {
  if (elements.sideMenu) {
    elements.sideMenu.classList.add('active');
  }
}

function closeSideMenu() {
  if (elements.sideMenu) {
    elements.sideMenu.classList.remove('active');
  }
}

function showProgress() {
  const stats = loadFromStorage(CONFIG.STORAGE_KEYS.userStats, {});
  const progress = getDailyProgress();
  
  showToast(`📊 আপনার অগ্রগতি:
• আজ: ${progress.wordsLearned}/${progress.target}
• মোট: ${stats.totalWordsLearned || 0} শব্দ
• ধারাবাহিক: ${stats.currentStreak || 0} দিন`, 'info');
}

function showAbout() {
  showToast(`ℹ️ Speak EU v1.0
ইউরোপীয় ভাষা শেখার জন্য বিশেষভাবে তৈরি।
বাংলাদেশি অভিবাসীদের জন্য সহজ ভাষা শিক্ষা।`, 'info');
}

function showHelp() {
  showToast(`❓ সাহায্য:
• ভাষা নির্বাচন করুন
• শব্দে ক্লিক করে উচ্চারণ শুনুন  
• "শিখেছি" বাটনে ক্লিক করে প্রগ্রেস বাড়ান
• প্রতিদিন ১০টি নতুন শব্দ শিখুন`, 'info');
}

// 🚀 ইভেন্ট লিসেনার সেটআপ
function setupEventListeners() {
  // ভাষা নির্বাচন
  if (elements.languageSelect) {
    elements.languageSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (lang) {
        saveToStorage(CONFIG.STORAGE_KEYS.selectedLanguage, lang);
        loadLanguage(lang);
      } else {
        showWelcomeMode();
      }
    });
  }
  
  // থিম টগল
  if (elements.modeToggle) {
    elements.modeToggle.addEventListener('click', toggleTheme);
  }
  
  // মেনু কন্ট্রোল
  if (elements.menuToggle) {
    elements.menuToggle.addEventListener('click', toggleSideMenu);
  }
  
  if (elements.closeMenu) {
    elements.closeMenu.addEventListener('click', closeSideMenu);
  }
  
  // সার্চ
  if (elements.vocabularySearch) {
    elements.vocabularySearch.addEventListener('input', handleSearch);
    elements.vocabularySearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  if (elements.searchBtn) {
    elements.searchBtn.addEventListener('click', handleSearch);
  }
  
  if (elements.clearFilters) {
    elements.clearFilters.addEventListener('click', clearSearch);
  }
  
  // ভাষা কার্ড ক্লিক
  document.querySelectorAll('.language-card').forEach(card => {
    card.addEventListener('click', () => {
      const lang = card.dataset.lang;
      if (lang && elements.languageSelect) {
        elements.languageSelect.value = lang;
        elements.languageSelect.dispatchEvent(new Event('change'));
      }
    });
  });
  
  // মেনু আইটেম
  const menuActions = {
    'menu-home': () => {
      closeSideMenu();
      if (elements.languageSelect) elements.languageSelect.value = '';
      showWelcomeMode();
    },
    'menu-progress': () => {
      closeSideMenu();
      showProgress();
    },
    'menu-vocabulary': () => {
      closeSideMenu();
      if (currentLanguage) {
        showVocabularyMode();
      } else {
        showToast('প্রথমে একটি ভাষা নির্বাচন করুন', 'warning');
      }
    },
    'menu-about': () => {
      closeSideMenu();
      showAbout();
    },
    'menu-help': () => {
      closeSideMenu();
      showHelp();
    }
  };
  
  Object.keys(menuActions).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        menuActions[id]();
      });
    }
  });
}

// 📱 ইনিশিয়ালাইজেশন
function initializeApp() {
  console.log('Speak EU App শুরু হচ্ছে...');
  
  // ইভেন্ট লিসেনার সেটআপ
  setupEventListeners();
  
  // সেভ করা সেটিংস লোড
  const savedLang = loadFromStorage(CONFIG.STORAGE_KEYS.selectedLanguage);
  if (savedLang && elements.languageSelect) {
    elements.languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }
  
  const savedTheme = loadFromStorage(CONFIG.STORAGE_KEYS.theme);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (elements.modeToggle) elements.modeToggle.textContent = '🌙';
  }
  
  // প্রগ্রেস আপডেট
  updateProgressDisplay();
  updateStatsDisplay();
  
  // ওয়েলকাম মেসেজ
  setTimeout(() => {
    showToast('🌟 Speak EU এ স্বাগতম! ইউরোপীয় ভাষা শিখুন সহজেই।', 'success');
  }, 1000);
  
  console.log('Speak EU App সফলভাবে শুরু হয়েছে!');
}

// 🎯 অ্যাপ লোড হলে চালু করুন
document.addEventListener('DOMContentLoaded', initializeApp);

// 🌐 গ্লোবাল ফাংশন (HTML থেকে কল করার জন্য)
window.markAsLearned = markAsLearned;
window.goHome = goHome;
