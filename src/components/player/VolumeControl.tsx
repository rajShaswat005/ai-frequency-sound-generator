import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

interface VolumeControlProps {
  volume: number[];
  onVolumeChange: (volume: number[]) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
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
  );
};