import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Sun, Mountain, Flame, Shell, Flower2, Waves } from "lucide-react";

interface WhiteNoiseTrack {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  soundGenerator: (audioContext: AudioContext, gainNode: GainNode) => AudioBufferSourceNode;
}

export const WhiteNoisePlayer = () => {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([60]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Generate different types of natural sounds
  const generateWarmSunrise = (audioContext: AudioContext, gainNode: GainNode) => {
    const bufferSize = audioContext.sampleRate * 10; // 10 seconds
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Gentle morning sounds with bird-like chirps
        const baseNoise = (Math.random() * 2 - 1) * 0.05;
        const birdSound = Math.sin(i * 0.001 + Math.sin(i * 0.0001) * 5) * 0.1 * (Math.random() > 0.99 ? 1 : 0);
        const windSound = Math.sin(i * 0.0005) * 0.03;
        channelData[i] = baseNoise + birdSound + windSound;
      }
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const generateIceland = (audioContext: AudioContext, gainNode: GainNode) => {
    const bufferSize = audioContext.sampleRate * 12;
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Arctic wind sounds
        const windNoise = (Math.random() * 2 - 1) * 0.15 * Math.sin(i * 0.0003);
        const lowFreqWind = Math.sin(i * 0.0001) * 0.08;
        const iceCreaking = Math.sin(i * 0.0008) * 0.02 * (Math.random() > 0.995 ? 1 : 0);
        channelData[i] = windNoise + lowFreqWind + iceCreaking;
      }
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const generateCampingFire = (audioContext: AudioContext, gainNode: GainNode) => {
    const bufferSize = audioContext.sampleRate * 8;
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Crackling fire sounds
        const baseNoise = (Math.random() * 2 - 1) * 0.1;
        const crackle = Math.random() > 0.98 ? (Math.random() * 2 - 1) * 0.5 : 0;
        const lowBurn = Math.sin(i * 0.0002) * 0.05;
        channelData[i] = baseNoise + crackle + lowBurn;
      }
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const generateSummerSeashore = (audioContext: AudioContext, gainNode: GainNode) => {
    const bufferSize = audioContext.sampleRate * 15;
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Ocean wave sounds
        const waveBase = Math.sin(i * 0.0008) * 0.12;
        const waveDetail = Math.sin(i * 0.003) * 0.05;
        const seagull = Math.sin(i * 0.002 + Math.sin(i * 0.0001) * 10) * 0.03 * (Math.random() > 0.999 ? 1 : 0);
        const foam = (Math.random() * 2 - 1) * 0.02;
        channelData[i] = waveBase + waveDetail + seagull + foam;
      }
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const generateMeditation = (audioContext: AudioContext, gainNode: GainNode) => {
    const bufferSize = audioContext.sampleRate * 20;
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Singing bowl and ambient tones
        const bowl1 = Math.sin(i * 0.0004) * 0.08 * Math.exp(-i * 0.00001);
        const bowl2 = Math.sin(i * 0.0006) * 0.06 * Math.exp(-i * 0.000008);
        const ambient = Math.sin(i * 0.0001) * 0.03;
        const softNoise = (Math.random() * 2 - 1) * 0.01;
        channelData[i] = bowl1 + bowl2 + ambient + softNoise;
      }
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const whiteNoiseTracks: WhiteNoiseTrack[] = [
    {
      id: "warm-sunrise",
      name: "Warm Sunrise",
      description: "Gentle morning birds and soft wind sounds",
      icon: Sun,
      color: "from-orange-400 to-yellow-500",
      soundGenerator: generateWarmSunrise
    },
    {
      id: "iceland",
      name: "Iceland",
      description: "Arctic winds and peaceful glacial sounds",
      icon: Mountain,
      color: "from-cyan-400 to-blue-500",
      soundGenerator: generateIceland
    },
    {
      id: "camping-fire",
      name: "Camping Fire",
      description: "Crackling fire with night forest ambience",
      icon: Flame,
      color: "from-red-500 to-orange-600",
      soundGenerator: generateCampingFire
    },
    {
      id: "summer-seashore",
      name: "Summer Seashore", 
      description: "Gentle waves and seagulls on a warm beach",
      icon: Shell,
      color: "from-blue-400 to-teal-500",
      soundGenerator: generateSummerSeashore
    },
    {
      id: "meditation",
      name: "Meditation",
      description: "Tibetan singing bowls and ambient tones",
      icon: Flower2,
      color: "from-purple-500 to-violet-600",
      soundGenerator: generateMeditation
    }
  ];

  const handleTrackSelect = (trackId: string) => {
    if (isPlaying) {
      stopAudio();
    }
    setSelectedTrack(trackId);
  };

  const startAudio = () => {
    if (!selectedTrack) return;
    
    const track = whiteNoiseTracks.find(t => t.id === selectedTrack);
    if (!track) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume[0] / 100 * 0.3;
    gainNodeRef.current = gainNode;

    const source = track.soundGenerator(audioContext, gainNode);
    source.connect(gainNode);
    source.start();
    
    sourceRef.current = source;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        console.log("Audio already stopped");
      }
      sourceRef.current = null;
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume[0] / 100 * 0.3;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const selectedTrackData = whiteNoiseTracks.find(t => t.id === selectedTrack);

  return (
    <div className="space-y-6">
      {/* Track Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {whiteNoiseTracks.map((track) => {
          const IconComponent = track.icon;
          const isSelected = selectedTrack === track.id;
          
          return (
            <Card
              key={track.id}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected 
                  ? 'bg-gradient-to-br from-purple-900/60 to-violet-900/60 border-purple-500/60 shadow-lg shadow-purple-500/25' 
                  : 'bg-black/40 border-purple-900/40 hover:bg-black/60'
              }`}
              onClick={() => handleTrackSelect(track.id)}
            >
              <div className="p-6 text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${track.color} p-1 ${isSelected ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-200 mb-2">{track.name}</h3>
                  <p className="text-purple-400 text-xs leading-relaxed">{track.description}</p>
                </div>
                
                {isSelected && (
                  <div className="text-xs text-purple-300 bg-purple-900/40 rounded-full px-3 py-1">
                    Selected
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Player Interface */}
      {selectedTrack && (
        <Card className="bg-gradient-to-r from-black/60 to-purple-900/40 border-purple-800/40 backdrop-blur-md">
          <div className="p-6 space-y-6">
            {/* Current Track Display */}
            <div className="text-center">
              <div className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${selectedTrackData?.color} rounded-full text-white shadow-lg`}>
                {selectedTrackData && <selectedTrackData.icon className="h-5 w-5" />}
                <span className="font-medium">{selectedTrackData?.name}</span>
              </div>
              <p className="text-purple-300 text-sm mt-3">{selectedTrackData?.description}</p>
            </div>

            {/* Status Indicator - Matching theme */}
            {isPlaying && (
              <div className="text-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <Waves className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">Playing Natural White Noise</span>
                </div>
              </div>
            )}

            {/* Controls - Consistent with EnhancedFrequencyPlayer */}
            <div className="flex items-center justify-center space-x-8">
              {/* Play/Pause Button - Same as frequency player */}
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-lg ${
                  isPlaying 
                    ? 'bg-red-500/30 animate-pulse' 
                    : 'bg-green-500/30'
                }`}></div>
                <Button
                  onClick={toggleAudio}
                  size="lg"
                  className={`relative ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  } text-white rounded-full p-6 shadow-2xl transform transition-all duration-300 hover:scale-110`}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </div>

              {/* Volume Control - Matching design */}
              <div className="flex items-center space-x-4 flex-1 max-w-xs">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Volume2 className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex justify-between text-xs text-purple-400">
                    <span>Quiet</span>
                    <span className="font-medium">{volume[0]}%</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-purple-300 text-sm leading-relaxed">
                {isPlaying 
                  ? 'Immerse yourself in natural sounds designed to calm your mind and reduce stress.' 
                  : 'Select a natural sound above and click play to begin your relaxation session.'
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
