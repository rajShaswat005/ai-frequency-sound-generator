
import { useEffect, useRef } from "react";

interface FrequencyVisualizerProps {
  frequency: number;
  isPlaying: boolean;
}

export const FrequencyVisualizer = ({ frequency, isPlaying }: FrequencyVisualizerProps) => {
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
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgba(147, 51, 234, 0.3)");
      gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.8)");
      gradient.addColorStop(1, "rgba(147, 51, 234, 0.3)");
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Generate wave based on frequency
      const amplitude = isPlaying ? 40 : 20;
      const wavelength = Math.max(50, 800 / (frequency / 100));
      const time = isPlaying ? Date.now() * 0.005 : 0;
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x / wavelength) * 2 * Math.PI + time) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Add frequency bars
      const barCount = 20;
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * (isPlaying ? frequency / 10 : frequency / 20) + 10;
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;
        
        const alpha = isPlaying ? 0.6 : 0.3;
        ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
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
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={120}
        className="w-full h-32 bg-purple-900/20 rounded-lg border border-purple-800"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 rounded-full border-2 border-purple-400 bg-purple-500/20 flex items-center justify-center">
          <span className="text-purple-300 font-mono text-sm">{frequency}Hz</span>
        </div>
      </div>
    </div>
  );
};
