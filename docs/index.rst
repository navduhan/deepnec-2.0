deepNEC 2.0 Documentation
=========================

**deepNEC 2.0** is an alignment-free, deep learning-based hierarchical framework for high-precision **Nitrogen Metabolism Enzyme Classification** and **Enzyme Commission (EC) Number Prediction** across 28 specific nitrogen metabolism enzyme classes.

Powered by **ESM-2 650M Protein Language Model embeddings**, **ESM-2 Fold 5 LoRA fine-tuning**, and **2,968 physical-chemical sequence descriptors**, deepNEC 2.0 achieves state-of-the-art performance across all four hierarchical prediction phases.

.. image:: https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg
   :target: https://www.python.org/
.. image:: https://img.shields.io/badge/packaging-PEP%20621%20%7C%20uv-green.svg
   :target: https://github.com/astral-sh/uv
.. image:: https://img.shields.io/badge/License-GPL_v3-blue.svg
   :target: https://www.gnu.org/licenses/gpl-3.0.html

Key Features
------------

* **Hierarchical 4-Phase Architecture**:

  - **Phase 1**: Binary Enzyme vs. Non-Enzyme Classifier (*Ultimate Hybrid Fold 5 LoRA + 2,968 Descriptors*, Selection Val MCC: ``0.8929``, Test MCC: ``0.8718``, Accuracy: ``93.62%``).
  - **Phase 2**: Nitrogen Metabolism Enzyme Filter (*ESM-2 650M Standalone*, Selection Val MCC: ``0.9864``, Test MCC: ``0.9738``, Accuracy: ``99.38%``).
  - **Phase 3**: 10 Nitrogen Sub-pathway Classifier (*ESM-2 650M Standalone*, Selection Val MCC: ``0.9512``, Test MCC: ``0.9478``, Accuracy: ``95.62%``).
  - **Phase 4**: Fine-Grained EC Number Predictor covering **28 specific EC numbers across 24 output classes** (Test MCC: ``0.9142 – 1.0000``).

* **Strict Input Validation & Security**:

  - Real-time client & CLI FASTA validation enforcing strict standard 20 amino acid codes.
  - Minimum sequence length check (>= 31 residues required for PAAC feature extraction).
  - Duplicate identifier detection preventing silent pipeline corruption.

* **Ultra-Fast TensorFlow Lite Flatbuffer Engine**:

  - All inference models deployed as compressed, CPU-optimized ``.tflite`` flatbuffers.
  - Executable in parallel with memory usage < 3 GB.

* **Integrated Downstream Tools**:

  - ``deepnec-annotate``: GFF3 genomic feature annotator.
  - ``deepnec-motif-scan``: Active site & cofactor motif scanner (Rossmann, Ferredoxin Fe-S, Mo-MGD, Heme CXXCH).
  - ``deepnec-visualize``: Publication-ready figure generator (300 DPI, Okabe-Ito colorblind palette).

Documentation Contents
----------------------

.. toctree::
   :maxdepth: 2
   :caption: User Guide

   installation
   cli_usage
   utilities
   architecture
   deployment_manifest
   api_reference

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
