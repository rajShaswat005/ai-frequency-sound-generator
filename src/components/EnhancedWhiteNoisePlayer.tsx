import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Sun, Mountain, Flame, Shell, Flower2, Waves, Coffee, Moon, Snowflake, Leaf, TreePine, Star } from "lucide-react";

interface WhiteNoiseTrack {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'nature' | 'seasons' | 'ambience' | 'elements';
  soundGenerator: (audioContext: AudioContext, gainNode: GainNode) => AudioBufferSourceNode;
}

interface EnhancedWhiteNoisePlayerProps {
  onAudioStart: (trackName: string) => void;
  onAudioStop: () => void;
  isActive: boolean;
  volume: number[];
}

export const EnhancedWhiteNoisePlayer = ({ onAudioStart, onAudioStop, isActive, volume }: EnhancedWhiteNoisePlayerProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Generate Ocean sounds
  const generateOcean = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Mountain wind sounds
  const generateMountain = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Forest sounds
  const generateForest = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Morning sounds
  const generateMorning = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Cafe sounds
  const generateCafe = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Deep Space sounds
  const generateDeepSpace = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Sleep sounds
  const generateSleep = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Spring sounds
  const generateSpring = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Autumn sounds
  const generateAutumn = (audioContext: AudioContext, gainNode: GainNode) => {
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

  // Generate Winter sounds
  const generateWinter = (audioContext: AudioContext, gainNode: GainNode) => {
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

  const whiteNoiseTracks: WhiteNoiseTrack[] = [
    // Nature Category
    {
      id: "ocean",
      name: "Ocean Waves",
      description: "Rhythmic ocean waves with gentle foam",
      icon: Waves,
      color: "from-blue-500 to-cyan-500",
      category: 'nature',
      soundGenerator: generateOcean
    },
    {
      id: "mountain",
      name: "Mountain Wind",
      description: "High altitude winds with mountain echoes",
      icon: Mountain,
      color: "from-gray-500 to-slate-600",
      category: 'nature',
      soundGenerator: generateMountain
    },
    {
      id: "forest",
      name: "Forest",
      description: "Rich forest ambience with birds and rustling leaves",
      icon: TreePine,
      color: "from-green-600 to-emerald-700",
      category: 'nature',
      soundGenerator: generateForest
    },
    
    // Ambience Category
    {
      id: "morning",
      name: "Morning",
      description: "Peaceful dawn chorus with gentle awakening sounds",
      icon: Sun,
      color: "from-orange-400 to-yellow-500",
      category: 'ambience',
      soundGenerator: generateMorning
    },
    {
      id: "cafe",
      name: "Cafe Feel",
      description: "Cozy coffee shop with soft chatter and ambient sounds",
      icon: Coffee,
      color: "from-amber-600 to-orange-700",
      category: 'ambience',
      soundGenerator: generateCafe
    },
    
    // Elements Category
    {
      id: "deep-space",
      name: "Deep Space",
      description: "Cosmic ambience for deep meditation and focus",
      icon: Star,
      color: "from-indigo-600 to-purple-800",
      category: 'elements',
      soundGenerator: generateDeepSpace
    },
    {
      id: "sleep",
      name: "Sleep",
      description: "Ultra-calming tones designed for deep rest",
      icon: Moon,
      color: "from-slate-700 to-gray-800",
      category: 'elements',
      soundGenerator: generateSleep
    },
    
    // Seasons Category
    {
      id: "spring",
      name: "Spring",
      description: "Fresh spring sounds with new life awakening",
      icon: Flower2,
      color: "from-green-400 to-teal-500",
      category: 'seasons',
      soundGenerator: generateSpring
    },
    {
      id: "autumn",
      name: "Autumn",
      description: "Crisp autumn air with falling leaves",
      icon: Leaf,
      color: "from-orange-600 to-red-600",
      category: 'seasons',
      soundGenerator: generateAutumn
    },
    {
      id: "winter",
      name: "Winter",
      description: "Serene winter landscape with gentle snowfall",
      icon: Snowflake,
      color: "from-cyan-300 to-blue-400",
      category: 'seasons',
      soundGenerator: generateWinter
    }
  ];

  const categories = {
    nature: "Nature Sounds",
    ambience: "Ambient Spaces", 
    elements: "Cosmic Elements",
    seasons: "Seasonal Moods"
  };

  // Sync with external control
  useEffect(() => {
    if (isActive && !isPlaying && selectedTrack) {
      startAudio();
    } else if (!isActive && isPlaying) {
      stopAudio();
    }
  }, [isActive]);

  const handleTrackSelect = (trackId: string) => {
    if (isPlaying) {
      stopAudio();
    }
    setSelectedTrack(trackId);
    const track = whiteNoiseTracks.find(t => t.id === trackId);
    if (track) {
      onAudioStart(track.name);
    }
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
      onAudioStop();
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
    <div className="space-y-8">
      {/* Categories */}
      {Object.entries(categories).map(([categoryKey, categoryName]) => (
        <div key={categoryKey} className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-200 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
            <span>{categoryName}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whiteNoiseTracks
              .filter(track => track.category === categoryKey)
              .map((track) => {
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
                        <h4 className="font-semibold text-purple-200 mb-2">{track.name}</h4>
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
        </div>
      ))}

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

            {/* Status Indicator */}
            {isPlaying && (
              <div className="text-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <Waves className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">Playing Natural Ambience</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center">
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