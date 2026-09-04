# Author: Naveen Duhan
"""Canonical class orders and routing for the corrected DeepNEC 2.0 models."""

# These orders must remain identical to the output-node orders recorded by the
# final Round 2 model manifests.
PHASE1_CLASSES = ["enzyme", "non_enzyme"]
PHASE2_CLASSES = ["nitrogen", "non_nitrogen"]
PHASE3_CLASSES = [
    "anammox",
    "assimilatory",
    "denitrification",
    "denitrification_nitrification",
    "dissimilatory",
    "dissimilatory_denitrification",
    "dissimilatory_denitrification_nitrification",
    "hydroxylamine_reduction",
    "nitrification",
    "nitrogen_fixation",
]

# Five pathway-conditioned learned classifiers (16 terminal outputs).
PATHWAY_EC_MAPPING = {
    "anammox": ["1.7.2.7", "1.7.2.8"],
    "assimilatory": [
        "1.4.1.13-14+1.4.7.1",
        "1.4.1.2",
        "1.4.1.3",
        "1.4.1.4",
        "1.7.1.1-3+1.7.7.2",
        "1.7.1.4",
        "1.7.7.1",
        "6.3.1.2",
    ],
    "denitrification": ["1.7.2.4", "1.7.2.5"],
    "dissimilatory": ["1.7.1.15", "1.7.2.2"],
    "nitrification": ["1.14.99.39", "1.7.2.6"],
}

# Five single-EC Phase 3 branches (five direct terminal outputs).
DIRECT_EC_MAPPING = {
    "denitrification_nitrification": "1.7.2.1",
    "dissimilatory_denitrification": "1.9.6.1",
    "dissimilatory_denitrification_nitrification": "1.7.5.1",
    "hydroxylamine_reduction": "1.7.99.1",
    "nitrogen_fixation": "1.18.6.1",
}

# Cofactor Motif Regex Patterns
MOTIF_PATTERNS = {
    "rossmann": r"[LIVMFYGA]{6}.{0,5}[DE]",
    "nadp_basic": r"[KR].{2,4}[KR].{6,10}[LIVMFY]",
    "nad_acidic": r"[D][DED].{6,12}[LIVMFY]",
    "ferredoxin": r"C.{2,4}C.{2,4}C.{3,15}C",
    "mo_mgd": r"C.{2,4}C.{10,30}C"
}
