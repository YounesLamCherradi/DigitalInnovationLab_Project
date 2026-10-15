import React, { useEffect, useRef } from 'react';

type Props = { src: string; poster: string; className?: string };

export const AutoplayVideo: React.FC<Props> = ({ src, poster, className = '' }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: [0, 0.35] });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} poster={poster} controls autoPlay muted loop playsInline preload="metadata">
    Your browser does not support HTML video.
  </video>;
};
