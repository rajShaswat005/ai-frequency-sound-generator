interface ProgressBarProps {
  isPlaying: boolean;
}

export const ProgressBar = ({ isPlaying }: ProgressBarProps) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-xs text-purple-400">0:00</span>
      <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-purple-500 to-violet-500 ${isPlaying ? 'w-1/3 animate-pulse' : 'w-0'} transition-all duration-300`}></div>
      </div>
      <span className="text-xs text-purple-400">∞</span>
    </div>
  );
};