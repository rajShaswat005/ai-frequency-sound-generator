import { useEffect, useRef } from 'react';

interface WhiteNoiseEngineProps {
  whiteNoiseId: string;
  isPlaying: boolean;
  volume: number;
}

// White noise generators
const generateOcean = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 20;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const largeWaves = Math.sin(i * 0.0003) * 0.15;
      const mediumWaves = Math.sin(i * 0.0012) * 0.08;
      const smallWaves = Math.sin(i * 0.005) * 0.04;
      const foam = (Math.random() * 2 - 1) * 0.02;
      channelData[i] = largeWaves + mediumWaves + smallWaves + foam;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateMountain = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 18;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const windBase = Math.sin(i * 0.0002) * 0.12;
      const gusts = Math.sin(i * 0.001) * 0.06 * (Math.sin(i * 0.00005) + 1) / 2;
      const echo = Math.sin(i * 0.0008) * 0.03 * (Math.random() > 0.98 ? 1 : 0);
      channelData[i] = windBase + gusts + echo;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateForest = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 25;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const leaves = (Math.random() * 2 - 1) * 0.03;
      const bird1 = Math.sin(i * 0.002 + Math.sin(i * 0.0001) * 8) * 0.05 * (Math.random() > 0.995 ? 1 : 0);
      const bird2 = Math.sin(i * 0.0035 + Math.sin(i * 0.00008) * 12) * 0.04 * (Math.random() > 0.997 ? 1 : 0);
      const wind = Math.sin(i * 0.0003) * 0.04;
      channelData[i] = leaves + bird1 + bird2 + wind;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateMorning = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 15;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const gentleWind = Math.sin(i * 0.0002) * 0.02;
      const dawnChorus = Math.sin(i * 0.003 + Math.sin(i * 0.00015) * 6) * 0.08 * (Math.random() > 0.99 ? 1 : 0);
      const rustling = (Math.random() * 2 - 1) * 0.01;
      const distant = Math.sin(i * 0.0001) * 0.02;
      channelData[i] = gentleWind + dawnChorus + rustling + distant;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateCafe = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 12;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const ambientChatter = (Math.random() * 2 - 1) * 0.04 * Math.sin(i * 0.00001);
      const coffeeMachine = Math.sin(i * 0.01) * 0.02 * (Math.random() > 0.995 ? 1 : 0);
      const clinks = Math.sin(i * 0.02) * 0.03 * (Math.random() > 0.998 ? 1 : 0);
      const footsteps = (Math.random() * 2 - 1) * 0.01 * (Math.random() > 0.99 ? 1 : 0);
      channelData[i] = ambientChatter + coffeeMachine + clinks + footsteps;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateDeepSpace = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 30;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const cosmic = Math.sin(i * 0.00005) * 0.06;
      const drone = Math.sin(i * 0.0001) * 0.04;
      const whisper = (Math.random() * 2 - 1) * 0.008;
      const pulse = Math.sin(i * 0.00002) * 0.03;
      channelData[i] = cosmic + drone + whisper + pulse;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateSleep = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 40;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const deepTone = Math.sin(i * 0.00008) * 0.05;
      const breath = Math.sin(i * 0.0003) * 0.02;
      const soft = (Math.random() * 2 - 1) * 0.005;
      channelData[i] = deepTone + breath + soft;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateSpring = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 22;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const lightWind = Math.sin(i * 0.0004) * 0.03;
      const newLeaves = (Math.random() * 2 - 1) * 0.02;
      const waterDrops = Math.sin(i * 0.01) * 0.04 * (Math.random() > 0.996 ? 1 : 0);
      const youngBirds = Math.sin(i * 0.004 + Math.sin(i * 0.0002) * 5) * 0.06 * (Math.random() > 0.994 ? 1 : 0);
      channelData[i] = lightWind + newLeaves + waterDrops + youngBirds;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateAutumn = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 18;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const crisp = Math.sin(i * 0.0005) * 0.04;
      const fallingLeaves = (Math.random() * 2 - 1) * 0.03 * (Math.random() > 0.98 ? 1 : 0);
      const distantCall = Math.sin(i * 0.0008) * 0.03 * (Math.random() > 0.997 ? 1 : 0);
      const coolWind = Math.sin(i * 0.0003) * 0.05;
      channelData[i] = crisp + fallingLeaves + distantCall + coolWind;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const generateWinter = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 25;
  const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      const coldWind = Math.sin(i * 0.0002) * 0.08;
      const snowfall = (Math.random() * 2 - 1) * 0.01;
      const silence = Math.sin(i * 0.00005) * 0.02;
      const bare = Math.sin(i * 0.0001) * 0.03;
      channelData[i] = coldWind + snowfall + silence + bare;
    }
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const soundGenerators: Record<string, (audioContext: AudioContext) => AudioBufferSourceNode> = {
  ocean: generateOcean,
  mountain: generateMountain,
  forest: generateForest,
  morning: generateMorning,
  cafe: generateCafe,
  'deep-space': generateDeepSpace,
  sleep: generateSleep,
  spring: generateSpring,
  autumn: generateAutumn,
  winter: generateWinter
};

export const WhiteNoiseEngine = ({ whiteNoiseId, isPlaying, volume }: WhiteNoiseEngineProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (isPlaying && whiteNoiseId) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [isPlaying, whiteNoiseId]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100 * 0.3;
    }
  }, [volume]);

  const startAudio = () => {
    if (!whiteNoiseId || !soundGenerators[whiteNoiseId]) return;

    // Stop any existing audio
    stopAudio();

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    
    // Create gain node
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume / 100 * 0.3;
    gainNodeRef.current = gainNode;

    // Create and start source
    const source = soundGenerators[whiteNoiseId](audioContext);
    source.connect(gainNode);
    source.start();
    sourceRef.current = source;
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        console.log("Audio already stopped");
      }
      sourceRef.current = null;
    }
  };

  return null; // This component doesn't render anything
};