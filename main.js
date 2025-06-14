// ===== Speak EU Main Script (Header/Drawer Bug Fixed) =====

let lastState = null;

window.addEventListener('DOMContentLoaded', () => {
  // ডার্ক/লাইট মোড, ভাষা, হোম ইত্যাদি আগের মতোই
  
  // মেনু টগল (ড্রয়ার)
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  const closeMenu = document.getElementById('close-menu');

  menuToggle.addEventListener('click', function() {
    sideMenu.classList.add('active');
  });
  closeMenu.addEventListener('click', function() {
    sideMenu.classList.remove('active');
  });

  // বাইরে ক্লিক করলে ড্রয়ার বন্ধ
  document.addEventListener('click', function(e) {
    if (sideMenu.classList.contains('active') &&
        !sideMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      sideMenu.classList.remove('active');
    }
  });

  // হোমে গেলে আগের পেজ স্মার্ট রিটার্ন
  document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      goHomeWithReturn();
      sideMenu.classList.remove('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  });
  document.getElementById('return-progress-btn').addEventListener('click', function() {
    if (lastState) {
      document.getElementById('homepage-content').style.display = 'none';
      document.getElementById('error-display').style.display = lastState.errorDisplay || 'none';
      document.getElementById('conversation-area').innerHTML = lastState.conversationHtml || '';
      document.getElementById('homepage-return').style.display = 'none';
      lastState = null;
    }
  });

  // ডার্ক/লাইট মোড টগল (প্রয়োজনে)
  const modeToggle = document.getElementById('mode-toggle');
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = '🌙';
  }
  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    modeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});

// হোমে গেলে আগের জায়গা স্টোর করে হোম দেখাও
function goHomeWithReturn() {
  lastState = {
    errorDisplay: document.getElementById('error-display').style.display,
    conversationHtml: document.getElementById('conversation-area').innerHTML
  };
  document.getElementById('error-display').style.display = 'none';
  document.getElementById('conversation-area').innerHTML = '';
  document.getElementById('homepage-content').style.display = 'block';
  document.getElementById('homepage-return').style.display = 'block';
}

// showHomePage ফাংশনেও আপডেট করুন
window.showHomePage = function() {
  goHomeWithReturn();
  lastState = null;
};

// ... (বাকি main.js আগের মতো)
