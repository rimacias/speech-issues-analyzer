import torch
import os
import librosa
from datasets import load_dataset
from transformers import (
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments
)

def main():
    # 1. Path to preprocessed CSV
    data_csv = "data/cleaned_audio_data.csv"

    # Check if CSV exists
    if not os.path.exists(data_csv):
        raise FileNotFoundError(f"CSV file not found: {data_csv}")

    print(f"Loading dataset from: {data_csv}")

    # 2. Load and cast audio data
    dataset = load_dataset("csv", data_files={"train": data_csv}, delimiter=",")

    # Print first few entries to debug
    print("First 3 entries in dataset:")
    for i, entry in enumerate(dataset["train"]):
        if i < 3:
            print(f"  {i}: {entry}")
        else:
            break

    # Check if the first audio file exists
    first_file_path = dataset["train"][0]["file_path"]
    print(f"Checking if first audio file exists: {first_file_path}")
    if os.path.exists(first_file_path):
        print("✓ File exists")
    else:
        print("✗ File does not exist")
        print("Current working directory:", os.getcwd())
        return

    # 3. Load model and processor
    model_name = "openai/whisper-small"
    processor = WhisperProcessor.from_pretrained(model_name)
    model = WhisperForConditionalGeneration.from_pretrained(model_name)

    # Move model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"Using device: {device}")

    if torch.cuda.is_available():
        print(f"CUDA device: {torch.cuda.get_device_name(0)}")
        print(f"CUDA memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("CUDA not available, using CPU")

    # 4. Preprocessing function
    def prepare_batch(batch):
        try:
            # Check if audio data is loaded properly
            if batch["file_path"] is None:
                print(f"Error: Audio data is None for batch")
                return None

            # Load audio file
            audio, sr = librosa.load(batch["file_path"], sr=16000)
            if audio is None or len(audio) == 0:
                print(f"Error: Loaded audio is empty for {batch['file_path']}")
                return None

            # Extract audio features
            inputs = processor(audio, sampling_rate=16000, return_tensors="pt")

            # Process transcription as labels using the tokenizer
            # Add special tokens for Whisper format
            transcription_with_tokens = f"<|startoftranscript|><|es|><|transcribe|><|notimestamps|>{batch['transcription']}<|endoftext|>"

            labels = processor.tokenizer(
                transcription_with_tokens,
                return_tensors="pt",
                padding="max_length",
                max_length=128,  # Set a reasonable max length
                truncation=True
            ).input_ids

            return {
                "input_features": inputs.input_features.squeeze(0),
                "labels": labels.squeeze(0)
            }
        except Exception as e:
            print(f"Error in prepare_batch: {str(e)}")
            print(f"File path: {batch.get('file_path', 'Unknown')}")
            return None

    # 5. Map dataset and remove residual columns
    print("Starting dataset mapping...")
    train_dataset = dataset["train"].map(
        prepare_batch,
        remove_columns=["file_path", "pronunciation_label", "transcription"],
        batched=False
    )

    # 6. Configure training arguments
    training_args = Seq2SeqTrainingArguments(
        output_dir="outputs/whisper-finetuned",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=2,
        num_train_epochs=5,
        learning_rate=1e-5,
        fp16=torch.cuda.is_available(),
        save_steps=500,
        save_total_limit=2,
        logging_steps=100,
        logging_dir="logs",
        eval_strategy="no",  # changed from "epoch" to "no" since we don't have eval dataset
    )

    # 7. Create and start the Trainer
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        processing_class=processor,  # changed from tokenizer to processing_class
    )

    trainer.train()

    # 8. Save the fine-tuned model and processor
    model.save_pretrained(training_args.output_dir)
    processor.save_pretrained(training_args.output_dir)
    print(f"Model saved to: {training_args.output_dir}")

if __name__ == "__main__":
    main()
