
import { useRef, useEffect } from "react";

interface EnhancedAudioEngineProps {
  frequency: number;
  isPlaying: boolean;
  volume: number;
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  effects: {
    reverb: number;
    lowPass: number;
    vibrato: number;
  };
}

export const EnhancedAudioEngine = ({
  frequency,
  isPlaying,
  volume,
  waveform,
  effects
}: EnhancedAudioEngineProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const vibratoOscRef = useRef<OscillatorNode | null>(null);
  const vibratoGainRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);

  // Create impulse response for reverb
  const createImpulseResponse = (duration: number, decay: number) => {
    if (!audioContextRef.current) return null;
    
    const sampleRate = audioContextRef.current.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioContextRef.current.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      }
    }
    
    return impulse;
  };

  const startAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        console.log("Previous oscillator already stopped");
      }
    }

    const audioContext = audioContextRef.current;
    
    // Create main oscillator with enhanced waveform
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = waveform;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume / 100 * 0.4; // Reduced max volume for better experience
    
    // Create low-pass filter for warmth
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 2000 - (effects.lowPass * 1500); // More filtering = warmer sound
    filterNode.Q.value = 1;
    
    // Create vibrato effect
    const vibratoOsc = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibratoOsc.frequency.value = 5; // 5Hz vibrato
    vibratoGain.gain.value = effects.vibrato * 10; // Vibrato depth
    
    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    
    // Create reverb
    const convolver = audioContext.createConvolver();
    const impulseResponse = createImpulseResponse(2, 2);
    if (impulseResponse) {
      convolver.buffer = impulseResponse;
    }
    
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = effects.reverb * 0.3;
    
    const dryGain = audioContext.createGain();
    dryGain.gain.value = 1 - (effects.reverb * 0.3);
    
    // Connect the audio graph
    oscillator.connect(filterNode);
    
    // Dry signal path
    filterNode.connect(dryGain);
    dryGain.connect(gainNode);
    
    // Wet signal path (reverb)
    filterNode.connect(convolver);
    convolver.connect(reverbGain);
    reverbGain.connect(gainNode);
    
    gainNode.connect(audioContext.destination);
    
    // Start oscillators
    oscillator.start();
    vibratoOsc.start();
    
    // Store references
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    filterNodeRef.current = filterNode;
    vibratoOscRef.current = vibratoOsc;
    vibratoGainRef.current = vibratoGain;
    convolverRef.current = convolver;
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        console.log("Oscillator already stopped");
      }
      oscillatorRef.current = null;
    }
    
    if (vibratoOscRef.current) {
      try {
        vibratoOscRef.current.stop();
      } catch (e) {
        console.log("Vibrato oscillator already stopped");
      }
      vibratoOscRef.current = null;
    }
  };

  // Update audio parameters in real-time
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume / 100 * 0.4, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [volume]);

  useEffect(() => {
    if (filterNodeRef.current) {
      filterNodeRef.current.frequency.setTargetAtTime(
        2000 - (effects.lowPass * 1500), 
        audioContextRef.current?.currentTime || 0, 
        0.1
      );
    }
  }, [effects.lowPass]);

  useEffect(() => {
    if (vibratoGainRef.current) {
      vibratoGainRef.current.gain.setTargetAtTime(
        effects.vibrato * 10, 
        audioContextRef.current?.currentTime || 0, 
        0.1
      );
    }
  }, [effects.vibrato]);

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    
    return () => {
      stopAudio();
    };
  }, [frequency, isPlaying, waveform]);

  return null;
};
