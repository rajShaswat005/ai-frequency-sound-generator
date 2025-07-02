
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Zap, Moon, Sun, Waves } from "lucide-react";

interface PresetFrequency {
  id: string;
  name: string;
  frequency: number;
  description: string;
  benefits: string;
  icon: any;
  color: string;
  category: 'healing' | 'chakra' | 'binaural' | 'meditation';
}

interface PresetFrequenciesProps {
  onSelectFrequency: (frequency: number, name: string) => void;
}

export const PresetFrequencies = ({ onSelectFrequency }: PresetFrequenciesProps) => {
  const presetFrequencies: PresetFrequency[] = [
    // Solfeggio Frequencies
    {
      id: 'love-frequency',
      name: '528 Hz - Love Frequency',
      frequency: 528,
      description: 'DNA Repair & Transformation',
      benefits: 'Promotes love, healing, and miracles',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      category: 'healing'
    },
    {
      id: 'liberation',
      name: '396 Hz - Liberation',
      frequency: 396,
      description: 'Root Chakra Healing',
      benefits: 'Releases fear, guilt, and trauma',
      icon: Waves,
      color: 'from-red-500 to-orange-500',
      category: 'chakra'
    },
    {
      id: 'transformation',
      name: '417 Hz - Change',
      frequency: 417,
      description: 'Sacral Chakra Activation',
      benefits: 'Facilitates change and new beginnings',
      icon: Zap,
      color: 'from-orange-500 to-yellow-500',
      category: 'chakra'
    },
    {
      id: 'communication',
      name: '741 Hz - Expression',
      frequency: 741,
      description: 'Throat Chakra Opening',
      benefits: 'Enhances self-expression and communication',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      category: 'chakra'
    },
    {
      id: 'intuition',
      name: '852 Hz - Intuition',
      frequency: 852,
      description: 'Third Eye Activation',
      benefits: 'Awakens intuition and inner strength',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      category: 'chakra'
    },
    {
      id: 'unity',
      name: '963 Hz - Unity',
      frequency: 963,
      description: 'Crown Chakra Connection',
      benefits: 'Connects to universal consciousness',
      icon: Sun,
      color: 'from-violet-500 to-purple-500',
      category: 'chakra'
    },
    // Additional Healing Frequencies
    {
      id: 'anxiety-relief',
      name: '320 Hz - Anxiety Relief',
      frequency: 320,
      description: 'Calming & Grounding',
      benefits: 'Reduces anxiety and promotes stability',
      icon: Waves,
      color: 'from-teal-500 to-green-500',
      category: 'healing'
    },
    {
      id: 'deep-meditation',
      name: '256 Hz - Deep Meditation',
      frequency: 256,
      description: 'Root Tone Healing',
      benefits: 'Promotes deep meditation and healing',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      category: 'meditation'
    }
  ];

  const groupedFrequencies = presetFrequencies.reduce((acc, freq) => {
    if (!acc[freq.category]) {
      acc[freq.category] = [];
    }
    acc[freq.category].push(freq);
    return acc;
  }, {} as Record<string, PresetFrequency[]>);

  const categoryTitles = {
    healing: 'Healing Frequencies',
    chakra: 'Chakra Frequencies',
    binaural: 'Binaural Beats',
    meditation: 'Meditation Tones'
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedFrequencies).map(([category, frequencies]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-200 flex items-center space-x-2">
            <span>{categoryTitles[category as keyof typeof categoryTitles]}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frequencies.map((preset) => {
              const IconComponent = preset.icon;
              
              return (
                <Card
                  key={preset.id}
                  className="bg-black/40 border-purple-900/40 hover:bg-black/60 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => onSelectFrequency(preset.frequency, preset.name)}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${preset.color} p-1`}>
                        <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-purple-200 truncate">{preset.name}</h4>
                        <p className="text-purple-400 text-sm">{preset.description}</p>
                      </div>
                    </div>
                    
                    <p className="text-purple-300 text-xs leading-relaxed">{preset.benefits}</p>
                    
                    <Button
                      size="sm"
                      className={`w-full bg-gradient-to-r ${preset.color} hover:opacity-90 text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFrequency(preset.frequency, preset.name);
                      }}
                    >
                      Use This Frequency
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
