import os
import numpy as np
import librosa
import scipy.signal
from scipy.io import wavfile
import noisereduce as nr
from typing import Tuple, Optional
import warnings
warnings.filterwarnings("ignore")

class AudioPreprocessor:
    """
    Advanced audio preprocessor for enhancing speech recognition accuracy
    """

    def __init__(self,
                 target_sr: int = 16000,
                 normalize_audio: bool = True,
                 remove_silence: bool = True,
                 noise_reduction: bool = True,
                 enhance_speech: bool = True):
        """
        Initialize the audio preprocessor

        Args:
            target_sr: Target sampling rate
            normalize_audio: Whether to normalize audio volume
            remove_silence: Whether to remove silence segments
            noise_reduction: Whether to apply noise reduction
            enhance_speech: Whether to apply speech enhancement
        """
        self.target_sr = target_sr
        self.normalize_audio = normalize_audio
        self.remove_silence = remove_silence
        self.noise_reduction = noise_reduction
        self.enhance_speech = enhance_speech

    def load_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        """Load audio file with error handling"""
        try:
            # Try librosa first (handles most formats)
            audio, sr = librosa.load(file_path, sr=None)
            return audio, sr
        except Exception as e:
            try:
                # Fallback to scipy for WAV files
                sr, audio = wavfile.read(file_path)
                # Convert to float32 and normalize if integer
                if audio.dtype == np.int16:
                    audio = audio.astype(np.float32) / 32768.0
                elif audio.dtype == np.int32:
                    audio = audio.astype(np.float32) / 2147483648.0
                return audio, sr
            except Exception:
                raise ValueError(f"Could not load audio file: {file_path}")

    def resample_audio(self, audio: np.ndarray, original_sr: int) -> np.ndarray:
        """Resample audio to target sampling rate"""
        if original_sr != self.target_sr:
            audio = librosa.resample(audio, orig_sr=original_sr, target_sr=self.target_sr)
        return audio

    def normalize_volume(self, audio: np.ndarray) -> np.ndarray:
        """Normalize audio volume using RMS normalization"""
        # Calculate RMS
        rms = np.sqrt(np.mean(audio**2))

        # Avoid division by zero
        if rms == 0:
            return audio

        # Target RMS level (around -20dB)
        target_rms = 0.1

        # Normalize
        normalized_audio = audio * (target_rms / rms)

        # Prevent clipping
        max_val = np.max(np.abs(normalized_audio))
        if max_val > 0.95:
            normalized_audio = normalized_audio * (0.95 / max_val)

        return normalized_audio

    def remove_dc_offset(self, audio: np.ndarray) -> np.ndarray:
        """Remove DC offset from audio"""
        return audio - np.mean(audio)

    def apply_noise_reduction(self, audio: np.ndarray) -> np.ndarray:
        """Apply noise reduction using spectral gating"""
        try:
            # Use noisereduce library for spectral gating
            reduced_noise = nr.reduce_noise(
                y=audio,
                sr=self.target_sr,
                stationary=False,  # Non-stationary noise
                prop_decrease=0.8  # Reduce noise by 80%
            )
            return reduced_noise
        except Exception:
            # Fallback: simple high-pass filter
            return self.apply_high_pass_filter(audio, cutoff=80)

    def apply_high_pass_filter(self, audio: np.ndarray, cutoff: int = 80) -> np.ndarray:
        """Apply high-pass filter to remove low-frequency noise"""
        nyquist = self.target_sr // 2
        normalized_cutoff = cutoff / nyquist

        # Design Butterworth high-pass filter
        b, a = scipy.signal.butter(4, normalized_cutoff, btype='high')
        filtered_audio = scipy.signal.filtfilt(b, a, audio)

        return filtered_audio

    def apply_low_pass_filter(self, audio: np.ndarray, cutoff: int = 8000) -> np.ndarray:
        """Apply low-pass filter to remove high-frequency noise"""
        nyquist = self.target_sr // 2
        normalized_cutoff = cutoff / nyquist

        # Design Butterworth low-pass filter
        b, a = scipy.signal.butter(4, normalized_cutoff, btype='low')
        filtered_audio = scipy.signal.filtfilt(b, a, audio)

        return filtered_audio

    def enhance_speech_frequencies(self, audio: np.ndarray) -> np.ndarray:
        """Enhance frequencies important for speech (300-3400 Hz)"""
        # Apply mild band-pass emphasis for speech frequencies
        nyquist = self.target_sr // 2

        # Design band-pass filter for speech enhancement
        low_freq = 300 / nyquist
        high_freq = 3400 / nyquist

        b, a = scipy.signal.butter(2, [low_freq, high_freq], btype='band')
        enhanced = scipy.signal.filtfilt(b, a, audio)

        # Mix with original audio (60% enhanced, 40% original)
        enhanced_audio = 0.6 * enhanced + 0.4 * audio

        return enhanced_audio

    def remove_silence(self, audio: np.ndarray,
                      top_db: int = 20,
                      frame_length: int = 2048,
                      hop_length: int = 512) -> np.ndarray:
        """Remove silence from beginning and end of audio"""
        # Use librosa to trim silence
        trimmed_audio, _ = librosa.effects.trim(
            audio,
            top_db=top_db,
            frame_length=frame_length,
            hop_length=hop_length
        )

        # Ensure minimum length (0.1 seconds)
        min_length = int(0.1 * self.target_sr)
        if len(trimmed_audio) < min_length:
            return audio  # Return original if too short

        return trimmed_audio

    def apply_dynamic_range_compression(self, audio: np.ndarray,
                                      threshold: float = 0.3,
                                      ratio: float = 4.0) -> np.ndarray:
        """Apply dynamic range compression to even out volume levels"""
        # Simple compression algorithm
        compressed = audio.copy()

        # Find samples above threshold
        above_threshold = np.abs(audio) > threshold

        # Apply compression to samples above threshold
        sign = np.sign(audio[above_threshold])
        magnitude = np.abs(audio[above_threshold])

        # Compression formula
        compressed_magnitude = threshold + (magnitude - threshold) / ratio
        compressed[above_threshold] = sign * compressed_magnitude

        return compressed

    def apply_spectral_subtraction(self, audio: np.ndarray,
                                  noise_duration: float = 0.5) -> np.ndarray:
        """Apply spectral subtraction for noise reduction"""
        # Estimate noise from the first part of the audio
        noise_samples = int(noise_duration * self.target_sr)
        noise_samples = min(noise_samples, len(audio) // 4)

        if noise_samples < 1024:  # Not enough samples for noise estimation
            return audio

        # STFT parameters
        n_fft = 2048
        hop_length = n_fft // 4

        # Compute STFT
        stft = librosa.stft(audio, n_fft=n_fft, hop_length=hop_length)
        magnitude = np.abs(stft)
        phase = np.angle(stft)

        # Estimate noise spectrum from the beginning
        noise_stft = stft[:, :noise_samples // hop_length]
        noise_magnitude = np.mean(np.abs(noise_stft), axis=1, keepdims=True)

        # Spectral subtraction
        alpha = 2.0  # Over-subtraction factor
        enhanced_magnitude = magnitude - alpha * noise_magnitude

        # Ensure magnitude doesn't go below 10% of original
        enhanced_magnitude = np.maximum(enhanced_magnitude, 0.1 * magnitude)

        # Reconstruct signal
        enhanced_stft = enhanced_magnitude * np.exp(1j * phase)
        enhanced_audio = librosa.istft(enhanced_stft, hop_length=hop_length)

        return enhanced_audio

    def apply_wiener_filter(self, audio: np.ndarray, noise_power_ratio: float = 0.1) -> np.ndarray:
        """Apply Wiener filter for noise reduction"""
        # Simple Wiener filter implementation
        # Compute power spectral density
        f, psd = scipy.signal.welch(audio, fs=self.target_sr, nperseg=1024)

        # Estimate signal and noise power
        signal_power = np.mean(psd)
        noise_power = signal_power * noise_power_ratio

        # Wiener filter gain
        gain = signal_power / (signal_power + noise_power)
        gain = np.clip(gain, 0.1, 1.0)  # Limit gain

        # Apply filter (simplified frequency domain multiplication)
        stft = librosa.stft(audio, n_fft=2048)
        filtered_stft = stft * gain
        filtered_audio = librosa.istft(filtered_stft)

        return filtered_audio

    def preprocess_audio_advanced(self, file_path: str) -> Tuple[np.ndarray, str]:
        """
        Apply comprehensive audio preprocessing pipeline

        Returns:
            Tuple of (processed_audio, processed_file_path)
        """
        print(f"Processing: {os.path.basename(file_path)}")

        # Step 1: Load audio
        audio, original_sr = self.load_audio(file_path)
        print(f"  Loaded: {len(audio)} samples at {original_sr} Hz")

        # Step 2: Convert to mono if stereo
        if len(audio.shape) > 1:
            audio = np.mean(audio, axis=1)

        # Step 3: Remove DC offset
        audio = self.remove_dc_offset(audio)

        # Step 4: Resample to target sampling rate
        audio = self.resample_audio(audio, original_sr)
        print(f"  Resampled to: {self.target_sr} Hz")

        # Step 5: Apply noise reduction
        if self.noise_reduction:
            # Try multiple noise reduction techniques
            audio = self.apply_high_pass_filter(audio, cutoff=80)
            audio = self.apply_noise_reduction(audio)
            print("  Applied noise reduction")

        # Step 6: Remove silence
        if self.remove_silence:
            original_length = len(audio)
            audio = self.remove_silence(audio)
            print(f"  Trimmed silence: {original_length} -> {len(audio)} samples")

        # Step 7: Speech enhancement
        if self.enhance_speech:
            audio = self.enhance_speech_frequencies(audio)
            audio = self.apply_dynamic_range_compression(audio)
            print("  Applied speech enhancement")

        # Step 8: Normalize volume
        if self.normalize_audio:
            audio = self.normalize_volume(audio)
            print("  Normalized volume")

        # Step 9: Final quality checks
        audio = self.apply_low_pass_filter(audio, cutoff=7500)  # Anti-aliasing

        # Ensure no clipping
        max_val = np.max(np.abs(audio))
        if max_val > 0.98:
            audio = audio * (0.95 / max_val)

        # Create output filename
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        output_path = f"processed_{base_name}.wav"

        print(f"  Final length: {len(audio)} samples ({len(audio)/self.target_sr:.2f}s)")

        return audio, output_path

def preprocess_audio(file_path: str, save_processed: bool = False) -> str:
    """
    Main preprocessing function with enhanced audio processing

    Args:
        file_path: Path to input audio file
        save_processed: Whether to save the processed audio file

    Returns:
        Path to processed file (or original if save_processed=False)
    """

    # Initialize preprocessor with optimal settings for speech recognition
    preprocessor = AudioPreprocessor(
        target_sr=16000,        # Optimal for Whisper
        normalize_audio=True,   # Ensure consistent volume
        remove_silence=True,    # Remove dead air
        noise_reduction=True,   # Clean up background noise
        enhance_speech=True     # Boost speech frequencies
    )

    try:
        # Apply advanced preprocessing
        processed_audio, output_filename = preprocessor.preprocess_audio_advanced(file_path)

        if save_processed:
            # Save processed audio
            processed_dir = "processed_audio"
            os.makedirs(processed_dir, exist_ok=True)
            output_path = os.path.join(processed_dir, output_filename)

            # Save as WAV file
            wavfile.write(output_path, preprocessor.target_sr,
                         (processed_audio * 32767).astype(np.int16))

            print(f"Processed audio saved to: {output_path}")
            return output_path
        else:
            # Return original path (audio processing was done in memory)
            return file_path

    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        print("Returning original file path")
        return file_path

# Batch processing function
def preprocess_all_audio_files(csv_path: str = "data/cleaned_audio_data.csv",
                              save_all: bool = True):
    """
    Preprocess all audio files listed in the CSV

    Args:
        csv_path: Path to CSV file containing audio file paths
        save_all: Whether to save all processed files
    """
    import pandas as pd

    if not os.path.exists(csv_path):
        print(f"CSV file not found: {csv_path}")
        return

    df = pd.read_csv(csv_path)

    print(f"Starting batch preprocessing of {len(df)} audio files...")
    print("=" * 60)

    processed_files = []

    for idx, row in df.iterrows():
        file_path = row['file_path']

        if os.path.exists(file_path):
            processed_path = preprocess_audio(file_path, save_processed=save_all)
            processed_files.append({
                'original_path': file_path,
                'processed_path': processed_path,
                'transcription': row['transcription'],
                'pronunciation_issue': row['pronunciation_issue']
            })
        else:
            print(f"File not found: {file_path}")

        print(f"Progress: {idx+1}/{len(df)}")
        print("-" * 40)

    # Save processing results
    if processed_files:
        results_df = pd.DataFrame(processed_files)
        results_df.to_csv("processed_audio_files.csv", index=False)
        print(f"\nBatch processing complete!")
        print(f"Results saved to: processed_audio_files.csv")
        print(f"Successfully processed: {len(processed_files)} files")

if __name__ == "__main__":
    # Example usage
    print("Audio Preprocessing Module")
    print("=" * 40)

    # Test single file processing
    test_file = "data/441/respuestas/agua bp.m4a"
    if os.path.exists(test_file):
        print("Testing single file preprocessing...")
        processed_path = preprocess_audio(test_file, save_processed=True)
        print(f"Test completed: {processed_path}")

    # Uncomment to process all files
    # preprocess_all_audio_files()
