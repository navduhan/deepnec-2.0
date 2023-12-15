<?php
session_start();
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(0);




$namer=$_POST['namer'];

$coverage= $_POST['coverage'];
$evalue= $_POST['evalue'];
$identity= $_POST['identity'];
$algorithm= $_POST['algorithm'];
$terms = $_POST['terms'];
$level=$_POST['level2'];
$method=$_POST['method'];
$seqtype = $_POST['seqType'];


$_SESSION['namer']=$namer;
$_SESSION['terms']=$terms;
$_SESSION['coverage']=$coverage;
$_SESSION['evalue']=$evalue;
$_SESSION['identity']=$identity;
$_SESSION['algorithm']=$algorithm;
$_SESSION['level2']=$level;
$_SESSION['method']=$method;
$_SESSION['seqType']=$seqType;


print($namer);





?>