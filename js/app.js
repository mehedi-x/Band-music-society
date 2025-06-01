/* ================================
   GLOBAL VARIABLES
================================ */

let currentCountry = null;
let currentCategory = 'all';
let currentConversations = [];
let userProgress = {};
let userSettings = {};
let achievements = [];
let audioPlayer = null;

/* ================================
   DOM ELEMENTS
================================ */

const elements = {
    // Loading
    loadingScreen: document.getElementById('loading-screen'),
    
    // Header
    menuBtn: document.getElementById('menu-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    progressText: document.getElementById('progress-text'),
    progressFill: document.getElementById('progress-fill'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    closeSidebar: document.getElementById('close-sidebar'),
    navItems: document.querySelectorAll('.nav-item'),
    dailyCount: document.getElementById('daily-count'),
    dailyTarget: document.getElementById('daily-target'),
    
    // Content sections
    homeSection: document.getElementById('home-section'),
    conversationsSection: document.getElementById('conversations-section'),
    progressSection: document.getElementById('progress-section'),
    settingsSection: document.getElementById('settings-section'),
    
    // Home
    countrySearch: document.getElementById('country-search'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    countriesGrid: document.getElementById('countries-grid'),
    
    // Conversations
    backToCountries: document.getElementById('back-to-countries'),
    selectedCountryFlag: document.getElementById('selected-country-flag'),
    selectedCountryName: document.getElementById('selected-country-name'),
    selectedCountryLanguage: document.getElementById('selected-country-language'),
    categoriesGrid: document.getElementById('categories-grid'),
    conversationsList: document.getElementById('conversations-list'),
    
    // Progress
    totalLearned: document.getElementById('total-learned'),
    currentStreak: document.getElementById('current-streak'),
    countriesLearned: document.getElementById('countries-learned'),
    timeSpent: document.getElementById('time-spent'),
    achievementsGrid: document.getElementById('achievements-grid'),
    weeklyChart: document.getElementById('weekly-chart'),
    
    // Settings
    dailyGoalSelect: document.getElementById('daily-goal-select'),
    audioSpeedSelect: document.getElementById('audio-speed-select'),
    autoPlayToggle: document.getElementById('auto-play-toggle'),
    notificationToggle: document.getElementById('notification-toggle'),
    exportDataBtn: document.getElementById('export-data-btn'),
    resetProgressBtn: document.getElementById('reset-progress-btn'),
    
    // Modal
    conversationModal: document.getElementById('conversation-modal'),
    conversationTitle: document.getElementById('conversation-title'),
    conversationScenario: document.getElementById('conversation-scenario'),
    conversationContent: document.getElementById('conversation-content'),
    closeModal: document.getElementById('close-modal'),
    playConversation: document.getElementById('play-conversation'),
    slowPlay: document.getElementById('slow-play'),
    markLearned: document.getElementById('mark-learned'),
    repeatPlay: document.getElementById('repeat-play'),
    
    // Confirm Modal
    confirmModal: document.getElementById('confirm-modal'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    confirmCancel: document.getElementById('confirm-cancel'),
    confirmOk: document.getElementById('confirm-ok'),
    
    // Toast
    toastContainer: document.getElementById('toast-container'),
    
    // Audio
    audioPlayer: document.getElementById('audio-player')
};

/* ================================
   INITIALIZATION
================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Show loading screen
        showLoadingScreen();
        
        // Initialize data
        await loadUserData();
        initializeSettings();
        initializeAudio();
        
        // Setup event listeners
        setupEventListeners();
        
        // Render initial content
        renderCountries();
        updateProgressDisplay();
        
        // Hide loading screen
        setTimeout(() => {
            hideLoadingScreen();
            showToast('স্বাগতম! ইউরোপীয় ভাষা শেখা শুরু করুন 🎉', 'success');
        }, 1500);
        
    } catch (error) {
        console.error('অ্যাপ শুরু করতে সমস্যা:', error);
        hideLoadingScreen();
        showToast('অ্যাপ লোড করতে সমস্যা হয়েছে', 'error');
    }
}

function showLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('hidden');
    }
}

/* ================================
   EVENT LISTENERS
================================ */

function setupEventListeners() {
    // Header events
    if (elements.menuBtn) {
        elements.menuBtn.addEventListener('click', toggleSidebar);
    }
    
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Sidebar events
    if (elements.closeSidebar) {
        elements.closeSidebar.addEventListener('click', closeSidebar);
    }
    
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Navigation events
    elements.navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
            closeSidebar();
        });
    });
    
    // Search events
    if (elements.countrySearch) {
        elements.countrySearch.addEventListener('input', debounce(handleCountrySearch, 300));
    }
    
    // Filter events
    elements.filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setActiveFilter(this);
            const filter = this.dataset.filter;
            filterCountries(filter);
        });
    });
    
    // Conversation section events
    if (elements.backToCountries) {
        elements.backToCountries.addEventListener('click', () => switchSection('home'));
    }
    
    // Modal events
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeConversationModal);
    }
    
    if (elements.conversationModal) {
        elements.conversationModal.addEventListener('click', function(e) {
            if (e.target === this) closeConversationModal();
        });
    }
    
    // Conversation control events
    if (elements.playConversation) {
        elements.playConversation.addEventListener('click', playCurrentConversation);
    }
    
    if (elements.slowPlay) {
        elements.slowPlay.addEventListener('click', () => playCurrentConversation(0.75));
    }
    
    if (elements.repeatPlay) {
        elements.repeatPlay.addEventListener('click', () => playCurrentConversation(1, true));
    }
    
    if (elements.markLearned) {
        elements.markLearned.addEventListener('click', markConversationLearned);
    }
    
    // Settings events
    if (elements.dailyGoalSelect) {
        elements.dailyGoalSelect.addEventListener('change', updateDailyGoal);
    }
    
    if (elements.audioSpeedSelect) {
        elements.audioSpeedSelect.addEventListener('change', updateAudioSpeed);
    }
    
    if (elements.autoPlayToggle) {
        elements.autoPlayToggle.addEventListener('change', updateAutoPlay);
    }
    
    if (elements.notificationToggle) {
        elements.notificationToggle.addEventListener('change', updateNotifications);
    }
    
    if (elements.exportDataBtn) {
        elements.exportDataBtn.addEventListener('click', exportUserData);
    }
    
    if (elements.resetProgressBtn) {
        elements.resetProgressBtn.addEventListener('click', confirmResetProgress);
    }
    
    // Confirm modal events
    if (elements.confirmCancel) {
        elements.confirmCancel.addEventListener('click', closeConfirmModal);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window events
    window.addEventListener('beforeunload', saveUserData);
}

/* ================================
   DATA MANAGEMENT
================================ */

async function loadUserData() {
    try {
        // Load user progress
        const savedProgress = localStorage.getItem(STORAGE_KEYS.userProgress);
        userProgress = savedProgress ? JSON.parse(savedProgress) : {
            totalLearned: 0,
            currentStreak: 0,
            longestStreak: 0,
            countriesStarted: [],
            conversationsCompleted: [],
            lastActiveDate: null,
            totalTimeSpent: 0
        };
        
        // Load settings
        const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
        userSettings = savedSettings ? JSON.parse(savedSettings) : { ...DEFAULT_SETTINGS };
        
        // Load achievements
        const savedAchievements = localStorage.getItem(STORAGE_KEYS.achievements);
        achievements = savedAchievements ? JSON.parse(savedAchievements) : [];
        
        // Load selected country
        const savedCountry = localStorage.getItem(STORAGE_KEYS.selectedCountry);
        if (savedCountry && COUNTRIES_DATA[savedCountry]) {
            currentCountry = savedCountry;
        }
        
        // Check and update streak
        updateStreakStatus();
        
    } catch (error) {
        console.error('ডেটা লোড করতে সমস্যা:', error);
        // Initialize with defaults if loading fails
        userProgress = {
            totalLearned: 0,
            currentStreak: 0,
            longestStreak: 0,
            countriesStarted: [],
            conversationsCompleted: [],
            lastActiveDate: null,
            totalTimeSpent: 0
        };
        userSettings = { ...DEFAULT_SETTINGS };
        achievements = [];
    }
}

function saveUserData() {
    try {
        localStorage.setItem(STORAGE_KEYS.userProgress, JSON.stringify(userProgress));
        localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(userSettings));
        localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
        if (currentCountry) {
            localStorage.setItem(STORAGE_KEYS.selectedCountry, currentCountry);
        }
    } catch (error) {
        console.error('ডেটা সেভ করতে সমস্যা:', error);
    }
}

function initializeSettings() {
    // Apply theme
    const theme = userSettings.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    // Update settings UI
    if (elements.dailyGoalSelect) {
        elements.dailyGoalSelect.value = userSettings.dailyGoal || 10;
    }
    
    if (elements.audioSpeedSelect) {
        elements.audioSpeedSelect.value = userSettings.audioSpeed || 1;
    }
    
    if (elements.autoPlayToggle) {
        elements.autoPlayToggle.checked = userSettings.autoPlay !== false;
    }
    
    if (elements.notificationToggle) {
        elements.notificationToggle.checked = userSettings.notifications === true;
    }
}

function initializeAudio() {
    audioPlayer = elements.audioPlayer;
    if (audioPlayer) {
        audioPlayer.addEventListener('error', function() {
            showToast('অডিও প্লে করতে সমস্যা হয়েছে', 'error');
        });
    }
}

/* ================================
   NAVIGATION
================================ */

function toggleSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.toggle('open');
    }
}

function closeSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.remove('open');
    }
}

function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav item
    elements.navItems.forEach(item => item.classList.remove('active'));
    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Load section-specific content
    switch(sectionName) {
        case 'conversations':
            if (currentCountry) {
                loadConversationsForCountry(currentCountry);
            } else {
                showToast('প্রথমে একটি দেশ নির্বাচন করুন', 'warning');
                switchSection('home');
            }
            break;
        case 'progress':
            updateProgressDisplay();
            renderAchievements();
            renderWeeklyChart();
            break;
        case 'settings':
            // Settings are already initialized
            break;
    }
}

/* ================================
   THEME MANAGEMENT
================================ */

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    userSettings.theme = newTheme;
    updateThemeIcon(newTheme);
    saveUserData();
    
    showToast(`${newTheme === 'dark' ? 'ডার্ক' : 'লাইট'} থিম সক্রিয় করা হয়েছে`, 'success');
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/* ================================
   COUNTRIES RENDERING
================================ */

function renderCountries() {
    if (!elements.countriesGrid) return;
    
    const countries = Object.entries(COUNTRIES_DATA);
    elements.countriesGrid.innerHTML = '';
    
    countries.forEach(([code, data]) => {
        const countryCard = createCountryCard(code, data);
        elements.countriesGrid.appendChild(countryCard);
    });
}

function createCountryCard(code, data) {
    const card = document.createElement('div');
    card.className = `country-card ${currentCountry === code ? 'selected' : ''}`;
    card.dataset.country = code;
    
    // Check if user has started this country
    const hasStarted = userProgress.countriesStarted.includes(code);
    
    card.innerHTML = `
        <div class="country-flag">${data.flag}</div>
        <div class="country-name">${data.name}</div>
        <div class="country-language">${data.language}</div>
        <div class="country-features">
            ${data.isSchengen ? '<span class="feature-tag schengen">শেনজেন</span>' : ''}
            <span class="feature-tag difficulty-${data.difficulty}">${getDifficultyText(data.difficulty)}</span>
            ${hasStarted ? '<span class="feature-tag">শুরু করেছেন</span>' : ''}
        </div>
    `;
    
    card.addEventListener('click', () => selectCountry(code));
    
    return card;
}

function getDifficultyText(difficulty) {
    const difficultyMap = {
        'easy': 'সহজ',
        'medium': 'মাঝারি',
        'hard': 'কঠিন'
    };
    return difficultyMap[difficulty] || 'মাঝারি';
}

function selectCountry(countryCode) {
    if (!COUNTRIES_DATA[countryCode]) return;
    
    currentCountry = countryCode;
    const countryData = COUNTRIES_DATA[countryCode];
    
    // Update visual selection
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-country="${countryCode}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Track that user started this country
    if (!userProgress.countriesStarted.includes(countryCode)) {
        userProgress.countriesStarted.push(countryCode);
        saveUserData();
    }
    
    // Update conversations section
    updateSelectedCountryDisplay(countryData);
    
    showToast(`${countryData.name} নির্বাচিত হয়েছে! কথোপকথন দেখতে ক্লিক করুন`, 'success');
    
    // Auto-switch to conversations after a delay
    setTimeout(() => {
        switchSection('conversations');
    }, 1000);
}

function updateSelectedCountryDisplay(countryData) {
    if (elements.selectedCountryFlag) {
        elements.selectedCountryFlag.textContent = countryData.flag;
    }
    
    if (elements.selectedCountryName) {
        elements.selectedCountryName.textContent = countryData.name;
    }
    
    if (elements.selectedCountryLanguage) {
        elements.selectedCountryLanguage.textContent = `${countryData.language} ভাষা`;
    }
}

/* ================================
   SEARCH AND FILTERING
================================ */

function handleCountrySearch() {
    const query = elements.countrySearch.value.toLowerCase().trim();
    const countryCards = document.querySelectorAll('.country-card');
    
    countryCards.forEach(card => {
        const countryCode = card.dataset.country;
        const countryData = COUNTRIES_DATA[countryCode];
        
        const searchText = `${countryData.name} ${countryData.language} ${countryData.capital}`.toLowerCase();
        
        if (searchText.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setActiveFilter(activeTab) {
    elements.filterTabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
}

function filterCountries(filter) {
    const countryCards = document.querySelectorAll('.country-card');
    
    countryCards.forEach(card => {
        const countryCode = card.dataset.country;
        const countryData = COUNTRIES_DATA[countryCode];
        let show = true;
        
        switch(filter) {
            case 'popular':
                show = countryData.isPopular === true;
                break;
            case 'schengen':
                show = countryData.isSchengen === true;
                break;
            case 'easy':
                show = countryData.difficulty === 'easy';
                break;
            case 'all':
            default:
                show = true;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

/* ================================
   CONVERSATIONS MANAGEMENT
================================ */

function loadConversationsForCountry(countryCode) {
    if (!COUNTRIES_DATA[countryCode]) return;
    
    // Render categories
    renderCategories();
    
    // Load conversations for this country
    const languageKey = getLanguageKey(countryCode);
    currentConversations = [];
    
    // Add sample conversations
    if (SAMPLE_CONVERSATIONS[languageKey]) {
        Object.entries(SAMPLE_CONVERSATIONS[languageKey]).forEach(([category, conversations]) => {
            currentConversations.push(...conversations.map(conv => ({
                ...conv,
                category: category,
                language: languageKey,
                country: countryCode
            })));
        });
    }
    
    // Generate additional conversations
    Object.keys(CONVERSATION_CATEGORIES).forEach(category => {
        const generated = generateConversations(languageKey, category, 20);
        currentConversations.push(...generated);
    });
    
    // Render conversations
    renderConversations();
}

function getLanguageKey(countryCode) {
    // Map countries to language keys
    const languageMap = {
        'germany': 'german',
        'austria': 'german',
        'switzerland': 'german',
        'france': 'french',
        'belgium': 'french',
        'luxembourg': 'french',
        'spain': 'spanish',
        'italy': 'italian',
        'netherlands': 'dutch',
        'portugal': 'portuguese'
    };
    
    return languageMap[countryCode] || 'german';
}

function renderCategories() {
    if (!elements.categoriesGrid) return;
    
    elements.categoriesGrid.innerHTML = '';
    
    Object.entries(CONVERSATION_CATEGORIES).forEach(([key, category]) => {
        const categoryCard = createCategoryCard(key, category);
        elements.categoriesGrid.appendChild(categoryCard);
    });
}

function createCategoryCard(key, category) {
    const card = document.createElement('div');
    card.className = `category-card ${currentCategory === key ? 'active' : ''}`;
    card.dataset.category = key;
    
    const count = currentConversations.filter(conv => conv.category === key).length;
    
    card.innerHTML = `
        <div class="category-icon">${category.icon}</div>
        <div class="category-name">${category.name}</div>
        <div class="category-count">${count}টি কথোপকথন</div>
    `;
    
    card.addEventListener('click', () => selectCategory(key));
    
    return card;
}

function selectCategory(categoryKey) {
    currentCategory = categoryKey;
    
    // Update active category
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`[data-category="${categoryKey}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    // Re-render conversations
    renderConversations();
}

function renderConversations() {
    if (!elements.conversationsList) return;
    
    let conversationsToShow = currentConversations;
    
    // Filter by category if not 'all'
    if (currentCategory !== 'all') {
        conversationsToShow = currentConversations.filter(conv => conv.category === currentCategory);
    }
    
    elements.conversationsList.innerHTML = '';
    
    if (conversationsToShow.length === 0) {
        elements.conversationsList.innerHTML = `
            <div class="no-conversations">
                <h3>কোনো কথোপকথন পাওয়া যায়নি</h3>
                <p>অন্য ক্যাটাগরি ট্রাই করুন</p>
            </div>
        `;
        return;
    }
    
    conversationsToShow.forEach(conversation => {
        const conversationItem = createConversationItem(conversation);
        elements.conversationsList.appendChild(conversationItem);
    });
}

function createConversationItem(conversation) {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    item.dataset.conversationId = conversation.id;
    
    const isLearned = userProgress.conversationsCompleted.includes(conversation.id);
    const category = CONVERSATION_CATEGORIES[conversation.category];
    
    item.innerHTML = `
        <div class="conversation-header">
            <div class="conversation-scenario">
                <h4>${conversation.scenario}</h4>
                <p>${category ? category.name : 'সাধারণ'}</p>
            </div>
            <div class="conversation-status">
                ${isLearned ? '<span class="status-badge learned">শিখেছি ✓</span>' : '<span class="status-badge">নতুন</span>'}
            </div>
        </div>
        <div class="conversation-preview">
            "${conversation.dialogue && conversation.dialogue[0] ? conversation.dialogue[0].text : 'কথোপকথন দেখতে ক্লিক করুন'}"
        </div>
    `;
    
    item.addEventListener('click', () => openConversationModal(conversation));
    
    return item;
}

/* ================================
   CONVERSATION MODAL
================================ */

function openConversationModal(conversation) {
    if (!elements.conversationModal) return;
    
    // Set modal content
    if (elements.conversationTitle) {
        elements.conversationTitle.textContent = conversation.scenario;
    }
    
    if (elements.conversationScenario) {
        const category = CONVERSATION_CATEGORIES[conversation.category];
        elements.conversationScenario.textContent = `পরিস্থিতি: ${conversation.scenario}`;
    }
    
    // Render conversation dialogue
    renderConversationDialogue(conversation);
    
    // Update mark learned button
    updateMarkLearnedButton(conversation);
    
    // Store current conversation for controls
    elements.conversationModal.dataset.conversationId = conversation.id;
    
    // Show modal
    elements.conversationModal.classList.add('show');
    
    // Auto-play if enabled
    if (userSettings.autoPlay) {
        setTimeout(() => playCurrentConversation(), 500);
    }
}

function renderConversationDialogue(conversation) {
    if (!elements.conversationContent || !conversation.dialogue) return;
    
    elements.conversationContent.innerHTML = '';
    
    conversation.dialogue.forEach((line, index) => {
        const dialogueItem = document.createElement('div');
        dialogueItem.className = `dialogue-item ${line.speaker === 'you' ? 'user' : 'other'}`;
        
        dialogueItem.innerHTML = `
            <div class="dialogue-text">
                <strong>${line.text}</strong>
                <button class="play-line-btn" data-text="${line.text}" data-index="${index}">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="dialogue-bengali">${line.bengali}</div>
        `;
        
        // Add click event for individual line playback
        const playBtn = dialogueItem.querySelector('.play-line-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playText(line.text, userSettings.audioSpeed || 1);
        });
        
        elements.conversationContent.appendChild(dialogueItem);
    });
}

function updateMarkLearnedButton(conversation) {
    if (!elements.markLearned) return;
    
    const isLearned = userProgress.conversationsCompleted.includes(conversation.id);
    
    if (isLearned) {
        elements.markLearned.innerHTML = '<i class="fas fa-undo"></i><span>আবার শিখুন</span>';
        elements.markLearned.classList.add('learned');
    } else {
        elements.markLearned.innerHTML = '<i class="fas fa-check"></i><span>শিখেছি</span>';
        elements.markLearned.classList.remove('learned');
    }
}

function closeConversationModal() {
    if (elements.conversationModal) {
        elements.conversationModal.classList.remove('show');
    }
    
    // Stop any playing audio
    if (audioPlayer) {
        audioPlayer.pause();
    }
}

/* ================================
   AUDIO PLAYBACK
================================ */

function playCurrentConversation(speed = null, repeat = false) {
    const conversationId = elements.conversationModal?.dataset.conversationId;
    if (!conversationId) return;
    
    const conversation = currentConversations.find(c => c.id == conversationId);
    if (!conversation || !conversation.dialogue) return;
    
    const playbackSpeed = speed || userSettings.audioSpeed || 1;
    
    // Collect all text to speak
    const textsToSpeak = conversation.dialogue.map(line => line.text);
    
    // Play sequence
    playTextSequence(textsToSpeak, playbackSpeed, repeat);
}

function playTextSequence(texts, speed = 1, repeat = false) {
    if (!texts || texts.length === 0) return;
    
    let currentIndex = 0;
    
    function playNext() {
        if (currentIndex >= texts.length) {
            if (repeat) {
                currentIndex = 0;
            } else {
                return;
            }
        }
        
        playText(texts[currentIndex], speed, () => {
            currentIndex++;
            setTimeout(playNext, 500); // Pause between lines
        });
    }
    
    playNext();
}

function playText(text, speed = 1, callback = null) {
    if (!text || !window.speechSynthesis) {
        if (callback) callback();
        return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to set appropriate language
    const languageMap = {
        'german': 'de-DE',
        'french': 'fr-FR',
        'spanish': 'es-ES',
        'italian': 'it-IT',
        'dutch': 'nl-NL',
        'portuguese': 'pt-PT'
    };
    
    const currentLanguage = getLanguageKey(currentCountry);
    utterance.lang = languageMap[currentLanguage] || 'en-US';
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (callback) {
        utterance.onend = callback;
    }
    
    utterance.onerror = function(error) {
        console.error('Speech synthesis error:', error);
        if (callback) callback();
    };
    
    window.speechSynthesis.speak(utterance);
}

/* ================================
   PROGRESS TRACKING
================================ */

function markConversationLearned() {
    const conversationId = elements.conversationModal?.dataset.conversationId;
    if (!conversationId) return;
    
    const conversation = currentConversations.find(c => c.id == conversationId);
    if (!conversation) return;
    
    const isCurrentlyLearned = userProgress.conversationsCompleted.includes(parseInt(conversationId));
    
    if (isCurrentlyLearned) {
        // Remove from learned
        userProgress.conversationsCompleted = userProgress.conversationsCompleted.filter(id => id !== parseInt(conversationId));
        userProgress.totalLearned = Math.max(0, userProgress.totalLearned - 1);
        showToast('কথোপকথনটি আবার শেখার তালিকায় যোগ করা হয়েছে', 'info');
    } else {
        // Mark as learned
        userProgress.conversationsCompleted.push(parseInt(conversationId));
        userProgress.totalLearned++;
        
        // Update daily progress
        updateDailyProgress();
        
        // Check achievements
        checkAchievements();
        
        showToast('অভিনন্দন! কথোপকথনটি শেখা সম্পন্ন হয়েছে ✓', 'success');
    }
    
    // Update UI
    updateMarkLearnedButton(conversation);
    updateProgressDisplay();
    renderConversations(); // Refresh to show updated status
    saveUserData();
}

function updateDailyProgress() {
    const today = new Date().toDateString();
    
    if (userProgress.lastActiveDate !== today) {
        // New day - check streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userProgress.lastActiveDate === yesterday.toDateString()) {
            // Consecutive day - maintain streak
            userProgress.currentStreak++;
        } else {
            // Streak broken - reset
            userProgress.currentStreak = 1;
        }
        
        userProgress.lastActiveDate = today;
        
        // Update longest streak
        if (userProgress.currentStreak > userProgress.longestStreak) {
            userProgress.longestStreak = userProgress.currentStreak;
        }
    }
}

function updateStreakStatus() {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (userProgress.lastActiveDate && userProgress.lastActiveDate !== today && userProgress.lastActiveDate !== yesterday.toDateString()) {
        // More than 1 day gap - reset streak
        userProgress.currentStreak = 0;
    }
}

function updateProgressDisplay() {
    // Update header progress
    const dailyGoal = userSettings.dailyGoal || 10;
    const todayLearned = getTodayLearnedCount();
    
    if (elements.progressText) {
        elements.progressText.textContent = `${todayLearned}/${dailyGoal}`;
    }
    
    if (elements.progressFill) {
        const percentage = Math.min(100, (todayLearned / dailyGoal) * 100);
        elements.progressFill.style.width = `${percentage}%`;
    }
    
    // Update sidebar daily count
    if (elements.dailyCount) {
        elements.dailyCount.textContent = todayLearned;
    }
    
    if (elements.dailyTarget) {
        elements.dailyTarget.textContent = dailyGoal;
    }
    
    // Update progress section
    if (elements.totalLearned) {
        elements.totalLearned.textContent = userProgress.totalLearned || 0;
    }
    
    if (elements.currentStreak) {
        elements.currentStreak.textContent = userProgress.currentStreak || 0;
    }
    
    if (elements.countriesLearned) {
        elements.countriesLearned.textContent = userProgress.countriesStarted.length || 0;
    }
    
    if (elements.timeSpent) {
        const minutes = Math.floor((userProgress.totalTimeSpent || 0) / 60);
        elements.timeSpent.textContent = `${minutes} মিনিট`;
    }
}

function getTodayLearnedCount() {
    const today = new Date().toDateString();
    return userProgress.lastActiveDate === today ? userProgress.todayLearned || 0 : 0;
}

/* ================================
   ACHIEVEMENTS
================================ */

function checkAchievements() {
    const newAchievements = [];
    
    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        if (achievements.includes(achievement.id)) return; // Already unlocked
        
        let unlocked = false;
        
        switch(achievement.id) {
            case 'first_conversation':
                unlocked = userProgress.totalLearned >= 1;
                break;
            case 'ten_conversations':
                unlocked = userProgress.totalLearned >= 10;
                break;
            case 'weekly_streak':
                unlocked = userProgress.currentStreak >= 7;
                break;
            case 'polyglot':
                unlocked = userProgress.countriesStarted.length >= 3;
                break;
            case 'dedicated':
                unlocked = userProgress.totalLearned >= 100;
                break;
        }
        
        if (unlocked) {
            achievements.push(achievement.id);
            newAchievements.push(achievement);
        }
    });
    
    // Show new achievements
    newAchievements.forEach(achievement => {
        setTimeout(() => {
            showToast(`🏆 নতুন অর্জন আনলক: ${achievement.name}!`, 'success', 5000);
        }, 1000);
    });
    
    if (newAchievements.length > 0) {
        saveUserData();
    }
}

function renderAchievements() {
    if (!elements.achievementsGrid) return;
    
    elements.achievementsGrid.innerHTML = '';
    
    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        const isUnlocked = achievements.includes(achievement.id);
        
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-badge ${isUnlocked ? 'unlocked' : ''}`;
        
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        
        elements.achievementsGrid.appendChild(achievementElement);
    });
}

/* ================================
   WEEKLY CHART
================================ */

function renderWeeklyChart() {
    if (!elements.weeklyChart) return;
    
    elements.weeklyChart.innerHTML = '';
    
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
    const today = new Date();
    
    days.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.dataset.day = day;
        
        // Generate some sample data (in real app, use actual data)
        const height = Math.random() * 80 + 20;
        bar.style.height = `${height}%`;
        
        elements.weeklyChart.appendChild(bar);
    });
}

/* ================================
   SETTINGS MANAGEMENT
================================ */

function updateDailyGoal() {
    const newGoal = parseInt(elements.dailyGoalSelect.value);
    userSettings.dailyGoal = newGoal;
    updateProgressDisplay();
    saveUserData();
    showToast(`দৈনিক লক্ষ্য ${newGoal}টি কথোপকথনে সেট করা হয়েছে`, 'success');
}

function updateAudioSpeed() {
    const newSpeed = parseFloat(elements.audioSpeedSelect.value);
    userSettings.audioSpeed = newSpeed;
    saveUserData();
    showToast('অডিও গতি আপডেট করা হয়েছে', 'success');
}

function updateAutoPlay() {
    userSettings.autoPlay = elements.autoPlayToggle.checked;
    saveUserData();
    showToast(`অটো-প্লে ${userSettings.autoPlay ? 'চালু' : 'বন্ধ'} করা হয়েছে`, 'success');
}

function updateNotifications() {
    userSettings.notifications = elements.notificationToggle.checked;
    saveUserData();
    
    if (userSettings.notifications) {
        requestNotificationPermission();
    }
    
    showToast(`নোটিফিকেশন ${userSettings.notifications ? 'চালু' : 'বন্ধ'} করা হয়েছে`, 'success');
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('নোটিফিকেশনের অনুমতি দেওয়া হয়েছে', 'success');
            }
        });
    }
}

/* ================================
   DATA EXPORT/IMPORT
================================ */

function exportUserData() {
    const exportData = {
        userProgress,
        userSettings,
        achievements,
        currentCountry,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `euro-talk-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('ডেটা এক্সপোর্ট সম্পন্ন হয়েছে', 'success');
}

function confirmResetProgress() {
    showConfirmModal(
        'অগ্রগতি রিসেট করুন',
        'আপনি কি নিশ্চিত যে সমস্ত অগ্রগতি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
        resetProgress
    );
}

function resetProgress() {
    // Reset all progress data
    userProgress = {
        totalLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        countriesStarted: [],
        conversationsCompleted: [],
        lastActiveDate: null,
        totalTimeSpent: 0
    };
    
    achievements = [];
    currentCountry = null;
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.userProgress);
    localStorage.removeItem(STORAGE_KEYS.achievements);
    localStorage.removeItem(STORAGE_KEYS.selectedCountry);
    
    // Update UI
    updateProgressDisplay();
    renderCountries();
    renderAchievements();
    
    closeConfirmModal();
    showToast('সমস্ত অগ্রগতি রিসেট করা হয়েছে', 'success');
}

/* ================================
   MODAL MANAGEMENT
================================ */

function showConfirmModal(title, message, confirmCallback) {
    if (!elements.confirmModal) return;
    
    if (elements.confirmTitle) {
        elements.confirmTitle.textContent = title;
    }
    
    if (elements.confirmMessage) {
        elements.confirmMessage.textContent = message;
    }
    
    // Set up confirm callback
    const confirmHandler = () => {
        confirmCallback();
        elements.confirmOk.removeEventListener('click', confirmHandler);
    };
    
    elements.confirmOk.addEventListener('click', confirmHandler);
    
    // Show modal
    elements.confirmModal.classList.add('show');
}

function closeConfirmModal() {
    if (elements.confirmModal) {
        elements.confirmModal.classList.remove('show');
    }
}

/* ================================
   TOAST NOTIFICATIONS
================================ */

function showToast(message, type = 'info', duration = 4000) {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Style the toast
    toast.style.cssText = `
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        box-shadow: var(--shadow-lg);
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    elements.toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
}

/* ================================
   KEYBOARD SHORTCUTS
================================ */

function handleKeyboardShortcuts(event) {
    // Only handle shortcuts when not typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(event.key) {
        case 'Escape':
            closeConversationModal();
            closeConfirmModal();
            closeSidebar();
            break;
        case ' ':
            if (elements.conversationModal.classList.contains('show')) {
                event.preventDefault();
                playCurrentConversation();
            }
            break;
        case 'Enter':
            if (elements.conversationModal.classList.contains('show')) {
                event.preventDefault();
                markConversationLearned();
            }
            break;
    }
}

/* ================================
   UTILITY FUNCTIONS
================================ */

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

// Auto-save every 30 seconds
setInterval(saveUserData, 30000);

/* ================================
   CSS for Toast (Added to document)
================================ */

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        pointer-events: none;
    }
    
    .toast {
        pointer-events: all;
        margin-bottom: 12px;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
    }
    
    .toast-icon {
        font-size: 16px;
        flex-shrink: 0;
    }
    
    .toast-message {
        flex: 1;
        color: var(--text-primary);
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--text-muted);
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .toast-close:hover {
        background-color: var(--background-tertiary);
        color: var(--text-primary);
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--background-overlay);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .modal-overlay.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-container {
        background-color: var(--background-primary);
        border-radius: var(--radius-xl);
        max-width: 90vw;
        max-height: 90vh;
        width: 600px;
        box-shadow: var(--shadow-2xl);
        transform: scale(0.9);
        transition: transform 0.3s ease;
        overflow: hidden;
    }
    
    .modal-overlay.show .modal-container {
        transform: scale(1);
    }
    
    .modal-container.small {
        width: 400px;
    }
    
    .modal-header {
        padding: var(--spacing-xl);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--background-secondary);
    }
    
    .modal-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: var(--font-size-xl);
    }
    
    .modal-content {
        padding: var(--spacing-xl);
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .conversation-scenario {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background-color: var(--background-secondary);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-lg);
    }
    
    .scenario-icon {
        font-size: 1.5rem;
    }
    
    .conversation-content {
        margin-bottom: var(--spacing-xl);
    }
    
    .dialogue-item {
        margin-bottom: var(--spacing-lg);
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        position: relative;
    }
    
    .dialogue-item.user {
        background-color: var(--primary-light);
        margin-left: 40px;
    }
    
    .dialogue-item.other {
        background-color: var(--background-secondary);
        margin-right: 40px;
    }
    
    .dialogue-text {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
    }
    
    .dialogue-text strong {
        flex: 1;
        color: var(--text-primary);
        font-size: var(--font-size-lg);
    }
    
    .play-line-btn {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }
    
    .play-line-btn:hover {
        background-color: var(--primary-color);
        color: white;
        transform: scale(1.1);
    }
    
    .dialogue-bengali {
        color: var(--text-secondary);
        font-style: italic;
        font-size: var(--font-size-sm);
    }
    
    .conversation-controls {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        justify-content: center;
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--border-color);
    }
    
    .control-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-lg);
        background-color: var(--background-primary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-family-bangla);
        font-weight: 500;
        min-width: 120px;
        justify-content: center;
    }
    
    .control-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .control-btn.primary {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .control-btn.success {
        background-color: var(--success-color);
        color: white;
        border-color: var(--success-color);
    }
    
    .control-btn.success.learned {
        background-color: var(--warning-color);
        border-color: var(--warning-color);
    }
    
    .confirm-controls {
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
        margin-top: var(--spacing-lg);
    }
    
    .control-btn.warning {
        background-color: var(--error-color);
        color: white;
        border-color: var(--error-color);
    }
    
    @media (max-width: 768px) {
        .modal-container {
            width: 95vw;
            margin: 20px;
        }
        
        .conversation-controls {
            flex-direction: column;
        }
        
        .control-btn {
            width: 100%;
        }
        
        .dialogue-item.user {
            margin-left: 20px;
        }
        
        .dialogue-item.other {
            margin-right: 20px;
        }
    }
`;

document.head.appendChild(toastStyles);

console.log('✅ ইউরো কথা অ্যাপ সফলভাবে লোড হয়েছে!');
