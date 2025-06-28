
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Waves, Settings, Zap } from "lucide-react";
import { FrequencyVisualizer } from "./FrequencyVisualizer";

interface EnhancedFrequencyPlayerProps {
  frequency: number;
  isPlaying: boolean;
  volume: number[];
  onVolumeChange: (volume: number[]) => void;
  onTogglePlay: () => void;
  selectedMood: string;
  currentMoodData: any;
}

export const EnhancedFrequencyPlayer = ({
  frequency,
  isPlaying,
  volume,
  onVolumeChange,
  onTogglePlay,
  selectedMood,
  currentMoodData
}: EnhancedFrequencyPlayerProps) => {
  return (
    <div className="space-y-6">
      {/* Frequency Display Card */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className={`absolute inset-0 bg-gradient-to-r ${currentMoodData?.color || 'from-purple-500 to-violet-500'} rounded-full blur-xl opacity-30 animate-pulse`}></div>
          <div className="relative bg-black/60 rounded-2xl p-8 border border-purple-800/40 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-4xl font-bold text-white">{frequency} Hz</div>
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Waves className="h-6 w-6 text-purple-400 animate-pulse" />
              </div>
            </div>
            
            {selectedMood && currentMoodData && (
              <div className="space-y-3">
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${currentMoodData.color} rounded-full text-white text-sm font-medium capitalize shadow-lg`}>
                  {selectedMood}
                </div>
                <p className="text-purple-300 text-sm font-medium">{currentMoodData.desc}</p>
                <div className="bg-black/40 rounded-lg p-4 mt-4">
                  <h4 className="text-purple-200 font-medium mb-2 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Sound Description:</span>
                  </h4>
                  <p className="text-purple-300 text-sm leading-relaxed">
                    {currentMoodData.soundDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Visualizer */}
      <div className="relative">
        <FrequencyVisualizer frequency={frequency} isPlaying={isPlaying} />
        {isPlaying && (
          <div className="absolute top-2 right-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Control Panel */}
      <Card className="bg-gradient-to-r from-black/60 to-purple-900/40 border-purple-800/40 backdrop-blur-md">
        <div className="p-6 space-y-6">
          {/* Current Playing Status */}
          {isPlaying && (
            <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-center space-x-3 text-green-400">
                <div className="relative">
                  <Waves className="h-5 w-5 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-medium">Now Playing: {frequency} Hz</span>
                {selectedMood && (
                  <span className="text-purple-300">• {selectedMood} frequency</span>
                )}
              </div>
              <div className="mt-2 text-xs text-green-300">
                High-quality binaural audio for enhanced therapeutic effect
              </div>
            </div>
          )}

          {/* Main Control Interface */}
          <div className="flex items-center justify-center space-x-8">
            {/* Play/Pause Button */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-lg ${
                isPlaying 
                  ? 'bg-red-500/30 animate-pulse' 
                  : 'bg-green-500/30'
              }`}></div>
              <Button
                onClick={onTogglePlay}
                size="lg"
                className={`relative ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } text-white rounded-full p-8 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-white/20`}
              >
                {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-4 flex-1 max-w-xs">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Volume2 className="h-6 w-6 text-purple-300" />
              </div>
              <div className="flex-1 space-y-3">
                <Slider
                  value={volume}
                  onValueChange={onVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <div className="flex justify-between text-xs text-purple-400">
                  <span>Silent</span>
                  <span className="font-medium bg-purple-900/50 px-2 py-1 rounded">
                    {volume[0]}% Volume
                  </span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Quality Indicator */}
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>HD Audio</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Binaural Enhancement</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Therapeutic Grade</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-purple-300 text-sm leading-relaxed">
              {isPlaying 
                ? 'Find a comfortable position, close your eyes, and let the healing frequency work its magic. Breathe deeply and allow yourself to relax.' 
                : 'Click the play button to begin your personalized sound therapy session. Use headphones for the best experience.'
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
