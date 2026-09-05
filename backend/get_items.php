<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174'
];

if (isset($_SERVER['HTTP_ORIGIN']) &&
    in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}

header('Content-Type: application/json');

$file = __DIR__ . '/data/product.json';

if (!file_exists($file)) {
    http_response_code(500);
    echo json_encode(['error' => 'Product data unavailable']);
    exit;
}

$data = file_get_contents($file);

if ($data === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to read product data']);
    exit;
}

echo $data;
