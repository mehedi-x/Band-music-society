const vocabularyData = {
  Russia,
  Germany,
  France,
  Italy,
};

vocabularyData.all = [];
Object.keys(vocabularyData).forEach(country => {
  vocabularyData[country].forEach(item => {
    vocabularyData.all.push({ ...item, country });
  });
});

const select = document.getElementById('country-select');
const grid = document.getElementById('vocab-grid');

function createCard(item) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <h3>${item.country || select.value}</h3>
    <p><span class="label">Native:</span> ${item.native}</p>
    <p><span class="label">Pronunciation:</span> ${item.pron}</p>
    <p><span class="label">Bangla Meaning:</span> ${item.meaning}</p>
  `;
  return div;
}

function renderVocab(country) {
  grid.innerHTML = '';
  const items = vocabularyData[country] || [];
  if (!items.length) {
    grid.innerHTML = '<p>No data found for selected country.</p>';
    return;
  }
  items.forEach(item => grid.appendChild(createCard(item)));
}

select.addEventListener('change', e => renderVocab(e.target.value));
window.addEventListener('DOMContentLoaded', () => renderVocab('all'));
