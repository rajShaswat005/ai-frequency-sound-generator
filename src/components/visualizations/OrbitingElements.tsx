import { useEffect, useRef } from "react";

interface OrbitingElementsProps {
  isActive: boolean;
  frequency?: number;
  className?: string;
}

export const OrbitingElements = ({ 
  isActive, 
  frequency = 440,
  className = ""
}: OrbitingElementsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll('.orbit-element');
    
    if (isActive) {
      const freqFactor = frequency / 440; // Normalize to A4
      const baseSpeed = 0.5 * freqFactor;
      
      elements.forEach((element, index) => {
        const el = element as HTMLElement;
        const orbitRadius = 80 + index * 30;
        const speed = baseSpeed * (1 + index * 0.3);
        const phase = (index * Math.PI * 2) / elements.length;
        
        el.style.setProperty('--orbit-radius', `${orbitRadius}px`);
        el.style.setProperty('--orbit-speed', `${20 / speed}s`);
        el.style.setProperty('--orbit-phase', `${phase}rad`);
        el.style.animationPlayState = 'running';
      });
    } else {
      elements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.animationPlayState = 'paused';
      });
    }
  }, [isActive, frequency]);

  const orbitElements = [
    { color: 'bg-electric-blue', size: 'w-3 h-3', delay: '0s' },
    { color: 'bg-neon-purple', size: 'w-4 h-4', delay: '0.5s' },
    { color: 'bg-cyber-pink', size: 'w-2 h-2', delay: '1s' },
    { color: 'bg-plasma-green', size: 'w-3 h-3', delay: '1.5s' },
    { color: 'bg-solar-orange', size: 'w-2 h-2', delay: '2s' },
    { color: 'bg-cosmic-violet', size: 'w-4 h-4', delay: '2.5s' },
  ];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      {/* Central core */}
      <div className={`absolute w-16 h-16 rounded-full border-2 border-primary/40 
        ${isActive ? 'animate-pulse-neon' : 'border-white/20'} 
        backdrop-blur-sm bg-black/40 z-10 flex items-center justify-center`}>
        <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-primary animate-glow' 
            : 'bg-white/20'
        }`} />
      </div>

      {/* Orbiting elements */}
      {orbitElements.map((element, index) => (
        <div
          key={index}
          className={`orbit-element absolute ${element.size} ${element.color} 
            rounded-full shadow-neon transition-all duration-300 ${
              isActive ? 'opacity-100' : 'opacity-30'
            }`}
          style={{
            animation: isActive 
              ? `orbit var(--orbit-speed, 20s) linear infinite`
              : 'none',
            animationDelay: element.delay,
            transform: `rotate(var(--orbit-phase, 0rad)) translateX(var(--orbit-radius, 80px)) rotate(calc(-1 * var(--orbit-phase, 0rad)))`
          }}
        />
      ))}

      {/* Orbital rings */}
      {[1, 2, 3].map((ring) => (
        <div
          key={ring}
          className={`absolute rounded-full border transition-all duration-500 ${
            isActive 
              ? 'border-primary/20 animate-rotate-slow' 
              : 'border-white/10'
          }`}
          style={{
            width: `${ring * 120}px`,
            height: `${ring * 120}px`,
            animationDuration: `${ring * 15}s`,
            animationDirection: ring % 2 === 0 ? 'reverse' : 'normal'
          }}
        />
      ))}

      {/* Frequency indicator */}
      {isActive && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm 
          rounded text-xs text-primary font-mono animate-shimmer">
          {frequency.toFixed(0)} Hz
        </div>
      )}
    </div>
  );
};

// Add keyframe for orbit animation
const style = document.createElement('style');
style.textContent = `
  @keyframes orbit {
    from {
      transform: rotate(0deg) translateX(var(--orbit-radius, 80px)) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(var(--orbit-radius, 80px)) rotate(-360deg);
    }
  }
`;
document.head.appendChild(style);