// সব দেশের ডাটা এখানে ম্যানুয়ালি যোগ করবেন না, data ফোল্ডার থেকে লোড করবেন।

// countries array to know available countries
const availableCountries = ["Russia", "Germany", "France" /* Add more here as needed */];

// একটি অবজেক্টে সব country's data জমা করব
const vocabularyData = {};

// ডাটা ফাইলগুলো থেকে loaded global variables দ্বারা data assign করা হবে
availableCountries.forEach(country => {
  if (window[country]) {
    vocabularyData[country] = window[country];
  } else {
    vocabularyData[country] = [];
  }
});

// 'all' অপশনে সব দেশের data একসাথে দেখানোর জন্য
vocabularyData.all = [];
availableCountries.forEach(country => {
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
  items.forEach(item => {
    grid.appendChild(createCard(item));
  });
}

select.addEventListener('change', e => renderVocab(e.target.value));
window.addEventListener('DOMContentLoaded', () => renderVocab('all'));
