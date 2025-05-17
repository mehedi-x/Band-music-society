const grid = document.getElementById('vocab-grid');
const select = document.getElementById('country-select');

function createCard(item, country) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <h3>${country}</h3>
    <p><span class="label">Native:</span> ${item.native}</p>
    <p><span class="label">Pronunciation:</span> ${item.pron}</p>
    <p><span class="label">Bangla Meaning:</span> ${item.meaning}</p>
  `;
  return div;
}

function renderVocab(country) {
  grid.innerHTML = '<p>Loading data...</p>';
  const script = document.createElement('script');
  script.src = `data/${country}.js`;
  script.onload = () => {
    grid.innerHTML = '';
    const data = window[country];
    if (!data || !Array.isArray(data) || data.length === 0) {
      grid.innerHTML = '<p>No data found for selected country.</p>';
      return;
    }
    data.forEach(item => {
      grid.appendChild(createCard(item, country));
    });
  };
  script.onerror = () => {
    grid.innerHTML = '<p>No data found for selected country.</p>';
  };
  document.body.appendChild(script);
}

select.addEventListener('change', e => {
  const country = e.target.value;
  if (country === 'all') {
    grid.innerHTML = '<p>Please select a specific country.</p>';
    return;
  }
  renderVocab(country);
});
