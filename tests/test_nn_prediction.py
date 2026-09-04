# Author: Naveen Duhan
"""Regression tests for stable TensorFlow Lite CPU inference."""

import hashlib
import json
import unittest
from pathlib import Path

import numpy as np

from deepNEC import config
from deepNEC.features import _esm_windows
from deepNEC.nn_prediction import TFLiteModelWrapper, get_model_path, predict_phase4


class TFLiteInferenceTests(unittest.TestCase):
    def test_deployment_manifest_matches_model_files(self):
        model_root = Path(__file__).parents[1] / "deepNEC" / "data" / "models"
        manifest = json.loads((model_root / "deployment_manifest.json").read_text())
        self.assertEqual(manifest["version"], "2.0.4")
        for relative, metadata in manifest["artifacts"].items():
            with self.subTest(artifact=relative):
                artifact = model_root / relative
                self.assertTrue(artifact.is_file())
                self.assertEqual(artifact.stat().st_size, metadata["size_bytes"])
                self.assertEqual(
                    hashlib.sha256(artifact.read_bytes()).hexdigest(),
                    metadata["sha256"],
                )

    def test_phase2_model_runs_with_builtin_cpu_kernels(self):
        model = TFLiteModelWrapper(get_model_path("phase2"))
        features = np.zeros((1, model.expected_dim), dtype=np.float32)

        predictions = model.predict(features)

        self.assertEqual(predictions.shape[0], 1)
        self.assertTrue(np.isfinite(predictions).all())

    def test_all_final_models_match_canonical_output_orders(self):
        expected = {
            "phase1": len(config.PHASE1_CLASSES),
            "phase2": len(config.PHASE2_CLASSES),
            "phase3": len(config.PHASE3_CLASSES),
            **{name: len(classes) for name, classes in config.PATHWAY_EC_MAPPING.items()},
        }
        for name, class_count in expected.items():
            with self.subTest(model=name):
                model = TFLiteModelWrapper(get_model_path(name))
                self.assertEqual(model.expected_dim, 1280)
                probabilities = model.predict(np.zeros((1, 1280), dtype=np.float32))
                self.assertEqual(probabilities.shape, (1, class_count))
                self.assertTrue(np.isfinite(probabilities).all())

    def test_corrected_terminal_ontology_has_21_outputs(self):
        learned = sum(len(classes) for classes in config.PATHWAY_EC_MAPPING.values())
        self.assertEqual(learned, 16)
        self.assertEqual(learned + len(config.DIRECT_EC_MAPPING), 21)
        self.assertNotIn("1.7.99.4", repr(config.PATHWAY_EC_MAPPING))
        self.assertNotIn("1.7.99.-", repr(config.PATHWAY_EC_MAPPING))

    def test_long_sequence_policies_match_training_contract(self):
        sequence = "A" * 2200
        self.assertEqual([len(x) for x in _esm_windows(sequence, "truncate")], [1022])
        windows = _esm_windows(sequence, "windowed")
        self.assertEqual([len(x) for x in windows], [1022, 1022, 1022])
        self.assertEqual(windows[-1], sequence[-1022:])

    def test_hydroxylamine_is_a_direct_current_ec_mapping(self):
        result = predict_phase4(
            [{"id": "query", "seq": "A" * 40}], "hydroxylamine_reduction"
        )
        self.assertEqual(result.loc[0, "EC_Number"], "1.7.99.1")
        self.assertEqual(result.loc[0, "Confidence"], 100.0)


if __name__ == "__main__":
    unittest.main()
