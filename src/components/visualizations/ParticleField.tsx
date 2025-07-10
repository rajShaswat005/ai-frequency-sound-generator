import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
  life: number;
}

interface ParticleFieldProps {
  isActive: boolean;
  frequency?: number;
  intensity?: number;
  className?: string;
}

export const ParticleField = ({ 
  isActive, 
  frequency = 440, 
  intensity = 0.5,
  className = ""
}: ParticleFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (): Particle => {
      const canvas = canvasRef.current!;
      return {
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        hue: (frequency / 10) % 360,
        alpha: Math.random() * 0.8 + 0.2,
        life: Math.random() * 100 + 50
      };
    };

    const updateParticles = () => {
      if (!isActive) return;

      const canvas = canvasRef.current!;
      const maxParticles = Math.floor(intensity * 50);
      
      // Add particles
      while (particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle());
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.alpha = particle.life / 100;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.offsetWidth) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.offsetHeight) particle.vy *= -1;

        // Color shift based on frequency
        particle.hue = (particle.hue + frequency / 1000) % 360;

        return particle.life > 0;
      });
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      if (isActive) {
        particlesRef.current.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.alpha;
          
          // Create radial gradient for glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 1)`);
          gradient.addColorStop(0.5, `hsla(${particle.hue}, 80%, 60%, 0.5)`);
          gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Core particle
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        });

        // Draw connections between nearby particles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p1 = particlesRef.current[i];
            const p2 = particlesRef.current[j];
            const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
            
            if (distance < 100) {
              ctx.globalAlpha = (100 - distance) / 100 * 0.3;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      updateParticles();
      animationRef.current = requestAnimationFrame(draw);
    };

    if (isActive) {
      draw();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    };
  }, [isActive, frequency, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};