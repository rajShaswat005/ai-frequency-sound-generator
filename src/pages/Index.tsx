
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthButton } from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import EnhancedFrequencyPlayer from "@/components/EnhancedFrequencyPlayer";
import WhiteNoisePlayer from "@/components/WhiteNoisePlayer";
import FrequencyVisualizer from "@/components/FrequencyVisualizer";
import MoodButtons from "@/components/MoodButtons";
import { LogIn } from "lucide-react";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState(528);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            {isAuthenticated ? (
              <AuthButton />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Frequency Healing App
          </h1>
          <p className="text-gray-600">
            Experience the power of healing frequencies and binaural beats
          </p>
        </header>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <EnhancedFrequencyPlayer 
                frequency={frequency} 
                onFrequencyChange={setFrequency} 
              />
              <WhiteNoisePlayer />
            </div>
            
            <div className="space-y-6">
              <FrequencyVisualizer frequency={frequency} />
              <MoodButtons onMoodSelect={setFrequency} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
