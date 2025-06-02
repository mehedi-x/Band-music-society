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

// Progress Tracking System
class ProgressTracker {
  constructor() {
    this.progress = this.loadProgress();
    this.updateStreak();
  }

  loadProgress() {
    const saved = localStorage.getItem('speakeu_progress');
    return saved ? JSON.parse(saved) : {
      languages: {}, streak: 0, lastStudyDate: null, achievements: [], totalWordsLearned: 0
    };
  }

  saveProgress() {
    localStorage.setItem('speakeu_progress', JSON.stringify(this.progress));
  }

  markWordLearned(language, wordIndex) {
    if (!this.progress.languages[language]) {
      this.progress.languages[language] = { learnedWords: [], totalWords: 0, lastStudied: null };
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
    
    if (lastStudy === today) return;
    
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
    return this.progress.languages[language] || { learnedWords: [], totalWords: 0, lastStudied: null };
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

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  exportProgress() {
    const data = { exportDate: new Date().toISOString(), ...this.progress };
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

  progressTracker.progress.languages[language] = { ...langProgress, totalWords: totalWords };
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
progressToggle.addEventListener('click', () => showProgressModal());
closeModal.addEventListener('click', () => progressModal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === progressModal) progressModal.style.display = 'none';
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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
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
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
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
  document.getElementById('current-progress').style.display = 'none';
  
  let content = '';
  
  switch(page) {
    case 'home':
      // Return to default home view
      window.location.reload();
      return;
    case 'about':
      content = `
        <div class="page-content">
          <h1 class="page-title">🌍 About Speak EU</h1>
          <p class="page-subtitle">Your Gateway to European Languages</p>
          
          <div class="info-grid">
            <div class="info-card">
              <h3>🎯 Our Mission</h3>
              <p>Speak EU এর মূল লক্ষ্য হলো ইউরোপে বসবাসকারী বাংলাদেশী এবং অন্যান্য দেশের মানুষদের স্থানীয় ভাষা শিখতে সাহায্য করা। আমরা বিশ্বাস করি ভাষা শেখা একটি সেতুর মতো কাজ করে যা বিভিন্ন সংস্কৃতির মানুষদের মধ্যে সংযোগ স্থাপন করে।</p>
            </div>
            
            <div class="info-card">
              <h3>🚀 Our Vision</h3>
              <p>আমাদের স্বপ্ন হলো একটি এমন প্ল্যাটফর্ম তৈরি করা যেখানে যে কেউ সহজে এবং কার্যকরভাবে ইউরোপীয় ভাষাগুলো শিখতে পারবে। আমরা চাই প্রতিটি শিক্ষার্থী তাদের নিজস্ব গতিতে এবং পছন্দমতো ভাষা শিখতে পারুক।</p>
            </div>
            
            <div class="info-card">
              <h3>💡 Why Choose Us</h3>
              <p>• ৪৪+ ইউরোপীয় ভাষার সাপোর্ট<br>• ব্যবহারিক এবং দৈনন্দিন শব্দভাণ্ডার<br>• প্রোগ্রেস ট্র্যাকিং সিস্টেম<br>• ইন্টারঅ্যাক্টিভ লার্নিং এক্সপেরিয়েন্স<br>• সম্পূর্ণ ফ্রি এবং বিজ্ঞাপনমুক্ত</p>
            </div>
            
            <div class="info-card">
              <h3>🏆 Our Features</h3>
              <p>• রিয়েল-টাইম প্রোগ্রেস ট্র্যাকিং<br>• Achievement এবং Badge সিস্টেম<br>• Dark/Light Mode<br>• মোবাইল ফ্রেন্ডলি ইন্টারফেস<br>• অফলাইন সাপোর্ট<br>• ডেটা এক্সপোর্ট সুবিধা</p>
            </div>
          </div>
        </div>
      `;
      break;
    case 'contact':
      content = `
        <div class="page-content">
          <h1 class="page-title">📞 Contact Us</h1>
          <p class="page-subtitle">আমাদের সাথে যোগাযোগ করুন</p>
          
          <div class="contact-form">
            <form onsubmit="handleContactForm(event)">
              <div class="form-group">
                <label for="name">নাম *</label>
                <input type="text" id="name" name="name" required>
              </div>
              
              <div class="form-group">
                <label for="email">ইমেইল *</label>
                <input type="email" id="email" name="email" required>
              </div>
              
              <div class="form-group">
                <label for="subject">বিষয়</label>
                <input type="text" id="subject" name="subject">
              </div>
              
              <div class="form-group">
                <label for="message">বার্তা *</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              
              <button type="submit" class="submit-btn">📩 বার্তা পাঠান</button>
            </form>
          </div>
          
          <div class="info-grid" style="margin-top: 40px;">
            <div class="info-card">
              <h3>📧 Email</h3>
              <p>info@speakeu.com<br>support@speakeu.com</p>
            </div>
            
            <div class="info-card">
              <h3>📱 Social Media</h3>
              <p>📘 Facebook: /SpeakEU<br>📢 Telegram: @SpeakEUSupport</p>
            </div>
          </div>
        </div>
      `;
      break;
    case 'privacy':
      content = `
        <div class="page-content">
          <h1 class="page-title">🔒 Privacy Policy</h1>
          <p class="page-subtitle">আপনার গোপনীয়তা আমাদের অগ্রাধিকার</p>
          
          <div class="info-card">
            <h3>📊 Data Collection</h3>
            <p>আমরা শুধুমাত্র আপনার শেখার অগ্রগতি এবং পছন্দসমূহ সংরক্ষণ করি। কোনো ব্যক্তিগত তথ্য সংগ্রহ করা হয় না।</p>
          </div>
          
          <div class="info-card">
            <h3>🔐 Data Storage</h3>
            <p>সকল ডেটা আপনার ব্রাউজারের Local Storage এ সংরক্ষিত থাকে। আমাদের সার্ভারে কোনো ব্যক্তিগত তথ্য পাঠানো হয় না।</p>
          </div>
          
          <div class="info-card">
            <h3>🍪 Cookies</h3>
            <p>আমরা শুধুমাত্র আপনার ভাষা পছন্দ এবং থিম সেটিংস মনে রাখার জন্য Local Storage ব্যবহার করি।</p>
          </div>
          
          <div class="info-card">
            <h3>🛡️ Your Rights</h3>
            <p>আপনি যেকোনো সময় "Clear Software" অপশন ব্যবহার করে সকল ডেটা মুছে ফেলতে পারেন।</p>
          </div>
          
          <div class="info-card">
            <h3>📞 Contact</h3>
            <p>গোপনীয়তা সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: privacy@speakeu.com</p>
          </div>
        </div>
      `;
      break;
  }
  
  conversationArea.innerHTML = content;
}

function handleContactForm(event) {
  event.preventDefault();
  alert('ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
  event.target.reset();
}

// Menu Functions
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');

if (menuToggle && sideMenu) {
  menuToggle.addEventListener('click', () => sideMenu.classList.toggle('active'));
}

const closeMenu = document.getElementById('close-menu');
if (closeMenu && sideMenu) {
  closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
}

// Export Progress
function exportProgress() {
  progressTracker.exportProgress();
  document.getElementById('side-menu').classList.remove('active');
}

// Clear Software
function clearSoftware() {
  if (confirm('Are you sure you want to clear all data? This will restart the software completely.')) {
    localStorage.clear();
    window.location.reload();
  }
  document.getElementById('side-menu').classList.remove('active');
}
