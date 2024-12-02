<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $data = file_get_contents('php://input');
  $playlist = json_decode($data, true);
  file_put_contents('playlist.json', json_encode($playlist));
  echo "Playlist saved successfully!";
}
?>
