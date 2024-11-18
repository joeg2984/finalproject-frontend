import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessAnimation = ({ show }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        angle: (i * 360) / 20,
        delay: i * 50
      }));
      setParticles(newParticles);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="relative">
        <CheckCircle 
          className="w-20 h-20 text-green-500 animate-bounce" 
          strokeWidth={3}
        />
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-green-500 rounded-full animate-particle"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${particle.angle}deg)`,
              animation: `particle 1s ease-out ${particle.delay}ms forwards`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes particle {
    0% {
      opacity: 1;
      transform: rotate(var(--angle)) translateY(0);
    }
    100% {
      opacity: 0;
      transform: rotate(var(--angle)) translateY(100px);
    }
  }
`;
document.head.appendChild(style);

export default SuccessAnimation;