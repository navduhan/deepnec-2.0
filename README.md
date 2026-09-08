# DeepNEC 2.0: Nitrogen Metabolism Enzyme Classifier & EC Predictor

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![Packaging](https://img.shields.io/badge/packaging-PEP%20621%20%7C%20uv-green.svg)](https://github.com/astral-sh/uv)
[![Documentation Status](https://readthedocs.org/projects/deepnec-20/badge/?version=latest)](https://deepnec-20.readthedocs.io/en/latest/?badge=latest)
[![License](https://img.shields.io/badge/License-GPL_v3-blue.svg)](LICENSE)

**DeepNEC 2.0** is an alignment-free hierarchical framework for **nitrogen-metabolism enzyme classification** and **EC assignment**. The merged ontology produces 21 terminal labels from 26 current EC annotations.

---

## Key Features

- **Hierarchical 4-Phase Pipeline**:
  - **Phase 1**: Final frozen ESM-2 enzyme/non-enzyme classifier.
  - **Phase 2**: Final ESM-2 nitrogen/non-nitrogen classifier.
  - **Phase 3**: Final ESM-2 classifier for 10 corrected nitrogen-pathway classes.
  - **Phase 4**: Five learned pathway-conditioned classifiers and five deterministic single-EC mappings.
- **Modern Packaging & Ultra-Fast TFLite Engine**:
  - Managed via **PEP 621 (pyproject.toml)** with a reproducible **uv.lock**.
  - Powered by compressed, lightweight **TensorFlow Lite (.tflite)** flatbuffers for fast CPU inference.
- **Multiple CLI Entry Point Aliases**:
  - Access via `deepnec`, `deepnec2`, or `deepnec2.0`.
- **Integrated Downstream Utilities**:
  - `deepnec-annotate`: GFF3 genomic locus annotator.
  - `deepnec-motif-scan`: Cofactor & active site motif scanner (Rossmann fold, Ferredoxin Fe-S, Mo-MGD, Heme CXXCH).
  - `deepnec-visualize`: Publication-ready distribution figure generator.

---

## Production Model Selection & Benchmarks

| Phase & target | Deployed model | Held-out test accuracy | Held-out test MCC |
| :--- | :--- | :---: | :---: |
| **Phase 1** enzyme filter | Final all-training ESM-2 | **93.17%** | **0.8631** |
| **Phase 2** nitrogen filter | Final all-training ESM-2 | **97.75%** | **0.9492** |
| **Phase 3** 10 pathways | Final all-training ESM-2 | **95.60%** | **0.9455** |
| **Phase 4** anammox | Final all-training ESM-2 | **100.00%** | **1.0000** |
| **Phase 4** assimilatory merged 8-class | Final all-training ESM-2 | **97.26%** | **0.9613** |
| **Phase 4** denitrification | Final all-training ESM-2 | **100.00%** | **1.0000** |
| **Phase 4** dissimilatory | Final all-training ESM-2 | **100.00%** | **1.0000** |
| **Phase 4** nitrification | Final all-training ESM-2 | **100.00%** | **1.0000** |

---

## Installation

### Option A: Ultra-Fast Installation via uv (Recommended)

```bash
# Clone repository
git clone https://github.com/usubioinfo/deepnec-2.0.git
cd deepnec-2.0

# Create virtual environment & install package in editable mode
uv venv
source .venv/bin/activate
uv pip install -e .
```

### Option B: Standard Installation via pip

```bash
# Install in editable mode
pip install -e .

# Ensure user bin directory is on PATH if running globally
export PATH="$HOME/.local/bin:$PATH"
```

---

## Usage

### 1. Hierarchical 4-Phase Prediction (CLI)

```bash
# Option 1: Direct command (inside activated virtualenv)
deepnec -i example/test.fasta -od my_results -o predictions.tsv

# Option 2: Using version aliases
deepnec2 -i example/test.fasta -od my_results -o predictions.tsv
deepnec2.0 -i example/test.fasta -od my_results -o predictions.tsv

# Option 3: Running via uv run (without activating venv)
uv run deepnec -i example/test.fasta -od my_results -o predictions.tsv
```

### 2. Active Site & Cofactor Motif Scanner
```bash
deepnec-motif-scan -i example/test.fasta -o motif_report.tsv
```

### 3. Publication Figure Visualizer
```bash
deepnec-visualize -i my_results/deepnec_predictions.tsv -od my_results
```

### 4. GFF3 Genomic Locus Annotator
```bash
deepnec-annotate -g genome.gff -p my_results/deepnec_predictions.tsv -o annotated_genome.gff
```

---

## Troubleshooting: `zsh: command not found`

If you encounter `zsh: command not found: deepnec`:

1. **Activate your virtual environment**: `source .venv/bin/activate`
2. **Or run via `uv run`**: `uv run deepnec -i example/test.fasta -od my_results -o predictions.tsv`

---

## Command-Line Options

| Argument | Description | Default |
| :--- | :--- | :--- |
| `-i`, `--fasta_file` | Path to input FASTA file (**Required**) | — |
| `-od`, `--output_dir` | Directory to save prediction outputs | `deepnec_results` |
| `-o`, `--output_file` | Name of final prediction TSV file | `deepnec_predictions.tsv` |
| `-l`, `--level` | Target prediction level (`Phase1`, `Phase2`, `Phase3`, `Phase4`) | `Phase4` |
| `-t`, `--seqtype` | Query sequence type (`prot` or `nucl`) | `prot` |

### Protein sequence validation

Unknown residues represented by `X` are removed before feature extraction, with a warning reporting how many were removed; the original sequence is retained in parsed-record metadata. Other ambiguous or non-standard symbols (including `B`, `Z`, `J`, `U`, and `O`) are rejected. Phase 1 uses overlapping 1,022-residue windows with 128-residue overlap for long proteins and counts every residue once in the complete-protein mean; Phases 2–4 truncate to the first 1,022 residues to reproduce their training preprocessing.

Run the validation tests with:

```bash
python -m unittest discover -s tests -v
```

---

## Citation & Contact

- **Lab**: KAABiL (Kaundal Artificial Intelligence & Advanced Bioinformatics Lab)
- **Author**: Naveen Duhan (naveen.duhan@usu.edu)
- **License**: GNU General Public License v3.0 (GPL-3.0-only)
