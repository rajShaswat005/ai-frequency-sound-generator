
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export const AuthButton = () => {
  const { user, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span>{user?.email}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={signOut}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
};
