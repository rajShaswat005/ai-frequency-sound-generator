import { useEffect, useRef } from "react";

interface SpectrumAnalyzerProps {
  frequency: number;
  isPlaying: boolean;
  volume: number;
  className?: string;
}

export const SpectrumAnalyzer = ({ 
  frequency, 
  isPlaying, 
  volume,
  className = ""
}: SpectrumAnalyzerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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
      
      // Clear with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        const barCount = 64;
        const barWidth = width / barCount;
        const centerY = height / 2;
        
        // Create frequency-based pattern (moved outside loop)
        const freqRatio = frequency / 1000;
        const normalizedFreq = Math.log(frequency / 100) / Math.log(10);
        
        time += 0.05;

        for (let i = 0; i < barCount; i++) {
          
          // Calculate bar height with multiple frequency components
          const baseHeight = Math.sin(time + i * 0.3) * 30;
          const freqComponent = Math.sin(time * freqRatio + i * 0.1) * 20;
          const volumeComponent = volume * 0.5;
          
          const barHeight = Math.abs(baseHeight + freqComponent) * volumeComponent + 10;
          
          const x = i * barWidth;
          const y = centerY - barHeight / 2;
          
          // Create gradient based on frequency
          const hue = (normalizedFreq * 60 + i * 5 + time * 10) % 360;
          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.9)`);
          gradient.addColorStop(0.5, `hsla(${hue + 30}, 90%, 60%, 0.7)`);
          gradient.addColorStop(1, `hsla(${hue + 60}, 100%, 50%, 0.5)`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
          
          // Add glow effect
          ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.8)`;
          ctx.shadowBlur = 10;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
          ctx.shadowBlur = 0;
          
          // Reflection effect
          const reflectionHeight = barHeight * 0.3;
          const reflectionGradient = ctx.createLinearGradient(
            x, centerY + barHeight / 2, 
            x, centerY + barHeight / 2 + reflectionHeight
          );
          reflectionGradient.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.3)`);
          reflectionGradient.addColorStop(1, `hsla(${hue}, 80%, 70%, 0)`);
          
          ctx.fillStyle = reflectionGradient;
          ctx.fillRect(x + 1, centerY + barHeight / 2 + 2, barWidth - 2, reflectionHeight);
        }

        // Add waveform overlay
        ctx.strokeStyle = `hsla(${(normalizedFreq * 60) % 360}, 100%, 80%, 0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
          const waveY = centerY + Math.sin((x / width) * Math.PI * 4 + time * 2) * 
                       Math.sin(time * freqRatio) * volume * 20;
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();

        // Add frequency indicator
        const freqX = (Math.log(frequency / 100) / Math.log(10)) * width / 4;
        ctx.fillStyle = `hsla(${(frequency / 10) % 360}, 100%, 80%, 0.8)`;
        ctx.beginPath();
        ctx.arc(freqX, height - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Frequency text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${frequency.toFixed(0)} Hz`, freqX, height - 10);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying) {
      draw();
    } else {
      // Static state
      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, width, height);
      
      // Show static bars
      const barCount = 64;
      const barWidth = width / barCount;
      const centerY = height / 2;
      
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const staticHeight = 10 + Math.sin(i * 0.3) * 5;
        const y = centerY - staticHeight / 2;
        
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.fillRect(x + 1, y, barWidth - 2, staticHeight);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, isPlaying, volume]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/20 ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-full bg-black/60 backdrop-blur-sm"
      />
      
      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white/80 font-mono">
        SPECTRUM
      </div>
    </div>
  );
};