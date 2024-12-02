<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Player</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="player">
    <h1>Music Player</h1>
    <audio id="audioPlayer" controls>
      <source src="music/song1.mp3" type="audio/mp3">
      Your browser does not support the audio tag.
    </audio>
    <div class="controls">
      <button id="prevSong">Previous</button>
      <button id="nextSong">Next</button>
    </div>
    <div id="playlist">
      <h3>Playlist</h3>
      <ul id="playlistItems"></ul>
    </div>
    <form id="savePlaylistForm">
      <button type="submit">Save Playlist</button>
    </form>
    <h3>Upload New Song</h3>
    <form id="uploadForm" enctype="multipart/form-data" method="POST">
      <input type="file" name="song" accept="audio/*">
      <button type="submit">Upload</button>
    </form>
  </div>

  <script>
    const songs = ["music/song1.mp3", "music/song2.mp3", "music/song3.mp3"];
    let currentIndex = 0;
    const audioPlayer = document.getElementById('audioPlayer');
    const playlistItems = document.getElementById('playlistItems');

    // Load first song
    audioPlayer.src = songs[currentIndex];

    // Next song
    document.getElementById('nextSong').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % songs.length;
      audioPlayer.src = songs[currentIndex];
      audioPlayer.play();
    });

    // Previous song
    document.getElementById('prevSong').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      audioPlayer.src = songs[currentIndex];
      audioPlayer.play();
    });

    // Display playlist
    function loadPlaylist() {
      playlistItems.innerHTML = ""; // Clear previous list
      songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `Song ${index + 1}`;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
          currentIndex = index;
          audioPlayer.src = songs[currentIndex];
          audioPlayer.play();
        });
        playlistItems.appendChild(li);
      });
    }
    loadPlaylist();

    // Save playlist
    document.getElementById('savePlaylistForm').addEventListener('submit', (e) => {
      e.preventDefault();
      fetch('save_playlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs }),
      })
        .then((res) => res.text())
        .then((data) => alert(data));
    });

    // Upload new song
    document.getElementById('uploadForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      fetch('upload.php', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.text())
        .then((data) => alert(data));
    });
  </script>
</body>
</html>
