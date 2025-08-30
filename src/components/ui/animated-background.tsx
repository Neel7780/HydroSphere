import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedBackground = ({ children, className = "" }: AnimatedBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      
      const particles = container.querySelector('.particles');
      if (particles) {
        particles.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          particle.remove();
        }, 25000);
      }
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 1000);
    }

    // Continue creating particles
    const particleInterval = setInterval(createParticle, 2000);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hoverLight = e.currentTarget.querySelector('.hover-light') as HTMLElement;
    if (hoverLight) {
      const afterElement = hoverLight;
      afterElement.style.setProperty('--mouse-x', x + 'px');
      afterElement.style.setProperty('--mouse-y', y + 'px');
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`atmospheric-bg hover-light ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        ['--mouse-x' as any]: '50%',
        ['--mouse-y' as any]: '50%'
      }}
    >
      <div className="particles" />
      <style>{`
        .hover-light::after {
          left: var(--mouse-x);
          top: var(--mouse-y);
        }
      `}</style>
      {children}
    </div>
  );
};
