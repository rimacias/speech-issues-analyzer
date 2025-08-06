import os
from pydub import AudioSegment

# Root directory to search for m4a files
ROOT_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Recursively find all .m4a files
m4a_files = []
for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.lower().endswith('.m4a'):
            m4a_files.append(os.path.join(root, file))

print(f"Found {len(m4a_files)} .m4a files.")

for m4a_path in m4a_files:
    wav_path = os.path.splitext(m4a_path)[0] + '.wav'
    try:
        audio = AudioSegment.from_file(m4a_path, format='m4a')
        audio = audio.set_frame_rate(16000).set_channels(1)  # 16kHz mono for Whisper
        audio.export(wav_path, format='wav')
        print(f"Converted: {m4a_path} -> {wav_path}")
    except Exception as e:
        print(f"Failed to convert {m4a_path}: {e}")

print("Conversion complete.")

