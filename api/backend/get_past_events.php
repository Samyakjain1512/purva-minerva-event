<?php
header('Content-Type: application/json');
$events = [];
if (($handle = fopen('past_events.csv', 'r')) !== false) {
    $headers = fgetcsv($handle, 0, ',', '"', '\\'); // Explicitly set escape parameter
    while (($data = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
        $events[] = [
            'id' => $data[0],
            'title' => $data[1],
            'description' => $data[2],
            'date' => $data[3],
            'location' => $data[4]
        ];
    }
    fclose($handle);
}
echo json_encode($events);
?>