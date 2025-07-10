import { useEffect, useRef } from "react";

interface WaveformDisplayProps {
  frequency: number;
  isPlaying: boolean;
  volume: number;
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  className?: string;
}

export const WaveformDisplay = ({ 
  frequency, 
  isPlaying, 
  volume,
  waveform,
  className = ""
}: WaveformDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const generateWaveform = (x: number, time: number, freq: number): number => {
    const t = (x + time) * freq * 0.01;
    switch (waveform) {
      case 'sine':
        return Math.sin(t);
      case 'triangle':
        return 2 * Math.abs(2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5))) - 1;
      case 'sawtooth':
        return 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
      case 'square':
        return Math.sin(t) > 0 ? 1 : -1;
      default:
        return Math.sin(t);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      bgGradient.addColorStop(0.5, 'rgba(20, 0, 40, 0.7)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const centerY = height / 2;
      const amplitude = isPlaying ? (height / 4) * volume : height / 8;
      
      if (isPlaying) {
        time += 0.02;
      }

      // Main waveform
      ctx.lineWidth = 3;
      const hue = (frequency / 10) % 360;
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = centerY + generateWaveform(x, time, frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Glow effect
      ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.8)`;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary harmonic wave
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(${(hue + 60) % 360}, 70%, 70%, 0.6)`;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y = centerY + generateWaveform(x, time * 1.5, frequency * 2) * amplitude * 0.3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      
      // Vertical grid
      for (let x = 0; x < width; x += width / 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Frequency peaks visualization
      if (isPlaying) {
        const peakHeight = amplitude * 0.8;
        for (let i = 0; i < 5; i++) {
          const x = (width / 5) * i + width / 10;
          const peakY = centerY - peakHeight * Math.sin(time * 2 + i);
          
          ctx.fillStyle = `hsla(${hue + i * 20}, 80%, 70%, 0.6)`;
          ctx.beginPath();
          ctx.arc(x, peakY, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Trail effect
          ctx.fillStyle = `hsla(${hue + i * 20}, 80%, 70%, 0.2)`;
          ctx.beginPath();
          ctx.arc(x, peakY, 8, 0, Math.PI * 2);
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
  }, [frequency, isPlaying, volume, waveform]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-primary/30 ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={150}
        className="w-full h-full"
      />
      
      {/* Overlay info */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white/80 font-mono backdrop-blur-sm">
        {waveform.toUpperCase()} • {frequency}Hz
      </div>
      
      {/* Volume indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-3 rounded-full transition-all duration-200 ${
              volume * 5 > i 
                ? 'bg-primary shadow-glow' 
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-xs text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-neon" />
          <span className="font-mono">LIVE</span>
        </div>
      )}
    </div>
  );
};