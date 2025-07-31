import os
import torch
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration

def debug_transcription():
    """Debug transcription to see what's happening"""

    # Load model
    model_path = "outputs/whisper-finetuned"
    processor = WhisperProcessor.from_pretrained(model_path)
    model = WhisperForConditionalGeneration.from_pretrained(model_path)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    # Test with one audio file
    audio_path = "data/441/respuestas/agua bp.m4a"
    print(f"Testing audio file: {audio_path}")

    if not os.path.exists(audio_path):
        print("Audio file not found!")
        return

    # Load audio
    audio, sr = librosa.load(audio_path, sr=16000)
    print(f"Audio loaded: length={len(audio)}, sample_rate={sr}")

    # Process audio
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    inputs = inputs.to(device)
    print(f"Input features shape: {inputs.input_features.shape}")

    # Try basic generation first
    with torch.no_grad():
        print("\n=== Testing Basic Generation ===")
        generated_ids = model.generate(
            inputs.input_features,
            max_length=50,
            num_beams=1,
            do_sample=False,
        )

        print(f"Generated IDs shape: {generated_ids.shape}")
        print(f"Generated IDs: {generated_ids}")

        # Decode with special tokens to see everything
        transcription_with_tokens = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
        transcription_clean = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

        print(f"Transcription (with tokens): '{transcription_with_tokens}'")
        print(f"Transcription (clean): '{transcription_clean}'")

        # Try with language and task specified
        print("\n=== Testing with Language/Task ===")
        generated_ids2 = model.generate(
            inputs.input_features,
            max_length=50,
            num_beams=1,
            do_sample=False,
            language="es",
            task="transcribe",
            forced_decoder_ids=None,
        )

        transcription2 = processor.batch_decode(generated_ids2, skip_special_tokens=True)[0]
        print(f"Transcription 2: '{transcription2}'")

        # Test with the original base model for comparison
        print("\n=== Testing Original Whisper Model ===")
        base_model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
        base_processor = WhisperProcessor.from_pretrained("openai/whisper-small")
        base_model = base_model.to(device)

        base_inputs = base_processor(audio, sampling_rate=16000, return_tensors="pt")
        base_inputs = base_inputs.to(device)

        base_generated = base_model.generate(
            base_inputs.input_features,
            max_length=50,
            language="es",
            task="transcribe",
        )

        base_transcription = base_processor.batch_decode(base_generated, skip_special_tokens=True)[0]
        print(f"Base model transcription: '{base_transcription}'")

if __name__ == "__main__":
    debug_transcription()
