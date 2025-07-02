
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";

interface UsernameFormProps {
  onComplete: () => void;
}

const UsernameForm = ({ onComplete }: UsernameFormProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username.trim()) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.trim())
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No rows returned means username is available
      return true;
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Check if username is available
      const isAvailable = await checkUsernameAvailability(username.trim());
      
      if (!isAvailable) {
        setError("Username is already taken. Please choose a different one.");
        setLoading(false);
        return;
      }
      
      // Update the user's profile with the username
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) {
        setError("Failed to save username. Please try again.");
        console.error("Username update error:", updateError);
        return;
      }
      
      toast({
        title: "Username saved!",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
      
      onComplete();
      
    } catch (error) {
      console.error("Username submission error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 border border-purple-800/60 rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-200 mb-2">Welcome!</h2>
          <p className="text-purple-300">Please choose a username to complete your profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-900/30 border border-red-700/50 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-300">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              className={`bg-black/40 border-purple-800/60 text-white ${
                error ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter your username"
              required
              minLength={3}
              maxLength={30}
            />
            <p className="text-purple-400 text-xs">
              Username must be 3-30 characters long and contain only letters, numbers, and underscores
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Username"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernameForm;
