const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const progressToggle = document.getElementById('progress-toggle');
const progressModal = document.getElementById('progress-modal');
const closeModal = document.querySelector('.close-modal');

// Current language data
let currentLanguageData = [];
let currentLanguage = '';

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
function showHome() {
  document.getElementById('side-menu').classList.remove('active');
  // Reset to home view - reload current language if selected
  if (currentLanguage) {
    loadLanguage(currentLanguage);
  }
}

function exportProgress() {
  progressTracker.exportProgress();
  document.getElementById('side-menu').classList.remove('active');
}

function resetProgress() {
  progressTracker.resetProgress();
  document.getElementById('side-menu').classList.remove('active');
}

// 🧹 Clear Software Function
function clearSoftware() {
  if (confirm('Are you sure you want to clear all software data and restart? This will remove all settings and progress.')) {
    // Clear all localStorage data
    localStorage.clear();
    
    // Reset all variables
    currentLanguageData = [];
    currentLanguage = '';
    
    // Reset language selector
    languageSelect.value = '';
    
    // Reset theme to light mode
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
    
    // Hide progress bar
    const currentProgressDiv = document.getElementById('current-progress');
    currentProgressDiv.style.display = 'none';
    
    // Show default content
    conversationArea.innerHTML = `
      <!-- Intro -->
      <p class="mb-6 leading-relaxed">
        <strong class="font-semibold text-blue-600 dark:text-blue-300">Speak EU</strong> একটি আধুনিক ডিজিটাল ভাষা শিক্ষার প্ল্যাটফর্ম, যা ইউরোপের বিভিন্ন দেশে বসবাসরত অভিবাসী, কর্মজীবী এবং পর্যটকদের কথা মাথায় রেখে তৈরি করা হয়েছে। এই প্ল্যাটফর্মটি বিশেষভাবে ডিজাইন করা হয়েছে যারা দ্রুত এবং কার্যকরভাবে স্থানীয় ভাষা শিখতে চান তাদের জন্য।
      </p>

      <!-- 🚀 Quick Start -->
      <section class="mt-10 bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 শুরু করার জন্য করণীয়</h3>
        <ol class="list-decimal pl-6 space-y-1">
          <li>উপরে থেকে একটি ভাষা নির্বাচন করুন।</li>
          <li>আপনার প্রয়োজন অনুযায়ী কথোপকথন বিভাগ বেছে নিন।</li>
          <li>প্রতিদিন ৫টি বাক্য চর্চা করুন।</li>
          <li>আপনার অগ্রগতি ট্র্যাক করতে 📊 বাটনে ক্লিক করুন।</li>
        </ol>
      </section>

      <!-- 🌍 Country Flags -->
      <section class="mt-10 bg-gray-100 dark:bg-gray-700 p-5 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-3">🌍 জনপ্রিয় দেশভিত্তিক ভাষা</h3>
        <div class="flex flex-wrap gap-4 text-sm">
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇮🇹 ইতালি (Italian)</span>
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇪🇸 স্পেন (Spanish)</span>
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇩🇪 জার্মানি (German)</span>
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇫🇷 ফ্রান্স (French)</span>
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇬🇷 গ্রিস (Greek)</span>
          <span class="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">🇵🇹 পর্তুগাল (Portuguese)</span>
        </div>
      </section>

      <!-- 📢 Join Us -->
      <section class="mt-10 bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-3">📢 আমাদের সঙ্গে যুক্ত থাকুন</h3>
        <p class="mb-2">সোশ্যাল মিডিয়ায় আমাদের ফলো করুন:</p>
        <div class="flex gap-4 text-blue-600 dark:text-blue-300">
          <a href="https://facebook.com" target="_blank" class="hover:underline">📘 Facebook</a>
          <a href="https://t.me" target="_blank" class="hover:underline">📢 Telegram</a>
        </div>
      </section>
    `;
    
    // Close menu
    document.getElementById('side-menu').classList.remove('active');
    
    // Recreate progress tracker
    const newProgressTracker = new ProgressTracker();
    
    // Show success message
    alert('Software has been cleared successfully! 🎉');
  }
}
