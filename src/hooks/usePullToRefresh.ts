"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0 && window.scrollY === 0) {
      const distance = Math.min(diff * 0.5, maxPull);
      setPullDistance(distance);
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [isRefreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);

  return { pullDistance, isRefreshing, progress };
}
