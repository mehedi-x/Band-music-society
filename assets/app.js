const container = document.getElementById("lesson-container");
const progressInfo = document.getElementById("progress-info");
const lang = localStorage.getItem("selectedLanguage");

// প্রগ্রেস আপডেট ফাংশন
function updateProgress(lessonIndex) {
  let progress = JSON.parse(localStorage.getItem("progress") || "{}");
  if (!progress[lang]) progress[lang] = [];
  if (!progress[lang].includes(lessonIndex)) {
    progress[lang].push(lessonIndex);
    localStorage.setItem("progress", JSON.stringify(progress));
  }
  showProgress(progress);
}

// প্রগ্রেস দেখানোর ফাংশন
function showProgress(progress) {
  const completed = progress[lang]?.length || 0;
  progressInfo.innerHTML = `<p>✅ আপনি ${completed} টি পাঠ সম্পন্ন করেছেন</p>`;
}

// লেসন লোড
fetch(`data/${lang}.json`)
  .then(res => res.json())
  .then(data => {
    container.innerHTML = "";
    const progress = JSON.parse(localStorage.getItem("progress") || "{}");
    showProgress(progress);

    data.forEach((item, index) => {
      const quizId = `quiz_${index}`;
      container.innerHTML += `
        <div class="lesson">
          <h3>${item.text} (${item.pronunciation})</h3>
          <p>বাংলা: ${item.translation_bn}</p>
          <p>English: ${item.translation_en}</p>
          <audio controls>
            <source src="assets/audio/${item.audio}" type="audio/mpeg">
          </audio>

          <div class="quiz">
            <p>📝 এই শব্দের ইংরেজি কী?</p>
            <input type="text" id="${quizId}" placeholder="উত্তর লিখুন">
            <button onclick="checkAnswer('${quizId}', '${item.translation_en.toLowerCase()}', ${index})">পাঠ সম্পন্ন করুন</button>
            <p id="${quizId}_result"></p>
          </div>
        </div>
      `;
    });
  })
  .catch(err => {
    container.innerHTML = "ভাষার ডেটা লোড করতে সমস্যা হয়েছে।";
  });

// উত্তর চেক করার ফাংশন
function checkAnswer(inputId, correctAnswer, index) {
  const userAnswer = document.getElementById(inputId).value.toLowerCase().trim();
  const result = document.getElementById(`${inputId}_result`);
  if (userAnswer === correctAnswer) {
    result.innerHTML = "✅ সঠিক উত্তর!";
    result.style.color = "lightgreen";
    updateProgress(index);
  } else {
    result.innerHTML = "❌ ভুল উত্তর। আবার চেষ্টা করুন।";
    result.style.color = "red";
  }
}
