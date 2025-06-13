// ====== Speak EU Main Script (Smart Design) ======

// --- State & DOM Cache ---
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const fabFolder = document.getElementById('fab-folder');
const toastContainer = document.getElementById('toast-container');
let currentLanguage = '';
let currentData = [];
let userFolders = JSON.parse(localStorage.getItem('speakeu_folders')) || {};
let showingFolderContent = false;
let currentFolderId = '';
const langCodeMap = { /* ... আগের মতো ... */ };
// (langCodeMap variable আগের মতো থাকবে, জায়গার অভাবে এখানে সংক্ষেপ)

// --- Initial Load ---
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  } else {
    showHomePage();
  }
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
  }
  setupMenuToggle();
  setupModeToggle();
  setupFab();
});

// --- FAB Quick Add Folder ---
function setupFab() {
  if (!fabFolder) return;
  fabFolder.onclick = () => {
    if (!currentLanguage || !currentData.length) {
      showSmartToast('আগে একটি ভাষা এবং বাক্য লোড করুন!', 'error');
      return;
    }
    showSaveToFolderDialog(langCodeMap[currentLanguage], 0);
  };
}

// --- Menu Toggle, Mode Toggle: আগের মতোই ---

// --- Language Selection ---
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) { showHomePage(); return; }
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

// --- Load Language Data ---
function loadLanguage(lang) {
  currentLanguage = lang;
  showLoadingState();
  fetch(`languages/${lang}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) throw new Error('Data format is invalid or empty');
      currentData = data;
      hideHomePage();
      showFolderControls();
      renderVocabulary(data, langCodeMap[lang]);
    })
    .catch(error => {
      showError(`ভাষার ডেটা লোড করতে সমস্যা হয়েছে: ${error.message}`);
    });
}

// --- Loading State, Vocabulary Render, Folder Dialog, Folder Logic ---
// আগের মতোই থাকবে, শুধু animation/fade class/স্মার্ট toast ব্যবহার করুন...

// --- Toast (Smart) ---
function showSmartToast(message, type='success') {
  const toast = document.createElement('div');
  toast.className = type === 'error' ? 'success-toast' : 'success-toast';
  toast.innerHTML = (type === 'error' ? '❌ ' : '✅ ') + message;
  toastContainer.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 2700);
}

// --- (বাকিটা আগের মতো, শুধু success-toast এর পরিবর্তে showSmartToast ব্যবহার করুন) ---

// ====== END ======
