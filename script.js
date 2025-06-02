const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const progressToggle = document.getElementById('progress-toggle');
const progressModal = document.getElementById('progress-modal');
const closeModal = document.querySelector('.close-modal');

// Current language data
let currentLanguageData = [];
let currentLanguage = '';
let isShowingSpecialPage = false;

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
      return;
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
  isShowingSpecialPage = false;
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
    const index = langProgress.learnedWords.indexOf(wordIndex);
    langProgress.learnedWords.splice(index, 1);
    progressTracker.progress.totalWordsLearned--;
  } else {
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

  progressTracker.progress.languages[language] = {
    ...langProgress,
    totalWords: totalWords
  };
  progressTracker.saveProgress();

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
  const languageCtx = document.getElementById('languageChart').getContext('2d');
  const languages = Object.keys(progressTracker.progress.languages);
  const languageData = languages.map(lang => progressTracker.progress.languages[lang].learnedWords.length);

  new Chart(languageCtx, {
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

  const activityCtx = document.getElementById('activityChart').getContext('2d');
  const last7Days = [];
  const activityData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    activityData.push(Math.random() * 10);
  }

  new Chart(activityCtx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: 'Words Learned',
        data: activityData,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4
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

// Page Content Functions
function showPage(page) {
  document.getElementById('side-menu').classList.remove('active');
  isShowingSpecialPage = true;
  
  // Hide current progress
  const currentProgressDiv = document.getElementById('current-progress');
  currentProgressDiv.style.display = 'none';
  
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

function getAboutContent() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>📖 About Speak EU</h1>
        <p class="page-subtitle">ইউরোপীয় ভাষা শিক্ষার আধুনিক সমাধান</p>
      </div>

      <div class="content-section">
        <h2>🎯 আমাদের মিশন</h2>
        <p>Speak EU হলো একটি বিপ্লবী ভাষা শিক্ষার প্ল্যাটফর্ম যা বিশেষভাবে ইউরোপে বসবাসরত বাংলাভাষী জনগোষ্ঠীর জন্য তৈরি। আমাদের লক্ষ্য হলো ভাষার বাধা দূর করে সকলকে তাদের নতুন দেশে সফলভাবে যোগাযোগ করতে সাহায্য করা।</p>
      </div>

      <div class="content-section">
        <h2>🌟 কেন Speak EU?</h2>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <div>
              <h3>ব্যবহারিক শিক্ষা</h3>
              <p>দৈনন্দিন জীবনে প্রয়োজনীয় বাক্য ও শব্দের উপর ফোকাস</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <div>
              <h3>বাংলা সাপোর্ট</h3>
              <p>প্রতিটি শব্দের বাংলা উচ্চারণ ও অর্থ সহ</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div>
              <h3>প্রোগ্রেস ট্র্যাকিং</h3>
              <p>আপনার শেখার অগ্রগতি পর্যবেক্ষণ ও উৎসাহ প্রদান</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🌍 সাপোর্টেড ভাষাসমূহ</h2>
        <div class="language-grid">
          <div class="lang-item">🇮🇹 ইতালিয়ান</div>
          <div class="lang-item">🇪🇸 স্প্যানিশ</div>
          <div class="lang-item">🇫🇷 ফরাসি</div>
          <div class="lang-item">🇩🇪 জার্মান</div>
          <div class="lang-item">🇬🇷 গ্রিক</div>
          <div class="lang-item">🇵🇹 পর্তুগিজ</div>
          <div class="lang-item">🇳🇱 ডাচ</div>
          <div class="lang-item">🇸🇪 সুইডিশ</div>
        </div>
        <p class="text-center">এবং আরও 36+ ইউরোপীয় ভাষা!</p>
      </div>

      <div class="content-section">
        <h2>👥 আমাদের টিম</h2>
        <p>আমরা একদল প্রযুক্তিবিদ, ভাষাবিদ এবং শিক্ষাবিদ যারা বিশ্বাস করি যে ভাষা শেখা সকলের জন্য সহজ ও আনন্দদায়ক হওয়া উচিত। আমাদের টিমের সদস্যরা নিজেরাও বিভিন্ন দেশে অভিবাসী হিসেবে ভাষার চ্যালেঞ্জ মোকাবেলা করেছেন।</p>
      </div>

      <div class="stats-section">
        <h2>📈 আমাদের অর্জন</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">44+</div>
            <div class="stat-label">সাপোর্টেড ভাষা</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">2000+</div>
            <div class="stat-label">শব্দ ও বাক্য</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">7</div>
            <div class="stat-label">অর্জন ব্যাজ</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getContactContent() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>📞 Contact Us</h1>
        <p class="page-subtitle">আমাদের সাথে যোগাযোগ করুন</p>
      </div>

      <div class="contact-grid">
        <div class="contact-section">
          <h2>💬 সাধারণ যোগাযোগ</h2>
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <div>
              <strong>Email:</strong>
              <p>info@speakeu.com</p>
            </div>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📱</span>
            <div>
              <strong>WhatsApp:</strong>
              <p>+49 123 456 7890</p>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <h2>🛠️ টেকনিক্যাল সাপোর্ট</h2>
          <div class="contact-item">
            <span class="contact-icon">🔧</span>
            <div>
              <strong>Support Email:</strong>
              <p>support@speakeu.com</p>
            </div>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💻</span>
            <div>
              <strong>Bug Report:</strong>
              <p>bugs@speakeu.com</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🌐 সোশ্যাল মিডিয়া</h2>
        <div class="social-links">
          <a href="https://facebook.com/speakeu" target="_blank" class="social-link">
            <span class="social-icon">📘</span>
            <span>Facebook</span>
          </a>
          <a href="https://t.me/speakeu" target="_blank" class="social-link">
            <span class="social-icon">📢</span>
            <span>Telegram</span>
          </a>
          <a href="https://instagram.com/speakeu" target="_blank" class="social-link">
            <span class="social-icon">📷</span>
            <span>Instagram</span>
          </a>
          <a href="https://youtube.com/speakeu" target="_blank" class="social-link">
            <span class="social-icon">📺</span>
            <span>YouTube</span>
          </a>
        </div>
      </div>

      <div class="content-section">
        <h2>📍 আমাদের অফিস</h2>
        <div class="office-info">
          <div class="office-card">
            <h3>🇩🇪 জার্মানি অফিস</h3>
            <p>Hauptstraße 123<br>
            10115 Berlin, Deutschland<br>
            Phone: +49 30 123 456 78</p>
          </div>
          <div class="office-card">
            <h3>🇧🇩 ঢাকা অফিস</h3>
            <p>গুলশান-২, সার্কেল-১<br>
            ঢাকা-১২১২, বাংলাদেশ<br>
            Phone: +880 2 123 456 789</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>❓ সাধারণ প্রশ্ন</h2>
        <div class="faq-section">
          <div class="faq-item">
            <h3>কীভাবে নতুন ভাষা যোগ করা হয়?</h3>
            <p>আমরা নিয়মিত নতুন ভাষা যোগ করি। আপনার পছন্দের ভাষা যোগ করার জন্য আমাদের ইমেইল করুন।</p>
          </div>
          <div class="faq-item">
            <h3>প্রোগ্রেস ডেটা কি নিরাপদ?</h3>
            <p>হ্যাঁ, আপনার সকল ডেটা স্থানীয়ভাবে আপনার ব্রাউজারে সংরক্ষিত থাকে।</p>
          </div>
          <div class="faq-item">
            <h3>অ্যাপটি কি ফ্রি?</h3>
            <p>হ্যাঁ, Speak EU সম্পূর্ণ বিনামূল্যে ব্যবহার করতে পারবেন।</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>📝 ফিডব্যাক</h2>
        <p>আপনার মতামত আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। অ্যাপটি কেমন লাগছে, কোন ফিচার যোগ করতে চান, অথবা কোন সমস্যার সম্মুখীন হচ্ছেন - সব কিছুই আমাদের জানান।</p>
        <div class="feedback-box">
          <p><strong>ফিডব্যাক ইমেইল:</strong> feedback@speakeu.com</p>
          <p><strong>রেটিং:</strong> যদি অ্যাপটি পছন্দ হয়, আমাদের ⭐⭐⭐⭐⭐ রেটিং দিন!</p>
        </div>
      </div>
    </div>
  `;
}

function getPrivacyContent() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>🔒 Privacy Policy</h1>
        <p class="page-subtitle">আপনার গোপনীয়তা আমাদের অগ্রাধিকার</p>
        <p class="last-updated">সর্বশেষ আপডেট: ২৫ ডিসেম্বর, ২০২৪</p>
      </div>

      <div class="content-section">
        <h2>📋 তথ্য সংগ্রহ</h2>
        <div class="privacy-box">
          <h3>আমরা যে তথ্য সংগ্রহ করি:</h3>
          <ul>
            <li><strong>শেখার অগ্রগতি:</strong> আপনি কোন শব্দ শিখেছেন, কতদিন পড়াশোনা করেছেন</li>
            <li><strong>ভাষার পছন্দ:</strong> আপনি কোন ভাষা নির্বাচন করেছেন</li>
            <li><strong>সেটিংস:</strong> থিম (ডার্ক/লাইট মোড) পছন্দ</li>
            <li><strong>অর্জন:</strong> আপনার আনলক করা ব্যাজ ও পুরস্কার</li>
          </ul>
          <div class="notice-box">
            <strong>⚠️ গুরুত্বপূর্ণ:</strong> আমরা আপনার ব্যক্তিগত তথ্য (নাম, ইমেইল, ঠিকানা) সংগ্রহ করি না।
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>💾 তথ্য সংরক্ষণ</h2>
        <div class="storage-info">
          <div class="storage-item">
            <span class="storage-icon">🏠</span>
            <div>
              <h3>স্থানীয় সংরক্ষণ</h3>
              <p>আপনার সকল ডেটা আপনার ব্রাউজারের localStorage এ সংরক্ষিত থাকে। এটি আপনার ডিভাইসেই থাকে, আমাদের সার্ভারে পাঠানো হয় না।</p>
            </div>
          </div>
          <div class="storage-item">
            <span class="storage-icon">🔐</span>
            <div>
              <h3>নিরাপত্তা</h3>
              <p>localStorage ডেটা শুধুমাত্র আপনার ব্রাউজার অ্যাক্সেস করতে পারে। অন্য কোন ওয়েবসাইট বা অ্যাপ এটি দেখতে পারে না।</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🚫 আমরা যা করি না</h2>
        <div class="no-collection">
          <div class="no-item">❌ ব্যক্তিগত তথ্য সংগ্রহ</div>
          <div class="no-item">❌ তৃতীয় পক্ষের সাথে ডেটা শেয়ার</div>
          <div class="no-item">❌ ট্র্যাকিং কুকিজ ব্যবহার</div>
          <div class="no-item">❌ বিজ্ঞাপন দেখানো</div>
          <div class="no-item">❌ ইমেইল বা ফোন নম্বর চাওয়া</div>
          <div class="no-item">❌ পেমেন্ট তথ্য সংগ্রহ</div>
        </div>
      </div>

      <div class="content-section">
        <h2>🍪 কুকিজ নীতি</h2>
        <div class="cookie-info">
          <h3>আমরা যে কুকিজ ব্যবহার করি:</h3>
          <div class="cookie-item">
            <strong>প্রয়োজনীয় কুকিজ:</strong>
            <p>শুধুমাত্র অ্যাপের কার্যকারিতার জন্য (ভাষা সেটিংস, থিম সেটিংস)</p>
          </div>
          <div class="cookie-item">
            <strong>আমরা ব্যবহার করি না:</strong>
            <p>বিশ্লেষণ কুকিজ, বিজ্ঞাপন কুকিজ, ট্র্যাকিং কুকিজ</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🔄 ডেটা নিয়ন্ত্রণ</h2>
        <div class="data-control">
          <div class="control-item">
            <h3>📤 এক্সপোর্ট</h3>
            <p>মেনু থেকে "Export Progress" ব্যবহার করে আপনার সকল ডেটা ডাউনলোড করতে পারেন।</p>
          </div>
          <div class="control-item">
            <h3>🧹 ডিলিট</h3>
            <p>মেনু থেকে "Clear Software" ব্যবহার করে সকল ডেটা মুছে ফেলতে পারেন।</p>
          </div>
          <div class="control-item">
            <h3>📱 স্থানান্তর</h3>
            <p>এক্সপোর্ট করা ফাইল অন্য ডিভাইসে ইমপোর্ট করতে পারেন।</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🔗 তৃতীয় পক্ষের সেবা</h2>
        <div class="third-party">
          <h3>আমরা যে বাহ্যিক সেবা ব্যবহার করি:</h3>
          <div class="service-item">
            <strong>Chart.js:</strong> প্রোগ্রেস চার্ট দেখানোর জন্য (CDN থেকে লোড)
          </div>
          <p><strong>নোট:</strong> এই সেবাগুলো আপনার ব্যক্তিগত ডেটা অ্যাক্সেস করে না।</p>
        </div>
      </div>

      <div class="content-section">
        <h2>👶 শিশুদের গোপনীয়তা</h2>
        <div class="children-privacy">
          <p>আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের জন্য ডিজাইন করা হয়নি। আমরা জেনেশুনে ১৩ বছরের কম বয়সী কোন শিশুর তথ্য সংগ্রহ করি না।</p>
        </div>
      </div>

      <div class="content-section">
        <h2>📞 যোগাযোগ</h2>
        <div class="contact-privacy">
          <p>এই গোপনীয়তা নীতি সম্পর্কে কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:</p>
          <div class="contact-details">
            <p><strong>ইমেইল:</strong> privacy@speakeu.com</p>
            <p><strong>বিষয়:</strong> Privacy Policy Question</p>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h2>🔄 নীতি আপডেট</h2>
        <div class="policy-update">
          <p>আমরা প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি আপডেট করতে পারি। কোন পরিবর্তন হলে এই পৃষ্ঠায় তারিখ আপডেট করা হবে।</p>
          <div class="update-notice">
            <strong>💡 পরামর্শ:</strong> নিয়মিত এই পৃষ্ঠা চেক করুন যেকোন পরিবর্তনের জন্য।
          </div>
        </div>
      </div>
    </div>
  `;
}

function quickSelectLanguage(language) {
  isShowingSpecialPage = false;
  languageSelect.value = language;
  localStorage.setItem('selectedLanguage', language);
  loadLanguage(language);
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

function clearSoftware() {
  if (confirm('আপনি কি নিশ্চিত যে সম্পূর্ণ সফটওয়্যার ক্লিয়ার করতে চান? এটি সকল ডেটা মুছে দেবে এবং পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।')) {
    localStorage.clear();
    location.reload();
  }
  document.getElementById('side-menu').classList.remove('active');
}
