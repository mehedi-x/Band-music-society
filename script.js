// Global Variables
let currentLanguage = null;
let currentPage = 1;
const itemsPerPage = 12;
let allConversations = [];
let filteredConversations = [];
let selectedConversations = new Set();
let folders = JSON.parse(localStorage.getItem('speakEuFolders')) || [];
let languageCache = {};

// European Countries Configuration
const europeanCountries = [
    { code: 'albania', name: 'আলবেনিয়া', flag: '🇦🇱', langKey: 'sq', speakers: '৬ মিলিয়ন' },
    { code: 'andorra', name: 'আন্দোরা', flag: '🇦🇩', langKey: 'ca', speakers: '৮০ হাজার' },
    { code: 'austria', name: 'অস্ট্রিয়া', flag: '🇦🇹', langKey: 'de', speakers: '৯ মিলিয়ন' },
    { code: 'belarus', name: 'বেলারুশ', flag: '🇧🇾', langKey: 'be', speakers: '৮ মিলিয়ন' },
    { code: 'belgium', name: 'বেলজিয়াম', flag: '🇧🇪', langKey: 'nl', speakers: '১১ মিলিয়ন' },
    { code: 'bosnia', name: 'বসনিয়া', flag: '🇧🇦', langKey: 'bs', speakers: '৩ মিলিয়ন' },
    { code: 'bulgaria', name: 'বুলগেরিয়া', flag: '🇧🇬', langKey: 'bg', speakers: '৭ মিলিয়ন' },
    { code: 'croatia', name: 'ক্রোয়েশিয়া', flag: '🇭🇷', langKey: 'hr', speakers: '৪ মিলিয়ন' },
    { code: 'cyprus', name: 'সাইপ্রাস', flag: '🇨🇾', langKey: 'el', speakers: '১ মিলিয়ন' },
    { code: 'czech', name: 'চেক প্রজাতন্ত্র', flag: '🇨🇿', langKey: 'cs', speakers: '১০ মিলিয়ন' },
    { code: 'denmark', name: 'ডেনমার্ক', flag: '🇩🇰', langKey: 'da', speakers: '৬ মিলিয়ন' },
    { code: 'estonia', name: 'এস্তোনিয়া', flag: '🇪🇪', langKey: 'et', speakers: '১ মিলিয়ন' },
    { code: 'finland', name: 'ফিনল্যান্ড', flag: '🇫🇮', langKey: 'fi', speakers: '৫ মিলিয়ন' },
    { code: 'france', name: 'ফ্রান্স', flag: '🇫🇷', langKey: 'fr', speakers: '৬৭ মিলিয়ন' },
    { code: 'germany', name: 'জার্মানি', flag: '🇩🇪', langKey: 'de', speakers: '৮৩ মিলিয়ন' },
    { code: 'greece', name: 'গ্রিস', flag: '🇬🇷', langKey: 'el', speakers: '১১ মিলিয়ন' },
    { code: 'hungary', name: 'হাঙ্গেরি', flag: '🇭🇺', langKey: 'hu', speakers: '১০ মিলিয়ন' },
    { code: 'iceland', name: 'আইসল্যান্ড', flag: '🇮🇸', langKey: 'is', speakers: '৩৮০ হাজার' },
    { code: 'ireland', name: 'আয়ারল্যান্ড', flag: '🇮🇪', langKey: 'ga', speakers: '৫ মিলিয়ন' },
    { code: 'italy', name: 'ইতালি', flag: '🇮🇹', langKey: 'it', speakers: '৬০ মিলিয়ন' },
    { code: 'latvia', name: 'লাতভিয়া', flag: '🇱🇻', langKey: 'lv', speakers: '২ মিলিয়ন' },
    { code: 'liechtenstein', name: 'লিখটেনস্টাইন', flag: '🇱🇮', langKey: 'de', speakers: '৩৮ হাজার' },
    { code: 'lithuania', name: 'লিথুয়ানিয়া', flag: '🇱🇹', langKey: 'lt', speakers: '৩ মিলিয়ন' },
    { code: 'luxembourg', name: 'লুক্সেমবার্গ', flag: '🇱🇺', langKey: 'lb', speakers: '৬৩০ হাজার' },
    { code: 'malta', name: 'মাল্টা', flag: '🇲🇹', langKey: 'mt', speakers: '৫০০ হাজার' },
    { code: 'moldova', name: 'মলদোভা', flag: '🇲🇩', langKey: 'ro', speakers: '৩ মিলিয়ন' },
    { code: 'monaco', name: 'মোনাকো', flag: '🇲🇨', langKey: 'fr', speakers: '৩৯ হাজার' },
    { code: 'montenegro', name: 'মন্টিনিগ্রো', flag: '🇲🇪', langKey: 'cnr', speakers: '৬৩০ হাজার' },
    { code: 'netherlands', name: 'নেদারল্যান্ডস', flag: '🇳🇱', langKey: 'nl', speakers: '১৭ মিলিয়ন' },
    { code: 'north_macedonia', name: 'উত্তর ম্যাসিডোনিয়া', flag: '🇲🇰', langKey: 'mk', speakers: '২ মিলিয়ন' },
    { code: 'norway', name: 'নরওয়ে', flag: '🇳🇴', langKey: 'no', speakers: '৫ মিলিয়ন' },
    { code: 'poland', name: 'পোল্যান্ড', flag: '🇵🇱', langKey: 'pl', speakers: '৩৮ মিলিয়ন' },
    { code: 'portugal', name: 'পর্তুগাল', flag: '🇵🇹', langKey: 'pt', speakers: '১০ মিলিয়ন' },
    { code: 'romania', name: 'রোমানিয়া', flag: '🇷🇴', langKey: 'ro', speakers: '১৯ মিলিয়ন' },
    { code: 'russia', name: 'রাশিয়া', flag: '🇷🇺', langKey: 'ru', speakers: '১৪৪ মিলিয়ন' },
    { code: 'san_marino', name: 'সান মারিনো', flag: '🇸🇲', langKey: 'it', speakers: '৩৪ হাজার' },
    { code: 'serbia', name: 'সার্বিয়া', flag: '🇷🇸', langKey: 'sr', speakers: '৭ মিলিয়ন' },
    { code: 'slovakia', name: 'স্লোভাকিয়া', flag: '🇸🇰', langKey: 'sk', speakers: '৫ মিলিয়ন' },
    { code: 'slovenia', name: 'স্লোভেনিয়া', flag: '🇸🇮', langKey: 'sl', speakers: '২ মিলিয়ন' },
    { code: 'spain', name: 'স্পেন', flag: '🇪🇸', langKey: 'es', speakers: '৪৭ মিলিয়ন' },
    { code: 'sweden', name: 'সুইডেন', flag: '🇸🇪', langKey: 'sv', speakers: '১০ মিলিয়ন' },
    { code: 'switzerland', name: 'সুইজারল্যান্ড', flag: '🇨🇭', langKey: 'de', speakers: '৯ মিলিয়ন' },
    { code: 'ukraine', name: 'ইউক্রেন', flag: '🇺🇦', langKey: 'uk', speakers: '৪১ মিলিয়ন' },
    { code: 'united_kingdom', name: 'যুক্তরাজ্য', flag: '🇬🇧', langKey: 'en', speakers: '৬৭ মিলিয়ন' },
    { code: 'vatican', name: 'ভ্যাটিকান', flag: '🇻🇦', langKey: 'la', speakers: '৮০০' }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    generateLanguageTabs();
    loadSavedTheme();
});

// Generate Language Tabs
function generateLanguageTabs() {
    const tabsContainer = document.getElementById('languageTabs');
    tabsContainer.innerHTML = '';
    
    europeanCountries.forEach(country => {
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab-btn';
        tabBtn.dataset.lang = country.code;
        tabBtn.innerHTML = `
            ${country.flag} ${country.name}
            <span class="lang-count" id="count-${country.code}">0</span>
        `;
        
        tabBtn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                selectLanguage(country.code);
            }
        });
        
        tabsContainer.appendChild(tabBtn);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchConversations(e.target.value);
    });
    
    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    
    // Folder modal
    document.getElementById('folderBtn').addEventListener('click', openFolderModal);
    document.getElementById('closeModal').addEventListener('click', closeFolderModal);
    
    // Save modal
    document.getElementById('saveSelectedBtn').addEventListener('click', openSaveModal);
    document.getElementById('closeSaveModal').addEventListener('click', closeSaveModal);
    document.getElementById('confirmSave').addEventListener('click', saveToFolder);
    document.getElementById('cancelSave').addEventListener('click', closeSaveModal);
    
    // Folder actions
    document.getElementById('createFolderBtn').addEventListener('click', createFolder);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
    
    // Retry button
    document.getElementById('retryBtn').addEventListener('click', () => {
        if (currentLanguage) {
            loadLanguage(currentLanguage);
        }
    });
}

// Load Language Data
async function loadLanguage(langCode) {
    try {
        showLoading(true);
        hideError();
        
        // Check cache first
        if (languageCache[langCode]) {
            allConversations = languageCache[langCode];
            filteredConversations = [...allConversations];
            updateUI();
            showLoading(false);
            return;
        }
        
        // Set loading state for tab
        const tabBtn = document.querySelector(`[data-lang="${langCode}"]`);
        if (tabBtn) {
            tabBtn.classList.add('loading');
        }
        
        // Load from JSON file
        const response = await fetch(`languages/${langCode}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the data
        languageCache[langCode] = data;
        allConversations = data;
        filteredConversations = [...allConversations];
        
        // Update UI
        updateUI();
        updateLanguageCount(langCode, data.length);
        
        const country = europeanCountries.find(c => c.code === langCode);
        showToast(`${country.name} সফলভাবে লোড হয়েছে!`);
        
    } catch (error) {
        console.error('Error loading language:', error);
        showError();
        showToast('ডেটা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
        showLoading(false);
        
        // Remove loading state from tab
        const tabBtn = document.querySelector(`[data-lang="${langCode}"]`);
        if (tabBtn) {
            tabBtn.classList.remove('loading');
        }
    }
}

// Select Language
function selectLanguage(langCode) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const selectedTab = document.querySelector(`[data-lang="${langCode}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    currentLanguage = langCode;
    
    // Update language info
    const country = europeanCountries.find(c => c.code === langCode);
    document.getElementById('currentLanguageName').textContent = `${country.name} ভাষা`;
    document.getElementById('languageDescription').textContent = `${country.name} এর জাতীয় ভাষা`;
    document.getElementById('speakersCount').textContent = country.speakers;
    
    // Load language data
    loadLanguage(langCode);
    
    currentPage = 1;
    selectedConversations.clear();
    updateSelectedCount();
}

// Search Function
function searchConversations(query) {
    if (!query.trim()) {
        filteredConversations = [...allConversations];
    } else {
        const searchTerm = query.toLowerCase();
        filteredConversations = allConversations.filter(conv => {
            const langKey = europeanCountries.find(c => c.code === currentLanguage)?.langKey || 'text';
            return (
                (conv[langKey] && conv[langKey].toLowerCase().includes(searchTerm)) ||
                (conv.bn && conv.bn.toLowerCase().includes(searchTerm)) ||
                (conv.bnMeaning && conv.bnMeaning.toLowerCase().includes(searchTerm)) ||
                (conv.en && conv.en.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    currentPage = 1;
    displayConversations();
    updatePagination();
}

// Display Conversations
function displayConversations() {
    const container = document.getElementById('conversationList');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageConversations = filteredConversations.slice(startIndex, endIndex);
    
    if (pageConversations.length === 0) {
        container.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>কোনো কথোপকথন পাওয়া যায়নি</p></div>';
        return;
    }
    
    container.innerHTML = '';
    
    pageConversations.forEach((conv, index) => {
        const globalIndex = startIndex + index;
        const card = createConversationCard(conv, globalIndex + 1);
        container.appendChild(card);
    });
}

// Create Conversation Card
function createConversationCard(conv, number) {
    const card = document.createElement('div');
    card.className = 'conversation-card';
    card.dataset.index = number - 1;
    
    if (selectedConversations.has(number - 1)) {
        card.classList.add('selected');
    }
    
    const country = europeanCountries.find(c => c.code === currentLanguage);
    const langKey = country?.langKey || 'text';
    
    card.innerHTML = `
        <div class="conversation-number">${number}</div>
        <div class="conversation-text">
            <div class="original-text">${conv[langKey] || 'N/A'}</div>
            <div class="pronunciation">${conv.bn || 'উচ্চারণ পাওয়া যায়নি'}</div>
            <div class="meaning">${conv.bnMeaning || 'অর্থ পাওয়া যায়নি'}</div>
            <div class="english-text">${conv.en || 'English not available'}</div>
        </div>
        <div class="conversation-actions">
            <button class="action-btn copy-btn" title="কপি">
                <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn play-btn" title="শুনুন">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `;
    
    // Card click to select
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.conversation-actions')) {
            toggleSelection(this);
        }
    });
    
    // Copy button
    card.querySelector('.copy-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(conv);
    });
    
    // Play button
    card.querySelector('.play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playAudio(conv[langKey] || '');
    });
    
    return card;
}

// Toggle Selection
function toggleSelection(card) {
    const index = parseInt(card.dataset.index);
    
    if (selectedConversations.has(index)) {
        selectedConversations.delete(index);
        card.classList.remove('selected');
    } else {
        selectedConversations.add(index);
        card.classList.add('selected');
    }
    
    updateSelectedCount();
}

// Update Selected Count
function updateSelectedCount() {
    const count = selectedConversations.size;
    const saveBtn = document.getElementById('saveSelectedBtn');
    const countEl = document.getElementById('selectedCount');
    
    countEl.textContent = count;
    saveBtn.style.display = count > 0 ? 'flex' : 'none';
}

// Copy to Clipboard
function copyToClipboard(conv) {
    const country = europeanCountries.find(c => c.code === currentLanguage);
    const langKey = country?.langKey || 'text';
    const text = `${conv[langKey] || 'N/A'}\n${conv.bn || ''}\n${conv.bnMeaning || ''}\n${conv.en || ''}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        showToast('কপি হয়েছে!');
    } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('কপি হয়েছে!');
    }
}

// Play Audio
function playAudio(text) {
    if ('speechSynthesis' in window && text) {
        const utterance = new SpeechSynthesisUtterance(text);
        const country = europeanCountries.find(c => c.code === currentLanguage);
        if (country && country.langKey) {
            utterance.lang = country.langKey === 'en' ? 'en-US' : `${country.langKey}-${country.langKey.toUpperCase()}`;
        }
        speechSynthesis.speak(utterance);
        showToast('উচ্চারণ চালু...');
    } else {
        showToast('আপনার ব্রাউজার উচ্চারণ সমর্থন করে না');
    }
}

// Pagination
function changePage(direction) {
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayConversations();
        updatePagination();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = `পৃষ্ঠা ${currentPage} / ${totalPages}`;
}

// Update Language Count
function updateLanguageCount(langCode, count) {
    const countEl = document.getElementById(`count-${langCode}`);
    if (countEl) {
        countEl.textContent = count;
    }
    
    const currentCountEl = document.getElementById('currentLanguageCount');
    if (currentCountEl && langCode === currentLanguage) {
        currentCountEl.textContent = count;
    }
}

// Update UI
function updateUI() {
    displayConversations();
    updatePagination();
    if (currentLanguage) {
        updateLanguageCount(currentLanguage, allConversations.length);
    }
}

// Show Loading
function showLoading(show) {
    const loading = document.getElementById('loadingIndicator');
    loading.style.display = show ? 'block' : 'none';
}

// Show Error
function showError() {
    document.getElementById('errorMessage').style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    const themeBtn = document.getElementById('themeBtn');
    
    themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('speakEuTheme', isDark ? 'dark' : 'light');
    
    showToast(isDark ? 'ডার্ক মোড চালু' : 'লাইট মোড চালু');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('speakEuTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('themeBtn').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Modal Functions
function openFolderModal() {
    document.getElementById('folderModal').classList.add('active');
    displayFolders();
}

function closeFolderModal() {
    document.getElementById('folderModal').classList.remove('active');
}

function openSaveModal() {
    document.getElementById('saveModal').classList.add('active');
    updateFolderSelect();
}

function closeSaveModal() {
    document.getElementById('saveModal').classList.remove('active');
}

// Folder Management
function displayFolders() {
    const folderList = document.getElementById('folderList');
    
    if (folders.length === 0) {
        folderList.innerHTML = '<div class="no-results">কোনো ফোল্ডার নেই</div>';
        return;
    }
    
    folderList.innerHTML = '';
    
    folders.forEach((folder, index) => {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.innerHTML = `
            <div class="folder-info">
                <i class="fas fa-folder"></i>
                <span>${folder.name} (${folder.conversations.length})</span>
            </div>
            <div class="folder-actions-small">
                <button class="action-btn" onclick="deleteFolder(${index})" title="মুছুন">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        folderList.appendChild(folderItem);
    });
}

function createFolder() {
    const name = prompt('ফোল্ডারের নাম লিখুন:');
    if (name && name.trim()) {
        folders.push({
            name: name.trim(),
            conversations: [],
            createdAt: new Date().toISOString()
        });
        saveFolders();
        displayFolders();
        showToast('ফোল্ডার তৈরি হয়েছে!');
    }
}

function deleteFolder(index) {
    if (confirm('ফোল্ডার মুছে ফেলবেন?')) {
        folders.splice(index, 1);
        saveFolders();
        displayFolders();
        showToast('ফোল্ডার মুছে ফেলা হয়েছে');
    }
}

function updateFolderSelect() {
    const select = document.getElementById('folderSelect');
    select.innerHTML = '<option value="">ফোল্ডার নির্বাচন করুন</option>';
    
    folders.forEach((folder, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = folder.name;
        select.appendChild(option);
    });
}

function saveToFolder() {
    const folderIndex = document.getElementById('folderSelect').value;
    const newFolderName = document.getElementById('newFolderName').value.trim();
    
    let targetFolder;
    
    if (newFolderName) {
        // Create new folder
        targetFolder = {
            name: newFolderName,
            conversations: [],
            createdAt: new Date().toISOString()
        };
        folders.push(targetFolder);
    } else if (folderIndex !== '') {
        // Use existing folder
        targetFolder = folders[parseInt(folderIndex)];
    } else {
        showToast('ফোল্ডার নির্বাচন করুন বা নতুন ফোল্ডার তৈরি করুন');
        return;
    }
    
    // Add selected conversations
    const selectedConvs = Array.from(selectedConversations).map(index => filteredConversations[index]);
    targetFolder.conversations.push(...selectedConvs);
    
    saveFolders();
    selectedConversations.clear();
    updateSelectedCount();
    displayConversations();
    closeSaveModal();
    
    document.getElementById('newFolderName').value = '';
    document.getElementById('folderSelect').value = '';
    
    showToast(`${selectedConvs.length}টি কথোপকথন সংরক্ষিত হয়েছে!`);
}

function saveFolders() {
    localStorage.setItem('speakEuFolders', JSON.stringify(folders));
}

// Export Data
function exportData() {
    const data = {
        folders: folders,
        exportDate: new Date().toISOString(),
        language: currentLanguage
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `speak-eu-folders-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('ডেটা এক্সপোর্ট হয়েছে!');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Global function for delete folder (needed for onclick)
window.deleteFolder = deleteFolder;
