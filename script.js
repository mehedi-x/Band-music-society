// ========================================
// Application State Management
// ========================================
class SpeakEUApp {
  constructor() {
    this.currentLanguage = null;
    this.languageData = [];
    this.filteredData = [];
    this.searchQuery = '';
    this.currentFilter = 'all';
    this.learnedPhrases = new Set();
    this.audioCache = new Map();
    this.isLoading = false;
    
    this.init();
  }

  init() {
    this.initializeElements();
    this.loadUserPreferences();
    this.bindEvents();
    this.updateProgressDisplay();
  }

  initializeElements() {
    // Core elements
    this.elements = {
      languageSelect: document.getElementById('language-select'),
      conversationArea: document.getElementById('conversation-area'),
      welcomeSection: document.getElementById('welcome-section'),
      searchSection: document.getElementById('search-section'),
      progressSection: document.getElementById('progress-section'),
      
      // Theme and menu
      modeToggle: document.getElementById('mode-toggle'),
      menuToggle: document.getElementById('menu-toggle'),
      sideMenu: document.getElementById('side-menu'),
      closeMenu: document.getElementById('close-menu'),
      menuOverlay: document.getElementById('menu-overlay'),
      
      // Search and filter
      searchInput: document.getElementById('search-input'),
      clearSearch: document.getElementById('clear-search'),
      filterButtons: document.querySelectorAll('.filter-btn'),
      
      // Loading and error
      loadingSpinner: document.getElementById('loading-spinner'),
      errorMessage: document.getElementById('error-message'),
      errorText: document.getElementById('error-text'),
      retryBtn: document.getElementById('retry-btn'),
      
      // Progress
      learnedCount: document.getElementById('learned-count'),
      totalCount: document.getElementById('total-count'),
      progressPercentage: document.getElementById('progress-percentage'),
      progressFill: document.getElementById('progress-fill'),
      
      // Quick actions
      langQuickSelects: document.querySelectorAll('.lang-quick-select'),
      clearProgress: document.getElementById('clear-progress'),
      
      // Audio
      audioPlayer: document.getElementById('audio-player')
    };
  }

  loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('speakeu_theme') || 'light';
    this.setTheme(savedTheme);
    
    // Load language preference
    const savedLanguage = localStorage.getItem('speakeu_language');
    if (savedLanguage) {
      this.elements.languageSelect.value = savedLanguage;
      this.loadLanguage(savedLanguage);
    }
    
    // Load learned phrases
    const savedLearned = localStorage.getItem('speakeu_learned');
    if (savedLearned) {
      this.learnedPhrases = new Set(JSON.parse(savedLearned));
    }
    
    // Load filter preference
    const savedFilter = localStorage.getItem('speakeu_filter') || 'all';
    this.setFilter(savedFilter);
  }

  bindEvents() {
    // Language selection
    this.elements.languageSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadLanguage(e.target.value);
      } else {
        this.showWelcomeSection();
      }
    });

    // Theme toggle
    this.elements.modeToggle.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    });

    // Menu management
    this.elements.menuToggle.addEventListener('click', () => this.openMenu());
    this.elements.closeMenu.addEventListener('click', () => this.closeMenu());
    this.elements.menuOverlay.addEventListener('click', () => this.closeMenu());

    // Search functionality
    this.elements.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.elements.clearSearch.addEventListener('click', () => {
      this.elements.searchInput.value = '';
      this.handleSearch('');
    });

    // Filter buttons
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.dataset.category;
        this.setFilter(filter);
      });
    });

    // Quick language selection
    this.elements.langQuickSelects.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        this.elements.languageSelect.value = lang;
        this.loadLanguage(lang);
      });
    });

    // Clear progress
    this.elements.clearProgress.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all progress? This action cannot be undone.')) {
        this.clearAllProgress();
      }
    });

    // Retry button
    this.elements.retryBtn.addEventListener('click', () => {
      if (this.currentLanguage) {
        this.loadLanguage(this.currentLanguage);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Side menu navigation
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(e.target.dataset.page);
      });
    });
  }

  // ========================================
  // Language Loading and Management
  // ========================================
  async loadLanguage(languageKey) {
    if (this.isLoading) return;
    
    this.currentLanguage = languageKey;
    this.showLoading();
    this.hideError();
    
    try {
      const response = await fetch(`languages/${languageKey}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load language data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid or empty language data');
      }
      
      this.languageData = this.processLanguageData(data, languageKey);
      this.filteredData = [...this.languageData];
      
      localStorage.setItem('speakeu_language', languageKey);
      
      this.hideWelcomeSection();
      this.showLanguageContent();
      this.renderConversations();
      this.updateProgressDisplay();
      
    } catch (error) {
      console.error('Error loading language:', error);
      this.showError(`Failed to load ${languageKey} language data. ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  processLanguageData(data, languageKey) {
    const langCode = this.getLanguageCode(languageKey);
    
    return data.map((item, index) => ({
      id: `${languageKey}_${index}`,
      original: item[langCode] || '—',
      bengali: item.bn || '—',
      meaning: item.bnMeaning || '—',
      english: item.en || '—',
      category: this.categorizePhrase(item),
      isLearned: this.learnedPhrases.has(`${languageKey}_${index}`)
    }));
  }

  getLanguageCode(languageKey) {
    const langCodeMap = {
      austria: 'de', belgium: 'nl', czech: 'cs', denmark: 'da',
      estonia: 'et', finland: 'fi', france: 'fr', germany: 'de',
      greece: 'el', hungary: 'hu', iceland: 'is', italy: 'it',
      latvia: 'lv', liechtenstein: 'de', lithuania: 'lt', luxembourg: 'lb',
      malta: 'mt', netherlands: 'nl', norway: 'no', poland: 'pl',
      portugal: 'pt', slovakia: 'sk', slovenia: 'sl', spain: 'es',
      sweden: 'sv', switzerland: 'de', russian: 'ru', albania: 'sq',
      andorra: 'ca', armenia: 'hy', azerbaijan: 'az', bosnia: 'bs',
      bulgaria: 'bg', croatia: 'hr', cyprus: 'el', georgia: 'ka',
      ireland: 'en', kosovo: 'sq', moldova: 'ro', monaco: 'fr',
      montenegro: 'sr', northmacedonia: 'mk', romania: 'ro',
      sanmarino: 'it', serbia: 'sr', turkey: 'tr', ukraine: 'uk',
      unitedkingdom: 'en', vatican: 'la'
    };
    
    return langCodeMap[languageKey] || 'en';
  }

  categorizePhrase(item) {
    const text = (item.en || '').toLowerCase();
    
    if (text.includes('hello') || text.includes('thank you') || text.includes('good morning') || 
        text.includes('my name') || text.includes('how are you')) {
      return 'basic';
    }
    
    if (text.includes('work') || text.includes('job') || text.includes('office') || 
        text.includes('factory') || text.includes('business')) {
      return 'work';
    }
    
    if (text.includes('help') || text.includes('emergency') || text.includes('sick') || 
        text.includes('hospital') || text.includes('doctor') || text.includes('ambulance')) {
      return 'emergency';
    }
    
    return 'general';
  }

  // ========================================
  // UI Rendering and Management
  // ========================================
  renderConversations() {
    if (!this.filteredData.length) {
      this.elements.conversationArea.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No phrases found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    const conversationsHTML = this.filteredData.map(item => 
      this.createConversationItemHTML(item)
    ).join('');

    this.elements.conversationArea.innerHTML = conversationsHTML;
    this.bindConversationEvents();
  }

  createConversationItemHTML(item) {
    const categoryIcon = this.getCategoryIcon(item.category);
    const categoryLabel = this.getCategoryLabel(item.category);
    
    return `
      <div class="conversation-item" data-id="${item.id}">
        <div class="category-badge">${categoryIcon} ${categoryLabel}</div>
        
        <div class="phrase-row">
          <i class="fas fa-volume-up phrase-icon"></i>
          <div class="phrase-content phrase-main">${item.original}</div>
        </div>
        
        <div class="phrase-row">
          <i class="fas fa-language phrase-icon"></i>
          <div class="phrase-content phrase-translation">${item.bengali}</div>
        </div>
        
        <div class="phrase-row">
          <i class="fas fa-lightbulb phrase-icon"></i>
          <div class="phrase-content phrase-meaning">${item.meaning}</div>
        </div>
        
        <div class="phrase-row">
          <i class="fas fa-globe phrase-icon"></i>
          <div class="phrase-content phrase-english">${item.english}</div>
        </div>
        
        <div class="conversation-actions">
          <button class="action-btn play-btn" data-text="${item.original}" title="Play pronunciation">
            <i class="fas fa-play"></i>
          </button>
          <button class="action-btn copy-btn" data-text="${item.original}" title="Copy text">
            <i class="fas fa-copy"></i>
          </button>
          <button class="action-btn learn-btn ${item.isLearned ? 'learned' : ''}" 
                  data-id="${item.id}" title="Mark as learned">
            <i class="fas ${item.isLearned ? 'fa-check' : 'fa-bookmark'}"></i>
          </button>
        </div>
      </div>
    `;
  }

  bindConversationEvents() {
    // Play pronunciation
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.closest('.play-btn').dataset.text;
        this.playPronunciation(text);
      });
    });

    // Copy text
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.closest('.copy-btn').dataset.text;
        this.copyToClipboard(text);
      });
    });

    // Toggle learned status
    document.querySelectorAll('.learn-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.learn-btn').dataset.id;
        this.toggleLearned(id);
      });
    });
  }

  getCategoryIcon(category) {
    const icons = {
      basic: '👋',
      work: '💼',
      emergency: '🚨',
      general: '💬'
    };
    return icons[category] || '💬';
  }

  getCategoryLabel(category) {
    const labels = {
      basic: 'Basic',
      work: 'Work',
      emergency: 'Emergency',
      general: 'General'
    };
    return labels[category] || 'General';
  }

  // ========================================
  // Search and Filter Functionality
  // ========================================
  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    
    if (this.searchQuery) {
      this.elements.clearSearch.style.display = 'flex';
    } else {
      this.elements.clearSearch.style.display = 'none';
    }
    
    this.applyFilters();
    localStorage.setItem('speakeu_search', this.searchQuery);
  }

  setFilter(filter) {
    this.currentFilter = filter;
    
    this.elements.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === filter);
    });
    
    this.applyFilters();
    localStorage.setItem('speakeu_filter', filter);
  }

  applyFilters() {
    if (!this.languageData.length) return;
    
    this.filteredData = this.languageData.filter(item => {
      const matchesSearch = !this.searchQuery || 
        item.original.toLowerCase().includes(this.searchQuery) ||
        item.bengali.toLowerCase().includes(this.searchQuery) ||
        item.meaning.toLowerCase().includes(this.searchQuery) ||
        item.english.toLowerCase().includes(this.searchQuery);
      
      const matchesFilter = this.currentFilter === 'all' || 
        item.category === this.currentFilter;
      
      return matchesSearch && matchesFilter;
    });
    
    this.renderConversations();
  }

  // ========================================
  // Audio and Pronunciation
  // ========================================
  async playPronunciation(text) {
    if (!text || text === '—') return;
    
    try {
      // Check cache first
      if (this.audioCache.has(text)) {
        const audioBlob = this.audioCache.get(text);
        await this.playAudioBlob(audioBlob);
        return;
      }
      
      // Use Web Speech API if available
      if ('speechSynthesis' in window) {
        this.speakText(text);
      } else {
        console.warn('Speech synthesis not available');
        this.showNotification('Audio pronunciation not available in this browser', 'warning');
      }
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      this.showNotification('Failed to play pronunciation', 'error');
    }
  }

  speakText(text) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on current selection
    const langCode = this.getLanguageCode(this.currentLanguage);
    utterance.lang = this.getSpeechLanguageCode(langCode);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onerror = () => {
      console.warn('Speech synthesis error');
    };
    
    speechSynthesis.speak(utterance);
  }

  getSpeechLanguageCode(langCode) {
    const speechCodes = {
      'de': 'de-DE', 'es': 'es-ES', 'fr': 'fr-FR', 'it': 'it-IT',
      'pt': 'pt-PT', 'nl': 'nl-NL', 'pl': 'pl-PL', 'cs': 'cs-CZ',
      'hu': 'hu-HU', 'ru': 'ru-RU', 'sv': 'sv-SE', 'no': 'no-NO',
      'da': 'da-DK', 'fi': 'fi-FI', 'el': 'el-GR', 'en': 'en-US'
    };
    return speechCodes[langCode] || 'en-US';
  }

  async playAudioBlob(blob) {
    const audioUrl = URL.createObjectURL(blob);
    this.elements.audioPlayer.src = audioUrl;
    
    try {
      await this.elements.audioPlayer.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      URL.revokeObjectURL(audioUrl);
    }
  }

  // ========================================
  // Progress Tracking
  // ========================================
  toggleLearned(phraseId) {
    const button = document.querySelector(`[data-id="${phraseId}"]`);
    const icon = button.querySelector('i');
    
    if (this.learnedPhrases.has(phraseId)) {
      this.learnedPhrases.delete(phraseId);
      button.classList.remove('learned');
      icon.className = 'fas fa-bookmark';
      button.title = 'Mark as learned';
    } else {
      this.learnedPhrases.add(phraseId);
      button.classList.add('learned');
      icon.className = 'fas fa-check';
      button.title = 'Mark as not learned';
    }
    
    // Update the item in filteredData
    const item = this.filteredData.find(item => item.id === phraseId);
    if (item) {
      item.isLearned = this.learnedPhrases.has(phraseId);
    }
    
    this.saveProgress();
    this.updateProgressDisplay();
  }

  updateProgressDisplay() {
    const totalPhrases = this.languageData.length;
    const learnedPhrases = this.languageData.filter(item => 
      this.learnedPhrases.has(item.id)
    ).length;
    
    const percentage = totalPhrases > 0 ? Math.round((learnedPhrases / totalPhrases) * 100) : 0;
    
    if (this.elements.learnedCount) {
      this.elements.learnedCount.textContent = learnedPhrases;
    }
    if (this.elements.totalCount) {
      this.elements.totalCount.textContent = totalPhrases;
    }
    if (this.elements.progressPercentage) {
      this.elements.progressPercentage.textContent = `${percentage}%`;
    }
    if (this.elements.progressFill) {
      this.elements.progressFill.style.width = `${percentage}%`;
    }
  }

  saveProgress() {
    localStorage.setItem('speakeu_learned', JSON.stringify([...this.learnedPhrases]));
  }

  clearAllProgress() {
    this.learnedPhrases.clear();
    this.saveProgress();
    this.updateProgressDisplay();
    
    // Update UI
    document.querySelectorAll('.learn-btn').forEach(btn => {
      btn.classList.remove('learned');
      btn.querySelector('i').className = 'fas fa-bookmark';
      btn.title = 'Mark as learned';
    });
    
    // Update data
    this.languageData.forEach(item => {
      item.isLearned = false;
    });
    this.filteredData.forEach(item => {
      item.isLearned = false;
    });
    
    this.showNotification('Progress cleared successfully', 'success');
  }

  // ========================================
  // Theme Management
  // ========================================
  setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      this.elements.modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      this.elements.modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('speakeu_theme', theme);
  }

  // ========================================
  // Menu Management
  // ========================================
  openMenu() {
    this.elements.sideMenu.classList.add('active');
    this.elements.menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.elements.sideMenu.classList.remove('active');
    this.elements.menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // UI State Management
  // ========================================
  showWelcomeSection() {
    this.elements.welcomeSection.style.display = 'block';
    this.elements.searchSection.style.display = 'none';
    this.elements.progressSection.style.display = 'none';
    this.elements.conversationArea.innerHTML = '';
  }

  hideWelcomeSection() {
    this.elements.welcomeSection.style.display = 'none';
  }

  showLanguageContent() {
    this.elements.searchSection.style.display = 'block';
    this.elements.progressSection.style.display = 'block';
  }

  showLoading() {
    this.isLoading = true;
    this.elements.loadingSpinner.style.display = 'flex';
    this.elements.conversationArea.innerHTML = '';
  }

  hideLoading() {
    this.isLoading = false;
    this.elements.loadingSpinner.style.display = 'none';
  }

  showError(message) {
    this.elements.errorText.textContent = message;
    this.elements.errorMessage.style.display = 'block';
  }

  hideError() {
    this.elements.errorMessage.style.display = 'none';
  }

  // ========================================
  // Utility Functions
  // ========================================
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('Text copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy text:', error);
      this.showNotification('Failed to copy text', 'error');
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  handleKeyboardShortcuts(e) {
    // Escape key closes menu
    if (e.key === 'Escape') {
      this.closeMenu();
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.elements.searchInput.focus();
    }
    
    // Ctrl/Cmd + / opens menu
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      this.openMenu();
    }
  }

  handleNavigation(page) {
    this.closeMenu();
    
    switch (page) {
      case 'home':
        this.elements.languageSelect.value = '';
        this.showWelcomeSection();
        break;
      case 'progress':
        if (this.currentLanguage) {
          this.elements.progressSection.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'settings':
        this.showNotification('Settings page coming soon!', 'info');
        break;
      default:
        this.showNotification(`${page} page coming soon!`, 'info');
    }
  }
}

// ========================================
// Notification Styles (CSS-in-JS for dynamic notifications)
// ========================================
const notificationStyles = `
  .notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px var(--shadow-medium);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    min-width: 250px;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-success {
    border-color: var(--success-color);
  }
  
  .notification-success i {
    color: var(--success-color);
  }
  
  .notification-error {
    border-color: var(--error-color);
  }
  
  .notification-error i {
    color: var(--error-color);
  }
  
  .notification-warning {
    border-color: var(--warning-color);
  }
  
  .notification-warning i {
    color: var(--warning-color);
  }
  
  .notification-info {
    border-color: var(--text-accent);
  }
  
  .notification-info i {
    color: var(--text-accent);
  }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ========================================
// Initialize Application
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  new SpeakEUApp();
});

// ========================================
// Service Worker Registration (for offline support)
// ========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
