window.onload = function () {
  const savedCountry = localStorage.getItem('selectedCountry');
  const countrySelect = document.getElementById('countrySelect');
  if (savedCountry) {
    countrySelect.value = savedCountry;
    countrySelect.disabled = true;
    loadLessons();
  }
};

function changeCountry() {
  const selected = document.getElementById('countrySelect').value;
  if (selected) {
    localStorage.setItem('selectedCountry', selected);
    document.getElementById('countrySelect').disabled = true;
    loadLessons();
  }
}

// আলাদা আলাদা দেশের lesson ডেটা
const countryLessons = {
  russia: [
    {
      id: 1, russian: "Привет", pronunciation: "প্রিভিয়েত", bangla: "হ্যালো", english: "Hello"
    },
    {
      id: 2, russian: "Спасибо", pronunciation: "স্‌পাসিবা", bangla: "ধন্যবাদ", english: "Thank you"
    }
  ],
  germany: [
    {
      id: 1, russian: "Hallo", pronunciation: "হালো", bangla: "হ্যালো", english: "Hello"
    },
    {
      id: 2, russian: "Danke", pronunciation: "ডাঙ্কে", bangla: "ধন্যবাদ", english: "Thank you"
    }
  ],
  france: [
    {
      id: 1, russian: "Bonjour", pronunciation: "বঁজুর", bangla: "সুপ্রভাত", english: "Good morning"
    },
    {
      id: 2, russian: "Merci", pronunciation: "মের্সি", bangla: "ধন্যবাদ", english: "Thank you"
    }
  ],
  italy: [
    {
      id: 1, russian: "Ciao", pronunciation: "চাও", bangla: "হ্যালো", english: "Hello"
    },
    {
      id: 2, russian: "Grazie", pronunciation: "গ্রাৎসিয়ে", bangla: "ধন্যবাদ", english: "Thank you"
    }
  ],
  spain: [
    {
      id: 1, russian: "Hola", pronunciation: "ওলা", bangla: "হ্যালো", english: "Hello"
    },
    {
      id: 2, russian: "Gracias", pronunciation: "গ্রাসিয়াস", bangla: "ধন্যবাদ", english: "Thank you"
    }
  ]
};

function loadLessons() {
  const country = localStorage.getItem('selectedCountry');
  const allLessons = countryLessons[country] || [];
  const completed = JSON.parse(localStorage.getItem(`completedLessons_${country}`) || '[]');
  const search = document.getElementById('search').value.toLowerCase();

  const lessonList = document.getElementById('lesson-list');
  lessonList.innerHTML = '';

  allLessons.forEach(lesson => {
    const matchesSearch = search === '' || (
      lesson.russian.toLowerCase().includes(search) ||
      lesson.pronunciation.toLowerCase().includes(search) ||
      lesson.bangla.toLowerCase().includes(search) ||
      lesson.english.toLowerCase().includes(search)
    );

    if (matchesSearch) {
      const div = document.createElement('div');
      div.className = 'lesson';
      if (completed.includes(lesson.id)) div.classList.add('completed');

      div.innerHTML = `
        <p><strong>Original:</strong> ${lesson.russian}</p>
        <p><strong>Pronunciation:</strong> ${lesson.pronunciation}</p>
        <p><strong>Bangla:</strong> ${lesson.bangla}</p>
        <p><strong>English:</strong> ${lesson.english}</p>
        <button class="complete-btn" onclick="markComplete(${lesson.id})">
          ${completed.includes(lesson.id) ? '✅ Completed' : 'Mark as Complete'}
        </button>
      `;
      lessonList.appendChild(div);
    }
  });

  updateProgressBar(allLessons.length, completed.length);
}

function markComplete(id) {
  const country = localStorage.getItem('selectedCountry');
  let completed = JSON.parse(localStorage.getItem(`completedLessons_${country}`) || '[]');
  if (!completed.includes(id)) {
    completed.push(id);
    localStorage.setItem(`completedLessons_${country}`, JSON.stringify(completed));
  }
  loadLessons();
}

function resetProgress() {
  const country = localStorage.getItem('selectedCountry');
  localStorage.removeItem(`completedLessons_${country}`);
  loadLessons();
}

function updateProgressBar(total, completedCount) {
  const percent = (completedCount / total) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').innerText = `${completedCount} of ${total} lessons completed`;
}
