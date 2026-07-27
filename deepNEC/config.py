# Author: Naveen Duhan
"""
DeepNEC 2.0 Configuration
Central repository of class mappings, pathway mappings, and model constants.
"""

# Phase 1: Binary Enzyme vs Non-Enzyme (Index 0 = Enzyme, Index 1 = Non-enzyme)
PHASE1_CLASSES = ["Enzyme", "Non-enzyme"]

# Phase 2: Binary Nitrogen vs Non-Nitrogen Metabolism (Index 0 = Nitrogen, Index 1 = Non-nitrogen)
PHASE2_CLASSES = ["Nitrogen", "Non-nitrogen"]

# Phase 3: 10 Nitrogen Pathways
PHASE3_CLASSES = [
    "ADDN",
    "Anammox",
    "Assimilatory",
    "DN",
    "Denitrification",
    "DD",
    "DDN",
    "Dissimilatory",
    "Nitrogen_Fixation",
    "Nitrification"
]

# Phase 4: Multi-EC Pathway to EC Number Mappings
PATHWAY_EC_MAPPING = {
    "anammox": ["1.7.2.7", "1.7.2.8"],
    "assimilatory": [
        "1.4.1.13-14",
        "1.4.1.2",
        "1.4.1.3",
        "1.4.1.4",
        "1.4.7.1",
        "1.7.1.1-3",
        "1.7.1.4",
        "1.7.7.1",
        "1.7.7.2",
        "6.3.1.2"
    ],
    "addn": ["1.7.99.-", "1.7.99.4"],
    "denitrification": ["1.7.2.4", "1.7.2.5"],
    "dissimilatory": ["1.7.1.15", "1.7.2.2"],
    "nitrification": ["1.14.99.39", "1.7.2.6"]
}

# Direct 1-to-1 Pathway EC Mappings
DIRECT_EC_MAPPING = {
    "DD": "1.9.6.1",                     # dissimilatory_denitrification
    "DDN": "1.7.5.1",                    # dissimilatory_denitrification_nitrification
    "DN": "1.7.2.1",                     # denitrification_nitrification
    "Nitrogen_Fixation": "1.18.6.1"      # nitrogen_fixation
}

# Cofactor Motif Regex Patterns
MOTIF_PATTERNS = {
    "rossmann": r"[LIVMFYGA]{6}.{0,5}[DE]",
    "nadp_basic": r"[KR].{2,4}[KR].{6,10}[LIVMFY]",
    "nad_acidic": r"[D][DED].{6,12}[LIVMFY]",
    "ferredoxin": r"C.{2,4}C.{2,4}C.{3,15}C",
    "mo_mgd": r"C.{2,4}C.{10,30}C"
}
