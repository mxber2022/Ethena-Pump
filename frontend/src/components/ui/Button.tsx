import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gradient?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  gradient = 'primary', 
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}: ButtonProps) {
  const gradientClasses = {
    primary: 'from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:via-fuchsia-400 hover:to-pink-400',
    secondary: 'from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative bg-gradient-to-r text-white py-3 px-6 rounded-xl transition-all
        ${gradientClasses[gradient]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        font-semibold
        border border-white/10
        shadow-[0_0_15px_rgba(147,51,234,0.2)]
        hover:shadow-[0_0_25px_rgba(147,51,234,0.3)]
        backdrop-blur-sm
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}