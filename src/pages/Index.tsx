
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, Waves, Brain, Heart } from "lucide-react";
import { FrequencyVisualizer } from "@/components/FrequencyVisualizer";
import { MoodButtons } from "@/components/MoodButtons";

const Index = () => {
  const [moodText, setMoodText] = useState("");
  const [frequency, setFrequency] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [selectedMood, setSelectedMood] = useState("");
  const [activeTab, setActiveTab] = useState("mood-input");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Mood to frequency mapping with descriptions
  const moodFrequencies = {
    calm: { freq: 432, desc: "Harmonious & Grounding", color: "from-blue-500 to-teal-500", soundDesc: "A gentle 432Hz tone that promotes deep relaxation and inner peace" },
    anxious: { freq: 320, desc: "Soothing & Stabilizing", color: "from-orange-500 to-red-500", soundDesc: "A calming 320Hz frequency designed to reduce anxiety and restore balance" },
    angry: { freq: 200, desc: "Releasing & Transforming", color: "from-red-500 to-pink-500", soundDesc: "A grounding 200Hz tone that helps release tension and transform anger" },
    sad: { freq: 256, desc: "Healing & Uplifting", color: "from-indigo-500 to-purple-500", soundDesc: "An uplifting 256Hz frequency that supports emotional healing and renewal" },
    happy: { freq: 528, desc: "Love & Transformation", color: "from-yellow-500 to-green-500", soundDesc: "The powerful 528Hz 'Love Frequency' that amplifies joy and positive energy" },
    energetic: { freq: 640, desc: "Vitality & Motivation", color: "from-green-500 to-emerald-500", soundDesc: "An energizing 640Hz tone that boosts vitality and motivation" },
    peaceful: { freq: 396, desc: "Liberation & Freedom", color: "from-cyan-500 to-blue-500", soundDesc: "A liberating 396Hz frequency that promotes inner peace and freedom from fear" },
    stressed: { freq: 285, desc: "Restoration & Renewal", color: "from-purple-500 to-violet-500", soundDesc: "A restorative 285Hz tone that helps repair and renew your energy field" }
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
    if (!moodText.trim() && !selectedMood) return;
    
    const detectedMood = selectedMood || analyzeMood(moodText);
    setSelectedMood(detectedMood);
    setFrequency(moodFrequencies[detectedMood as keyof typeof moodFrequencies].freq || 440);
    setActiveTab("frequency");
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

  const currentMoodData = selectedMood ? moodFrequencies[selectedMood as keyof typeof moodFrequencies] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header with Logo */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/lovable-uploads/e6890236-4ef5-4905-8d29-a7fdc9974483.png" 
              alt="Aurix Logo" 
              className="w-16 h-16"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600 bg-clip-text text-transparent">
              Aurix
            </h1>
          </div>
          <p className="text-purple-300 text-lg font-light max-w-md mx-auto leading-relaxed">
            Transform your emotions into healing frequencies through the power of sound therapy
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-400 text-sm">
            <Heart className="h-4 w-4" />
            <span>Scientifically crafted for emotional wellness</span>
          </div>
        </div>

        {/* Main Tabs */}
        <Card className="bg-black/40 border-purple-900/60 backdrop-blur-md shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/60 border-purple-800/60">
              <TabsTrigger 
                value="mood-input" 
                className="data-[state=active]:bg-purple-700/80 data-[state=active]:text-white"
              >
                Mood Input
              </TabsTrigger>
              <TabsTrigger 
                value="frequency" 
                className="data-[state=active]:bg-purple-700/80 data-[state=active]:text-white"
              >
                Frequency
              </TabsTrigger>
              <TabsTrigger 
                value="information" 
                className="data-[state=active]:bg-purple-700/80 data-[state=active]:text-white"
              >
                Information
              </TabsTrigger>
            </TabsList>

            {/* Mood Input Tab */}
            <TabsContent value="mood-input" className="space-y-8 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h2 className="text-2xl font-semibold text-purple-200">Share Your Current State</h2>
              </div>
              
              <div className="space-y-8">
                {/* Mood Selection Buttons */}
                <div className="space-y-4">
                  <p className="text-purple-300 text-sm font-medium text-center">Select your current mood:</p>
                  <MoodButtons selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
                </div>
                
                {/* Large Textarea */}
                <div className="space-y-2">
                  <label htmlFor="mood-input" className="text-purple-300 text-sm font-medium">
                    Or describe how you're feeling in detail:
                  </label>
                  <div className="relative">
                    <Textarea
                      id="mood-input"
                      placeholder="Tell me about your current emotional state... The more you share, the better I can personalize your healing frequency. Describe your feelings, what's on your mind, or what kind of support you need right now."
                      value={moodText}
                      onChange={(e) => setMoodText(e.target.value)}
                      className="bg-black/40 border-purple-800/60 text-white placeholder:text-purple-400 min-h-40 text-base leading-relaxed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                      rows={8}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-purple-400">
                      {moodText.length}/1000
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={generateFrequency}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-4 px-8 text-base shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-purple-500/25"
                    disabled={!moodText.trim() && !selectedMood}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Frequency Tab */}
            <TabsContent value="frequency" className="space-y-6 p-8">
              {frequency ? (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-purple-200">Your Personalized Frequency</h2>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <div className={`absolute inset-0 bg-gradient-to-r ${currentMoodData?.color || 'from-purple-500 to-violet-500'} rounded-full blur-xl opacity-30 animate-pulse`}></div>
                      <div className="relative bg-black/60 rounded-2xl p-6 border border-purple-800/40">
                        <div className="text-4xl font-bold text-white mb-2">{frequency} Hz</div>
                        {selectedMood && currentMoodData && (
                          <div className="space-y-3">
                            <div className={`inline-block px-4 py-2 bg-gradient-to-r ${currentMoodData.color} rounded-full text-white text-sm font-medium capitalize shadow-lg`}>
                              {selectedMood}
                            </div>
                            <p className="text-purple-300 text-sm font-medium">{currentMoodData.desc}</p>
                            <div className="bg-black/40 rounded-lg p-4 mt-4">
                              <h4 className="text-purple-200 font-medium mb-2">Sound Description:</h4>
                              <p className="text-purple-300 text-sm leading-relaxed">
                                {currentMoodData.soundDesc}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <FrequencyVisualizer frequency={frequency} isPlaying={isPlaying} />
                    {isPlaying && (
                      <div className="absolute top-2 right-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-black/50 rounded-xl p-6 border border-purple-800/40">
                    {/* Current Playing Frequency Display */}
                    {isPlaying && (
                      <div className="text-center mb-4 p-3 bg-black/40 rounded-lg border border-purple-800/40">
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <Waves className="h-4 w-4 animate-pulse" />
                          <span className="font-medium">Now Playing: {frequency} Hz</span>
                          {selectedMood && (
                            <span className="text-purple-300">({selectedMood} frequency)</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center space-x-6">
                      <Button
                        onClick={toggleAudio}
                        size="lg"
                        className={`${
                          isPlaying 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        } text-white rounded-full p-6 shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-2xl`}
                      >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                      
                      <div className="flex items-center space-x-4 flex-1 max-w-xs">
                        <Volume2 className="h-5 w-5 text-purple-300" />
                        <div className="flex-1 space-y-2">
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <div className="flex justify-between text-xs text-purple-400">
                            <span>0%</span>
                            <span className="font-medium">{volume[0]}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-purple-300 text-sm">
                        {isPlaying ? 'Frequency is now playing. Find a comfortable position and let the healing begin.' : 'Click play to start your personalized sound therapy session.'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-purple-400 mb-4">
                    <Waves className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <p className="text-purple-300 text-lg">Generate a frequency first by describing your mood in the Mood Input tab.</p>
                </div>
              )}
            </TabsContent>

            {/* Information Tab */}
            <TabsContent value="information" className="space-y-6 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">i</span>
                </div>
                <h2 className="text-2xl font-semibold text-purple-200">Learn About Sound Therapy</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-black/50 border-purple-900/50 backdrop-blur-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-200 mb-2">Science-Based Frequencies</h3>
                      <p className="text-purple-300 text-sm leading-relaxed">
                        Each frequency is carefully selected based on sound therapy research to resonate with your emotional state and promote natural healing.
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-black/50 border-purple-900/50 backdrop-blur-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-violet-600/20 rounded-lg">
                      <Heart className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-200 mb-2">Personalized Therapy</h3>
                      <p className="text-purple-300 text-sm leading-relaxed">
                        Your unique emotional profile is analyzed to create a custom frequency that matches your specific needs and current state.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-black/50 border-indigo-900/50 backdrop-blur-sm p-6">
                <h3 className="font-semibold text-indigo-200 mb-4 flex items-center space-x-2">
                  <Waves className="h-5 w-5" />
                  <span>Therapy Tips</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-indigo-300">
                    <strong>Duration:</strong> Listen for 10-20 minutes for optimal effects
                  </div>
                  <div className="text-indigo-300">
                    <strong>Environment:</strong> Use headphones in a quiet, comfortable space
                  </div>
                  <div className="text-indigo-300">
                    <strong>Practice:</strong> Regular sessions amplify the healing benefits
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;
