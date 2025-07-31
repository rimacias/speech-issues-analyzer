import os
import torch
import librosa
import pandas as pd
import numpy as np
import re
from transformers import (
    WhisperProcessor,
    WhisperForConditionalGeneration
)
try:
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
    import seaborn as sns
    import matplotlib.pyplot as plt
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("Warning: sklearn, seaborn, or matplotlib not installed. Install with: pip install scikit-learn seaborn matplotlib")

def load_fine_tuned_model(model_path):
    """Load the fine-tuned Whisper model and processor"""
    processor = WhisperProcessor.from_pretrained(model_path)
    model = WhisperForConditionalGeneration.from_pretrained(model_path)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"Model loaded on device: {device}")

    return model, processor, device

def transcribe_audio(audio_path, model, processor, device):
    """Transcribe a single audio file and extract classification"""
    try:
        # Load audio
        audio, sr = librosa.load(audio_path, sr=16000)

        # Process audio
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
        inputs = inputs.to(device)

        # Generate transcription with very simple parameters
        with torch.no_grad():
            # Always set language to Spanish and task to transcribe
            generated_ids = model.generate(
                inputs.input_features,
                max_length=50,
                do_sample=False,
                num_beams=1,
                language="es",
                task="transcribe",
            )

        # Decode the generated text
        transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

        # Print debug info
        print(f"    Raw transcription: '{transcription}'")

        # Clean up the transcription
        transcription = transcription.strip()

        # If transcription is empty, try the base model approach
        if not transcription:
            print("    Empty transcription, trying alternative approach...")
            with torch.no_grad():
                generated_ids = model.generate(
                    inputs.input_features,
                    max_length=100,
                    language="es",
                    task="transcribe",
                )
            transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
            print(f"    Alternative transcription: '{transcription}'")

        # Extract classification from the formatted output
        # Expected format: "transcription [label]"
        classification_match = re.search(r'\[([^\]]+)\]', transcription)
        if classification_match:
            predicted_label = classification_match.group(1).strip()
            # Extract just the transcription part (before the bracket)
            transcription_text = re.sub(r'\s*\[.*?\]', '', transcription).strip()
        else:
            # If no classification found, assume normal speech
            predicted_label = "normal"
            transcription_text = transcription.strip()

        return transcription_text, predicted_label

    except Exception as e:
        print(f"Error transcribing {audio_path}: {str(e)}")
        return "", "normal"

def test_model_effectiveness():
    """Test the fine-tuned model on a subset of data"""

    print("Speech Issues Analyzer - Model Testing")
    print("=" * 50)

    # Load the fine-tuned model
    model_path = "outputs/whisper-finetuned"
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        print("Please train the model first by running main.py")
        return None

    print("Loading fine-tuned model...")
    model, processor, device = load_fine_tuned_model(model_path)

    # Load test data
    data_csv = "data/cleaned_audio_data.csv"
    print("Loading test data...")

    if not os.path.exists(data_csv):
        print(f"Error: Data file not found at {data_csv}")
        return None

    df = pd.read_csv(data_csv)

    # Use a subset for testing (first 20 samples)
    test_df = df.head(20)

    print(f"Testing on {len(test_df)} audio samples...")

    results = []

    for idx, row in test_df.iterrows():
        audio_path = row['file_path']
        expected_transcription = row['transcription']
        expected_label = row['transcription']

        print(f"Testing {idx+1}/{len(test_df)}: {os.path.basename(audio_path)}")

        if not os.path.exists(audio_path):
            print(f"  Warning: Audio file not found: {audio_path}")
            predicted_transcription = ""
            predicted_label = "normal"
        else:
            predicted_transcription, predicted_label = transcribe_audio(
                audio_path, model, processor, device
            )

        # Check if classification is correct
        is_correct = predicted_label == expected_label

        print(f"  Expected: '{expected_transcription}' ({expected_label})")
        print(f"  Predicted: '{predicted_transcription}' ({predicted_label})")
        print(f"  Correct: {is_correct}")
        print()

        results.append({
            'audio_file': os.path.basename(audio_path),
            'expected_transcription': expected_transcription,
            'predicted_transcription': predicted_transcription,
            'expected_label': expected_label,
            'predicted_label': predicted_label,
            'correct': is_correct
        })

    # Calculate overall accuracy
    correct_predictions = sum(1 for r in results if r['correct'])
    total_predictions = len(results)
    accuracy = correct_predictions / total_predictions if total_predictions > 0 else 0

    print("=" * 50)
    print("MODEL EFFECTIVENESS RESULTS")
    print("=" * 50)
    print(f"Overall Accuracy: {accuracy:.2%}")
    print()

    # Create results DataFrame
    results_df = pd.DataFrame(results)

    # Save results to CSV
    results_df.to_csv('test_results.csv', index=False)
    print("Detailed results saved to: test_results.csv")

    if SKLEARN_AVAILABLE:
        # Generate classification report
        expected_labels = [r['expected_label'] for r in results]
        predicted_labels = [r['predicted_label'] for r in results]

        print("\nClassification Report:")
        print(classification_report(expected_labels, predicted_labels, zero_division=0))

        # Create confusion matrix
        try:
            cm = confusion_matrix(expected_labels, predicted_labels)
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                       xticklabels=sorted(set(expected_labels + predicted_labels)),
                       yticklabels=sorted(set(expected_labels + predicted_labels)))
            plt.title('Confusion Matrix - Speech Issues Classification')
            plt.xlabel('Predicted Label')
            plt.ylabel('True Label')
            plt.tight_layout()
            plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
            print("Confusion matrix saved to: confusion_matrix.png")
        except Exception as e:
            print(f"Error creating confusion matrix: {e}")

    return results_df

def test_single_audio(audio_path, model_path="outputs/whisper-finetuned"):
    """Test a single audio file"""
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found: {audio_path}")
        return

    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    print(f"Testing single audio file: {audio_path}")
    print("-" * 40)

    # Load model
    model, processor, device = load_fine_tuned_model(model_path)

    # Transcribe
    transcription, classification = transcribe_audio(audio_path, model, processor, device)

    print(f"Transcription: '{transcription}'")
    print(f"Classification: {classification}")

if __name__ == "__main__":
    # Test model effectiveness
    results_df = test_model_effectiveness()

    # Example of testing a single file
    # test_single_audio("data/441/respuestas/agua bp.m4a")
