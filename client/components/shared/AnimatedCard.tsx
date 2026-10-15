import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | '3d' | 'magnetic';
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== '3d') return;

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 10;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const baseClasses = `rounded-lg border border-primary/20 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary/40 hover:shadow-xl ${className}`;

  if (variant === '3d') {
    return (
      <motion.div
        ref={cardRef}
        className={baseClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1000px',
        }}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'magnetic') {
    return (
      <motion.div
        ref={cardRef}
        className={baseClasses}
        whileHover={{
          scale: 1.05,
          y: -5,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px rgba(27, 138, 82, 0.2)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
