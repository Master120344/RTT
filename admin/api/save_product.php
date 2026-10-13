<?php
$data = json_decode(file_get_contents("php://input"), true);

file_put_contents("../../products.txt", json_encode($data) . PHP_EOL, FILE_APPEND);

echo json_encode(["status"=>"ok"]);
