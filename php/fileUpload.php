<?php
$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);



if (!empty($_FILES)) {
    $path = 'font/' . $_FILES['file']['name'];
    echo ($path);
    if (move_uploaded_file($_FILES['file'], $path)) {
        echo("file moved");

    }
} else {
    echo("error!!!");
}