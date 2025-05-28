// Updated script.js to handle Switzerland selection properly

const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const loadLanguageData = async (langKey) => {
  try {
    const module = await import(`./languages/${langKey}.js`);
    return module.data;
  } catch (error) {
    console.error(`Error loading language data for ${langKey}:`, error);
    return null;
  }
};

const renderPhrases = (languageData) => {
  conversationArea.innerHTML = '';

  if (!languageData || !languageData.phrases) {
    conversationArea.innerHTML = '<p style="padding:20px; font-size:1.2rem">No data available for this language.</p>';
    return;
  }

  const phrases = languageData.phrases;

  for (const key in phrases) {
    if (phrases.hasOwnProperty(key)) {
      const phraseText = phrases[key];
      const div = document.createElement('div');
      div.className = 'conversation-item';
      div.textContent = `${key}: ${phraseText}`;
      conversationArea.appendChild(div);
    }
  }
};

languageSelect.addEventListener('change', async () => {
  const selected = languageSelect.value;
  const languageData = await loadLanguageData(selected);
  renderPhrases(languageData);
});

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

// Initial load if a language is pre-selected
(async () => {
  const selected = languageSelect.value;
  const languageData = await loadLanguageData(selected);
  renderPhrases(languageData);
})();
