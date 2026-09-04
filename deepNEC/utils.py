# Author: Naveen Duhan
"""
DeepNEC 2.0 Utilities Module
Provides FASTA file parsing, sequence processing, argument parsing, and result merging functions.
"""

import os
import argparse
import warnings
import pandas as pd
from Bio import SeqIO

VALID_PATHWAYS = [
    'all', 'all_models', 'all_pathways',
    'anammox', 'assimilatory', 'denitrification', 'dissimilatory', 'nitrification',
    'denitrification_nitrification', 'dissimilatory_denitrification',
    'dissimilatory_denitrification_nitrification', 'hydroxylamine_reduction',
    'nitrogen_fixation', 'nitri', 'nfix', 'assim', 'dissim', 'denitri'
]

PATHWAY_ALIAS_MAP = {
    'all': 'all',
    'all_models': 'all_models',
    'all_pathways': 'all_models',
    'nitri': 'nitrification',
    'nitrification': 'nitrification',
    'nfix': 'nitrogen_fixation',
    'nitrogen_fixation': 'nitrogen_fixation',
    'anammox': 'anammox',
    'assim': 'assimilatory',
    'assimilatory': 'assimilatory',
    'dissim': 'dissimilatory',
    'dissimilatory': 'dissimilatory',
    'denitri': 'denitrification',
    'denitrification': 'denitrification',
    'hydroxylamine_reduction': 'hydroxylamine_reduction',
    'ddn': 'dissimilatory_denitrification_nitrification',
    'dn': 'denitrification_nitrification',
    'dd': 'dissimilatory_denitrification',
    'denitrification_nitrification': 'denitrification_nitrification',
    'dissimilatory_denitrification': 'dissimilatory_denitrification',
    'dissimilatory_denitrification_nitrification': 'dissimilatory_denitrification_nitrification'
}

def normalize_pathway_target(target):
    """
    Normalizes user pathway CLI arguments (e.g. nitri -> nitrification, nfix -> Nitrogen_Fixation).
    """
    if not target:
        return 'all'
    t_clean = str(target).strip().lower()
    for alias, canonical in PATHWAY_ALIAS_MAP.items():
        if t_clean == alias.lower():
            return canonical
    return target

def parse_fasta(fasta_file):
    """
    Reads a FASTA file and returns a list of dictionaries with sequence ID and sequence text.
    Validates FASTA records for missing files, empty files, duplicate sequence IDs, empty sequences,
    invalid residues, and sequences that are empty after cleaning.

    The unknown-residue symbol ``X`` is removed before feature extraction and the number
    removed is reported as a warning. The original sequence is retained in the returned
    metadata. Other ambiguous/non-standard amino-acid symbols are rejected because the
    deployed feature extractors do not interpret them consistently.
    """
    import re
    if not os.path.exists(fasta_file):
        raise FileNotFoundError(f"Input FASTA file '{fasta_file}' does not exist.")

    records = []
    seen_ids = set()

    with open(fasta_file, encoding='utf-8') as fasta_handle:
        fasta_records = list(SeqIO.parse(fasta_handle, 'fasta'))

    for record in fasta_records:
        rec_id = str(record.id).strip()
        rec_seq = str(record.seq).strip().upper()

        if not rec_id:
            raise ValueError("FASTA file contains a record with an empty sequence identifier.")
        if rec_id in seen_ids:
            raise ValueError(f"Duplicate sequence identifier '{rec_id}' detected in FASTA file. Sequence identifiers must be unique.")
        seen_ids.add(rec_id)

        if not rec_seq:
            raise ValueError(f"Sequence identifier '{rec_id}' contains an empty sequence string.")

        original_seq = rec_seq
        removed_x_count = rec_seq.count('X')
        if removed_x_count:
            rec_seq = rec_seq.replace('X', '')
            warnings.warn(
                f"Sequence '{rec_id}': removed {removed_x_count} unknown residue(s) "
                "marked 'X' before feature extraction.",
                RuntimeWarning,
                stacklevel=2,
            )

        invalid_chars = set(re.findall(r'[^ARNDCQEGHILKMFPSTWYV]', rec_seq))
        if invalid_chars:
            bad_chars = ", ".join(sorted(list(invalid_chars)))
            raise ValueError(f"Sequence '{rec_id}' contains invalid/non-standard amino acid character(s): '{bad_chars}'. Only the 20 standard amino acids are permitted; unknown residues marked 'X' are removed automatically.")

        if not rec_seq:
            raise ValueError(f"Sequence '{rec_id}' is empty after removing unknown residues marked 'X'.")

        records.append({
            'id': rec_id,
            'seq': rec_seq,
            'original_seq': original_seq,
            'removed_unknown_residues': removed_x_count,
            'record': record
        })

    if not records:
        raise ValueError(f"Input FASTA file '{fasta_file}' contains no valid FASTA records.")

    return records


def filter_fasta_by_ids(fasta_file, output_fasta, target_ids):
    """
    Filter sequences in input FASTA file matching target_ids and write to output_fasta.
    """
    id_set = set(target_ids)
    selected = []
    for record in SeqIO.parse(fasta_file, 'fasta'):
        if record.id in id_set:
            selected.append(record)

    with open(output_fasta, 'w') as out_f:
        SeqIO.write(selected, out_f, 'fasta')

    return output_fasta


def argument_parser(version=None):
    """
    CLI argument parser for DeepNEC 2.0
    """
    parser = argparse.ArgumentParser(
        description="DeepNEC 2.0: Deep learning-based nitrogen metabolism enzyme classifier and EC predictor."
    )
    parser.add_argument('-i', '--fasta_file', required=True, help="Input FASTA file path")
    parser.add_argument('-od', '--output_dir', default='deepnec_results', help="Output directory path")
    parser.add_argument('-o', '--output_file', default='deepnec_predictions.tsv', help="Final predictions output filename")
    parser.add_argument('-l', '--level', default='Phase4', choices=['Phase1', 'Phase2', 'Phase3', 'Phase4'], help="Prediction hierarchy level (default: Phase4)")
    parser.add_argument('-n', '--pathway', default='all', choices=VALID_PATHWAYS, help="Specific corrected Phase 4 pathway or direct mapping (default: all routed pathways)")
    parser.add_argument('-t', '--seqtype', default='prot', choices=['prot', 'nucl'], help="Input sequence type (prot or nucl)")

    if version:
        parser.add_argument('-v', '--version', action='version', version=f"DeepNEC {version}")

    return parser
