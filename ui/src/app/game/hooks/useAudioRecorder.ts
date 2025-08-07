import { useState, useRef } from 'react';
import { AudioRecorderService, SpeechAnalysisService } from '@/app/game/services/audioService';
import { AudioRecorderState } from '@/app/game/types';

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isAnalyzing: false,
    audioUrl: null
  });

  const recorderRef = useRef<AudioRecorderService>(new AudioRecorderService());

  const startRecording = async () => {
    try {
      await recorderRef.current.startRecording();
      setState(prev => ({ ...prev, isRecording: true, audioUrl: null }));
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  };

  const stopRecording = async (): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isRecording: false, isAnalyzing: true }));

      const audioBlob = await recorderRef.current.stopRecording();
      const audioUrl = URL.createObjectURL(audioBlob);

      setState(prev => ({ ...prev, audioUrl }));

      const transcription = await SpeechAnalysisService.analyzeAudio(audioBlob);

      setState(prev => ({ ...prev, isAnalyzing: false }));

      return transcription;
    } catch (error) {
      setState(prev => ({ ...prev, isAnalyzing: false }));
      console.error('Failed to stop recording or analyze audio:', error);
      throw error;
    }
  };

  const resetAudio = () => {
    setState({
      isRecording: false,
      isAnalyzing: false,
      audioUrl: null
    });
  };

  return {
    state,
    startRecording,
    stopRecording,
    resetAudio
  };
}
