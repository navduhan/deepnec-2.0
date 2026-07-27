# Author: Naveen Duhan
"""Regression tests for stable TensorFlow Lite CPU inference."""

import unittest

import numpy as np

from deepNEC.nn_prediction import TFLiteModelWrapper, get_model_path


class TFLiteInferenceTests(unittest.TestCase):
    def test_phase2_model_runs_with_builtin_cpu_kernels(self):
        model = TFLiteModelWrapper(get_model_path("phase2"))
        features = np.zeros((1, model.expected_dim), dtype=np.float32)

        predictions = model.predict(features)

        self.assertEqual(predictions.shape[0], 1)
        self.assertTrue(np.isfinite(predictions).all())


if __name__ == "__main__":
    unittest.main()
