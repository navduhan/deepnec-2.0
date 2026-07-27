# Author: Naveen Duhan
"""
DeepNEC 2.0 Neural Network Inference Module
Loads compressed TFLite models to perform predictions across Phases 1–4.
"""

import os
import glob
import numpy as np
import pandas as pd

from deepNEC import config
from deepNEC.features import extract_cksaap, extract_cksaap_motif, extract_esm2_embeddings, extract_phase1_features


class TFLiteModelWrapper:
    """
    Wrapper for TFLite Interpreter inference.
    """
    def __init__(self, model_path):
        import tensorflow as tf
        # The default XNNPACK delegate segfaults on some Linux CPU/runtime
        # combinations. Use TensorFlow Lite's built-in CPU kernels for stable,
        # deterministic server inference.
        self.interpreter = tf.lite.Interpreter(
            model_path=model_path,
            num_threads=1,
            experimental_op_resolver_type=(
                tf.lite.experimental.OpResolverType.BUILTIN_WITHOUT_DEFAULT_DELEGATES
            ),
        )
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        self.expected_shape = self.input_details[0]['shape']
        self.expected_dim = int(np.prod(self.expected_shape))

    def predict(self, x):
        predictions = []
        for sample in x:
            vec = np.array(sample, dtype=np.float32)
            if vec.size != self.expected_dim:
                raise ValueError(
                    f"TFLite model expected input dimension {self.expected_dim} ({self.expected_shape}), "
                    f"but received input of size {vec.size}."
                )

            sample_input = vec.reshape(self.expected_shape)

            self.interpreter.set_tensor(self.input_details[0]['index'], sample_input)
            self.interpreter.invoke()
            output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
            predictions.append(output_data[0])

        return np.array(predictions, dtype=np.float32)


def get_model_path(phase_name):
    """
    Locates TFLite model path inside deepNEC/data/models/
    """
    base_dir = os.path.dirname(__file__)

    if phase_name in ['phase1', 'p1']:
        p1_path = os.path.join(base_dir, 'data', 'models', 'phase1', "phase1_ultimate_hybrid.tflite")
        if os.path.exists(p1_path):
            return p1_path

    if phase_name in ['phase2', 'p2']:
        p2_path = os.path.join(base_dir, 'data', 'models', 'phase2', "phase2_esm2.tflite")
        if os.path.exists(p2_path):
            return p2_path

    if phase_name in ['phase3', 'p3']:
        p3_path = os.path.join(base_dir, 'data', 'models', 'phase3', "phase3_esm2.tflite")
        if os.path.exists(p3_path):
            return p3_path

    # Phase 4 pathway sub-models
    pw_path = os.path.join(base_dir, 'data', 'models', 'phase4', f"{phase_name}_esm2.tflite")
    if os.path.exists(pw_path):
        return pw_path

    raise FileNotFoundError(f"Could not locate model file for phase/pathway '{phase_name}' in data/models.")


def load_inference_model(model_path):
    """
    Loads model using TFLite or Keras based on file extension.
    """
    if model_path.endswith('.tflite'):
        return TFLiteModelWrapper(model_path)
    else:
        import keras
        return keras.models.load_model(model_path, compile=False)


def predict_phase1(seq_records, esm2_embeddings=None):
    """
    Phase 1: Binary Enzyme vs Non-Enzyme (Using Ultimate Hybrid 4,248-dim TFLite Model with Fold 5 LoRA Adapter)
    """
    ids = [r['id'] for r in seq_records]
    seqs = [r['seq'] for r in seq_records]

    m_esm = load_inference_model(get_model_path('phase1'))

    # Phase 1 ALWAYS computes Fold 5 LoRA ESM-2 embeddings + 2,968 descriptors (4,248-dim)
    x_input = extract_phase1_features(seqs, esm2_embeddings=None)

    probs = m_esm.predict(x_input)
    preds = np.argmax(probs, axis=1)

    results = []
    passed_ids = []
    for i, seq_id in enumerate(ids):
        pred_label = config.PHASE1_CLASSES[preds[i]]
        prob_enzyme = float(probs[i][0])
        prob_non_enzyme = float(probs[i][1])

        if pred_label == "Enzyme":
            passed_ids.append(seq_id)

        results.append({
            'SampleID': seq_id,
            'Prediction': pred_label,
            'Prob_Enzyme': round(prob_enzyme * 100, 2),
            'Prob_NonEnzyme': round(prob_non_enzyme * 100, 2)
        })

    return passed_ids, pd.DataFrame(results)


def predict_phase2(seq_records, esm2_embeddings=None):
    """
    Phase 2: Binary Nitrogen vs Non-Nitrogen Metabolism (ESM-2 Standalone)
    """
    ids = [r['id'] for r in seq_records]
    seqs = [r['seq'] for r in seq_records]

    x_esm = esm2_embeddings if esm2_embeddings is not None else extract_esm2_embeddings(seqs)
    m_esm = load_inference_model(get_model_path('phase2'))
    probs = m_esm.predict(x_esm)

    preds = np.argmax(probs, axis=1)

    results = []
    passed_ids = []
    for i, seq_id in enumerate(ids):
        pred_label = config.PHASE2_CLASSES[preds[i]]
        prob_nitrogen = float(probs[i][0])
        prob_non_nitrogen = float(probs[i][1])

        if pred_label == "Nitrogen":
            passed_ids.append(seq_id)

        results.append({
            'SampleID': seq_id,
            'Prediction': pred_label,
            'Prob_Nitrogen': round(prob_nitrogen * 100, 2),
            'Prob_NonNitrogen': round(prob_non_nitrogen * 100, 2)
        })

    return passed_ids, pd.DataFrame(results)


def predict_phase3(seq_records, esm2_embeddings=None):
    """
    Phase 3: 10 Nitrogen Pathways (ESM-2 Standalone Fold 4)
    """
    ids = [r['id'] for r in seq_records]
    seqs = [r['seq'] for r in seq_records]

    x_esm = esm2_embeddings if esm2_embeddings is not None else extract_esm2_embeddings(seqs)
    m_esm = load_inference_model(get_model_path('phase3'))
    probs = m_esm.predict(x_esm)
    preds = np.argmax(probs, axis=1)

    results = []
    pathway_sequences = {pw: [] for pw in config.PHASE3_CLASSES}

    for i, seq_id in enumerate(ids):
        pred_pathway = config.PHASE3_CLASSES[preds[i]]
        prob_val = float(probs[i][preds[i]])

        pathway_sequences[pred_pathway].append(seq_records[i])

        row = {
            'SampleID': seq_id,
            'Prediction': pred_pathway,
            'Predicted_Pathway': pred_pathway,
            'Confidence': round(prob_val * 100, 2)
        }
        for class_idx, class_name in enumerate(config.PHASE3_CLASSES):
            row[class_name] = round(float(probs[i][class_idx]) * 100, 2)

        results.append(row)

    return pathway_sequences, pd.DataFrame(results)


def predict_phase4(seq_records, pathway_name, esm2_embeddings=None):
    """
    Phase 4: Specific EC Number Prediction for a Pathway
    """
    if not seq_records:
        return pd.DataFrame(columns=['SampleID', 'EC_Number', 'Confidence'])

    pw_key = pathway_name.lower()

    # Check if direct 1-to-1 mapping exists
    if pathway_name in config.DIRECT_EC_MAPPING:
        ec_num = config.DIRECT_EC_MAPPING[pathway_name]
        results = [{'SampleID': r['id'], 'EC_Number': ec_num, 'Confidence': 100.0} for r in seq_records]
        return pd.DataFrame(results)

    if pw_key not in config.PATHWAY_EC_MAPPING:
        raise ValueError(f"Unknown pathway for Phase 4 prediction: {pathway_name}")

    ec_classes = config.PATHWAY_EC_MAPPING[pw_key]
    ids = [r['id'] for r in seq_records]
    seqs = [r['seq'] for r in seq_records]

    x_esm = esm2_embeddings if esm2_embeddings is not None else extract_esm2_embeddings(seqs)
    m_esm = load_inference_model(get_model_path(pw_key))
    probs = m_esm.predict(x_esm)
    preds = np.argmax(probs, axis=1)

    results = []
    for i, seq_id in enumerate(ids):
        pred_ec = ec_classes[preds[i]]
        prob_val = float(probs[i][preds[i]])

        results.append({
            'SampleID': seq_id,
            'EC_Number': pred_ec,
            'Confidence': round(prob_val * 100, 2)
        })

    return pd.DataFrame(results)
