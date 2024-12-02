<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Player</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f4f4;
    }

    #player {
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .controls button {
      margin: 5px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }

    .controls button:hover {
      background: #0056b3;
    }

    #playlist ul {
      list-style: none;
      padding: 0;
    }

    #playlist ul li {
      margin: 5px 0;
      padding: 5px;
      background: #e9ecef;
      border-radius: 5px;
    }
  </style>
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
      <h3>Your Playlist</h3>
      <ul id="playlistItems">
        <!-- প্লেলিস্টের গানগুলো এখানে দেখাবে -->
      </ul>
    </div>
    <form id="savePlaylistForm">
      <button type="submit">Save Playlist</button>
    </form>
  </div>

  <script>
    const audioPlayer = document.getElementById('audioPlayer');
    const playlistItems = document.getElementById('playlistItems');
    const savePlaylistForm = document.getElementById('savePlaylistForm');

    let songs = ["music/song1.mp3", "music/song2.mp3", "music/song3.mp3"];
    let currentIndex = 0;

    // Load the first song
    audioPlayer.src = songs[currentIndex];

    // Next song functionality
    document.getElementById('nextSong').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % songs.length;
      audioPlayer.src = songs[currentIndex];
      audioPlayer.play();
    });

    // Previous song functionality
    document.getElementById('prevSong').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      audioPlayer.src = songs[currentIndex];
      audioPlayer.play();
    });

    // Display playlist
    function loadPlaylist() {
      playlistItems.innerHTML = "";
      songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `Song ${index + 1}`;
        playlistItems.appendChild(li);
      });
    }
    loadPlaylist();

    // Save playlist
    savePlaylistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      fetch('save_playlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs }),
      })
        .then((res) => res.text())
        .then((data) => alert(data));
    });
  </script>
</body>
</html>
