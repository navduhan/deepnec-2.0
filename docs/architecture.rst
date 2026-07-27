Hierarchical Pipeline Architecture
===================================

deepNEC 2.0 uses a 4-stage hierarchical deep learning architecture designed for alignment-free enzyme classification and EC prediction.

Overview of Prediction Phases
-----------------------------

Phase 1: Binary Enzyme Filter
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Classifies query proteins into **Enzyme** vs. **Non-enzyme**.

* **Feature Vector**: 4,248-dimensional multi-descriptor representation:
  - 1,280-dim mean-pooled **ESM-2 650M Fold 5 LoRA** fine-tuned embeddings.
  - 2,968 physical-chemical descriptors (CKSAAP $k=0,1,2,3,4,5$, AAC, PAAC, CTD, amphiphilic pseudo-amino acid composition).
* **Classifier**: Deep Neural Network flatbuffer (``phase1_ultimate_hybrid.tflite``, 18.46 MB).
* **Performance**: Selection Val MCC ``0.8929``, Test MCC ``0.8718``, Test Accuracy ``93.62%``.

Phase 2: Nitrogen Metabolism Filter
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Filters Phase 1 enzymes into **Nitrogen Metabolism Enzyme** vs. **Non-nitrogen Metabolism Enzyme**.

* **Feature Representation**: Base mean-pooled 1,280-dim **ESM-2 650M** embeddings.
* **Classifier**: Deep Neural Network flatbuffer (``phase2_esm2.tflite``, 2.76 MB).
* **Performance**: Selection Val MCC ``0.9864``, Test MCC ``0.9738``, Test Accuracy ``99.38%``.

Phase 3: 10-Pathway Sub-pathway Predictor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Classifies nitrogen metabolism enzymes across 10 sub-pathways:

1. ``ADDN`` (Assimilatory + Dissimilatory + Denitrification + Nitrification)
2. ``Anammox`` (Anaerobic Ammonium Oxidation)
3. ``Assimilatory`` (Assimilatory Nitrate Reduction)
4. ``DN`` (Denitrification + Nitrification)
5. ``Denitrification`` (Respiratory Denitrification)
6. ``DD`` (Dissimilatory + Denitrification)
7. ``DDN`` (Dissimilatory + Denitrification + Nitrification)
8. ``Dissimilatory`` (Dissimilatory Nitrate Reduction)
9. ``Nitrogen_Fixation`` (Nitrogen Fixation)
10. ``Nitrification`` (Nitrification)

* **Classifier**: Deep Neural Network flatbuffer (``phase3_esm2.tflite``, 2.76 MB, Fold 4).
* **Performance**: Selection Val MCC ``0.9512``, Test MCC ``0.9478``, Test Accuracy ``95.62%``.

Phase 4: Fine-Grained EC Number Assignment (24 Output Classes)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Predicts fine-grained EC numbers across 24 ground truth output classes:

* **6 Multi-EC Learned Branches (20 Output Classes)**:
  - ``anammox``: 2 EC classes (1.7.2.7, 1.7.2.8)
  - ``assimilatory``: 10 EC classes (1.4.1.13-14, 1.4.1.2, 1.4.1.3, 1.4.1.4, 1.4.7.1, 1.7.1.1-3, 1.7.1.4, 1.7.7.1, 1.7.7.2, 6.3.1.2)
  - ``addn``: 2 EC classes (1.7.99.-, 1.7.99.4)
  - ``denitrification``: 2 EC classes (1.7.2.4, 1.7.2.5)
  - ``dissimilatory``: 2 EC classes (1.7.1.15, 1.7.2.2)
  - ``nitrification``: 2 EC classes (1.14.99.39, 1.7.2.6)
* **4 Direct 1-to-1 Pathway Mappings (4 Output Classes)**:
  - ``DD``: 1.9.6.1
  - ``DDN``: 1.7.5.1
  - ``DN``: 1.7.2.1
  - ``Nitrogen_Fixation``: 1.18.6.1

* **Total Output Classes**: **24 Output Classes** covering 28 specific EC numbers.
* **Performance**: Independent Test MCC ``0.9142 – 1.0000``.
