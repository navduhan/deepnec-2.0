#!/usr/bin/env python3
# Author: Naveen Duhan
"""
deepNEC 2.0: GFF3 Genome Annotation Updater
Integrates deepNEC nitrogen enzyme prediction results into standard GFF3 files.
"""

import os
import sys
import argparse
import re
import pandas as pd


def parse_attributes(attr_string):
    """
    Parses a GFF3 attribute string (Column 9) into a dictionary.
    """
    attrs = {}
    if not attr_string or attr_string == '.':
        return attrs
    # Split by semicolon, but handle possible trailing semicolon or empty parts
    parts = filter(None, attr_string.strip().split(';'))
    for part in parts:
        if '=' in part:
            k, v = part.split('=', 1)
            attrs[k.strip()] = v.strip()
    return attrs


def format_attributes(attrs):
    """
    Formats an attribute dictionary back to a GFF3 attribute string.
    """
    return ";".join([f"{k}={v}" for k, v in attrs.items()])


def main():
    parser = argparse.ArgumentParser(
        description="deepNEC 2.0 GFF3 Annotator: Incorporate predictions into GFF3 genome files."
    )
    parser.add_argument("-g", "--gff_file", required=True, help="Input GFF3 annotation file path")
    parser.add_argument("-p", "--predictions", required=True, help="predictions TSV file path")
    parser.add_argument("-o", "--output_gff", default="annotated_output.gff", help="Output annotated GFF3 path")

    args = parser.parse_args()

    if not os.path.exists(args.gff_file):
        print(f"[ERROR] GFF file '{args.gff_file}' does not exist.")
        sys.exit(1)
    if not os.path.exists(args.predictions):
        print(f"[ERROR] Predictions file '{args.predictions}' does not exist.")
        sys.exit(1)

    print(f"==================================================")
    print(f" deepNEC 2.0 GFF3 Annotator")
    print(f"==================================================")
    print(f"Loading predictions...")

    # Load predictions and build a lookup dictionary
    pred_df = pd.read_csv(args.predictions, sep="\t")

    # Check if this is a Phase 4 output with the required columns
    required_cols = ['SampleID', 'Pathway', 'EC_Number', 'Confidence']
    missing_cols = [c for c in required_cols if c not in pred_df.columns]
    if missing_cols:
        print(f"[WARNING] Predictions file '{args.predictions}' is missing required annotation columns: {missing_cols}.")
        print("This typically happens when no positive Phase 4 predictions are generated. Skipping GFF annotation.")
        import shutil
        shutil.copyfile(args.gff_file, args.output_gff)
        sys.exit(0)

    pred_map = {}
    stripped_pred_map = {}
    for _, row in pred_df.iterrows():
        sample_id = str(row['SampleID']).strip()
        pred_map[sample_id] = {
            'Pathway': row['Pathway'],
            'EC': row['EC_Number'],
            'Confidence': row['Confidence']
        }
        # Map version-stripped ID to the original SampleID
        stripped_id = re.sub(r'\.\d+$', '', sample_id)
        stripped_pred_map[stripped_id] = sample_id

    print(f"Loaded {len(pred_map)} predictions.")

    print(f"Updating GFF file: {args.gff_file}...")
    updated_count = 0

    with open(args.gff_file, 'r') as in_f, open(args.output_gff, 'w') as out_f:
        for line in in_f:
            # Pass comments or headers directly
            if line.startswith('#'):
                out_f.write(line)
                continue

            cols = line.strip().split('\t')
            if len(cols) < 9:
                out_f.write(line)
                continue

            feature_type = cols[2]
            attr_str = cols[8]
            attrs = parse_attributes(attr_str)

            # Look for IDs in attributes that match our prediction SampleIDs
            # Commonly check 'ID', 'Name', or 'gene' tags
            matched_id = None
            for key in ['ID', 'Name', 'locus_tag', 'protein_id']:
                val = attrs.get(key)
                if val:
                    # Clean possible prefix (e.g. 'cds-' or 'gene-')
                    cleaned_val = re.sub(r'^(cds-|gene-|rna-)', '', val)
                    if cleaned_val in pred_map:
                        matched_id = cleaned_val
                        break
                    elif val in pred_map:
                        matched_id = val
                        break

                    # Suffix-stripped matching
                    stripped_val = re.sub(r'\.\d+$', '', val)
                    stripped_cleaned = re.sub(r'\.\d+$', '', cleaned_val)
                    if stripped_cleaned in stripped_pred_map:
                        matched_id = stripped_pred_map[stripped_cleaned]
                        break
                    elif stripped_val in stripped_pred_map:
                        matched_id = stripped_pred_map[stripped_val]
                        break

            if matched_id:
                pred = pred_map[matched_id]
                updated_count += 1

                # 1. Update product tag
                ec_suffix = f" [EC:{pred['EC']}]"
                orig_product = attrs.get('product', 'predicted protein')
                # Clean existing EC number if any
                clean_product = re.sub(r'\s*\[EC:[^\]]+\]', '', orig_product)
                attrs['product'] = f"nitrogen cycle {pred['Pathway'].lower()} enzyme ({clean_product}){ec_suffix}"

                # 2. Update/add db_xref or Ontology_term
                db_xref = attrs.get('db_xref', '')
                ec_xref = f"EC:{pred['EC']}"
                if ec_xref not in db_xref:
                    if db_xref:
                        attrs['db_xref'] = f"{db_xref},{ec_xref}"
                    else:
                        attrs['db_xref'] = ec_xref

                # 3. Add custom deepNEC tags
                attrs['deepnec_pathway'] = pred['Pathway']
                attrs['deepnec_confidence'] = f"{pred['Confidence']}%"

                cols[8] = format_attributes(attrs)
                out_f.write("\t".join(cols) + "\n")
            else:
                out_f.write(line)

    print(f"[SUCCESS] GFF updating complete.")
    print(f"Updated {updated_count} genomic features.")
    print(f"Annotated GFF3 file saved to: {args.output_gff}")


if __name__ == "__main__":
    main()
