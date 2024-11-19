import React, { useState, useEffect } from 'react';

const SuccessAnimation = ({ show, logoSrc }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        angle: (i * 360) / 20,
        delay: i * 50,
      }));
      setParticles(newParticles);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="relative">
        <img
          src='src/assets/logo-round.png'
          alt="Success Logo"
          className="w-40 h-40 animate-bounce"
        />
        {particles.map((particle) => (
          <div
            key={particle.id}
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
