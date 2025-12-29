"use client";

import { useEffect, useState } from "react";

export default function CelebrationEffects() {
  const [confetti, setConfetti] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      speed: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    // Create confetti particles
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2"][
          Math.floor(Math.random() * 5)
        ],
        speed: 1 + Math.random() * 3,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(newConfetti);

    const timer = setTimeout(() => {
      setConfetti([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall ${1 + Math.random() * 2}s linear forwards`,
          }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl animate-pulse">
          <div className="text-4xl text-center mb-4">🎉✨🎂</div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Achievement Unlocked!
          </h2>
          <p className="text-gray-600 text-center mt-2">
            A new candle has been added to your cake!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg);
          }
        }
      `}</style>
    </div>
  );
}
