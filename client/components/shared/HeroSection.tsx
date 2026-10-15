import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  backgroundParticles?: boolean;
  videoUrl?: string;
  compact?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  children,
  className = '',
  backgroundParticles = true,
  videoUrl,
  compact = false,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-dark/20 via-white to-primary/10 ${compact ? 'min-h-[340px] sm:min-h-[400px]' : 'min-h-screen'} ${className}`}
    >
      {/* Video Background */}
      {videoUrl && (
        <>
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${
                videoUrl.includes('youtu.be')
                  ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                  : new URLSearchParams(new URL(videoUrl).search).get('v')
              }?autoplay=1&mute=1&loop=1&playlist=${
                videoUrl.includes('youtu.be')
                  ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
                  : new URLSearchParams(new URL(videoUrl).search).get('v')
              }&controls=0&modestbranding=1&rel=0`}
              frameBorder="0"
              allow="autoplay; muted"
              allowFullScreen
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </>
      )}

      {/* Video Overlay */}
      {videoUrl && (
        <div className="absolute inset-0 bg-black/30"></div>
      )}

      {/* Particle Background */}
      {backgroundParticles && !videoUrl && (
        <div className="absolute inset-0">
          <ParticleBackground
            particleCount={60}
            speed={0.3}
            particleColor="rgba(27, 138, 82, 0.3)"
            interactive
          />
        </div>
      )}

      {/* Decorative Elements */}
      {!videoUrl && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2"></div>
        </>
      )}

      {/* Content */}
      <motion.div
        className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${compact ? 'py-14 sm:py-16' : 'py-20'}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className={`${compact ? 'text-4xl sm:text-5xl' : 'text-4xl sm:text-5xl lg:text-6xl'} font-bold text-primary mb-6 leading-tight`}
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
