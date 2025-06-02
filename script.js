// Language Code Mapping (আগের মতো)
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

// Global Variables
let currentLanguageData = [];
let currentLanguage = '';
let learnedPhrases = JSON.parse(localStorage.getItem('learnedPhrases')) || {};

// DOM Elements
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const introSection = document.getElementById('intro-section');
const languageContent = document.getElementById('language-content');
const languageTitle = document.getElementById('language-title');
const vocabularyList = document.getElementById('vocabulary-list');
const showingCount = document.getElementById('showing-count');

// নতুন এলিমেন্ট
const searchToggle = document.getElementById('search-toggle');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const progressToggle = document.getElementById('progress-toggle');
const progressBar = document.getElementById('progress-bar');
const learnedCount = document.getElementById('learned-count');
const totalCount = document.getElementById('total-count');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  loadSavedSettings();
  setupEventListeners();
  updateProgressDisplay();
});

// Load Saved Settings
function loadSavedSettings() {
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
}

// Setup Event Listeners
function setupEventListeners() {
  // Language selection
  languageSelect.addEventListener('change', () => {
    const lang = languageSelect.value;
    if (!lang) return;
    localStorage.setItem('selectedLanguage', lang);
    loadLanguage(lang);
  });

  // Quick language selection
  document.querySelectorAll('.lang-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      languageSelect.value = lang;
      localStorage.setItem('selectedLanguage', lang);
      loadLanguage(lang);
    });
  });

  // Theme toggle
  modeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    modeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Menu toggle
  menuToggle.addEventListener('click', () => sideMenu.classList.add('active'));
  closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));

  // Search functionality
  searchToggle.addEventListener('click', toggleSearch);
  searchInput.addEventListener('input', handleSearch);
  clearSearch.addEventListener('click', clearSearchInput);

  // Progress functionality
  progressToggle.addEventListener('click', toggleProgress);

  // Menu links
  document.getElementById('home-link').addEventListener('click', showHome);
  document.getElementById('progress-link').addEventListener('click', toggleProgress);
}

// Load Language
function loadLanguage(lang) {
  currentLanguage = lang;
  
  fetch(`${lang}.json`)
    .then(res => res.json())
    .then(data => {
      currentLanguageData = data;
      renderVocabulary(data, langCodeMap[lang]);
      updateProgressDisplay();
      showLanguageContent();
    })
    .catch(error => {
      console.error('Error loading language data:', error);
      vocabularyList.innerHTML = `<p style="color:red;">ভাষার ডেটা লোড করতে সমস্যা হয়েছে: ${error}</p>`;
    });
}

// Show Language Content
function showLanguageContent() {
  introSection.style.display = 'none';
  languageContent.style.display = 'block';
  
  // Set language title
  const selectedOption = languageSelect.options[languageSelect.selectedIndex];
  languageTitle.textContent = selectedOption.text;
}

// Show Home
function showHome() {
  introSection.style.display = 'block';
  languageContent.style.display = 'none';
  searchBar.style.display = 'none';
  progressBar.style.display = 'none';
  sideMenu.classList.remove('active');
}

// Render Vocabulary
function renderVocabulary(list, langKey) {
  vocabularyList.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    vocabularyList.innerHTML = '<p>এই ভাষার জন্য কোন ডেটা পাওয়া যায়নি।</p>';
    return;
  }

  list.forEach((item, index) => {
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';
    
    const phraseId = `${currentLanguage}_${index}`;
    const isLearned = learnedPhrases[phraseId] || false;

    const div = document.createElement('div');
    div.className = `conversation-item ${isLearned ? 'learned' : ''}`;
    div.dataset.phraseId = phraseId;
    
    div.innerHTML = `
      <div class="phrase-controls">
        <button class="speak-btn" onclick="speakText('${localLang}', '${langKey}')" title="উচ্চারণ শুনুন">🔊</button>
        <button class="learn-btn ${isLearned ? 'learned' : ''}" onclick="toggleLearned('${phraseId}', this)" title="শেখা হয়েছে">
          ${isLearned ? '✅' : '📚'}
        </button>
      </div>
      <div>🗣️ <strong>${localLang}</strong></div>
      <div>📝 <span>${bn}</span></div>
      <div>📘 <em>${bnMeaning}</em></div>
      <div>🔤 <span>${en}</span></div>
    `;
    
    vocabularyList.appendChild(div);
  });

  updateShowingCount(list.length);
}

// Speak Text Function
function speakText(text, langCode) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  } else {
    alert('আপনার ব্রাউজার স্পিচ ফিচার সাপোর্ট করে না।');
  }
}

// Toggle Learned Status
function toggleLearned(phraseId, button) {
  const isCurrentlyLearned = learnedPhrases[phraseId] || false;
  learnedPhrases[phraseId] = !isCurrentlyLearned;
  
  // Update localStorage
  localStorage.setItem('learnedPhrases', JSON.stringify(learnedPhrases));
  
  // Update UI
  const conversationItem = button.closest('.conversation-item');
  if (learnedPhrases[phraseId]) {
    conversationItem.classList.add('learned');
    button.classList.add('learned');
    button.innerHTML = '✅';
    button.title = 'শেখা হয়েছে';
  } else {
    conversationItem.classList.remove('learned');
    button.classList.remove('learned');
    button.innerHTML = '📚';
    button.title = 'শেখা হয়েছে';
  }
  
  updateProgressDisplay();
}

// Toggle Search
function toggleSearch() {
  const isVisible = searchBar.style.display !== 'none';
  searchBar.style.display = isVisible ? 'none' : 'block';
  if (!isVisible) {
    searchInput.focus();
  } else {
    clearSearchInput();
  }
}

// Handle Search
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const items = document.querySelectorAll('.conversation-item');
  let visibleCount = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (searchTerm === '' || text.includes(searchTerm)) {
      item.classList.remove('hidden');
      visibleCount++;
    } else {
      item.classList.add('hidden');
    }
  });

  updateShowingCount(visibleCount);
}

// Clear Search
function clearSearchInput() {
  searchInput.value = '';
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('hidden');
  });
  updateShowingCount(currentLanguageData.length);
}

// Toggle Progress
function toggleProgress() {
  const isVisible = progressBar.style.display !== 'none';
  progressBar.style.display = isVisible ? 'none' : 'block';
}

// Update Progress Display
function updateProgressDisplay() {
  if (!currentLanguage || currentLanguageData.length === 0) return;

  const learned = Object.keys(learnedPhrases).filter(key => 
    key.startsWith(currentLanguage) && learnedPhrases[key]
  ).length;
  
  const total = currentLanguageData.length;
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

  learnedCount.textContent = learned;
  totalCount.textContent = total;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
}

// Update Showing Count
function updateShowingCount(count) {
  showingCount.textContent = `দেখানো হচ্ছে: ${count}`;
}

// Menu functionality (existing)
if (menuToggle && sideMenu) {
  menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
  });
}

if (closeMenu && sideMenu) {
  closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });
}
