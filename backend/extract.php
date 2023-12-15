<?php


require("config.php");
session_start();
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(0);

$namer = $_POST['namer'];
// $namer='1625254239391';
$id = $_POST['id'];
// $id='O22544';

$input = "/var/www/html/deepnec-2.0/tmp/" . $namer . ".fasta";
$out = $namer . "_" . $id . "_ss.fasta";
$ott = "/var/www/html/deepnec-2.0/tmp/" . $out;
$cmd = "/usr/bin/python3 /var/www/html/deepnec-2.0/backend/scripts/seq_extract.py " . $input . " " . $id . " " . $ott;

shell_exec($cmd);
$_SESSION['namer']=$namer;
$_SESSION['id']=$id;
print($namer);
?>