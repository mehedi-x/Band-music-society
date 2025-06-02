// Global Variables
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const progressToggle = document.getElementById('progress-toggle');
const progressModal = document.getElementById('progress-modal');
const closeModal = document.querySelector('.close-modal');
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const searchToggle = document.getElementById('search-toggle');
const searchBox = document.getElementById('search-box');

let currentLanguageData = [];
let currentLanguage = '';
let filteredData = [];

// Progress Tracking
class ProgressTracker {
  constructor() {
    this.progress = this.loadProgress();
    this.updateStreak();
  }

  loadProgress() {
    const saved = localStorage.getItem('speakeu_progress');
    return saved ? JSON.parse(saved) : {
      languages: {},
      streak: 0,
      lastStudyDate: null,
      achievements: [],
      totalWordsLearned: 0
    };
  }

  saveProgress() {
    localStorage.setItem('speakeu_progress', JSON.stringify(this.progress));
  }

  markWordLearned(language, wordIndex) {
    if (!this.progress.languages[language]) {
      this.progress.languages[language] = {
        learnedWords: [],
        totalWords: 0,
        lastStudied: null
      };
    }

    const langProgress = this.progress.languages[language];
    if (!langProgress.learnedWords.includes(wordIndex)) {
      langProgress.learnedWords.push(wordIndex);
      this.progress.totalWordsLearned++;
      this.updateStreak();
      this.checkAchievements();
      this.saveProgress();
      return true;
    }
    return false;
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastStudy = this.progress.lastStudyDate;
    
    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudy === yesterday.toDateString()) {
        this.progress.streak++;
      } else {
        this.progress.streak = 1;
      }
      
      this.progress.lastStudyDate = today;
      this.saveProgress();
    }
  }

  getLanguageProgress(language) {
    return this.progress.languages[language] || {
      learnedWords: [],
      totalWords: 0,
      lastStudied: null
    };
  }

  checkAchievements() {
    const achievements = [
      { id: 'first_word', name: 'First Steps', desc: 'Learn your first word', condition: () => this.progress.totalWordsLearned >= 1 },
      { id: 'ten_words', name: 'Getting Started', desc: 'Learn 10 words', condition: () => this.progress.totalWordsLearned >= 10 },
      { id: 'fifty_words', name: 'Word Collector', desc: 'Learn 50 words', condition: () => this.progress.totalWordsLearned >= 50 },
      { id: 'week_streak', name: 'Consistent Learner', desc: '7-day streak', condition: () => this.progress.streak >= 7 }
    ];

    achievements.forEach(achievement => {
      if (achievement.condition() && !this.progress.achievements.includes(achievement.id)) {
        this.progress.achievements.push(achievement.id);
        this.showAchievementNotification(achievement);
      }
    });
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-text">
          <strong>Achievement Unlocked!</strong>
          <div>${achievement.name}</div>
          <small>${achievement.desc}</small>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  exportProgress() {
    const data = {
      exportDate: new Date().toISOString(),
      ...this.progress
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speakeu_progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

const progressTracker = new ProgressTracker();

// Language Code Mapping
const langCodeMap = {
  italy: 'it',
  spain: 'es', 
  france: 'fr',
  germany: 'de',
  greece: 'el',
  portugal: 'pt'
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  loadSavedSettings();
  registerServiceWorker();
});

function loadSavedSettings() {
  // Load saved language
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  }
}

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// Language Selection
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (lang) {
    localStorage.setItem('selectedLanguage', lang);
    loadLanguage(lang);
  }
});

function selectLanguage(lang) {
  languageSelect.value = lang;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
}

// Load Language Data
function loadLanguage(lang) {
  currentLanguage = lang;
  
  fetch(`languages/${lang}.json`)
    .then(res => {
      if (!res.ok) throw new Error('Language file not found');
      return res.json();
    })
    .then(data => {
      currentLanguageData = data;
      filteredData = data;
      renderVocabulary(data);
      updateCurrentProgress(lang, data.length);
      showSearchBox();
    })
    .catch(error => {
      console.error('Error loading language:', error);
      conversationArea.innerHTML = `
        <div class="error-message">
          <h3>❌ Language file not found</h3>
          <p>Please make sure ${lang}.json exists in the languages folder.</p>
        </div>
      `;
    });
}

function showSearchBox() {
  searchBox.style.display = 'block';
}

// Render Vocabulary
function renderVocabulary(list) {
  const defaultContent = document.getElementById('default-content');
  const currentProgress = document.getElementById('current-progress');
  
  defaultContent.style.display = 'none';
  currentProgress.style.display = 'block';
  
  if (!Array.isArray(list) || list.length === 0) {
    conversationArea.innerHTML = '<p>No data found for this language.</p>';
    return;
  }

  conversationArea.innerHTML = currentProgress.outerHTML;

  list.forEach((item, index) => {
    const langProgress = progressTracker.getLanguageProgress(currentLanguage);
    const isLearned = langProgress.learnedWords.includes(index);
    
    const div = document.createElement('div');
    div.className = `conversation-item ${isLearned ? 'learned' : ''}`;
    div.innerHTML = `
      <div class="conversation-content">
        <div class="word-main">
          <span class="local-word">${item.local || item[langCodeMap[currentLanguage]] || '—'}</span>
          <button class="speak-btn" onclick="speakWord('${item.local || item[langCodeMap[currentLanguage]] || ''}', '${langCodeMap[currentLanguage]}')">🔊</button>
        </div>
        <div class="word-bengali">📝 ${item.bn || '—'}</div>
        <div class="word-meaning">📘 ${item.bnMeaning || '—'}</div>
        <div class="word-english">🔤 ${item.en || '—'}</div>
      </div>
      <div class="conversation-actions">
        <button class="learn-btn ${isLearned ? 'learned' : ''}" 
                onclick="toggleWordLearned(${index})" 
                title="${isLearned ? 'Mark as not learned' : 'Mark as learned'}">
          ${isLearned ? '✅' : '📚'}
        </button>
      </div>
    `;
    conversationArea.appendChild(div);
  });
}

// Audio Pronunciation
function speakWord(text, lang) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  } else {
    alert('Speech synthesis not supported in this browser');
  }
}

// Toggle Word Learned
function toggleWordLearned(wordIndex) {
  const langProgress = progressTracker.getLanguageProgress(currentLanguage);
  const isCurrentlyLearned = langProgress.learnedWords.includes(wordIndex);
  
  if (isCurrentlyLearned) {
    const index = langProgress.learnedWords.indexOf(wordIndex);
    langProgress.learnedWords.splice(index, 1);
    progressTracker.progress.totalWordsLearned--;
  } else {
    progressTracker.markWordLearned(currentLanguage, wordIndex);
  }
  
  progressTracker.saveProgress();
  updateCurrentProgress(currentLanguage, currentLanguageData.length);
  renderVocabulary(filteredData);
}

// Update Progress
function updateCurrentProgress(language, totalWords) {
  const langProgress = progressTracker.getLanguageProgress(language);
  const learnedCount = langProgress.learnedWords.length;
  const progressPercent = totalWords > 0 ? (learnedCount / totalWords) * 100 : 0;

  progressTracker.progress.languages[language] = {
    ...langProgress,
    totalWords: totalWords
  };
  progressTracker.saveProgress();

  document.getElementById('progress-language').textContent = `${language.charAt(0).toUpperCase() + language.slice(1)} Progress`;
  document.getElementById('progress-text').textContent = `${learnedCount}/${totalWords} words learned`;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;
}

// Search Functionality
searchToggle.addEventListener('click', () => {
  const isVisible = searchBox.style.display === 'block';
  searchBox.style.display = isVisible ? 'none' : 'block';
  if (!isVisible) {
    searchBox.focus();
  } else {
    searchBox.value = '';
    filteredData = currentLanguageData;
    renderVocabulary(filteredData);
  }
});

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  if (query === '') {
    filteredData = currentLanguageData;
  } else {
    filteredData = currentLanguageData.filter(item => {
      const local = (item.local || item[langCodeMap[currentLanguage]] || '').toLowerCase();
      const bn = (item.bn || '').toLowerCase();
      const en = (item.en || '').toLowerCase();
      const meaning = (item.bnMeaning || '').toLowerCase();
      
      return local.includes(query) || bn.includes(query) || en.includes(query) || meaning.includes(query);
    });
  }
  renderVocabulary(filteredData);
});

// Theme Toggle
modeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Menu Functions
menuToggle.addEventListener('click', () => {
  sideMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
  sideMenu.classList.remove('active');
});

// Progress Modal
progressToggle.addEventListener('click', () => {
  showProgressModal();
});

closeModal.addEventListener('click', () => {
  progressModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === progressModal) {
    progressModal.style.display = 'none';
  }
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove('active');
  }
});

function showProgressModal() {
  progressModal.style.display = 'block';
  updateProgressStats();
  displayAchievements();
}

function updateProgressStats() {
  document.getElementById('total-learned').textContent = progressTracker.progress.totalWordsLearned;
  document.getElementById('current-streak').textContent = progressTracker.progress.streak;
  document.getElementById('languages-studied').textContent = Object.keys(progressTracker.progress.languages).length;
}

function displayAchievements() {
  const achievementList = document.getElementById('achievement-list');
  const allAchievements = [
    { id: 'first_word', name: 'First Steps', desc: 'Learn your first word', icon: '🌟' },
    { id: 'ten_words', name: 'Getting Started', desc: 'Learn 10 words', icon: '🎯' },
    { id: 'fifty_words', name: 'Word Collector', desc: 'Learn 50 words', icon: '📚' },
    { id: 'week_streak', name: 'Consistent Learner', desc: '7-day streak', icon: '🔥' }
  ];

  achievementList.innerHTML = '';
  allAchievements.forEach(achievement => {
    const isUnlocked = progressTracker.progress.achievements.includes(achievement.id);
    const div = document.createElement('div');
    div.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    div.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.desc}</div>
      </div>
      ${isUnlocked ? '<div class="achievement-status">✅</div>' : '<div class="achievement-status">🔒</div>'}
    `;
    achievementList.appendChild(div);
  });
}

// Page Functions
function showPage(page) {
  sideMenu.classList.remove('active');
  document.getElementById('current-progress').style.display = 'none';
  
  let content = '';
  switch(page) {
    case 'home':
      content = getHomeContent();
      break;
    case 'about':
      content = getAboutContent();
      break;
    case 'contact':
      content = getContactContent();
      break;
    case 'privacy':
      content = getPrivacyContent();
      break;
  }
  
  conversationArea.innerHTML = content;
}

function getHomeContent() {
  return `
    <div class="page-content">
      <h1 class="page-title">🌟 Speak EU</h1>
      <p class="page-subtitle">ইউরোপের ভাষা শিখুন আত্মবিশ্বাসের সাথে</p>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">${Object.keys(progressTracker.progress.languages).length}</div>
          <div class="stat-label">Languages</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${progressTracker.progress.totalWordsLearned}</div>
          <div class="stat-label">Words Learned</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${progressTracker.progress.streak}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>6+ ইউরোপীয় ভাষা</h3>
          <p>সকল প্রধান ইউরোপীয় দেশের ভাষা একটি প্ল্যাটফর্মে</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>প্রোগ্রেস ট্র্যাকিং</h3>
          <p>আপনার শেখার অগ্রগতি পর্যবেক্ষণ করুন</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔊</div>
          <h3>অডিও উচ্চারণ</h3>
          <p>নেটিভ উচ্চারণ শুনুন এবং শিখুন</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>ব্যবহারিক বাক্য</h3>
          <p>দৈনন্দিন জীবনে ব্যবহৃত প্রয়োজনীয় বাক্য</p>
        </div>
      </div>

      <div class="quick-languages">
        <h3>🚀 দ্রুত শুরু করুন</h3>
        <div class="language-buttons">
          <button onclick="selectLanguage('italy')">🇮🇹 Italian</button>
          <button onclick="selectLanguage('spain')">🇪🇸 Spanish</button>
          <button onclick="selectLanguage('france')">🇫🇷 French</button>
          <button onclick="selectLanguage('germany')">🇩🇪 German</button>
          <button onclick="selectLanguage('greece')">🇬🇷 Greek</button>
          <button onclick="selectLanguage('portugal')">🇵🇹 Portuguese</button>
        </div>
      </div>
    </div>
  `;
}

function getAboutContent() {
  return `
    <div class="page-content">
      <h1 class="page-title">ℹ️ About Speak EU</h1>
      <p class="page-subtitle">আমাদের সম্পর্কে জানুন</p>
      
      <div class="info-grid">
        <div class="info-card">
          <h3>🎯 আমাদের মিশন</h3>
          <p>ইউরোপের যেকোনো দেশে আপনার ভাষাগত বাধা দূর করা এবং স্থানীয় ভাষায় আত্মবিশ্বাসের সাথে কথা বলার ক্ষমতা তৈরি করা।</p>
        </div>
        
        <div class="info-card">
          <h3>🌟 কেন Speak EU?</h3>
          <ul>
            <li>6+ ইউরোপীয় ভাষার সাপোর্ট</li>
            <li>ব্যবহারিক দৈনন্দিন বাক্য</li>
            <li>প্রোগ্রেস ট্র্যাকিং সিস্টেম</li>
            <li>অডিও উচ্চারণ সুবিধা</li>
            <li>সম্পূর্ণ ফ্রি</li>
          </ul>
        </div>
        
        <div class="info-card">
          <h3>🎓 শিক্ষা পদ্ধতি</h3>
          <p>আমাদের প্ল্যাটফর্ম বিজ্ঞানভিত্তিক শিক্ষা পদ্ধতি ব্যবহার করে যা দ্রুত এবং কার্যকর ভাষা শিখতে সাহায্য করে।</p>
        </div>
        
        <div class="info-card">
          <h3>🚀 ভবিষ্যতের পরিকল্পনা</h3>
          <p>আরও ভাষা যোগ করা, গেমিফিকেশন, AI সাপোর্ট এবং মোবাইল অ্যাপ তৈরি করার পরিকল্পনা রয়েছে।</p>
        </div>
      </div>
    </div>
  `;
}

function getContactContent() {
  return `
    <div class="page-content">
      <h1 class="page-title">📞 Contact Us</h1>
      <p class="page-subtitle">আমাদের সাথে যোগাযোগ করুন</p>
      
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-icon">📧</span>
          <div>
            <strong>ইমেইল</strong>
            <p>support@speakeu.com</p>
          </div>
        </div>
        
        <div class="contact-item">
          <span class="contact-icon">🌐</span>
          <div>
            <strong>ওয়েবসাইট</strong>
            <p>www.speakeu.com</p>
          </div>
        </div>
        
        <div class="contact-item">
          <span class="contact-icon">📱</span>
          <div>
            <strong>সোশ্যাল মিডিয়া</strong>
            <p>Facebook | Telegram</p>
          </div>
        </div>
      </div>

      <form class="contact-form" onsubmit="sendMessage(event)">
        <div class="form-group">
          <label>নাম</label>
          <input type="text" required placeholder="আপনার নাম লিখুন">
        </div>
        <div class="form-group">
          <label>ইমেইল</label>
          <input type="email" required placeholder="আপনার ইমেইল লিখুন">
        </div>
        <div class="form-group">
          <label>বার্তা</label>
          <textarea rows="5" required placeholder="আপনার বার্তা লিখুন"></textarea>
        </div>
        <button type="submit" class="submit-btn">বার্তা পাঠান</button>
      </form>
    </div>
  `;
}

function getPrivacyContent() {
  return `
    <div class="page-content">
      <h1 class="page-title">🔒 Privacy Policy</h1>
      <p class="page-subtitle">গোপনীয়তা নীতি</p>
      
      <div class="privacy-sections">
        <section>
          <h3>📋 তথ্য সংগ্রহ</h3>
          <ul>
            <li>আমরা শুধুমাত্র আপনার শেখার অগ্রগতি সংরক্ষণ করি</li>
            <li>কোন ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না</li>
            <li>সকল ডেটা স্থানীয়ভাবে আপনার ডিভাইসে সংরক্ষিত</li>
          </ul>
        </section>
        
        <section>
          <h3>🛡️ নিরাপত্তা</h3>
          <ul>
            <li>আপনার ডেটা এনক্রিপ্টেড অবস্থায় সংরক্ষিত</li>
            <li>কোন ট্র্যাকিং বা বিজ্ঞাপন নেই</li>
            <li>সম্পূর্ণ অফলাইন কার্যকারিতা</li>
          </ul>
        </section>
        
        <section>
          <h3>🔄 ডেটা নিয়ন্ত্রণ</h3>
          <ul>
            <li>আপনি যেকোনো সময় আপনার ডেটা এক্সপোর্ট করতে পারেন</li>
            <li>সম্পূর্ণ ডেটা মুছে ফেলার অপশন আছে</li>
            <li>আপনার সম্মতি ছাড়া কোন তথ্য ব্যবহার করা হয় না</li>
          </ul>
        </section>
      </div>
      
      <p class="last-updated">সর্বশেষ আপডেট: ২ জুন, ২০২৫</p>
    </div>
  `;
}

// Utility Functions
function sendMessage(event) {
  event.preventDefault();
  alert('ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।');
  event.target.reset();
}

function exportProgress() {
  progressTracker.exportProgress();
  sideMenu.classList.remove('active');
}

function clearSoftware() {
  if (confirm('সব ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।')) {
    localStorage.clear();
    location.reload();
  }
  sideMenu.classList.remove('active');
}
