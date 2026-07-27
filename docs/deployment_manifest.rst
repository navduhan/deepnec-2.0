Model Artifact Manifest & Checksums
======================================

The official deployment manifest for deepNEC 2.0 is stored at ``deepNEC/data/models/deployment_manifest.json``.

It records the selected fold, canonical selection validation MCC, independent test set MCC, independent test accuracy, output class order, file size, and SHA-256 flatbuffer checksum for every deployed model artifact.

Model Artifact Summary Table
----------------------------

.. list-table::
   :widths: 25 10 15 15 15 20
   :header-rows: 1

   * - Artifact Relative Path
     - Selected Fold
     - Selection Val MCC
     - Test MCC
     - Test Accuracy
     - SHA-256 Checksum (Prefix)
   * - ``phase1/phase1_ultimate_hybrid.tflite``
     - Fold 5
     - 0.8929
     - 0.8718
     - 93.62%
     - ``ade765383f...``
   * - ``phase2/phase2_esm2.tflite``
     - Fold 1
     - 0.9864
     - 0.9738
     - 99.38%
     - ``36b57e5137...``
   * - ``phase3/phase3_esm2.tflite``
     - Fold 4
     - 0.9512
     - 0.9478
     - 95.62%
     - ``8d46d39920...``
   * - ``phase4/anammox_esm2.tflite``
     - Fold 1
     - 0.9642
     - 0.9142
     - 95.90%
     - ``1b8f4bb723...``
   * - ``phase4/assimilatory_esm2.tflite``
     - Fold 3
     - 0.9167
     - 0.9194
     - 93.25%
     - ``0aef9fc758...``
   * - ``phase4/denitrification_esm2.tflite``
     - Fold 1
     - 1.0000
     - 1.0000
     - 100.00%
     - ``6bd2251fc7...``
   * - ``phase4/dissimilatory_esm2.tflite``
     - Fold 1
     - 1.0000
     - 1.0000
     - 100.00%
     - ``063b80893a...``
   * - ``phase4/nitrification_esm2.tflite``
     - Fold 2
     - 1.0000
     - 0.9931
     - 99.77%
     - ``1d96c35886...``
   * - ``phase4/addn_esm2.tflite``
     - Fold 1
     - 0.9981
     - 1.0000
     - 100.00%
     - ``7e47833066...``

Verification
------------

You can programmatically verify model integrity against the manifest in Python:

.. code-block:: python

   import json, hashlib, os

   manifest_path = "deepNEC/data/models/deployment_manifest.json"
   with open(manifest_path) as f:
       manifest = json.load(f)

   for rel_path, info in manifest["artifacts"].items():
       full_path = os.path.join("deepNEC/data/models", rel_path)
       with open(full_path, "rb") as f:
           h = hashlib.sha256(f.read()).hexdigest()
       assert h == info["sha256"], f"Checksum mismatch for {rel_path}!"
       print(f"Verified {rel_path}: OK")
