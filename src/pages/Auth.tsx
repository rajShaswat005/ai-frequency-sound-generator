
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-4">
      <div className="p-4">
        <Navigation />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <AuthForm onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
};

export default Auth;
