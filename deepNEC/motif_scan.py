#!/usr/bin/env python3
# Author: Naveen Duhan
"""
deepNEC 2.0: Biological Motif and Feature Scanner
Scans sequence files for active biological motifs relevant to nitrogen metabolism.
"""

import os
import sys
import argparse
import re
import pandas as pd
from Bio import SeqIO

# Add local path to sys.path to resolve imports from deepNEC
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from deepNEC.config import MOTIF_PATTERNS


def scan_sequence_motifs(record):
    """
    Scans a single sequence record for active nitrogen metabolism cofactors and motifs.
    """
    seq = str(record.seq).upper()
    clean_seq = re.sub(r'[^ARNDCQEGHILKMFPSTWYV]', '', seq)

    # Define motif scanning patterns
    scan_patterns = {
        'Rossmann_Fold': MOTIF_PATTERNS['rossmann'],
        'NADP_Basic': MOTIF_PATTERNS['nadp_basic'],
        'NAD_Acidic': MOTIF_PATTERNS['nad_acidic'],
        'Ferredoxin_FeS': MOTIF_PATTERNS['ferredoxin'],
        'Mo_MGD_Binding': MOTIF_PATTERNS['mo_mgd'],
        'Heme_Binding_CXXCH': r'C[A-Z]{2}CH',
        'Iron_Sulfur_CxxC': r'C[A-Z]{2}C'
    }

    results = {
        'SampleID': record.id,
        'Sequence_Length': len(clean_seq)
    }

    # Count occurrences
    for name, pattern in scan_patterns.items():
        results[name] = len(re.findall(pattern, clean_seq))

    return results


def main():
    parser = argparse.ArgumentParser(
        description="deepNEC 2.0 Motif Scanner: Scan FASTA sequences for active cofactor and binding motifs."
    )
    parser.add_argument("-i", "--fasta_file", required=True, help="Input FASTA sequence file path")
    parser.add_argument("-o", "--output_file", default="motif_scan_report.tsv", help="Output TSV report path")

    args = parser.parse_args()

    if not os.path.exists(args.fasta_file):
        print(f"[ERROR] Input file '{args.fasta_file}' does not exist.")
        sys.exit(1)

    print(f"==================================================")
    print(f" deepNEC 2.0 Motif Scanner")
    print(f"==================================================")
    print(f"Scanning sequences in: {args.fasta_file}...")

    records = list(SeqIO.parse(args.fasta_file, "fasta"))
    print(f"Loaded {len(records)} sequences.")

    results_list = []
    for record in records:
        res = scan_sequence_motifs(record)
        results_list.append(res)

    df = pd.DataFrame(results_list)

    # Save output
    df.to_csv(args.output_file, sep="\t", index=False)
    print(f"[SUCCESS] Motif scan report written to: {args.output_file}")


if __name__ == "__main__":
    main()
