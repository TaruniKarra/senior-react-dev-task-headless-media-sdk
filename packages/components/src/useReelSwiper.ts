import { useState, useRef, useCallback, useEffect } from "react";

export interface UseReelSwiperProps<T> {
  items: T[];
  onActiveChange?: (index: number, item: T) => void;
}

export interface UseReelSwiperReturn<T> {
  activeIndex: number;
  activeItem: T | null;
  goTo: (index: number) => void;
  getContainerProps: () => {
    role: "feed";
    "aria-label": string;
    "aria-busy": boolean;
    ref: React.RefObject<HTMLDivElement | null>;
    onScroll: () => void;
  };
  getItemProps: (index: number) => {
    role: "article";
    "aria-label": string;
    "aria-current": boolean;
    "data-reel-index": number;
    ref: (el: HTMLDivElement | null) => void;
  };
  isActive: (index: number) => boolean;
}

/**
 * Headless vertical reel / snap-scroll swiper.
 * Uses IntersectionObserver to detect which item is most visible (active).
 * Scroll-snap CSS is the caller's responsibility (scroll-snap-type: y mandatory on container,
 * scroll-snap-align: start on each item).
 */
export function useReelSwiper<T>({
  items,
  onActiveChange,
}: UseReelSwiperProps<T>): UseReelSwiperReturn<T> {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver: most-visible item becomes active
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios = new Map<number, number>();

    items.forEach((_, i) => {
      const el = itemRefs.current[i];
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios.set(i, entry?.intersectionRatio ?? 0);
          let best = 0;
          let bestRatio = -1;
          ratios.forEach((r, idx) => {
            if (r > bestRatio) { bestRatio = r; best = idx; }
          });
          setActiveIndex((prev) => {
            if (prev !== best) {
              onActiveChange?.(best, items[best] as T);
              return best;
            }
            return prev;
          });
        },
        { root: containerRef.current, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items, onActiveChange]);

  const goTo = useCallback((index: number) => {
    const el = itemRefs.current[index];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const getContainerProps = useCallback(
    () => ({
      role: "feed" as const,
      "aria-label": "Video reel",
      "aria-busy": false,
      ref: containerRef,
      onScroll: () => {},
    }),
    []
  );

  const getItemProps = useCallback(
    (index: number) => ({
      role: "article" as const,
      "aria-label": `Reel item ${index + 1} of ${items.length}`,
      "aria-current": index === activeIndex,
      "data-reel-index": index,
      ref: (el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
      },
    }),
    [items.length, activeIndex]
  );

  const isActive = useCallback((index: number) => index === activeIndex, [activeIndex]);

  return {
    activeIndex,
    activeItem: items[activeIndex] ?? null,
    goTo,
    getContainerProps,
    getItemProps,
    isActive,
  };
}
