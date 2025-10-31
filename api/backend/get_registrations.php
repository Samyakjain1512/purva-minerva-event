<?php
header('Content-Type: application/json');
$regs = [];

if (($handle = fopen('registrations.csv', 'r')) !== false) {
    $headers = fgetcsv($handle, 0, ',', '"', "\\");
    while (($row = fgetcsv($handle, 0, ',', '"', "\\")) !== false) {
        $regs[] = [
            'name' => $row[0],
            'email' => $row[1],
            'event_id' => $row[2]
        ];
    }
    fclose($handle);
}
echo json_encode($regs);
?>