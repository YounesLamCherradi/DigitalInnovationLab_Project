import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

const CONNECTION_DIST    = 150;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST; // avoid sqrt

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  particleColor = 'rgba(27, 138, 82, 0.5)',
  speed = 0.5,
  interactive = true,
  className = '',
}) => {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const animationIdRef  = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduce particle count on mobile to limit work
    const isMobile    = window.innerWidth < 768;
    const count       = isMobile ? Math.min(particleCount, 25) : particleCount;
    const drawLines   = !isMobile; // skip O(n²) connections on mobile

    const resizeCanvas = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const particles: P[] = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      r:  Math.random() * 2 + 1,
    }));

    const handleMouseMove = (e: MouseEvent) => { void e; }; // kept for future interactive use
    if (interactive) window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (document.hidden) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width,  p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      // Draw connections — spatial grid to reduce from O(n²) to ~O(n)
      if (drawLines) {
        const cellSize = CONNECTION_DIST;
        const cols     = Math.ceil(canvas.width  / cellSize) + 1;
        const rows     = Math.ceil(canvas.height / cellSize) + 1;
        const grid: P[][][] = Array.from({ length: cols }, () =>
          Array.from({ length: rows }, () => [])
        );

        for (const p of particles) {
          const cx = Math.floor(p.x / cellSize);
          const cy = Math.floor(p.y / cellSize);
          grid[cx]?.[cy]?.push(p);
        }

        for (const p of particles) {
          const cx = Math.floor(p.x / cellSize);
          const cy = Math.floor(p.y / cellSize);
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const neighbors = grid[cx + dx]?.[cy + dy];
              if (!neighbors) continue;
              for (const q of neighbors) {
                if (q === p) continue;
                const ddx  = p.x - q.x;
                const ddy  = p.y - q.y;
                const distSq = ddx * ddx + ddy * ddy;
                if (distSq < CONNECTION_DIST_SQ) {
                  const alpha = 0.2 * (1 - Math.sqrt(distSq) / CONNECTION_DIST);
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(27, 138, 82, ${alpha})`;
                  ctx.lineWidth   = 0.5;
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      if (!reduceMotion) animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [particleCount, particleColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
};
