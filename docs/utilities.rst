Integrated Downstream Utilities
================================

deepNEC 2.0 comes bundled with three specialized downstream tools for genome annotation, active site motif scanning, and publication figure generation.

1. Active Site & Cofactor Motif Scanner (``deepnec-motif-scan``)
----------------------------------------------------------------

Scans query protein sequences for key catalytic and cofactor binding motifs:

* **Rossmann Fold Motif**: ``[LIVMFYGA]{6}.{0,5}[DE]`` (Nucleotide binding)
* **NADP Basic Motif**: ``[KR].{2,4}[KR].{6,10}[LIVMFY]``
* **NAD Acidic Motif**: ``[D][DED].{6,12}[LIVMFY]``
* **Ferredoxin Fe-S Motif**: ``C.{2,4}C.{2,4}C.{3,15}C`` (Electron transfer)
* **Mo-MGD Binding Motif**: ``C.{2,4}C.{10,30}C``

Usage
~~~~~

.. code-block:: bash

   deepnec-motif-scan -i query.fasta -o motif_report.tsv

Output Format
~~~~~~~~~~~~~

Generates a TSV file detailing binary motif presence (1 or 0) for each sequence across all five cofactor families.

2. Publication Figure Visualizer (``deepnec-visualize``)
--------------------------------------------------------

Generates high-resolution (300 DPI) publication-ready figures using colorblind-safe Okabe-Ito and cividis palettes:

1. ``pathway_distribution.png``: Sequence counts per nitrogen metabolism pathway.
2. ``ec_distribution.png``: High-contrast donut chart of predicted EC numbers.
3. ``pathway_completeness.png``: Nitrogen cycle pathway completeness heatmap profile.

Usage
~~~~~

.. code-block:: bash

   deepnec-visualize -i my_results/deepnec_predictions.tsv -od my_results

3. GFF3 Genomic Locus Annotator (``deepnec-annotate``)
------------------------------------------------------

Annotates genomic features in GFF3 files with predicted nitrogen metabolism pathways and EC numbers.

Usage
~~~~~

.. code-block:: bash

   deepnec-annotate -g genome.gff3 -p my_results/deepnec_predictions.tsv -o annotated_genome.gff3
