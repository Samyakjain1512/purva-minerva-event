<?php
// Suppress warnings & errors in output
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true) ?: [];

// Extract
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$eventId = trim($data['event_id'] ?? '');

// Validate
if (empty($name) || empty($email) || empty($eventId)) {
    echo json_encode(['success' => false, 'error' => 'All fields required']);
    exit;
}

// Write to CSV (with explicit $escape = "\\")
$csvFile = 'registrations.csv';
$csvData = [$name, $email, $eventId];

$handle = fopen($csvFile, 'a');
if ($handle) {
    fputcsv($handle, $csvData, ',', '"', "\\");  // ← Fixed: added escape
    fclose($handle);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save']);
}
?>