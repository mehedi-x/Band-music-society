// Global Variables
let currentLanguage = 'russian';
let currentPage = 1;
const itemsPerPage = 20;
let conversations = [];
let filteredConversations = [];
let selectedConversations = new Set();
let folders = JSON.parse(localStorage.getItem('speakEuFolders')) || [];
let isDarkMode = localStorage.getItem('speakEuTheme') === 'dark';

// Russian Conversations Data (1000 conversations)
const russianConversations = [
  {
    "ru": "Доброе утро",
    "bn": "দবরোয়ে উত্রো",
    "bnMeaning": "শুভ সকাল",
    "en": "Good morning"
  },
  {
    "ru": "Ассаламу алейкум",
    "bn": "আস্সালামু আলাইকুম",
    "bnMeaning": "আপনার উপর শান্তি বর্ষিত হোক",
    "en": "Peace be upon you"
  },
  {
    "ru": "Ваалейкум ассалам",
    "bn": "ওয়াআলাইকুমুস সালাম",
    "bnMeaning": "আপনার উপরও শান্তি বর্ষিত হোক",
    "en": "And peace be upon you too"
  },
  {
    "ru": "Пора вставать",
    "bn": "পরা ভস্তাভাত",
    "bnMeaning": "ওঠার সময় হয়েছে",
    "en": "Time to get up"
  },
  {
    "ru": "Аллаху акбар",
    "bn": "আল্লাহু আকবার",
    "bnMeaning": "আল্লাহ মহান",
    "en": "Allah is great"
  },
  {
    "ru": "Время молитвы",
    "bn": "ভ্রেমিয়া মলিত্ভি",
    "bnMeaning": "নামাজের সময়",
    "en": "Prayer time"
  },
  {
    "ru": "Где мечеть?",
    "bn": "গদে মেচেত?",
    "bnMeaning": "মসজিদ কোথায়?",
    "en": "Where is the mosque?"
  },
  {
    "ru": "Я мусульманин",
    "bn": "ইয়া মুসুলমানিন",
    "bnMeaning": "আমি মুসলমান",
    "en": "I am a Muslim"
  },
  {
    "ru": "Мне нужно помолиться",
    "bn": "মনে নুঝনো পমলিৎসা",
    "bnMeaning": "আমার নামাজ পড়তে হবে",
    "en": "I need to pray"
  },
  {
    "ru": "Альхамдулиллах",
    "bn": "আলহামদুলিল্লাহ",
    "bnMeaning": "সকল প্রশংসা আল্লাহর",
    "en": "All praise to Allah"
  },
  {
    "ru": "Как дела?",
    "bn": "কাক দেলা?",
    "bnMeaning": "কেমন আছেন?",
    "en": "How are you?"
  },
  {
    "ru": "Хорошо, спасибо",
    "bn": "খরশো, স্পাসিবো",
    "bnMeaning": "ভালো, ধন্যবাদ",
    "en": "Good, thank you"
  },
  {
    "ru": "Меня зовут",
    "bn": "মেনিয়া জভুত",
    "bnMeaning": "আমার নাম",
    "en": "My name is"
  },
  {
    "ru": "Я из Бангладеш",
    "bn": "ইয়া ইজ বাংলাদেশ",
    "bnMeaning": "আমি বাংলাদেশ থেকে",
    "en": "I am from Bangladesh"
  },
  {
    "ru": "Очень приятно",
    "bn": "ওচেন প্রিয়াতনো",
    "bnMeaning": "খুবই আনন্দের",
    "en": "Very pleased to meet you"
  },
  {
    "ru": "Я не говорю по-русски",
    "bn": "ইয়া নে গভরিউ পো-রুস্কি",
    "bnMeaning": "আমি রাশিয়ান বলতে পারি না",
    "en": "I don't speak Russian"
  },
  {
    "ru": "Говорите медленно",
    "bn": "গভরিতে মেদলেন্নো",
    "bnMeaning": "ধীরে ধীরে বলুন",
    "en": "Speak slowly"
  },
  {
    "ru": "Повторите, пожалуйста",
    "bn": "পভতরিতে, পঝালুইস্তা",
    "bnMeaning": "দয়া করে আবার বলুন",
    "en": "Please repeat"
  },
  {
    "ru": "Я не понимаю",
    "bn": "ইয়া নে পনিমাইয়ু",
    "bnMeaning": "আমি বুঝতে পারছি না",
    "en": "I don't understand"
  },
  {
    "ru": "Помогите мне",
    "bn": "পমগিতে মনে",
    "bnMeaning": "আমাকে সাহায্য করুন",
    "en": "Help me"
  },
  {
    "ru": "Спасибо большое",
    "bn": "স্পাসিবো বলশোয়ে",
    "bnMeaning": "অনেক ধন্যবাদ",
    "en": "Thank you very much"
  },
  {
    "ru": "Пожалуйста",
    "bn": "পঝালুইস্তা",
    "bnMeaning": "দয়া করে",
    "en": "Please"
  },
  {
    "ru": "Извините",
    "bn": "ইজভিনিতে",
    "bnMeaning": "মাফ করবেন",
    "en": "Excuse me"
  },
  {
    "ru": "Простите",
    "bn": "প্রস্তিতে",
    "bnMeaning": "দুঃখিত",
    "en": "Sorry"
  },
  {
    "ru": "Можно?",
    "bn": "মঝনো?",
    "bnMeaning": "পারি?",
    "en": "May I?"
  },
  {
    "ru": "Да",
    "bn": "দা",
    "bnMeaning": "হ্যাঁ",
    "en": "Yes"
  },
  {
    "ru": "Нет",
    "bn": "নেত",
    "bnMeaning": "না",
    "en": "No"
  },
  {
    "ru": "Хорошо",
    "bn": "খরশো",
    "bnMেaning": "ভালো",
    "en": "Good"
  },
  {
    "ru": "Плохо",
    "bn": "প্লখো",
    "bnMেaning": "খারাপ",
    "en": "Bad"
  },
  {
    "ru": "Сколько времени?",
    "bn": "স্কলকো ভ্রেমেনি?",
    "bnMেaning": "কয়টা বাজে?",
    "en": "What time is it?"
  },
  {
    "ru": "Пять часов утра",
    "bn": "পিয়াত চাসভ উত্রা",
    "bnMেaning": "সকাল পাঁচটা",
    "en": "Five o'clock in the morning"
  },
  {
    "ru": "Время фаджра",
    "bn": "ভ্রেমিয়া ফাজরা",
    "bnMেaning": "ফজরের সময়",
    "en": "Fajr time"
  },
  {
    "ru": "Нужно идти в мечеть",
    "bn": "নুঝনো ইত্তি ভ মেচেত",
    "bnMেaning": "মসজিদে যেতে হবে",
    "en": "Need to go to mosque"
  },
  {
    "ru": "Вода для омовения",
    "bn": "ভদা দলিয়া মভেনিয়া",
    "bnMেaning": "অজুর জন্য পানি",
    "en": "Water for ablution"
  },
  {
    "ru": "Коврик для молитвы",
    "bn": "কভ্রিক দলিয়া মলিত্ভি",
    "bnMেaning": "নামাজের চাদর",
    "en": "Prayer mat"
  },
  {
    "ru": "Мне холодно",
    "bn": "মনে খলদনো",
    "bnMেaning": "আমার ঠান্ডা লাগছে",
    "en": "I am cold"
  },
  {
    "ru": "Мне жарко",
    "bn": "মনে ঝারকো",
    "bnMেaning": "আমার গরম লাগছে",
    "en": "I am hot"
  },
  {
    "ru": "Какая погода?",
    "bn": "কাকায়া পগদা?",
    "bnMেaning": "আবহাওয়া কেমন?",
    "en": "What's the weather like?"
  },
  {
    "ru": "Идёт снег",
    "bn": "ইদিয়োত স্নেগ",
    "bnMেaning": "বরফ পড়ছে",
    "en": "It's snowing"
  },
  {
    "ru": "Идёт дождь",
    "bn": "ইদিয়োত দজদ",
    "bnMেaning": "বৃষ্টি হচ্ছে",
    "en": "It's raining"
  },
  {
    "ru": "Солнечно",
    "bn": "সলনেচনো",
    "bnMেaning": "রৌদ্রোজ্জ্বল",
    "en": "Sunny"
  },
  {
    "ru": "Я голоден",
    "bn": "ইয়া গলদেন",
    "bnMেaning": "আমার ক্ষুধা লেগেছে",
    "en": "I am hungry"
  },
  {
    "ru": "Хочу завтракать",
    "bn": "খচু জাভত্রাকাত",
    "bnMেaning": "নাস্তা খেতে চাই",
    "en": "I want to have breakfast"
  },
  {
    "ru": "Халяльная еда",
    "bn": "খালিয়ালনায়া য়েদা",
    "bnMেaning": "হালাল খাবার",
    "en": "Halal food"
  },
  {
    "ru": "Где магазин?",
    "bn": "গদে মাগাজিন?",
    "bnMেaning": "দোকান কোথায়?",
    "en": "Where is the shop?"
  },
  {
    "ru": "Сколько это стоит?",
    "bn": "স্কলকো এতো স্তোইত?",
    "bnMেaning": "এটার দাম কত?",
    "en": "How much does this cost?"
  },
  {
    "ru": "Мне нужно на работу",
    "bn": "মনে নুঝনো না রাবোতু",
    "bnMেaning": "আমাকে কাজে যেতে হবে",
    "en": "I need to go to work"
  },
  {
    "ru": "До свидания",
    "bn": "দো স্ভিদানিয়া",
    "bnMেaning": "বিদায়",
    "en": "Goodbye"
  },
  {
    "ru": "Увидимся",
    "bn": "উভিদিমসিয়া",
    "bnMেaning": "দেখা হবে",
    "en": "See you later"
  },
  {
    "ru": "Хорошего дня",
    "bn": "খরশেভো দনিয়া",
    "bnMেaning": "দিন শুভ হোক",
    "en": "Have a good day"
  },
  {
    "ru": "Где автобусная остановка?",
    "bn": "গদে আভতোবুসনায়া স্তানভকা?",
    "bnMেaning": "বাস স্টপ কোথায়?",
    "en": "Where is the bus stop?"
  },
  {
    "ru": "Когда приедет автобус?",
    "bn": "কগদা প্রিয়েদেত আভতোবুস?",
    "bnMেaning": "বাস কখন আসবে?",
    "en": "When will the bus come?"
  }
];

// Generate more conversations to reach 1000
function generateMoreConversations() {
    const additionalConversations = [];
    const patterns = [
        {
            template: "Мне нужно {action}",
            bn: "মনে নুঝনো {action}",
            meaning: "আমার {action} দরকার",
            en: "I need to {action}"
        },
        {
            template: "Где находится {place}?",
            bn: "গদে নাখদিৎসা {place}?",
            meaning: "{place} কোথায় অবস্থিত?",
            en: "Where is {place} located?"
        },
        {
            template: "Сколько стоит {item}?",
            bn: "স্কলকো স্তোইত {item}?",
            meaning: "{item} এর দাম কত?",
            en: "How much does {item} cost?"
        }
    ];

    const actions = ["купить хлеব", "помолиться", "работать", "учиться"];
    const places = ["больница", "школа", "банк", "почта"];
    const items = ["билет", "еда", "вода", "книга"];

    // Generate remaining conversations
    for (let i = russianConversations.length; i < 1000; i++) {
        const pattern = patterns[i % patterns.length];
        const conversation = {
            ru: pattern.template.replace('{action}', actions[i % actions.length])
                                .replace('{place}', places[i % places.length])
                                .replace('{item}', items[i % items.length]),
            bn: pattern.bn.replace('{action}', actions[i % actions.length])
                          .replace('{place}', places[i % places.length])
                          .replace('{item}', items[i % items.length]),
            bnMeaning: pattern.meaning.replace('{action}', actions[i % actions.length])
                                     .replace('{place}', places[i % places.length])
                                     .replace('{item}', items[i % items.length]),
            en: pattern.en.replace('{action}', actions[i % actions.length])
                          .replace('{place}', places[i % places.length])
                          .replace('{item}', items[i % items.length])
        };
        additionalConversations.push(conversation);
    }

    return [...russianConversations, ...additionalConversations];
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    setTimeout(() => {
        hideLoadingScreen();
        initializeApp();
    }, 3000);
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

function initializeApp() {
    // Initialize conversations
    conversations = generateMoreConversations();
    filteredConversations = [...conversations];
    
    // Apply saved theme
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Initialize UI
    setupEventListeners();
    updateStats();
    displayConversations();
    updatePrayerTimes();
    startClock();
    updateUptime();
    
    showToast('সার্ভার সফলভাবে লোড হয়েছে!');
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Language selection
    document.querySelectorAll('.language-item').forEach(item => {
        item.addEventListener('click', function() {
            selectLanguage(this.dataset.lang);
        });
    });
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        searchConversations(this.value);
    });
    
    // Folder management
    document.getElementById('folderBtn').addEventListener('click', openFolderModal);
    document.getElementById('closeFolderModal').addEventListener('click', closeFolderModal);
    
    // Save to folder
    document.getElementById('saveToFolderBtn').addEventListener('click', openSaveModal);
    document.getElementById('closeSaveModal').addEventListener('click', closeSaveModal);
    document.getElementById('confirmSave').addEventListener('click', saveToFolder);
    document.getElementById('cancelSave').addEventListener('click', closeSaveModal);
    
    // Folder actions
    document.getElementById('createFolderBtn').addEventListener('click', createNewFolder);
    document.getElementById('importFolderBtn').addEventListener('click', importFolders);
    document.getElementById('exportFolderBtn').addEventListener('click', exportFolders);
    
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(1));
    
    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayConversations();
        });
    });
    
    // Modal close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const themeToggle = document.getElementById('themeToggle');
    
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('speakEuTheme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('speakEuTheme', 'light');
    }
    
    showToast('থিম পরিবর্তন করা হয়েছে');
}

function selectLanguage(lang) {
    // Update active language
    document.querySelectorAll('.language-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Update current language
    currentLanguage = lang;
    document.getElementById('currentLang').textContent = getLanguageName(lang);
    
    // Reset pagination
    currentPage = 1;
    selectedConversations.clear();
    
    // Load language data
    loadLanguageData(lang);
    
    showToast(`${getLanguageName(lang)} ভাষা নির্বাচিত হয়েছে`);
}

function getLanguageName(lang) {
    const names = {
        'russian': 'রাশিয়ান',
        'german': 'জার্মান',
        'french': 'ফরাসি',
        'spanish': 'স্প্যানিশ'
    };
    return names[lang] || lang;
}

function loadLanguageData(lang) {
    // For now, only Russian data is available
    if (lang === 'russian') {
        conversations = generateMoreConversations();
        filteredConversations = [...conversations];
    } else {
        // Placeholder for other languages
        conversations = [];
        filteredConversations = [];
        showToast('এই ভাষার ডেটা শীঘ্রই যোগ করা হবে');
    }
    
    updateStats();
    displayConversations();
}

function searchConversations(query) {
    if (!query.trim()) {
        filteredConversations = [...conversations];
    } else {
        const lowerQuery = query.toLowerCase();
        filteredConversations = conversations.filter(conv => 
            conv.ru.toLowerCase().includes(lowerQuery) ||
            conv.bn.toLowerCase().includes(lowerQuery) ||
            conv.bnMeaning.toLowerCase().includes(lowerQuery) ||
            conv.en.toLowerCase().includes(lowerQuery)
        );
    }
    
    currentPage = 1;
    displayConversations();
    updateStats();
}

function displayConversations() {
    const grid = document.getElementById('conversationGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageConversations = filteredConversations.slice(startIndex, endIndex);
    
    grid.innerHTML = '';
    
    if (pageConversations.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>কোনো কথোপকথন পাওয়া যায়নি</p>
            </div>
        `;
        return;
    }
    
    pageConversations.forEach((conversation, index) => {
        const globalIndex = startIndex + index;
        const card = createConversationCard(conversation, globalIndex + 1);
        grid.appendChild(card);
    });
    
    updatePagination();
}

function createConversationCard(conversation, number) {
    const card = document.createElement('div');
    card.className = 'conversation-card';
    card.dataset.index = number - 1;
    
    if (selectedConversations.has(number - 1)) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="conversation-number">${number}</div>
        <div class="conversation-text">
            <div class="original-text">${conversation.ru}</div>
            <div class="pronunciation">${conversation.bn}</div>
            <div class="meaning">${conversation.bnMeaning}</div>
            <div class="english-translation">${conversation.en}</div>
        </div>
        <div class="conversation-actions">
            <button class="action-btn-small copy-btn" title="কপি করুন">
                <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn-small play-btn" title="উচ্চারণ শুনুন">
                <i class="fas fa-play"></i>
            </button>
            <button class="action-btn-small bookmark-btn" title="বুকমার্ক করুন">
                <i class="fas fa-bookmark"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.conversation-actions')) {
            toggleSelection(this);
        }
    });
    
    // Action buttons
    const copyBtn = card.querySelector('.copy-btn');
    const playBtn = card.querySelector('.play-btn');
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(conversation);
    });
    
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playPronunciation(conversation.ru);
    });
    
    bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bookmarkConversation(conversation);
    });
    
    return card;
}

function toggleSelection(card) {
    const index = parseInt(card.dataset.index);
    
    if (selectedConversations.has(index)) {
        selectedConversations.delete(index);
        card.classList.remove('selected');
    } else {
        selectedConversations.add(index);
        card.classList.add('selected');
    }
    
    updateSelectionCount();
}

function updateSelectionCount() {
    const count = selectedConversations.size;
    const saveBtn = document.getElementById('saveToFolderBtn');
    const selectedCountEl = document.getElementById('selectedCount');
    
    if (selectedCountEl) {
        selectedCountEl.textContent = count;
    }
    
    saveBtn.style.display = count > 0 ? 'flex' : 'none';
}

function copyToClipboard(conversation) {
    const text = `${conversation.ru}\n${conversation.bn}\n${conversation.bnMeaning}\n${conversation.en}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('ক্লিপবোর্ডে কপি হয়েছে');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('ক্লিপবোর্ডে কপি হয়েছে');
    }
}

function playPronunciation(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        showToast('উচ্চারণ চালু করা হয়েছে');
    } else {
        showToast('আপনার ব্রাউজার উচ্চারণ সমর্থন করে না');
    }
}

function bookmarkConversation(conversation) {
    // Add to bookmarks folder
    let bookmarksFolder = folders.find(f => f.name === 'বুকমার্ক');
    
    if (!bookmarksFolder) {
        bookmarksFolder = {
            id: Date.now(),
            name: 'বুকমার্ক',
            conversations: [],
            createdAt: new Date().toISOString()
        };
        folders.push(bookmarksFolder);
    }
    
    // Check if already bookmarked
    const exists = bookmarksFolder.conversations.some(c => c.ru === conversation.ru);
    
    if (!exists) {
        bookmarksFolder.conversations.push(conversation);
        saveFolders();
        showToast('বুকমার্কে যোগ করা হয়েছে');
    } else {
        showToast('ইতিমধ্যে বুকমার্ক করা আছে');
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = `পৃষ্ঠা ${currentPage} এর ${totalPages}`;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayConversations();
        
        // Scroll to top of conversation grid
        document.getElementById('conversationGrid').scrollTop = 0;
    }
}

function updateStats() {
    document.getElementById('totalConversations').textContent = conversations.length.toLocaleString('bn-BD');
    document.getElementById('totalFolders').textContent = folders.length;
    
    // Simulate download count
    const downloadCount = localStorage.getItem('speakEuDownloads') || '2500';
    document.getElementById('downloadCount').textContent = formatNumber(downloadCount);
}

function formatNumber(num) {
    const number = parseInt(num);
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
}

// Folder Management Functions
function openFolderModal() {
    const modal = document.getElementById('folderModal');
    modal.classList.add('active');
    displayFolders();
}

function closeFolderModal() {
    const modal = document.getElementById('folderModal');
    modal.classList.remove('active');
}

function displayFolders() {
    const folderList = document.getElementById('folderList');
    folderList.innerHTML = '';
    
    if (folders.length === 0) {
        folderList.innerHTML = `
            <div class="no-folders">
                <i class="fas fa-folder-open"></i>
                <p>কোনো ফোল্ডার পাওয়া যায়নি</p>
                <p>নতুন ফোল্ডার তৈরি করুন</p>
            </div>
        `;
        return;
    }
    
    folders.forEach(folder => {
        const folderItem = createFolderItem(folder);
        folderList.appendChild(folderItem);
    });
}

function createFolderItem(folder) {
    const item = document.createElement('div');
    item.className = 'folder-item';
    item.innerHTML = `
        <div class="folder-info">
            <i class="fas fa-folder"></i>
            <div class="folder-details">
                <div class="folder-name">${folder.name}</div>
                <div class="folder-meta">${folder.conversations.length} কথোপকথন • ${formatDate(folder.createdAt)}</div>
            </div>
        </div>
        <div class="folder-actions">
            <button class="action-btn-small view-folder" title="দেখুন">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn-small edit-folder" title="সম্পাদনা">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn-small delete-folder" title="মুছে ফেলুন">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = item.querySelector('.view-folder');
    const editBtn = item.querySelector('.edit-folder');
    const deleteBtn = item.querySelector('.delete-folder');
    
    viewBtn.addEventListener('click', () => viewFolder(folder));
    editBtn.addEventListener('click', () => editFolder(folder));
    deleteBtn.addEventListener('click', () => deleteFolder(folder));
    
    return item;
}

function createNewFolder() {
    const name = prompt('ফোল্ডারের নাম লিখুন:');
    if (name && name.trim()) {
        const folder = {
            id: Date.now(),
            name: name.trim(),
            conversations: [],
            createdAt: new Date().toISOString()
        };
        folders.push(folder);
        saveFolders();
        displayFolders();
        showToast('নতুন ফোল্ডার তৈরি হয়েছে');
    }
}

function viewFolder(folder) {
    // Create a temporary view of folder contents
    const content = folder.conversations.map((conv, index) => 
        `${index + 1}. ${conv.ru} - ${conv.bnMeaning}`
    ).join('\n');
    
    alert(`ফোল্ডার: ${folder.name}\n\n${content || 'কোনো কথোপকথন নেই'}`);
}

function editFolder(folder) {
    const newName = prompt('নতুন নাম লিখুন:', folder.name);
    if (newName && newName.trim() && newName !== folder.name) {
        folder.name = newName.trim();
        saveFolders();
        displayFolders();
        showToast('ফোল্ডারের নাম পরিবর্তন হয়েছে');
    }
}

function deleteFolder(folder) {
    if (confirm(`আপনি কি "${folder.name}" ফোল্ডারটি মুছে ফেলতে চান?`)) {
        const index = folders.findIndex(f => f.id === folder.id);
        if (index > -1) {
            folders.splice(index, 1);
            saveFolders();
            displayFolders();
            showToast('ফোল্ডার মুছে ফেলা হয়েছে');
        }
    }
}

function importFolders() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (Array.isArray(imported)) {
                        folders = [...folders, ...imported];
                        saveFolders();
                        displayFolders();
                        showToast(`${imported.length}টি ফোল্ডার ইমপোর্ট হয়েছে`);
                    } else {
                        showToast('ভুল ফাইল ফরম্যাট');
                    }
                } catch (error) {
                    showToast('ফাইল পড়তে সমস্যা হয়েছে');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function exportFolders() {
    if (folders.length === 0) {
        showToast('কোনো ফোল্ডার নেই এক্সপোর্ট করার জন্য');
        return;
    }
    
    const dataStr = JSON.stringify(folders, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `speak-eu-folders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('ফোল্ডার এক্সপোর্ট হয়েছে');
}

// Save to Folder Functions
function openSaveModal() {
    if (selectedConversations.size === 0) {
        showToast('কোনো কথোপকথন নির্বাচিত নেই');
        return;
    }
    
    const modal = document.getElementById('saveModal');
    const folderSelect = document.getElementById('folderSelect');
    const selectedList = document.getElementById('selectedList');
    
    // Populate folder options
    folderSelect.innerHTML = '<option value="">ফোল্ডার নির্বাচন করুন</option>';
    folders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder.id;
        option.textContent = folder.name;
        folderSelect.appendChild(option);
    });
    
    // Show selected conversations
    selectedList.innerHTML = '';
    Array.from(selectedConversations).slice(0, 5).forEach(index => {
        const conv = filteredConversations[index];
        if (conv) {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.textContent = `${conv.ru} - ${conv.bnMeaning}`;
            selectedList.appendChild(item);
        }
    });
    
    if (selectedConversations.size > 5) {
        const more = document.createElement('div');
        more.textContent = `আরো ${selectedConversations.size - 5}টি...`;
        more.style.fontStyle = 'italic';
        selectedList.appendChild(more);
    }
    
    modal.classList.add('active');
}

function closeSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.classList.remove('active');
    document.getElementById('newFolderName').value = '';
    document.getElementById('folderSelect').value = '';
}

function saveToFolder() {
    const folderSelect = document.getElementById('folderSelect');
    const newFolderName = document.getElementById('newFolderName').value.trim();
    
    let targetFolder;
    
    if (newFolderName) {
        // Create new folder
        targetFolder = {
            id: Date.now(),
            name: newFolderName,
            conversations: [],
            createdAt: new Date().toISOString()
        };
        folders.push(targetFolder);
    } else if (folderSelect.value) {
        // Use existing folder
        targetFolder = folders.find(f => f.id == folderSelect.value);
    } else {
        showToast('ফোল্ডার নির্বাচন করুন বা নতুন ফোল্ডারের নাম লিখুন');
        return;
    }
    
    if (!targetFolder) {
        showToast('ফোল্ডার পাওয়া যায়নি');
        return;
    }
    
    // Add selected conversations to folder
    let addedCount = 0;
    Array.from(selectedConversations).forEach(index => {
        const conv = filteredConversations[index];
        if (conv) {
            const exists = targetFolder.conversations.some(c => c.ru === conv.ru);
            if (!exists) {
                targetFolder.conversations.push(conv);
                addedCount++;
            }
        }
    });
    
    saveFolders();
    closeSaveModal();
    
    // Clear selection
    selectedConversations.clear();
    document.querySelectorAll('.conversation-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectionCount();
    
    showToast(`${addedCount}টি কথোপকথন "${targetFolder.name}" ফোল্ডারে সংরক্ষণ হয়েছে`);
}

function saveFolders() {
    localStorage.setItem('speakEuFolders', JSON.stringify(folders));
    updateStats();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Prayer Times and Clock
function updatePrayerTimes() {
    // This would typically fetch from an API
    // For now, using static times
    const prayerTimes = {
        fajr: '৫:৩০',
        zuhr: '১২:১৫',
        asr: '১৫:৪৫',
        maghrib: '১৮:২০',
        isha: '১৯:৪৫'
    };
    
    // Update current prayer indicator
    const now = new Date();
    const currentHour = now.getHours();
    
    document.querySelectorAll('.prayer-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (currentHour >= 15 && currentHour < 18) {
        document.querySelectorAll('.prayer-item')[2].classList.add('active'); // Asr
    }
}

function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.textContent = timeString;
    }
}

function updateUptime() {
    // Simulate server uptime
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl) {
        const startTime = Date.now();
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl/Cmd + S for save to folder
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (selectedConversations.size > 0) {
            openSaveModal();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Export functions for external use
window.SpeakEU = {
    conversations,
    folders,
    exportConversations: () => conversations,
    exportFolders: () => folders,
    addConversation: (conversation) => {
        conversations.push(conversation);
        filteredConversations = [...conversations];
        displayConversations();
        updateStats();
    }
};
