
import { Button } from "@/components/ui/button";

interface MoodButtonsProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

export const MoodButtons = ({ selectedMood, onMoodSelect }: MoodButtonsProps) => {
  const moods = [
    { label: "Calm", value: "calm" },
    { label: "Anxious", value: "anxious" },
    { label: "Angry", value: "angry" },
    { label: "Sad", value: "sad" },
    { label: "Happy", value: "happy" },
    { label: "Energetic", value: "energetic" },
    { label: "Peaceful", value: "peaceful" },
    { label: "Stressed", value: "stressed" }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {moods.map((mood) => (
        <Button
          key={mood.value}
          variant={selectedMood === mood.value ? "default" : "outline"}
          size="sm"
          onClick={() => onMoodSelect(mood.value)}
          className={
            selectedMood === mood.value
              ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
              : "bg-transparent border-purple-600 text-purple-300 hover:bg-purple-800/50 hover:text-white"
          }
        >
          {mood.label}
        </Button>
      ))}
    </div>
  );
};
