import { useState, useEffect, useRef } from 'react';
import { useMeshStore } from '../store/useMeshStore';

export function useAudioDetection(threshold = 0.6) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [level, setLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  
  const { triggerEmergency, emergency } = useMeshStore();

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = average / 255;
        
        setLevel(normalized);
        
        if (normalized > threshold) {
           // Only trigger if not already active
           if (!useMeshStore.getState().emergency.isActive) {
             useMeshStore.getState().triggerEmergency('active_shooter', 'Lobby Level 1', 92);
           }
        }
        
        frameRef.current = requestAnimationFrame(checkAudio);
      };
      
      setIsDetecting(true);
      checkAudio();
    } catch (err) {
      console.error('Microphone access denied or error occurred', err);
    }
  };

  const stop = () => {
    setIsDetecting(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { isDetecting, start, stop, level };
}
