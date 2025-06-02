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

// Render vocabulary with favorites
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
      <div>🗣️ <strong>${localLang}</strong></div>
      <div>📝 <span>${bn}</span></div>
      <div>📘 <em>${bnMeaning}</em></div>
      <div>🔤 <span>${en}</span></div>
    `;
    conversationArea.appendChild(div);
  });
}

// Toggle favorite status
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

// Show all items
function showAllItems() {
  showingFavorites = false;
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Show favorite items only
function showFavoriteItems() {
  showingFavorites = true;
  if (currentData.length > 0) {
    renderVocabulary(currentData, langCodeMap[currentLanguage]);
  }
}

// Export favorites
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

// Import favorites
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

// Reset all data
function resetAllData() {
  if (confirm('আপনি কি নিশ্চিত যে সব ডেটা রিসেট করতে চান? এটি আপনার সব ফেভারিট এবং সেটিংস মুছে দেবে।')) {
    localStorage.clear();
    favorites = {};
    currentData = [];
    currentLanguage = '';
    showingFavorites = false;
    languageSelect.value = '';
    showHomePage();
    alert('সব ডেটা সফলভাবে রিসেট করা হয়েছে!');
  }
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
  hideFavoritesControls();
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
  hideFavoritesControls();
}

function hideHomePage() {
  const homepage = document.getElementById('homepage-content');
  if (homepage) {
    homepage.style.display = 'none';
  }
}

// Show/hide favorites controls
function showFavoritesControls() {
  // Controls are now part of renderVocabulary function
}

function hideFavoritesControls() {
  const controls = document.getElementById('favorites-controls');
  if (controls) {
    controls.style.display = 'none';
  }
}

// Page navigation functions
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
        <li>🌙 ডার্ক/লাইট মোড</li>
        <li>📱 মোবাইল ফ্রেন্ডলি ডিজাইন</li>
        <li>💾 ডেটা এক্সপোর্ট/ইমপোর্ট</li>
      </ul>
      
      <h3>🚀 ভবিষ্যৎ পরিকল্পনা</h3>
      <ul>
        <li>অডিও উচ্চারণ যোগ করা</li>
        <li>গ্রামার সেকশন যোগ করা</li>
        <li>প্র্যাকটিস কুইজ সিস্টেম</li>
        <li>অফলাইন সাপোর্ট</li>
      </ul>
      
      <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h4>💌 আমাদের মিশন</h4>
        <p>আমাদের মূল লক্ষ্য হলো ইউরোপে বসবাসকারী বাংলাদেশী সম্প্রদায়ের ভাষাগত বাধা দূর করা এবং তাদের সামাজিক ও পেশাগত জীবনে সফলতা অর্জনে সহায়তা করা।</p>
      </div>
    </div>
  `;
  closeSideMenu();
}

function showContactPage() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>📞 যোগাযোগ করুন</h2>
      <p>আমাদের সাথে যোগাযোগ করতে নিচের তথ্যগুলো ব্যবহার করুন:</p>
      
      <div class="contact-section">
        <h3>📧 ইমেইল</h3>
        <p><a href="mailto:info@speakeu.com">info@speakeu.com</a></p>
        <p><a href="mailto:support@speakeu.com">support@speakeu.com</a></p>
      </div>
      
      <div class="contact-section">
        <h3>📱 সোশ্যাল মিডিয়া</h3>
        <p><a href="https://facebook.com/speakeu" target="_blank">📘 Facebook</a></p>
        <p><a href="https://t.me/speakeu" target="_blank">📢 Telegram</a></p>
        <p><a href="https://youtube.com/speakeu" target="_blank">📺 YouTube</a></p>
      </div>
      
      <div class="contact-section">
        <h3>🕒 সাপোর্ট সময়</h3>
        <p>সোমবার - শুক্রবার: সকাল ৯টা - রাত ৯টা (CET)</p>
        <p>শনিবার - রবিবার: সকাল ১০টা - সন্ধ্যা ৬টা (CET)</p>
      </div>
      
      <div class="contact-section">
        <h3>🌍 অফিস ঠিকানা</h3>
        <p>Speak EU Headquarters<br>
        123 Language Learning Street<br>
        Brussels, Belgium</p>
      </div>
      
      <div class="contact-section">
        <h3>🛠️ টেকনিক্যাল সাপোর্ট</h3>
        <p>যদি আপনি কোনো টেকনিক্যাল সমস্যার সম্মুখীন হন, তাহলে দয়া করে নিচের তথ্যগুলো উল্লেখ করে আমাদের জানান:</p>
        <ul>
          <li>ব্রাউজারের নাম ও ভার্সন</li>
          <li>ডিভাইসের ধরন (কম্পিউটার/মোবাইল)</li>
          <li>সমস্যার বিস্তারিত বর্ণনা</li>
        </ul>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border-radius: 10px;">
        <h4>💡 আপনার মতামত গুরুত্বপূর্ণ</h4>
        <p>আপনার যেকোনো পরামর্শ, মতামত বা নতুন ফিচারের আইডিয়া থাকলে আমাদের সাথে শেয়ার করুন। আমরা আপনাদের ফিডব্যাকের ভিত্তিতে প্ল্যাটফর্মটি আরও উন্নত করতে চাই।</p>
      </div>
    </div>
  `;
  closeSideMenu();
}

function showPrivacyPage() {
  hideHomePage();
  hideError();
  hideFavoritesControls();
  
  conversationArea.innerHTML = `
    <div class="page-content">
      <h2>🔒 গোপনীয়তা নীতি</h2>
      <p><em>সর্বশেষ আপডেট: ${new Date().toLocaleDateString('bn-BD')}</em></p>
      
      <h3>📋 তথ্য সংগ্রহ</h3>
      <p>আমরা নিম্নলিখিত তথ্যগুলো সংগ্রহ করি:</p>
      <ul>
        <li><strong>ব্যবহারের তথ্য:</strong> আপনি কোন ভাষা নির্বাচন করেন</li>
        <li><strong>ফেভারিট তালিকা:</strong> আপনার সেভ করা শব্দগুলো</li>
        <li><strong>সেটিংস:</strong> থিম এবং ভাষার পছন্দ</li>
      </ul>
      
      <h3>💾 ডেটা সংরক্ষণ</h3>
      <p>আপনার সকল ডেটা আপনার ডিভাইসের <strong>Local Storage</strong> এ সংরক্ষিত হয়। আমরা কোনো ব্যক্তিগত তথ্য আমাদের সার্ভারে সংরক্ষণ করি না।</p>
      
      <h3>🔐 ডেটা নিরাপত্তা</h3>
      <ul>
        <li>আপনার ডেটা শুধুমাত্র আপনার ডিভাইসেই থাকে</li>
        <li>আমরা কোনো তৃতীয় পক্ষের সাথে আপনার তথ্য শেয়ার করি না</li>
        <li>আপনি যেকোনো সময় আপনার ডেটা ডিলিট করতে পারেন</li>
      </ul>
      
      <h3>🍪 কুকিজ</h3>
      <p>আমরা শুধুমাত্র প্রয়োজনীয় Local Storage ব্যবহার করি। কোনো ট্র্যাকিং কুকিজ ব্যবহার করা হয় না।</p>
      
      <h3>🌐 তৃতীয় পক্ষের সেবা</h3>
      <p>আমাদের ওয়েবসাইট সম্পূর্ণভাবে স্ট্যাটিক এবং কোনো তৃতীয় পক্ষের ট্র্যাকিং সার্ভিস ব্যবহার করে না।</p>
      
      <h3>👶 শিশুদের গোপনীয়তা</h3>
      <p>আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা জেনেশুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।</p>
      
      <h3>📝 নীতি পরিবর্তন</h3>
      <p>এই গোপনীয়তা নীতিতে যেকোনো পরিবর্তন এই পৃষ্ঠায় প্রকাশ করা হবে। আমরা গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আলাদা নোটিশ প্রদান করব।</p>
      
      <h3>📞 যোগাযোগ</h3>
      <p>গোপনীয়তা সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: <a href="mailto:privacy@speakeu.com">privacy@speakeu.com</a></p>
      
      <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 10px;">
        <h4>⚖️ আপনার অধিকার</h4>
        <ul>
          <li>আপনার ডেটা দেখার অধিকার</li>
          <li>আপনার ডেটা সংশোধনের অধিকার</li>
          <li>আপনার ডেটা মুছে ফেলার অধিকার</li>
          <li>আপনার ডেটা পোর্ট করার অধিকার</li>
        </ul>
      </div>
    </div>
  `;
  closeSideMenu();
}

function showFavoritesPage() {
  hideHomePage();
  hideError();
  
  let favoritesHtml = `
    <div class="page-content">
      <h2>❤️ ফেভারিট তালিকা</h2>
      <div class="favorites-overview">
  `;
  
  let totalFavorites = 0;
  for (const [lang, items] of Object.entries(favorites)) {
    if (items.length > 0) {
      totalFavorites += items.length;
      const langName = getLanguageName(lang);
      favoritesHtml += `
        <div class="favorite-lang-section">
          <h3>${langName}: ${items.length} টি আইটেম</h3>
          <button onclick="loadLanguage('${lang}')" class="control-btn">দেখুন</button>
        </div>
      `;
    }
  }
  
  if (totalFavorites === 0) {
    favoritesHtml += `
      <div class="no-favorites" style="text-align: center; padding: 40px;">
        <h3>কোনো ফেভারিট আইটেম নেই</h3>
        <p>একটি ভাষা নির্বাচন করে কিছু শব্দ ফেভারিট করুন।</p>
      </div>
    `;
  } else {
    favoritesHtml += `
      <div style="margin-top: 30px;">
        <h3>📊 পরিসংখ্যান</h3>
        <p>মোট ফেভারিট: <strong>${totalFavorites}</strong> টি</p>
        <p>ভাষার সংখ্যা: <strong>${Object.keys(favorites).filter(lang => favorites[lang].length > 0).length}</strong> টি</p>
      </div>
    `;
  }
  
  favoritesHtml += `
      </div>
      <div style="margin-top: 30px;">
        <button onclick="exportFavorites()" class="control-btn">📤 সব ফেভারিট Export করুন</button>
        <button onclick="importFavorites()" class="control-btn">📥 ফেভারিট Import করুন</button>
      </div>
    </div>
  `;
  
  conversationArea.innerHTML = favoritesHtml;
  closeSideMenu();
}

// Helper function to get language name
function getLanguageName(langCode) {
  const langNames = {
    italy: '🇮🇹 ইতালি',
    spain: '🇪🇸 স্পেন',
    germany: '🇩🇪 জার্মানি',
    france: '🇫🇷 ফ্রান্স',
    russian: '🇷🇺 রাশিয়ান',
    portugal: '🇵🇹 পর্তুগাল',
    greece: '🇬🇷 গ্রিস',
    netherlands: '🇳🇱 নেদারল্যান্ডস',
    poland: '🇵🇱 পোল্যান্ড',
    austria: '🇦🇹 অস্ট্রিয়া',
    belgium: '🇧🇪 বেলজিয়াম',
    czech: '🇨🇿 চেক প্রজাতন্ত্র',
    denmark: '🇩🇰 ডেনমার্ক',
    estonia: '🇪🇪 এস্তোনিয়া',
    finland: '🇫🇮 ফিনল্যান্ড',
    hungary: '🇭🇺 হাঙ্গেরি',
    iceland: '🇮🇸 আইসল্যান্ড',
    latvia: '🇱🇻 লাটভিয়া',
    liechtenstein: '🇱🇮 লিচেনস্টাইন',
    lithuania: '🇱🇹 লিথুয়ানিয়া',
    luxembourg: '🇱🇺 লুক্সেমবার্গ',
    malta: '🇲🇹 মাল্টা',
    norway: '🇳🇴 নরওয়ে',
    slovakia: '🇸🇰 স্লোভাকিয়া',
    slovenia: '🇸🇮 স্লোভেনিয়া',
    sweden: '🇸🇪 সুইডেন',
    switzerland: '🇨🇭 সুইজারল্যান্ড',
    albania: '🇦🇱 আলবেনিয়া',
    andorra: '🇦🇩 আন্দোরা',
    armenia: '🇦🇲 আর্মেনিয়া',
    azerbaijan: '🇦🇿 আজারবাইজান',
    bosnia: '🇧🇦 বসনিয়া ও হার্জেগোভিনা',
    bulgaria: '🇧🇬 বুলগেরিয়া',
    croatia: '🇭🇷 ক্রোয়েশিয়া',
    cyprus: '🇨🇾 সাইপ্রাস',
    georgia: '🇬🇪 জর্জিয়া',
    ireland: '🇮🇪 আয়ারল্যান্ড',
    kosovo: '🇽🇰 কসোভো',
    moldova: '🇲🇩 মলদোভা',
    monaco: '🇲🇨 মোনাকো',
    montenegro: '🇲🇪 মন্টেনেগ্রো',
    northmacedonia: '🇲🇰 উত্তর মেসিডোনিয়া',
    romania: '🇷🇴 রোমানিয়া',
    sanmarino: '🇸🇲 সান মারিনো',
    serbia: '🇷🇸 সার্বিয়া',
    turkey: '🇹🇷 তুরস্ক',
    ukraine: '🇺🇦 ইউক্রেন',
    unitedkingdom: '🇬🇧 যুক্তরাজ্য',
    vatican: '🇻🇦 ভ্যাটিকান সিটি'
  };
  return langNames[langCode] || langCode;
}

// Close side menu
function closeSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu) {
    sideMenu.classList.remove('active');
  }
}

// Theme toggle
modeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Menu toggle functionality
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');

if (menuToggle && sideMenu) {
  menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
  });
}

// Close menu button
const closeMenu = document.getElementById('close-menu');
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
