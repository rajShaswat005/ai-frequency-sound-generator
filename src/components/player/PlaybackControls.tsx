import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const PlaybackControls = ({ isPlaying, onTogglePlay }: PlaybackControlsProps) => {
  return (
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
  );
};