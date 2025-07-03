import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AudioSettingsProps {
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  onWaveformChange: (waveform: 'sine' | 'triangle' | 'sawtooth' | 'square') => void;
  effects: {
    reverb: number;
    lowPass: number;
    vibrato: number;
  };
  onEffectsChange: (effects: { reverb: number; lowPass: number; vibrato: number }) => void;
}

export const AudioSettings = ({ 
  waveform, 
  onWaveformChange, 
  effects, 
  onEffectsChange 
}: AudioSettingsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
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
  );
};