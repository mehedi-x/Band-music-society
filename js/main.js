// Search functionality with debouncing
const enhancedSearch = (() => {
  let timeout;
  
  return {
    perform: (value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const filter = value.toLowerCase();
        const rows = document.querySelectorAll('#lessonTable tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(filter) ? '' : 'none';
        });
      }, 200);
    }
  };
})();

// Recent searches management
const recentSearches = {
  max: 5,
  list: utils.getFromLocal('recentSearches') || [],
  
  add(term) {
    if (!term) return;
    this.list = [term, ...this.list.filter(t => t !== term)].slice(0, this.max);
    utils.saveToLocal('recentSearches', this.list);
    this.render();
  },
  
  render() {
    const container = document.getElementById('recentSearches');
    if (!container) return;
    
    container.innerHTML = this.list
      .map(term => `<span class="recent-search">${term}</span>`)
      .join('');
  }
};

// Table generation
function generateTable(data) {
  const tableBody = document.querySelector('#lessonTable tbody');
  tableBody.innerHTML = '';
  
  if (!data) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="4" style="text-align: center;">No data available for this language</td>`;
    tableBody.appendChild(row);
    return;
  }
  
  for (const [phrase, translations] of Object.entries(data)) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${phrase}</td>
      <td>${translations.pronunciation}</td>
      <td>${translations.bengali}</td>
      <td>${translations.english}</td>
    `;
    tableBody.appendChild(row);
  }
}

// Language loading
function loadLanguageData(lang) {
  try {
    if (!languageData[lang]) {
      throw new Error(`Language data not found for ${lang}`);
    }
    const langHeader = document.getElementById('langHeader');
    langHeader.textContent = `${languageInfo[lang]?.flag || ''} ${languageInfo[lang]?.name || lang}`;
    generateTable(languageData[lang]);
  } catch (error) {
    console.error('Error loading language data:', error);
    const tableBody = document.querySelector('#lessonTable tbody');
    tableBody.innerHTML = '<tr><td colspan="4">Unable to load language data</td></tr>';
  }
}

// Initialize language selector
function initLanguageSelector() {
  const languageSelect = document.getElementById('languageSelect');
  for (const [code, info] of Object.entries(languageInfo)) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${info.flag} ${info.name}`;
    languageSelect.appendChild(option);
  }
}

// Time update
function updateTime() {
  const timeDisplay = document.getElementById('localTime');
  timeDisplay.innerText = utils.formatTime(new Date());
}

// Initialize application
function initApp() {
  initLanguageSelector();
  
  const savedLang = utils.getFromLocal('selectedLanguage') || 'russian';
  document.getElementById('languageSelect').value = savedLang;
  loadLanguageData(savedLang);
  
  recentSearches.render();
  
  setInterval(updateTime, 1000);
  updateTime();
  
  addEventListeners();
}

// Event listeners
function addEventListeners() {
  const languageSelect = document.getElementById('languageSelect');
  const searchInput = document.getElementById('searchInput');
  const scrollBtn = document.getElementById('scrollTopBtn');

  languageSelect.addEventListener('change', (e) => {
    utils.saveToLocal('selectedLanguage', e.target.value);
    utils.showLoading();
    loadLanguageData(e.target.value);
  });
  
  searchInput.addEventListener('input', (e) => {
    enhancedSearch.perform(e.target.value);
    recentSearches.add(e.target.value);
  });
  
  document.getElementById('recentSearches').addEventListener('click', (e) => {
    if (e.target.classList.contains('recent-search')) {
      searchInput.value = e.target.textContent;
      enhancedSearch.perform(e.target.textContent);
    }
  });
  
  window.onscroll = () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  };
  
  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
