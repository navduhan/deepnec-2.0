<?php
// Start the session
session_start();
require("config.php");
set_include_path(get_include_path() . PATH_SEPARATOR . 'phplib');
include('Net/SSH2.php');

header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(0);


$targetdir = '/var/www/html/deepnec-2.0/tmp/';
$namer=$_POST['namer'];
//$namer='1608122509871';
$out=$namer.".txt";
// Sequence
$sequenceTargetfile = $targetdir.$namer.".fasta";
$input="/tmp/".$namer.".fasta";
$typeSeq=$_POST['typeSeq'];
// $typeSeq='accnNo';
echo $typeSeq;
$term= $_POST['terms'];
echo $term;

$coverage= $_POST['coverage'];
$evalue= $_POST['evalue'];
$identity= $_POST['identity'];
$algorithm= $_POST['algorithm'];
$db=$_POST['db'];

$seqtype=$_POST['seqType'];
$level=$_POST['level'];
$method=$_POST['method'];
$emailAddress= $_POST['emailAddress'];

$_SESSION['namer']=$namer;
$_SESSION['typeSeq']=$typeSeq;
$_SESSION['coverage']=$coverage;
$_SESSION['evalue']=$evalue;
$_SESSION['identity']=$identity;
$_SESSION['algorithm']=$algorithm;
$_SESSION['db']=$db;
$_SESSION['level']=$level;
$_SESSION['method']=$method;
$_SESSION['emailAddress']=$emailAddress;
$_SESSION['seqType']=$seqType;

if($typeSeq == "Acc") {
    if ($db == 'ncbi'){
    $accnNo = $_POST["sequence"];
    // $accnNo='XP_009311342.1';
    exec('efetch -db protein -format fasta -id '.$accnNo.' > '.$sequenceTargetfile);

    }
    else if ($db == 'uniprot') {
        $accnNo = $_POST["sequence"];
        $f = file_get_contents('https://uniprot.org/uniprot/'.$accnNo.'.fasta');
        $fastafile = fopen($sequenceTargetfile, "w") or die("Unable to open file!");
    $fastaTxt = $f;
    fwrite($fastafile, $fastaTxt);
    fclose($fastafile);

    }
} else if($typeSeq == "File") {
    if (move_uploaded_file($_FILES['sequence']['tmp_name'], $sequenceTargetfile)) {
        // file uploaded succeeded
    } else {
        // file upload failed
    }
} else if ($typeSeq == "text") {
    $sequence = $_POST["sequence"];
    $fastafile = fopen($sequenceTargetfile, "w") or die("Unable to open file!");
    $fastaTxt = $sequence;
    fwrite($fastafile, $fastaTxt);
    fclose($fastafile);
}



$ssh = new Net_SSH2('biocluster.usu.edu', 22);
if (!$ssh->login(MY_USER, MY_PASSWORD)) {
    exit('Login Failed');
}

$ssh->setTimeout(false);

$job="sbatch /home/naveen/deepnec/deepnecrun.sl /home/naveen/deepnec".$input." ".$level." ".$term." ".$method." ".$algorithm." /home/naveen/deepnec/tmp/".$namer." ".$out." ".$evalue." ".$coverage." ".$identity." ".$seqType;
print($job);
$ssh->exec($job);
//
//Sending completion email to user\
if ($method === 'DNN'){
    $response=$namer."+".$method."+".$level."+".$term;
}
else{
    $response=$namer."+".$method."+".$level."+".$evalue."+".$coverage."+".$identity;
}
//echo($response);

if($emailAddress != "noemail"){
    $msgEmail =  $message = "Your deepNEC job is done!\nPlease go to https://kaabil.net/deepnec-2.0/results?result=$response to see the results.";
    $msgEmail = wordwrap($msgEmail,70);
    $from = "noreply@deepnec-2.0.kaabil.net";
    $headers = "From: $from"; 
    $mail= mail($emailAddress,"deepnec-2.0 results",$msgEmail,$headers,'-f '.$from);
    if($mail){
    //   echo "Email sent";
    }else{
    //   echo "Something went wrong with Mail."; 
    }
}


// if($emailAddress != "noemail") {
//     $url = 'https://bioinfocore.usu.edu/api/email/send';
//     $from = "bioinfo";
//     $user = "deepNEC";
// // Change the 'the message body', 'subject', and the recipient parts to what you want, run this
// // after you get your results.
//     $message = "Your deepNEC job is done!\nPlease go to https://kaabil.net/deepNEC/deepnec-results.php?result=$response to see the results.";
//     $data = array('messageBody' => $message, 'subjectLine' => 'deepNEC Results', 'recipient' => $emailAddress, 'password' => EMAIL_PASS, 'from' => $from, 'user'=> $user);

// // use key 'http' even if you send the request to https://...
//     $options = array(
//         'http' => array(
//             'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
//             'method'  => 'POST',
//             'content' => http_build_query($data)
//         )
//     );
//     $context  = stream_context_create($options);
//     $result = file_get_contents($url, false, $context);
//     if ($result === FALSE) {
//         echo "Something went wrong with Mail.";
//     }

//     var_dump($result);

// }

print($response);

?>



