Model Artifact Manifest and Checksums
=====================================

The release manifest is stored at
``deepNEC/data/models/deployment_manifest.json``. It records the canonical
output-node order, size, SHA-256 checksum, embedding model, and long-sequence
policy for every final Round 2 artifact.

The deployed learned models are:

* ``phase1/phase1_esm2.tflite``
* ``phase2/phase2_esm2.tflite``
* ``phase3/phase3_esm2.tflite``
* ``phase4/anammox_esm2.tflite``
* ``phase4/assimilatory_esm2.tflite`` (merged 8-class)
* ``phase4/denitrification_esm2.tflite``
* ``phase4/dissimilatory_esm2.tflite``
* ``phase4/nitrification_esm2.tflite``

Verification
------------

.. code-block:: python

   import hashlib
   import json
   from pathlib import Path

   root = Path("deepNEC/data/models")
   manifest = json.loads((root / "deployment_manifest.json").read_text())
   for relative, metadata in manifest["artifacts"].items():
       artifact = root / relative
       checksum = hashlib.sha256(artifact.read_bytes()).hexdigest()
       assert checksum == metadata["sha256"]
       assert artifact.stat().st_size == metadata["size_bytes"]
       print(f"Verified {relative}")
