import { Card } from "@/components/ui/card";
import { TrackInfo } from "./TrackInfo";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { AudioSettings } from "./AudioSettings";
import { ProgressBar } from "./ProgressBar";

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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-black/98 via-purple-900/95 to-black/98 backdrop-blur-2xl border-t border-purple-500/30 shadow-2xl shadow-purple-500/10">
      <Card className="bg-transparent border-none shadow-none">
        <div className="px-6 py-5">
          {/* Top row - Track info and controls */}
          <div className="flex items-center justify-between mb-5">
            {/* Track Info */}
            <TrackInfo 
              frequency={frequency}
              currentTrack={currentTrack}
              audioMode={audioMode}
              isPlaying={isPlaying}
            />

            {/* Main Controls */}
            <PlaybackControls 
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
            />

            {/* Right Controls */}
            <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
              {/* Volume Control */}
              <VolumeControl 
                volume={volume}
                onVolumeChange={onVolumeChange}
              />

              {/* Settings */}
              <AudioSettings 
                waveform={waveform}
                onWaveformChange={onWaveformChange}
                effects={effects}
                onEffectsChange={onEffectsChange}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar isPlaying={isPlaying} />
        </div>
      </Card>
    </div>
  );
};