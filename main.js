// ===== Speak EU Main Script (Home/Return logicসহ) =====

let lastState = null;

window.addEventListener('DOMContentLoaded', () => {
  // ... আগের theme/lang/menu/homelink ফাংশন
  document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      goHomeWithReturn();
      const sideMenu = document.getElementById('side-menu');
      if (sideMenu) sideMenu.classList.remove('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  });
  // Return প্রগ্রেস বাটন ইভেন্ট
  document.getElementById('return-progress-btn').addEventListener('click', function() {
    if (lastState) {
      document.getElementById('homepage-content').style.display = 'none';
      document.getElementById('error-display').style.display = lastState.errorDisplay || 'none';
      document.getElementById('conversation-area').innerHTML = lastState.conversationHtml || '';
      document.getElementById('homepage-return').style.display = 'none';
      lastState = null;
    }
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

// ... (renderVocabulary, folders, error, static page, ইত্যাদি আগের মতোই)
