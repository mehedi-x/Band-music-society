// ========== Speak EU App: script.js ==========

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');
const modeToggle = document.getElementById('mode-toggle');
const folderSection = document.getElementById('folder-section');
const homeSection = document.getElementById('homepage-content');
const aboutSection = document.getElementById('about-section');
const contactSection = document.getElementById('contact-section');
const privacySection = document.getElementById('privacy-section');
const folderList = document.getElementById('folder-list');
const addFolderBtn = document.getElementById('add-folder-btn');
const folderPhrases = document.getElementById('folder-phrases');
const phraseList = document.getElementById('phrase-list');
const currentFolderTitle = document.getElementById('current-folder-title');
const backToFoldersBtn = document.getElementById('back-to-folders');
const exportFoldersBtn = document.getElementById('export-folders-btn');
const importFoldersBtn = document.getElementById('import-folders-btn');
const importFoldersInput = document.getElementById('import-folders-input');
const exportFoldersLink = document.getElementById('export-folders-link');
const importFoldersLink = document.getElementById('import-folders-link');
const resetLink = document.getElementById('reset-link');
const errorDisplay = document.getElementById('error-display');
const errorMessage = document.getElementById('error-message');

// Simple router for page sections
const sections = {
  home: homeSection,
  folders: folderSection,
  about: aboutSection,
  contact: contactSection,
  privacy: privacySection
};
function showSection(section) {
  for (const key in sections) {
    if (sections[key]) sections[key].hidden = true;
  }
  if (sections[section]) sections[section].hidden = false;
  closeMenu();
}

// ===== Side Menu Logic =====
function openMenu() {
  sideMenu.classList.add('open');
  menuOverlay.classList.add('open');
  sideMenu.hidden = false;
  menuOverlay.hidden = false;
}
function closeMenu() {
  sideMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  setTimeout(() => {
    sideMenu.hidden = true;
    menuOverlay.hidden = true;
  }, 250);
}
menuToggle.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Nav links (page switch)
sideMenu.querySelectorAll('a[data-page]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(a.getAttribute('data-page'));
  });
});

// ====== Dark/Light Mode ======
function setDarkMode(on) {
  if (on) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  localStorage.setItem('speak_eu_dark', on ? '1' : '0');
  modeToggle.textContent = on ? '🌙' : '☀️';
}
function toggleDarkMode() {
  setDarkMode(!document.body.classList.contains('dark'));
}
modeToggle.addEventListener('click', toggleDarkMode);
// Auto set dark based on previous or system
(function () {
  const saved = localStorage.getItem('speak_eu_dark');
  setDarkMode(
    saved
      ? saved === '1'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
})();

// ======= Folder Feature (CRUD + Export/Import) =======
let folders = {};
const FOLDER_KEY = 'speak_eu_folders';

// Load folders from storage on start
function loadFolders() {
  try {
    folders = JSON.parse(localStorage.getItem(FOLDER_KEY) || '{}');
    renderFolders();
  } catch {
    folders = {};
    renderFolders();
  }
}
function saveFolders() {
  localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}
function renderFolders() {
  folderList.innerHTML = '';
  const keys = Object.keys(folders);
  if (keys.length === 0) {
    folderList.innerHTML = '<li style="opacity:.7">কোনো ফোল্ডার নেই</li>';
    return;
  }
  keys.forEach(folderName => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${folderName}</span>
      <span class="folder-actions">
        <button title="দেখুন" data-view="${folderName}">👁️</button>
        <button title="রিনেম" data-rename="${folderName}">✏️</button>
        <button title="ডিলিট" data-delete="${folderName}">🗑️</button>
      </span>
    `;
    // View
    li.querySelector('[data-view]').onclick = () => viewFolder(folderName);
    // Rename
    li.querySelector('[data-rename]').onclick = () => renameFolder(folderName);
    // Delete
    li.querySelector('[data-delete]').onclick = () => deleteFolder(folderName);
    folderList.appendChild(li);
  });
}
// Create
addFolderBtn.addEventListener('click', () => {
  const name = prompt('ফোল্ডারের নাম দিন:').trim();
  if (!name) return;
  if (folders[name]) return showError('এই নামে ফোল্ডার আছে!');
  folders[name] = [];
  saveFolders();
  renderFolders();
});
// Rename
function renameFolder(oldName) {
  const newName = prompt('নতুন নাম দিন:', oldName).trim();
  if (!newName || folders[newName]) return;
  folders[newName] = folders[oldName];
  delete folders[oldName];
  saveFolders();
  renderFolders();
}
// Delete
function deleteFolder(name) {
  if (!confirm('ফোল্ডার ডিলিট করবেন?')) return;
  delete folders[name];
  saveFolders();
  renderFolders();
}
// View
function viewFolder(name) {
  folderSection.querySelector('.folder-controls').hidden = true;
  folderPhrases.hidden = false;
  phraseList.innerHTML = '';
  currentFolderTitle.textContent = name;
  (folders[name] || []).forEach(phrase =>
    phraseList.innerHTML += `<li>${phrase}</li>`
  );
  backToFoldersBtn.onclick = () => {
    folderSection.querySelector('.folder-controls').hidden = false;
    folderPhrases.hidden = true;
  };
}

// Export
function doExportFolders() {
  const data = JSON.stringify(folders, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'folders.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 500);
}
exportFoldersBtn && exportFoldersBtn.addEventListener('click', doExportFolders);
exportFoldersLink && exportFoldersLink.addEventListener('click', (e) => { e.preventDefault(); doExportFolders(); });

// Import
function doImportFolders(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data === 'object' && !Array.isArray(data)) {
        folders = data;
        saveFolders();
        renderFolders();
        showSection('folders');
      } else throw new Error();
    } catch {
      showError('ভুল ফাইল! সঠিক JSON দিন।');
    }
  };
  reader.readAsText(file);
}
importFoldersBtn && importFoldersBtn.addEventListener('click', () => importFoldersInput.click());
importFoldersInput && importFoldersInput.addEventListener('change', e => {
  if (e.target.files[0]) doImportFolders(e.target.files[0]);
});
importFoldersLink && importFoldersLink.addEventListener('click', (e) => {
  e.preventDefault();
  importFoldersInput.click();
});

// Reset All Data
function doReset() {
  if (!confirm('সত্যিই কি সব ডেটা মুছতে চান?')) return;
  folders = {};
  saveFolders();
  renderFolders();
  showSection('folders');
}
resetLink && resetLink.addEventListener('click', (e) => { e.preventDefault(); doReset(); });

// Show folders section when needed
document.querySelectorAll('[data-page="folders"]').forEach(btn => {
  btn.addEventListener('click', () => {
    showSection('folders');
    folderSection.querySelector('.folder-controls').hidden = false;
    folderPhrases.hidden = true;
    renderFolders();
  });
});

// ====== Error Handler ======
function showError(msg) {
  errorMessage.textContent = msg;
  errorDisplay.hidden = false;
  setTimeout(() => { errorDisplay.hidden = true; }, 3000);
}

// ====== Initial Load ======
window.addEventListener('DOMContentLoaded', () => {
  loadFolders();
  showSection('home');
});
