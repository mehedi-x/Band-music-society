// Country persist feature
window.onload = function () {
  const savedCountry = localStorage.getItem('selectedCountry');
  const countrySelect = document.getElementById('countrySelect');
  if (savedCountry) {
    countrySelect.value = savedCountry;
    countrySelect.disabled = true;
  }
  loadLessons();
};

function changeCountry() {
  const selected = document.getElementById('countrySelect').value;
  if (selected) {
    localStorage.setItem('selectedCountry', selected);
    document.getElementById('countrySelect').disabled = true;
    loadLessons();
  }
}

// Dummy lessons (you can later load by country too)
const lessons = [
  {
    id: 1,
    russian: "Привет, как дела?",
    pronunciation: "প্রিভিয়েত, কাক দেলা?",
    bangla: "হ্যালো, কেমন আছেন?",
    english: "Hello, how are you?",
    category: "greetings"
  },
  {
    id: 2,
    russian: "Спасибо большое!",
    pronunciation: "স্‌পাসিবা বাল্‌শোয়ে!",
    bangla: "খুব ধন্যবাদ!",
    english: "Thank you very much!",
    category: "greetings"
  },
  {
    id: 3,
    russian: "Где туалет?",
    pronunciation: "গ্‌দে তুয়ালেত?",
    bangla: "টয়লেট কোথায়?",
    english: "Where is the toilet?",
    category: "daily"
  },
  {
    id: 4,
    russian: "Сколько это стоит?",
    pronunciation: "স্কল্‌কা এইতা স্তইত?",
    bangla: "এটার দাম কত?",
    english: "How much is this?",
    category: "shopping"
  },
  {
    id: 5,
    russian: "Я не понимаю",
    pronunciation: "ইয়া নে পনিমায়ু",
    bangla: "আমি বুঝতে পারছি না",
    english: "I don't understand",
    category: "emergency"
  }
];

const lessonList = document.getElementById('lesson-list');

function loadLessons() {
  lessonList.innerHTML = '';
  const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  lessons.forEach(lesson => {
    const matchesSearch = search === '' || (
      lesson.russian.toLowerCase().includes(search) ||
      lesson.pronunciation.toLowerCase().includes(search) ||
      lesson.bangla.toLowerCase().includes(search) ||
      lesson.english.toLowerCase().includes(search)
    );

    const matchesCategory = category === 'all' || lesson.category === category;

    if (matchesSearch && matchesCategory) {
      const div = document.createElement('div');
      div.className = 'lesson';
      if (completed.includes(lesson.id)) div.classList.add('completed');

      div.innerHTML = `
        <p><strong>Russian:</strong> ${lesson.russian}</p>
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

  updateProgressBar();
}

function markComplete(id) {
  let completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
  if (!completed.includes(id)) {
    completed.push(id);
    localStorage.setItem('completedLessons', JSON.stringify(completed));
  }
  loadLessons();
}

function resetProgress() {
  localStorage.removeItem('completedLessons');
  loadLessons();
}

function updateProgressBar() {
  const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]');
  const total = lessons.length;
  const percent = (completed.length / total) * 100;

  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').innerText = `${completed.length} of ${total} lessons completed`;
}
