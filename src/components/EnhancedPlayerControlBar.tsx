import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Settings, X, Music, Waves, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioTrack } from "@/hooks/useAudioQueue";

interface EnhancedPlayerControlBarProps {
  audioQueue: AudioTrack[];
  currentlyPlayingId: string | null;
  onPlayTrack: (trackId: string) => void;
  onStopTrack: (trackId: string) => void;
  onRemoveTrack: (trackId: string) => void;
  onUpdateTrack: (trackId: string, updates: Partial<AudioTrack>) => void;
  globalVolume: number[];
  onGlobalVolumeChange: (volume: number[]) => void;
}

export const EnhancedPlayerControlBar = ({
  audioQueue,
  currentlyPlayingId,
  onPlayTrack,
  onStopTrack,
  onRemoveTrack,
  onUpdateTrack,
  globalVolume,
  onGlobalVolumeChange,
}: EnhancedPlayerControlBarProps) => {
  const [showQueue, setShowQueue] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentTrack = audioQueue.find(track => track.id === currentlyPlayingId);
  const hasPlayingTracks = audioQueue.some(track => track.isPlaying);
  const queuedTracks = audioQueue.filter(track => !track.isPlaying);

  const handleTogglePlay = () => {
    if (currentTrack) {
      if (currentTrack.isPlaying) {
        onStopTrack(currentTrack.id);
      } else {
        onPlayTrack(currentTrack.id);
      }
    } else if (audioQueue.length > 0) {
      // Play the first track in queue
      onPlayTrack(audioQueue[0].id);
    }
  };

  const handleTrackVolumeChange = (trackId: string, volume: number[]) => {
    onUpdateTrack(trackId, { volume: volume[0] });
  };

  const handleWaveformChange = (trackId: string, waveform: 'sine' | 'triangle' | 'sawtooth' | 'square') => {
    onUpdateTrack(trackId, { waveform });
  };

  const handleEffectsChange = (trackId: string, effects: { reverb: number; lowPass: number; vibrato: number }) => {
    onUpdateTrack(trackId, { effects });
  };

  if (audioQueue.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-black/98 via-purple-900/95 to-black/98 backdrop-blur-2xl border-t border-purple-500/30 shadow-2xl shadow-purple-500/10">
      <Card className="bg-transparent border-none shadow-none">
        <div className="px-6 py-5">
          {/* Main Control Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Current Track Info */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  {currentTrack?.type === 'frequency' ? (
                    <Music className="h-7 w-7 text-white" />
                  ) : (
                    <Waves className="h-7 w-7 text-white" />
                  )}
                </div>
                {hasPlayingTracks && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold truncate text-lg">
                  {currentTrack ? currentTrack.name : "Select a track to play"}
                </p>
                <p className="text-purple-300 text-sm truncate flex items-center space-x-2">
                  <span>{audioQueue.length} track{audioQueue.length !== 1 ? 's' : ''} in queue</span>
                  {hasPlayingTracks && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
                </p>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                onClick={() => {
                  const currentIndex = audioQueue.findIndex(t => t.id === currentlyPlayingId);
                  const prevTrack = audioQueue[currentIndex - 1] || audioQueue[audioQueue.length - 1];
                  if (prevTrack) onPlayTrack(prevTrack.id);
                }}
                disabled={audioQueue.length <= 1}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={handleTogglePlay}
                size="lg"
                className={`${
                  hasPlayingTracks 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } text-white rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-105`}
                disabled={audioQueue.length === 0}
              >
                {hasPlayingTracks ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                onClick={() => {
                  const currentIndex = audioQueue.findIndex(t => t.id === currentlyPlayingId);
                  const nextTrack = audioQueue[currentIndex + 1] || audioQueue[0];
                  if (nextTrack) onPlayTrack(nextTrack.id);
                }}
                disabled={audioQueue.length <= 1}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
              {/* Global Volume Control */}
              <div className="flex items-center space-x-3 min-w-40">
                <div className="p-2 bg-purple-600/20 rounded-lg shadow-inner">
                  <Volume2 className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1 space-y-1">
                  <Slider
                    value={globalVolume}
                    onValueChange={onGlobalVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex justify-between text-xs text-purple-400">
                    <span>0%</span>
                    <span className="font-medium bg-purple-900/40 px-2 py-0.5 rounded-full">{globalVolume[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Queue Button */}
              <Popover open={showQueue} onOpenChange={setShowQueue}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-white hover:bg-purple-800/30 relative"
                  >
                    <Music className="h-5 w-5" />
                    {audioQueue.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {audioQueue.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 bg-black/95 border-purple-800/50 backdrop-blur-xl">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-purple-200">Audio Queue</h3>
                    
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {audioQueue.map((track) => (
                          <div
                            key={track.id}
                            className={`p-3 rounded-lg border transition-all ${
                              track.id === currentlyPlayingId
                                ? 'bg-purple-900/60 border-purple-500/60'
                                : 'bg-black/40 border-purple-900/40 hover:bg-black/60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => track.isPlaying ? onStopTrack(track.id) : onPlayTrack(track.id)}
                                  className="p-1"
                                >
                                  {track.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <div className="min-w-0 flex-1">
                                  <p className="text-white text-sm font-medium truncate">{track.name}</p>
                                  <p className="text-purple-400 text-xs">
                                    {track.type === 'frequency' ? `${track.frequency} Hz` : 'White Noise'}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveTrack(track.id)}
                                className="p-1 text-red-400 hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Individual Track Volume */}
                            <div className="mt-2 flex items-center space-x-2">
                              <Volume2 className="h-3 w-3 text-purple-400" />
                              <Slider
                                value={[track.volume]}
                                onValueChange={(value) => handleTrackVolumeChange(track.id, value)}
                                max={100}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs text-purple-400 w-8">{track.volume}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>

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
                    
                    {currentTrack && currentTrack.type === 'frequency' && (
                      <>
                        {/* Waveform Selection */}
                        <div className="space-y-2">
                          <label className="text-sm text-purple-300">Waveform</label>
                          <div className="grid grid-cols-2 gap-2">
                            {(['sine', 'triangle', 'sawtooth', 'square'] as const).map((wave) => (
                              <Button
                                key={wave}
                                variant={currentTrack.waveform === wave ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleWaveformChange(currentTrack.id, wave)}
                                className={currentTrack.waveform === wave ? "bg-purple-600" : "border-purple-800/50"}
                              >
                                {wave.charAt(0).toUpperCase() + wave.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Effects */}
                        {currentTrack.effects && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="text-sm text-purple-300">Reverb</label>
                              <Slider
                                value={[currentTrack.effects.reverb]}
                                onValueChange={(value) => handleEffectsChange(currentTrack.id, { ...currentTrack.effects!, reverb: value[0] })}
                                max={1}
                                step={0.1}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm text-purple-300">Warmth</label>
                              <Slider
                                value={[currentTrack.effects.lowPass]}
                                onValueChange={(value) => handleEffectsChange(currentTrack.id, { ...currentTrack.effects!, lowPass: value[0] })}
                                max={1}
                                step={0.1}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm text-purple-300">Vibrato</label>
                              <Slider
                                value={[currentTrack.effects.vibrato]}
                                onValueChange={(value) => handleEffectsChange(currentTrack.id, { ...currentTrack.effects!, vibrato: value[0] })}
                                max={1}
                                step={0.1}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-purple-400">0:00</span>
            <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r from-purple-500 to-violet-500 ${hasPlayingTracks ? 'w-1/3 animate-pulse' : 'w-0'} transition-all duration-300`}></div>
            </div>
            <span className="text-xs text-purple-400">∞</span>
          </div>
        </div>
      </Card>
    </div>
  );
};