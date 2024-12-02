// Songs Array
const songs = [
  { title: "Song 1", url: "music/song1.mp3" },
  { title: "Song 2", url: "music/song2.mp3" },
  { title: "Song 3", url: "music/song3.mp3" },
];

let currentIndex = 0;
const audioPlayer = document.getElementById("audioPlayer");
const playlist = document.getElementById("playlist");
const currentSongTitle = document.getElementById("currentSongTitle");
const progressBar = document.getElementById("progressBar");
const searchInput = document.getElementById("searchInput");

// Load Song
function loadSong(index) {
  const song = songs[index];
  audioPlayer.src = song.url;
  currentSongTitle.textContent = `Now Playing: ${song.title}`;
  highlightCurrentSong(index);
}

// Highlight Current Song in Playlist
function highlightCurrentSong(index) {
  const listItems = playlist.querySelectorAll("li");
  listItems.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

// Play/Pause Button
document.getElementById("playPause").addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

// Next Song
document.getElementById("nextSong").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  audioPlayer.play();
});

// Previous Song
document.getElementById("prevSong").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audioPlayer.play();
});

// Volume Control
const volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", (e) => {
  audioPlayer.volume = e.target.value / 100;
});

// Progress Bar Update
audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress}%`;
});

// Search Songs
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('#playlist li').forEach((item) => {
    const isVisible = item.textContent.toLowerCase().includes(searchTerm);
    item.style.display = isVisible ? 'block' : 'none';
  });
});

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Load Playlist
function loadPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      audioPlayer.play();
    });
    playlist.appendChild(li);
  });
}

// Initialize Player
loadPlaylist();
loadSong(currentIndex);
