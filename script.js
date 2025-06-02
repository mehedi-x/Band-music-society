// Language Code Mapping
const langCodeMap = {
  austria: 'de', belgium: 'nl', czech: 'cs', denmark: 'da', estonia: 'et',
  finland: 'fi', france: 'fr', germany: 'de', greece: 'el', hungary: 'hu',
  iceland: 'is', italy: 'it', latvia: 'lv', lithuania: 'lt', luxembourg: 'lb',
  malta: 'mt', netherlands: 'nl', norway: 'no', poland: 'pl', portugal: 'pt',
  slovakia: 'sk', slovenia: 'sl', spain: 'es', sweden: 'sv', switzerland: 'de',
  russian: 'ru', albania: 'sq', bulgaria: 'bg', croatia: 'hr', cyprus: 'el',
  ireland: 'en', romania: 'ro', serbia: 'sr', turkey: 'tr', ukraine: 'uk',
  unitedkingdom: 'en'
};

// Global Variables
let currentLanguageData = [];
let currentLanguage = '';
let learnedPhrases = JSON.parse(localStorage.getItem('learnedPhrases')) || {};
let filteredData = [];
let speechSynthesis = window.speechSynthesis;
let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// DOM Elements
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const welcomeMessage = document.getElementById('welcome-message');
const languageContent = document.getElementById('language-content');
const vocabularyContainer = document.getElementById('vocabulary-container');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const progressContainer = document.getElementById('progress-container');
const progressBtn = document.getElementById('progress-btn');
const quizBtn = document.getElementById('quiz-btn');
const quizModal = document.getElementById('quiz-modal');
const closeQuiz = document.getElementById('close-quiz');
const loading = document.getElementById('loading');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  loadSavedSettings();
  setupEventListeners();
  updateProgressDisplay();
});

// Load Saved Settings
function loadSavedSettings() {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  }
  
  // Load saved language
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Language selection
  languageSelect.addEventListener('change', handleLanguageChange);
  
  // Quick language buttons
  document.querySelectorAll('.lang-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      languageSelect.value = lang;
      loadLanguage(lang);
    });
  });
  
  // Theme toggle
  modeToggle.addEventListener('click', toggleTheme);
  
  // Menu toggle
  menuToggle.addEventListener('click', () => sideMenu.classList.add('active'));
  closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
  
  // Search functionality
  searchInput.addEventListener('input', handleSearch);
  
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPhrases(btn.dataset.filter);
    });
  });
  
  // Progress toggle
  progressBtn.addEventListener('click', toggleProgress);
  
  // Quiz functionality
  quizBtn.addEventListener('click', startQuiz);
  closeQuiz.addEventListener('click', () => quizModal.style.display = 'none');
  document.getElementById('next-question').addEventListener('click', nextQuestion);
  document.getElementById('finish-quiz').addEventListener('click', finishQuiz);
  
  // Menu links
  document.getElementById('home-link').addEventListener('click', showHome);
  document.getElementById('progress-link').addEventListener('click', toggleProgress);
  document.getElementById('quiz-link').addEventListener('click', startQuiz);
}

// Handle Language Change
function handleLanguageChange() {
  const lang = languageSelect.value;
  if (!lang) return;
  
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
}

// Load Language Data
async function loadLanguage(lang) {
  showLoading(true);
  
  try {
    const response = await fetch(`languages/${lang}.json`);
    if (!response.ok) throw new Error('Language file not found');
    
    const data = await response.json();
    currentLanguageData = data;
    currentLanguage = lang;
    filteredData = data;
    
    showLanguageContent();
    renderVocabulary();
    updateProgressDisplay();
    
  } catch (error) {
    console.error('Error loading language:', error);
    showError('ভাষার ফাইল লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
  } finally {
    showLoading(false);
  }
}

// Show/Hide Loading
function showLoading(show) {
  loading.style.display = show ? 'block' : 'none';
  welcomeMessage.style.display = show ? 'none' : (!currentLanguage ? 'block' : 'none');
  languageContent.style.display = show ? 'none' : (currentLanguage ? 'block' : 'none');
}

// Show Language Content
function showLanguageContent() {
  welcomeMessage.style.display = 'none';
  languageContent.style.display = 'block';
  progressContainer.style.display = 'block';
}

// Show Home
function showHome() {
  welcomeMessage.style.display = 'block';
  languageContent.style.display = 'none';
  progressContainer.style.display = 'none';
  sideMenu.classList.remove('active');
}

// Render Vocabulary
function renderVocabulary() {
  vocabularyContainer.innerHTML = '';
  
  if (!filteredData.length) {
    vocabularyContainer.innerHTML = '<p class="no-results">কোন ফলাফল পাওয়া যায়নি।</p>';
    return;
  }
  
  filteredData.forEach((item, index) => {
    const langCode = langCodeMap[currentLanguage];
    const nativeText = item[langCode] || '—';
    const phoneticText = item.bn || '—';
    const meaningText = item.bnMeaning || '—';
    const englishText = item.en || '—';
    
    const phraseId = `${currentLanguage}-${index}`;
    const isLearned = learnedPhrases[phraseId] || false;
    
    const div = document.createElement('div');
    div.className = `conversation-item ${isLearned ? 'learned' : ''}`;
    div.innerHTML = `
      <div class="phrase-header">
        <div class="phrase-native">${nativeText}</div>
        <div class="phrase-controls">
          <button class="speak-btn" onclick="speakText('${nativeText}', '${langCode}')" title="উচ্চারণ শুনুন">
            🔊
          </button>
          <button class="learn-btn ${isLearned ? 'learned' : ''}" onclick="toggleLearned('${phraseId}', this)" title="${isLearned ? 'শেখা হয়েছে' : 'শেখা হয়নি'}">
            ${isLearned ? '✅' : '📚'}
          </button>
        </div>
      </div>
      <div class="phrase-content">
        <div>
          <span>🗣️</span>
          <span class="phrase-phonetic">${phoneticText}</span>
        </div>
        <div>
          <span>📝</span>
          <span class="phrase-meaning">${meaningText}</span>
        </div>
        <div>
          <span>🔤</span>
          <span class="phrase-english">${englishText}</span>
        </div>
      </div>
    `;
    
    vocabularyContainer.appendChild(div);
  });
}

// Text to Speech
function speakText(text, langCode) {
  if (!speechSynthesis) {
    alert('আপনার ব্রাউজার স্পিচ সাপোর্ট করে না।');
    return;
  }
  
  speechSynthesis.cancel(); // Stop any ongoing speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getFullLanguageCode(langCode);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  
  speechSynthesis.speak(utterance);
}

// Get Full Language Code for Speech API
function getFullLanguageCode(code) {
  const langMap = {
    'de': 'de-DE', 'nl': 'nl-NL', 'cs': 'cs-CZ', 'da': 'da-DK',
    'et': 'et-EE', 'fi': 'fi-FI', 'fr': 'fr-FR', 'el': 'el-GR',
    'hu': 'hu-HU', 'is': 'is-IS', 'it': 'it-IT', 'lv': 'lv-LV',
    'lt': 'lt-LT', 'mt': 'mt-MT', 'no': 'nb-NO', 'pl': 'pl-PL',
    'pt': 'pt-PT', 'sk': 'sk-SK', 'sl': 'sl-SI', 'es': 'es-ES',
    'sv': 'sv-SE', 'ru': 'ru-RU', 'sq': 'sq-AL', 'bg': 'bg-BG',
    'hr': 'hr-HR', 'en': 'en-US', 'ro': 'ro-RO', 'sr': 'sr-RS',
    'tr': 'tr-TR', 'uk': 'uk-UA'
  };
  return langMap[code] || 'en-US';
}

// Toggle Learned Status
function toggleLearned(phraseId, button) {
  const isLearned = learnedPhrases[phraseId] || false;
  learnedPhrases[phraseId] = !isLearned;
  
  localStorage.setItem('learnedPhrases', JSON.stringify(learnedPhrases));
  
  // Update button
  if (!isLearned) {
    button.classList.add('learned');
    button.textContent = '✅';
    button.title = 'শেখা হয়েছে';
    button.closest('.conversation-item').classList.add('learned');
  } else {
    button.classList.remove('learned');
    button.textContent = '📚';
    button.title = 'শেখা হয়নি';
    button.closest('.conversation-item').classList.remove('learned');
  }
  
  updateProgressDisplay();
}

// Handle Search
function handleSearch() {
  const query = searchInput.value.toLowerCase().trim();
  
  if (!query) {
    filteredData = currentLanguageData;
  } else {
    filteredData = currentLanguageData.filter(item => {
      const langCode = langCodeMap[currentLanguage];
      const nativeText = (item[langCode] || '').toLowerCase();
      const phoneticText = (item.bn || '').toLowerCase();
      const meaningText = (item.bnMeaning || '').toLowerCase();
      const englishText = (item.en || '').toLowerCase();
      
      return nativeText.includes(query) || 
             phoneticText.includes(query) || 
             meaningText.includes(query) || 
             englishText.includes(query);
    });
  }
  
  renderVocabulary();
}

// Filter Phrases
function filterPhrases(filter) {
  const langCode = langCodeMap[currentLanguage];
  
  switch(filter) {
    case 'learned':
      filteredData = currentLanguageData.filter((item, index) => {
        const phraseId = `${currentLanguage}-${index}`;
        return learnedPhrases[phraseId];
      });
      break;
    case 'unlearned':
      filteredData = currentLanguageData.filter((item, index) => {
        const phraseId = `${currentLanguage}-${index}`;
        return !learnedPhrases[phraseId];
      });
      break;
    default:
      filteredData = currentLanguageData;
  }
  
  renderVocabulary();
}

// Update Progress Display
function updateProgressDisplay() {
  if (!currentLanguage || !currentLanguageData.length) return;
  
  const totalPhrases = currentLanguageData.length;
  const learnedCount = Object.keys(learnedPhrases).filter(key => 
    key.startsWith(currentLanguage + '-') && learnedPhrases[key]
  ).length;
  
  const percentage = Math.round((learnedCount / totalPhrases) * 100);
  
  document.getElementById('learned-count').textContent = learnedCount;
  document.getElementById('progress-fill').style.width = `${percentage}%`;
  
  // Update streak (simplified - could be enhanced)
  const today = new Date().toDateString();
  const lastUpdate = localStorage.getItem('lastProgressUpdate');
  if (lastUpdate !== today && learnedCount > 0) {
    const currentStreak = parseInt(localStorage.getItem('streak')) || 0;
    const newStreak = lastUpdate ? currentStreak + 1 : 1;
    localStorage.setItem('streak', newStreak);
    localStorage.setItem('lastProgressUpdate', today);
    document.getElementById('streak-count').textContent = newStreak;
  } else {
    document.getElementById('streak-count').textContent = localStorage.getItem('streak') || 0;
  }
}

// Toggle Progress
function toggleProgress() {
  const isVisible = progressContainer.style.display !== 'none';
  progressContainer.style.display = isVisible ? 'none' : 'block';
  sideMenu.classList.remove('active');
}

// Toggle Theme
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Quiz Functions
function startQuiz() {
  if (!currentLanguageData.length) {
    alert('প্রথমে একটি ভাষা নির্বাচন করুন!');
    return;
  }
  
  // Get learned phrases for quiz
  const learnedIndices = Object.keys(learnedPhrases)
    .filter(key => key.startsWith(currentLanguage + '-') && learnedPhrases[key])
    .map(key => parseInt(key.split('-')[1]));
  
  if (learnedIndices.length < 4) {
    alert('কুইজ শুরু করতে কমপক্ষে ৪টি বাক্য শিখুন!');
    return;
  }
  
  // Create quiz questions
  currentQuiz = [];
  currentQuestionIndex = 0;
  quizScore = 0;
  
  const shuffledIndices = shuffleArray([...learnedIndices]);
  const quizLength = Math.min(10, shuffledIndices.length);
  
  for (let i = 0; i < quizLength; i++) {
    const correctIndex = shuffledIndices[i];
    const correctItem = currentLanguageData[correctIndex];
    const langCode = langCodeMap[currentLanguage];
    
    // Create wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * currentLanguageData.length);
      const randomItem = currentLanguageData[randomIndex];
      if (randomIndex !== correctIndex && !wrongOptions.includes(randomItem.bnMeaning)) {
        wrongOptions.push(randomItem.bnMeaning);
      }
    }
    
    const options = shuffleArray([correctItem.bnMeaning, ...wrongOptions]);
    
    currentQuiz.push({
      question: correctItem[langCode],
      options: options,
      correct: correctItem.bnMeaning
    });
  }
  
  quizModal.style.display = 'block';
  sideMenu.classList.remove('active');
  showQuizQuestion();
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function showQuizQuestion() {
  const question = currentQuiz[currentQuestionIndex];
  document.getElementById('quiz-question').innerHTML = `
    <strong>এই বাক্যের অর্থ কী?</strong><br>
    "${question.question}"
  `;
  
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(option, question.correct));
    optionsContainer.appendChild(button);
  });
  
  document.getElementById('quiz-feedback').innerHTML = '';
  document.getElementById('quiz-score').textContent = `${quizScore}/${currentQuiz.length}`;
  document.getElementById('next-question').style.display = 'none';
  document.getElementById('finish-quiz').style.display = 'none';
}

function checkAnswer(selected, correct) {
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quiz-feedback');
  
  options.forEach(option => {
    option.disabled = true;
    if (option.textContent === correct) {
      option.classList.add('correct');
    } else if (option.textContent === selected && selected !== correct) {
      option.classList.add('incorrect');
    }
  });
  
  if (selected === correct) {
    quizScore++;
    feedback.textContent = '🎉 সঠিক উত্তর!';
    feedback.className = 'correct';
  } else {
    feedback.textContent = `❌ ভুল! সঠিক উত্তর: ${correct}`;
    feedback.className = 'incorrect';
  }
  
  document.getElementById('quiz-score').textContent = `${quizScore}/${currentQuiz.length}`;
  
  if (currentQuestionIndex < currentQuiz.length - 1) {
    document.getElementById('next-question').style.display = 'inline-block';
  } else {
    document.getElementById('finish-quiz').style.display = 'inline-block';
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  showQuizQuestion();
}

function finishQuiz() {
  const percentage = Math.round((quizScore / currentQuiz.length) * 100);
  let message = '';
  
  if (percentage >= 80) {
    message = '🏆 অসাধারণ! আপনি দুর্দান্ত করেছেন!';
  } else if (percentage >= 60) {
    message = '👍 ভালো! আরো অনুশীলন করুন।';
  } else {
    message = '📚 আরো পড়াশোনা করুন।';
  }
  
  alert(`কুইজ শেষ!\nস্কোর: ${quizScore}/${currentQuiz.length} (${percentage}%)\n${message}`);
  quizModal.style.display = 'none';
}

// Show Error
function showError(message) {
  vocabularyContainer.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: #f44336;">
      <h3>⚠️ সমস্যা হয়েছে</h3>
      <p>${message}</p>
    </div>
  `;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === quizModal) {
    quizModal.style.display = 'none';
  }
});
