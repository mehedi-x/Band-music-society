// ===== Speak EU - Language Learning App JavaScript =====

// Theme: Light/Dark Mode Toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    modeToggle.textContent = '🌙';
    localStorage.setItem('speak_eu_theme', 'dark');
  } else {
    modeToggle.textContent = '☀️';
    localStorage.setItem('speak_eu_theme', 'light');
  }
});

// Persist theme
(function () {
  const theme = localStorage.getItem('speak_eu_theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    modeToggle.textContent = '☀️';
  }
})();

// Side Menu Open/Close
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenuBtn = document.getElementById('close-menu');

menuToggle.addEventListener('click', () => {
  sideMenu.classList.add('open');
  showOverlay();
});
closeMenuBtn.addEventListener('click', () => {
  sideMenu.classList.remove('open');
  hideOverlay();
});

// Overlay for Side Menu
function showOverlay() {
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay active';
    overlay.addEventListener('click', () => {
      sideMenu.classList.remove('open');
      hideOverlay();
    });
    document.body.appendChild(overlay);
  } else {
    overlay.classList.add('active');
  }
}
function hideOverlay() {
  const overlay = document.querySelector('.menu-overlay');
  if (overlay) overlay.classList.remove('active');
}

// Language Selection Example Handler
const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', function () {
  const lang = this.value;
  // You can implement actual language loading logic here
  if (lang) {
    showSuccess(`"${this.options[this.selectedIndex].text}" ভাষাটি নির্বাচন করা হয়েছে!`);
  }
});

// Show simple notification (success)
function showSuccess(msg) {
  let n = document.createElement('div');
  n.textContent = msg;
  n.className = 'p-4 mt-4 mb-4 text-center fade-in';
  n.style.background = '#d1fae5';
  n.style.color = '#065f46';
  n.style.borderRadius = '8px';
  n.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
  n.style.position = 'fixed';
  n.style.top = '85px';
  n.style.left = '50%';
  n.style.transform = 'translateX(-50%)';
  n.style.zIndex = 2000;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}

// Side Menu Navigation Functions
window.showHomePage = function () {
  document.getElementById('homepage-content').style.display = '';
  document.getElementById('folder-controls').style.display = 'none';
  sideMenu.classList.remove('open');
  hideOverlay();
};
window.showAboutPage = function () {
  showSimplePage('ℹ️ আমাদের সম্পর্কে', `Speak EU ইউরোপিয়ান ভাষা শেখার একটি সহজ প্ল্যাটফর্ম। এখানে আপনি সহজে ইউরোপের বিভিন্ন দেশের ভাষা শিখতে পারবেন।`);
};
window.showContactPage = function () {
  showSimplePage('📞 যোগাযোগ', `যোগাযোগ করুন: <a href="mailto:contact@speakeu.com">contact@speakeu.com</a>`);
};
window.showPrivacyPage = function () {
  showSimplePage('🔒 প্রাইভেসি পলিসি', `আপনার তথ্য নিরাপত্তা আমাদের অগ্রাধিকার। কোনো ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে প্রকাশ করা হয় না।`);
};
window.showFoldersPage = function () {
  document.getElementById('homepage-content').style.display = 'none';
  document.getElementById('folder-controls').style.display = '';
  sideMenu.classList.remove('open');
  hideOverlay();
};

function showSimplePage(title, html) {
  const homepage = document.getElementById('homepage-content');
  const folder = document.getElementById('folder-controls');
  homepage.style.display = 'none';
  folder.style.display = 'none';

  let simple = document.getElementById('simple-page');
  if (!simple) {
    simple = document.createElement('section');
    simple.id = 'simple-page';
    simple.className = 'mt-10 bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow-sm fade-in';
    document.getElementById('conversation-area').appendChild(simple);
  }
  simple.innerHTML = `<h3 class="text-lg font-semibold mb-3">${title}</h3><div>${html}</div>`;
  sideMenu.classList.remove('open');
  hideOverlay();
}
window.showHomePage(); // Show homepage by default

// Error Display
function showError(msg) {
  const err = document.getElementById('error-display');
  document.getElementById('error-message').textContent = msg;
  err.style.display = '';
  setTimeout(() => { err.style.display = 'none'; }, 3000);
}

// Folder Controls (Favorites Replacement)
const folderControls = document.getElementById('folder-controls');
const showAllBtn = document.getElementById('show-all-btn');
const showFoldersBtn = document.getElementById('show-folders-btn');
const exportFoldersBtn = document.getElementById('export-folders-btn');
const importFoldersBtn = document.getElementById('import-folders-btn');
const importFoldersInput = document.getElementById('import-folders-input');

// Dummy folder data for demonstration
let folders = [
  { name: "প্রাথমিক শব্দ", items: ["হ্যালো", "ধন্যবাদ", "বিদায়"] },
  { name: "দেশের নাম", items: ["ইতালি", "স্পেন", "জার্মানি"] }
];

// Show all items (for demo)
showAllBtn.onclick = function () {
  showFolderList("সব শব্দ", folders.flatMap(f => f.items));
};
showFoldersBtn.onclick = function () {
  let html = folders.map(f =>
    `<div class="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
      <strong>${f.name}</strong>
      <ul style="padding-left:18px;">
        ${f.items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>`
  ).join("");
  showSimplePage("📁 ফোল্ডার তালিকা", html);
};
function showFolderList(title, list) {
  let html = list.length ? `<ul>${list.map(i => `<li>${i}</li>`).join('')}</ul>` : '<span>কিছুই নেই।</span>';
  showSimplePage(title, html);
}

// Export folders
exportFoldersBtn.onclick = window.exportFolders = function () {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(folders, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute('href', dataStr);
  dl.setAttribute('download', 'folders.json');
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
  showSuccess("ফোল্ডার ডাউনলোড হয়েছে!");
};

// Import folders
importFoldersBtn.onclick = window.importFolders = function () {
  importFoldersInput.click();
};
importFoldersInput.onchange = function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (Array.isArray(data)) {
        folders = data;
        showSuccess("ফোল্ডার ইম্পোর্ট হয়েছে!");
        window.showFoldersPage();
      } else {
        showError("ভুল ফাইল ফরম্যাট।");
      }
    } catch (e) {
      showError("ইম্পোর্ট করতে সমস্যা হয়েছে!");
    }
  };
  reader.readAsText(file);
};

// Reset All Data
window.resetAllData = function () {
  if (confirm("আপনি কি নিশ্চিত? এটি সব ফোল্ডার ও সেটিংস মুছে ফেলবে!")) {
    folders = [];
    localStorage.clear();
    showSuccess("সব ডেটা রিসেট হয়েছে!");
    window.showHomePage();
  }
};

// Hide error on click
document.getElementById('error-display').addEventListener('click', function () {
  this.style.display = 'none';
});
