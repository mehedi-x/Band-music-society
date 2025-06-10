// ========== Speak EU App: script.js ==========

// Existing code ... (keep your app logic above)

// ===== Random Joke Generator =====
const jokeBtn = document.createElement('button');
jokeBtn.textContent = "😂 Random Joke";
jokeBtn.className = "control-btn";
jokeBtn.style.marginTop = "1.5em";
jokeBtn.style.display = "block";

const jokeDisplay = document.createElement('div');
jokeDisplay.id = "joke-display";
jokeDisplay.style.marginTop = "1em";
jokeDisplay.style.fontSize = "1.1em";

document.addEventListener("DOMContentLoaded", function () {
  // Add the joke button at the end of the home section
  const home = document.getElementById('homepage-content');
  if (home) {
    home.appendChild(jokeBtn);
    home.appendChild(jokeDisplay);
  }
});

jokeBtn.addEventListener('click', async () => {
  jokeBtn.disabled = true;
  jokeBtn.textContent = "Loading...";
  jokeDisplay.textContent = '';
  try {
    // Using the official JokeAPI: https://v2.jokeapi.dev/
    const res = await fetch('https://v2.jokeapi.dev/joke/Any?type=single,twopart&blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
    const data = await res.json();
    let jokeText = '';
    if (data.type === "single") {
      jokeText = data.joke;
    } else if (data.type === "twopart") {
      jokeText = `${data.setup}\n\n<strong>${data.delivery}</strong>`;
    } else {
      jokeText = "Couldn't find a joke! Try again.";
    }
    jokeDisplay.innerHTML = `<div style="padding:1em;background:#f9fafb;border-radius:8px;box-shadow:0 2px 8px #0001;">${jokeText}</div>`;
  } catch (err) {
    jokeDisplay.innerHTML = "😅 Sorry, joke API is not responding. Try again!";
  }
  jokeBtn.disabled = false;
  jokeBtn.textContent = "😂 Random Joke";
});
