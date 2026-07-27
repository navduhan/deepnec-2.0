# DeepNEC 2.0: Nitrogen Metabolism Enzyme Classifier & EC Predictor

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![Packaging](https://img.shields.io/badge/packaging-PEP%20621%20%7C%20uv-green.svg)](https://github.com/astral-sh/uv)
[![License](https://img.shields.io/badge/License-GPL_v3-blue.svg)](LICENSE)

**DeepNEC 2.0** is an alignment-free, deep learning-based hierarchical framework for high-precision **Nitrogen Metabolism Enzyme Classification** and **EC Number Prediction** across 28 specific enzyme classes.

---

## Key Features

- **Hierarchical 4-Phase Pipeline**:
  - **Phase 1**: Binary Enzyme vs. Non-Enzyme Classifier (Ultimate Hybrid 4,248-dim Architecture, Validation Best Fold 5, Test Accuracy: **93.62%**, Test MCC: **0.8718**)
  - **Phase 2**: Binary Nitrogen Metabolism vs. Non-Nitrogen Metabolism Classifier (Validation Best Fold 1, Test Accuracy: **99.38%**, Test MCC: **0.9738**)
  - **Phase 3**: 10-Pathway Nitrogen Metabolism Sub-pathway Predictor (Validation Best Fold 4, Test Accuracy: **95.62%**, Test MCC: **0.9478**)
  - **Phase 4**: Fine-Grained EC Number Predictor covering 28 specific EC numbers across 24 pathway outputs (Test MCC: **0.9142 – 1.0000**)
- **Modern Packaging & Ultra-Fast TFLite Engine**:
  - Managed via **PEP 621 (pyproject.toml)** with `peft` dependency and reproducible **uv.lock**.
  - Powered by compressed, lightweight **TensorFlow Lite (.tflite)** flatbuffers for fast CPU inference.
- **Multiple CLI Entry Point Aliases**:
  - Access via `deepnec`, `deepnec2`, or `deepnec2.0`.
- **Integrated Downstream Utilities**:
  - `deepnec-annotate`: GFF3 genomic locus annotator.
  - `deepnec-motif-scan`: Cofactor & active site motif scanner (Rossmann fold, Ferredoxin Fe-S, Mo-MGD, Heme CXXCH).
  - `deepnec-visualize`: Publication-ready distribution figure generator.

---

## Production Model Selection & Benchmarks

| Phase & Target Category | Selected Architecture | Deployed Fold (Val Best) | Independent Test MCC | Independent Test Accuracy | Model Format & Size |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Phase 1** (Binary Enzyme Filter) | **Ultimate Hybrid** (ESM2-32 LoRA + Descriptors, 4,248-dim) | **Fold 5** | **0.8718** | **93.62%** | .tflite (17.60 MB) |
| **Phase 2** (Nitrogen Filter) | **ESM-2 650M** | **Fold 1** | **0.9738** | **99.38%** | .tflite (2.76 MB) |
| **Phase 3** (10 Sub-pathways) | **ESM-2 650M** | **Fold 4** | **0.9478** | **95.62%** | .tflite (2.76 MB) |
| **Phase 4** (Anammox ECs) | **ESM-2 650M** | **Fold 1** | **0.9142** | **95.90%** | .tflite (2.76 MB) |
| **Phase 4** (Assimilatory ECs) | **ESM-2 650M** | **Fold 3** | **0.9194** | **93.25%** | .tflite (2.76 MB) |
| **Phase 4** (Denitrification ECs) | **ESM-2 650M** | **Fold 1** | **1.0000** | **100.00%** | .tflite (2.76 MB) |
| **Phase 4** (Dissimilatory ECs) | **ESM-2 650M** | **Fold 1** | **1.0000** | **100.00%** | .tflite (2.76 MB) |
| **Phase 4** (Nitrification ECs) | **ESM-2 650M** | **Fold 2** | **0.9931** | **99.77%** | .tflite (2.76 MB) |
| **Phase 4** (All Sub-pathways / ADDN) | **ESM-2 650M** | **Fold 1** | **1.0000** | **100.00%** | .tflite (2.76 MB) |

---

## Installation

### Option A: Ultra-Fast Installation via uv (Recommended)

```bash
# Clone repository
git clone https://github.com/navduhan/deepnec-2.0.git
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

Protein FASTA records must contain at least 31 standard amino acids after cleaning. Unknown residues represented by `X` are removed before feature extraction, with a warning reporting how many were removed; the original sequence is retained in the parsed-record metadata. Other ambiguous or non-standard symbols (including `B`, `Z`, `J`, `U`, and `O`) are rejected because they are not interpreted consistently by all deployed feature extractors.

Run the validation tests with:

```bash
python -m unittest discover -s tests -v
```

---

## Citation & Contact

- **Lab**: KAABiL (Kaundal Artificial Intelligence & Advanced Bioinformatics Lab)
- **Author**: Naveen Duhan (naveen.duhan@usu.edu)
- **License**: GNU General Public License v3.0 (GPL-3.0-only)
