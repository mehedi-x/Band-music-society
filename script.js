const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const progressToggle = document.getElementById('progress-toggle');
const progressModal = document.getElementById('progress-modal');
const closeModal = document.querySelector('.close-modal');

// Current language data
let currentLanguageData = [];
let currentLanguage = '';
let isShowingHome = false;

const langCodeMap = {
  austria: 'de',
  belgium: 'nl',
  czech: 'cs',
  denmark: 'da',
  estonia: 'et',
  finland: 'fi',
  france: 'fr',
  germany: 'de',
  greece: 'el',
  hungary: 'hu',
  iceland: 'is',
  italy: 'it',
  latvia: 'lv',
  liechtenstein: 'de',
  lithuania: 'lt',
  luxembourg: 'lb',
  malta: 'mt',
  netherlands: 'nl',
  norway: 'no',
  poland: 'pl',
  portugal: 'pt',
  slovakia: 'sk',
  slovenia: 'sl',
  spain: 'es',
  sweden: 'sv',
  switzerland: 'de',
  russian: 'ru',
  albania: 'sq',
  andorra: 'ca',
  armenia: 'hy',
  azerbaijan: 'az',
  bosnia: 'bs',
  bulgaria: 'bg',
  croatia: 'hr',
  cyprus: 'el',
  georgia: 'ka',
  ireland: 'en',
  kosovo: 'sq',
  moldova: 'ro',
  monaco: 'fr',
  montenegro: 'sr',
  northmacedonia: 'mk',
  romania: 'ro',
  sanmarino: 'it',
  serbia: 'sr',
  turkey: 'tr',
  ukraine: 'uk',
  unitedkingdom: 'en',
  vatican: 'la'
};

// Progress Tracking System
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
      langProgress.lastStudied = new Date().toISOString();
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
    
    if (lastStudy === today) {
      return; // Already studied today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastStudy === yesterday.toDateString()) {
      this.progress.streak++;
    } else if (lastStudy !== today) {
      this.progress.streak = 1;
    }
    
    this.progress.lastStudyDate = today;
    this.saveProgress();
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
      { id: 'hundred_words', name: 'Century Club', desc: 'Learn 100 words', condition: () => this.progress.totalWordsLearned >= 100 },
      { id: 'week_streak', name: 'Consistent Learner', desc: '7-day learning streak', condition: () => this.progress.streak >= 7 },
      { id: 'month_streak', name: 'Dedicated Student', desc: '30-day learning streak', condition: () => this.progress.streak >= 30 },
      { id: 'multilingual', name: 'Polyglot', desc: 'Study 3 different languages', condition: () => Object.keys(this.progress.languages).length >= 3 }
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

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

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

  resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('speakeu_progress');
      this.progress = this.loadProgress();
      location.reload();
    }
  }
}

const progressTracker = new ProgressTracker();

// ✅ পেজ লোড হলে লোকালস্টোরেজ থেকে ভাষা ও থিম লোড
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
  }
});

// ✅ ভাষা সিলেক্ট করলে সেটিংস স্মৃতি থাকে
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) return;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

// ✅ ভাষা JSON লোড করে UI রেন্ডার
function loadLanguage(lang) {
  isShowingHome = false;
  currentLanguage = lang;
  fetch(`languages/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      currentLanguageData = data;
      renderVocabulary(data, langCodeMap[lang]);
      updateCurrentProgress(lang, data.length);
    })
    .catch(error => {
      conversationArea.innerHTML = `<p style="color:red;">Error loading data: ${error}</p>`;
    });
}

// ✅ কথাবার্তা রেন্ডার
function renderVocabulary(list, langKey) {
  conversationArea.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    conversationArea.innerHTML = '<p>No data found for this language.</p>';
    return;
  }

  // Show current progress
  const currentProgressDiv = document.getElementById('current-progress');
  currentProgressDiv.style.display = 'block';

  list.forEach((item, index) => {
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';

    const langProgress = progressTracker.getLanguageProgress(currentLanguage);
    const isLearned = langProgress.learnedWords.includes(index);

    const div = document.createElement('div');
    div.className = `conversation-item ${isLearned ? 'learned' : ''}`;
    div.innerHTML = `
      <div class="conversation-content">
        <div>🗣️ <strong>${localLang}</strong></div>
        <div>📝 <span>${bn}</span></div>
        <div>📘 <em>${bnMeaning}</em></div>
        <div>🔤 <span>${en}</span></div>
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

function toggleWordLearned(wordIndex) {
  const langProgress = progressTracker.getLanguageProgress(currentLanguage);
  const isCurrentlyLearned = langProgress.learnedWords.includes(wordIndex);
  
  if (isCurrentlyLearned) {
    // Remove from learned words
    const index = langProgress.learnedWords.indexOf(wordIndex);
    langProgress.learnedWords.splice(index, 1);
    progressTracker.progress.totalWordsLearned--;
  } else {
    // Mark as learned
    progressTracker.markWordLearned(currentLanguage, wordIndex);
  }
  
  progressTracker.saveProgress();
  updateCurrentProgress(currentLanguage, currentLanguageData.length);
  renderVocabulary(currentLanguageData, langCodeMap[currentLanguage]);
}

function updateCurrentProgress(language, totalWords) {
  const langProgress = progressTracker.getLanguageProgress(language);
  const learnedCount = langProgress.learnedWords.length;
  const progressPercent = totalWords > 0 ? (learnedCount / totalWords) * 100 : 0;

  // Update language progress in tracker
  progressTracker.progress.languages[language] = {
    ...langProgress,
    totalWords: totalWords
  };
  progressTracker.saveProgress();

  // Update UI
  document.getElementById('progress-language').textContent = `${language.charAt(0).toUpperCase() + language.slice(1)} Progress`;
  document.getElementById('progress-text').textContent = `${learnedCount}/${totalWords} words learned`;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;
}

// ✅ থিম টগল ও লোকালস্টোরেজে সংরক্ষণ
modeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Home Page Functions
function showHome() {
  document.getElementById('side-menu').classList.remove('active');
  isShowingHome = true;
  
  // Hide current progress
  const currentProgressDiv = document.getElementById('current-progress');
  currentProgressDiv.style.display = 'none';
  
  // Show home content
  showHomeContent();
}

function showHomeContent() {
  conversationArea.innerHTML = `
    <div class="home-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Speak EU</span>
          </h1>
          <p class="hero-subtitle">ইউরোপের ভাষা শিখুন আত্মবিশ্বাসের সাথে</p>
          <div class="hero-stats">
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
        </div>
        <div class="hero-animation">
          <div class="floating-languages">
            <span class="lang-bubble">🇮🇹 Ciao</span>
            <span class="lang-bubble">🇪🇸 Hola</span>
            <span class="lang-bubble">🇫🇷 Bonjour</span>
            <span class="lang-bubble">🇩🇪 Hallo</span>
            <span class="lang-bubble">🇬🇷 Γεια</span>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>44+ ইউরোপীয় ভাষা</h3>
          <p>সকল প্রধান ইউরোপীয় দেশের ভাষা একটি প্ল্যাটফর্মে</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>প্রোগ্রেস ট্র্যাকিং</h3>
          <p>আপনার শেখার অগ্রগতি পর্যবেক্ষণ করুন ও লক্ষ্য অর্জন করুন</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>ব্যবহারিক বাক্য</h3>
          <p>দৈনন্দিন জীবনে ব্যবহৃত প্রয়োজনীয় বাক্য ও শব্দ</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>অর্জন ব্যাজ</h3>
          <p>শেখার প্রেরণা বৃদ্ধির জন্য বিভিন্ন অর্জন আনলক করুন</p>
        </div>
      </div>

      <!-- Quick Language Selector -->
      <div class="quick-language-section">
        <h2>দ্রুত শুরু করুন</h2>
        <div class="quick-lang-grid">
          <button class="quick-lang-btn" onclick="quickSelectLanguage('italy')">
            <span class="flag">🇮🇹</span>
            <span class="name">Italian</span>
          </button>
          <button class="quick-lang-btn" onclick="quickSelectLanguage('spain')">
            <span class="flag">🇪🇸</span>
            <span class="name">Spanish</span>
          </button>
          <button class="quick-lang-btn" onclick="quickSelectLanguage('france')">
            <span class="flag">🇫🇷</span>
            <span class="name">French</span>
          </button>
          <button class="quick-lang-btn" onclick="quickSelectLanguage('germany')">
            <span class="flag">🇩🇪</span>
            <span class="name">German</span>
          </button>
          <button class="quick-lang-btn" onclick="quickSelectLanguage('greece')">
            <span class="flag">🇬🇷</span>
            <span class="name">Greek</span>
          </button>
          <button class="quick-lang-btn" onclick="quickSelectLanguage('portugal')">
            <span class="flag">🇵🇹</span>
            <span class="name">Portuguese</span>
          </button>
        </div>
      </div>

      <!-- Learning Tips -->
      <div class="tips-section">
        <h2>🎓 শেখার কৌশল</h2>
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-number">1</div>
            <div class="tip-content">
              <h4>নিয়মিত অনুশীলন</h4>
              <p>প্রতিদিন অন্তত ৫-১০টি নতুন শব্দ শিখুন</p>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-number">2</div>
            <div class="tip-content">
              <h4>উচ্চারণ অনুশীলন</h4>
              <p>শব্দগুলো উচ্চ স্বরে বলে অনুশীলন করুন</p>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-number">3</div>
            <div class="tip-content">
              <h4>প্রসঙ্গে ব্যবহার</h4>
              <p>দৈনন্দিন পরিস্থিতিতে শেখা বাক্য ব্যবহার করুন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function quickSelectLanguage(language) {
  isShowingHome = false;
  languageSelect.value = language;
  localStorage.setItem('selectedLanguage', language);
  loadLanguage(language);
}

// Progress Modal Functions
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
});

function showProgressModal() {
  progressModal.style.display = 'block';
  updateProgressStats();
  createProgressCharts();
  displayAchievements();
}

function updateProgressStats() {
  document.getElementById('total-learned').textContent = progressTracker.progress.totalWordsLearned;
  document.getElementById('current-streak').textContent = progressTracker.progress.streak;
  document.getElementById('languages-studied').textContent = Object.keys(progressTracker.progress.languages).length;
}

function createProgressCharts() {
  // Destroy existing charts if they exist
  if (window.languageChart) {
    window.languageChart.destroy();
  }
  if (window.activityChart) {
    window.activityChart.destroy();
  }

  // Language Progress Chart
  const languageCtx = document.getElementById('languageChart').getContext('2d');
  const languages = Object.keys(progressTracker.progress.languages);
  const languageData = languages.map(lang => progressTracker.progress.languages[lang].learnedWords.length);

  window.languageChart = new Chart(languageCtx, {
    type: 'doughnut',
    data: {
      labels: languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)),
      datasets: [{
        data: languageData,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Activity Chart (last 7 days)
  const activityCtx = document.getElementById('activityChart').getContext('2d');
  const last7Days = [];
  const activityData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    // Simple activity simulation - in real app, you'd track daily activity
    activityData.push(Math.floor(Math.random() * 10) + 1);
  }

  window.activityChart = new Chart(activityCtx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Words Learned',
        data: activityData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function displayAchievements() {
  const achievementList = document.getElementById('achievement-list');
  const allAchievements = [
    { id: 'first_word', name: 'First Steps', desc: 'Learn your first word', icon: '🌟' },
    { id: 'ten_words', name: 'Getting Started', desc: 'Learn 10 words', icon: '🎯' },
    { id: 'fifty_words', name: 'Word Collector', desc: 'Learn 50 words', icon: '📚' },
    { id: 'hundred_words', name: 'Century Club', desc: 'Learn 100 words', icon: '🏆' },
    { id: 'week_streak', name: 'Consistent Learner', desc: '7-day learning streak', icon: '🔥' },
    { id: 'month_streak', name: 'Dedicated Student', desc: '30-day learning streak', icon: '💎' },
    { id: 'multilingual', name: 'Polyglot', desc: 'Study 3 different languages', icon: '🌍' }
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

// Menu Functions
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');

if (menuToggle && sideMenu) {
  menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
  });
}

const closeMenu = document.getElementById('close-menu');
if (closeMenu && sideMenu) {
  closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });
}

// Menu Functions
function exportProgress() {
  progressTracker.exportProgress();
  document.getElementById('side-menu').classList.remove('active');
}

function resetProgress() {
  progressTracker.resetProgress();
  document.getElementById('side-menu').classList.remove('active');
}
