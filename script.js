// ====== Speak EU Main Script ======

// ---- Language Selectors & Variables ----
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
let currentLanguage = '';
let currentData = [];
let userFolders = JSON.parse(localStorage.getItem('speakeu_folders')) || {};
let showingFolderContent = false;
let currentFolderId = '';

// Language code mapping (country value => lang code)
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

// ---- On Load: Set Theme, Language, Menu ----
window.addEventListener('DOMContentLoaded', () => {
  // Saved Language
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  } else {
    showHomePage();
  }

  // Saved Theme
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
});

// ---- Menu Toggle ----
function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  const closeMenu = document.getElementById('close-menu');
  menuToggle.addEventListener('click', () => sideMenu.classList.add('active'));
  closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      sideMenu.classList.remove('active');
    }
  });
}

// ---- Dark/Light Mode Toggle ----
function setupModeToggle() {
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    modeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ---- Language Selection ----
languageSelect.addEventListener('change', () => {
  const lang = languageSelect.value;
  if (!lang) {
    showHomePage();
    return;
  }
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

// ---- Load Language Data ----
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

// ---- Loading State ----
function showLoadingState() {
  conversationArea.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner">⏳</div>
      <p>ডেটা লোড হচ্ছে...</p>
    </div>
  `;
}

// ---- Vocabulary List Render ----
function renderVocabulary(list, langKey) {
  hideError();
  conversationArea.innerHTML = '';
  if (!Array.isArray(list) || list.length === 0) {
    showError('এই ভাষার জন্য কোনো ডেটা পাওয়া যায়নি।');
    return;
  }

  // Folder Controls
  const folderControlsHtml = `
    <div id="folder-controls">
      <div class="favorites-header">
        <h3>📁 ${showingFolderContent ? 'ফোল্ডার কন্টেন্ট' : 'সব কথোপকথন'}</h3>
        <div class="favorites-buttons">
          <button id="show-all-btn" class="control-btn ${!showingFolderContent ? 'active' : ''}" onclick="showAllItems()">সব দেখুন</button>
          <button id="show-folders-btn" class="control-btn ${showingFolderContent ? 'active' : ''}" onclick="showFolderView()">📁 ফোল্ডার</button>
          <button id="export-folders-btn" class="control-btn" onclick="exportFolders()">📤 Export</button>
          <button id="import-folders-btn" class="control-btn" onclick="importFolders()">📥 Import</button>
        </div>
      </div>
    </div>
  `;
  conversationArea.innerHTML = folderControlsHtml;

  list.forEach((item, index) => {
    const localLang = item[langKey] || '—';
    const bn = item.bn || '—';
    const bnMeaning = item.bnMeaning || '—';
    const en = item.en || '—';

    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
      <button class="save-folder-btn" onclick="showSaveToFolderDialog('${langKey}', ${index})" title="ফোল্ডারে সেভ করুন">💾</button>
      <div>🗣️ <strong>${localLang}</strong></div>
      <div>📝 <span>${bn}</span></div>
      <div>📘 <em>${bnMeaning}</em></div>
      <div>🔤 <span>${en}</span></div>
    `;
    conversationArea.appendChild(div);
  });
}

// ---- Save to Folder Dialog ----
window.showSaveToFolderDialog = function(language, index) {
  const folderIds = Object.keys(userFolders);
  const dialogHtml = `
    <div class="folder-dialog-overlay" onclick="closeFolderDialog()">
      <div class="folder-dialog" onclick="event.stopPropagation()">
        <h3>💾 ফোল্ডারে সেভ করুন</h3>
        <div class="new-folder-section">
          <h4>🆕 নতুন ফোল্ডার তৈরি করুন</h4>
          <input type="text" id="new-folder-name" placeholder="ফোল্ডারের নাম..." maxlength="50">
          <button onclick="createNewFolder('${language}', ${index})" class="create-folder-btn">তৈরি করুন ও সেভ করুন</button>
        </div>
        ${folderIds.length > 0 ? `
          <div class="existing-folders-section">
            <h4>📂 বিদ্যমান ফোল্ডার নির্বাচন করুন</h4>
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
          <button class="cancel-btn" onclick="closeFolderDialog()">বাতিল</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', dialogHtml);
  setTimeout(() => {
    const input = document.getElementById('new-folder-name');
    if (input) input.focus();
  }, 100);
};

// ---- Create New Folder ----
window.createNewFolder = function(language, index) {
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
};

// ---- Save to Existing Folder ----
window.saveToExistingFolder = function(folderId, language, index) {
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
};

// ---- Close Folder Dialog ----
window.closeFolderDialog = function() {
  const dialog = document.querySelector('.folder-dialog-overlay');
  if (dialog) dialog.remove();
};

// ---- Show Folder View ----
window.showFolderView = function() {
  hideHomePage();
  hideError();
  showingFolderContent = true;
  const folderIds = Object.keys(userFolders);
  if (folderIds.length === 0) {
    conversationArea.innerHTML = `
      <div class="folders-container">
        <div class="folders-header">
          <h2>📁 কোনো ফোল্ডার নেই</h2>
          <p>কথোপকথনের পাশে 💾 বাটনে ক্লিক করে ফোল্ডার তৈরি করুন।</p>
          <button onclick="showAllItems()" class="control-btn">← সব কথোপকথন দেখুন</button>
        </div>
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
};

// ---- Show Selected Folder Content ----
window.showSelectedFolderContent = function(folderId) {
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
            if (item.language === currentLanguage && currentData.length > 0 && currentData[item.index]) {
              const dataItem = currentData[item.index];
              const localLang = dataItem[item.langKey] || '—';
              const bn = dataItem.bn || '—';
              const bnMeaning = dataItem.bnMeaning || '—';
              const en = dataItem.en || '—';
              return `
                <div class="conversation-item">
                  <button onclick="removeFromFolder('${folderId}', ${itemIndex})" class="remove-from-folder-btn" title="ফোল্ডার থেকে মুছুন">×</button>
                  <div>🗣️ <strong>${localLang}</strong></div>
                  <div>📝 <span>${bn}</span></div>
                  <div>📘 <em>${bnMeaning}</em></div>
                  <div>🔤 <span>${en}</span></div>
                </div>
              `;
            } else {
              return `
                <div class="conversation-item">
                  <button onclick="removeFromFolder('${folderId}', ${itemIndex})" class="remove-from-folder-btn" title="ফোল্ডার থেকে মুছুন">×</button>
                  <div>⚠️ <strong>ডেটা লোড করা যায়নি</strong></div>
                  <div>📝 ভাষা: ${item.language}</div>
                  <div>📘 ইনডেক্স: ${item.index}</div>
                </div>
              `;
            }
          }).join('')
        }
      </div>
    </div>
  `;
  document.getElementById('folder-content-area').innerHTML = folderContentHtml;
};

// ---- Remove From Folder ----
window.removeFromFolder = function(folderId, itemIndex) {
  if (confirm('এই বাক্যটি ফোল্ডার থেকে মুছে ফেলবেন?')) {
    userFolders[folderId].items.splice(itemIndex, 1);
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    showSelectedFolderContent(folderId);
    showSuccessMessage('ফোল্ডার থেকে মুছে ফেলা হয়েছে!');
  }
};

// ---- Show All Items ----
window.showAllItems = function() {
  showingFolderContent = false;
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
};

// ---- Export Folders ----
window.exportFolders = function() {
  if (Object.keys(userFolders).length === 0) {
    alert('কোনো ফোল্ডার নেই!');
    return;
  }
  const exportData = {
    exportDate: new Date().toISOString(),
    appName: 'Speak EU',
    version: '2.0',
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
  showSuccessMessage('ফোল্ডার তালিকা সফলভাবে Export করা হয়েছে!');
};

// ---- Import Folders ----
window.importFolders = function() {
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
          if (showingFolderContent) showFolderView();
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
};

// ---- Reset All Data ----
window.resetAllData = function() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা রিসেট করতে চান? এটি আপনার সব ফোল্ডার এবং সেটিংস মুছে দেবে।')) {
    localStorage.clear();
    userFolders = {};
    currentData = [];
    currentLanguage = '';
    showingFolderContent = false;
    languageSelect.value = '';
    showHomePage();
    showSuccessMessage('সব ডেটা সফলভাবে রিসেট করা হয়েছে!');
  }
};

// ---- Error UI ----
function showError(message) {
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  if (errorDisplay && errorMessage) {
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
  }
  hideHomePage();
  hideFolderControls();
}
function hideError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) errorDisplay.style.display = 'none';
}

// ---- Homepage ----
window.showHomePage = function() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) homepage.style.display = 'block';
  hideError();
  hideFolderControls();
  showingFolderContent = false;
};
function hideHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) homepage.style.display = 'none';
}

// ---- Folder Controls Show/Hide (for compatibility) ----
function showFolderControls() { /* Now dynamic, no-op */ }
function hideFolderControls() {
  const controls = document.getElementById('folder-controls');
  if (controls) controls.style.display = 'none';
}

// ---- Success Toast ----
function showSuccessMessage(message) {
  const existingToast = document.querySelector('.success-toast');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `✅ ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2800);
}

// ---- Static Page Navigation ----
window.showAboutPage = function() {
  hideHomePage(); hideError(); hideFolderControls();
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📖 আমাদের সম্পর্কে</h2>
      <p><strong>Speak EU</strong> একটি আধুনিক ডিজিটাল ভাষা শিক্ষার প্ল্যাটফর্ম, যা ইউরোপের বিভিন্ন দেশে বসবাসরত অভিবাসী, কর্মজীবী এবং পর্যটকদের জন্য।</p>
      <ul>
        <li>ইউরোপের ৪৫+ ভাষায় দৈনন্দিন কথোপকথন</li>
        <li>সহজ ভাষা শেখার পদ্ধতি</li>
        <li>বাংলা অর্থ ও উচ্চারণ</li>
        <li>ফোল্ডার এবং ডার্ক মোড</li>
      </ul>
      <div style="margin-top: 22px;">
        <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
      </div>
    </div>
  `;
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu) sideMenu.classList.remove('active');
};
window.showContactPage = function() {
  hideHomePage(); hideError(); hideFolderControls();
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📞 যোগাযোগ</h2>
      <p>আমাদের সাথে যোগাযোগ করুন:</p>
      <p>ইমেইল: support@speakeu.com</p>
      <p>Facebook: @SpeakEU | Telegram: @SpeakEUSupport</p>
      <div style="margin-top: 22px;">
        <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
      </div>
    </div>
  `;
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu) sideMenu.classList.remove('active');
};
window.showPrivacyPage = function() {
  hideHomePage(); hideError(); hideFolderControls();
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>🔒 প্রাইভেসি পলিসি</h2>
      <p>আমরা শুধুমাত্র আপনার ব্রাউজারে স্থানীয়ভাবে ডেটা সংরক্ষণ করি। কোনো ব্যক্তিগত তথ্য আমাদের সার্ভারে পাঠানো হয় না।</p>
      <div style="margin-top: 22px;">
        <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
      </div>
    </div>
  `;
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu) sideMenu.classList.remove('active');
};
window.showFoldersPage = function() {
  showFolderView();
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu) sideMenu.classList.remove('active');
};

// ====== END ======
