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

def load_whisper_medium():
    """Load the Whisper medium model and processor"""
    print("Loading Whisper Medium model...")
    processor = WhisperProcessor.from_pretrained("openai/whisper-medium")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-medium")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"Model loaded on device: {device}")

    return model, processor, device

def transcribe_audio_with_whisper(audio_path, model, processor, device):
    """Transcribe a single audio file using Whisper medium"""
    try:
        # Load audio
        audio, sr = librosa.load(audio_path, sr=16000)

        # Process audio
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
        inputs = inputs.to(device)

        # Generate transcription
        with torch.no_grad():
            generated_ids = model.generate(
                inputs.input_features,
                max_length=128,
                num_beams=3,
                do_sample=False,
                language="es",
                task="transcribe",
            )

        # Decode the generated text
        transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        transcription = transcription.strip().lower()

        return transcription

    except Exception as e:
        print(f"Error transcribing {audio_path}: {str(e)}")
        return ""

def analyze_pronunciation_patterns(transcription, expected_transcription):
    """
    Analyze pronunciation patterns based on transcription differences
    This is a heuristic approach to detect potential speech issues
    """
    transcription = transcription.lower().strip()
    expected = expected_transcription.lower().strip()

    # Common pronunciation issue patterns for Spanish
    bp_patterns = [
        # B/P confusion patterns
        (r'\bb\b', r'\bp\b'),  # b -> p
        (r'\bp\b', r'\bb\b'),  # p -> b
        (r'ba', r'pa'), (r'pa', r'ba'),
        (r'be', r'pe'), (r'pe', r'be'),
        (r'bi', r'pi'), (r'pi', r'bi'),
        (r'bo', r'po'), (r'po', r'bo'),
        (r'bu', r'pu'), (r'pu', r'bu'),
    ]

    mp_patterns = [
        # M/P confusion patterns
        (r'\bm\b', r'\bp\b'),  # m -> p
        (r'\bp\b', r'\bm\b'),  # p -> m
        (r'ma', r'pa'), (r'pa', r'ma'),
        (r'me', r'pe'), (r'pe', r'me'),
        (r'mi', r'pi'), (r'pi', r'mi'),
        (r'mo', r'po'), (r'po', r'mo'),
        (r'mu', r'pu'), (r'pu', r'mu'),
    ]

    # Check for BP patterns
    for pattern1, pattern2 in bp_patterns:
        if (re.search(pattern1, expected) and re.search(pattern2, transcription)) or \
           (re.search(pattern2, expected) and re.search(pattern1, transcription)):
            return "bp"

    # Check for MP patterns
    for pattern1, pattern2 in mp_patterns:
        if (re.search(pattern1, expected) and re.search(pattern2, transcription)) or \
           (re.search(pattern2, expected) and re.search(pattern1, transcription)):
            return "mp"

    # If transcription is very different or empty, it might indicate speech issues
    if not transcription or len(transcription) < len(expected) * 0.5:
        return "unclear"

    # Check similarity - if very different, might indicate speech issues
    similarity = calculate_similarity(transcription, expected)
    if similarity < 0.3:
        return "unclear"

    return "normal"

def calculate_similarity(str1, str2):
    """Calculate simple similarity between two strings"""
    if not str1 or not str2:
        return 0.0

    # Simple character-based similarity
    set1 = set(str1.lower().replace(' ', ''))
    set2 = set(str2.lower().replace(' ', ''))

    if not set1 and not set2:
        return 1.0
    if not set1 or not set2:
        return 0.0

    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))

    return intersection / union if union > 0 else 0.0

def test_whisper_medium_effectiveness():
    """Test Whisper medium model on speech issues detection"""

    print("Speech Issues Analyzer - Whisper Medium Baseline Test")
    print("=" * 60)

    # Load Whisper medium model
    model, processor, device = load_whisper_medium()

    # Load test data
    data_csv = "data/cleaned_audio_data.csv"
    print("Loading test data...")

    if not os.path.exists(data_csv):
        print(f"Error: Data file not found at {data_csv}")
        return None

    df = pd.read_csv(data_csv)

    # Use all samples or limit for testing
    test_df = df.head(50)  # Test on first 50 samples

    print(f"Testing on {len(test_df)} audio samples...")
    print()

    results = []

    for idx, row in test_df.iterrows():
        audio_path = row['file_path']
        expected_transcription = row['transcription']
        expected_label = row['pronunciation_issue']

        print(f"Testing {idx+1}/{len(test_df)}: {os.path.basename(audio_path)}")

        if not os.path.exists(audio_path):
            print(f"  Warning: Audio file not found: {audio_path}")
            predicted_transcription = ""
            predicted_label = "normal"
        else:
            # Get transcription from Whisper
            predicted_transcription = transcribe_audio_with_whisper(
                audio_path, model, processor, device
            )

            # Analyze pronunciation patterns
            predicted_label = analyze_pronunciation_patterns(
                predicted_transcription, expected_transcription
            )

        # Check if classification is correct
        is_correct = predicted_label == expected_label

        # Calculate transcription accuracy
        transcription_similarity = calculate_similarity(
            predicted_transcription, expected_transcription
        )

        print(f"  Expected: '{expected_transcription}' ({expected_label})")
        print(f"  Predicted: '{predicted_transcription}' ({predicted_label})")
        print(f"  Transcription similarity: {transcription_similarity:.2f}")
        print(f"  Classification correct: {is_correct}")
        print()

        results.append({
            'audio_file': os.path.basename(audio_path),
            'expected_transcription': expected_transcription,
            'predicted_transcription': predicted_transcription,
            'expected_label': expected_label,
            'predicted_label': predicted_label,
            'transcription_similarity': transcription_similarity,
            'classification_correct': is_correct
        })

    # Calculate overall metrics
    correct_classifications = sum(1 for r in results if r['classification_correct'])
    total_predictions = len(results)
    classification_accuracy = correct_classifications / total_predictions if total_predictions > 0 else 0

    avg_transcription_similarity = np.mean([r['transcription_similarity'] for r in results])

    print("=" * 60)
    print("WHISPER MEDIUM BASELINE RESULTS")
    print("=" * 60)
    print(f"Classification Accuracy: {classification_accuracy:.2%}")
    print(f"Average Transcription Similarity: {avg_transcription_similarity:.2f}")
    print(f"Total Samples: {total_predictions}")
    print()

    # Create results DataFrame
    results_df = pd.DataFrame(results)

    # Save results to CSV
    results_df.to_csv('whisper_medium_baseline_results.csv', index=False)
    print("Detailed results saved to: whisper_medium_baseline_results.csv")

    if SKLEARN_AVAILABLE:
        # Generate classification report
        expected_labels = [r['expected_label'] for r in results]
        predicted_labels = [r['predicted_label'] for r in results]

        print("\nClassification Report:")
        print(classification_report(expected_labels, predicted_labels, zero_division=0))

        # Create confusion matrix
        try:
            cm = confusion_matrix(expected_labels, predicted_labels)
            plt.figure(figsize=(10, 8))

            unique_labels = sorted(set(expected_labels + predicted_labels))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                       xticklabels=unique_labels,
                       yticklabels=unique_labels)
            plt.title('Confusion Matrix - Whisper Medium Baseline\nSpeech Issues Classification')
            plt.xlabel('Predicted Label')
            plt.ylabel('True Label')
            plt.tight_layout()
            plt.savefig('whisper_medium_confusion_matrix.png', dpi=300, bbox_inches='tight')
            print("Confusion matrix saved to: whisper_medium_confusion_matrix.png")

            # Also create a transcription similarity histogram
            plt.figure(figsize=(10, 6))
            similarities = [r['transcription_similarity'] for r in results]
            plt.hist(similarities, bins=20, alpha=0.7, color='skyblue', edgecolor='black')
            plt.title('Distribution of Transcription Similarities\nWhisper Medium vs Expected')
            plt.xlabel('Similarity Score')
            plt.ylabel('Frequency')
            plt.grid(axis='y', alpha=0.3)
            plt.tight_layout()
            plt.savefig('transcription_similarity_distribution.png', dpi=300, bbox_inches='tight')
            print("Similarity distribution saved to: transcription_similarity_distribution.png")

        except Exception as e:
            print(f"Error creating visualizations: {e}")

    # Print some example results
    print("\nExample Results:")
    print("-" * 40)
    for i, result in enumerate(results[:5]):
        print(f"Example {i+1}:")
        print(f"  File: {result['audio_file']}")
        print(f"  Expected: '{result['expected_transcription']}' ({result['expected_label']})")
        print(f"  Predicted: '{result['predicted_transcription']}' ({result['predicted_label']})")
        print(f"  Similarity: {result['transcription_similarity']:.2f}")
        print()

    return results_df

def test_single_audio_whisper(audio_path):
    """Test a single audio file with Whisper medium"""
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found: {audio_path}")
        return

    print(f"Testing single audio file with Whisper Medium: {audio_path}")
    print("-" * 50)

    # Load model
    model, processor, device = load_whisper_medium()

    # Transcribe
    transcription = transcribe_audio_with_whisper(audio_path, model, processor, device)

    print(f"Transcription: '{transcription}'")

    # If we know the expected transcription, we can analyze patterns
    expected = input("Enter expected transcription (or press Enter to skip): ").strip()
    if expected:
        predicted_issue = analyze_pronunciation_patterns(transcription, expected)
        similarity = calculate_similarity(transcription, expected)
        print(f"Expected: '{expected}'")
        print(f"Predicted speech pattern: {predicted_issue}")
        print(f"Similarity: {similarity:.2f}")

if __name__ == "__main__":
    # Test Whisper medium effectiveness
    print("Starting Whisper Medium baseline test...")
    results_df = test_whisper_medium_effectiveness()

    # Uncomment to test a single file
    # test_single_audio_whisper("data/441/respuestas/agua bp.m4a")
