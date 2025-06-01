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
    
    if (elements.confirmOk) {
        elements.confirmOk.addEventListener('click', function() {
            if (elements.confirmModal.confirmCallback) {
                elements.confirmModal.confirmCallback();
            }
        });
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
    
    // Cancel speech synthesis
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
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
            setTimeout(playNext, 800); // Pause between lines
        });
    }
    
    playNext();
}

function playText(text, speed = 1, callback = null) {
    if (!text) return;
    
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on current country
        const languageMap = {
            'german': 'de-DE',
            'french': 'fr-FR',
            'spanish': 'es-ES',
            'italian': 'it-IT',
            'dutch': 'nl-NL',
            'portuguese': 'pt-PT'
        };
        
        const languageKey = getLanguageKey(currentCountry);
        utterance.lang = languageMap[languageKey] || 'en-US';
        utterance.rate = speed;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = function() {
            if (callback) callback();
        };
        
        utterance.onerror = function() {
            showToast('অডিও প্লে করতে সমস্যা হয়েছে', 'error');
            if (callback) callback();
        };
        
        speechSynthesis.speak(utterance);
    } else {
        showToast('আপনার ব্রাউজার অডিও সাপোর্ট করে না', 'warning');
        if (callback) callback();
    }
}

/* ================================
   PROGRESS MANAGEMENT
================================ */

function markConversationLearned() {
    const conversationId = elements.conversationModal?.dataset.conversationId;
    if (!conversationId) return;
    
    const conversation = currentConversations.find(c => c.id == conversationId);
    if (!conversation) return;
    
    const isLearned = userProgress.conversationsCompleted.includes(parseInt(conversationId));
    
    if (isLearned) {
        // Remove from learned
        userProgress.conversationsCompleted = userProgress.conversationsCompleted.filter(id => id !== parseInt(conversationId));
        userProgress.totalLearned = Math.max(0, userProgress.totalLearned - 1);
        showToast('কথোপকথনটি আবার শেখার তালিকায় যোগ করা হয়েছে', 'info');
    } else {
        // Mark as learned
        userProgress.conversationsCompleted.push(parseInt(conversationId));
        userProgress.totalLearned++;
        
        // Update streak
        updateDailyProgress();
        
        showToast('অভিনন্দন! কথোপকথনটি সম্পন্ন হয়েছে 🎉', 'success');
        
        // Check for achievements
        checkAchievements();
    }
    
    // Update button
    updateMarkLearnedButton(conversation);
    
    // Update progress display
    updateProgressDisplay();
    
    // Re-render conversations list
    renderConversations();
    
    // Save data
    saveUserData();
}

function updateDailyProgress() {
    const today = new Date().toDateString();
    
    // Update last active date
    if (userProgress.lastActiveDate !== today) {
        userProgress.lastActiveDate = today;
        
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userProgress.lastActiveDate === yesterday.toDateString()) {
            userProgress.currentStreak++;
        } else {
            userProgress.currentStreak = 1;
        }
        
        userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.currentStreak);
    }
}

function updateStreakStatus() {
    const today = new Date().toDateString();
    const lastActive = userProgress.lastActiveDate;
    
    if (lastActive) {
        const lastActiveDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastActiveDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
            // Streak broken
            userProgress.currentStreak = 0;
        }
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
    
    // Update progress cards
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
        const hours = Math.floor((userProgress.totalTimeSpent || 0) / 60);
        const minutes = (userProgress.totalTimeSpent || 0) % 60;
        elements.timeSpent.textContent = hours > 0 ? `${hours} ঘন্টা ${minutes} মিনিট` : `${minutes} মিনিট`;
    }
}

function getTodayLearnedCount() {
    const today = new Date().toDateString();
    if (userProgress.lastActiveDate === today) {
        // This is a simplified calculation
        // In a real app, you'd track daily completions separately
        return Math.min(userProgress.totalLearned, userSettings.dailyGoal || 10);
    }
    return 0;
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
    
    // Show new achievement notifications
    newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
            showAchievementNotification(achievement);
        }, index * 2000);
    });
    
    if (newAchievements.length > 0) {
        saveUserData();
    }
}

function showAchievementNotification(achievement) {
    showToast(`🏆 নতুন অর্জন আনলক: ${achievement.name}!`, 'success', 5000);
}

function renderAchievements() {
    if (!elements.achievementsGrid) return;
    
    elements.achievementsGrid.innerHTML = '';
    
    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        const isUnlocked = achievements.includes(achievement.id);
        const badge = createAchievementBadge(achievement, isUnlocked);
        elements.achievementsGrid.appendChild(badge);
    });
}

function createAchievementBadge(achievement, isUnlocked) {
    const badge = document.createElement('div');
    badge.className = `achievement-badge ${isUnlocked ? 'unlocked' : ''}`;
    
    badge.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${isUnlocked ? '<div class="achievement-status">✓ আনলক</div>' : '<div class="achievement-status">🔒 লক</div>'}
    `;
    
    return badge;
}

/* ================================
   WEEKLY CHART
================================ */

function renderWeeklyChart() {
    if (!elements.weeklyChart) return;
    
    elements.weeklyChart.innerHTML = '';
    
    // Generate last 7 days data
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক', 'শনি'];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const dayName = days[date.getDay()];
        const isToday = i === 0;
        
        // Simulate some data (in real app, you'd track daily progress)
        const progress = isToday ? getTodayLearnedCount() : Math.floor(Math.random() * 15);
        const maxHeight = 150;
        const height = Math.max(20, (progress / 20) * maxHeight);
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${height}px`;
        bar.dataset.day = dayName;
        bar.dataset.count = progress;
        bar.title = `${dayName}: ${progress}টি কথোপকথন`;
        
        if (isToday) {
            bar.classList.add('today');
        }
        
        elements.weeklyChart.appendChild(bar);
    }
}

/* ================================
   SETTINGS MANAGEMENT
================================ */

function updateDailyGoal() {
    const goal = parseInt(elements.dailyGoalSelect.value);
    userSettings.dailyGoal = goal;
    updateProgressDisplay();
    saveUserData();
    showToast(`দৈনিক লক্ষ্য ${goal}টি কথোপকথনে সেট করা হয়েছে`, 'success');
}

function updateAudioSpeed() {
    const speed = parseFloat(elements.audioSpeedSelect.value);
    userSettings.audioSpeed = speed;
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
                showToast('নোটিফিকেশন অনুমতি দেওয়া হয়েছে', 'success');
            } else {
                showToast('নোটিফিকেশন অনুমতি প্রয়োজন', 'warning');
                userSettings.notifications = false;
                elements.notificationToggle.checked = false;
                saveUserData();
            }
        });
    }
}

/* ================================
   DATA EXPORT/IMPORT
================================ */

function exportUserData() {
    const data = {
        userProgress,
        userSettings,
        achievements,
        currentCountry,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
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
    
    // Update displays
    updateProgressDisplay();
    renderCountries();
    renderAchievements();
    renderWeeklyChart();
    
    closeConfirmModal();
    showToast('সমস্ত অগ্রগতি রিসেট করা হয়েছে', 'success');
}

/* ================================
   MODAL MANAGEMENT
================================ */

function showConfirmModal(title, message, onConfirm) {
    if (!elements.confirmModal) return;
    
    if (elements.confirmTitle) {
        elements.confirmTitle.textContent = title;
    }
    
    if (elements.confirmMessage) {
        elements.confirmMessage.textContent = message;
    }
    
    // Store confirm callback
    elements.confirmModal.dataset.onConfirm = 'true';
    elements.confirmModal.confirmCallback = onConfirm;
    
    elements.confirmModal.classList.add('show');
}

function closeConfirmModal() {
    if (elements.confirmModal) {
        elements.confirmModal.classList.remove('show');
        delete elements.confirmModal.confirmCallback;
    }
}

/* ================================
   TOAST NOTIFICATIONS
================================ */

function showToast(message, type = 'info', duration = 4000) {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
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
    
    elements.toastContainer.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
    
    // Add click to dismiss
    toast.addEventListener('click', () => toast.remove());
}

/* ================================
   KEYBOARD SHORTCUTS
================================ */

function handleKeyboardShortcuts(event) {
    // Don't trigger shortcuts when typing in inputs
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
            event.preventDefault();
            if (elements.conversationModal.classList.contains('show')) {
                playCurrentConversation();
            }
            break;
        case 'Enter':
            if (elements.conversationModal.classList.contains('show')) {
                markConversationLearned();
            }
            break;
        case 'm':
        case 'M':
            toggleSidebar();
            break;
        case 't':
        case 'T':
            toggleTheme();
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

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours} ঘন্টা ${mins} মিনিট`;
    }
    return `${mins} মিনিট`;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/* ================================
   AUTO-SAVE AND CLEANUP
================================ */

// Auto-save every 30 seconds
setInterval(() => {
    saveUserData();
}, 30000);

// Track time spent
let sessionStartTime = Date.now();
setInterval(() => {
    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
    userProgress.totalTimeSpent = (userProgress.totalTimeSpent || 0) + 1;
}, 60000); // Every minute

console.log('🇪🇺 ইউরো কথা অ্যাপ লোড হয়েছে! ইউরোপীয় ভাষা শেখার যাত্রা শুরু করুন!');
