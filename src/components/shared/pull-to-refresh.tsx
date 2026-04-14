"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const THRESHOLD = 80;

export function PullToRefresh({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const el = containerRef.current;
    if (!el || el.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || refreshing) return;
    const el = containerRef.current;
    if (!el || el.scrollTop > 0) {
      isDragging.current = false;
      setPulling(false);
      setPullDistance(0);
      return;
    }

    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      // Dampen pull distance
      const dist = Math.min(dy * 0.5, 120);
      setPullDistance(dist);
      setPulling(true);
      if (dist > 10) e.preventDefault();
    }
  }, [refreshing]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (!pulling) return;

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      // Reload the page data by triggering a re-render of the app
      window.location.reload();
    } else {
      setPulling(false);
      setPullDistance(0);
    }
  }, [pulling, pullDistance]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div ref={containerRef} className={className}>
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: pulling || refreshing ? pullDistance : 0 }}
      >
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
          style={{
            opacity: Math.min(pullDistance / THRESHOLD, 1),
            transform: refreshing ? 'none' : `rotate(${Math.min(pullDistance / THRESHOLD, 1) * 180}deg)`,
          }}
        >
          <Loader2 className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : pullDistance >= THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      </div>
      {children}
    </div>
  );
}
