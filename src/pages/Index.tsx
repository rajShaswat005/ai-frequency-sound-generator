
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import { FrequencyVisualizer } from "@/components/FrequencyVisualizer";
import { MoodButtons } from "@/components/MoodButtons";

const Index = () => {
  const [moodText, setMoodText] = useState("");
  const [frequency, setFrequency] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [selectedMood, setSelectedMood] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Mood to frequency mapping
  const moodFrequencies = {
    calm: 432,
    anxious: 320,
    angry: 200,
    sad: 256,
    happy: 528,
    energetic: 640,
    peaceful: 396,
    stressed: 285
  };

  const analyzeMood = (text: string) => {
    const lowerText = text.toLowerCase();
    const moodKeywords = {
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
      anxious: ['anxious', 'worried', 'nervous', 'tense', 'stressed'],
      angry: ['angry', 'furious', 'mad', 'irritated', 'frustrated'],
      sad: ['sad', 'depressed', 'down', 'melancholy', 'blue'],
      happy: ['happy', 'joyful', 'excited', 'cheerful', 'glad'],
      energetic: ['energetic', 'pumped', 'motivated', 'active', 'dynamic'],
      peaceful: ['peaceful', 'zen', 'centered', 'balanced', 'harmonious'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted']
    };

    let bestMatch = 'calm';
    let maxMatches = 0;

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = mood;
      }
    });

    return bestMatch;
  };

  const generateFrequency = () => {
    if (!moodText.trim()) return;
    
    const detectedMood = analyzeMood(moodText);
    setSelectedMood(detectedMood);
    setFrequency(moodFrequencies[detectedMood as keyof typeof moodFrequencies] || 440);
  };

  const startAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = volume[0] / 100;

    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Mood Frequency Therapy
          </h1>
          <p className="text-purple-300">Transform your emotions into healing frequencies</p>
        </div>

        {/* Mood Input */}
        <Card className="bg-purple-950/50 border-purple-800 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-300">How are you feeling?</h2>
            <Textarea
              placeholder="Describe your current mood in your own words..."
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              className="bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-400 min-h-24"
            />
            <MoodButtons selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
            <Button 
              onClick={generateFrequency}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!moodText.trim()}
            >
              Generate Healing Frequency
            </Button>
          </div>
        </Card>

        {/* Frequency Visualization */}
        {frequency && (
          <Card className="bg-purple-950/50 border-purple-800 p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">
                  Your Frequency: {frequency} Hz
                </h3>
                {selectedMood && (
                  <p className="text-purple-400 capitalize">Detected mood: {selectedMood}</p>
                )}
              </div>
              
              <FrequencyVisualizer frequency={frequency} isPlaying={isPlaying} />
              
              {/* Audio Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={toggleAudio}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <div className="flex items-center space-x-2 flex-1 max-w-xs">
                  <Volume2 className="h-4 w-4 text-purple-400" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-purple-400 w-12">{volume[0]}%</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-purple-950/30 border-purple-800 p-4">
          <p className="text-center text-purple-300 text-sm">
            Each frequency is carefully selected to resonate with your emotional state, 
            promoting healing and balance through sound therapy.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
