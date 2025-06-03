// ===========================
// 🌍 SPEAK EU - Enhanced JavaScript
// ===========================

// Language code mapping for European countries
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

// ===========================
// 🎯 GLOBAL VARIABLES
// ===========================
let currentLanguage = '';
let currentData = [];
let conversationData = [];
let grammarData = [];
let favorites = JSON.parse(localStorage.getItem('speakeu_favorites')) || {};
let learningProgress = JSON.parse(localStorage.getItem('speakeu_progress')) || {};
let userStats = JSON.parse(localStorage.getItem('speakeu_stats')) || {
  totalWordsLearned: 0,
  totalQuizzesCompleted: 0,
  streakDays: 0,
  achievements: []
};

// Learning state management
let currentLearningMode = 'vocabulary'; // vocabulary, conversation, grammar
let currentStep = 0;
let totalSteps = 0;
let showingFavorites = false;

// Quiz system variables
let quizData = [];
let currentQuizQuestion = 0;
let quizScore = 0;
let selectedQuizAnswer = null;
let isQuizMode = false;

// UI Elements
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');

// ===========================
// 🚀 INITIALIZATION
// ===========================
window.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  setupAutoHideHeader();
});

function initializeApp() {
  // Load saved settings
  const savedLang = localStorage.getItem('selectedLanguage');
  const savedTheme = localStorage.getItem('theme');
  
  // Apply theme
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
  }
  
  // Load language if saved
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  } else {
    showHomePage();
  }
  
  // Initialize progress tracking
  initializeProgress();
}

function setupEventListeners() {
  // Language selection
  languageSelect.addEventListener('change', handleLanguageChange);
  
  // Theme toggle
  modeToggle.addEventListener('click', toggleTheme);
  
  // Menu toggle
  menuToggle.addEventListener('click', toggleSideMenu);
  
  // Close menu
  document.getElementById('close-menu')?.addEventListener('click', closeSideMenu);
  
  // Quiz start button
  document.getElementById('start-quiz-btn')?.addEventListener('click', startQuiz);
  
  // Outside click to close menu
  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSideMenu();
    }
  });
}

function setupAutoHideHeader() {
  let lastScrollTop = 0;
  const header = document.querySelector('.app-header');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.classList.add('hidden');
    } else {
      // Scrolling up
      header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
  });
}

// ===========================
// 🎯 LEARNING MODE MANAGEMENT
// ===========================
function setLearningMode(mode) {
  currentLearningMode = mode;
  currentStep = 0;
  
  // Update active button
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${mode === 'vocabulary' ? 'vocab' : mode}-mode-btn`)?.classList.add('active');
  
  // Load appropriate content
  switch(mode) {
    case 'vocabulary':
      loadVocabularyMode();
      break;
    case 'conversation':
      loadConversationMode();
      break;
    case 'grammar':
      loadGrammarMode();
      break;
  }
  
  updateProgress();
  updateStepNavigation();
}

function loadVocabularyMode() {
  totalSteps = currentData.length;
  showLearningModeSelector();
  renderCurrentStep();
}

async function loadConversationMode() {
  if (conversationData.length === 0) {
    await loadConversationData();
  }
  totalSteps = conversationData.length;
  showLearningModeSelector();
  renderCurrentStep();
}

async function loadGrammarMode() {
  if (grammarData.length === 0) {
    await loadGrammarData();
  }
  totalSteps = grammarData.length;
  showLearningModeSelector();
  renderCurrentStep();
}

async function loadConversationData() {
  try {
    const response = await fetch(`conversations/${currentLanguage}_conversations.json`);
    if (response.ok) {
      conversationData = await response.json();
    } else {
      // Fallback to mock data
      conversationData = generateMockConversations();
    }
  } catch (error) {
    conversationData = generateMockConversations();
  }
}

async function loadGrammarData() {
  try {
    const response = await fetch(`grammar/${currentLanguage}_grammar.json`);
    if (response.ok) {
      grammarData = await response.json();
    } else {
      // Fallback to mock data
      grammarData = generateMockGrammar();
    }
  } catch (error) {
    grammarData = generateMockGrammar();
  }
}

// ===========================
// 🏠 PAGE NAVIGATION
// ===========================
function handleLanguageChange() {
  const lang = languageSelect.value;
  if (!lang) {
    showHomePage();
    return;
  }
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
}

async function loadLanguage(lang) {
  currentLanguage = lang;
  showLoadingState();
  
  try {
    // Load vocabulary data
    const response = await fetch(`languages/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data format is invalid or empty');
    }
    
    currentData = data;
    conversationData = [];
    grammarData = [];
    
    hideHomePage();
    setLearningMode('vocabulary');
    initializeProgress();
    
  } catch (error) {
    showError(`ভাষার ডেটা লোড করতে সমস্যা হয়েছে: ${error.message}`);
  }
}

function showHomePage() {
  hideError();
  hideLearningContent();
  document.getElementById('homepage-content').style.display = 'block';
  currentLanguage = '';
  currentData = [];
}

function hideHomePage() {
  document.getElementById('homepage-content').style.display = 'none';
}

function showLearningModeSelector() {
  hideHomePage();
  hideError();
  document.getElementById('learning-mode-selector').style.display = 'block';
  document.getElementById('learning-content-area').style.display = 'block';
}

function hideLearningContent() {
  document.getElementById('learning-mode-selector').style.display = 'none';
  document.getElementById('learning-content-area').style.display = 'none';
  document.getElementById('quiz-mode').style.display = 'none';
}

// ===========================
// 📊 PROGRESS MANAGEMENT
// ===========================
function initializeProgress() {
  if (!learningProgress[currentLanguage]) {
    learningProgress[currentLanguage] = {
      vocabulary: { completed: [], currentStep: 0 },
      conversation: { completed: [], currentStep: 0 },
      grammar: { completed: [], currentStep: 0 }
    };
  }
  
  // Restore current step for the mode
  currentStep = learningProgress[currentLanguage][currentLearningMode]?.currentStep || 0;
  updateProgress();
}

function updateProgress() {
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPercentage = document.getElementById('progress-percentage');
  
  if (!progressFill || !progressText) return;
  
  const completed = learningProgress[currentLanguage]?.[currentLearningMode]?.completed?.length || 0;
  const percentage = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
  
  progressFill.style.width = percentage + '%';
  progressText.textContent = `${completed}/${totalSteps}`;
  if (progressPercentage) {
    progressPercentage.textContent = `${percentage}%`;
  }
  
  // Save progress
  if (learningProgress[currentLanguage]) {
    learningProgress[currentLanguage][currentLearningMode].currentStep = currentStep;
    localStorage.setItem('speakeu_progress', JSON.stringify(learningProgress));
  }
}

function markStepCompleted() {
  if (!learningProgress[currentLanguage]) return;
  
  const modeProgress = learningProgress[currentLanguage][currentLearningMode];
  if (!modeProgress.completed.includes(currentStep)) {
    modeProgress.completed.push(currentStep);
    userStats.totalWordsLearned++;
    
    // Check for achievements
    checkAchievements();
    
    localStorage.setItem('speakeu_progress', JSON.stringify(learningProgress));
    localStorage.setItem('speakeu_stats', JSON.stringify(userStats));
  }
}

// ===========================
// 🎯 STEP NAVIGATION
// ===========================
function nextStep() {
  if (currentStep < totalSteps - 1) {
    markStepCompleted();
    currentStep++;
    renderCurrentStep();
    updateProgress();
    updateStepNavigation();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderCurrentStep();
    updateProgress();
    updateStepNavigation();
  }
}

function updateStepNavigation() {
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  const stepIndicator = document.getElementById('step-indicator');
  
  if (prevBtn) prevBtn.disabled = currentStep === 0;
  if (nextBtn) nextBtn.disabled = currentStep >= totalSteps - 1;
  if (stepIndicator) stepIndicator.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
}

function renderCurrentStep() {
  const contentArea = document.getElementById('learning-content-area');
  if (!contentArea) return;
  
  let content = '';
  
  switch(currentLearningMode) {
    case 'vocabulary':
      content = renderVocabularyStep();
      break;
    case 'conversation':
      content = renderConversationStep();
      break;
    case 'grammar':
      content = renderGrammarStep();
      break;
  }
  
  contentArea.innerHTML = content;
  attachStepEventListeners();
}

function renderVocabularyStep() {
  if (!currentData[currentStep]) return '<p>No data available</p>';
  
  const item = currentData[currentStep];
  const langKey = langCodeMap[currentLanguage];
  const localLang = item[langKey] || '—';
  const bn = item.bn || '—';
  const bnMeaning = item.bnMeaning || '—';
  const en = item.en || '—';
  
  const isFavorited = (favorites[currentLanguage] || []).includes(currentStep);
  
  return `
    <div class="vocab-card">
      <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
              onclick="toggleFavorite(${currentStep})" 
              title="${isFavorited ? 'ফেভারিট থেকে সরান' : 'ফেভারিট করুন'}">
        ${isFavorited ? '❤️' : '🤍'}
      </button>
      
      <div class="vocab-content">
        <div class="vocab-main">
          <span class="vocab-icon">🗣️</span>
          <strong class="target-word">${localLang}</strong>
        </div>
        
        <div class="vocab-pronunciation">
          <span class="pronunciation-icon">📝</span>
          <span class="pronunciation">${bn}</span>
        </div>
        
        <div class="vocab-meaning">
          <span class="meaning-icon">📘</span>
          <em class="meaning">${bnMeaning}</em>
        </div>
        
        <div class="vocab-english">
          <span class="english-icon">🔤</span>
          <span class="english">${en}</span>
        </div>
      </div>
      
      <div class="step-actions">
        <button class="action-btn secondary" onclick="playPronunciation('${localLang}')">
          🔊 উচ্চারণ শুনুন
        </button>
        <button class="action-btn primary" onclick="markStepCompleted(); nextStep()">
          ✅ শিখেছি
        </button>
      </div>
    </div>
  `;
}

function renderConversationStep() {
  if (!conversationData[currentStep]) return '<p>No conversation data available</p>';
  
  const conversation = conversationData[currentStep];
  
  let conversationHTML = `
    <div class="conversation-scenario">
      <h3 class="scenario-title">${conversation.scenario}</h3>
      <div class="scenario-description">পরিস্থিতি: ${conversation.scenario}</div>
      <div class="scenario-level">লেভেল: ${conversation.level}</div>
    </div>
  `;
  
  conversation.conversation.forEach((exchange, index) => {
    const langKey = langCodeMap[currentLanguage];
    conversationHTML += `
      <div class="conversation-exchange">
        <div class="speaker-label">${exchange.speaker}</div>
        <div class="exchange-content">
          <div class="target-phrase">
            <span class="phrase-icon">🗣️</span>
            <strong>${exchange[langKey]}</strong>
          </div>
          <div class="pronunciation">
            <span class="pronunciation-icon">📝</span>
            <span>${exchange.bn}</span>
          </div>
          <div class="meaning">
            <span class="meaning-icon">📘</span>
            <em>${exchange.bnMeaning}</em>
          </div>
          <div class="english">
            <span class="english-icon">🔤</span>
            <span>${exchange.en}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  conversationHTML += `
    <div class="step-actions">
      <button class="action-btn secondary" onclick="playConversation()">
        🎭 কথোপকথন শুনুন
      </button>
      <button class="action-btn primary" onclick="markStepCompleted(); nextStep()">
        ✅ বুঝেছি
      </button>
    </div>
  `;
  
  return conversationHTML;
}

function renderGrammarStep() {
  if (!grammarData[currentStep]) return '<p>No grammar data available</p>';
  
  const grammar = grammarData[currentStep];
  
  let grammarHTML = `
    <div class="grammar-card">
      <h3 class="grammar-topic">${grammar.topic}</h3>
      <div class="grammar-level">লেভেল: ${grammar.level}</div>
      
      <div class="grammar-pattern">
        <strong>প্যাটার্ন:</strong> ${grammar.pattern}
      </div>
      
      <div class="grammar-explanation">
        <p>${grammar.explanation}</p>
      </div>
      
      <div class="grammar-examples">
        <h4>উদাহরণসমূহ:</h4>
  `;
  
  grammar.examples.forEach(example => {
    grammarHTML += `
      <div class="grammar-example">
        <div class="example-sentence">
          <strong>${example.it}</strong>
        </div>
        <div class="breakdown">
          ${example.breakdown.map(part => `<span class="breakdown-item">${part}</span>`).join(' ')}
        </div>
      </div>
    `;
  });
  
  grammarHTML += `
      </div>
      
      <div class="step-actions">
        <button class="action-btn secondary" onclick="practiceGrammar()">
          ✏️ অনুশীলন করুন
        </button>
        <button class="action-btn primary" onclick="markStepCompleted(); nextStep()">
          ✅ বুঝেছি
        </button>
      </div>
    </div>
  `;
  
  return grammarHTML;
}

function attachStepEventListeners() {
  // Event listeners for dynamic content are handled by onclick attributes
  // This function can be used for more complex event handling if needed
}

// ===========================
// 🎯 QUIZ SYSTEM
// ===========================
function startQuiz() {
  if (currentData.length < 4) {
    alert('কুইজ শুরু করার জন্য কমপক্ষে ৪টি শব্দ প্রয়োজন।');
    return;
  }
  
  isQuizMode = true;
  quizData = generateQuizQuestions();
  currentQuizQuestion = 0;
  quizScore = 0;
  selectedQuizAnswer = null;
  
  hideLearningContent();
  document.getElementById('quiz-mode').style.display = 'block';
  
  renderQuizQuestion();
}

function generateQuizQuestions() {
  const langKey = langCodeMap[currentLanguage];
  const availableData = currentData.filter(item => item[langKey] && item.bnMeaning);
  
  // Shuffle and take 10 questions
  const shuffled = [...availableData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

function renderQuizQuestion() {
  const quizContainer = document.querySelector('.quiz-container');
  if (!quizContainer) return;
  
  const questionData = quizData[currentQuizQuestion];
  const langKey = langCodeMap[currentLanguage];
  
  // Update question number and score
  document.getElementById('quiz-question-number').textContent = 
    `প্রশ্ন ${currentQuizQuestion + 1}/${quizData.length}`;
  document.getElementById('quiz-score').textContent = quizScore;
  
  // Set target word
  document.getElementById('quiz-target-word').textContent = questionData[langKey];
  
  // Generate options
  const correctAnswer = questionData.bnMeaning;
  const wrongAnswers = getRandomWrongAnswers(correctAnswer, 3);
  const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  
  const optionsHTML = allOptions.map((option, index) => `
    <div class="quiz-option" onclick="selectQuizOption(this, '${option}', '${correctAnswer}')">
      ${option}
    </div>
  `).join('');
  
  document.getElementById('quiz-options').innerHTML = optionsHTML;
  
  // Reset feedback and buttons
  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-submit-btn').style.display = 'block';
  document.getElementById('quiz-next-btn').style.display = 'none';
  selectedQuizAnswer = null;
}

function getRandomWrongAnswers(correctAnswer, count) {
  const allMeanings = currentData.map(item => item.bnMeaning).filter(meaning => meaning && meaning !== correctAnswer);
  const shuffled = [...allMeanings].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function selectQuizOption(element, selectedAnswer, correctAnswer) {
  // Remove previous selections
  document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
  
  // Mark current selection
  element.classList.add('selected');
  selectedQuizAnswer = selectedAnswer;
}

function submitQuizAnswer() {
  if (!selectedQuizAnswer) {
    alert('অনুগ্রহ করে একটি উত্তর নির্বাচন করুন।');
    return;
  }
  
  const questionData = quizData[currentQuizQuestion];
  const correctAnswer = questionData.bnMeaning;
  const isCorrect = selectedQuizAnswer === correctAnswer;
  
  // Update score
  if (isCorrect) {
    quizScore++;
  }
  
  // Show feedback
  showQuizFeedback(isCorrect, correctAnswer);
  
  // Update UI
  document.getElementById('quiz-submit-btn').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'block';
  
  // Highlight correct/incorrect answers
  document.querySelectorAll('.quiz-option').forEach(opt => {
    const optText = opt.textContent.trim();
    if (optText === correctAnswer) {
      opt.classList.add('correct');
    } else if (optText === selectedQuizAnswer && !isCorrect) {
      opt.classList.add('incorrect');
    }
    opt.style.pointerEvents = 'none';
  });
}

function showQuizFeedback(isCorrect, correctAnswer) {
  const feedback = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  
  feedback.style.display = 'block';
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  
  if (isCorrect) {
    feedbackIcon.textContent = '✅';
    feedbackText.textContent = 'সঠিক! চমৎকার!';
  } else {
    feedbackIcon.textContent = '❌';
    feedbackText.textContent = `ভুল! সঠিক উত্তর: ${correctAnswer}`;
  }
}

function nextQuizQuestion() {
  currentQuizQuestion++;
  
  if (currentQuizQuestion >= quizData.length) {
    finishQuiz();
  } else {
    renderQuizQuestion();
  }
}

function finishQuiz() {
  const percentage = Math.round((quizScore / quizData.length) * 100);
  
  // Update stats
  userStats.totalQuizzesCompleted++;
  localStorage.setItem('speakeu_stats', JSON.stringify(userStats));
  
  // Show results
  const resultMessage = getQuizResultMessage(percentage);
  
  alert(`🎯 কুইজ সম্পন্ন!\n\nআপনার স্কোর: ${quizScore}/${quizData.length} (${percentage}%)\n\n${resultMessage}`);
  
  // Check for achievements
  checkQuizAchievements(percentage);
  
  // Return to learning mode
  exitQuizMode();
}

function getQuizResultMessage(percentage) {
  if (percentage >= 90) return '🏆 অসাধারণ! আপনি একজন দক্ষ শিক্ষার্থী!';
  if (percentage >= 75) return '⭐ চমৎকার! ভালো করছেন!';
  if (percentage >= 60) return '👍 ভালো! আরো অনুশীলন করুন!';
  if (percentage >= 40) return '📚 আরো পড়াশোনা করুন!';
  return '💪 হাল ছাড়বেন না! আবার চেষ্টা করুন!';
}

function exitQuizMode() {
  isQuizMode = false;
  document.getElementById('quiz-mode').style.display = 'none';
  showLearningModeSelector();
  renderCurrentStep();
}

// ===========================
// 🏆 ACHIEVEMENTS SYSTEM
// ===========================
function checkAchievements() {
  const achievements = [
    { id: 'first_word', condition: () => userStats.totalWordsLearned >= 1, title: 'প্রথম শব্দ', message: 'আপনি আপনার প্রথম শব্দ শিখেছেন!' },
    { id: 'vocabulary_master', condition: () => userStats.totalWordsLearned >= 100, title: 'শব্দভাণ্ডার মাস্টার', message: '১০০টি শব্দ শিখেছেন!' },
    { id: 'quiz_champion', condition: () => userStats.totalQuizzesCompleted >= 10, title: 'কুইজ চ্যাম্পিয়ন', message: '১০টি কুইজ সম্পন্ন করেছেন!' }
  ];
  
  achievements.forEach(achievement => {
    if (!userStats.achievements.includes(achievement.id) && achievement.condition()) {
      userStats.achievements.push(achievement.id);
      showAchievementNotification(achievement.title, achievement.message);
    }
  });
}

function checkQuizAchievements(percentage) {
  if (percentage === 100 && !userStats.achievements.includes('perfect_score')) {
    userStats.achievements.push('perfect_score');
    showAchievementNotification('পারফেক্ট স্কোর', 'আপনি ১০০% স্কোর করেছেন!');
  }
}

function showAchievementNotification(title, message) {
  const notification = document.getElementById('achievement-notification');
  if (!notification) return;
  
  document.getElementById('achievement-message').textContent = message;
  notification.style.display = 'block';
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.style.display = 'none';
    }, 500);
  }, 3000);
}

// ===========================
// ❤️ FAVORITES MANAGEMENT
// ===========================
function toggleFavorite(index) {
  if (!favorites[currentLanguage]) {
    favorites[currentLanguage] = [];
  }
  
  const favIndex = favorites[currentLanguage].indexOf(index);
  if (favIndex > -1) {
    favorites[currentLanguage].splice(favIndex, 1);
  } else {
    favorites[currentLanguage].push(index);
  }
  
  localStorage.setItem('speakeu_favorites', JSON.stringify(favorites));
  
  // Update current step display
  renderCurrentStep();
}

function showAllItems() {
  showingFavorites = false;
  setLearningMode(currentLearningMode);
}

function showFavoriteItems() {
  showingFavorites = true;
  // Filter data to show only favorites
  const langFavorites = favorites[currentLanguage] || [];
  if (langFavorites.length === 0) {
    alert('কোনো ফেভারিট আইটেম নেই। প্রথমে কিছু শব্দ ফেভারিট করুন।');
    return;
  }
  // Implementation for favorites view can be added here
}

function exportFavorites() {
  const exportData = {
    exportDate: new Date().toISOString(),
    appName: 'Speak EU',
    version: '2.0',
    favorites: favorites,
    progress: learningProgress,
    stats: userStats
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('ডেটা সফলভাবে Export করা হয়েছে!');
}

function importFavorites() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.favorites) {
          favorites = {...favorites, ...importData.favorites};
          localStorage.setItem('speakeu_favorites', JSON.stringify(favorites));
        }
        
        if (importData.progress) {
          learningProgress = {...learningProgress, ...importData.progress};
          localStorage.setItem('speakeu_progress', JSON.stringify(learningProgress));
        }
        
        if (importData.stats) {
          userStats = {...userStats, ...importData.stats};
          localStorage.setItem('speakeu_stats', JSON.stringify(userStats));
        }
        
        alert('ডেটা সফলভাবে Import করা হয়েছে!');
        updateProgress();
        
      } catch (error) {
        alert('ফাইল Import করতে সমস্যা হয়েছে। সঠিক JSON ফাইল নির্বাচন করুন।');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// ===========================
// 🎭 THEME & UI MANAGEMENT
// ===========================
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleSideMenu() {
  sideMenu.classList.toggle('active');
}

function closeSideMenu() {
  sideMenu.classList.remove('active');
}

// ===========================
// 🔊 AUDIO & INTERACTION
// ===========================
function playPronunciation(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodeMap[currentLanguage] === 'it' ? 'it-IT' : 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  } else {
    alert('আপনার ব্রাউজার অডিও সাপোর্ট করে না।');
  }
}

function playConversation() {
  alert('কথোপকথন অডিও ফিচার শীঘ্রই আসছে।');
}

function practiceGrammar() {
  alert('ব্যাকরণ অনুশীলন ফিচার শীঘ্রই আসছে।');
}

// ===========================
// 🗂️ UTILITY FUNCTIONS
// ===========================
function showLoadingState() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideLoadingState() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

function showError(message) {
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  
  if (errorDisplay && errorMessage) {
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
  }
  
  hideHomePage();
  hideLearningContent();
  hideLoadingState();
}

function hideError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.style.display = 'none';
  }
}

function resetAllData() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা রিসেট করতে চান? এটি আপনার সব ফেভারিট, প্রগ্রেস এবং সেটিংস মুছে দেবে।')) {
    localStorage.clear();
    favorites = {};
    learningProgress = {};
    userStats = {
      totalWordsLearned: 0,
      totalQuizzesCompleted: 0,
      streakDays: 0,
      achievements: []
    };
    currentData = [];
    currentLanguage = '';
    currentStep = 0;
    totalSteps = 0;
    languageSelect.value = '';
    showHomePage();
    alert('সব ডেটা সফলভাবে রিসেট করা হয়েছে!');
  }
}

function selectLanguage(lang) {
  const langMap = {
    'italian': 'italy',
    'spanish': 'spain',
    'german': 'germany',
    'french': 'france',
    'greek': 'greece',
    'portuguese': 'portugal'
  };
  
  const country = langMap[lang];
  if (country) {
    languageSelect.value = country;
    loadLanguage(country);
  }
}

// ===========================
// 📊 STATS & ANALYTICS
// ===========================
function exportProgress() {
  const progressData = {
    exportDate: new Date().toISOString(),
    appName: 'Speak EU Progress Report',
    language: currentLanguage,
    stats: userStats,
    progress: learningProgress[currentLanguage] || {},
    totalFavorites: Object.values(favorites).reduce((total, arr) => total + arr.length, 0)
  };
  
  const dataStr = JSON.stringify(progressData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-progress-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('প্রগ্রেস রিপোর্ট সফলভাবে Export করা হয়েছে!');
}

function showStatsPage() {
  hideHomePage();
  hideLearningContent();
  hideError();
  
  const totalFavorites = Object.values(favorites).reduce((total, arr) => total + arr.length, 0);
  const totalLanguages = Object.keys(learningProgress).length;
  
  conversationArea.innerHTML = `
    <div class="stats-container">
      <h2>📊 আপনার শেখার পরিসংখ্যান</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-number">${userStats.totalWordsLearned}</div>
          <div class="stat-label">শব্দ শিখেছেন</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-number">${userStats.totalQuizzesCompleted}</div>
          <div class="stat-label">কুইজ সম্পন্ন</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-number">${totalFavorites}</div>
          <div class="stat-label">ফেভারিট শব্দ</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-number">${totalLanguages}</div>
          <div class="stat-label">ভাষা শিখছেন</div>
        </div>
      </div>
      
      <div class="achievements-section">
        <h3>🏆 অর্জনসমূহ</h3>
        <div class="achievements-grid">
          ${userStats.achievements.map(achievement => `
            <div class="achievement-badge">
              <span class="achievement-icon">🏆</span>
              <span class="achievement-name">${getAchievementName(achievement)}</span>
            </div>
          `).join('')}
          ${userStats.achievements.length === 0 ? '<p>এখনো কোনো অর্জন নেই। শেখা শুরু করুন!</p>' : ''}
        </div>
      </div>
      
      <div class="back-action">
        <button class="control-btn" onclick="showHomePage()">🏠 হোমে ফিরুন</button>
      </div>
    </div>
  `;
  
  closeSideMenu();
}

function getAchievementName(achievementId) {
  const names = {
    'first_word': 'প্রথম শব্দ',
    'vocabulary_master': 'শব্দভাণ্ডার মাস্টার',
    'quiz_champion': 'কুইজ চ্যাম্পিয়ন',
    'perfect_score': 'পারফেক্ট স্কোর'
  };
  return names[achievementId] || achievementId;
}

// ===========================
// 📄 ADDITIONAL PAGES
// ===========================
function showAboutPage() {
  hideHomePage();
  hideLearningContent();
  hideError();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📖 আমাদের সম্পর্কে</h2>
      <p><strong>Speak EU</strong> একটি আধুনিক ডিজিটাল ভাষা শিক্ষার প্ল্যাটফর্ম, যা ইউরোপের বিভিন্ন দেশে বসবাসরত অভিবাসী, কর্মজীবী এবং পর্যটকদের কথা মাথায় রেখে তৈরি করা হয়েছে।</p>
      
      <h3>🎯 আমাদের লক্ষ্য</h3>
      <ul>
        <li>ইউরোপের ৪৫+ ভাষায় দৈনন্দিন কথোপকথন শেখানো</li>
        <li>প্রবাসী জীবনে প্রয়োজনীয় ভাষাগত দক্ষতা অর্জনে সহায়তা</li>
        <li>সহজ ও কার্যকর ভাষা শিক্ষার পদ্ধতি প্রদান</li>
        <li>বাংলাদেশী সম্প্রদায়ের ভাষা শিক্ষায় অবদান রাখা</li>
      </ul>
      
      <h3>✨ নতুন বৈশিষ্ট্যসমূহ</h3>
      <ul>
        <li>🎯 তিনটি শিক্ষা মোড: শব্দভাণ্ডার, কথোপকথন, ব্যাকরণ</li>
        <li>📈 ধাপে ধাপে প্রগ্রেস ট্র্যাকিং</li>
        <li>🧠 ইন্টারঅ্যাক্টিভ কুইজ সিস্টেম</li>
        <li>🏆 অর্জন ও পুরস্কার সিস্টেম</li>
        <li>🔊 উচ্চারণ সাহায্য</li>
        <li>📊 বিস্তারিত শেখার পরিসংখ্যান</li>
      </ul>
      
      <div class="back-action">
        <button class="control-btn" onclick="showHomePage()">🏠 হোমে ফিরুন</button>
      </div>
    </div>
  `;
  
  closeSideMenu();
}

function showContactPage() {
  hideHomePage();
  hideLearningContent();
  hideError();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📞 যোগাযোগ করুন</h2>
      <p>আমাদের সাথে যোগাযোগ করতে চান? আমরা আপনার মতামত ও পরামর্শ শুনতে আগ্রহী।</p>
      
      <div class="contact-info">
        <div class="contact-method">
          <h4>📧 ইমেইল</h4>
          <p>support@speakeu.app</p>
        </div>
        
        <div class="contact-method">
          <h4>📱 সোশ্যাল মিডিয়া</h4>
          <p>Facebook: @SpeakEUApp</p>
          <p>Telegram: @SpeakEUSupport</p>
        </div>
        
        <div class="contact-method">
          <h4>🕐 সহায়তার সময়</h4>
          <p>সোমবার - শুক্রবার: ৯:০০ - ১৮:০০</p>
          <p>শনিবার: ১০:০০ - ১৬:০০</p>
        </div>
      </div>
      
      <div class="back-action">
        <button class="control-btn" onclick="showHomePage()">🏠 হোমে ফিরুন</button>
      </div>
    </div>
  `;
  
  closeSideMenu();
}

function showPrivacyPage() {
  hideHomePage();
  hideLearningContent();
  hideError();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>🔒 গোপনীয়তা নীতি</h2>
      
      <h3>তথ্য সংগ্রহ</h3>
      <p>আমরা শুধুমাত্র আপনার শেখার প্রগ্রেস ট্র্যাক করার জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি। সব তথ্য আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত হয়।</p>
      
      <h3>তথ্য ব্যবহার</h3>
      <ul>
        <li>আপনার শেখার অগ্রগতি ট্র্যাক করা</li>
        <li>ফেভারিট শব্দ সংরক্ষণ</li>
        <li>কুইজের ফলাফল প্রদর্শন</li>
        <li>অর্জন ও পুরস্কার প্রদান</li>
      </ul>
      
      <h3>তথ্য নিরাপত্তা</h3>
      <p>আপনার সব ডেটা ব্রাউজারের Local Storage এ সংরক্ষিত হয়। আমরা কোনো ব্যক্তিগত তথ্য সার্ভারে পাঠাই না।</p>
      
      <div class="back-action">
        <button class="control-btn" onclick="showHomePage()">🏠 হোমে ফিরুন</button>
      </div>
    </div>
  `;
  
  closeSideMenu();
}

function showFavoritesPage() {
  hideHomePage();
  hideLearningContent();
  hideError();
  
  const allFavorites = Object.entries(favorites);
  
  let favoritesHTML = `
    <div class="page-content">
      <h2>❤️ আপনার ফেভারিট শব্দসমূহ</h2>
  `;
  
  if (allFavorites.length === 0) {
    favoritesHTML += `
      <p>এখনো কোনো ফেভারিট শব্দ নেই। ভাষা শিখতে শুরু করুন এবং গুরুত্বপূর্ণ শব্দগুলো ফেভারিট করুন।</p>
    `;
  } else {
    allFavorites.forEach(([language, favoriteIndices]) => {
      if (favoriteIndices.length > 0) {
        favoritesHTML += `
          <div class="language-favorites">
            <h3>🌍 ${language.toUpperCase()}</h3>
            <p>${favoriteIndices.length}টি ফেভারিট শব্দ</p>
          </div>
        `;
      }
    });
  }
  
  favoritesHTML += `
      <div class="favorites-actions">
        <button class="control-btn" onclick="exportFavorites()">📤 Export করুন</button>
        <button class="control-btn" onclick="importFavorites()">📥 Import করুন</button>
      </div>
      
      <div class="back-action">
        <button class="control-btn" onclick="showHomePage()">🏠 হোমে ফিরুন</button>
      </div>
    </div>
  `;
  
  conversationArea.innerHTML = favoritesHTML;
  closeSideMenu();
}

// ===========================
// 🎲 MOCK DATA GENERATORS
// ===========================
function generateMockConversations() {
  return [
    {
      scenario: "দোকানে কেনাকাটা",
      level: "beginner",
      conversation: [
        {
          speaker: "Customer",
          it: "Buongiorno! Quanto costa questa maglietta?",
          bn: "বুওনজোর্নো! কুয়ান্তো কোস্তা কুয়েস্তা মাল্যেত্তা?",
          bnMeaning: "সুপ্রভাত! এই টি-শার্টের দাম কত?",
          en: "Good morning! How much does this t-shirt cost?"
        },
        {
          speaker: "Shopkeeper",
          it: "Costa venti euro.",
          bn: "কোস্তা ভেন্তি ইউরো।",
          bnMeaning: "বিশ ইউরো।",
          en: "It costs twenty euros."
        }
      ]
    },
    {
      scenario: "রেস্তোরাঁয় খাবার অর্ডার",
      level: "beginner",
      conversation: [
        {
          speaker: "Customer",
          it: "Vorrei una pizza margherita, per favore.",
          bn: "ভোর্রেই উনা পিৎসা মার্গেরিতা, পের ফাভোরে।",
          bnMeaning: "আমি একটি মার্গেরিতা পিৎসা চাই, দয়া করে।",
          en: "I would like a margherita pizza, please."
        }
      ]
    }
  ];
}

function generateMockGrammar() {
  return [
    {
      topic: "বর্তমান কাল (Present Tense)",
      level: "beginner",
      pattern: "Subject + Verb + Object",
      explanation: "ইতালিয়ানে বর্তমান কালের গঠন সহজ। বেশিরভাগ ক্রিয়াপদ -are, -ere, অথবা -ire দিয়ে শেষ হয়।",
      examples: [
        {
          it: "Io mangio la pizza",
          breakdown: ["Io (আমি)", "mangio (খাই)", "la pizza (পিৎসা)"]
        },
        {
          it: "Tu parli italiano",
          breakdown: ["Tu (তুমি)", "parli (কথা বলো)", "italiano (ইতালিয়ান)"]
        }
      ]
    },
    {
      topic: "নামবাচক শব্দের লিঙ্গ (Noun Gender)",
      level: "beginner",
      pattern: "Masculine: il/lo/l' | Feminine: la/l'",
      explanation: "ইতালিয়ানে প্রতিটি নামবাচক শব্দের লিঙ্গ আছে - পুংলিঙ্গ বা স্ত্রীলিঙ্গ।",
      examples: [
        {
          it: "il ragazzo (ছেলে)",
          breakdown: ["il (পুংলিঙ্গ আর্টিকেল)", "ragazzo (ছেলে)"]
        },
        {
          it: "la ragazza (মেয়ে)",
          breakdown: ["la (স্ত্রীলিঙ্গ আর্টিকেল)", "ragazza (মেয়ে)"]
        }
      ]
    }
  ];
}

// ===========================
// 🎉 FINAL INITIALIZATION
// ===========================

// Make functions globally available
window.setLearningMode = setLearningMode;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.toggleFavorite = toggleFavorite;
window.startQuiz = startQuiz;
window.selectQuizOption = selectQuizOption;
window.submitQuizAnswer = submitQuizAnswer;
window.nextQuizQuestion = nextQuizQuestion;
window.playPronunciation = playPronunciation;
window.playConversation = playConversation;
window.practiceGrammar = practiceGrammar;
window.markStepCompleted = markStepCompleted;

// Page navigation functions
window.showHomePage = showHomePage;
window.showAboutPage = showAboutPage;
window.showContactPage = showContactPage;
window.showPrivacyPage = showPrivacyPage;
window.showFavoritesPage = showFavoritesPage;
window.showStatsPage = showStatsPage;

// Utility functions
window.selectLanguage = selectLanguage;
window.exportFavorites = exportFavorites;
window.importFavorites = importFavorites;
window.exportProgress = exportProgress;
window.resetAllData = resetAllData;

console.log('🌍 Speak EU Enhanced - Loaded Successfully! 🚀');
