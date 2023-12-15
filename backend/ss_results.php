<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" , content="width=device-width, intial-scale=1">
    <title>deepNEC</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script type="text/javascript" language="javascript" src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="../assets/js/biod3.js"></script>
    <!-- <script src="psipred.js"></script> -->
    <script src="https://d3js.org/d3.v4.min.js"></script>

</head>

<body class="d-flex flex-column h-100">
    <header>
        <div class="bd-navbar mx-5 mb-4 mt-3 mx-auto col-md-12">
            <nav class="navbar navbar-expand navbar-light">
                <div class="container d-flex flex-wrap">
                    <span class="h-brand navbar-brand">
                        <b>deepNEC</b>
                    </span>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">

                        <ul class="navbar-nav ">
                            <li class="nav-item"><a class="nav-link " href="../index.html"><i class="bi bi-info-square-fill mx-2"></i><span>About</span></a></li>
                            <li class="nav-item"><a class="nav-link active" href="../prediction.html"><i class="bi bi-terminal-fill mx-2"></i><span>Prediction</span></a></li>
                            <li class="nav-item"><a class="nav-link " href="../help.html"><i class="bi bi-question-square-fill mx-2"></i><span>Help</span></a></li>
                            <li class="nav-item"><a class="nav-link" href="../download.html"><i class="bi bi-cloud-arrow-down-fill mx-2"></i><span>Download</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
    <main class="flex-shrink-0 ">

        <div class="px-0 pt-4 t-3 mcontainer container">

            <!-- end row -->

            <div class="row justify-content-center">

                <div class="col-10">

                    <?php
                    $result = $_GET['result'];
                    $data = explode(" ", $result);
                    $namer = $data[0];
                    $id = $data[1];
                    $file = "/var/www/html/deepnec-2.0/tmp/" . $namer . "_" . $id . "_ss.horiz";
                    //                print_r($file);
                    //                $myfile = fopen($file, "r") or die("Unable to open file!");
                    $orig = file_get_contents($file);
                    //    print_r($orig);
                    $lines = explode("\n", $orig);
                    $skipped_content = implode("\n", array_slice($lines, 2));
                    //  print_r($skipped_content);




                    ?>
                    <h3 class="text-center">
                        Secondary Structure of <?php echo $id ?> </h3>


                    <div id="result_container" class="mx-5">
                        <div id="psipred_cartoon" class="psipred_cartoon">
                            <svg id="psipredChart">
                            </svg>
                        </div>
                    </div>
                    
                    <div>
                    </div>
                </div>
    
            </div>
            <button onclick="<?php  echo $file?>" class="btn deepnec-btn-1 d-none" type="button">Download Horiz File</button>
    </main>
    <footer class="footer mx-5 mt-5 py-2 mx-auto">
        <div class="px-5">
            <div class="line mt-2 mb-1">

            </div>
        </div>
        <div class="container d-flex flex-wrap py-1">
            <p class="col-md-4 mb-0 text-muted">&copy; 2021 </p>
            <a href="https://bioinfo.usu.edu" target="_blank" class="d-flex align-items-center  mb-lg-0 me-lg-auto text-dark text-decoration-none">
                <img src="../assets/images/lab_logo_red.png" style="height: 30px">
            </a>
            <a href="https://usu.edu" target="_blank" class="d-flex align-items-center  mx-2 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                <img src="../assets/images/usulogo2.png" style="height: 30px;">
            </a>
            <a href="https://psc.usu.edu" target="_blank" class="d-flex align-items-center  mx-2 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                <img src="../assets/images/PSC_NoTower_Blue.png" style="height: 30px;">
            </a>
        </div>
    </footer>

</body>
<script>
    var data = `<?php echo $skipped_content; ?>`

    console.log(data)


    let a = 180 * ((data.match(/Conf/g) || []).length + 1) + 120;

    biod3.psipred(data, 'psipredChart', {
        debug: !0,
        parent: "div.psipred_cartoon",
        margin_scaler: 2,
        width: 900,
        container_width: 900,
        height: a,
        container_height: a,


    });

    // biod3.annotationGrid(ab, { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
</script>

</html>