// === Utility Functions ===

const Utils = {
  // Date and Time
  formatDate(date) {
    return new Date(date).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  formatTime(date) {
    return new Date(date).toLocaleString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // DOM Helpers
  createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  },

  // String Helpers
  capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  // Array Helpers
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // Theme Management
  setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  },

  getTheme() {
    return localStorage.getItem('theme') || 'light';
  },

  // Error Handling
  showError(message, duration = 3000) {
    const errorDiv = this.createElement('div', 'error-message', message);
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), duration);
  },

  // Validation
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Local Storage Helpers
  store: {
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
      } catch {
        return false;
      }
    },
    
    remove(key) {
      localStorage.removeItem(key);
    }
  },

  // Device Detection
  isMobile: {
    Android: () => /Android/i.test(navigator.userAgent),
    iOS: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
    any: function() {
      return this.Android() || this.iOS();
    }
  },

  // Animation Helpers
  animate(element, animation, duration = 300) {
    element.style.animation = `${animation} ${duration}ms`;
    return new Promise(resolve => {
      setTimeout(() => {
        element.style.animation = '';
        resolve();
      }, duration);
    });
  },

  // Debounce Function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Copy to Clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  // Random ID Generator
  generateId(length = 8) {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  }
};

export default Utils;
