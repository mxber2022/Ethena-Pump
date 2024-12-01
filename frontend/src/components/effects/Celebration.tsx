import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export function Celebration() {
  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333EA', '#EC4899', '#06B6D4']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9333EA', '#EC4899', '#06B6D4']
      });
    }, 150);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
    >
      <div className="text-6xl">🎉</div>
    </motion.div>
  );
}