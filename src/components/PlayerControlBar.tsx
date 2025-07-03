
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Settings, Shuffle, Repeat, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PlayerControlBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number[];
  onVolumeChange: (volume: number[]) => void;
  frequency: number;
  currentTrack?: string;
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  onWaveformChange: (waveform: 'sine' | 'triangle' | 'sawtooth' | 'square') => void;
  effects: {
    reverb: number;
    lowPass: number;
    vibrato: number;
  };
  onEffectsChange: (effects: { reverb: number; lowPass: number; vibrato: number }) => void;
  audioMode?: 'frequency' | 'whitenoise' | null;
}

export const PlayerControlBar = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  frequency,
  currentTrack,
  waveform,
  onWaveformChange,
  effects,
  onEffectsChange,
  audioMode
}: PlayerControlBarProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-black/98 via-purple-900/95 to-black/98 backdrop-blur-2xl border-t border-purple-500/30 shadow-2xl shadow-purple-500/10">
      <Card className="bg-transparent border-none shadow-none">
        <div className="px-6 py-5">
          {/* Top row - Track info and controls */}
          <div className="flex items-center justify-between mb-5">
            {/* Enhanced Track Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <div className={`w-7 h-7 rounded-full animate-pulse ${isPlaying ? 'bg-white/30' : 'bg-white/20'}`}></div>
                </div>
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate text-lg">
                  {currentTrack || `${frequency} Hz Frequency`}
                </p>
                <p className="text-purple-300 text-sm truncate flex items-center space-x-2">
                  <span>{audioMode === 'whitenoise' ? 'Natural Ambience' : 'Healing Sound Therapy'}</span>
                  {isPlaying && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                </p>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-purple-800/30"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={onTogglePlay}
                size="lg"
                className={`${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } text-white rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-purple-800/30"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
              {/* Enhanced Volume Control */}
              <div className="flex items-center space-x-3 min-w-40">
                <div className="p-2 bg-purple-600/20 rounded-lg shadow-inner">
                  <Volume2 className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1 space-y-1">
                  <Slider
                    value={volume}
                    onValueChange={onVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex justify-between text-xs text-purple-400">
                    <span>0%</span>
                    <span className="font-medium bg-purple-900/40 px-2 py-0.5 rounded-full">{volume[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <Popover open={showSettings} onOpenChange={setShowSettings}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-black/95 border-purple-800/50 backdrop-blur-xl">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-purple-200">Audio Settings</h3>
                    
                    {/* Waveform Selection */}
                    <div className="space-y-2">
                      <label className="text-sm text-purple-300">Waveform</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['sine', 'triangle', 'sawtooth', 'square'] as const).map((wave) => (
                          <Button
                            key={wave}
                            variant={waveform === wave ? "default" : "outline"}
                            size="sm"
                            onClick={() => onWaveformChange(wave)}
                            className={waveform === wave ? "bg-purple-600" : "border-purple-800/50"}
                          >
                            {wave.charAt(0).toUpperCase() + wave.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Effects */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-purple-300">Reverb</label>
                        <Slider
                          value={[effects.reverb]}
                          onValueChange={(value) => onEffectsChange({ ...effects, reverb: value[0] })}
                          max={1}
                          step={0.1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-purple-300">Warmth</label>
                        <Slider
                          value={[effects.lowPass]}
                          onValueChange={(value) => onEffectsChange({ ...effects, lowPass: value[0] })}
                          max={1}
                          step={0.1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-purple-300">Vibrato</label>
                        <Slider
                          value={[effects.vibrato]}
                          onValueChange={(value) => onEffectsChange({ ...effects, vibrato: value[0] })}
                          max={1}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-purple-400">0:00</span>
            <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 w-1/3 animate-pulse"></div>
            </div>
            <span className="text-xs text-purple-400">∞</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
