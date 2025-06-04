const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

// Language code mapping
const langCodeMap = {
  germany: 'de',
  italy: 'it',
  russian: 'ru'
};

// Global variables
let currentLanguage = '';
let currentData = [];
let userFolders = JSON.parse(localStorage.getItem('speakeu_folders')) || {};
let currentFolderId = '';
let showingFolderContent = false;

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

  setupMenuToggle();
});

// Setup menu toggle functionality
function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  const closeMenu = document.getElementById('close-menu');

  menuToggle.addEventListener('click', () => {
    sideMenu.classList.add('active');
  });

  closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      sideMenu.classList.remove('active');
    }
  });
}

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

// Render vocabulary with folder save option
function renderVocabulary(list, langKey) {
  hideError();
  conversationArea.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    showError('এই ভাষার জন্য কোনো ডেটা পাওয়া যায়নি।');
    return;
  }

  // Show controls
  const controlsHtml = `
    <div id="folder-controls">
      <div class="folder-header">
        <h3>📋 ${showingFolderContent ? 'ফোল্ডার কন্টেন্ট' : 'সব কথোপকথন'}</h3>
        <div class="folder-buttons">
          <button id="show-all-btn" class="control-btn ${!showingFolderContent ? 'active' : ''}" onclick="showAllItems()">সব দেখুন</button>
          <button id="show-folders-btn" class="control-btn ${showingFolderContent ? 'active' : ''}" onclick="showFolderView()">📁 ফোল্ডার দেখুন</button>
          <button id="export-btn" class="control-btn" onclick="exportAllFolders()">📤 Export</button>
          <button id="import-btn" class="control-btn" onclick="importFolders()">📥 Import</button>
        </div>
      </div>
    </div>
  `;

  conversationArea.innerHTML = controlsHtml;

  list.forEach((item, index) => {
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';

    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
      <button class="save-folder-btn" 
              onclick="showSaveToFolderDialog('${langKey}', ${index})"
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

// Show Save to Folder Dialog
function showSaveToFolderDialog(language, index) {
  const folderIds = Object.keys(userFolders);
  
  const dialogHtml = `
    <div class="folder-dialog-overlay" onclick="closeFolderDialog()">
      <div class="folder-dialog" onclick="event.stopPropagation()">
        <h3>💾 Save to Folder</h3>
        
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
  
  setTimeout(() => {
    const input = document.getElementById('new-folder-name');
    if (input) input.focus();
  }, 100);
}

// Create New Folder
function createNewFolder(language, index) {
  const folderName = document.getElementById('new-folder-name').value.trim();
  if (!folderName) {
    alert('ফোল্ডারের নাম লিখুন!');
    return;
  }
  
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
    created: new Date().toISOString()
  };
  
  localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
  closeFolderDialog();
  showSuccessMessage(`"${folderName}" ফোল্ডারে সেভ করা হয়েছে!`);
}

// Save to Existing Folder
function saveToExistingFolder(folderId, language, index) {
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
  
  localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
  closeFolderDialog();
  showSuccessMessage(`"${userFolders[folderId].name}" ফোল্ডারে সেভ করা হয়েছে!`);
}

// Close Folder Dialog
function closeFolderDialog() {
  const dialog = document.querySelector('.folder-dialog-overlay');
  if (dialog) dialog.remove();
}

// Show Folder View with Dropdown
function showFolderView() {
  hideHomePage();
  hideError();
  
  const folderIds = Object.keys(userFolders);
  
  if (folderIds.length === 0) {
    conversationArea.innerHTML = `
      <div class="no-folders">
        <h2>📁 কোনো ফোল্ডার নেই</h2>
        <p>কথোপকথনের পাশে 💾 বাটনে ক্লিক করে ফোল্ডার তৈরি করুন।</p>
        <button onclick="showAllItems()" class="control-btn">← সব কথোপকথন দেখুন</button>
      </div>
    `;
    return;
  }

  let foldersHtml = `
    <div class="folders-container">
      <div class="folders-header">
        <h2>📁 My Folders</h2>
        <div class="folder-controls">
          <label for="folder-selector">ফোল্ডার সিলেক্ট করুন:</label>
          <select id="folder-selector" onchange="showSelectedFolderContent(this.value)">
            <option value="">-- ফোল্ডার বেছে নিন --</option>
            ${folderIds.map(folderId => `
              <option value="${folderId}">${userFolders[folderId].name} (${userFolders[folderId].items.length} items)</option>
            `).join('')}
          </select>
          <button onclick="showAllItems()" class="back-btn">← সব কথোপকথন</button>
        </div>
      </div>
      
      <div id="folder-content-area">
        <p class="folder-instruction">উপরের dropdown থেকে একটি ফোল্ডার সিলেক্ট করুন।</p>
      </div>
    </div>
  `;
  
  conversationArea.innerHTML = foldersHtml;
  showingFolderContent = true;
}

// Show Selected Folder Content
function showSelectedFolderContent(folderId) {
  if (!folderId) {
    document.getElementById('folder-content-area').innerHTML = '<p class="folder-instruction">উপরের dropdown থেকে একটি ফোল্ডার সিলেক্ট করুন।</p>';
    return;
  }
  
  const folder = userFolders[folderId];
  if (!folder) return;
  
  currentFolderId = folderId;
  
  let folderContentHtml = `
    <div class="folder-content">
      <h3>📂 ${folder.name} (${folder.items.length} conversations)</h3>
      
      <div class="folder-items">
        ${folder.items.length === 0 ? 
          '<p class="empty-folder">এই ফোল্ডারে কোনো বাক্য নেই।</p>' :
          folder.items.map((item, itemIndex) => {
            const conversationData = getCurrentConversationData(item.language, item.langKey, item.index);
            
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
                  <small>ভাষা: ${getLanguageName(item.language)} • সেভ করা: ${new Date(item.addedDate).toLocaleDateString('bn-BD')}</small>
                </div>
              </div>
            `;
          }).join('')
        }
      </div>
    </div>
  `;
  
  document.getElementById('folder-content-area').innerHTML = folderContentHtml;
}

// Get Current Conversation Data
function getCurrentConversationData(language, langKey, index) {
  if (language === currentLanguage && currentData[index]) {
    const item = currentData[index];
    return {
      local: item[langKey] || 'N/A',
      bn: item.bn || 'N/A',
      bnMeaning: item.bnMeaning || 'N/A',
      en: item.en || 'N/A'
    };
  }
  
  return {
    local: `[${language} data]`,
    bn: '[ডেটা লোড হয়নি]',
    bnMeaning: '[অর্থ লোড হয়নি]',
    en: '[English not loaded]'
  };
}

// Get Language Name
function getLanguageName(langCode) {
  const names = {
    'germany': 'জার্মান',
    'italy': 'ইতালিয়ান', 
    'russian': 'রাশিয়ান'
  };
  return names[langCode] || langCode;
}

// Remove from Folder
function removeFromFolder(folderId, itemIndex) {
  if (confirm('এই বাক্যটি ফোল্ডার থেকে সরাতে চান?')) {
    userFolders[folderId].items.splice(itemIndex, 1);
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    
    showSelectedFolderContent(folderId);
    showSuccessMessage('বাক্যটি ফোল্ডার থেকে সরানো হয়েছে!');
  }
}

// Show All Items
function showAllItems() {
  showingFolderContent = false;
  currentFolderId = '';
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Show Success Message
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
  
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 3000);
}

// Export All Folders
function exportAllFolders() {
  const exportData = {
    exportInfo: {
      appName: 'Speak EU',
      version: '2.0',
      exportDate: new Date().toISOString(),
      type: 'all_folders'
    },
    folders: userFolders
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `speak-eu-folders-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSuccessMessage('সব ফোল্ডার Export করা হয়েছে!');
}

// Import Folders
function importFolders() {
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
        
        if (importData.folders && typeof importData.folders === 'object') {
          userFolders = {...userFolders, ...importData.folders};
          localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
          
          showSuccessMessage('ফোল্ডার তালিকা সফলভাবে Import করা হয়েছে!');
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

// Reset all data
function resetAllData() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা রিসেট করতে চান? এটি আপনার সব ফোল্ডার এবং সেটিংস মুছে দেবে।')) {
    localStorage.clear();
    userFolders = {};
    currentData = [];
    currentLanguage = '';
    showingFolderContent = false;
    currentFolderId = '';
    languageSelect.value = '';
    showHomePage();
    showSuccessMessage('সব ডেটা সফলভাবে রিসেট করা হয়েছে!');
  }
}

// Toggle dark/light mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Show error
function showError(message) {
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  
  if (errorDisplay && errorMessage) {
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
  }
  
  hideHomePage();
}

// Hide error
function hideError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.style.display = 'none';
  }
}

// Show/hide homepage
function showHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) {
    homepage.style.display = 'block';
  }
  hideError();
  showingFolderContent = false;
  currentFolderId = '';
}

function hideHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) {
    homepage.style.display = 'none';
  }
}

// Page navigation functions
function showAboutPage() {
  hideHomePage();
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
      
      <h3>✨ বৈশিষ্ট্যসমূহ</h3>
      <ul>
        <li>🔤 বাংলা উচ্চারণ সহ প্রতিটি শব্দ</li>
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
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>🔒 গোপনীয়তা নীতি</h2>
      
      <h3>তথ্য সংগ্রহ</h3>
      <p>আমরা শুধুমাত্র আপনার ব্রাউজারের localStorage এ ডেটা সংরক্ষণ করি। কোনো ব্যক্তিগত তথ্য আমাদের সার্ভারে পাঠানো হয় না।</p>
      
      <h3>ডেটা ব্যবহার</h3>
      <p>আপনার সংরক্ষিত ফোল্ডার এবং ভাষা পছন্দ শুধুমাত্র আপনার ডিভাইসে থাকে এবং আপনার শিক্ষার অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়।</p>
      
      <h3>তৃতীয় পক্ষের সাথে শেয়ারিং</h3>
      <p>আমরা আপনার কোনো ডেটা তৃতীয় পক্ষের সাথে শেয়ার করি না।</p>
      
      <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
    </div>
  `;
}
