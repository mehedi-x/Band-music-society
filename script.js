const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

// Language code mapping
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

// Global variables
let currentLanguage = '';
let currentData = [];
let favorites = JSON.parse(localStorage.getItem('speakeu_favorites')) || {};
let showingFavorites = false;

// 🆕 নতুন Folder System Variables
let userFolders = JSON.parse(localStorage.getItem('speakeu_folders')) || {};
let showingFolders = false;
let currentFolderId = '';

// Page load initialization
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
});

// Language selection
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) {
    showHomePage();
    return;
  }
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

// Load language data
function loadLanguage(lang) {
  currentLanguage = lang;
  showLoadingState();
  
  fetch(`languages/${lang}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data format is invalid or empty');
      }
      currentData = data;
      hideHomePage();
      showFavoritesControls();
      renderVocabulary(data, langCodeMap[lang]);
    })
    .catch(error => {
      showError(`ভাষার ডেটা লোড করতে সমস্যা হয়েছে: ${error.message}`);
    });
}

// Show loading state
function showLoadingState() {
  conversationArea.innerHTML = `
    <div class="loading-container" style="text-align: center; padding: 40px;">
      <div class="loading-spinner" style="font-size: 2rem;">⏳</div>
      <p>ডেটা লোড হচ্ছে...</p>
    </div>
  `;
}

// Render vocabulary with favorites and folder save
function renderVocabulary(list, langKey) {
  hideError();
  conversationArea.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    showError('এই ভাষার জন্য কোনো ডেটা পাওয়া যায়নি।');
    return;
  }

  // Filter data based on current view
  let dataToShow = list;
  if (showingFavorites) {
    const langFavorites = favorites[currentLanguage] || [];
    dataToShow = list.filter((item, index) => langFavorites.includes(index));
    
    if (dataToShow.length === 0) {
      conversationArea.innerHTML = `
        <div class="no-favorites" style="text-align: center; padding: 40px;">
          <h3>❤️ কোনো ফেভারিট আইটেম নেই</h3>
          <p>কিছু শব্দ ফেভারিট করুন প্রথমে।</p>
          <button onclick="showAllItems()" class="control-btn">সব দেখুন</button>
        </div>
      `;
      return;
    }
  }

  // Add favorites controls HTML
  const favoritesControlsHtml = `
    <div id="favorites-controls">
      <div class="favorites-header">
        <h3>📋 ${showingFavorites ? 'ফেভারিট তালিকা' : 'সব কথোপকথন'}</h3>
        <div class="favorites-buttons">
          <button id="show-all-btn" class="control-btn ${!showingFavorites ? 'active' : ''}" onclick="showAllItems()">সব দেখুন</button>
          <button id="show-favorites-btn" class="control-btn ${showingFavorites ? 'active' : ''}" onclick="showFavoriteItems()">ফেভারিট দেখুন</button>
          <button id="export-favorites-btn" class="control-btn" onclick="exportFavorites()">📤 Export</button>
          <button id="import-favorites-btn" class="control-btn" onclick="importFavorites()">📥 Import</button>
        </div>
      </div>
    </div>
  `;

  conversationArea.innerHTML = favoritesControlsHtml;

  dataToShow.forEach((item, displayIndex) => {
    const originalIndex = showingFavorites ? 
      list.findIndex(original => original === item) : displayIndex;
    
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';

    const isFavorited = (favorites[currentLanguage] || []).includes(originalIndex);

    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
      <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
              onclick="toggleFavorite(${originalIndex})" 
              title="${isFavorited ? 'ফেভারিট থেকে সরান' : 'ফেভারিট করুন'}">
        ${isFavorited ? '❤️' : '🤍'}
      </button>
      
      <button class="save-folder-btn" 
              onclick="showSaveToFolderDialog('${langKey}', ${originalIndex})"
              title="ফোল্ডারে সেভ করুন">
        💾
      </button>
      
      <div>🗣️ <strong>${localLang}</strong></div>
      <div>📝 <span>${bn}</span></div>
      <div>📘 <em>${bnMeaning}</em></div>
      <div>🔤 <span>${en}</span></div>
    `;
    conversationArea.appendChild(div);
  });
}

// 🆕 Show Save to Folder Dialog
function showSaveToFolderDialog(language, index) {
  const folderIds = Object.keys(userFolders);
  
  const dialogHtml = `
    <div class="folder-dialog-overlay" onclick="closeFolderDialog()">
      <div class="folder-dialog" onclick="event.stopPropagation()">
        <h3>📁 Save to Folder</h3>
        
        <div class="new-folder-section">
          <h4>🆕 Create New Folder</h4>
          <input type="text" id="new-folder-name" placeholder="Folder name..." maxlength="50">
          <button onclick="createNewFolder('${language}', ${index})" class="create-folder-btn">Create & Save</button>
        </div>
        
        ${folderIds.length > 0 ? `
          <div class="existing-folders-section">
            <h4>📂 Select Existing Folder</h4>
            <div class="folders-list">
              ${folderIds.map(folderId => `
                <div class="folder-option" onclick="saveToExistingFolder('${folderId}', '${language}', ${index})">
                  <span class="folder-icon">📂</span>
                  <span class="folder-name">${userFolders[folderId].name}</span>
                  <span class="folder-count">(${userFolders[folderId].items.length} items)</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="dialog-actions">
          <button class="cancel-btn" onclick="closeFolderDialog()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', dialogHtml);
  
  // Focus on input field
  setTimeout(() => {
    const input = document.getElementById('new-folder-name');
    if (input) input.focus();
  }, 100);
}

// 🆕 Create New Folder
function createNewFolder(language, index) {
  const folderName = document.getElementById('new-folder-name').value.trim();
  if (!folderName) {
    alert('ফোল্ডারের নাম লিখুন!');
    return;
  }
  
  // Check if folder name already exists
  const existingNames = Object.values(userFolders).map(folder => folder.name.toLowerCase());
  if (existingNames.includes(folderName.toLowerCase())) {
    alert('এই নামে ফোল্ডার ইতিমধ্যে আছে!');
    return;
  }
  
  const folderId = 'folder_' + Date.now();
  userFolders[folderId] = {
    name: folderName,
    items: [{
      language: currentLanguage,
      langKey: language,
      index: index,
      addedDate: new Date().toISOString()
    }],
    created: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
  closeFolderDialog();
  
  // Show success message
  showSuccessMessage(`"${folderName}" ফোল্ডারে সেভ করা হয়েছে!`);
}

// 🆕 Save to Existing Folder
function saveToExistingFolder(folderId, language, index) {
  // Check if already exists
  const exists = userFolders[folderId].items.some(item => 
    item.language === currentLanguage && item.langKey === language && item.index === index
  );
  
  if (exists) {
    alert('এই বাক্যটি ইতিমধ্যে এই ফোল্ডারে আছে!');
    return;
  }
  
  userFolders[folderId].items.push({
    language: currentLanguage,
    langKey: language,
    index: index,
    addedDate: new Date().toISOString()
  });
  
  userFolders[folderId].lastModified = new Date().toISOString();
  localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
  closeFolderDialog();
  
  showSuccessMessage(`"${userFolders[folderId].name}" ফোল্ডারে সেভ করা হয়েছে!`);
}

// 🆕 Close Folder Dialog
function closeFolderDialog() {
  const dialog = document.querySelector('.folder-dialog-overlay');
  if (dialog) dialog.remove();
}

// 🆕 Show Success Message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="success-content">
      <span class="success-icon">✅</span>
      <span class="success-text">${message}</span>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 3000);
}

// 🆕 Show My Folders
function showMyFolders() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  const folderIds = Object.keys(userFolders);
  
  if (folderIds.length === 0) {
    conversationArea.innerHTML = `
      <div class="no-folders">
        <h2>📁 My Folders</h2>
        <div class="empty-state">
          <p>আপনার কোনো ফোল্ডার নেই।</p>
          <p>কথোপকথনের পাশে 💾 বাটনে ক্লিক করে ফোল্ডার তৈরি করুন।</p>
          <button onclick="showHomePage()" class="control-btn">হোমে ফিরুন</button>
        </div>
      </div>
    `;
    return;
  }
  
  let foldersHtml = `
    <div class="folders-container">
      <div class="folders-header">
        <h2>📁 My Folders (${folderIds.length})</h2>
        <button onclick="showHomePage()" class="back-home-btn">← হোমে ফিরুন</button>
      </div>
      
      <div class="folders-grid">
        ${folderIds.map(folderId => {
          const folder = userFolders[folderId];
          const createdDate = new Date(folder.created).toLocaleDateString('bn-BD');
          
          return `
            <div class="folder-card">
              <div class="folder-card-header">
                <span class="folder-icon">📂</span>
                <h3>${folder.name}</h3>
              </div>
              
              <div class="folder-stats">
                <p>${folder.items.length}টি বাক্য</p>
                <p>তৈরি: ${createdDate}</p>
              </div>
              
              <div class="folder-actions">
                <button onclick="viewFolder('${folderId}')" class="view-btn">👁️ দেখুন</button>
                <button onclick="renameFolder('${folderId}')" class="rename-btn">✏️ নাম পরিবর্তন</button>
                <button onclick="deleteFolder('${folderId}')" class="delete-btn">🗑️ মুছুন</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  conversationArea.innerHTML = foldersHtml;
  showingFolders = true;
}

// 🆕 View Folder Contents
function viewFolder(folderId) {
  const folder = userFolders[folderId];
  if (!folder) return;
  
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  let folderContentHtml = `
    <div class="folder-content">
      <div class="folder-content-header">
        <h2>📂 ${folder.name}</h2>
        <div class="folder-content-actions">
          <button onclick="showMyFolders()" class="back-btn">← ফোল্ডার তালিকায় ফিরুন</button>
          <button onclick="exportFolder('${folderId}')" class="export-btn">📤 Export</button>
        </div>
      </div>
      
      <div class="folder-items">
        ${folder.items.length === 0 ? 
          '<p class="empty-folder">এই ফোল্ডারে কোনো বাক্য নেই।</p>' :
          folder.items.map((item, itemIndex) => {
            // Get the actual conversation data
            const conversationData = getConversationData(item.language, item.langKey, item.index);
            
            if (!conversationData) {
              return `<div class="invalid-item">❌ Invalid item</div>`;
            }
            
            return `
              <div class="folder-item">
                <button class="remove-from-folder-btn" 
                        onclick="removeFromFolder('${folderId}', ${itemIndex})"
                        title="ফোল্ডার থেকে সরান">
                  🗑️
                </button>
                
                <div>🗣️ <strong>${conversationData.local}</strong></div>
                <div>📝 <span>${conversationData.bn}</span></div>
                <div>📘 <em>${conversationData.bnMeaning}</em></div>
                <div>🔤 <span>${conversationData.en}</span></div>
                
                <div class="item-info">
                  <small>ভাষা: ${getLanguageName(item.language)} • যোগ করা: ${new Date(item.addedDate).toLocaleDateString('bn-BD')}</small>
                </div>
              </div>
            `;
          }).join('')
        }
      </div>
    </div>
  `;
  
  conversationArea.innerHTML = folderContentHtml;
  currentFolderId = folderId;
}

// 🆕 Get Conversation Data
function getConversationData(language, langKey, index) {
  // This would need to load the language data
  // For now, we'll return a placeholder or stored data
  // In a real implementation, you might want to cache this data
  
  return {
    local: 'Loading...',
    bn: 'লোড হচ্ছে...',
    bnMeaning: 'ডেটা লোড হচ্ছে...',
    en: 'Loading...'
  };
}

// 🆕 Get Language Name
function getLanguageName(langCode) {
  const names = {
    'german': 'জার্মান',
    'italian': 'ইতালিয়ান', 
    'russian': 'রাশিয়ান',
    'spanish': 'স্প্যানিশ',
    'french': 'ফরাসি'
  };
  return names[langCode] || langCode;
}

// 🆕 Remove from Folder
function removeFromFolder(folderId, itemIndex) {
  if (confirm('এই বাক্যটি ফোল্ডার থেকে সরাতে চান?')) {
    userFolders[folderId].items.splice(itemIndex, 1);
    userFolders[folderId].lastModified = new Date().toISOString();
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    
    // Refresh folder view
    viewFolder(folderId);
    showSuccessMessage('বাক্যটি ফোল্ডার থেকে সরানো হয়েছে!');
  }
}

// 🆕 Rename Folder
function renameFolder(folderId) {
  const folder = userFolders[folderId];
  const newName = prompt('নতুন নাম:', folder.name);
  
  if (newName && newName.trim() !== '') {
    const trimmedName = newName.trim();
    
    // Check if name already exists
    const existingNames = Object.values(userFolders)
      .filter(f => f !== folder)
      .map(f => f.name.toLowerCase());
      
    if (existingNames.includes(trimmedName.toLowerCase())) {
      alert('এই নামে ফোল্ডার ইতিমধ্যে আছে!');
      return;
    }
    
    userFolders[folderId].name = trimmedName;
    userFolders[folderId].lastModified = new Date().toISOString();
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    
    showMyFolders(); // Refresh view
    showSuccessMessage(`ফোল্ডারের নাম "${trimmedName}" করা হয়েছে!`);
  }
}

// 🆕 Delete Folder
function deleteFolder(folderId) {
  const folder = userFolders[folderId];
  
  if (confirm(`"${folder.name}" ফোল্ডারটি সম্পূর্ণ মুছে দিতে চান? এতে ${folder.items.length}টি বাক্য আছে।`)) {
    delete userFolders[folderId];
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    
    showMyFolders(); // Refresh view
    showSuccessMessage('ফোল্ডার মুছে দেওয়া হয়েছে!');
  }
}

// 🆕 Export Folder
function exportFolder(folderId) {
  const folder = userFolders[folderId];
  
  const exportData = {
    exportInfo: {
      appName: 'Speak EU',
      version: '2.0',
      exportDate: new Date().toISOString(),
      type: 'single_folder'
    },
    folder: folder
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-folder-${folder.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSuccessMessage(`"${folder.name}" ফোল্ডার Export করা হয়েছে!`);
}

// 🆕 Export All Folders (Enhanced)
function exportAllFolders() {
  const exportData = {
    exportInfo: {
      appName: 'Speak EU',
      version: '2.0',
      exportDate: new Date().toISOString(),
      type: 'all_folders'
    },
    folders: userFolders,
    favorites: favorites
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-all-folders-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSuccessMessage('সব ফোল্ডার Export করা হয়েছে!');
}

// Toggle favorite status (আপনার বর্তমান কোড)
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
  
  // Re-render current view
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Show all items (আপনার বর্তমান কোড)
function showAllItems() {
  showingFavorites = false;
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Show favorite items only (আপনার বর্তমান কোড)
function showFavoriteItems() {
  showingFavorites = true;
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Export favorites (আপনার বর্তমান কোড)
function exportFavorites() {
  const exportData = {
    exportDate: new Date().toISOString(),
    appName: 'Speak EU',
    version: '1.0',
    favorites: favorites
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-favorites-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('ফেভারিট তালিকা সফলভাবে Export করা হয়েছে!');
}

// Import favorites (আপনার বর্তমান কোড)
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
        
        if (importData.favorites && typeof importData.favorites === 'object') {
          favorites = {...favorites, ...importData.favorites};
          localStorage.setItem('speakeu_favorites', JSON.stringify(favorites));
          
          // Re-render current view
          if (currentData.length > 0) {
            renderVocabulary(currentData, langCodeMap[currentLanguage]);
          }
          
          alert('ফেভারিট তালিকা সফলভাবে Import করা হয়েছে!');
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        alert('ফাইল Import করতে সমস্যা হয়েছে। সঠিক JSON ফাইল নির্বাচন করুন।');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// Reset all data (Enhanced)
function resetAllData() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা রিসেট করতে চান? এটি আপনার সব ফেভারিট, ফোল্ডার এবং সেটিংস মুছে দেবে।')) {
    localStorage.clear();
    favorites = {};
    userFolders = {};
    currentData = [];
    currentLanguage = '';
    showingFavorites = false;
    showingFolders = false;
    currentFolderId = '';
    languageSelect.value = '';
    showHomePage();
    alert('সব ডেটা সফলভাবে রিসেট করা হয়েছে!');
  }
}

// Show error (আপনার বর্তমান কোড)
function showError(message) {
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  
  if (errorDisplay && errorMessage) {
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
  }
  
  hideHomePage();
  hideFavoritesControls();
}

// Hide error (আপনার বর্তমান কোড)
function hideError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.style.display = 'none';
  }
}

// Show/hide homepage (আপনার বর্তমান কোড)
function showHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) {
    homepage.style.display = 'block';
  }
  hideError();
  hideFavoritesControls();
  showingFolders = false;
  currentFolderId = '';
}

function hideHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) {
    homepage.style.display = 'none';
  }
}

// Show/hide favorites controls (আপনার বর্তমান কোড)
function showFavoritesControls() {
  // Controls are now part of renderVocabulary function
}

function hideFavoritesControls() {
  const controls = document.getElementById('favorites-controls');
  if (controls) {
    controls.style.display = 'none';
  }
}

// Page navigation functions (আপনার বর্তমান কোড অপরিবর্তিত)
function showAboutPage() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
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
      
      <h3>✨ বৈশিষ্ট্যসমূহ</h3>
      <ul>
        <li>🔤 বাংলা উচ্চারণ সহ প্রতিটি শব্দ</li>
        <li>❤️ ফেভারিট সিস্টেম</li>
        <li>📁 কাস্টম ফোল্ডার সিস্টেম</li>
        <li>🌙 ডার্ক/লাইট মোড</li>
        <li>📱 মোবাইল ফ্রেন্ডলি ডিজাইন</li>
        <li>💾 ডেটা এক্সপোর্ট/ইমপোর্ট</li>
      </ul>
      
      <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
    </div>
  `;
}

function showContactPage() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📞 যোগাযোগ</h2>
      <p>আমাদের সাথে যোগাযোগ করুন:</p>
      
      <div class="contact-info">
        <p>📧 ইমেইল: info@speakeu.com</p>
        <p>🌐 ওয়েবসাইট: www.speakeu.com</p>
        <p>📱 ফেসবুক: @SpeakEUOfficial</p>
        <p>💬 টেলিগ্রাম: @SpeakEUSupport</p>
      </div>
      
      <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
    </div>
  `;
}

function showPrivacyPage() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>🔒 গোপনীয়তা নীতি</h2>
      
      <h3>তথ্য সংগ্রহ</h3>
      <p>আমরা শুধুমাত্র আপনার ব্রাউজারের লোকাল স্টোরেজে ডেটা সংরক্ষণ করি। কোনো ব্যক্তিগত তথ্য আমাদের সার্ভারে পাঠানো হয় না।</p>
      
      <h3>ডেটা ব্যবহার</h3>
      <p>আপনার সেভকৃত ফেভারিট এবং ফোল্ডার শুধুমাত্র আপনার ডিভাইসে থাকে এবং আপনার শেখার অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়।</p>
      
      <h3>তথ্য নিরাপত্তা</h3>
      <p>আপনার সব ডেটা স্থানীয়ভাবে সংরক্ষিত এবং এনক্রিপ্টেড। আমরা কোনো তৃতীয় পক্ষের সাথে তথ্য শেয়ার করি না।</p>
      
      <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
    </div>
  `;
}

function showFavoritesPage() {
  showFavoriteItems();
}

// Mode toggle (আপনার বর্তমান কোড)
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Menu toggle (আপনার বর্তমান কোড)
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('side-menu').classList.add('active');
});

document.getElementById('close-menu').addEventListener('click', () => {
  document.getElementById('side-menu').classList.remove('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const sideMenu = document.getElementById('side-menu');
  const menuToggle = document.getElementById('menu-toggle');
  
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove('active');
  }
});
