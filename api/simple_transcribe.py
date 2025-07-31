import os
import torch
import librosa
import pandas as pd
from transformers import (
    WhisperProcessor,
    WhisperForConditionalGeneration
)

def load_whisper_medium():
    """Load the Whisper medium model and processor"""
    print("Loading Whisper Medium model...")
    processor = WhisperProcessor.from_pretrained("openai/whisper-medium")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-medium")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"Model loaded on device: {device}")

    return model, processor, device

def transcribe_audio(audio_path, model, processor, device):
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
        return transcription.strip()

    except Exception as e:
        print(f"Error transcribing {audio_path}: {str(e)}")
        return ""

def transcribe_all_audio():
    """Transcribe all audio files from the CSV"""

    print("Simple Audio Transcription")
    print("=" * 40)

    # Load Whisper medium model
    model, processor, device = load_whisper_medium()

    # Load data
    data_csv = "data/cleaned_audio_data.csv"

    if not os.path.exists(data_csv):
        print(f"Error: Data file not found at {data_csv}")
        return

    df = pd.read_csv(data_csv)

    print(f"Transcribing {len(df)} audio files...")
    print()

    results = []

    for idx, row in df.iterrows():
        audio_path = row['file_path']
        filename = os.path.basename(audio_path)

        if not os.path.exists(audio_path):
            print(f"File not found: {filename}")
            transcription = "[FILE NOT FOUND]"
        else:
            transcription = transcribe_audio(audio_path, model, processor, device)

        print(f"{filename}: {transcription}")

        results.append({
            'filename': filename,
            'transcription': transcription
        })

    # Save results to CSV
    results_df = pd.DataFrame(results)
    results_df.to_csv('transcriptions.csv', index=False)

    print()
    print(f"Transcriptions saved to: transcriptions.csv")
    print(f"Total files processed: {len(results)}")

if __name__ == "__main__":
    transcribe_all_audio()
