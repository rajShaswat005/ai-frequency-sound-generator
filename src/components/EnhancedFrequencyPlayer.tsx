
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

      {/* Minimalist Control Panel */}
      <Card className="bg-black/20 border-purple-800/20 backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center justify-center space-x-12">
            {/* Simple Play/Pause Button */}
            <Button
              onClick={onTogglePlay}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isPlaying 
                  ? 'bg-white/10 hover:bg-white/20 border-2 border-white/20' 
                  : 'bg-purple-600/80 hover:bg-purple-600 border-2 border-purple-500'
              } text-white transition-all duration-300`}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>

            {/* Minimal Volume Control */}
            <div className="flex items-center space-x-4 w-48">
              <Volume2 className="h-5 w-5 text-white/60" />
              <Slider
                value={volume}
                onValueChange={onVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white/60 text-sm min-w-[3rem]">{volume[0]}%</span>
            </div>
          </div>

          {/* Simple Status */}
          {isPlaying && (
            <div className="text-center mt-6">
              <div className="text-green-400 text-sm font-light">
                ● Playing {frequency} Hz frequency
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
