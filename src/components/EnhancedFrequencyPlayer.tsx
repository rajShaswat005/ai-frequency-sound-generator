
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
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
    <div className="space-y-8">
      {/* Minimalist Frequency Display */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="text-6xl font-light text-white tracking-wide">
            {frequency} <span className="text-3xl text-purple-400">Hz</span>
          </div>
          {selectedMood && currentMoodData && (
            <div className="space-y-1">
              <div className="text-purple-300 text-lg font-light capitalize">{selectedMood}</div>
              <p className="text-purple-400 text-sm">{currentMoodData.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Visualizer */}
      <FrequencyVisualizer frequency={frequency} isPlaying={isPlaying} />

      {/* Themed Control Panel */}
      <Card className="bg-gradient-to-r from-black/60 to-purple-900/40 border-purple-800/40 backdrop-blur-md">
        <div className="p-6 space-y-6">
          {/* Status Indicator */}
          {isPlaying && (
            <div className="text-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Playing {frequency} Hz frequency</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-8">
            {/* Play/Pause Button - Consistent with WhiteNoisePlayer */}
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
                } text-white rounded-full p-6 shadow-2xl transform transition-all duration-300 hover:scale-110`}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>

            {/* Volume Control - Consistent styling */}
            <div className="flex items-center space-x-4 flex-1 max-w-xs">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Volume2 className="h-5 w-5 text-purple-300" />
              </div>
              <div className="flex-1 space-y-2">
                <Slider
                  value={volume}
                  onValueChange={onVolumeChange}
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
                ? 'Immerse yourself in the healing frequency designed for your emotional state.' 
                : 'Click play to begin your personalized sound therapy session.'
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
