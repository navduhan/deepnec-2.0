#!/usr/bin/env bash
#SBATCH --job-name=deepnec
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --cpus-per-task=6
#SBATCH --mem=64G
#SBATCH --time=12:00:00
#SBATCH --output=slurm-%x-%j.out
#SBATCH --error=slurm-%x-%j.err

set -euo pipefail
umask 077

if [[ $# -ne 5 ]]; then
  echo "Usage: $0 input.fasta Phase1|Phase2|Phase3|Phase4 pathway final output-directory" >&2
  exit 64
fi

input_fasta=$1
level=$2
pathway=$3
model=$4
output_dir=$5

case "$level" in
  Phase1|Phase2|Phase3|Phase4) ;;
  *) echo "Invalid DeepNEC phase: $level" >&2; exit 64 ;;
esac

case "$pathway" in
  all|all_models|all_pathways|anammox|assimilatory|denitrification|denitrification_nitrification|dissimilatory|dissimilatory_denitrification|dissimilatory_denitrification_nitrification|hydroxylamine_reduction|nitrification|nitrogen_fixation) ;;
  *) echo "Invalid DeepNEC pathway: $pathway" >&2; exit 64 ;;
esac

if [[ "$model" != "final" ]]; then
  echo "Only the frozen final model set is deployable." >&2
  exit 64
fi

if [[ ! -f "$input_fasta" || ! -s "$input_fasta" ]]; then
  echo "Input FASTA is missing or empty: $input_fasta" >&2
  exit 66
fi

input_dir=$(cd -- "$(dirname -- "$input_fasta")" && pwd -P)
input_fasta="$input_dir/$(basename -- "$input_fasta")"
mkdir -p -- "$output_dir"
output_dir=$(cd -- "$output_dir" && pwd -P)

app_dir="${DEEPNEC_APP_DIR:-$HOME/naveen_tools/deepnec-2.0}"
if [[ ! -f "$app_dir/deepNEC/__main__.py" ]]; then
  echo "DeepNEC installation is missing: $app_dir" >&2
  echo "Set DEEPNEC_APP_DIR to the maintained DeepNEC repository checkout." >&2
  exit 69
fi

module_name="${DEEPNEC_MODULE-ml-gpu}"
if [[ -n "$module_name" ]] && command -v module >/dev/null 2>&1; then
  module load "$module_name"
fi

if [[ -n "${PYTHON_BIN:-}" ]]; then
  python_bin="$PYTHON_BIN"
elif [[ -x "$app_dir/.venv/bin/python" ]]; then
  python_bin="$app_dir/.venv/bin/python"
else
  python_bin=$(command -v python3 || true)
fi
if [[ -z "$python_bin" || ! -x "$python_bin" ]]; then
  echo "A DeepNEC Python interpreter was not found." >&2
  echo "Set PYTHON_BIN to the interpreter containing DeepNEC's dependencies." >&2
  exit 69
fi

export PYTHONPATH="$app_dir${PYTHONPATH:+:$PYTHONPATH}"
export TF_FORCE_GPU_ALLOW_GROWTH="${TF_FORCE_GPU_ALLOW_GROWTH:-true}"
export TF_CPP_MIN_LOG_LEVEL="${TF_CPP_MIN_LOG_LEVEL:-2}"

"$python_bin" -c 'import Bio, numpy, pandas, tensorflow, torch, transformers'

"$python_bin" -m deepNEC \
  -i "$input_fasta" \
  -od "$output_dir" \
  -o deepnec_predictions.tsv \
  -l "$level" \
  -n "$pathway" \
  -t prot

"$python_bin" -m deepNEC.motif_scan \
  -i "$input_fasta" \
  -o "$output_dir/motif_scan_report.tsv"

prediction_file=$(find "$output_dir" -maxdepth 1 -type f -name '*predictions.tsv' -size +0c -print -quit)
if [[ -z "$prediction_file" ]]; then
  echo "DeepNEC finished without a non-empty prediction table." >&2
  exit 70
fi

echo "DeepNEC results: $output_dir"
