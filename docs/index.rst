deepNEC 2.0 Documentation
=========================

**DeepNEC 2.0.4** is an alignment-free hierarchical framework for **nitrogen-metabolism enzyme classification** and **Enzyme Commission (EC) assignment**. Its corrected merged ontology has 21 terminal labels representing 26 current source EC annotations.

All eight learned tasks use final models fitted to their eligible Round 2 training records and frozen **ESM-2 650M** residue-mean embeddings.

.. image:: https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg
   :target: https://www.python.org/
.. image:: https://img.shields.io/badge/packaging-PEP%20621%20%7C%20uv-green.svg
   :target: https://github.com/astral-sh/uv
.. image:: https://img.shields.io/badge/License-GPL_v3-blue.svg
   :target: https://www.gnu.org/licenses/gpl-3.0.html

Key Features
------------

* **Hierarchical 4-Phase Architecture**:

  - **Phase 1**: Final frozen ESM-2 enzyme/non-enzyme classifier.
  - **Phase 2**: Final ESM-2 nitrogen/non-nitrogen classifier.
  - **Phase 3**: Final ESM-2 classifier for ten corrected pathway classes.
  - **Phase 4**: Five learned classifiers plus five direct single-EC mappings.

* **Strict Input Validation & Security**:

  - Real-time client & CLI FASTA validation enforcing strict standard 20 amino acid codes.
  - Empty-after-cleaning and duplicate-identifier checks.
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
