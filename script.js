"meaning">${item.bnMeaning || ''}</div>
            <div class="english-text">${item.en || ''}</div>
          </div>
          <div class="conversation-actions">
            <button class="action-btn" onclick="app.playPronunciation('${item.bn || ''}')" title="উচ্চারণ শুনুন">
              <i class="fas fa-volume-up"></i>
            </button>
            <button class="action-btn" onclick="app.copyToClipboard('${item[languageCode] || ''}')" title="কপি করুন">
              <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn learn-btn ${isLearned ? 'learned' : ''}" onclick="app.toggleLearned('${item.id}')" title="${isLearned ? 'অশেখা চিহ্নিত করুন' : 'শেখা চিহ্নিত করুন'}">
              ${isLearned ? 'শেখা হয়েছে' : 'শিখেছি'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getLanguageCode(languageKey) {
    const codes = {
      germany: 'de',
      france: 'fr',
      italy: 'it',
      spain: 'es',
      russia: 'ru',
      netherlands: 'nl',
      portugal: 'pt',
      greece: 'el',
      poland: 'pl',
      czech: 'cs',
      hungary: 'hu',
      romania: 'ro',
      ukraine: 'uk',
      croatia: 'hr',
      slovakia: 'sk',
      slovenia: 'sl',
      estonia: 'et',
      latvia: 'lv',
      lithuania: 'lt'
    };
    
    return codes[languageKey] || 'en';
  }

  handleSearch(query) {
    this.searchQuery = query.toLowerCase();
    
    if (query) {
      this.clearSearch.style.display = 'block';
    } else {
      this.clearSearch.style.display = 'none';
    }
    
    this.applyFilters();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    this.filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      }
    });
    
    this.applyFilters();
  }

  applyFilters() {
    if (!this.conversations.length) return;
    
    let filtered = [...this.conversations];
    
    // Apply search filter - improved to scan every character
    if (this.searchQuery) {
      filtered = filtered.filter(item => {
        const searchableText = [
          item[this.getLanguageCode(item.languageKey)] || '',
          item.bn || '',
          item.bnMeaning || '',
          item.en || ''
        ].join(' ').toLowerCase();
        
        // Character-by-character search
        return searchableText.includes(this.searchQuery);
      });
    }
    
    // Apply category filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'learned') {
        filtered = filtered.filter(item => this.learnedPhrases.has(item.id));
      } else if (this.currentFilter === 'unlearned') {
        filtered = filtered.filter(item => !this.learnedPhrases.has(item.id));
      } else {
        filtered = filtered.filter(item => item.category === this.currentFilter);
      }
    }
    
    this.filteredConversations = filtered;
    this.renderFilteredConversations();
    this.updateFilteredCount();
  }

  renderFilteredConversations() {
    if (!this.conversationsContainer) return;
    
    if (this.filteredConversations.length === 0) {
      this.conversationsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>কোনো ফলাফল পাওয়া যায়নি</h3>
          <p>অন্য কিছু খোঁজার চেষ্টা করুন বা ফিল্টার পরিবর্তন করুন।</p>
        </div>
      `;
      return;
    }
    
    const html = this.filteredConversations
      .map(item => this.createConversationItemHTML(item))
      .join('');
    
    this.conversationsContainer.innerHTML = html;
  }

  updateFilteredCount() {
    if (this.filteredCount) {
      this.filteredCount.textContent = this.filteredConversations.length;
    }
  }

  updateConversationsTitle(languageKey) {
    if (this.conversationsTitle) {
      const languageName = this.getLanguageName(languageKey);
      this.conversationsTitle.textContent = `${languageName} কথোপকথন`;
    }
  }

  async playPronunciation(text) {
    try {
      // Use Web Speech API for pronunciation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'bn-BD'; // Bengali language
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      } else {
        this.showNotification('উচ্চারণ ফিচার এই ব্রাউজারে সমর্থিত নয়।', 'warning');
      }
    } catch (error) {
      console.error('Pronunciation error:', error);
      this.showNotification('উচ্চারণে সমস্যা হয়েছে।', 'error');
    }
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('টেক্সট কপি হয়েছে!', 'success');
    } catch (error) {
      console.error('Copy error:', error);
      this.showNotification('কপি করতে সমস্যা হয়েছে।', 'error');
    }
  }

  toggleLearned(phraseId) {
    if (this.learnedPhrases.has(phraseId)) {
      this.learnedPhrases.delete(phraseId);
    } else {
      this.learnedPhrases.add(phraseId);
    }
    
    this.saveProgress();
    this.updateProgressDisplay();
    this.renderConversations();
    
    const action = this.learnedPhrases.has(phraseId) ? 'শেখা হয়েছে' : 'অশেখা';
    this.showNotification(`${action} চিহ্নিত করা হয়েছে।`, 'success');
  }

  updateProgressDisplay() {
    const total = this.conversations.length;
    const learned = this.learnedPhrases.size;
    const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;
    
    if (this.learnedCount) this.learnedCount.textContent = learned;
    if (this.totalCount) this.totalCount.textContent = total;
    if (this.progressPercentage) this.progressPercentage.textContent = `${percentage}%`;
    if (this.progressFill) this.progressFill.style.width = `${percentage}%`;
  }

  saveProgress() {
    const progressData = {
      learnedPhrases: Array.from(this.learnedPhrases),
      language: this.currentLanguage,
      timestamp: Date.now()
    };
    
    localStorage.setItem('speakeu-progress', JSON.stringify(progressData));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('speakeu-progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.learnedPhrases = new Set(data.learnedPhrases || []);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  clearAllProgress() {
    if (confirm('আপনি কি নিশ্চিত যে সমস্ত অগ্রগতি মুছে ফেলতে চান?')) {
      this.learnedPhrases.clear();
      this.saveProgress();
      this.updateProgressDisplay();
      this.renderConversations();
      this.showNotification('সমস্ত অগ্রগতি রিসেট করা হয়েছে।', 'success');
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('speakeu-theme', isDark ? 'dark' : 'light');
    
    if (this.themeToggle) {
      this.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      if (this.themeToggle) {
        this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    } else {
      document.body.classList.remove('dark-mode');
      if (this.themeToggle) {
        this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
    
    localStorage.setItem('speakeu-theme', theme);
    this.closeMenus();
  }

  openMenu() {
    if (this.sideMenu) this.sideMenu.classList.add('open');
    if (this.overlay) this.overlay.classList.add('active');
  }

  closeMenus() {
    if (this.sideMenu) this.sideMenu.classList.remove('open');
    if (this.overlay) this.overlay.classList.remove('active');
  }

  showWelcomeSection() {
    if (this.welcomeSection) this.welcomeSection.style.display = 'block';
    if (this.languageContent) this.languageContent.style.display = 'none';
    this.hideLoading();
    this.hideError();
  }

  showLanguageContent() {
    if (this.welcomeSection) this.welcomeSection.style.display = 'none';
    if (this.languageContent) this.languageContent.style.display = 'block';
    this.hideError();
  }

  showLoading() {
    if (this.loadingState) this.loadingState.style.display = 'block';
    if (this.welcomeSection) this.welcomeSection.style.display = 'none';
    if (this.languageContent) this.languageContent.style.display = 'none';
    this.hideError();
  }

  hideLoading() {
    if (this.loadingState) this.loadingState.style.display = 'none';
  }

  showError(message) {
    if (this.errorState) this.errorState.style.display = 'block';
    if (this.errorMessage) this.errorMessage.textContent = message;
    if (this.welcomeSection) this.welcomeSection.style.display = 'none';
    if (this.languageContent) this.languageContent.style.display = 'none';
    this.hideLoading();
  }

  hideError() {
    if (this.errorState) this.errorState.style.display = 'none';
  }

  showNotification(message, type = 'info') {
    if (!this.notification) return;
    
    this.notification.textContent = message;
    this.notification.className = `notification show ${type}`;
    
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }
    
    // Escape to close menu or clear search
    if (e.key === 'Escape') {
      if (this.sideMenu && this.sideMenu.classList.contains('open')) {
        this.closeMenus();
      } else if (this.searchInput && this.searchInput.value) {
        this.searchInput.value = '';
        this.handleSearch('');
      }
    }
  }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new SpeakEUApp();
});

// Export for global access
window.app = app;
