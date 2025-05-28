const languageSelector = document.getElementById('language-selector');
const conversationArea = document.getElementById('conversation-area');
const themeToggle = document.getElementById('theme-toggle');

const languageData = {
  albania: typeof ALBANIA_DATA !== 'undefined' ? ALBANIA_DATA : null,
  andorra: typeof ANDORRA_DATA !== 'undefined' ? ANDORRA_DATA : null,
  austrian: typeof AUSTRIAN_DATA !== 'undefined' ? AUSTRIAN_DATA : null,
  belarus: typeof BELARUS_DATA !== 'undefined' ? BELARUS_DATA : null,
  belgium: typeof BELGIUM_DATA !== 'undefined' ? BELGIUM_DATA : null,
  bosnia: typeof BOSNIA_DATA !== 'undefined' ? BOSNIA_DATA : null,
  croatia: typeof CROATIA_DATA !== 'undefined' ? CROATIA_DATA : null,
  czech: typeof CZECH_DATA !== 'undefined' ? CZECH_DATA : null,
  danish: typeof DANISH_DATA !== 'undefined' ? DANISH_DATA : null,
  dutch: typeof DUTCH_DATA !== 'undefined' ? DUTCH_DATA : null,
  estonia: typeof ESTONIA_DATA !== 'undefined' ? ESTONIA_DATA : null,
  finnish: typeof FINNISH_DATA !== 'undefined' ? FINNISH_DATA : null,
  french: typeof FRENCH_DATA !== 'undefined' ? FRENCH_DATA : null,
  german: typeof GERMAN_DATA !== 'undefined' ? GERMAN_DATA : null,
  greek: typeof GREEK_DATA !== 'undefined' ? GREEK_DATA : null,
  hungarian: typeof HUNGARIAN_DATA !== 'undefined' ? HUNGARIAN_DATA : null,
  iceland: typeof ICELAND_DATA !== 'undefined' ? ICELAND_DATA : null,
  irish: typeof IRISH_DATA !== 'undefined' ? IRISH_DATA : null,
  italian: typeof ITALIAN_DATA !== 'undefined' ? ITALIAN_DATA : null,
  kosovo: typeof KOSOVO_DATA !== 'undefined' ? KOSOVO_DATA : null,
  latvian: typeof LATVIAN_DATA !== 'undefined' ? LATVIAN_DATA : null,
  liechtenstein: typeof LIECHTENSTEIN_DATA !== 'undefined' ? LIECHTENSTEIN_DATA : null,
  lithuanian: typeof LITHUANIAN_DATA !== 'undefined' ? LITHUANIAN_DATA : null,
  luxembourg: typeof LUXEMBOURG_DATA !== 'undefined' ? LUXEMBOURG_DATA : null,
  maltese: typeof MALTESE_DATA !== 'undefined' ? MALTESE_DATA : null,
  moldova: typeof MOLDOVA_DATA !== 'undefined' ? MOLDOVA_DATA : null,
  monaco: typeof MONACO_DATA !== 'undefined' ? MONACO_DATA : null,
  north_macedonia: typeof NORTH_MACEDONIA_DATA !== 'undefined' ? NORTH_MACEDONIA_DATA : null,
  norwegian: typeof NORWEGIAN_DATA !== 'undefined' ? NORWEGIAN_DATA : null,
  polish: typeof POLISH_DATA !== 'undefined' ? POLISH_DATA : null,
  portuguese: typeof PORTUGUESE_DATA !== 'undefined' ? PORTUGUESE_DATA : null,
  russian: typeof RUSSIAN_DATA !== 'undefined' ? RUSSIAN_DATA : null,
  san_marino: typeof SAN_MARINO_DATA !== 'undefined' ? SAN_MARINO_DATA : null,
  serbia: typeof SERBIA_DATA !== 'undefined' ? SERBIA_DATA : null,
  slovak: typeof SLOVAK_DATA !== 'undefined' ? SLOVAK_DATA : null,
  slovenia: typeof SLOVENIA_DATA !== 'undefined' ? SLOVENIA_DATA : null,
  spanish: typeof SPANISH_DATA !== 'undefined' ? SPANISH_DATA : null,
  swedish: typeof SWEDISH_DATA !== 'undefined' ? SWEDISH_DATA : null,
  switzerland: typeof SWITZERLAND_DATA !== 'undefined' ? SWITZERLAND_DATA : null,
  turkey: typeof TURKEY_DATA !== 'undefined' ? TURKEY_DATA : null,
  ukraine: typeof UKRAINE_DATA !== 'undefined' ? UKRAINE_DATA : null,
  vatican: typeof VATICAN_DATA !== 'undefined' ? VATICAN_DATA : null
};

// Load saved language
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang && languageData[savedLang]) {
  languageSelector.value = savedLang;
  loadLanguage(savedLang);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

languageSelector.addEventListener('change', () => {
  const lang = languageSelector.value;
  localStorage.setItem('selectedLanguage', lang);
  loadLanguage(lang);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function loadLanguage(lang) {
  const data = languageData[lang];
  conversationArea.innerHTML = '';

  if (!data || !Array.isArray(data) || data.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'fallback-message';
    msg.textContent = 'এই ভাষার জন্য কোনো ডেটা পাওয়া যায়নি।';
    conversationArea.appendChild(msg);
    return;
  }

  data.forEach(item => {
    const entry = document.createElement('div');
    entry.innerHTML = `
      <p><strong>${lang.replace(/_/g, ' ').toUpperCase()}</strong></p>
      <p>বাংলা উচ্চারণ: ${item.bn}</p>
      <p>বাংলা অর্থ: ${item.bnMeaning}</p>
      <p>ইংরেজি অর্থ: ${item.en}</p>
      <hr>
    `;
    conversationArea.appendChild(entry);
  });
}
