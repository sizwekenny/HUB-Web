import React, { useEffect, useState, useRef } from 'react';

interface BackgroundSlideshowProps {
  images: string[];               // Array of image URLs (imported or public paths)
  intervalMs?: number;            // Time each image stays fully visible
  fadeDurationMs?: number;        // Fade transition duration
  overlayClassName?: string;      // Optional overlay (e.g., gradient / tint)
  className?: string;             // Extra classes for root wrapper
  startIndex?: number;            // Optional starting image index
  pauseOnVisibilityLoss?: boolean;// Pause when tab hidden (default true)
}

// Lightweight fading background slideshow (no heavy re-renders)
// Uses opacity transitions; keeps previous + next image in DOM during fade for smoother cross‑fade
const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  images,
  intervalMs = 6000,
  fadeDurationMs = 1000,
  overlayClassName = 'bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-900/70',
  className = '',
  startIndex = 0,
  pauseOnVisibilityLoss = true
}) => {
  const [index, setIndex] = useState(startIndex % (images.length || 1));
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Preload images once
  useEffect(() => {
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, [images]);

  useEffect(() => { return () => { mountedRef.current = false; if (timerRef.current) window.clearTimeout(timerRef.current); }; }, []);

  const scheduleNext = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPrevIndex(index);
      setIndex(i => (i + 1) % images.length);
    }, intervalMs);
  };

  // Advance on index change
  useEffect(() => {
    if (images.length <= 1) return; // nothing to cycle
    scheduleNext();
  }, [index, images.length, intervalMs]);

  // Optional pause when tab hidden (saves CPU/battery)
  useEffect(() => {
    if (!pauseOnVisibilityLoss) return;
    const handleVisibility = () => {
      if (document.hidden) { if (timerRef.current) window.clearTimeout(timerRef.current); }
      else scheduleNext();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pauseOnVisibilityLoss, intervalMs, images.length]);

  // Clean prev image after fade completes to keep DOM light
  useEffect(() => {
    if (prevIndex === null) return;
    const id = window.setTimeout(() => { if (mountedRef.current) setPrevIndex(null); }, fadeDurationMs + 50);
    return () => window.clearTimeout(id);
  }, [prevIndex, fadeDurationMs]);

  if (!images.length) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Images layer */}
      <div className="absolute inset-0">
        {prevIndex !== null && (
          <img
            key={`prev-${prevIndex}`}
            src={images[prevIndex]}
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity"
            style={{ transitionDuration: fadeDurationMs + 'ms' }}
            alt="Previous background" />
        )}
        <img
          key={`active-${index}`}
            src={images[index]}
            className={`absolute inset-0 w-full h-full object-cover ${prevIndex !== null ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            style={{ transitionDuration: fadeDurationMs + 'ms', animation: prevIndex !== null ? undefined : undefined }}
            onLoad={(e) => { if (prevIndex !== null) { // trigger fade sequence next frame
              requestAnimationFrame(() => { (e.currentTarget as HTMLImageElement).classList.remove('opacity-0'); (e.currentTarget as HTMLImageElement).classList.add('opacity-100'); });
            } }}
            alt="Background slide" />
      </div>
      {/* Overlay tint / gradient */}
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName} backdrop-blur-[1px]`}></div>}
    </div>
  );
};

export default BackgroundSlideshow;
