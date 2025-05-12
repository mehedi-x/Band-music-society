const utils = {
  showLoading: () => {
    const tableBody = document.querySelector('#lessonTable tbody');
    tableBody.classList.add('loading');
    return setTimeout(() => tableBody.classList.remove('loading'), 500);
  },

  saveToLocal: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  getFromLocal: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },

  formatTime: (date) => {
    try {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hour12: false
      });
    } catch (e) {
      return '--:--:--';
    }
  }
};

// Export for use in other files
window.utils = utils;
