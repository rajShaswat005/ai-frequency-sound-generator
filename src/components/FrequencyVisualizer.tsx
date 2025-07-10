
import { useEffect, useRef } from "react";
import { ParticleField } from "./visualizations/ParticleField";
import { SpectrumAnalyzer } from "./visualizations/SpectrumAnalyzer";
import { WaveformDisplay } from "./visualizations/WaveformDisplay";
import { OrbitingElements } from "./visualizations/OrbitingElements";

interface FrequencyVisualizerProps {
  frequency: number;
  isPlaying: boolean;
  volume?: number;
  waveform?: 'sine' | 'triangle' | 'sawtooth' | 'square';
}

export const FrequencyVisualizer = ({ 
  frequency, 
  isPlaying, 
  volume = 0.5,
  waveform = 'sine'
}: FrequencyVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Enhanced gradient with more colors
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgba(147, 51, 234, 0.2)");
      gradient.addColorStop(0.2, "rgba(168, 85, 247, 0.6)");
      gradient.addColorStop(0.5, "rgba(196, 181, 253, 0.9)");
      gradient.addColorStop(0.8, "rgba(168, 85, 247, 0.6)");
      gradient.addColorStop(1, "rgba(147, 51, 234, 0.2)");
      
      // Main wave
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const amplitude = isPlaying ? Math.max(30, frequency / 15) : Math.max(15, frequency / 30);
      const wavelength = Math.max(40, 600 / (frequency / 100));
      const time = isPlaying ? Date.now() * 0.008 : 0;
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x / wavelength) * 2 * Math.PI + time) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Secondary wave for depth
      if (isPlaying) {
        ctx.strokeStyle = "rgba(196, 181, 253, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin((x / wavelength) * 2 * Math.PI + time * 1.5) * (amplitude * 0.6);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      // Enhanced frequency bars with better animation
      const barCount = 25;
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const baseHeight = frequency / 20 + 10;
        const dynamicHeight = isPlaying ? 
          Math.sin(time * 0.01 + i * 0.3) * (frequency / 25) + baseHeight :
          baseHeight * 0.5;
        const barHeight = Math.abs(dynamicHeight);
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;
        
        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        barGradient.addColorStop(0, `rgba(147, 51, 234, ${isPlaying ? 0.8 : 0.4})`);
        barGradient.addColorStop(0.5, `rgba(168, 85, 247, ${isPlaying ? 0.9 : 0.5})`);
        barGradient.addColorStop(1, `rgba(196, 181, 253, ${isPlaying ? 0.7 : 0.3})`);
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        
        // Add glow effect when playing
        if (isPlaying) {
          ctx.shadowColor = 'rgba(147, 51, 234, 0.5)';
          ctx.shadowBlur = 10;
          ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
          ctx.shadowBlur = 0;
        }
      }
      
      // Add particle effect when playing - FIX: Ensure size is always positive
      if (isPlaying) {
        for (let i = 0; i < 8; i++) {
          const particleX = (time * 50 + i * 100) % width;
          const particleY = height / 2 + Math.sin(time * 0.02 + i) * 40;
          const baseSize = Math.sin(time * 0.03 + i) * 3 + 2;
          const size = Math.max(0.5, Math.abs(baseSize)); // Ensure size is always positive
          
          ctx.fillStyle = `rgba(196, 181, 253, ${0.6 + Math.sin(time * 0.05 + i) * 0.4})`;
          ctx.beginPath();
          ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, isPlaying]);

  return (
    <div className="space-y-6">
      {/* Advanced Multi-Panel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Spectrum Analyzer */}
        <div className="relative">
          <SpectrumAnalyzer 
            frequency={frequency}
            isPlaying={isPlaying}
            volume={volume}
            className="h-48"
          />
          <ParticleField 
            isActive={isPlaying}
            frequency={frequency}
            intensity={volume}
            className="opacity-60"
          />
        </div>
        
        {/* Waveform Display */}
        <WaveformDisplay 
          frequency={frequency}
          isPlaying={isPlaying}
          volume={volume}
          waveform={waveform}
          className="h-48"
        />
      </div>

      {/* Enhanced Original Visualizer with Orbiting Elements */}
      <div className="relative overflow-hidden rounded-xl border border-primary/30 backdrop-blur-glass">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-50 bg-gradient-to-r from-black/60 via-primary-dark/20 to-black/60"
        />
        
        {/* Overlaid Orbiting Elements */}
        <div className="absolute inset-0">
          <OrbitingElements 
            isActive={isPlaying}
            frequency={frequency}
          />
        </div>
        
        {/* Enhanced Central Display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-32 h-32 rounded-full border-2 backdrop-blur-heavy transition-all duration-500 ${
            isPlaying 
              ? 'border-primary shadow-cosmic animate-pulse-neon bg-gradient-primary/20' 
              : 'border-white/30 bg-black/40'
          }`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <span className={`font-mono text-2xl font-bold transition-all duration-300 ${
                  isPlaying ? 'text-gradient-cosmic' : 'text-white/80'
                }`}>
                  {frequency}
                </span>
                <div className={`text-sm transition-colors duration-300 ${
                  isPlaying ? 'text-primary-glow' : 'text-white/60'
                }`}>
                  Hz
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Corner Elements */}
        <div className="absolute top-3 left-3 w-4 h-4 bg-electric-blue rounded-full shadow-electric animate-float" />
        <div className="absolute top-3 right-3 w-4 h-4 bg-neon-purple rounded-full shadow-neon animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-3 left-3 w-4 h-4 bg-cyber-pink rounded-full shadow-cyber animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-3 right-3 w-4 h-4 bg-plasma-green rounded-full animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Status Indicators */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isPlaying ? 'bg-primary animate-pulse' : 'bg-white/40'
            }`} />
            <span className="text-white/80 font-mono">
              {isPlaying ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Frequency Bands Display */}
      <div className="grid grid-cols-4 gap-4">
        {['Low', 'Mid-Low', 'Mid-High', 'High'].map((band, index) => (
          <div key={band} className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-xs text-white/60 mb-2">{band}</div>
            <div className="flex items-end space-x-1 h-12">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-300 ${
                    isPlaying && Math.random() * frequency > 200 + index * 100
                      ? `bg-gradient-to-t from-primary to-primary-glow animate-pulse`
                      : 'bg-white/20'
                  }`}
                  style={{
                    height: isPlaying 
                      ? `${Math.random() * 80 + 20}%` 
                      : '10%'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
