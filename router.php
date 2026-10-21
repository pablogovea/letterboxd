<?php
if ($_SERVER['REQUEST_URI'] === '/api/event') {
    require __DIR__ . '/event.php';
    exit;
}
if ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '/index.html') {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}
http_response_code(404);
echo 'Not found';
