import { useState, useCallback } from 'react';

export interface AudioTrack {
  id: string;
  name: string;
  type: 'frequency' | 'whitenoise';
  frequency?: number;
  mood?: string;
  isPlaying: boolean;
  volume: number;
  waveform?: 'sine' | 'triangle' | 'sawtooth' | 'square';
  effects?: {
    reverb: number;
    lowPass: number;
    vibrato: number;
  };
}

export const useAudioQueue = () => {
  const [audioQueue, setAudioQueue] = useState<AudioTrack[]>([]);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  const addToQueue = useCallback((track: Omit<AudioTrack, 'id' | 'isPlaying'>) => {
    const newTrack: AudioTrack = {
      ...track,
      id: `${track.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isPlaying: false,
    };

    setAudioQueue(prev => {
      // Check if a similar track already exists
      const existingIndex = prev.findIndex(t => 
        t.type === track.type && 
        (track.type === 'frequency' ? t.frequency === track.frequency : t.name === track.name)
      );

      if (existingIndex >= 0) {
        // Update existing track
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...track };
        return updated;
      } else {
        // Add new track
        return [...prev, newTrack];
      }
    });

    return newTrack.id;
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setAudioQueue(prev => prev.filter(track => track.id !== trackId));
    if (currentlyPlayingId === trackId) {
      setCurrentlyPlayingId(null);
    }
  }, [currentlyPlayingId]);

  const playTrack = useCallback((trackId: string) => {
    // Stop all other tracks
    setAudioQueue(prev => prev.map(track => ({
      ...track,
      isPlaying: track.id === trackId
    })));
    setCurrentlyPlayingId(trackId);
  }, []);

  const stopTrack = useCallback((trackId: string) => {
    setAudioQueue(prev => prev.map(track => 
      track.id === trackId ? { ...track, isPlaying: false } : track
    ));
    if (currentlyPlayingId === trackId) {
      setCurrentlyPlayingId(null);
    }
  }, [currentlyPlayingId]);

  const stopAllTracks = useCallback(() => {
    setAudioQueue(prev => prev.map(track => ({ ...track, isPlaying: false })));
    setCurrentlyPlayingId(null);
  }, []);

  const updateTrack = useCallback((trackId: string, updates: Partial<AudioTrack>) => {
    setAudioQueue(prev => prev.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  }, []);

  const clearQueue = useCallback(() => {
    setAudioQueue([]);
    setCurrentlyPlayingId(null);
  }, []);

  const getCurrentTrack = useCallback(() => {
    return audioQueue.find(track => track.id === currentlyPlayingId) || null;
  }, [audioQueue, currentlyPlayingId]);

  const getPlayingTracks = useCallback(() => {
    return audioQueue.filter(track => track.isPlaying);
  }, [audioQueue]);

  return {
    audioQueue,
    currentlyPlayingId,
    addToQueue,
    removeFromQueue,
    playTrack,
    stopTrack,
    stopAllTracks,
    updateTrack,
    clearQueue,
    getCurrentTrack,
    getPlayingTracks,
  };
};