export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error("Could not access microphone:", error);
      throw new Error("No se pudo acceder al micrófono");
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No hay grabación activa"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        // Stop all tracks to release microphone
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

export class SpeechAnalysisService {
  private static readonly API_URL = "http://localhost:8000/analyze";

  static async analyzeAudio(audioBlob: Blob): Promise<string> {
    try {
      const audioFile = new File([audioBlob], "answer.wav", { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioFile);

      const response = await fetch(this.API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis?.transcript?.toLowerCase() || "";
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw new Error("Error al procesar el audio");
    }
  }
}
