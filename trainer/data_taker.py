import os
import csv

# Root data folder
root_folder = 'data'
output_csv = 'cleaned_audio_data.csv'

# Prepare data list
data = []

# Walk through each subfolder in the root folder
for subfolder in os.listdir(root_folder):
    subfolder_path = f"{root_folder}/{subfolder}/respuestas"
    if os.path.isdir(subfolder_path):
        for filename in os.listdir(subfolder_path):
            if filename.endswith('.m4a'):
                # Remove extension and split by '-'
                name_wo_ext = filename[:-4]
                parts = name_wo_ext.split('-')
                if len(parts) >= 3:
                    actual_pronunciation = parts[0].strip()
                    real_word = parts[1].strip()
                    label = parts[2].strip()
                    transcription = real_word  # Use the real word as transcription

                    # Build full path with forward slashes
                    file_path = f"{root_folder}/{subfolder}/respuestas/{filename}"

                    data.append([file_path, label, transcription])

# Write to CSV
with open(f"data/{output_csv}", mode='w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['file_path', 'pronunciation_label', 'transcription'])
    writer.writerows(data)

print(f"CSV file '{output_csv}' has been created successfully.")
