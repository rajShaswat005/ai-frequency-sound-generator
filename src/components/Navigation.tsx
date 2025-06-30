
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleHome}
        className="flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Home
      </Button>
    </div>
  );
};
