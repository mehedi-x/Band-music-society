<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $data = file_get_contents('php://input');
  $playlist = json_decode($data, true);
  file_put_contents('playlist.json', json_encode($playlist));
  echo "Playlist saved successfully!";
}
?>
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $data = file_get_contents('php://input');
  $playlist = json_decode($data, true);
  file_put_contents('playlist.json', json_encode($playlist));
  echo "Playlist saved successfully!";
}
?>
<?php
if (file_exists('playlist.json')) {
  header('Content-Type: application/json');
  echo file_get_contents('playlist.json');
} else {
  echo json_encode([]);
}
?>
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['song'])) {
  $targetDir = "music/";
  $targetFile = $targetDir . basename($_FILES["song"]["name"]);

  if (move_uploaded_file($_FILES["song"]["tmp_name"], $targetFile)) {
    echo "Song uploaded successfully!";
  } else {
    echo "Error uploading song.";
  }
}
?>
