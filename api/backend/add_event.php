<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Input
$data = json_decode(file_get_contents('php://input'), true) ?: [];

$title       = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$date        = $data['date'] ?? '';
$location    = trim($data['location'] ?? '');

// Validate
if (empty($title) || empty($date) || empty($location)) {
    echo json_encode(['success' => false, 'error' => 'Title, date, and location required']);
    exit;
}

// File path
$csvFile = __DIR__ . '/upcoming_events.csv';

// Create file with header if it doesn't exist
if (!file_exists($csvFile)) {
    $header = "id,title,description,date,location\n";
    file_put_contents($csvFile, $header);
}

// Read all lines to count existing events
$lines = file($csvFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$nextId = count($lines); // First line is header → next ID = count

// Prepare new row
$row = [$nextId, $title, $description, $date, $location];

// Append to CSV
$handle = fopen($csvFile, 'a');
if ($handle && fputcsv($handle, $row, ',', '"', "\\")) {
    fclose($handle);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save event']);
}
?>