import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface TimelineItem {
  year: string | number;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent transform -translate-x-1/2"></div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`flex gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start`}
            variants={itemVariants}
          >
            {/* Left/Right Content */}
            <div className="w-1/2">
              <div className={`${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  {item.year}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>

            {/* Center Dot */}
            <div className="w-8 flex justify-center">
              <div className="w-6 h-6 bg-white border-4 border-primary rounded-full"></div>
            </div>

            {/* Empty Space */}
            <div className="w-1/2"></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
