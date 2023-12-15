var predStrategy = "DNN";
var levelType = "Phase4";

function setupOptions() {
  var dnnRadio = document.querySelector("#DNNradio");
  var homologyRadio = document.querySelector("#HomologRadio");
  var hybridRadio = document.querySelector("#HybridRadio");

  var blastRadio = document.querySelector("#blastRadio");
  var diamondRadio = document.querySelector("#diamondRadio");

  var evalueD = document.querySelector("#evalue");
  var covD = document.querySelector("#tfCov");
  var identD = document.querySelector("#tfIdentity");
  var bprogram = document.querySelector("#bprogram");

  var seqType = document.querySelector("#seqtype");

  dnnRadio.addEventListener("click", (e) => {
    blastRadio.disabled = true;
    blastRadio.checked = false;
    diamondRadio.disabled = true;
    diamondRadio.checked = false;
    evalueD.disabled = true;
    covD.disabled = true;
    identD.disabled = true;
    predStrategy = "DNN";
    bprogram.classList.add("d-none");
  });

  homologyRadio.addEventListener("click", (e) => {
    blastRadio.disabled = null;
    blastRadio.checked = false;
    diamondRadio.disabled = null;
    diamondRadio.checked = true;
    evalueD.disabled = null;
    covD.disabled = null;
    identD.disabled = null;
    predStrategy = "homology";
    bprogram.classList.remove("d-none");
    console.log("I changed");
    console.log(predStrategy);
  });
  hybridRadio.addEventListener("click", (e) => {
    blastRadio.disabled = null;
    blastRadio.checked = false;

    diamondRadio.disabled = null;
    diamondRadio.checked = true;
    evalueD.disabled = null;
    covD.disabled = null;
    identD.disabled = null;
    predStrategy = "combined";
    bprogram.classList.remove("d-none");
  });
}
function uncheckPhases() {
  document.querySelector("#phase1radio").checked = false;
  document.querySelector("#phase2radio").checked = false;
  document.querySelector("#phase3radio").checked = false;
  document.querySelector("#phase4radio").checked = false;
}
function setPhase() {
  var phase1Check = document.querySelector("#phase1radio");
  var phase2Check = document.querySelector("#phase2radio");
  var phase3Check = document.querySelector("#phase3radio");
  var phase4Check = document.querySelector("#phase4radio");
  phase1Check.checked = true;
  phase2Check.checked = true;
  phase3Check.checked = true;
  phase4Check.checked = true;

  phase1Check.addEventListener("click", (e) => {
    uncheckPhases();
    phase1Check.checked = true;
    levelType = "Phase1";
    console.log(levelType);
  });

  phase2Check.addEventListener("click", (e) => {
    uncheckPhases();
    phase1Check.checked = true;
    phase2Check.checked = true;
    levelType = "Phase2";
    console.log(levelType);
  });
  phase3Check.addEventListener("click", (e) => {
    uncheckPhases();
    phase1Check.checked = true;
    phase2Check.checked = true;
    phase3Check.checked = true;
    levelType = "Phase3";
    console.log(levelType);
  });
  phase4Check.addEventListener("click", (e) => {
    uncheckPhases();
    phase1Check.checked = true;
    phase2Check.checked = true;
    phase3Check.checked = true;
    phase4Check.checked = true;
    levelType = "Phase4";
    console.log(levelType);
  });
}

function resetAll() {
  $("input#evalue").val("");
  $("input#tfIdentity").val("");
  $("input#tfCov").val("");
  $("input#emailAddress").val("");
  $("input#ncbiAcc").val("");
  document.getElementById("textareaSeq").value = "";
  document.getElementById("evalue").disabled = true;
  document.getElementById("tfIdentity").disabled = true;
  document.getElementById("tfCov").disabled = true;
  document.getElementById("emailAddress").disabled = null;
  document.getElementById("ncbiAccc").disabled = null;
  document.getElementById("uniprotAcc").disabled = null;
  document.getElementById("ncbiAccc").checked = true;
  document.getElementById("uniprotAcc").checked = false;
  // document.getElementById("runPrediction").disabled= null;
  document.getElementById("fileSeq").disabled = null;
  document.getElementById("loadDemoData").disabled = null;
  document.getElementById("DNNradio").disabled = null;
  document.getElementById("HomologRadio").disabled = null;
  document.getElementById("HybridRadio").disabled = null;
  document.getElementById("DNNradio").checked = true;
  document.getElementById("HomologRadio").checked = false;
  document.getElementById("HybridRadio").checked = false;
  document.getElementById("phase1radio").disabled = null;
  document.getElementById("phase2radio").disabled = null;
  document.getElementById("phase3radio").disabled = null;
  document.getElementById("phase3radio").checked = true;
  document.getElementById("phase4radio").disabled = null;
  document.getElementById("phase4radio").checked = true;
  document.getElementById("phase2radio").checked = true;
  document.getElementById("phase1radio").checked = true;
  document.getElementById("diamondRadio").disabled = true;
  document.getElementById("blastRadio").disabled = true;
  document.getElementById("diamondRadio").checked = false;
  document.getElementById("blastRadio").checked = false;
  document.getElementById("terms").value = "nitri";
  document.getElementById("seqtype").value="prot";
}

$("#resetPrediction").click(() => {
  resetAll();
});
$(document).ready(() => {
  resetAll();
  setPhase();
  setupOptions();
});

// var levelType = "Phase4";
// var predStrategy = "homology";

$("#runPrediction").click(function () {
  var validEvalue = 0;
  var validIdentity = 0;
  var validCoverage = 0;
  var validEmail = 0;
  var evalue = $("input#evalue").val();
  var identity = $("input#tfIdentity").val();
  var coverage = $("input#tfCov").val();
  var terms = document.querySelector("#terms").value;
  var seqType = document.querySelector("#seqtype").value;
  var errorFasta = 0;

  var emailAddress = $("input#emailAddress").val();
  var regexEmail = /\S+@\S+\.\S+/;

  if (emailAddress.length > 0) {
    if (regexEmail.test(emailAddress.trim())) {
      validEmail = 1;
    } else {
      //console.log("Email testing failed, not using email");
      validEmail = 2;
      emailAddress = "noemail";
    }
  } else {
    emailAddress = "noemail";
    console.log("Not using email");
  }

  if (identity.length > 0) {
    if (!isNaN(identity)) {
      if (identity > 0 && identity <= 100) {
        validIdentity = 1;
      } else {
        //console.log("Evalue testing failed, using default evalue");
        identity = "30";
        validIdentity = 2;
      }
    } else {
      //console.log("Evalue testing failed, using default evalue");
      identity = "30";
      validIdentity = 2;
    }
  } else {
    identity = "30";
    //console.log("Using default evalue");
  }
  if (coverage.length > 0) {
    if (!isNaN(coverage)) {
      if (coverage > 0 && coverage < 100) {
        validCoverage = 1;
      } else {
        //console.log("Evalue testing failed, using default evalue");
        coverage = "60";
        validCoverage = 2;
      }
    } else {
      //console.log("Evalue testing failed, using default evalue");
      coverage = "60";
      validCoverage = 2;
    }
  } else {
    coverage = "60";
  }

  if (evalue.length > 0) {
    if (!isNaN(evalue)) {
      if (evalue >= 0) {
        validEvalue = 1;
      } else {
        evalue = "1e-10";
        validEvalue = 2;
      }
    } else {
      evalue = "1e-10";
      validEvalue = 2;
    }
  } else {
    evalue = "1e-10";
    // console.log("Using default evalue");
  }
  var fastaAcc = $("input#ncbiAcc").val();
  var fastaFile = document.getElementById("fileSeq").files[0];
  var fastaSequences = $("#textareaSeq").val();
  // console.log(fastaSequences)
  var validFlag = false;
  if (!(fastaAcc || fastaFile || fastaSequences)) {
    
    document.getElementById(
      "deepNECerror"
    ).innerHTML = `Please provide one of these: Accession Number, FASTA file OR FASTA sequence!`;
    $("#errorModal").modal("show");
  } else if (
    (fastaAcc && fastaFile && fastaSequences) ||
    (fastaAcc && fastaFile) ||
    (fastaAcc && fastaSequences) ||
    (fastaSequences && fastaFile)
  ) {
    document.getElementById(
      "deepNECerror"
    ).innerHTML = `Please provide one of these: Accession Number, FASTA file OR FASTA sequence!`;
    $("#errorModal").modal("show");
   
  } else {
    validFlag = true;
  }
  console.log(validFlag);

  var isDiamond = document.getElementById("diamondRadio").checked;
  var isACC = document.getElementById("ncbiAccc").checked;

  console.log(evalue);
  var deepnecFormData = new FormData();
  if (validFlag) {
    if (fastaAcc) {
      deepnecFormData.append("typeSeq", "Acc");
      deepnecFormData.append("sequence", fastaAcc);
    } else if (fastaFile) {
      deepnecFormData.append("typeSeq", "File");
      deepnecFormData.append("sequence", fastaFile);
    } else {
      deepnecFormData.append("typeSeq", "text");
      deepnecFormData.append("sequence", fastaSequences);
    }
  }

  if (isDiamond) {
    deepnecFormData.append("algorithm", "diamond");
    var algorithm = "diamond";
  } else {
    deepnecFormData.append("algorithm", "blast");
    var algorithm = "blast";
  }
  if (isACC) {
    deepnecFormData.append("db", "ncbi");
  } else {
    deepnecFormData.append("db", "uniprot");
  }

  deepnecFormData.append("method", predStrategy);
  deepnecFormData.append("level", levelType);
  deepnecFormData.append("coverage", coverage);
  deepnecFormData.append("identity", identity);
  deepnecFormData.append("evalue", evalue);
  deepnecFormData.append("terms", terms);
  deepnecFormData.append("seqType", seqType);

  var namer = new Date().valueOf();
  deepnecFormData.append("namer", namer);

  // for (let [key, value] of deepnecFormData) {
  //   console.log(`${key}: ${value}`)
  // }

  var response =
    namer +
    "+" +
    predStrategy +
    "+" +
    levelType +
    "+" +
    terms +
    "+" +
    evalue +
    "+" +
    coverage +
    "+" +
    identity +
    "+" +
    algorithm;
  // console.log(response);
  var resultUrl = `<a href="https://kaabil.net/deepnec-2.0/results.html?result=${response}" target="_blank">https://kaabil.net/deepnec-2.0/results.html?result=${response}</a>`;
  console.log(resultUrl);
  var newResult = `https://kaabil.net/deepnec-2.0/results.html?result=${response}`;
  var finishText = `${resultUrl}`;

  document.getElementById("deepNECSubmittionScreen").innerHTML = finishText;

  if (
    validEmail === 2 ||
    validEvalue === 2 ||
    validIdentity === 2 ||
    validCoverage === 2
  ) {
    $("#noEmail").hide();
    $("#noIdentity").hide();
    $("#noCoverage").hide();
    $("#noEvalue").hide();

    if (validEmail === 2) {
      $("#noEmail").show();
    }

    if (validEvalue === 2) {
      $("#noEvalue").show();
    }

    if (validIdentity === 2) {
      $("#noIdentity").show();
    }

    if (validCoverage === 2) {
      $("#noCoverage").show();
    }

    $("#wr-all-prediction").modal();
  } else {
    deepnecFormData.append("emailAddress", emailAddress);
  }

  var validationRequest = new XMLHttpRequest();
  var proceed = false;
  validationRequest.open(
    "POST",
    "https://kaabil.net/deepnec-2.0/backend/fasta_check.php",
    true
  ); //TODO
  validationRequest.onload = function () {
    if (validationRequest.readyState === validationRequest.DONE) {
      if (validationRequest.status === 200) {
        resultTask = validationRequest.response;
        console.log(resultTask);
        if (resultTask.includes("fastaerror")) {
          var errorRaw = resultTask.split("-");
          errorFasta = errorRaw[1].trim();

          console.log(errorFasta);
          if (errorFasta === "1") {
            document.getElementById(
              "deepNECerror"
            ).innerHTML = `Please provide one of these: Accession Number, a valid FASTA file OR valid FASTA sequence!`;
            $("#errorModal").modal("show");
          } 
          else if (errorFasta === "6") {
            document.getElementById(
              "deepNECerror"
            ).innerHTML = `deepNEC accept on 10000 sequences at a time. For more sequences contact us.`;
            $("#errorModal").modal("show");
          }
        } else if (resultTask.includes("proceed")) {
          // console.log("I am here");
          var request = new XMLHttpRequest();
          request.open(
            "POST",
            "https://kaabil.net/deepnec-2.0/backend/run_task.php",
            true
          );

          // $('#onPredictionTask').modal("show");
          document.querySelector("#intermediate").classList.remove("d-none");
          document.querySelector("#mainc").classList.add("d-none");

          request.onload = function () {
            if (request.readyState === request.DONE && request.status === 200) {
              resultTask = request.response;
              console.log(resultTask);
              window.location.replace(newResult);
            }
          };
          request.send(deepnecFormData);
        }
      }
    }
  };
  validationRequest.send(deepnecFormData);
});

$("#loadDemoData").click(function () {
  
  $.get('./assets/js/demo.fa', function(data) {

    data = data.replace(/^\s*$(?:\r\n?|\n)/gm, "");
    document.getElementById("textareaSeq").value = data;
    // console.log(data)
 }, 'text');
  
  
  
  
  
  
});
