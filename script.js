// Global variables
let currentLanguageData = [];
let favorites = JSON.parse(localStorage.getItem('speakeu-favorites')) || [];
let currentTheme = localStorage.getItem('speakeu-theme') || 'light';

// Language data URLs
const languageFiles = {
    'germany': 'germany.json',
    'italy': 'italy.json',
    'spain': 'spain.json',
    'russia': 'russia.json'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    showHome();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('speakeu-theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event Listeners
function setupEventListeners() {
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', function() {
        const selectedLanguage = this.value;
        if (selectedLanguage) {
            loadLanguage(selectedLanguage);
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        filterVocabulary(this.value);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'h':
                    e.preventDefault();
                    showHome();
                    break;
                case 'f':
                    e.preventDefault();
                    showFavorites();
                    break;
                case 's':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            if (document.getElementById('sideMenu').classList.contains('active')) {
                toggleMenu();
            }
        }
    });
}

// Menu Management
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = sideMenu.classList.contains('active') ? 'hidden' : '';
}

// Page Navigation
function showHome() {
    hideAllPages();
    document.getElementById('homePage').style.display = 'block';
    toggleMenu(); // Close menu if open
}

function showVocabulary() {
    hideAllPages();
    document.getElementById('vocabularyPage').style.display = 'block';
}

function showFavorites() {
    hideAllPages();
    document.getElementById('favoritesPage').style.display = 'block';
    renderFavorites();
    toggleMenu(); // Close menu if open
}

function showAbout() {
    hideAllPages();
    document.getElementById('aboutPage').style.display = 'block';
    toggleMenu();
}

function showContact() {
    hideAllPages();
    document.getElementById('contactPage').style.display = 'block';
    toggleMenu();
}

function showPrivacy() {
    hideAllPages();
    document.getElementById('privacyPage').style.display = 'block';
    toggleMenu();
}

function hideAllPages() {
    const pages = ['homePage', 'vocabularyPage', 'favoritesPage', 'aboutPage', 'contactPage', 'privacyPage'];
    pages.forEach(pageId => {
        document.getElementById(pageId).style.display = 'none';
    });
}

// Language Loading
async function loadLanguage(languageName) {
    try {
        showLoadingState();
        
        const response = await fetch(languageFiles[languageName]);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        currentLanguageData = await response.json();
        
        // Update language title
        const languageTitle = document.getElementById('languageTitle');
        languageTitle.textContent = getLanguageDisplayName(languageName);
        
        renderVocabulary(currentLanguageData);
        showVocabulary();
        
    } catch (error) {
        console.error('Error loading language:', error);
        showErrorMessage('Failed to load language data. Please try again.');
    }
}

function getLanguageDisplayName(languageName) {
    const displayNames = {
        'germany': 'German - জার্মান',
        'italy': 'Italian - ইতালিয়ান',
        'spain': 'Spanish - স্প্যানিশ',
        'russia': 'Russian - রাশিয়ান'
    };
    return displayNames[languageName] || languageName;
}

function showLoadingState() {
    const vocabularyGrid = document.getElementById('vocabularyGrid');
    vocabularyGrid.innerHTML = `
        <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Loading vocabulary...</p>
        </div>
    `;
}

function showErrorMessage(message) {
    const vocabularyGrid = document.getElementById('vocabularyGrid');
    vocabularyGrid.innerHTML = `
        <div class="error-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <p>${message}</p>
        </div>
    `;
}

// Vocabulary Rendering
function renderVocabulary(data) {
    const vocabularyGrid = document.getElementById('vocabularyGrid');
    vocabularyGrid.innerHTML = '';

    if (!data || data.length === 0) {
        vocabularyGrid.innerHTML = `
            <div class="no-data-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>No vocabulary data available.</p>
            </div>
        `;
        return;
    }

    data.forEach((item, index) => {
        const card = createVocabCard(item, index);
        vocabularyGrid.appendChild(card);
    });
}

function createVocabCard(item, index) {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    
    // Get the language key based on the data structure
    const languageKey = Object.keys(item).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
    const foreignWord = item[languageKey] || 'Unknown';
    
    const isInFavorites = favorites.some(fav => 
        fav[languageKey] === foreignWord && fav.bnMeaning === item.bnMeaning
    );

    card.innerHTML = `
        <div class="vocab-header">
            <h3 class="vocab-word">${foreignWord}</h3>
            <button class="favorite-btn ${isInFavorites ? 'active' : ''}" 
                    onclick="toggleFavorite(${index}, this)">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="vocab-pronunciation">${item.bn}</div>
        <div class="vocab-meaning">${item.bnMeaning}</div>
        <div class="vocab-english">${item.en}</div>
    `;

    return card;
}

// Favorites Management
function toggleFavorite(index, button) {
    const item = currentLanguageData[index];
    const languageKey = Object.keys(item).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
    const foreignWord = item[languageKey];
    
    const existingIndex = favorites.findIndex(fav => 
        fav[languageKey] === foreignWord && fav.bnMeaning === item.bnMeaning
    );

    if (existingIndex > -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        button.classList.remove('active');
        showNotification('Removed from favorites', 'success');
    } else {
        // Add to favorites
        favorites.push(item);
        button.classList.add('active');
        showNotification('Added to favorites', 'success');
    }

    localStorage.setItem('speakeu-favorites', JSON.stringify(favorites));
}

function renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="no-favorites" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-heart" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 1rem;"></i>
                <p>No favorites yet. Start adding words you want to remember!</p>
            </div>
        `;
        return;
    }

    favorites.forEach((item, index) => {
        const card = createFavoriteCard(item, index);
        favoritesGrid.appendChild(card);
    });
}

function createFavoriteCard(item, index) {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    
    const languageKey = Object.keys(item).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
    const foreignWord = item[languageKey] || 'Unknown';

    card.innerHTML = `
        <div class="vocab-header">
            <h3 class="vocab-word">${foreignWord}</h3>
            <button class="favorite-btn active" onclick="removeFavorite(${index}, this)">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="vocab-pronunciation">${item.bn}</div>
        <div class="vocab-meaning">${item.bnMeaning}</div>
        <div class="vocab-english">${item.en}</div>
    `;

    return card;
}

function removeFavorite(index, button) {
    favorites.splice(index, 1);
    localStorage.setItem('speakeu-favorites', JSON.stringify(favorites));
    renderFavorites();
    showNotification('Removed from favorites', 'success');
}

// Search Functionality
function filterVocabulary(searchTerm) {
    if (!currentLanguageData || currentLanguageData.length === 0) return;

    const filteredData = currentLanguageData.filter(item => {
        const languageKey = Object.keys(item).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
        const foreignWord = item[languageKey] || '';
        
        return foreignWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.bnMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.en.toLowerCase().includes(searchTerm.toLowerCase());
    });

    renderVocabulary(filteredData);
}

// Import/Export Functionality
function exportFavorites() {
    if (favorites.length === 0) {
        showNotification('No favorites to export', 'warning');
        return;
    }

    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'speakeu-favorites.json';
    link.click();
    
    showNotification('Favorites exported successfully', 'success');
}

function importFavorites(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedFavorites = JSON.parse(e.target.result);
            
            if (Array.isArray(importedFavorites)) {
                favorites = [...favorites, ...importedFavorites];
                // Remove duplicates
                favorites = favorites.filter((item, index, self) => {
                    const languageKey = Object.keys(item).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
                    return index === self.findIndex(f => {
                        const fLanguageKey = Object.keys(f).find(key => !['bn', 'bnMeaning', 'en'].includes(key));
                        return f[fLanguageKey] === item[languageKey] && f.bnMeaning === item.bnMeaning;
                    });
                });
                
                localStorage.setItem('speakeu-favorites', JSON.stringify(favorites));
                showNotification('Favorites imported successfully', 'success');
                
                if (document.getElementById('favoritesPage').style.display !== 'none') {
                    renderFavorites();
                }
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            showNotification('Error importing favorites. Please check the file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Data Reset
function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This will remove all favorites and preferences.')) {
        localStorage.removeItem('speakeu-favorites');
        localStorage.removeItem('speakeu-theme');
        favorites = [];
        currentTheme = 'light';
        
        initializeTheme();
        renderFavorites();
        showNotification('All data has been reset', 'success');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27AE60',
        'error': '#E74C3C',
        'warning': '#F39C12',
        'info': '#3498DB'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    // Mark app as fully loaded
    performance.mark('app-loaded');
    
    // Log performance metrics
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('App Performance:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
        });
    }, 0);
});
