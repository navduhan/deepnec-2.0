# Author: Naveen Duhan
"""
Title: DeepNEC 2.0 Main Execution Script
Author: Naveen Duhan
Lab: KAABiL (Kaundal Artificial Intelligence & Advanced Bioinformatics Lab)
Version: 2.0.2
"""

import os
import sys
import time
import shutil
import warnings
import pandas as pd

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN_WARNING"] = "1"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"
warnings.filterwarnings("ignore")

import deepNEC
from deepNEC import utils
from deepNEC import nn_prediction
from deepNEC import __version__



import subprocess

def Nt2AA(fasta_file, output_dir):
    """
    Translates nucleotide sequences to protein using TransDecoder.
    """
    exec_path = shutil.which('TransDecoder.LongOrfs')
    if not exec_path:
        raise RuntimeError("TransDecoder.LongOrfs not found on PATH. Please install TransDecoder for nucleotide input.")

    out_pep = os.path.join(output_dir, "translated_proteins.fasta")
    trans_out_dir = os.path.join(output_dir, "transdecoder_out")

    cmd = [exec_path, "-t", fasta_file, "--output_dir", trans_out_dir]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"TransDecoder.LongOrfs failed with exit code {e.returncode}")

    pep_src = os.path.join(trans_out_dir, "longest_orfs.pep")
    if os.path.exists(pep_src):
        shutil.copy(pep_src, out_pep)
        return out_pep
    else:
        raise RuntimeError("TransDecoder failed to produce longest_orfs.pep.")


def run_dnn_pipeline(fasta_file, output_dir, level, pathway_target):
    """
    Hierarchical Deep Learning Prediction Pipeline (Phases 1 to 4).
    """
    pathway_target = utils.normalize_pathway_target(pathway_target)
    records = utils.parse_fasta(fasta_file)
    if not records:
        print("Error: Input FASTA file contains no valid sequences.")
        return None

    print(f"Loaded {len(records)} query sequences from {fasta_file}")

    # Phase 1: Ultimate Hybrid Fold 5 LoRA + Descriptors (4,248-dim)
    print("Running Phase 1: Binary Enzyme Filter (Ultimate Hybrid Fold 5 LoRA + Descriptors)...")
    phase1_ids, p1_df = nn_prediction.predict_phase1(records)
    p1_out = os.path.join(output_dir, "Phase_1_predictions.tsv")
    p1_df.to_csv(p1_out, sep="\t", index=False)
    print(f"[Phase 1] Classified {len(phase1_ids)} / {len(records)} sequences as Enzymes.")

    if level == "Phase1":
        return p1_df

    if not phase1_ids:
        print("[Phase 1] No sequences passed Phase 1 (Enzyme). Halting pipeline.")
        return p1_df

    # Phase 2: Base ESM-2 embeddings computed for sequences passing Phase 1
    p1_records = [r for r in records if r['id'] in set(phase1_ids)]
    print("Extracting base ESM-2 650M embeddings for Phase 2–4...")
    from deepNEC.features import extract_esm2_embeddings
    esm2_embeddings = extract_esm2_embeddings([r['seq'] for r in p1_records], use_lora=False)

    phase2_ids, p2_df = nn_prediction.predict_phase2(p1_records, esm2_embeddings=esm2_embeddings)
    p2_out = os.path.join(output_dir, "Phase_2_predictions.tsv")
    p2_df.to_csv(p2_out, sep="\t", index=False)
    print(f"[Phase 2] Classified {len(phase2_ids)} / {len(p1_records)} sequences as Nitrogen Metabolism Enzymes.")

    if level == "Phase2":
        return p2_df

    if not phase2_ids:
        print("[Phase 2] No sequences passed Phase 2 (Nitrogen Metabolism). Halting pipeline.")
        return p2_df

    # Phase 3
    p2_records = [r for r in p1_records if r['id'] in set(phase2_ids)]
    p2_esm_indices = [i for i, r in enumerate(p1_records) if r['id'] in set(phase2_ids)]
    p2_esm_embeddings = esm2_embeddings[p2_esm_indices] if esm2_embeddings is not None else None

    pathway_seqs, p3_df = nn_prediction.predict_phase3(p2_records, esm2_embeddings=p2_esm_embeddings)
    p3_out = os.path.join(output_dir, "Phase_3_predictions.tsv")
    p3_df.to_csv(p3_out, sep="\t", index=False)
    print(f"[Phase 3] Classified sequences into {len(p3_df['Predicted_Pathway'].unique())} Nitrogen Pathways.")

    if level == "Phase3":
        return p3_df

    # Phase 4: EC Predictions across pathways
    p4_results_list = []

    if pathway_target in ['all_models', 'all_pathways']:
        # Run ALL 10 pathway models on all sequences that passed Phase 2
        all_pathways = list(nn_prediction.config.PATHWAY_EC_MAPPING.keys()) + list(nn_prediction.config.DIRECT_EC_MAPPING.keys())
        for pw_name in all_pathways:
            print(f"[Phase 4] Predicting EC numbers for pathway '{pw_name}' (ALL {len(p2_records)} sequences)...")
            pw_esm_embeddings = esm2_embeddings[p2_esm_indices] if esm2_embeddings is not None else None
            try:
                p4_sub_df = nn_prediction.predict_phase4(p2_records, pw_name, esm2_embeddings=pw_esm_embeddings)
                p4_sub_df['Pathway'] = pw_name
                p4_results_list.append(p4_sub_df)
            except Exception as e:
                raise RuntimeError(f"Phase 4 prediction failed for pathway '{pw_name}': {e}")
    else:
        # Standard: run only on predicted pathway (or single specified pathway)
        for pw_name, seqs in pathway_seqs.items():
            if not seqs:
                continue

            if pathway_target != 'all' and pw_name.lower() != pathway_target.lower():
                continue

            print(f"[Phase 4] Predicting EC numbers for pathway '{pw_name}' ({len(seqs)} sequences)...")
            pw_esm_indices = [i for i, r in enumerate(p1_records) if r['id'] in set([s['id'] for s in seqs])]
            pw_esm_embeddings = esm2_embeddings[pw_esm_indices] if esm2_embeddings is not None else None

            try:
                p4_sub_df = nn_prediction.predict_phase4(seqs, pw_name, esm2_embeddings=pw_esm_embeddings)
                p4_sub_df['Pathway'] = pw_name
                p4_results_list.append(p4_sub_df)
            except Exception as e:
                raise RuntimeError(f"Phase 4 prediction failed for pathway '{pw_name}': {e}")

    if p4_results_list:
        final_p4_df = pd.concat(p4_results_list, ignore_index=True)
        cols = ['SampleID', 'Pathway', 'EC_Number', 'Confidence']
        final_p4_df = final_p4_df[cols]
        p4_out = os.path.join(output_dir, "Phase_4_predictions.tsv")
        final_p4_df.to_csv(p4_out, sep="\t", index=False)
        return final_p4_df
    else:
        print("[Phase 4] No EC predictions generated for the specified pathway target.")
        empty_p4 = pd.DataFrame(columns=['SampleID', 'Pathway', 'EC_Number', 'Confidence'])
        p4_out = os.path.join(output_dir, "Phase_4_predictions.tsv")
        empty_p4.to_csv(p4_out, sep="\t", index=False)
        return empty_p4


def main():
    start_time = time.time()
    parser = utils.argument_parser(version=__version__)
    options = parser.parse_args()

    os.makedirs(options.output_dir, exist_ok=True)

    fasta_file = options.fasta_file
    if options.seqtype == 'nucl':
        print("Translating nucleotide query sequences...")
        fasta_file = Nt2AA(fasta_file, options.output_dir)

    phase_descriptions = {
        'Phase1': 'Binary Enzyme vs. Non-Enzyme Filtering',
        'Phase2': 'Nitrogen Metabolism Enzyme Identification',
        'Phase3': '10-Pathway Sub-pathway Classification',
        'Phase4': 'Fine-Grained EC Number Assignment (28 EC Numbers across 24 Output Classes)'
    }
    desc = phase_descriptions.get(options.level, 'Enzyme & EC Prediction')

    print(f"\n==================================================")
    print(f" DeepNEC {__version__} - Nitrogen Metabolism Framework")
    print(f" Level: {options.level} | Task: {desc}")
    print(f"==================================================\n")

    final_result = run_dnn_pipeline(
        fasta_file=fasta_file,
        output_dir=options.output_dir,
        level=options.level,
        pathway_target=options.pathway
    )

    out_file_path = os.path.join(options.output_dir, options.output_file)
    os.makedirs(os.path.dirname(out_file_path), exist_ok=True)
    if final_result is not None and not final_result.empty:
        final_result.to_csv(out_file_path, sep="\t", index=False)
        print(f"\n[SUCCESS] Final predictions written to: {out_file_path}")
    else:
        print("\nPipeline finished with no positive predictions.")

    elapsed = time.time() - start_time
    print(f"Total execution time: {elapsed:.2f} seconds.")



if __name__ == '__main__':
    main()
