Command Line Interface (CLI) Usage
===================================

deepNEC 2.0 provides a powerful, single-command CLI interface supporting full hierarchical prediction depth from Phase 1 through Phase 4.

Command Aliases
---------------

The CLI entry point can be invoked using any of the following alias commands:

* ``deepnec``
* ``deepnec2``
* ``deepnec2.0``
* ``python -m deepNEC``

Command Line Arguments
----------------------

.. list-table::
   :widths: 15 20 15 50
   :header-rows: 1

   * - Argument
     - Flag
     - Default
     - Description
   * - ``--fasta_file``
     - ``-i``
     - *(Required)*
     - Path to query input FASTA file.
   * - ``--output_dir``
     - ``-od``
     - ``deepnec_results``
     - Directory path for saving intermediate and final prediction TSVs.
   * - ``--output_file``
     - ``-o``
     - ``deepnec_predictions.tsv``
     - Filename for final predictions table.
   * - ``--level``
     - ``-l``
     - ``Phase4``
     - Target pipeline depth: ``Phase1``, ``Phase2``, ``Phase3``, or ``Phase4``.
   * - ``--pathway``
     - ``-n``
     - ``all``
     - Specific pathway target for Phase 4 prediction or alias shortcut.
   * - ``--seqtype``
     - ``-t``
     - ``prot``
     - Input sequence type: ``prot`` (Protein) or ``nucl`` (Nucleotide).
   * - ``--version``
     - ``-v``
     - --
     - Display deepNEC package version and exit.

Pathway Alias Shortcuts & Normalization
---------------------------------------

The ``-n`` / ``--pathway`` flag accepts both full canonical pathway names and standard scientific shorthand aliases:

.. list-table::
   :widths: 30 30 40
   :header-rows: 1

   * - User CLI Alias (``-n``)
     - Canonical Target Name
     - Description
   * - ``all``, ``all_models``
     - ``all``
     - Predicts EC numbers across all predicted pathways (Default).
   * - ``nitri``, ``nitrification``
     - ``nitrification``
     - Nitrification Pathway (EC 1.14.99.39, EC 1.7.2.6).
   * - ``nfix``, ``nitrogen_fixation``
     - ``Nitrogen_Fixation``
     - Nitrogen Fixation (Nitrogenase EC 1.18.6.1).
   * - ``anammox``
     - ``anammox``
     - Anaerobic Ammonium Oxidation (EC 1.7.2.7, EC 1.7.2.8).
   * - ``assim``, ``assimilatory``
     - ``assimilatory``
     - Assimilatory Nitrate Reduction (10 EC classes).
   * - ``dissim``, ``dissimilatory``
     - ``dissimilatory``
     - Dissimilatory Nitrate Reduction (EC 1.7.1.15, EC 1.7.2.2).
   * - ``denitri``, ``denitrification``
     - ``denitrification``
     - Denitrification Pathway (EC 1.7.2.4, EC 1.7.2.5).
   * - ``addn``
     - ``addn``
     - Combined ADDN complex pathways (EC 1.7.99.-, EC 1.7.99.4).
   * - ``ddn``
     - ``DDN``
     - Dissimilatory + Denitrification + Nitrification (EC 1.7.5.1).
   * - ``dn``
     - ``DN``
     - Denitrification + Nitrification (EC 1.7.2.1).
   * - ``dd``
     - ``DD``
     - Dissimilatory + Denitrification (EC 1.9.6.1).

Example Commands
----------------

1. Full Hierarchical Pipeline (Phases 1 -> 2 -> 3 -> 4)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Run all 4 phases on query protein sequences in ``query.fasta``:

.. code-block:: bash

   deepnec -i query.fasta -od my_results -o predictions.tsv

2. Phase 1 Only (Binary Enzyme Filtering)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Filter a large genomic FASTA file to identify enzyme sequences:

.. code-block:: bash

   deepnec -i query.fasta -od my_results -l Phase1

3. Targeting a Specific Pathway (e.g. Nitrification)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Predict EC numbers specifically for Nitrification enzymes using shorthand alias ``-n nitri``:

.. code-block:: bash

   deepnec -i query.fasta -od my_results -n nitri

4. Nucleotide Input Handling
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Translate nucleotide query sequences into longest ORFs via TransDecoder and run predictions:

.. code-block:: bash

   deepnec -i query_nt.fasta -t nucl -od my_results
