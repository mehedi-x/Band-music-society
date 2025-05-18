const languageSelect = document.getElementById('language-select');
const conversationArea = document.getElementById('conversation-area');
const modeToggle = document.getElementById('mode-toggle');

const vocabulary = {
  russian: [
    {
      russian: 'Здравствуйте',
      bangla: 'জ্দ্রাভস্তুইতে',
      meaning: 'হ্যালো',
      english: 'Hello'
    },
    {
      russian: 'Как дела?',
      bangla: 'কাক দেলা?',
      meaning: 'আপনি কেমন আছেন?',
      english: 'How are you?'
    }
    // Add more
  ],
  german: [
    {
      german: 'Hallo',
      bangla: 'হালো',
      meaning: 'হ্যালো',
      english: 'Hello'
    },
    {
      german: 'Wie geht es dir?',
      bangla: 'ভি গেট এস দিয়া?',
      meaning: 'তুমি কেমন আছো?',
      english: 'How are you?'
    }
    // Add more
  ]
};

function renderVocabulary(language) {
  conversationArea.innerHTML = '';
  const entries = vocabulary[language] || [];
  entries.forEach(item => {
    const block = document.createElement('div');
    block.className = 'conversation-block';
    if (document.body.classList.contains('dark-mode')) {
      block.classList.add('dark-mode');
    }

    const langText = Object.keys(item)[0]; // 'russian' or 'german'
    block.innerHTML = `
      <p><strong>${langText.toUpperCase()}:</strong> ${item[langText]}</p>
      <p><strong>Bangla Pronunciation:</strong> ${item.bangla}</p>
      <p><strong>Bangla Meaning:</strong> ${item.meaning}</p>
      <p><strong>English Translation:</strong> ${item.english}</p>
    `;
    conversationArea.appendChild(block);
  });
}

languageSelect.addEventListener('change', () => {
  renderVocabulary(languageSelect.value);
});

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const blocks = document.querySelectorAll('.conversation-block');
  blocks.forEach(block => block.classList.toggle('dark-mode'));
  modeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Initial render
renderVocabulary(languageSelect.value);
