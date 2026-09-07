Hierarchical Pipeline Architecture
===================================

DeepNEC 2.0.4 uses the final Round 2 models in a four-phase hierarchy. All
learned heads consume 1,280-dimensional residue-mean embeddings from
``facebook/esm2_t33_650M_UR50D``.

Prediction phases
-----------------

Phase 1: enzyme filter
~~~~~~~~~~~~~~~~~~~~~~

The final frozen model classifies proteins as ``enzyme`` or ``non_enzyme``.
For proteins longer than 1,022 residues, DeepNEC uses overlapping
1,022-residue windows with 128-residue overlap. Midpoint ownership at each
overlap assigns every residue to exactly one window before the retained
residue representations are averaged across the complete protein, matching
Phase 1 training.

Phase 2: nitrogen-metabolism filter
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sequences predicted as enzymes are classified as ``nitrogen`` or
``non_nitrogen``. Phase 2 and every later learned head use the first 1,022
residues of a longer protein, matching the embeddings used to train those
models.

Phase 3: corrected pathway classifier
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Nitrogen-metabolism sequences are assigned to one of ten classes:

* ``anammox``
* ``assimilatory``
* ``denitrification``
* ``denitrification_nitrification``
* ``dissimilatory``
* ``dissimilatory_denitrification``
* ``dissimilatory_denitrification_nitrification``
* ``hydroxylamine_reduction``
* ``nitrification``
* ``nitrogen_fixation``

Phase 4: terminal assignment
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Five branches use pathway-conditioned learned classifiers:

* ``anammox``: 1.7.2.7, 1.7.2.8
* ``assimilatory``: eight merged labels defined in the deployment manifest
* ``denitrification``: 1.7.2.4, 1.7.2.5
* ``dissimilatory``: 1.7.1.15, 1.7.2.2
* ``nitrification``: 1.14.99.39, 1.7.2.6

Five single-EC branches are mapped deterministically:

* ``denitrification_nitrification``: 1.7.2.1
* ``dissimilatory_denitrification``: 1.9.6.1
* ``dissimilatory_denitrification_nitrification``: 1.7.5.1
* ``hydroxylamine_reduction``: 1.7.99.1
* ``nitrogen_fixation``: 1.18.6.1

The merged corrected ontology therefore has 16 learned terminal labels and
five direct labels: 21 deployable labels representing 26 current source EC
annotations. Obsolete 1.7.99.4 and incomplete 1.7.99.- are not outputs.
