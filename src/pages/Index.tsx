import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, Waves, Brain, Heart, Sun, Mountain, Flame, Shell, Flower2, Sparkles, Zap, Radio } from "lucide-react";
import { FrequencyVisualizer } from "@/components/FrequencyVisualizer";
import { MoodButtons } from "@/components/MoodButtons";
import { EnhancedWhiteNoisePlayer } from "@/components/EnhancedWhiteNoisePlayer";
import { EnhancedFrequencyPlayer } from "@/components/EnhancedFrequencyPlayer";
import { EnhancedAudioEngine } from "@/components/EnhancedAudioEngine";
import { WhiteNoiseEngine } from "@/components/WhiteNoiseEngine";
import { StreamingMusicControl } from "@/components/StreamingMusicControl";
import { PresetFrequencies } from "@/components/PresetFrequencies";
import { useAudioQueue } from "@/hooks/useAudioQueue";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const [moodText, setMoodText] = useState("");
  const [frequency, setFrequency] = useState(440);
  const [volume, setVolume] = useState([50]);
  const [selectedMood, setSelectedMood] = useState("");
  const [activeTab, setActiveTab] = useState("mood-input");
  const [waveform, setWaveform] = useState<'sine' | 'triangle' | 'sawtooth' | 'square'>('sine');
  const [effects, setEffects] = useState({
    reverb: 0.3,
    lowPass: 0.4,
    vibrato: 0.1
  });
  
  // Enhanced audio queue management
  const {
    audioQueue,
    currentlyPlayingId,
    isShuffled,
    isRepeating,
    addToQueue,
    removeFromQueue,
    playTrack,
    stopTrack,
    stopAllTracks,
    updateTrack,
    getCurrentTrack,
    shuffleQueue,
    toggleRepeat,
    playNext,
    playPrevious,
  } = useAudioQueue();
  
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
    const newFreq = moodFrequencies[detectedMood as keyof typeof moodFrequencies].freq || 440;
    setFrequency(newFreq);
    
    const trackName = `${newFreq} Hz - ${detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)} Frequency`;
    
    // Add to queue
    const trackId = addToQueue({
      name: trackName,
      type: 'frequency',
      frequency: newFreq,
      mood: detectedMood,
      volume: volume[0],
      waveform,
      effects,
    });
    
    setActiveTab("frequency");
  };

  const handlePresetSelect = (freq: number, name: string) => {
    setFrequency(freq);
    
    // Add to queue
    addToQueue({
      name,
      type: 'frequency',
      frequency: freq,
      volume: volume[0],
      waveform,
      effects,
    });
    
    setActiveTab("frequency");
  };

  const handleWhiteNoiseSelect = (trackId: string, trackName: string) => {
    // Add to queue and auto-play
    const newTrackId = addToQueue({
      name: trackName,
      type: 'whitenoise',
      volume: volume[0],
      whiteNoiseId: trackId, // Store the white noise track ID for reference
    });
    
    // Small delay to ensure track is added before playing
    setTimeout(() => playTrack(newTrackId), 50);
  };

  const handleFrequencyPlay = () => {
    if (!frequency) return;
    
    // Ensure current frequency is in queue
    const trackName = `${frequency} Hz Frequency`;
    const existingTrack = audioQueue.find(t => 
      t.type === 'frequency' && t.frequency === frequency
    );
    
    if (existingTrack) {
      playTrack(existingTrack.id);
    } else {
      const trackId = addToQueue({
        name: trackName,
        type: 'frequency',
        frequency,
        volume: volume[0],
        waveform,
        effects,
      });
      setTimeout(() => playTrack(trackId), 50);
    }
  };

  const currentMoodData = selectedMood ? moodFrequencies[selectedMood as keyof typeof moodFrequencies] : null;

  return (
    <div className="min-h-screen bg-gradient-aurora text-foreground p-4 relative overflow-hidden pb-32">
      {/* Enhanced Audio Engine - Only for frequency tracks */}
      {(() => {
        const currentTrack = getCurrentTrack();
        return currentTrack && currentTrack.type === 'frequency' && currentTrack.isPlaying ? (
          <EnhancedAudioEngine
            frequency={currentTrack.frequency!}
            isPlaying={currentTrack.isPlaying}
            volume={currentTrack.volume}
            waveform={currentTrack.waveform || 'sine'}
            effects={currentTrack.effects || effects}
          />
        ) : null;
      })()}

      {/* White Noise Engine - Only for white noise tracks */}
      {(() => {
        const currentTrack = getCurrentTrack();
        return currentTrack && currentTrack.type === 'whitenoise' && currentTrack.isPlaying ? (
          <WhiteNoiseEngine
            whiteNoiseId={currentTrack.whiteNoiseId!}
            isPlaying={currentTrack.isPlaying}
            volume={currentTrack.volume}
          />
        ) : null;
      })()}

      {/* Streaming Music Control */}
      <StreamingMusicControl
        audioQueue={audioQueue}
        currentlyPlayingId={currentlyPlayingId}
        isShuffled={isShuffled}
        isRepeating={isRepeating}
        onPlayTrack={playTrack}
        onStopTrack={stopTrack}
        onRemoveTrack={removeFromQueue}
        onUpdateTrack={updateTrack}
        onPlayNext={playNext}
        onPlayPrevious={playPrevious}
        onShuffle={shuffleQueue}
        onRepeat={toggleRepeat}
        globalVolume={volume}
        onGlobalVolumeChange={setVolume}
      />

      {/* Add AuthButton at top right corner */}
      <div className="absolute top-4 right-4 z-50">
        <AuthButton />
      </div>

      {/* Ultra-Advanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-electric-blue/15 rounded-full blur-3xl shadow-electric"></div>
        <div className="absolute bottom-20 right-10 w-128 h-128 bg-neon-purple/20 rounded-full blur-3xl shadow-neon"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyber-pink/10 rounded-full blur-3xl animate-rotate-slow shadow-cyber"></div>
        
        {/* Secondary cosmic elements */}
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-plasma-green/12 rounded-full blur-2xl animate-pulse shadow-glow" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-solar-orange/15 rounded-full blur-2xl animate-glow" style={{ animationDelay: '8s' }}></div>
        <div className="absolute top-1/3 right-10 w-56 h-56 bg-cosmic-violet/18 rounded-full blur-2xl"></div>
        
        {/* Ambient grid patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" 
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 25% 25%, hsl(var(--electric-blue)) 2px, transparent 2px),
                   radial-gradient(circle at 75% 75%, hsl(var(--neon-purple)) 1px, transparent 1px)
                 `,
                 backgroundSize: '100px 100px, 150px 150px'
               }}>
          </div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 left-1/3 w-8 h-8 border-2 border-primary/40 rotate-45 animate-rotate-slow"></div>
        <div className="absolute bottom-32 right-1/3 w-6 h-6 bg-accent/30 rounded-full animate-pulse-neon"></div>
        <div className="absolute top-2/3 left-20 w-10 h-10 border border-electric-blue/50 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header with Logo moved to top left */}
        <div className="flex items-center justify-between pt-4 mb-8">
          {/* Enhanced Logo with Advanced Effects */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-cosmic p-1 animate-glow shadow-cosmic">
                <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary animate-pulse-neon shadow-neon">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <Radio className="w-4 h-4 text-foreground animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-electric-blue animate-float shadow-electric">
                <Sparkles className="w-3 h-3 text-foreground m-0.5" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-cyber-pink animate-pulse shadow-cyber" />
              
              {/* Orbiting micro elements */}
              <div className="absolute inset-0 animate-rotate-slow">
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-neon-purple rounded-full -translate-x-1/2 -translate-y-2" />
                <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-plasma-green rounded-full -translate-x-1/2 translate-y-2" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient-cosmic animate-shimmer tracking-wider">
                Aurix
              </h1>
              <div className="text-xs text-primary/80 font-mono animate-pulse">
                ADVANCED AUDIO ENGINE
              </div>
            </div>
          </div>
          
          {/* Enhanced Hero Description */}
          <div className="text-center flex-1 mx-8">
            <p className="text-xl font-light max-w-lg mx-auto leading-relaxed text-gradient-rainbow animate-shimmer mb-4">
              Transform your emotions into healing frequencies through advanced sound therapy
            </p>
            <div className="flex items-center justify-center space-x-4 text-primary-glow text-sm">
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-primary/20">
                <Heart className="h-4 w-4 animate-pulse text-cyber-pink" />
                <span>AI-Powered Wellness</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-primary/20">
                <Zap className="h-4 w-4 animate-pulse text-electric-blue" />
                <span>Real-time Visualization</span>
              </div>
            </div>
          </div>
          
          {/* Empty space to balance the layout (AuthButton is positioned absolutely) */}
          <div className="w-12"></div>
        </div>

        {/* Advanced Main Interface */}
        <Card className="bg-black/20 border-primary/30 backdrop-blur-heavy shadow-cosmic animate-glow">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gradient-cosmic/20 border-primary/40 backdrop-blur-sm">
              <TabsTrigger 
                value="mood-input" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-foreground data-[state=active]:shadow-neon text-xs transition-all duration-300 hover:bg-primary/20"
              >
                <Brain className="w-4 h-4 mr-1" />
                Mood Input
              </TabsTrigger>
              <TabsTrigger 
                value="presets" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-foreground data-[state=active]:shadow-neon text-xs transition-all duration-300 hover:bg-primary/20"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Presets
              </TabsTrigger>
              <TabsTrigger 
                value="frequency" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-foreground data-[state=active]:shadow-neon text-xs transition-all duration-300 hover:bg-primary/20"
              >
                <Radio className="w-4 h-4 mr-1" />
                Frequency
              </TabsTrigger>
              <TabsTrigger 
                value="white-noise" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-foreground data-[state=active]:shadow-neon text-xs transition-all duration-300 hover:bg-primary/20"
              >
                <Waves className="w-4 h-4 mr-1" />
                White Noise
              </TabsTrigger>
              <TabsTrigger 
                value="information" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-foreground data-[state=active]:shadow-neon text-xs transition-all duration-300 hover:bg-primary/20"
              >
                <Heart className="w-4 h-4 mr-1" />
                Information
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Mood Input Tab */}
            <TabsContent value="mood-input" className="space-y-8 p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-neon animate-pulse-neon">
                  <Brain className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gradient-cosmic">Share Your Current State</h2>
                  <p className="text-primary-glow text-sm">Let AI transform your emotions into healing frequencies</p>
                </div>
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
                    className="bg-gradient-primary hover:bg-gradient-cosmic text-white font-bold py-4 px-12 text-lg shadow-cosmic transform transition-all duration-300 hover:scale-105 hover:shadow-neon animate-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!moodText.trim() && !selectedMood}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Frequency
                    <Zap className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* New Presets Tab */}
            <TabsContent value="presets" className="space-y-6 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-foreground font-bold text-sm">✨</span>
                </div>
                <h2 className="text-2xl font-semibold text-purple-200">Healing Frequency Presets</h2>
              </div>
              
              <PresetFrequencies onSelectFrequency={handlePresetSelect} />
            </TabsContent>

            {/* Enhanced Frequency Tab */}
            <TabsContent value="frequency" className="space-y-6 p-8">
              {frequency ? (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                      <span className="text-foreground font-bold text-sm">🎵</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-purple-200">Your Personalized Frequency</h2>
                  </div>
                  
                  {/* Advanced Frequency Visualizer */}
                  <div className="mb-8">
                    <FrequencyVisualizer 
                      frequency={frequency}
                      isPlaying={(() => {
                        const currentTrack = getCurrentTrack();
                        return currentTrack?.type === 'frequency' && currentTrack.frequency === frequency && currentTrack.isPlaying || false;
                      })()}
                      volume={volume[0] / 100}
                      waveform={waveform}
                    />
                  </div>
                  
                  <EnhancedFrequencyPlayer 
                    frequency={frequency}
                    isPlaying={(() => {
                      const currentTrack = getCurrentTrack();
                      return currentTrack?.type === 'frequency' && currentTrack.frequency === frequency && currentTrack.isPlaying || false;
                    })()}
                    volume={volume}
                    onVolumeChange={setVolume}
                    onTogglePlay={handleFrequencyPlay}
                    selectedMood={selectedMood}
                    currentMoodData={currentMoodData}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-purple-400 mb-4">
                    <Waves className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <p className="text-purple-300 text-lg">Generate a frequency first by describing your mood or selecting a preset.</p>
                </div>
              )}
            </TabsContent>

            {/* New White Noise Tab */}
            <TabsContent value="white-noise" className="space-y-6 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-foreground font-bold text-sm">🌊</span>
                </div>
                <h2 className="text-2xl font-semibold text-purple-200">Natural White Noise</h2>
              </div>
              
              <EnhancedWhiteNoisePlayer 
                onTrackSelect={handleWhiteNoiseSelect}
                selectedTrackId={(() => {
                  const currentTrack = getCurrentTrack();
                  return currentTrack?.type === 'whitenoise' ? currentTrack.whiteNoiseId : undefined;
                })()}
              />
            </TabsContent>

            {/* Information Tab */}
            <TabsContent value="information" className="space-y-6 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-foreground font-bold text-sm">i</span>
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

              {/* About Us Section */}
              <Card className="bg-black/50 border-purple-900/50 backdrop-blur-sm p-6">
                <h3 className="font-semibold text-purple-200 mb-4 flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>About Us</span>
                </h3>
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-purple-200">Shaswat Raj</h4>
                    <p className="text-purple-400">Developer</p>
                  </div>
                  <div className="text-purple-300 text-sm leading-relaxed max-w-md mx-auto">
                    <p>
                      Passionate about creating meaningful digital experiences that promote wellness and healing. 
                      Aurix represents my dedication to combining technology with therapeutic sound design for emotional well-being.
                    </p>
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
