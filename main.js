// ===== Speak EU Main Script (Home/Return logicসহ) =====

// আগের সব ভ্যারিয়েবল ও ফাংশন ঠিক থাকবে

let lastState = null; // আগের অবস্থান হোমে যাওয়ার আগে স্টোর হবে

window.addEventListener('DOMContentLoaded', () => {
  // ... আগের theme/lang/menu/homelink ফাংশন
  document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // সব হাইড এবং হোমে দেখাও
      goHomeWithReturn();
      const sideMenu = document.getElementById('side-menu');
      if (sideMenu) sideMenu.classList.remove('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  });
  // Return প্রগ্রেস বাটন ইভেন্ট
  document.getElementById('return-progress-btn').addEventListener('click', function() {
    if (lastState) {
      // আগের স্টেট ফিরিয়ে দাও
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
  // সব হাইড
  document.getElementById('error-display').style.display = 'none';
  document.getElementById('conversation-area').innerHTML = '';
  document.getElementById('homepage-content').style.display = 'block';
  document.getElementById('homepage-return').style.display = 'block';
}

// showHomePage ফাংশনেও আপডেট করুন
window.showHomePage = function() {
  goHomeWithReturn();
  lastState = null; // নতুন হোমে গেলে রিটার্ন নেই
};

// বাকি সমস্ত আগের main.js ফাংশন ঠিক থাকবে
// ... (renderVocabulary, folders, error, static page, ইত্যাদি)
