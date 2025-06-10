// === Storage Management ===

const Storage = {
  // Keys
  KEYS: {
    FOLDERS: 'speakeu_folders',
    SETTINGS: 'speakeu_settings',
    PROGRESS: 'speakeu_progress',
    THEME: 'speakeu_theme',
    LAST_LANGUAGE: 'speakeu_last_lang'
  },

  // Base Methods
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Folder Management
  getFolders() {
    return this.get(this.KEYS.FOLDERS) || {};
  },

  saveFolder(name, phrases = []) {
    const folders = this.getFolders();
    folders[name] = phrases;
    return this.set(this.KEYS.FOLDERS, folders);
  },

  deleteFolder(name) {
    const folders = this.getFolders();
    delete folders[name];
    return this.set(this.KEYS.FOLDERS, folders);
  },

  addToFolder(folderName, phrase) {
    const folders = this.getFolders();
    if (!folders[folderName]) folders[folderName] = [];
    if (!folders[folderName].includes(phrase)) {
      folders[folderName].push(phrase);
      return this.set(this.KEYS.FOLDERS, folders);
    }
    return false;
  },

  removeFromFolder(folderName, phrase) {
    const folders = this.getFolders();
    if (folders[folderName]) {
      folders[folderName] = folders[folderName].filter(p => p !== phrase);
      return this.set(this.KEYS.FOLDERS, folders);
    }
    return false;
  },

  // Settings Management
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      theme: 'light',
      fontSize: 'medium',
      showPronunciation: true,
      showTranslation: true
    };
  },

  saveSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    return this.set(this.KEYS.SETTINGS, settings);
  },

  // Progress Tracking
  getProgress() {
    return this.get(this.KEYS.PROGRESS) || {
      languages: {},
      totalPracticed: 0,
      lastPractice: null
    };
  },

  updateProgress(language, completed) {
    const progress = this.getProgress();
    if (!progress.languages[language]) {
      progress.languages[language] = { completed: 0, total: 0 };
    }
    progress.languages[language].completed = completed;
    progress.lastPractice = new Date().toISOString();
    progress.totalPracticed++;
    return this.set(this.KEYS.PROGRESS, progress);
  },

  // Language Preference
  setLastLanguage(langCode) {
    return this.set(this.KEYS.LAST_LANGUAGE, langCode);
  },

  getLastLanguage() {
    return this.get(this.KEYS.LAST_LANGUAGE);
  },

  // Data Export/Import
  exportData() {
    const data = {
      folders: this.getFolders(),
      settings: this.getSettings(),
      progress: this.getProgress(),
      lastLanguage: this.getLastLanguage(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate data structure
      if (!data.folders || !data.settings) {
        throw new Error('Invalid data format');
      }

      // Import each section
      await Promise.all([
        this.set(this.KEYS.FOLDERS, data.folders),
        this.set(this.KEYS.SETTINGS, data.settings),
        this.set(this.KEYS.PROGRESS, data.progress),
        this.set(this.KEYS.LAST_LANGUAGE, data.lastLanguage)
      ]);

      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  },

  // Clear All Data
  clearAll() {
    Object.values(this.KEYS).forEach(key => this.remove(key));
  }
};

export default Storage;
