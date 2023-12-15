
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var result = getUrlVars()


var data = result['result'].split("+")

// console.log(data)

function jq( myid ) {
 
    return "#" + myid.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
 
}

function sidStuff() {
    var queuedJobs = [];
    const jobDropdownButton = document.querySelector("#jobdropdown-button");
    const jobDropdown = document.querySelector("#jobdropdown");
    const pred = document.querySelector("#pred-task");
    const predText = document.querySelector("#pred-text");
    document.querySelectorAll(".sec-struct").forEach(element =>{
        // console.log("Hello");
        element.addEventListener('click', e => {
            let sid = element.getAttribute('id').split("-")[1];
            let namer= data[0];
            console.log(sid);
            let sFormData = new FormData();
            sFormData.append('namer', namer);
            sFormData.append('id', sid);
            let response = namer + "+" + sid;
            console.log(response);
            const newQueuedJob = {
                name: sid,
                id: response
            };
            queuedJobs.push(newQueuedJob);
            if (queuedJobs.length) {
                jobDropdownButton.classList.remove("d-none");
                pred.classList.remove("d-none");
            }
            console.log(queuedJobs);

            element.setAttribute('disabled', 'true');
            const li = document.createElement("li");
            const newJob = document.createElement("a");
            newJob.appendChild(document.createTextNode("Secondary Structure - " +
                newQueuedJob.name));
            newJob.classList.add("dropdown-item");
            newJob.classList.add("pending");
            newJob.href =
                `https://bioinfo.usu.edu/deepnec-2.0/backend/ss_results.php?result=${newQueuedJob.id}`;
            newJob.id = newQueuedJob.name;
            newJob.target = '_blank';
            console.log(newJob);
            li.append(newJob)
            jobDropdown.appendChild(li);
            let resultUrl = `https://bioinfo.usu.edu/deepnec-2.0/backend/ss_results.php?result=${response}`;
            $.ajax({

                url: "https://bioinfo.usu.edu/deepnec-2.0/backend/extract.php",
                data: sFormData,
                processData: false,
                contentType: false,
                type: "POST",
               
                success: function(response) {
                    console.log(response);
                    
                    let runUrl =
                        `https://bioinfo.usu.edu/deepnec-2.0/backend/ss_prediction.php`;
                    $.get(runUrl, function(data) {
                        console.log()
                        let jobAnchor = document.querySelector(`#${sid}`);
                        console.log(jobAnchor)
                            jobAnchor.classList.remove("pending");
                            jobAnchor.classList.add("success");
                            jobAnchor.setAttribute("target", "_blank");
                            window.open(jobAnchor);
                        // ak = `<a href=${resultUrl} target="_blank"> View</a>`;
                        // element.setAttribute('class', 'btn btn-sm deepnec-btn-2')
                        // element.innerHTML=ak;

                        // window.open(`https://bioinfo.usu.edu/deepNEC/test.php?result=${response}`, '_blank');
                    });

                }


            });


    });
    });  
}




$(document).ready(function () {

    var phase = data[2];
    var filer = data[0];
    var terms = data[3];
    var method = data[1];
    var clicks = 0;


if (method ==='DNN'){
    $("#download1").click(function(){
        exportData("p1Table", "Phase1_DNN_results.txt")
            });
    
    $("#download2").click(function(){
        exportData("p2Table", "Phase2__DNN_results.txt")
            });
    $("#download3").click(function(){
           
        exportData("p3Table", "Phase3_DNN_results.txt")
        
     });
    
     $("#download4").click(function(){
        exportData("p4Table", "Phase4_DNN_results.txt")
            });
if (phase ==='Phase1'){
    document.querySelector("#phase1").innerHTML="Phase 1 Results";
    document.querySelector("#phase2predict").classList.remove("d-none");
    document.querySelector("#phase1").classList.remove("deepnec-btn-1");
    document.querySelector("#phase1").classList.add("deepnec-btn-3");
    populateTable("./tmp/"+filer+"/Phase_1_dnn_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
    document.querySelector("#download1").classList.remove("d-none");
    document.querySelector("#info3").classList.add("d-none");
    document.querySelector("#sl1").classList.remove("d-none");
    document.querySelector("#sl3").classList.add("d-none");
   
} 

if (phase ==='Phase2'){
    document.querySelector("#phase2").classList.remove("d-none");
    document.querySelector("#phase2").classList.remove("deepnec-btn-1");
    document.querySelector("#phase2").classList.add("deepnec-btn-3");
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p3Table").classList.add("d-none");
    document.querySelector("#p4Table").classList.add("d-none");
    document.querySelector("#phase2").innerHTML="Phase 2 Results";
    document.querySelector("#phase3predict").classList.remove("d-none");
    populateTable("./tmp/"+filer+"/Phase_2_dnn_log.txt", "#p2Table", 'Phase2', terms, sidStuff)
    document.querySelector("#download2").classList.remove("d-none");
    document.querySelector("#info3").classList.add("d-none");
    document.querySelector("#sl1").classList.remove("d-none");
    document.querySelector("#sl3").classList.add("d-none");

}

if (phase ==='Phase3'){
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p2Table").classList.add("d-none");
    document.querySelector("#p4Table").classList.add("d-none");
    document.querySelector("#phase2").classList.remove("d-none");
    document.querySelector("#phase3").classList.remove("d-none");
    document.querySelector("#phase3").innerHTML="Phase 3 Results";
    document.querySelector("#phase3").classList.remove("deepnec-btn-1");
    document.querySelector("#phase3").classList.add("deepnec-btn-3");
    document.querySelector("#phase4predict").classList.remove("d-none");
    populateTable("./tmp/"+filer+"/Phase_3_dnn_log.txt", "#p3Table", 'Phase3', terms, sidStuff);
    document.querySelector("#download3").classList.remove("d-none");
    document.querySelector("#info3").classList.remove("d-none");
    document.querySelector("#sl3").classList.remove("d-none");
    document.querySelector("#sl1").classList.add("d-none");
}

if (phase ==='Phase4'){
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p2Table").classList.add("d-none");
    document.querySelector("#p3Table").classList.add("d-none");
    document.querySelector("#phase2").classList.remove("d-none");
    document.querySelector("#phase3").classList.remove("d-none");
    document.querySelector("#phase4").classList.remove("d-none");
    document.querySelector("#phase4").innerHTML="Phase 4 Results";
    document.querySelector("#phase4").classList.remove("deepnec-btn-1");
    document.querySelector("#phase4").classList.add("deepnec-btn-3");
    if (terms === 'nitri'){
        populateTable("./tmp/"+filer+"/Phase_4_nitri_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'nfix'){
        populateTable("./tmp/"+filer+"/Phase_4_nfix_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'assim'){
        populateTable("./tmp/"+filer+"/Phase_4_assim_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dissim'){
        populateTable("./tmp/"+filer+"/Phase_4_dissimilarity_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'denitri'){
        populateTable("./tmp/"+filer+"/Phase_4_denitri_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'addn'){
        populateTable("./tmp/"+filer+"/Phase_4_addn_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'ddn'){
        populateTable("./tmp/"+filer+"/Phase_4_ddn_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dd'){
        populateTable("./tmp/"+filer+"/Phase_4_dd_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dn'){
        populateTable("./tmp/"+filer+"/Phase_4_dn_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    
    document.querySelector("#download4").classList.remove("d-none");
    document.querySelector("#info3").classList.add("d-none");
    document.querySelector("#sl3").classList.remove("d-none");
    document.querySelector("#sl1").classList.add("d-none");
}


$("#phase1").click(function () {
    document.querySelector("#phase1").innerHTML="Phase 1 Results";
    document.querySelector("#phase2").innerHTML="View Phase 2 Results";
    document.querySelector("#phase3").innerHTML="View Phase 3 Results";
    document.querySelector("#phase4").innerHTML="View Phase 4 Results";
    document.querySelector("#phase3predict").classList.add("d-none");
    document.querySelector("#phase4predict").classList.add("d-none");
    document.querySelector("#phase1").classList.remove("deepnec-btn-1");
    document.querySelector("#phase1").classList.add("deepnec-btn-3");
    document.querySelector("#p1Table").classList.remove("d-none");
    document.querySelector("#p2Table").classList.add("d-none");
    document.querySelector("#p3Table").classList.add("d-none");
    document.querySelector("#p4Table").classList.add("d-none");
    document.querySelector("#phase2").classList.remove("deepnec-btn-3");
    document.querySelector("#phase2").classList.add("deepnec-btn-1");
    document.querySelector("#phase3").classList.remove("deepnec-btn-3");
    document.querySelector("#phase3").classList.add("deepnec-btn-1");
    document.querySelector("#phase4").classList.remove("deepnec-btn-3");
    document.querySelector("#phase4").classList.add("deepnec-btn-1");
    populateTable("./tmp/"+filer+"/Phase_1_dnn_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
    if (phase==="Phase1"){
        document.querySelector("#phase2predict").classList.remove("d-none");
    }
    document.querySelector("#download1").classList.remove("d-none");
    document.querySelector("#download2").classList.add("d-none");
    document.querySelector("#download3").classList.add("d-none");
    document.querySelector("#download4").classList.add("d-none");
    document.querySelector("#info3").classList.add("d-none");
    document.querySelector("#sl1").classList.remove("d-none");
    document.querySelector("#sl3").classList.add("d-none");
  
   
});

$("#phase2").click(function () {
    document.querySelector("#phase1").innerHTML="View Phase 1 Results";
    document.querySelector("#phase2").innerHTML="Phase 2 Results";
    document.querySelector("#phase3").innerHTML="View Phase 3 Results";
    document.querySelector("#phase4").innerHTML="View Phase 4 Results";
    document.querySelector("#phase2predict").classList.add("d-none");
    document.querySelector("#phase4predict").classList.add("d-none");
    document.querySelector("#phase2").classList.remove("deepnec-btn-1");
    document.querySelector("#phase2").classList.add("deepnec-btn-3");
    document.querySelector("#p2Table").classList.remove("d-none");
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p3Table").classList.add("d-none");
    document.querySelector("#p4Table").classList.add("d-none");
    document.querySelector("#phase1").classList.remove("deepnec-btn-3");
    document.querySelector("#phase1").classList.add("deepnec-btn-1");
    document.querySelector("#phase3").classList.remove("deepnec-btn-3");
    document.querySelector("#phase3").classList.add("deepnec-btn-1");
    document.querySelector("#phase4").classList.remove("deepnec-btn-3");
    document.querySelector("#phase4").classList.add("deepnec-btn-1");
    populateTable("./tmp/"+filer+"/Phase_2_dnn_log.txt", "#p2Table", 'Phase2', terms, sidStuff);
    if (phase==="Phase2"){
        document.querySelector("#phase3predict").classList.remove("d-none");
    }
    document.querySelector("#download2").classList.remove("d-none");
    document.querySelector("#download1").classList.add("d-none");
    document.querySelector("#download3").classList.add("d-none");
    document.querySelector("#download4").classList.add("d-none");
    document.querySelector("#info3").classList.add("d-none");
    document.querySelector("#sl1").classList.remove("d-none");
    document.querySelector("#sl3").classList.add("d-none");
   

    
});

$("#phase3").click(function () {
 
    document.querySelector("#phase1").innerHTML="View Phase 1 Results";
    document.querySelector("#phase2").innerHTML="View Phase 2 Results";
    document.querySelector("#phase4").innerHTML="View Phase 4 Results";
    document.querySelector("#phase3").innerHTML="Phase 3 Results";
    document.querySelector("#phase2predict").classList.add("d-none");
    document.querySelector("#phase3predict").classList.add("d-none");
    document.querySelector("#phase3").classList.remove("deepnec-btn-1");
    document.querySelector("#phase3").classList.add("deepnec-btn-3");
    document.querySelector("#p3Table").classList.remove("d-none");
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p2Table").classList.add("d-none");
    document.querySelector("#p4Table").classList.add("d-none");
    document.querySelector("#phase1").classList.remove("deepnec-btn-3");
    document.querySelector("#phase1").classList.add("deepnec-btn-1");
    document.querySelector("#phase2").classList.remove("deepnec-btn-3");
    document.querySelector("#phase2").classList.add("deepnec-btn-1");
    document.querySelector("#phase4").classList.remove("deepnec-btn-3");
    document.querySelector("#phase4").classList.add("deepnec-btn-1");
    populateTable("./tmp/"+filer+"/Phase_3_dnn_log.txt", "#p3Table", 'Phase3', terms, sidStuff);

    if (phase==="Phase3"){
        document.querySelector("#phase4predict").classList.remove("d-none");
    }
    document.querySelector("#download3").classList.remove("d-none");
    document.querySelector("#download2").classList.add("d-none");
    document.querySelector("#download1").classList.add("d-none");
    document.querySelector("#download4").classList.add("d-none");
    document.querySelector("#info3").classList.remove("d-none");
    document.querySelector("#sl3").classList.remove("d-none");
    document.querySelector("#sl1").classList.add("d-none");

   
});


$("#phase4").on("click", function (event) {
    document.querySelector("#phase1").innerHTML="View Phase 1 Results";
    document.querySelector("#phase2").innerHTML="View Phase 2 Results";
    document.querySelector("#phase3").innerHTML="View Phase 3 Results";
    document.querySelector("#phase4").innerHTML="Phase 4 Results";
    document.querySelector("#phase4predict").classList.add("d-none");
    document.querySelector("#phase2predict").classList.add("d-none");
    document.querySelector("#phase3predict").classList.add("d-none");
    document.querySelector("#phase3").classList.remove("deepnec-btn-1");
    document.querySelector("#phase3").classList.add("deepnec-btn-3");
    document.querySelector("#p4Table").classList.remove("d-none");
    document.querySelector("#p1Table").classList.add("d-none");
    document.querySelector("#p2Table").classList.add("d-none");
    document.querySelector("#p3Table").classList.add("d-none");
    document.querySelector("#phase1").classList.remove("deepnec-btn-3");
    document.querySelector("#phase1").classList.add("deepnec-btn-1");
    document.querySelector("#phase2").classList.remove("deepnec-btn-3");
    document.querySelector("#phase2").classList.add("deepnec-btn-1");
    document.querySelector("#phase3").classList.remove("deepnec-btn-3");
    document.querySelector("#phase3").classList.add("deepnec-btn-1");
    document.querySelector("#phase4").classList.remove("deepnec-btn-1");
    document.querySelector("#phase4").classList.add("deepnec-btn-3");
    // populateTable("./tmp/"+filer+"/Phase_4_log.txt", "#p4Table", 'Phase4');


    console.log(terms);
    if (terms === 'nitri'){
        populateTable("./tmp/"+filer+"/Phase_4_nitri_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'nfix'){
        populateTable("./tmp/"+filer+"/Phase_4_nfix_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'assim'){
        populateTable("./tmp/"+filer+"/Phase_4_assim_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dissim'){
        populateTable("./tmp/"+filer+"/Phase_4_dissimilarity_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'denitri'){
        populateTable("./tmp/"+filer+"/Phase_4_denitri_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'addn'){
        populateTable("./tmp/"+filer+"/Phase_4_addn_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'ddn'){
        populateTable("./tmp/"+filer+"/Phase_4_ddn_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dd'){
        populateTable("./tmp/"+filer+"/Phase_4_dd_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    if (terms === 'dn'){
        populateTable("./tmp/"+filer+"/Phase_4_dn_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
    }
    document.querySelector("#download4").classList.remove("d-none");
    document.querySelector("#download2").classList.add("d-none");
    document.querySelector("#download3").classList.add("d-none");
    document.querySelector("#download1").classList.add("d-none");
    document.querySelector("#info3").classList.add("d-none");     
    document.querySelector("#sl3").classList.remove("d-none");
    document.querySelector("#sl1").classList.add("d-none"); 
});
}




if (method === 'homology'){

    $("#download1").click(function(){
        exportData("p1Table", "Phase1_Homology_results.txt")
            });
    
    $("#download2").click(function(){
        exportData("p2Table", "Phase2_Homology_results.txt")
            });
    $("#download3").click(function(){
           
        exportData("p3Table", "Phase3_Homology_results.txt")
        
     });
    
     $("#download4").click(function(){
        exportData("p4Table", "Phase4_Homology_results.txt")
            });

    if (phase ==='Phase1'){
        document.querySelector("#phase1").innerHTML="Phase 1 Results";
        document.querySelector("#phase2predict").classList.remove("d-none");
        document.querySelector("#phase1").classList.remove("deepnec-btn-1");
        document.querySelector("#phase1").classList.add("deepnec-btn-3");
        populateHomology("./tmp/"+filer+"/Phase_1_blast_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
        document.querySelector("#download1").classList.remove("d-none");
        document.querySelector("#sl1").classList.remove("d-none");
        document.querySelector("#sl3").classList.add("d-none");
 
       
    } 
    
    if (phase ==='Phase2'){
        document.querySelector("#phase2").classList.remove("d-none");
        document.querySelector("#phase2").classList.remove("deepnec-btn-1");
        document.querySelector("#phase2").classList.add("deepnec-btn-3");
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p3Table").classList.add("d-none");
        document.querySelector("#p4Table").classList.add("d-none");
        document.querySelector("#phase2").innerHTML="Phase 2 Results";
        document.querySelector("#phase3predict").classList.remove("d-none");
        populateHomology("./tmp/"+filer+"/Phase_2_blast_log.txt", "#p2Table", 'Phase2', terms, sidStuff)
        document.querySelector("#download2").classList.remove("d-none");
        document.querySelector("#sl1").classList.remove("d-none");
        document.querySelector("#sl3").classList.add("d-none");
 
    
    }
    
    if (phase ==='Phase3'){
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p2Table").classList.add("d-none");
        document.querySelector("#p4Table").classList.add("d-none");
        document.querySelector("#phase2").classList.remove("d-none");
        document.querySelector("#phase3").classList.remove("d-none");
        document.querySelector("#phase3").innerHTML="Phase 3 Results";
        document.querySelector("#phase3").classList.remove("deepnec-btn-1");
        document.querySelector("#phase3").classList.add("deepnec-btn-3");
        document.querySelector("#phase4predict").classList.remove("d-none");
        populateHomology("./tmp/"+filer+"/Phase_3_blast_log.txt", "#p3Table", 'Phase3', terms, sidStuff);
        document.querySelector("#download3").classList.remove("d-none");
        document.querySelector("#sl3").classList.remove("d-none");
        document.querySelector("#sl1").classList.add("d-none");
        document.querySelector("#info3").classList.remove("d-none");
   
    }
    
    if (phase ==='Phase4'){
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p2Table").classList.add("d-none");
        document.querySelector("#p3Table").classList.add("d-none");
        document.querySelector("#phase2").classList.remove("d-none");
        document.querySelector("#phase3").classList.remove("d-none");
        document.querySelector("#phase4").classList.remove("d-none");
        document.querySelector("#phase4").innerHTML="Phase 4 Results";
        document.querySelector("#phase4").classList.remove("deepnec-btn-1");
        document.querySelector("#phase4").classList.add("deepnec-btn-3");
        if (terms === 'nitri'){
            populateHomology("./tmp/"+filer+"/Phase_4_nitri_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'nfix'){
            populateHomology("./tmp/"+filer+"/Phase_4_nfix_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'assim'){
            populateHomology("./tmp/"+filer+"/Phase_4_assim_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dissim'){
            populateHomology("./tmp/"+filer+"/Phase_4_dissimilarity_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'denitri'){
            populateHomology("./tmp/"+filer+"/Phase_4_denitri_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'addn'){
            populateHomology("./tmp/"+filer+"/Phase_4_addn_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'ddn'){
            populateHomology("./tmp/"+filer+"/Phase_4_ddn_blast_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dd'){
            populateHomology("./tmp/"+filer+"/Phase_4_dd_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dn'){
            populateHomology("./tmp/"+filer+"/Phase_4_dn_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        document.querySelector("#download3").classList.remove("d-none");
        document.querySelector("#sl3").classList.remove("d-none");
        document.querySelector("#sl1").classList.add("d-none");
        

    }
    
    
    $("#phase1").click(function () {
        document.querySelector("#phase1").innerHTML="Phase 1 Results";
        document.querySelector("#phase2").innerHTML="View Phase 2 Results";
        document.querySelector("#phase3").innerHTML="View Phase 3 Results";
        document.querySelector("#phase4").innerHTML="View Phase 4 Results";
        document.querySelector("#phase3predict").classList.add("d-none");
        document.querySelector("#phase4predict").classList.add("d-none");
        document.querySelector("#phase1").classList.remove("deepnec-btn-1");
        document.querySelector("#phase1").classList.add("deepnec-btn-3");
        document.querySelector("#p1Table").classList.remove("d-none");
        document.querySelector("#p2Table").classList.add("d-none");
        document.querySelector("#p3Table").classList.add("d-none");
        document.querySelector("#p4Table").classList.add("d-none");
        document.querySelector("#phase2").classList.remove("deepnec-btn-3");
        document.querySelector("#phase2").classList.add("deepnec-btn-1");
        document.querySelector("#phase3").classList.remove("deepnec-btn-3");
        document.querySelector("#phase3").classList.add("deepnec-btn-1");
        document.querySelector("#phase4").classList.remove("deepnec-btn-3");
        document.querySelector("#phase4").classList.add("deepnec-btn-1");
        populateHomology("./tmp/"+filer+"/Phase_1_blast_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
        if (phase==="Phase1"){
            document.querySelector("#phase2predict").classList.remove("d-none");
        }
        document.querySelector("#download1").classList.remove("d-none");
        document.querySelector("#download2").classList.add("d-none");
        document.querySelector("#download3").classList.add("d-none");
        document.querySelector("#download4").classList.add("d-none");
        document.querySelector("#sl1").classList.remove("d-none");
        document.querySelector("#sl3").classList.add("d-none");
        document.querySelector("#info3").classList.add("d-none");

    });
    
    $("#phase2").click(function () {
        document.querySelector("#phase1").innerHTML="View Phase 1 Results";
        document.querySelector("#phase2").innerHTML="Phase 2 Results";
        document.querySelector("#phase3").innerHTML="View Phase 3 Results";
        document.querySelector("#phase4").innerHTML="View Phase 4 Results";
        document.querySelector("#phase2predict").classList.add("d-none");
        document.querySelector("#phase4predict").classList.add("d-none");
        document.querySelector("#phase2").classList.remove("deepnec-btn-1");
        document.querySelector("#phase2").classList.add("deepnec-btn-3");
        document.querySelector("#p2Table").classList.remove("d-none");
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p3Table").classList.add("d-none");
        document.querySelector("#p4Table").classList.add("d-none");
        document.querySelector("#phase1").classList.remove("deepnec-btn-3");
        document.querySelector("#phase1").classList.add("deepnec-btn-1");
        document.querySelector("#phase3").classList.remove("deepnec-btn-3");
        document.querySelector("#phase3").classList.add("deepnec-btn-1");
        document.querySelector("#phase4").classList.remove("deepnec-btn-3");
        document.querySelector("#phase4").classList.add("deepnec-btn-1");
        populateHomology("./tmp/"+filer+"/Phase_2_blast_log.txt", "#p2Table", 'Phase2', terms, sidStuff);
        if (phase==="Phase2"){
            document.querySelector("#phase3predict").classList.remove("d-none");
        }
        document.querySelector("#download2").classList.remove("d-none");
        document.querySelector("#download1").classList.add("d-none");
        document.querySelector("#download3").classList.add("d-none");
        document.querySelector("#download4").classList.add("d-none");
        document.querySelector("#sl1").classList.remove("d-none");
        document.querySelector("#sl3").classList.add("d-none");
        document.querySelector("#info3").classList.add("d-none");

    
        
    });
    
    $("#phase3").click(function () {
        document.querySelector("#phase1").innerHTML="View Phase 1 Results";
        document.querySelector("#phase2").innerHTML="View Phase 2 Results";
        document.querySelector("#phase4").innerHTML="View Phase 4 Results";
        document.querySelector("#phase3").innerHTML="Phase 3 Results";
        
        document.querySelector("#phase2predict").classList.add("d-none");
        document.querySelector("#phase3predict").classList.add("d-none");
        document.querySelector("#phase3").classList.remove("deepnec-btn-1");
        document.querySelector("#phase3").classList.add("deepnec-btn-3");
        document.querySelector("#p3Table").classList.remove("d-none");
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p2Table").classList.add("d-none");
        document.querySelector("#p4Table").classList.add("d-none");
        document.querySelector("#phase1").classList.remove("deepnec-btn-3");
        document.querySelector("#phase1").classList.add("deepnec-btn-1");
        document.querySelector("#phase2").classList.remove("deepnec-btn-3");
        document.querySelector("#phase2").classList.add("deepnec-btn-1");
        document.querySelector("#phase4").classList.remove("deepnec-btn-3");
        document.querySelector("#phase4").classList.add("deepnec-btn-1");
        populateHomology("./tmp/"+filer+"/Phase_3_blast_log.txt", "#p3Table", 'Phase3', terms, sidStuff);
    
        if (phase==="Phase3"){
            document.querySelector("#phase4predict").classList.remove("d-none");
        }
        document.querySelector("#download3").classList.remove("d-none");
        document.querySelector("#download2").classList.add("d-none");
        document.querySelector("#download1").classList.add("d-none");
        document.querySelector("#download4").classList.add("d-none");
        document.querySelector("#sl3").classList.remove("d-none");
        document.querySelector("#sl1").classList.add("d-none");
        document.querySelector("#info3").classList.remove("d-none");

    });
    
    $("#phase4").click(function () {
        document.querySelector("#phase1").innerHTML="View Phase 1 Results";
        document.querySelector("#phase2").innerHTML="View Phase 2 Results";
        document.querySelector("#phase3").innerHTML="View Phase 3 Results";
        document.querySelector("#phase4").innerHTML="Phase 4 Results";
        document.querySelector("#phase4predict").classList.add("d-none");
        document.querySelector("#phase2predict").classList.add("d-none");
        document.querySelector("#phase3predict").classList.add("d-none");
        document.querySelector("#phase3").classList.remove("deepnec-btn-1");
        document.querySelector("#phase3").classList.add("deepnec-btn-3");
        document.querySelector("#p4Table").classList.remove("d-none");
        document.querySelector("#p1Table").classList.add("d-none");
        document.querySelector("#p2Table").classList.add("d-none");
        document.querySelector("#p3Table").classList.add("d-none");
        document.querySelector("#phase1").classList.remove("deepnec-btn-3");
        document.querySelector("#phase1").classList.add("deepnec-btn-1");
        document.querySelector("#phase2").classList.remove("deepnec-btn-3");
        document.querySelector("#phase2").classList.add("deepnec-btn-1");
        document.querySelector("#phase3").classList.remove("deepnec-btn-3");
        document.querySelector("#phase3").classList.add("deepnec-btn-1");
        document.querySelector("#phase4").classList.remove("deepnec-btn-1");
        document.querySelector("#phase4").classList.add("deepnec-btn-3");
        // populateTable("./tmp/"+filer+"/Phase_4_log.txt", "#p4Table", 'Phase4');
    
    
        console.log(terms);
        if (terms === 'nitri'){
            populateHomology("./tmp/"+filer+"/Phase_4_nitri_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'nfix'){
            populateHomology("./tmp/"+filer+"/Phase_4_nfix_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'assim'){
            populateHomology("./tmp/"+filer+"/Phase_4_assim_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dissim'){
            populateHomology("./tmp/"+filer+"/Phase_4_dissim_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'denitri'){
            populateHomology("./tmp/"+filer+"/Phase_4_denitri_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'addn'){
            populateHomology("./tmp/"+filer+"/Phase_4_addn_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'ddn'){
            populateHomology("./tmp/"+filer+"/Phase_4_ddn_blast_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dd'){
            populateHomology("./tmp/"+filer+"/Phase_4_dd_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        if (terms === 'dn'){
            populateHomology("./tmp/"+filer+"/Phase_4_dn_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
        }
        document.querySelector("#download4").classList.remove("d-none");
        document.querySelector("#download2").classList.add("d-none");
        document.querySelector("#download3").classList.add("d-none");
        document.querySelector("#download1").classList.add("d-none");
        document.querySelector("#sl3").classList.remove("d-none");
        document.querySelector("#sl1").classList.add("d-none");
        document.querySelector("#info3").classList.add("d-none");

    });
    }

    if (method === 'combined'){
        $("#download1").click(function(){
            exportData("p1Table", "Phase1_consensus_results.txt")
                });
        
        $("#download2").click(function(){
            exportData("p2Table", "Phase2_consensus_results.txt")
                });
        $("#download3").click(function(){
               
            exportData("p3Table", "Phase3_consensus_results.txt")
            
         });
        
         $("#download4").click(function(){
            exportData("p4Table", "Phase4_consensus_results.txt")
                });
        if (phase ==='Phase1'){
            document.querySelector("#phase1").innerHTML="Phase 1 Results";
            document.querySelector("#phase2predict").classList.remove("d-none");
            document.querySelector("#phase1").classList.remove("deepnec-btn-1");
            document.querySelector("#phase1").classList.add("deepnec-btn-3");
            populateCombined("./tmp/"+filer+"/Phase_1_combined_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
            document.querySelector("#download1").classList.remove("d-none");
            document.querySelector("#sl1").classList.remove("d-none");
           
        } 
        
        if (phase ==='Phase2'){
            document.querySelector("#phase2").classList.remove("d-none");
            document.querySelector("#phase2").classList.remove("deepnec-btn-1");
            document.querySelector("#phase2").classList.add("deepnec-btn-3");
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p3Table").classList.add("d-none");
            document.querySelector("#p4Table").classList.add("d-none");
            document.querySelector("#phase2").innerHTML="Phase 2 Results";
            document.querySelector("#phase3predict").classList.remove("d-none");
            populateCombined("./tmp/"+filer+"/Phase_2_combined_log.txt", "#p2Table", 'Phase2', terms, sidStuff)
            document.querySelector("#download2").classList.remove("d-none");
            document.querySelector("#sl1").classList.remove("d-none");

        }
        
        if (phase ==='Phase3'){
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p2Table").classList.add("d-none");
            document.querySelector("#p4Table").classList.add("d-none");
            document.querySelector("#phase2").classList.remove("d-none");
            document.querySelector("#phase3").classList.remove("d-none");
            document.querySelector("#phase3").innerHTML="Phase 3 Results";
            document.querySelector("#phase3").classList.remove("deepnec-btn-1");
            document.querySelector("#phase3").classList.add("deepnec-btn-3");
            document.querySelector("#phase4predict").classList.remove("d-none");
            populateCombined("./tmp/"+filer+"/Phase_3_combined_log.txt", "#p3Table", 'Phase3', terms, sidStuff);
            document.querySelector("#download3").classList.remove("d-none");
            document.querySelector("#sl3").classList.remove("d-none");
            document.querySelector("#info3").classList.remove("d-none");
        }
        
        if (phase ==='Phase4'){
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p2Table").classList.add("d-none");
            document.querySelector("#p3Table").classList.add("d-none");
            document.querySelector("#phase2").classList.remove("d-none");
            document.querySelector("#phase3").classList.remove("d-none");
            document.querySelector("#phase4").classList.remove("d-none");
            document.querySelector("#phase4").innerHTML="Phase 4 Results";
            document.querySelector("#phase4").classList.remove("deepnec-btn-1");
            document.querySelector("#phase4").classList.add("deepnec-btn-3");
            if (terms === 'nitri'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'nfix'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'assim'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dissim'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_blast_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'denitri'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'addn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'ddn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dd'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            
            document.querySelector("#download4").classList.remove("d-none");
            document.querySelector("#sl3").classList.remove("d-none");
            

        }
        $("#phase1").click(function () {
            document.querySelector("#phase1").innerHTML="Phase 1 Results";
            document.querySelector("#phase2").innerHTML="View Phase 2 Results";
            document.querySelector("#phase3").innerHTML="View Phase 3 Results";
            document.querySelector("#phase4").innerHTML="View Phase 4 Results";
            document.querySelector("#phase3predict").classList.add("d-none");
            document.querySelector("#phase4predict").classList.add("d-none");
            document.querySelector("#phase1").classList.remove("deepnec-btn-1");
            document.querySelector("#phase1").classList.add("deepnec-btn-3");
            document.querySelector("#p1Table").classList.remove("d-none");
            document.querySelector("#p2Table").classList.add("d-none");
            document.querySelector("#p3Table").classList.add("d-none");
            document.querySelector("#p4Table").classList.add("d-none");
            document.querySelector("#phase2").classList.remove("deepnec-btn-3");
            document.querySelector("#phase2").classList.add("deepnec-btn-1");
            document.querySelector("#phase3").classList.remove("deepnec-btn-3");
            document.querySelector("#phase3").classList.add("deepnec-btn-1");
            document.querySelector("#phase4").classList.remove("deepnec-btn-3");
            document.querySelector("#phase4").classList.add("deepnec-btn-1");
            populateCombined("./tmp/"+filer+"/Phase_1_combined_log.txt", "#p1Table", 'Phase1', terms, sidStuff);
            if (phase==="Phase1"){
                document.querySelector("#phase2predict").classList.remove("d-none");
            }
            document.querySelector("#download1").classList.remove("d-none");
            document.querySelector("#download2").classList.add("d-none");
            document.querySelector("#download3").classList.add("d-none");
            document.querySelector("#download4").classList.add("d-none");
            document.querySelector("#sl1").classList.remove("d-none");
            document.querySelector("#sl3").classList.add("d-none");
            document.querySelector("#info3").classList.add("d-none");

        });
        
        $("#phase2").click(function () {
            document.querySelector("#phase1").innerHTML="View Phase 1 Results";
            document.querySelector("#phase2").innerHTML="Phase 2 Results";
            document.querySelector("#phase3").innerHTML="View Phase 3 Results";
            document.querySelector("#phase4").innerHTML="View Phase 4 Results";
            document.querySelector("#phase2predict").classList.add("d-none");
            document.querySelector("#phase4predict").classList.add("d-none");
            document.querySelector("#phase2").classList.remove("deepnec-btn-1");
            document.querySelector("#phase2").classList.add("deepnec-btn-3");
            document.querySelector("#p2Table").classList.remove("d-none");
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p3Table").classList.add("d-none");
            document.querySelector("#p4Table").classList.add("d-none");
            document.querySelector("#phase1").classList.remove("deepnec-btn-3");
            document.querySelector("#phase1").classList.add("deepnec-btn-1");
            document.querySelector("#phase3").classList.remove("deepnec-btn-3");
            document.querySelector("#phase3").classList.add("deepnec-btn-1");
            document.querySelector("#phase4").classList.remove("deepnec-btn-3");
            document.querySelector("#phase4").classList.add("deepnec-btn-1");
            populateCombined("./tmp/"+filer+"/Phase_2_combined_log.txt", "#p2Table", 'Phase2', terms, sidStuff);
            if (phase==="Phase2"){
                document.querySelector("#phase3predict").classList.remove("d-none");
            }
            document.querySelector("#download2").classList.remove("d-none");
            document.querySelector("#download1").classList.add("d-none");
            document.querySelector("#download3").classList.add("d-none");
            document.querySelector("#download4").classList.add("d-none");
            document.querySelector("#sl1").classList.remove("d-none");
            document.querySelector("#sl3").classList.add("d-none");
            document.querySelector("#info3").classList.add("d-none");

        });
        
        $("#phase3").click(function () {
            document.querySelector("#phase1").innerHTML="View Phase 1 Results";
            document.querySelector("#phase2").innerHTML="View Phase 2 Results";
            document.querySelector("#phase4").innerHTML="View Phase 4 Results";
            document.querySelector("#phase3").innerHTML="Phase 3 Results";
            
            document.querySelector("#phase2predict").classList.add("d-none");
            document.querySelector("#phase3predict").classList.add("d-none");
            document.querySelector("#phase3").classList.remove("deepnec-btn-1");
            document.querySelector("#phase3").classList.add("deepnec-btn-3");
            document.querySelector("#p3Table").classList.remove("d-none");
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p2Table").classList.add("d-none");
            document.querySelector("#p4Table").classList.add("d-none");
            document.querySelector("#phase1").classList.remove("deepnec-btn-3");
            document.querySelector("#phase1").classList.add("deepnec-btn-1");
            document.querySelector("#phase2").classList.remove("deepnec-btn-3");
            document.querySelector("#phase2").classList.add("deepnec-btn-1");
            document.querySelector("#phase4").classList.remove("deepnec-btn-3");
            document.querySelector("#phase4").classList.add("deepnec-btn-1");
            populateCombined("./tmp/"+filer+"/Phase_3_combined_log.txt", "#p3Table", 'Phase3', terms, sidStuff);
        
            if (phase==="Phase3"){
                document.querySelector("#phase4predict").classList.remove("d-none");
            }
            document.querySelector("#download3").classList.remove("d-none");
            document.querySelector("#download2").classList.add("d-none");
            document.querySelector("#download1").classList.add("d-none");
            document.querySelector("#download4").classList.add("d-none");
            document.querySelector("#sl3").classList.remove("d-none");
            document.querySelector("#sl1").classList.add("d-none");
            document.querySelector("#info3").classList.remove("d-none");

        });
        
        $("#phase4").click(function () {
            document.querySelector("#phase1").innerHTML="View Phase 1 Results";
            document.querySelector("#phase2").innerHTML="View Phase 2 Results";
            document.querySelector("#phase3").innerHTML="View Phase 3 Results";
            document.querySelector("#phase4").innerHTML="Phase 4 Results";
            document.querySelector("#phase4predict").classList.add("d-none");
            document.querySelector("#phase2predict").classList.add("d-none");
            document.querySelector("#phase3predict").classList.add("d-none");
            document.querySelector("#phase3").classList.remove("deepnec-btn-1");
            document.querySelector("#phase3").classList.add("deepnec-btn-3");
            document.querySelector("#p4Table").classList.remove("d-none");
            document.querySelector("#p1Table").classList.add("d-none");
            document.querySelector("#p2Table").classList.add("d-none");
            document.querySelector("#p3Table").classList.add("d-none");
            document.querySelector("#phase1").classList.remove("deepnec-btn-3");
            document.querySelector("#phase1").classList.add("deepnec-btn-1");
            document.querySelector("#phase2").classList.remove("deepnec-btn-3");
            document.querySelector("#phase2").classList.add("deepnec-btn-1");
            document.querySelector("#phase3").classList.remove("deepnec-btn-3");
            document.querySelector("#phase3").classList.add("deepnec-btn-1");
            document.querySelector("#phase4").classList.remove("deepnec-btn-1");
            document.querySelector("#phase4").classList.add("deepnec-btn-3");

            // populateTable("./tmp/"+filer+"/Phase_4_log.txt", "#p4Table", 'Phase4');
        
        
            console.log(terms);
            if (terms === 'nitri'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'nfix'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'assim'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dissim'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'denitri'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'addn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'ddn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt ", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dd'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            if (terms === 'dn'){
                populateCombined("./tmp/"+filer+"/Phase_4_combined_log.txt", "#p4Table", 'Phase4', terms, sidStuff);
            }
            document.querySelector("#download4").classList.remove("d-none");
            document.querySelector("#download2").classList.add("d-none");
            document.querySelector("#download3").classList.add("d-none");
            document.querySelector("#download1").classList.add("d-none");
            document.querySelector("#sl3").classList.remove("d-none");
            document.querySelector("#sl1").classList.add("d-none");
            document.querySelector("#info3").classList.add("d-none");

        });
    }
    


$('#phase2predict').click(function() {
    var pFormData = new FormData();
    var namer = data[0].split("_")[0];;
    var method = data[1];
    var level2 = "Phase2";
    var evalue = data[4];
    var coverage = data[5];
    var identity =data[6];
    var algorithm = data[7];
    var terms = data[3];

    
    
   
    pFormData.append('namer', namer);
    pFormData.append('method', method);
    pFormData.append('level2', level2);
    pFormData.append('evalue', evalue);
    pFormData.append('coverage', coverage);
    pFormData.append('identity', identity);
    pFormData.append('algorithm',algorithm );
    pFormData.append('terms', terms);

    var dd = namer + "_" + level2;
    console.log(dd)
    if (method !== 'DNN') {
        var response = dd + "+" + method + "+" + level2 +  "+" + terms + "+" +  "+" + evalue + "+" + coverage + "+" + identity;
    } else {
        var response = dd + "+" + method + "+" + level2;
    }
    // var response = dd + "+" + method + "+" + level2 + "+" + evalue + "+" + coverage + "+" + identity;
    console.log(response);
    // for (var pair of pFormData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    // }
    
    var resultUrl = `https://bioinfo.usu.edu/deepnec-2.0/results.html?result=${response}`;

    var finishText =
        `You have successfully submitted a query to the nitrification enzyme prediction service at deepNEC. Your results will be available at ${resultUrl}`

    document.getElementById("deepNECSubmittionScreen").innerHTML = finishText;

    $.ajax({
        type: "POST",
        url: "https://bioinfo.usu.edu/deepnec-2.0/backend/hi.php",
        data: pFormData,
        cache: false,
        processData: false,
        contentType: false,
       
        success: function(response) {
            console.log(response);
            $('#onPredictionTask').modal("show");
            var runUrl = "https://bioinfo.usu.edu/deepnec-2.0/backend/run_task_2.php";
            $.get(runUrl, function(data) {
                window.open(resultUrl);
                $('#onPredictionTask').modal("hide");
            });
        }
    });



});  

$('#phase3predict').click(function() {
    var pFormData = new FormData();
    var namer = data[0].split("_")[0];
    var method = data[1];
    var level2 = "Phase3";
    var evalue = data[4];
    var coverage = data[5];
    var identity =data[6];
    var algorithm = data[7];
    var terms = data[3];
    
    
   
    pFormData.append('namer', namer);
    pFormData.append('method', method);
    pFormData.append('level2', level2);
    pFormData.append('evalue', evalue);
    pFormData.append('coverage', coverage);
    pFormData.append('identity', identity);
    pFormData.append('algorithm',algorithm );
    pFormData.append('terms', terms);
    var dd = namer + "_" + level2;
    
    var response = dd + "+" + method + "+" + level2 +  "+" +terms + "+" + evalue + "+" + coverage + "+" + identity;
    
    console.log(response);
   
    
    var resultUrl = `https://bioinfo.usu.edu/deepnec-2.0/results.html?result=${response}`;

    var finishText =
        `You have successfully submitted a query to the nitrification enzyme prediction service at deepNEC. Your results will be available at ${resultUrl}`

    document.getElementById("deepNECSubmittionScreen").innerHTML = finishText;

    $.ajax({
        type: "POST",
        url: "https://bioinfo.usu.edu/deepnec-2.0/backend/hi.php",
        data: pFormData,
        cache: false,
        processData: false,
        contentType: false,
       
        success: function(response) {
            console.log(response);
            $('#onPredictionTask').modal("show");
            var runUrl = "https://bioinfo.usu.edu/deepnec-2.0/backend/run_task_2.php";
            $.get(runUrl, function(data) {
                window.open(resultUrl);
                $('#onPredictionTask').modal("hide");
            });
        }
    });



});  

$('#phase4predict').click(function() {
    var pFormData = new FormData();
    var namer = data[0].split("_")[0];
    var method = data[1];
    var level2 = "Phase4";
    var evalue = data[4];
    var coverage = data[5];
    var identity =data[6];
    var algorithm = data[7];
    var terms = data[3];
    
    
   
    pFormData.append('namer', namer);
    pFormData.append('method', method);
    pFormData.append('level2', level2);
    pFormData.append('evalue', evalue);
    pFormData.append('coverage', coverage);
    pFormData.append('identity', identity);
    pFormData.append('algorithm',algorithm );
    pFormData.append('terms', terms);

    var dd = namer + "_" + level2;
    var response = dd + "+" + method + "+" + level2 +  "+" +terms + "+" + evalue + "+" + coverage + "+" + identity;
    console.log(response);
   
    var resultUrl = `https://bioinfo.usu.edu/deepnec-2.0/results.html?result=${response}`;

    var finishText =
        `You have successfully submitted a query to the nitrification enzyme prediction service at deepNEC. Your results will be available at ${resultUrl}`

    document.getElementById("deepNECSubmittionScreen").innerHTML = finishText;

    $.ajax({
        type: "POST",
        url: "https://bioinfo.usu.edu/deepnec-2.0/backend/hi.php",
        data: pFormData,
        cache: false,
        processData: false,
        contentType: false,
       
        success: function(response) {
            console.log(response);
            $('#onPredictionTask').modal("show");
            var runUrl = "https://bioinfo.usu.edu/deepnec-2.0/backend/run_task_2.php";
            $.get(runUrl, function(data) {
                window.open(resultUrl);
                $('#onPredictionTask').modal("hide");
            });
        }
    });



});  

});



function populateTable(filename, tablename, level, term ,  callback) {

    var tableContent = '';
   
    $.get(filename, function (data) {


        var lineByline = data.split('\n');
        lineByline = lineByline.filter(line => {
            return line != '';
        })

    
        if (level === "Phase1") {
            // lineByline.shift();
        let firstLine = lineByline.shift().split("\t");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
            <th class="px-3" >${firstLine[0]}</th>
            <th class="px-3" >${firstLine[1]}</th>
            <th class="px-3" >${firstLine[2]}</th>                
            <th class="px-3" >${firstLine[3]}</th>
            <th class="noExport px-3">Secondary Structure </th>
        </tr>
    </thead>
        `;
      
        // tableContent += '<tbody>';
       
        var loc = [];
        $.each(lineByline, function (key, value) {
            
            var vd = value.split('\t');

            loc.push(vd[1])

            // console.log(vd);
            tableContent += '<tr class="d-tr">'; 
            if (vd[1] == "Enzyme") {
                tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
            }
            else { tableContent += '<td class="px-3" >' + vd[0] + '</td>';}
            tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
            if (vd[2] > vd[3]) {
                tableContent += '<td class="px-3" ><b>' + vd[2] + '</b></td>';
                tableContent += '<td class="px-3" >' + vd[3] + '</td>';
            }
            else {
                tableContent += '<td class="px-3" >' + vd[2] + '</td>';
                tableContent += '<td class="px-3" ><b>' + vd[3] + '</b></td>';
            }

            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
            tableContent += '</tr>';
        

        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        if(uniqs['Non-enzyme'] == undefined){
            uniqs['Non-enzyme'] = 0
        }
        

        document.getElementById("total").innerHTML=`Total number of input protein sequences: ${loc.length}`;
        document.getElementById("single").innerHTML=`Enzyme predicted: ${uniqs['Enzyme']}`;
        document.getElementById("dual").innerHTML=`Non-Enzyme predicted: ${uniqs['Non-enzyme']}`;
    }
    if (level === "Phase2"){
        let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
            <th class="px-3" >${firstLine[0]}</th>
            <th class="px-3" >${firstLine[1]}</th>
            <th class="px-3" >${firstLine[2]}</th>                
            <th class="px-3" >${firstLine[3]}</th>
            <th class="noExport px-3" >Secondary Structure </th>
        </tr>
    </thead>
    `;
       
        var loc = [];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');

            // console.log(vd);
            loc.push(vd[1])
            tableContent += '<tr class="d-tr">'; 
            if (vd[1] == "Nitrogen") {
                tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
            }
            else { 
                tableContent += '<td class="px-3">' + vd[0] + '</td>'; 
            }


            
            tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';

            if (vd[2] > vd[3]) {
                tableContent += '<td class="px-3"><b>' + vd[2] + '</b></td>';
                tableContent += '<td class="px-3">' + vd[3] + '</td>';
            }
            else {
                tableContent += '<td class="px-3">' + vd[2] + '</td>';
                tableContent += '<td class="px-3"><b>' + vd[3] + '</b></td>';
            }


            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += '</tr>';

        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        console.log(uniqs)
        
        if(uniqs['Non-nitrogen'] == undefined){
            uniqs['Non-nitrogen'] = 0
        }
        
        document.getElementById("total").innerHTML=`Total number of predicted enzymes: ${loc.length}`;
        document.getElementById("single").innerHTML=`Nitrogen metabolism predicted: ${uniqs['Nitrogen']}`;
        document.getElementById("dual").innerHTML=`Non-nitrogen metabolism predicted: ${uniqs['Non-nitrogen']}`;
    }
    if (level === "Phase3"){
        // let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        
        firstLine = lineByline.shift()
        tableContent += `
        <thead class="deepnec-head">
        <tr>
            <th class="px-3" >SampleID</th>
            <th class="px-3" >Prediction</th>
            <th class="px-2" >Nitrogen Fixation</th>
            <th class="px-2" >Assimilatory</th>                
            <th class="px-2" >Dissimilatory</th>
            <th class="px-2" >Denitrification</th>
            <th class="px-2" >Nitrification</th>
            <th class="px-3" >ADDN</th>
            <th class="px-3" >DN</th>
            <th class="px-3" >DDN</th>
            <th class="px-3" >DD</th>
           

            <th class="noExport px-3" >Secondary Structure </th>
        </tr>
    </thead>
    `;
        var loc = []
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');

            loc.push(vd[10])
            vdd = vd.slice(1, 10).map(Number)
            
            let tableData = [];

            let max = 0;
            let smax = secondValue(vdd);
            let tmax = thirdValue(vdd);
            // console.log(`${smax} - ${tmax}`);
            let index = 0;
            let inds = 0;
            let indt = 0;
            
            for (let i = 1; i<10; i++) {
                if (i > max) {
                    max = vd[i];
                    index = i;
                }
                if (vd[i] == smax){
                    inds = i;
                    
                }
                if (vd[i] == tmax){
                    indt = i;
                }
            }
            // console.log(inds);
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>' + vd[10] + '</b></td>';

            for (let i = 1; i<10; i++) {
                if (i == index) {
                    tableData .push(`<td class="f-td px-3"><b>${vd[i]}</b></td>`);
                    
                    continue;
                }
                if (i == inds){
                    tableData .push(`<td class="s-td px-3">${vd[i]}</td>`);
                    continue;
                }
                if (i == indt){
                    tableData .push(`<td class="t-td px-3">${vd[i]}</td>`);
                    continue;
                }
                tableData .push(`<td class="px-3">${vd[i]}</td>`);
            }

            for (let data of tableData) {
                tableContent += data;
            }

            tableContent += '<td class="px-3"><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "

            
            
        }
        
        document.getElementById("total1").innerHTML=`Total number of Nitrogen metabolism enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary

    
}
    if (level === "Phase4"){

        if (term === 'nfix'){
            let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
        var loc=[]
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            
            // console.log(index);
            loc.push(vd[2])
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[2] + '</b></td>';
            tableContent += '<td class="f-td px-3"><b>'+ vd[1] + '</b></td>';
            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[2]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[2]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Nitrogen fixation enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }

        if (term === 'dd'){
            let firstLine = lineByline.shift().split("\t");

        console.log("I m here");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc = []
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            
            // console.log(index);
            loc.push(vd[2])
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[2] + '</b></td>';
            tableContent += '<td class="f-td px-3"><b>'+ vd[1] + '</b></td>';
            


            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[2]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[2]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Dissimilatory + Denitrification  enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'addn'){
            let firstLine = lineByline.shift().split("\t");

        console.log("I m here");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc = [];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            
            // console.log(index);
            loc.push(vd[2])
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[2] + '</b></td>';
            tableContent += '<td class="f-td px-3"><b>'+ vd[1] + '</b></td>';
            


            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[2]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[2]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of  Assimilatory + Dissimilatory + Denitrification + Nitrification enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'dn'){
            let firstLine = lineByline.shift().split("\t");

        console.log("I m here");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc =[];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            
            // console.log(index);
            loc.push(vd[2])
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[2] + '</b></td>';
            tableContent += '<td class="f-td px-3"><b>'+ vd[1] + '</b></td>';
            


            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[2]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[2]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of  Denitrification + Nitrification enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'ddn'){
            let firstLine = lineByline.shift().split("\t");

        // console.log("I m here");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc=[]
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            
            // console.log(index);
            loc.push(vd[2])
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[2] + '</b></td>';
            tableContent += '<td class="f-td px-3"><b>'+ vd[1] + '</b></td>';
            


            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[2]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[2]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[2]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Dissimilatory + Denitrification + Nitrification enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        
        }
        if (term === 'dissim'){
            let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[4]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc =[];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            loc.push(vd[4])
            vdd = vd.slice(1, 3).map(Number)
            // console.log(vdd);
            let tableData = [];
            // console.log(vd);
            let max = Math.max(...vdd);
            // console.log(max);
            let smax = secondValue(vdd);
            let tmax = thirdValue(vdd);
            // console.log(`${smax} - ${tmax}`);
            let index = 0;
            let inds = 0;
            let indt = 0;
            
            for (let i = 1; i<3; i++) {
                if (vd[i] == max) {
                    
                    index = i;
                }
                if (vd[i] == smax){
                    inds = i;
                    
                }
                if (vd[i] == tmax){
                    indt = i;
                }
            }
            // console.log(index);
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[4] + '</b></td>';

            for (let i = 1; i<3; i++) {
                if (i == index) {
                    tableData .push(`<td class="f-td px-3"><b>${vd[i]}</b></td>`);
                    
                    continue;
                }
                if (i == inds){
                    tableData .push(`<td class="s-td px-3">${vd[i]}</td>`);
                    continue;
                }
                if (i == indt){
                    tableData .push(`<td class="t-td px-3">${vd[i]}</td>`);
                    continue;
                }
                tableData .push(`<td class="px-3">${vd[i]}</td>`);
            }

            for (let data of tableData) {
                tableContent += data;
            }
            // let acc = vd[8].split(":");
            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[4]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[4]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[4]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[4]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Dissimilatory enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'denitri'){
            let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[4]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc =[];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            loc.push(vd[4])
            vdd = vd.slice(1, 3).map(Number)
            // console.log(vdd);
            let tableData = [];
            // console.log(vd);
            let max = Math.max(...vdd);
            // console.log(max);
            let smax = secondValue(vdd);
            let tmax = thirdValue(vdd);
            // console.log(`${smax} - ${tmax}`);
            let index = 0;
            let inds = 0;
            let indt = 0;
            
            for (let i = 1; i<3; i++) {
                if (vd[i] == max) {
                    
                    index = i;
                }
                if (vd[i] == smax){
                    inds = i;
                    
                }
                if (vd[i] == tmax){
                    indt = i;
                }
            }
            // console.log(index);
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[4] + '</b></td>';

            for (let i = 1; i<3; i++) {
                if (i == index) {
                    tableData .push(`<td class="f-td px-3"><b>${vd[i]}</b></td>`);
                    
                    continue;
                }
                if (i == inds){
                    tableData .push(`<td class="s-td px-3">${vd[i]}</td>`);
                    continue;
                }
                if (i == indt){
                    tableData .push(`<td class="t-td px-3">${vd[i]}</td>`);
                    continue;
                }
                tableData .push(`<td class="px-3">${vd[i]}</td>`);
            }

            for (let data of tableData) {
                tableContent += data;
            }
            // let acc = vd[8].split(":");
            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[4]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[4]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[4]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[4]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Denitrification enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'assim'){
            let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[8]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[3]}</th>
        <th class="px-3">${firstLine[4]}</th>
        <th class="px-3">${firstLine[5]}</th>
        <th class="px-3">${firstLine[6]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc =[];
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            loc.push(vd[8])
            vdd = vd.slice(1, 7).map(Number)
            // console.log(vdd);
            let tableData = [];
            // console.log(vd);
            let max = Math.max(...vdd);
            // console.log(max);
            let smax = secondValue(vdd);
            let tmax = thirdValue(vdd);
            // console.log(`${smax} - ${tmax}`);
            let index = 0;
            let inds = 0;
            let indt = 0;
            
            for (let i = 1; i<7; i++) {
                if (vd[i] == max) {
                    
                    index = i;
                }
                if (vd[i] == smax){
                    inds = i;
                    
                }
                if (vd[i] == tmax){
                    indt = i;
                }
            }
            // console.log(index);
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-3"><b>EC: '+ vd[8] + '</b></td>';

            for (let i = 1; i<7; i++) {
                if (i == index) {
                    tableData .push(`<td class="f-td px-3"><b>${vd[i]}</b></td>`);
                    
                    continue;
                }
                if (i == inds){
                    tableData .push(`<td class="s-td px-3">${vd[i]}</td>`);
                    continue;
                }
                if (i == indt){
                    tableData .push(`<td class="t-td px-3">${vd[i]}</td>`);
                    continue;
                }
                tableData .push(`<td class="px-3">${vd[i]}</td>`);
            }

            for (let data of tableData) {
                tableContent += data;
            }
            let acc = vd[8].split(":");
            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[8]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[8]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[8]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[8]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary ='| '
        for (k in uniqs){
            
            summary += k+": "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Assimilatory enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        }
        if (term === 'nitri'){
            let firstLine = lineByline.shift().split("\t");
        // console.log(firstLine);
        tableContent += `
        <thead class="deepnec-head">
        <tr>
        <th class="px-3">${firstLine[0]}</th>
        <th class="px-3">${firstLine[7]}</th>
        <th class="px-3">${firstLine[1]}</th>
        <th class="px-3">${firstLine[2]}</th>
        <th class="px-3">${firstLine[3]}</th>
        <th class="px-3">${firstLine[4]}</th>
        <th class="px-3">${firstLine[5]}</th>
        <th class="noExport px-3" >Secondary Structure </th>
        <th class="noExport px-3" >NCBI</th>
        <th class="noExport px-3" >UniProt </th>
        <th class="noExport px-3" >Brenda </th>
        <th class="noExport px-3" >KEGG </th>
        <th class="noExport px-3" >JGI IMG/M </th>
        </tr>
    </thead>
    `;
            var loc = []
        $.each(lineByline, function (key, value) {
            let vd = value.split('\t');
            loc.push(vd[7])
            vdd = vd.slice(1, 6).map(Number)
            // console.log(vdd);
            let tableData = [];
            // console.log(vd);
            let max = Math.max(...vdd);
            // console.log(max);
            let smax = secondValue(vdd);
            let tmax = thirdValue(vdd);
            // console.log(`${smax} - ${tmax}`);
            let index = 0;
            let inds = 0;
            let indt = 0;
            
            for (let i = 1; i<6; i++) {
                if (vd[i] == max) {
                    
                    index = i;
                }
                if (vd[i] == smax){
                    inds = i;
                    
                }
                if (vd[i] == tmax){
                    indt = i;
                }
            }
            // console.log(index);
            
            tableContent += '<tr class="d-tr">';
            tableContent += '<td class="px-3">' + vd[0] + '</td>';
            tableContent += '<td class="px-2"><b>EC:'+ vd[7] + '</b></td>';

            for (let i = 1; i<6; i++) {
                if (i == index) {
                    tableData .push(`<td class="f-td px-3"><b>${vd[i]}</b></td>`);
                    
                    continue;
                }
                if (i == inds){
                    tableData .push(`<td class="s-td px-3">${vd[i]}</td>`);
                    continue;
                }
                if (i == indt){
                    tableData .push(`<td class="t-td px-3">${vd[i]}</td>`);
                    continue;
                }
                tableData .push(`<td class="px-3">${vd[i]}</td>`);
            }

            for (let data of tableData) {
                tableContent += data;
            }
            // let acc = vd[8].split(":");
            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[7]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[7]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
            tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[7]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
            tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[7]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
            tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           
            tableContent += '</tr>';
        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        summary =' | '
        for (k in uniqs){
            
            summary += k+" : "+uniqs[k]+" | "  
        }
        
        document.getElementById("total1").innerHTML=`Total number of Nitrification enzymes: ${loc.length};`;
        document.getElementById("dual-loc").innerText=summary
        
        }
        
    }
        // tableContent += '</tbody>';
        
        $(tablename).html(tableContent);
        // $(tablename).DataTable();

        if (callback) {
            callback();
        }
    
    });

};






function secondValue(value) {
    let max = Math.max.apply(null, value), // get the max of the array
        maxi = value.indexOf(max);
    value[maxi] = -Infinity; // replace max in the array with -infinity
    let secondMax = Math.max.apply(null, value); // get the new max
    value[maxi] = max;
    return secondMax;
}

function thirdValue(value) {
    let max = Math.max.apply(null, value), // get the max of the array
        maxi = value.indexOf(max);
    value[maxi] = -Infinity; // replace max in the array with -infinity
    let secondMax = Math.max.apply(null, value), // get the new max
        secondMaxi = value.indexOf(secondMax);
    value[secondMaxi] = -Infinity;
    let thirdMax = Math.max.apply(null, value); // get the new max
    value[maxi] = max;
    value[secondMaxi] = secondMax;
    return thirdMax;
}

function exportData(tablename, filename) {

    // console.log(`${tablename} -${filename}`);
    $("#"+tablename+".noExport").remove();
    let table = document.getElementById(tablename);
    var rowCount = $("#" +tablename + " td").closest("tr").length +1; 
    // console.log(rowCount);
    let rows = [];
    let row = 0;
    let dd = table.rows[0].cells;
    let rld =[]

    for (let i= 0; i<dd.length; i++){
        
        if (dd[i].classList.contains('noExport')){
            continue
        }
        else {
            rld.push(dd[i])
        }
    }


    for (let i = 0;  i <rowCount; i++) {

        row = table.rows[i].cells;
        // console.log(row);
  
        let col = [];
        let rl = rld.length;
        // console.log(rl);
        
        for (let j=0; j<rl; j++){
            // console.log(row[j].innerText);
            
            col.push(row[j].innerText)
            
        }
        // console.log(col);
        rows.push([col]);
        // console.log(rows);
    }
    csvContent = "data:text;charset=utf-8,";

    rows.forEach(function (rowArray) {
        row = rowArray.join().replace(/,/g,"\t");;
        // console.log(row)
        csvContent += row + "\r\n";
    });
    let encodedUri = encodeURI (csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();
}

// Blast table 

function populateHomology(filename, tablename, level, terms, callback){
    
    
    var tableContent = '';
   
    $.get(filename, function (data) {


        var lineByline = data.split('\n');
        lineByline = lineByline.filter(line => {
            return line != '';
        })
        if (level === "Phase1") {
            // lineByline.shift();
        let firstLine = lineByline.shift().split("\t");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
            <th class="px-3" >${firstLine[0]}</th>
            <th class="px-3" >${firstLine[1]}</th>
            <th class="px-3" >${firstLine[2]}</th>                
            <th class="px-3" >${firstLine[3]}</th>
            <th class="px-3" >${firstLine[4]}</th>
            <th class="noExport px-3">Secondary Structure </th>
        </tr>
    </thead>
        `;
      
        // tableContent += '<tbody>';
       
            var loc = [];
        $.each(lineByline, function (key, value) {
            
            var vd = value.split('\t');
            loc.push(vd[1])
            // console.log(vd);
            tableContent += '<tr class="d-tr">'; 
            if (vd[1] == "Enzyme") {
                tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
            }
            else { tableContent += '<td class="px-3" >' + vd[0] + '</td>';}
            tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
            
                tableContent += '<td class="px-3">' + vd[2] + '</td>';
                tableContent += '<td class="px-3" >' + vd[3] + '</td>';
                tableContent += '<td class="px-3" >' + vd[4] + '</td>';

            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
            tableContent += '</tr>';
        

        });
        var uniqs = loc.reduce((acc, val) =>{
            acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
            return acc
        }, {})
        if(uniqs['Non-enzyme'] == undefined){
            uniqs['Non-enzyme'] = 0
        }
        

        document.getElementById("total").innerHTML=`Total number of input protein sequences: ${loc.length}`;
        document.getElementById("single").innerHTML=`Enzyme predicted: ${uniqs['Enzyme']}`;
        document.getElementById("dual").innerHTML=`Non-Enzyme predicted: ${uniqs['Non-enzyme']}`;
    }

    if (level === "Phase2") {
        // lineByline.shift();
    let firstLine = lineByline.shift().split("\t");
    tableContent += `
    <thead class="deepnec-head">
    <tr>
        <th class="px-3" >${firstLine[0]}</th>
        <th class="px-3" >${firstLine[1]}</th>
        <th class="px-3" >${firstLine[2]}</th>                
        <th class="px-3" >${firstLine[3]}</th>
        <th class="px-3" >${firstLine[4]}</th>
        <th class="noExport px-3">Secondary Structure </th>
    </tr>
</thead>
    `;
  
    // tableContent += '<tbody>';
    var noresult= 'No sequence passed Phase 2 filters. Please try with other sequences.'
    if (lineByline.length ===0){
        console.log("I am working but not printing");
        tableContent += '<tr class="d-tr">';
        tableContent += '<td class="px-3" colspan="10">' + noresult + '</td>';
        tableContent+= '</tr>';
    }
    else{   
        var loc =[];
    $.each(lineByline, function (key, value) {
        
        var vd = value.split('\t');
        loc.push(vd[1])
        tableContent += '<tr class="d-tr">'; 
        if (vd[1] == "Nitrogen") {
            tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
        }
        else { tableContent += '<td class="px-3" >' + vd[0] + '</td>';}
            tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
        
            tableContent += '<td class="px-3">' + vd[2] + '</td>';
            tableContent += '<td class="px-3" >' + vd[3] + '</td>';
            tableContent += '<td class="px-3" >' + vd[4] + '</td>';

        tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
        // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
        tableContent += '</tr>';
    

    });
    var uniqs = loc.reduce((acc, val) =>{
        acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
        return acc
    }, {})
    console.log(uniqs)
    
    if(uniqs['Non-nitrogen'] == undefined){
        uniqs['Non-nitrogen'] = 0
    }
    
    document.getElementById("total").innerHTML=`Total number of predicted enzymes: ${loc.length}`;
    document.getElementById("single").innerHTML=`Nitrogen metabolism predicted: ${uniqs['Nitrogen']}`;
    document.getElementById("dual").innerHTML=`Non-nitrogen metabolism predicted: ${uniqs['Non-nitrogen']}`;
}
    }

if (level === "Phase3") {
    // lineByline.shift();
let firstLine = lineByline.shift().split("\t");
tableContent += `
<thead class="deepnec-head">
<tr>
    <th class="px-3" >${firstLine[0]}</th>
    <th class="px-3" >${firstLine[1]}</th>
    <th class="px-3" >${firstLine[2]}</th>                
    <th class="px-3" >${firstLine[3]}</th>
    <th class="px-3" >${firstLine[4]}</th>
    <th class="noExport px-3">Secondary Structure </th>
</tr>
</thead>
`;

// tableContent += '<tbody>';
var noresult= 'No sequence passed Phase 3 filters. Please try with other sequences.'
if (lineByline.length ===0){
    console.log("I am working but not printing");
    tableContent += '<tr class="d-tr">';
    tableContent += '<td class="px-3" colspan="10">' + noresult + '</td>';
    tableContent+= '</tr>';
}
else{
var loc =[];
$.each(lineByline, function (key, value) {
    
    var vd = value.split('\t');

    loc.push(vd[1])
    tableContent += '<tr class="d-tr">'; 
    
    tableContent += '<td class="px-3">' + vd[0] + '</td>';
   
    
    tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
    
        tableContent += '<td class="px-3">' + vd[2] + '</td>';
        tableContent += '<td class="px-3" >' + vd[3] + '</td>';
        tableContent += '<td class="px-3" >' + vd[4] + '</td>';

    tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
    // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
    tableContent += '</tr>';


});
var uniqs = loc.reduce((acc, val) =>{
    acc[val]= acc[val] ==undefined ? 1: acc[val] +=1;
    return acc
}, {})
summary ='| '
for (k in uniqs){
    
    summary += k+": "+uniqs[k]+" | "
}

document.getElementById("total1").innerHTML=`Total number of Nitrogen metabolism enzymes: ${loc.length};`;
document.getElementById("dual-loc").innerText=summary

    }
}
if (level === "Phase4") {
    // lineByline.shift();
let firstLine = lineByline.shift().split("\t");
tableContent += `
<thead class="deepnec-head">
<tr>
    <th class="px-3" >${firstLine[0]}</th>
    <th class="px-3" >${firstLine[1]}</th>
    <th class="px-3" >${firstLine[2]}</th>                
    <th class="px-3" >${firstLine[3]}</th>
    <th class="px-3" >${firstLine[4]}</th>
    <th class="noExport px-3">Secondary Structure </th>
    <th class="noExport px-3" >NCBI</th>
    <th class="noExport px-3" >UniProt </th>
    <th class="noExport px-3" >Brenda </th>
    <th class="noExport px-3" >KEGG </th>
    <th class="noExport px-3" >JGI IMG/M </th>
</tr>
</thead>
`;

// tableContent += '<tbody>';

var noresult= 'No sequence passed Phase 4 filters. Please try with other sequences.'
if (lineByline.length ===0){
    console.log("I am working but not printing");
    tableContent += '<tr class="d-tr">';
    tableContent += '<td class="px-3" colspan="10">' + noresult + '</td>';
    tableContent+= '</tr>';
}
else{

$.each(lineByline, function (key, value) {
    
    var vd = value.split('\t');

    // console.log(vd);
    tableContent += '<tr class="d-tr">'; 
    
    tableContent += '<td class="px-3">' + vd[0] + '</td>';
   
    
    tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
    
        tableContent += '<td class="px-3">' + vd[2] + '</td>';
        tableContent += '<td class="px-3" >' + vd[3] + '</td>';
        tableContent += '<td class="px-3" >' + vd[4] + '</td>';

    tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
    tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[1]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
    tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[1]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
    tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[1]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
    tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[1]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
    tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
    tableContent += '</tr>';


});
}
}
    // tableContent += '</tbody>';
        
    $(tablename).html(tableContent);
    // $(tablename).DataTable();

    if (callback) {
        callback();
    }
});
};

function populateCombined(filename, tablename,level, terms, callback ){
    var tableContent = '';
   
    $.get(filename, function (data) {


        var lineByline = data.split('\n');
        lineByline = lineByline.filter(line => {
            return line != '';
        })
        if (level === "Phase1") {
            // lineByline.shift();
        let firstLine = lineByline.shift().split("\t");
        tableContent += `
        <thead class="deepnec-head">
        <tr>
            <th class="px-3" >${firstLine[0]}</th>
            <th class="px-3" >${firstLine[1]}</th>
            <th class="px-3" >${firstLine[2]}</th>                
            <th class="noExport px-3">Secondary Structure </th>
        </tr>
    </thead>
        `;
      
        // tableContent += '<tbody>';
       

        $.each(lineByline, function (key, value) {
            
            var vd = value.split('\t');

            // console.log(vd);
            tableContent += '<tr class="d-tr">'; 
            if (vd[1] == "Enzyme") {
                tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
            }
            else { tableContent += '<td class="px-3" >' + vd[0] + '</td>';}
            tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
            
                tableContent += '<td class="px-3" ><b>' + vd[2] + '</b></td>';
            

            tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
            // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
            tableContent += '</tr>';
        

        });
    }
    if (level === "Phase2") {
        // lineByline.shift();
    let firstLine = lineByline.shift().split("\t");
    tableContent += `
    <thead class="deepnec-head">
    <tr>
        <th class="px-3" >${firstLine[0]}</th>
        <th class="px-3" >${firstLine[1]}</th>
        <th class="px-3" >${firstLine[2]}</th>                
        <th class="noExport px-3">Secondary Structure </th>
    </tr>
</thead>
    `;
  
    // tableContent += '<tbody>';
   

    $.each(lineByline, function (key, value) {
        
        var vd = value.split('\t');

        // console.log(vd);
        tableContent += '<tr class="d-tr">'; 
        if (vd[1] == "Nitrogen") {
            tableContent += '<td class="enzyme-td px-3">' + vd[0] + '</td>';
        }
        else { tableContent += '<td class="px-3" >' + vd[0] + '</td>';}
        tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
        
            tableContent += '<td class="px-3" ><b>' + vd[2] + '</b></td>';
        

        tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
        // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
        tableContent += '</tr>';
    

    });
}
if (level === "Phase3") {
    // lineByline.shift();
let firstLine = lineByline.shift().split("\t");
tableContent += `
<thead class="deepnec-head">
<tr>
    <th class="px-3" >${firstLine[0]}</th>
    <th class="px-3" >${firstLine[1]}</th>
    <th class="px-3" >${firstLine[2]}</th>                
    <th class="noExport px-3">Secondary Structure </th>
</tr>
</thead>
`;

// tableContent += '<tbody>';


$.each(lineByline, function (key, value) {
    
    var vd = value.split('\t');

    // console.log(vd);
    tableContent += '<tr class="d-tr">'; 
    tableContent += '<td class="px-3" >' + vd[0] + '</td>';
    tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
    
        tableContent += '<td class="px-3" ><b>' + vd[2] + '</b></td>';
    

    tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
    // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
    tableContent += '</tr>';


});
}

if (level === "Phase4") {
    // lineByline.shift();
let firstLine = lineByline.shift().split("\t");
tableContent += `
<thead class="deepnec-head">
<tr>
    <th class="px-3" >${firstLine[0]}</th>
    <th class="px-3" >${firstLine[1]}</th>
    <th class="px-3" >${firstLine[2]}</th>                

    <th class="noExport px-3">Secondary Structure </th>
    <th class="noExport px-3" >NCBI</th>
    <th class="noExport px-3" >UniProt </th>
    <th class="noExport px-3" >Brenda </th>
    <th class="noExport px-3" >KEGG </th>
    <th class="noExport px-3" >JGI IMG/M </th>
</tr>
</thead>
`;

// tableContent += '<tbody>';


$.each(lineByline, function (key, value) {
    
    var vd = value.split('\t');
  
    // console.log(vd);
    tableContent += '<tr class="d-tr">'; 
    
    tableContent += '<td class="px-3">' + vd[0] + '</td>';
   
    
    tableContent += '<td class="px-3"><b>' + vd[1] + '</b></td>';
    
        tableContent += '<td class="px-3">' + vd[2] + '</td>';


    tableContent += '<td><button type="button" id=ss-' + vd[0] + ' class="btn btn-sm deepnec-btn-1 sec-struct">Predict</button> </td>';
    tableContent += `'<td> <a href="https://www.ncbi.nlm.nih.gov/protein/?term=${vd[1]}" target="_blank" class="btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
    tableContent += `'<td> <a href="https://www.uniprot.org/uniprot/?query=${vd[1]}'&sort=score" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a> </td>'`;
    tableContent += `'<td> <a href="https://www.brenda-enzymes.org/enzyme.php?ecno=${vd[1]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a>  </td>'`;
    tableContent += ` '<td><a  href="https://www.genome.jp/dbget-bin/www_bget?ec:${vd[1]}" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
    tableContent += `'<td><a  href="https://img.jgi.doe.gov/cgi-bin/m/main.cgi?section=FindFunctions&page=enzymeList" target="_blank" class=" btn btn-sm deepnec-btn-1" role="button">View</a></td>'`;
           // tableContent += '<td class="px-3" ><input type="button" value = "Predict"  id = ss-' + vd[0] + ' class="deepnec-btn-1 btn btn-sm sec-struct"/> </td>';
    tableContent += '</tr>';

    
});
}

    $(tablename).html(tableContent);
        // $(tablename).DataTable();

        if (callback) {
            callback();
        }
});

};


