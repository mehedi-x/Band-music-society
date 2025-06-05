// 🌐 ভাষা কোড ম্যাপিং
const langCodeMap = {
  austria: 'de', belgium: 'nl', czech: 'cs', denmark: 'da', finland: 'fi',
  france: 'fr', germany: 'de', greece: 'el', italy: 'it', netherlands: 'nl',
  norway: 'no', poland: 'pl', portugal: 'pt', spain: 'es', sweden: 'sv',
  switzerland: 'de', russian: 'ru', turkey: 'tr', ukraine: 'uk', unitedkingdom: 'en'
};

// 🌍 গ্লোবাল ভেরিয়েবল
let currentLanguage = '';
let currentData = [];
let userFolders = JSON.parse(localStorage.getItem('speakeu_folders')) || {};
let showingFolderContent = false;

// 📱 DOM এলিমেন্ট
const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');
const sideMenu = document.getElementById('side-menu');

// 🚀 অ্যাপ ইনিশিয়ালাইজেশন
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  loadSavedSettings();
});

function initializeApp() {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && languageSelect.value !== savedLang) {
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
  } else {
    showHomePage();
  }
}

function setupEventListeners() {
  // ভাষা নির্বাচন
  languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    if (!lang) {
      showHomePage();
      localStorage.removeItem('selectedLanguage');
      return;
    }
    localStorage.setItem('selectedLanguage', lang);
    loadLanguage(lang);
  });

  // মোড টগল
  modeToggle.addEventListener('click', toggleTheme);

  // মেনু টগল
  document.getElementById('menu-toggle').addEventListener('click', () => {
    sideMenu.classList.add('active');
  });

  document.getElementById('close-menu').addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });

  // বাইরে ক্লিক করলে মেনু বন্ধ
  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !e.target.closest('#menu-toggle')) {
      sideMenu.classList.remove('active');
    }
  });
}

function loadSavedSettings() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  }
}

// 🎨 থিম টগল
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 🏠 হোম পেইজ দেখানো
function showHomePage() {
  showingFolderContent = false;
  hideError();
  
  const homepageContent = document.getElementById('homepage-content');
  if (homepageContent) {
    homepageContent.style.display = 'block';
  }
  
  // অন্য কন্টেন্ট লুকানো
  const otherElements = conversationArea.querySelectorAll('.conversation-item, .favorites-header, .folders-container');
  otherElements.forEach(el => el.remove());
}

// 🗣️ ভাষা লোড করা
function loadLanguage(lang) {
  currentLanguage = lang;
  showLoadingState();
  
  fetch(`languages/${lang}.json`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('ডেটা ফরম্যাট সঠিক নয় বা খালি');
      }
      currentData = data;
      hideHomePage();
      renderVocabulary(data, langCodeMap[lang]);
    })
    .catch(error => {
      showError(`ভাষার ডেটা লোড করতে সমস্যা: ${error.message}`);
    });
}

function showLoadingState() {
  hideHomePage();
  conversationArea.innerHTML = `
    <div style="text-align: center; padding: 50px;">
      <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
      <h3>ডেটা লোড হচ্ছে...</h3>
    </div>
  `;
}

// 📚 শব্দভান্ডার রেন্ডার করা
function renderVocabulary(list, langKey) {
  hideError();
  hideHomePage();
  
  if (!Array.isArray(list) || list.length === 0) {
    showError('এই ভাষার জন্য কোনো ডেটা পাওয়া যায়নি।');
    return;
  }

  // ফোল্ডার কন্ট্রোল হেডার
  conversationArea.innerHTML = `
    <div class="favorites-header">
      <h3>📚 ${showingFolderContent ? 'ফোল্ডার কন্টেন্ট' : 'সব কথোপকথন'}</h3>
      <div class="favorites-buttons">
        <button class="control-btn ${!showingFolderContent ? 'active' : ''}" onclick="showAllItems()">সব দেখুন</button>
        <button class="control-btn ${showingFolderContent ? 'active' : ''}" onclick="showFolderView()">📁 ফোল্ডার</button>
        <button class="control-btn" onclick="exportAllFolders()">📤 এক্সপোর্ট</button>
        <button class="control-btn" onclick="importFolders()">📥 ইমপোর্ট</button>
      </div>
    </div>
  `;

  // কথোপকথন আইটেম যোগ করা
  list.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
      <button class="save-folder-btn" 
              onclick="showSaveToFolderDialog('${langKey}', ${index})"
              title="ফোল্ডারে সেভ করুন">💾</button>
      
      <div>🗣️ <strong>${item[langKey] || '—'}</strong></div>
      <div>📝 <span>${item.bn || '—'}</span></div>
      <div>📘 <em>${item.bnMeaning || '—'}</em></div>
      <div>🔤 <span>${item.en || '—'}</span></div>
    `;
    conversationArea.appendChild(div);
  });
}

// 💾 ফোল্ডারে সেভ করার ডায়ালগ
function showSaveToFolderDialog(language, index) {
  const folderIds = Object.keys(userFolders);
  
  const dialogHtml = `
    <div class="folder-dialog-overlay" onclick="closeFolderDialog()">
      <div class="folder-dialog" onclick="event.stopPropagation()">
        <h3>💾 ফোল্ডারে সেভ করুন</h3>
        
        <div class="new-folder-section">
          <h4>🆕 নতুন ফোল্ডার</h4>
          <input type="text" id="new-folder-name" placeholder="ফোল্ডারের নাম..." maxlength="50">
          <button onclick="createNewFolder('${language}', ${index})" class="create-folder-btn">তৈরি করুন</button>
        </div>
        
        ${folderIds.length > 0 ? `
          <div class="existing-folders-section">
            <h4>📂 বিদ্যমান ফোল্ডার</h4>
            ${folderIds.map(folderId => `
              <div class="folder-option" onclick="saveToExistingFolder('${folderId}', '${language}', ${index})">
                <span>📂</span>
                <span>${userFolders[folderId].name}</span>
                <span>(${userFolders[folderId].items.length})</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <button onclick="closeFolderDialog()" style="margin-top: 20px; padding: 10px 20px; border-radius: 5px; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer;">বাতিল</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', dialogHtml);
  setTimeout(() => document.getElementById('new-folder-name')?.focus(), 100);
}

// 🆕 নতুন ফোল্ডার তৈরি
function createNewFolder(language, index) {
  const folderName = document.getElementById('new-folder-name')?.value.trim();
  if (!folderName) {
    alert('ফোল্ডারের নাম লিখুন!');
    return;
  }
  
  const existingNames = Object.values(userFolders).map(folder => folder.name.toLowerCase());
  if (existingNames.includes(folderName.toLowerCase())) {
    alert('এই নামে ফোল্ডার আছে!');
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
  showSuccessMessage(`"${folderName}" ফোল্ডারে সেভ হয়েছে!`);
}

// 📂 বিদ্যমান ফোল্ডারে সেভ
function saveToExistingFolder(folderId, language, index) {
  const exists = userFolders[folderId].items.some(item => 
    item.language === currentLanguage && item.langKey === language && item.index === index
  );
  
  if (exists) {
    alert('এই বাক্যটি ইতিমধ্যে আছে!');
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
  showSuccessMessage(`"${userFolders[folderId].name}" ফোল্ডারে সেভ হয়েছে!`);
}

// ❌ ডায়ালগ বন্ধ
function closeFolderDialog() {
  document.querySelector('.folder-dialog-overlay')?.remove();
}

// 📁 ফোল্ডার ভিউ
function showFolderView() {
  hideHomePage();
  hideError();
  showingFolderContent = true;
  
  const folderIds = Object.keys(userFolders);
  
  if (folderIds.length === 0) {
    conversationArea.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h2>📁 কোনো ফোল্ডার নেই</h2>
        <p>কথোপকথনের পাশে 💾 বাটনে ক্লিক করে ফোল্ডার তৈরি করুন।</p>
        <button onclick="showAllItems()" class="control-btn">← সব কথোপকথন দেখুন</button>
      </div>
    `;
    return;
  }

  conversationArea.innerHTML = `
    <div class="folders-container">
      <div class="favorites-header">
        <h2>📁 আমার ফোল্ডার</h2>
        <div>
          <select id="folder-selector" onchange="showSelectedFolderContent(this.value)" style="padding: 10px; margin-right: 10px; border-radius: 5px;">
            <option value="">-- ফোল্ডার বেছে নিন --</option>
            ${folderIds.map(folderId => `
              <option value="${folderId}">${userFolders[folderId].name} (${userFolders[folderId].items.length})</option>
            `).join('')}
          </select>
          <button onclick="showAllItems()" class="control-btn">← সব কথোপকথন</button>
        </div>
      </div>
      
      <div id="folder-content-area">
        <p style="text-align: center; padding: 30px; color: #666;">উপরের dropdown থেকে একটি ফোল্ডার সিলেক্ট করুন।</p>
      </div>
    </div>
  `;
}

// 📂 নির্বাচিত ফোল্ডার কন্টেন্ট
function showSelectedFolderContent(folderId) {
  const contentArea = document.getElementById('folder-content-area');
  if (!folderId || !contentArea) {
    if (contentArea) {
      contentArea.innerHTML = '<p style="text-align: center; padding: 30px;">একটি ফোল্ডার সিলেক্ট করুন।</p>';
    }
    return;
  }
  
  const folder = userFolders[folderId];
  if (!folder) return;
  
  if (folder.items.length === 0) {
    contentArea.innerHTML = '<p style="text-align: center; padding: 30px;">এই ফোল্ডারে কোনো বাক্য নেই।</p>';
    return;
  }

  let folderContentHtml = `<h3>📂 ${folder.name} (${folder.items.length} বাক্য)</h3>`;
  
  folder.items.forEach((item, itemIndex) => {
    // ভাষার ডেটা লোড করার চেষ্টা
    if (item.language === currentLanguage && currentData.length > 0 && currentData[item.index]) {
      const dataItem = currentData[item.index];
      const localLang = dataItem[item.langKey] || '—';
      const bn = dataItem.bn || '—';
      const bnMeaning = dataItem.bnMeaning || '—';
      const en = dataItem.en || '—';

      folderContentHtml += `
        <div class="conversation-item">
          <button onclick="removeFromFolder('${folderId}', ${itemIndex})" 
                  style="position: absolute; top: 10px; right: 10px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;" 
                  title="ফোল্ডার থেকে মুছুন">×</button>
          
          <div>🗣️ <strong>${localLang}</strong></div>
          <div>📝 <span>${bn}</span></div>
          <div>📘 <em>${bnMeaning}</em></div>
          <div>🔤 <span>${en}</span></div>
        </div>
      `;
    } else {
      folderContentHtml += `
        <div class="conversation-item">
          <button onclick="removeFromFolder('${folderId}', ${itemIndex})" 
                  style="position: absolute; top: 10px; right: 10px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;" 
                  title="ফোল্ডার থেকে মুছুন">×</button>
          
          <div>⚠️ <strong>ডেটা লোড করা যায়নি</strong></div>
          <div>📝 ভাষা: ${item.language}</div>
          <div>📘 ইনডেক্স: ${item.index}</div>
        </div>
      `;
    }
  });
  
  contentArea.innerHTML = folderContentHtml;
}

// 🗑️ ফোল্ডার থেকে মুছে ফেলা
function removeFromFolder(folderId, itemIndex) {
  if (confirm('এই বাক্যটি ফোল্ডার থেকে মুছে ফেলবেন?')) {
    userFolders[folderId].items.splice(itemIndex, 1);
    localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
    showSelectedFolderContent(folderId);
    showSuccessMessage('ফোল্ডার থেকে মুছে ফেলা হয়েছে!');
  }
}

// 📤 সব ফোল্ডার এক্সপোর্ট
function exportAllFolders() {
  if (Object.keys(userFolders).length === 0) {
    alert('কোনো ফোল্ডার নেই!');
    return;
  }
  
  const dataStr = JSON.stringify(userFolders, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `speakeu_folders_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showSuccessMessage('ফোল্ডার এক্সপোর্ট হয়েছে!');
}

// 📥 ফোল্ডার ইমপোর্ট
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
        const importedData = JSON.parse(e.target.result);
        
        // ডেটা ভ্যালিডেশন
        if (typeof importedData !== 'object') {
          throw new Error('ভুল ফরম্যাট');
        }
        
        // বিদ্যমান ডেটার সাথে মার্জ
        Object.assign(userFolders, importedData);
        localStorage.setItem('speakeu_folders', JSON.stringify(userFolders));
        showSuccessMessage('ফোল্ডার ইমপোর্ট হয়েছে!');
        
        if (showingFolderContent) {
          showFolderView();
        }
      } catch (error) {
        alert('ফাইল ইমপোর্ট করতে সমস্যা: ' + error.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// 🔄 সব ডেটা রিসেট
function resetAllData() {
  if (confirm('সব ডেটা মুছে ফেলবেন? এই কাজ পূর্বাবস্থায় ফেরানো যাবে না!')) {
    localStorage.removeItem('speakeu_folders');
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('theme');
    userFolders = {};
    alert('সব ডেটা মুছে ফেলা হয়েছে!');
    location.reload();
  }
}

// 📄 অন্যান্য পেইজ
function showAboutPage() {
  hideHomePage();
  conversationArea.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <h2>🌍 Speak EU সম্পর্কে</h2>
      <p>ইউরোপীয় ভাষা শেখার সহজ অ্যাপ</p>
      <p><strong>ভার্সন:</strong> 2.0</p>
      <p><strong>তৈরি:</strong> ২০২৪</p>
      <button onclick="showHomePage()" class="control-btn">← হোমে ফিরুন</button>
    </div>
  `;
  sideMenu.classList.remove('active');
}

// 🏠 সব আইটেম দেখানো
function showAllItems() {
  showingFolderContent = false;
  if (currentLanguage && currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  } else {
    showHomePage();
  }
}

// 🏠 হোমপেইজ লুকানো
function hideHomePage() {
  const homepageContent = document.getElementById('homepage-content');
  if (homepageContent) {
    homepageContent.style.display = 'none';
  }
}

// ⚠️ এরর দেখানো/লুকানো
function showError(message) {
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  if (errorDisplay && errorMessage) {
    errorMessage.textContent = message;
    errorDisplay.style.display = 'block';
  }
}

function hideError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.style.display = 'none';
  }
}

// ✅ সফল বার্তা
function showSuccessMessage(message) {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px 25px; border-radius: 10px; z-index: 1001; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
      ✅ ${message}
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 🎯 ভাষা নির্বাচন (হোম পেইজ থেকে)
function selectLanguage(lang) {
  languageSelect.value = lang;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
}

// 🎨 স্মুথ স্ক্রলিং
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
