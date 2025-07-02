
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, User as UserIcon, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Show success message for sign up
        if (event === 'SIGNED_UP') {
          toast({
            title: "Account created successfully!",
            description: "You can now use all features of the app.",
            duration: 4000,
          });
        }
        
        // Show success message for sign in
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
            duration: 3000,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }
        
        // Success - close dialog and clear form
        setIsOpen(false);
        setEmail("");
        setPassword("");
        
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setErrors({ general: 'An account with this email already exists. Please try logging in instead.' });
          } else if (error.message.includes('Password should be at least 6 characters')) {
            setErrors({ password: 'Password must be at least 6 characters long' });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }
        
        // Success - show message and optionally switch to login
        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link to complete your registration.",
          duration: 6000,
        });
        
        setIsOpen(false);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out.",
        });
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail("");
    setPassword("");
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <UserIcon className="h-4 w-4 text-purple-300" />
        <span className="text-purple-300 text-sm">{user.email}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-purple-300 hover:text-white hover:bg-purple-800/50"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-white hover:bg-purple-800/50"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-purple-800/60 text-white">
        <DialogHeader>
          <DialogTitle className="text-purple-200">
            {isLogin ? "Sign In" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {errors.general && (
            <div className="flex items-center space-x-2 p-3 bg-red-900/30 border border-red-700/50 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{errors.general}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={`bg-black/40 border-purple-800/60 text-white ${
                errors.email ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <span className="text-red-400 text-xs">{errors.email}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-purple-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              className={`bg-black/40 border-purple-800/60 text-white ${
                errors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
              required
            />
            {errors.password && (
              <span className="text-red-400 text-xs">{errors.password}</span>
            )}
            {!isLogin && !errors.password && (
              <span className="text-purple-400 text-xs">Password must be at least 6 characters long</span>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
              </div>
            ) : (
              isLogin ? "Sign In" : "Sign Up"
            )}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={switchMode}
            className="w-full text-purple-300 hover:text-white"
            disabled={loading}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;
