<?php
// Start the session
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 0);
$targetdir = '/var/www/html/deepnec-2.0/tmp/';
$namer=microtime(true);
// Sequence
$sequenceTargetfile = $targetdir.$namer.".fasta";

$typeSeq=$_POST['typeSeq'];



$numberSeq=0;

function testFasta($fastaText) {
    $checkPass  = true;
    $protSeq = false;
    $nuclSeq = false;
    $fastasequences = $fastaText;
    $checkStatus = 0;

    global $numberSeq;

    $sequences = explode("\n",$fastasequences);

    if(sizeof($sequences)>1){

        $isFastaHeader = false;
        $protSeq = false;
        $nuclSeq = false;
        $nucleotideRegex= "/^[ATGCN]*$/";
        $aminoacidRegex= "/^[ILVFMCAGPTSYWQNHEDKRXUBZ]+[\*]*$/";

        $firstLine =trim($sequences[0]);

        if($firstLine[0]=='>'){

                $numberSeq= $numberSeq + 1;

            if(preg_match($nucleotideRegex,trim($sequences[1]))){
                $nuclSeq = true;
               
            } else if(preg_match($aminoacidRegex,trim($sequences[1]))){
                $protSeq = true;
                
            } else{
               
                $checkPass = false;
            }

            if($checkPass ){

                $sequencestatus = 1;

                for ($i = 1; $i < sizeof($sequences); $i++) {

                    $fastaLine = trim($sequences[$i]);

                    if(strlen($fastaLine) == 0 && $sequencestatus == 0){

                        $sequencestatus = 0;

                    } else if($fastaLine[0]=='>' && $sequencestatus != 1){

                        $sequencestatus = 1;

                            $numberSeq= $numberSeq + 1;


                    } else if($nuclSeq && preg_match($nucleotideRegex,$fastaLine)  && $sequencestatus > 0){

                        $isFastaHeader = true;
                        $sequencestatus = 2;

                    } else if($protSeq && preg_match($aminoacidRegex,$fastaLine)  && $sequencestatus > 0){

                        $isFastaHeader = true;
                        $sequencestatus = 2;
                      
                    } else if(strlen($fastaLine) == 0 && $sequencestatus > 1){

                        $sequencestatus = 0;

                    } else {

                        $checkPass  = false;
                       
                        break;
                    }
                }
            }

            if(!$checkPass ){
               
            }

        } else {
            $checkPass  = false;
           
        }
    }

    if($nuclSeq){
        $checkStatus = 2;
    } else if($protSeq){
        $checkStatus = 1;
    }

    if($checkPass){
        $checkStatus += 5;
    }

    return $checkStatus;
}

$Sequence= "";
$proceed = false;
$proceedSeq=false;
$errorFasta = 0;
$correctFasta=0;

 if($typeSeq == "File") {
    if (move_uploaded_file($_FILES['sequence']['tmp_name'], $sequenceTargetfile)) {
        $Sequence = file_get_contents($sequenceTargetfile);
    } else {
        // file upload failed
    }
} else if ($typeSeq == "text") {
    $Sequence = $_POST["sequence"];

} else if ($typeSeq=="Acc"){
     $proceedSeq=true;
 }


$correctFasta = testFasta($Sequence);

if($correctFasta >5){
    $proceedSeq=true;
}

$proceed=$proceedSeq;
if(!$proceedSeq){
    $errorFasta = 1;
}

unlink($sequenceTargetfile);

if($proceed){
    if($numberSeq>10000){
        $errorFasta=2;
    }
}

if($proceed){
    echo("proceed");
} else {
    echo("fastaerror-".$errorFasta);
}

?>



