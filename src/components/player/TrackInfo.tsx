interface TrackInfoProps {
  frequency: number;
  currentTrack?: string;
  audioMode?: 'frequency' | 'whitenoise' | null;
  isPlaying: boolean;
}

export const TrackInfo = ({ frequency, currentTrack, audioMode, isPlaying }: TrackInfoProps) => {
  return (
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
  );
};