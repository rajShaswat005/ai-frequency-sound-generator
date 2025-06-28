
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Sun, Mountain, Flame, Shell, Lotus, Waves } from "lucide-react";

interface WhiteNoiseTrack {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  soundUrl: string;
}

export const WhiteNoisePlayer = () => {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([60]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const whiteNoiseTracks: WhiteNoiseTrack[] = [
    {
      id: "warm-sunrise",
      name: "Warm Sunrise",
      description: "Gentle morning birds and soft wind sounds",
      icon: Sun,
      color: "from-orange-400 to-yellow-500",
      soundUrl: "/audio/warm-sunrise.mp3" // You'll need to add actual audio files
    },
    {
      id: "iceland",
      name: "Iceland",
      description: "Arctic winds and peaceful glacial sounds",
      icon: Mountain,
      color: "from-cyan-400 to-blue-500",
      soundUrl: "/audio/iceland.mp3"
    },
    {
      id: "camping-fire",
      name: "Camping Fire",
      description: "Crackling fire with night forest ambience",
      icon: Flame,
      color: "from-red-500 to-orange-600",
      soundUrl: "/audio/camping-fire.mp3"
    },
    {
      id: "summer-seashore",
      name: "Summer Seashore", 
      description: "Gentle waves and seagulls on a warm beach",
      icon: Shell,
      color: "from-blue-400 to-teal-500",
      soundUrl: "/audio/summer-seashore.mp3"
    },
    {
      id: "meditation",
      name: "Meditation",
      description: "Tibetan singing bowls and ambient tones",
      icon: Lotus,
      color: "from-purple-500 to-violet-600",
      soundUrl: "/audio/meditation.mp3"
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

    // For demo purposes, we'll create a simple audio context with different frequency patterns
    // In a real implementation, you would load actual audio files
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const noiseBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 2, audioContext.sampleRate);
    
    // Generate different noise patterns based on selected track
    for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
      const nowBuffering = noiseBuffer.getChannelData(channel);
      for (let i = 0; i < noiseBuffer.length; i++) {
        // Create different noise patterns for different tracks
        switch (selectedTrack) {
          case 'warm-sunrise':
            nowBuffering[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.001);
            break;
          case 'iceland':
            nowBuffering[i] = (Math.random() * 2 - 1) * 0.15 * Math.cos(i * 0.0005);
            break;
          case 'camping-fire':
            nowBuffering[i] = (Math.random() * 2 - 1) * 0.2 * (Math.random() > 0.95 ? 2 : 1);
            break;
          case 'summer-seashore':
            nowBuffering[i] = (Math.random() * 2 - 1) * 0.12 * Math.sin(i * 0.002);
            break;
          case 'meditation':
            nowBuffering[i] = (Math.random() * 2 - 1) * 0.08 * Math.sin(i * 0.0003);
            break;
          default:
            nowBuffering[i] = Math.random() * 2 - 1;
        }
      }
    }

    const source = audioContext.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume[0] / 100 * 0.3;
    
    source.start();
    audioRef.current = source as any;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      try {
        (audioRef.current as any).stop();
      } catch (e) {
        console.log("Audio already stopped");
      }
      audioRef.current = null;
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

            {/* Status Indicator */}
            {isPlaying && (
              <div className="text-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <Waves className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">Playing Natural White Noise</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center space-x-8">
              {/* Play/Pause Button */}
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

              {/* Volume Control */}
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
