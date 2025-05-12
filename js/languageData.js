// Language data storage
const languageData = {
  russian: {
    "Привет! Как дела?": {
      pronunciation: "প্রিভিয়েত! কাক দেলা?",
      bengali: "হ্যালো! কেমন আছো?",
      english: "Hello! How are you?"
    },
    // Add more phrases here
  },
  // Add more languages here
};

// Language information for UI
const languageInfo = {
  russian: { name: "Russian", flag: "🇷🇺" },
  german: { name: "German", flag: "🇩🇪" },
  french: { name: "French", flag: "🇫🇷" },
  // Add more languages here
};

// Export for use in other files
window.languageData = languageData;
window.languageInfo = languageInfo;
