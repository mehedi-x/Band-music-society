// Global Variables
let currentLanguage = 'russian';
let currentPage = 1;
const itemsPerPage = 12;
let allConversations = [];
let filteredConversations = [];
let selectedConversations = new Set();
let folders = JSON.parse(localStorage.getItem('speakEuFolders')) || [];
let languageCache = {};

// Language Configuration
const languageConfig = {
    russian: {
        name: 'রাশিয়ান ভাষা',
        description: 'ইউরোপের পূর্বাঞ্চলীয় ভাষা - রাশিয়া, বেলারুশ, কাজাখস্তানে ব্যবহৃত',
        speakers: '২৮০ মিলিয়ন ভাষাভাষী',
        file: 'russian.json',
        key: 'ru'
    },
    german: {
        name: 'জার্মান ভাষা',
        description: 'পশ্চিম ইউরোপের প্রধান ভাষা - জার্মানি, অস্ট্রিয়া, সুইজারল্যান্ডে ব্যবহৃত',
        speakers: '১০০ মিলিয়ন ভাষাভাষী',
        file: 'german.json',
        key: 'de'
    },
    french: {
        name: 'ফরাসি ভাষা',
        description: 'রোমান্স ভাষা - ফ্রান্স, বেলজিয়াম, সুইজারল্যান্ড, কানাডায় ব্যবহৃত',
        speakers: '২৮০ মিলিয়ন ভাষাভাষী',
        file: 'french.json',
        key: 'fr'
    },
    spanish: {
        name: 'স্প্যানিশ ভাষা',
        description: 'রোমান্স ভাষা - স্পেন এবং ল্যাটিন আমেরিকায় ব্যবহৃত',
        speakers: '৫০০ মিলিয়ন ভাষাভাষী',
        file: 'spanish.json',
        key: 'es'
    },
    italian: {
        name: 'ইতালিয়ান ভাষা',
        description: 'রোমান্স ভাষা - ইতালি, সান মারিনো, ভ্যাটিকানে ব্যবহৃত',
        speakers: '৬৫ মিলিয়ন ভাষাভাষী',
        file: 'italian.json',
        key: 'it'
    },
    portuguese: {
        name: 'পর্তুগিজ ভাষা',
        description: 'রোমান্স ভাষা - পর্তুগাল, ব্রাজিল, আঙ্গোলায় ব্যবহৃত',
        speakers: '২৬০ মিলিয়ন ভাষাভাষী',
        file: 'portuguese.json',
        key: 'pt'
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadLanguage('russian'); // Load default language
    loadSavedTheme();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchConversations(e.target.value);
    });
    
    // Language tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                selectLanguage(this.dataset.lang);
            }
        });
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
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });
    document.getElementById('importFileInput').addEventListener('change', importData);
    
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
    
    // Retry button
    document.getElementById('retryBtn').addEventListener('click', () => {
        loadLanguage(currentLanguage);
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
        const response = await fetch(`languages/${languageConfig[langCode].file}`);
        
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
        
        showToast(`${languageConfig[langCode].name} সফলভাবে লোড হয়েছে!`);
        
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
    if (langCode === currentLanguage) return;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-lang="${langCode}"]`).classList.add('active');
    
    currentLanguage = langCode;
    currentPage = 1;
    selectedConversations.clear();
    
    // Update language info
    updateLanguageInfo(langCode);
    
    // Load language data
    loadLanguage(langCode);
    
    updateSelectedCount();
}

// Update Language Info
function updateLanguageInfo(langCode) {
    const config = languageConfig[langCode];
    document.getElementById('currentLanguageName').textContent = config.name;
    document.getElementById('languageDescription').textContent = config.description;
    
    const speakersElement = document.querySelector('.language-stats .stat:last-child span');
    if (speakersElement) {
        speakersElement.textContent = config.speakers;
    }
}

// Update Language Count
function updateLanguageCount(langCode, count) {
    const countElement = document.getElementById(`count-${langCode}`);
    if (countElement) {
        countElement.textContent = count;
    }
    
    if (langCode === currentLanguage) {
        document.getElementById('currentLanguageCount').textContent = count;
    }
}

// Update UI
function updateUI() {
    displayConversations();
    updatePagination();
    updateLanguageCount(currentLanguage, allConversations.length);
}

// Show/Hide Loading
function showLoading(show) {
    const loadingElement = document.getElementById('loadingIndicator');
    loadingElement.style.display = show ? 'block' : 'none';
}

// Show/Hide Error
function showError() {
    document.getElementById('errorMessage').style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Search Function
function searchConversations(query) {
    if (!query.trim()) {
        filteredConversations = [...allConversations];
    } else {
        const searchTerm = query.toLowerCase();
        filteredConversations = allConversations.filter(conv => {
            const langKey = languageConfig[currentLanguage].key;
            return conv[langKey]?.toLowerCase().includes(searchTerm) ||
                   conv.bn?.toLowerCase().includes(searchTerm) ||
                   conv.bnMeaning?.toLowerCase().includes(searchTerm) ||
                   conv.en?.toLowerCase().includes(searchTerm);
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
    
    const langKey = languageConfig[currentLanguage].key;
    
    card.innerHTML = `
        <div class="conversation-number">${number}</div>
        <div class="conversation-text">
            <div class="original-text">${conv[langKey] || ''}</div>
            <div class="pronunciation">${conv.bn || ''}</div>
            <div class="meaning">${conv.bnMeaning || ''}</div>
            <div class="english-text">${conv.en || ''}</div>
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
        playAudio(conv[langKey]);
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
    const modalCountEl = document.getElementById('selectedCountModal');
    
    countEl.textContent = count;
    if (modalCountEl) modalCountEl.textContent = count;
    saveBtn.style.display = count > 0 ? 'flex' : 'none';
    
    updateSelectedPreview();
}

// Update Selected Preview
function updateSelectedPreview() {
    const previewContainer = document.getElementById('selectedPreview');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    if (selectedConversations.size === 0) {
        previewContainer.innerHTML = '<p>কোনো কথোপকথন নির্বাচিত নেই</p>';
        return;
    }
    
    const langKey = languageConfig[currentLanguage].key;
    
    Array.from(selectedConversations).slice(0, 5).forEach(index => {
        if (filteredConversations[index]) {
            const conv = filteredConversations[index];
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.textContent = `${index + 1}. ${conv[langKey]} - ${conv.bnMeaning}`;
            previewContainer.appendChild(previewItem);
        }
    });
    
    if (selectedConversations.size > 5) {
        const moreItem = document.createElement('div');
        moreItem.className = 'preview-item';
        moreItem.style.fontStyle = 'italic';
        moreItem.textContent = `এবং আরও ${selectedConversations.size - 5}টি...`;
        previewContainer.appendChild(moreItem);
    }
}

// Copy to Clipboard
function copyToClipboard(conv) {
    const langKey = languageConfig[currentLanguage].key;
    const text = `${conv[langKey]}\n${conv.bn}\n${conv.bnMeaning}\n${conv.en}`;
    
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
        
        // Set language based on current selection
        const langCodes = {
            'russian': 'ru-RU',
            'german': 'de-DE',
            'french': 'fr-FR',
            'spanish': 'es-ES',
            'italian': 'it-IT',
            'portuguese': 'pt-PT'
        };
        
        utterance.lang = langCodes[currentLanguage] || 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        showToast('উচ্চারণ চালু...');
    } else {
        showToast('আপনার ব্রাউজার উচ্চারণ সমর্থন করে না', 'warning');
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
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = totalPages > 0 ? `পৃষ্ঠা ${currentPage} / ${totalPages}` : 'পৃষ্ঠা ০';
}

// Theme Management
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
    if (selectedConversations.size === 0) {
        showToast('কোনো কথোপকথন নির্বাচিত নেই', 'warning');
        return;
    }
    
    document.getElementById('saveModal').classList.add('active');
    updateFolderSelect();
    updateSelectedPreview();
}

function closeSaveModal() {
    document.getElementById('saveModal').classList.remove('active');
    document.getElementById('newFolderName').value = '';
    document.getElementById('folderSelect').value = '';
}

// Folder Management
function displayFolders() {
    const folderList = document.getElementById('folderList');
    
    if (folders.length === 0) {
        folderList.innerHTML = '<div class="no-results"><i class="fas fa-folder-open"></i><p>কোনো ফোল্ডার নেই</p></div>';
        return;
    }
    
    folderList.innerHTML = '';
    
    folders.forEach((folder, index) => {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.innerHTML = `
            <div class="folder-info">
                <i class="fas fa-folder"></i>
                <div>
                    <div class="folder-name">${folder.name}</div>
                    <div class="folder-meta">${folder.conversations.length} কথোপকথন</div>
                </div>
            </div>
            <div class="folder-actions-small">
                <button class="action-btn" onclick="viewFolder(${index})" title="দেখুন">
                    <i class="fas fa-eye"></i>
                </button>
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
        const folder = {
            id: Date.now(),
            name: name.trim(),
            conversations: [],
            language: currentLanguage,
            createdAt: new Date().toISOString()
        };
        
        folders.push(folder);
        saveFolders();
        displayFolders();
        showToast('ফোল্ডার তৈরি হয়েছে!');
    }
}

function deleteFolder(index) {
    if (confirm(`"${folders[index].name}" ফোল্ডার মুছে ফেলবেন?`)) {
        folders.splice(index, 1);
        saveFolders();
        displayFolders();
        showToast('ফোল্ডার মুছে ফেলা হয়েছে');
    }
}

function viewFolder(index) {
    const folder = folders[index];
    // This would open a new view showing folder contents
    // For now, just show an alert
    alert(`ফোল্ডার: ${folder.name}\nকথোপকথন: ${folder.conversations.length}টি\nভাষা: ${languageConfig[folder.language]?.name || folder.language}`);
}

function updateFolderSelect() {
    const select = document.getElementById('folderSelect');
    select.innerHTML = '<option value="">ফোল্ডার নির্বাচন করুন</option>';
    
    folders.forEach((folder, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${folder.name} (${folder.conversations.length})`;
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
            id: Date.now(),
            name: newFolderName,
            conversations: [],
            language: currentLanguage,
            createdAt: new Date().toISOString()
        };
        folders.push(targetFolder);
    } else if (folderIndex !== '') {
        // Use existing folder
        targetFolder = folders[parseInt(folderIndex)];
    } else {
        showToast('ফোল্ডার নির্বাচন করুন বা নতুন ফোল্ডার তৈরি করুন', 'warning');
        return;
    }
    
    // Add selected conversations
    const selectedConvs = Array.from(selectedConversations).map(index => {
        return {
            ...filteredConversations[index],
            savedAt: new Date().toISOString(),
            language: currentLanguage
        };
    });
    
    targetFolder.conversations.push(...selectedConvs);
    
    saveFolders();
    selectedConversations.clear();
    updateSelectedCount();
    displayConversations();
    closeSaveModal();
    
    showToast(`${selectedConvs.length}টি কথোপকথন "${targetFolder.name}" ফোল্ডারে সংরক্ষিত হয়েছে!`);
}

function saveFolders() {
    localStorage.setItem('speakEuFolders', JSON.stringify(folders));
}

// Import/Export Functions
function exportData() {
    const data = {
        folders: folders,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        totalConversations: folders.reduce((total, folder) => total + folder.conversations.length, 0)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `speak-eu-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('ডেটা এক্সপোর্ট সম্পন্ন!');
}

function importData() {
    const fileInput = document.getElementById('importFileInput');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.folders && Array.isArray(data.folders)) {
                const importCount = data.folders.length;
                folders.push(...data.folders);
                saveFolders();
                displayFolders();
                showToast(`${importCount}টি ফোল্ডার ইমপোর্ট হয়েছে!`);
            } else {
                showToast('অবৈধ ফাইল ফরম্যাট', 'error');
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast('ফাইল পড়তে সমস্যা হয়েছে', 'error');
        }
    };
    
    reader.readAsText(file);
    fileInput.value = ''; // Reset input
}

// Toast Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Remove existing classes
    toast.classList.remove('show', 'error', 'warning');
    
    // Set message and type
    toastMessage.textContent = message;
    if (type !== 'success') {
        toast.classList.add(type);
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD');
}

// Global functions for onclick handlers
window.viewFolder = viewFolder;
window.deleteFolder = deleteFolder;
