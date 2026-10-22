<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$animal = is_array($data) && isset($data['animal']) && is_string($data['animal']) ? trim($data['animal']) : '';
$movie = is_array($data) && isset($data['movie']) && is_string($data['movie']) ? trim($data['movie']) : '';
if ($animal === '' || strlen($animal) > 160 || $movie === '' || strlen($movie) > 320) {
    http_response_code(400);
    echo json_encode(['error' => 'Completa ambos campos (máximo 40 y 80 caracteres).']);
    exit;
}

$record = ['animal' => $animal, 'movie' => $movie, 'at' => gmdate('c')];
$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
$file = __DIR__ . DIRECTORY_SEPARATOR . 'events.jsonl';
if (file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar el evento.']);
    exit;
}
http_response_code(201);
echo json_encode(['ok' => true]);
