// Language Code Mapping
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

// Content sections
const homeContent = document.getElementById('home-content');
const aboutContent = document.getElementById('about-content');
const contactContent = document.getElementById('contact-content');
const privacyContent = document.getElementById('privacy-content');
const languageContent = document.getElementById('language-content');

// New elements
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
  if (searchToggle) {
    searchToggle.addEventListener('click', toggleSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  if (clearSearch) {
    clearSearch.addEventListener('click', clearSearchInput);
  }

  // Progress functionality
  if (progressToggle) {
    progressToggle.addEventListener('click', toggleProgress);
  }

  // Menu links
  const homeLink = document.getElementById('home-link');
  const aboutLink = document.getElementById('about-link');
  const contactLink = document.getElementById('contact-link');
  const privacyLink = document.getElementById('privacy-link');

  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
      sideMenu.classList.remove('active');
    });
  }

  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAbout();
      sideMenu.classList.remove('active');
    });
  }

  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      showContact();
      sideMenu.classList.remove('active');
    });
  }

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPrivacy();
      sideMenu.classList.remove('active');
    });
  }
}

// Load Language
function loadLanguage(lang) {
  currentLanguage = lang;
  
  // Show loading or processing message
  languageContent.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>ভাষা লোড হচ্ছে...</p></div>';
  
  fetch(`languages/${lang}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      currentLanguageData = data;
      renderVocabulary(data, langCodeMap[lang]);
      updateProgressDisplay();
      showLanguageContent();
    })
    .catch(error => {
      console.error('Error loading language data:', error);
      languageContent.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: red;">
          <p>ভাষার ডেটা লোড করতে সমস্যা হয়েছে।</p>
          <p>দয়া করে পরে আবার চেষ্টা করুন।</p>
          <p>Error: ${error.message}</p>
        </div>
      `;
    });
}

// Show Different Content Sections
function hideAllContent() {
  homeContent.style.display = 'none';
  aboutContent.style.display = 'none';
  contactContent.style.display = 'none';
  privacyContent.style.display = 'none';
  languageContent.style.display = 'none';
  
  // Hide search and progress bars
  if (searchBar) searchBar.style.display = 'none';
  if (progressBar) progressBar.style.display = 'none';
}

function showHome() {
  hideAllContent();
  homeContent.style.display = 'block';
}

function showAbout() {
  hideAllContent();
  aboutContent.style.display = 'block';
}

function showContact() {
  hideAllContent();
  contactContent.style.display = 'block';
}

function showPrivacy() {
  hideAllContent();
  privacyContent.style.display = 'block';
}

function showLanguageContent() {
  hideAllContent();
  languageContent.style.display = 'block';
}

// Render Vocabulary
function renderVocabulary(list, langKey) {
  if (!Array.isArray(list) || list.length === 0) {
    languageContent.innerHTML = '<p style="text-align: center; padding: 2rem;">এই ভাষার জন্য কোন ডেটা পাওয়া যায়নি।</p>';
    return;
  }

  // Create language header
  const selectedOption = languageSelect.options[languageSelect.selectedIndex];
  const languageTitle = selectedOption ? selectedOption.text : currentLanguage;

  let html = `
    <div class="language-header" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #0059b3;">
      <h2 style="color: #0059b3; margin: 0; font-size: 1.5rem;">${languageTitle}</h2>
      <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        মোট বাক্য: <strong>${list.length}</strong> | 
        শেখা হয়েছে: <strong id="current-learned">0</strong>
      </div>
    </div>
    <div class="vocabulary-list">
  `;

  list.forEach((item, index) => {
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';
    
    const phraseId = `${currentLanguage}_${index}`;
    const isLearned = learnedPhrases[phraseId] || false;

    html += `
      <div class="conversation-item ${isLearned ? 'learned' : ''}" data-phrase-id="${phraseId}">
        <div class="phrase-controls">
          <button class="speak-btn" onclick="speakText('${localLang.replace(/'/g, "\\'")}', '${langKey}')" title="উচ্চারণ শুনুন">🔊</button>
          <button class="learn-btn ${isLearned ? 'learned' : ''}" onclick="toggleLearned('${phraseId}', this)" title="শেখা হয়েছে">
            ${isLearned ? '✅' : '📚'}
          </button>
        </div>
        <div>🗣️ <strong>${localLang}</strong></div>
        <div>📝 <span>${bn}</span></div>
        <div>📘 <em>${bnMeaning}</em></div>
        <div>🔤 <span>${en}</span></div>
      </div>
    `;
  });

  html += '</div>';
  languageContent.innerHTML = html;

  // Update learned count display
  updateCurrentLearnedCount();
}

// Update current learned count in the language view
function updateCurrentLearnedCount() {
  const currentLearnedElement = document.getElementById('current-learned');
  if (currentLearnedElement && currentLanguage) {
    const learned = Object.keys(learnedPhrases).filter(key => 
      key.startsWith(currentLanguage) && learnedPhrases[key]
    ).length;
    currentLearnedElement.textContent = learned;
  }
}

// Speak Text Function
function speakText(text, langCode) {
  if ('speechSynthesis' in window) {
    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Handle speech synthesis errors
    utterance.onerror = function(event) {
      console.error('Speech synthesis error:', event.error);
    };
    
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
    button.title = 'শেখা সম্পন্ন';
  } else {
    conversationItem.classList.remove('learned');
    button.classList.remove('learned');
    button.innerHTML = '📚';
    button.title = 'শেখা হয়েছে';
  }
  
  updateProgressDisplay();
  updateCurrentLearnedCount();
}

// Toggle Search
function toggleSearch() {
  if (!searchBar) return;
  
  const isVisible = searchBar.style.display !== 'none';
  searchBar.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible && searchInput) {
    searchInput.focus();
  } else {
    clearSearchInput();
  }
}

// Handle Search
function handleSearch() {
  if (!searchInput) return;
  
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
}

// Clear Search
function clearSearchInput() {
  if (!searchInput) return;
  
  searchInput.value = '';
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('hidden');
  });
}

// Toggle Progress
function toggleProgress() {
  if (!progressBar) return;
  
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

  if (learnedCount) learnedCount.textContent = learned;
  if (totalCount) totalCount.textContent = total;
  if (progressPercent) progressPercent.textContent = `${percentage}%`;
  if (progressFill) progressFill.style.width = `${percentage}%`;
}

// Menu functionality (for mobile)
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

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (sideMenu && sideMenu.classList.contains('active')) {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      sideMenu.classList.remove('active');
    }
  }
});

// Handle form submission in contact page
document.addEventListener('submit', (e) => {
  if (e.target.closest('#contact-content')) {
    e.preventDefault();
    alert('ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
    e.target.reset();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + F for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f' && languageContent.style.display !== 'none') {
    e.preventDefault();
    toggleSearch();
  }
  
  // Escape to close search or menu
  if (e.key === 'Escape') {
    if (searchBar && searchBar.style.display !== 'none') {
      toggleSearch();
    }
    if (sideMenu && sideMenu.classList.contains('active')) {
      sideMenu.classList.remove('active');
    }
  }
});

// Add loading state management
function showLoading(message = 'লোড হচ্ছে...') {
  if (languageContent) {
    languageContent.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <p>${message}</p>
      </div>
    `;
  }
}

// Error handling for missing elements
function safeElementOperation(elementId, operation) {
  const element = document.getElementById(elementId);
  if (element && typeof operation === 'function') {
    try {
      operation(element);
    } catch (error) {
      console.error(`Error operating on element ${elementId}:`, error);
    }
  }
}

// Initialize speech synthesis voices (if available)
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = function() {
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.length);
  };
}

// Add CSS for hidden items if not already present
if (!document.getElementById('dynamic-styles')) {
  const style = document.createElement('style');
  style.id = 'dynamic-styles';
  style.textContent = `
    .conversation-item.hidden {
      display: none !important;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0059b3;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Performance optimization: Debounce search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounced search
if (searchInput) {
  const debouncedSearch = debounce(handleSearch, 300);
  searchInput.removeEventListener('input', handleSearch);
  searchInput.addEventListener('input', debouncedSearch);
}

// Console log for debugging
console.log('🌍 Speak EU - Language Learning App Loaded Successfully!');
console.log('📚 Available languages:', Object.keys(langCodeMap).length);
console.log('💾 Stored progress:', Object.keys(learnedPhrases).length, 'phrases learned');
