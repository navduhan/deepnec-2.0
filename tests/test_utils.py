# Author: Naveen Duhan
"""Regression tests for FASTA validation and cleaning."""

import tempfile
import unittest
import warnings
from pathlib import Path

from deepNEC.utils import parse_fasta


class ParseFastaTests(unittest.TestCase):
    def _parse(self, sequence):
        with tempfile.TemporaryDirectory() as temp_dir:
            fasta_path = Path(temp_dir) / "query.fasta"
            fasta_path.write_text(f">query\n{sequence}\n", encoding="utf-8")
            return parse_fasta(fasta_path)

    def test_removes_only_x_and_retains_original_sequence(self):
        sequence = "ARNDCQEGHILKMFPSTWYVARNDCQEGHILXKMF"
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            record = self._parse(sequence)[0]

        self.assertEqual(record["seq"], sequence.replace("X", ""))
        self.assertEqual(record["original_seq"], sequence)
        self.assertEqual(record["removed_unknown_residues"], 1)
        self.assertIn("removed 1 unknown residue", str(caught[0].message))

    def test_rejects_other_ambiguous_residues(self):
        with self.assertRaisesRegex(ValueError, "'B'"):
            self._parse("ARNDCQEGHILKMFPSTWYVARNDCQEGHILB")

    def test_checks_minimum_length_after_x_removal(self):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with self.assertRaisesRegex(ValueError, "shorter than the minimum"):
                self._parse("ARNDCQEGHILKMFPSTWYVARNDCQEGHIX")


if __name__ == "__main__":
    unittest.main()
