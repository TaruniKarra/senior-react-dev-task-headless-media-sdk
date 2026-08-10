import { useState, useEffect, useCallback } from "react";

export interface LightboxItem {
  id: string;
  src: string;
  alt?: string;
  type?: "photo" | "video";
}

export interface UseLightboxProps {
  items: LightboxItem[];
  initialIndex?: number;
  onClose: () => void;
}

export interface UseLightboxReturn {
  currentIndex: number;
  currentItem: LightboxItem | null;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
  goTo: (index: number) => void;
  getOverlayProps: () => {
    role: "dialog";
    "aria-modal": true;
    "aria-label": string;
    onClick: (e: React.MouseEvent) => void;
  };
  getCloseProps: () => {
    onClick: () => void;
    "aria-label": string;
  };
  getPrevProps: () => {
    onClick: () => void;
    disabled: boolean;
    "aria-label": string;
  };
  getNextProps: () => {
    onClick: () => void;
    disabled: boolean;
    "aria-label": string;
  };
  getImageProps: () => {
    src: string;
    alt: string;
    role: "img";
    "aria-label": string;
  };
}

/**
 * Headless lightbox: keyboard navigation (←/→/Esc), focus trap awareness,
 * ARIA dialog role. No DOM structure or styles.
 */
export function useLightbox({ items, initialIndex = 0, onClose }: UseLightboxProps): UseLightboxReturn {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );

  const currentItem = items[currentIndex] ?? null;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < items.length - 1;

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(items.length - 1, i + 1));
  }, [items.length]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, items.length - 1)));
    },
    [items.length]
  );

  // Keyboard: ←/→ navigate, Esc closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const getOverlayProps = useCallback(
    () => ({
      role: "dialog" as const,
      "aria-modal": true as const,
      "aria-label": "Image lightbox",
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
      },
    }),
    [onClose]
  );

  const getCloseProps = useCallback(
    () => ({ onClick: onClose, "aria-label": "Close lightbox" }),
    [onClose]
  );

  const getPrevProps = useCallback(
    () => ({
      onClick: prev,
      disabled: !canPrev,
      "aria-label": "Previous image",
    }),
    [prev, canPrev]
  );

  const getNextProps = useCallback(
    () => ({
      onClick: next,
      disabled: !canNext,
      "aria-label": "Next image",
    }),
    [next, canNext]
  );

  const getImageProps = useCallback(
    () => ({
      src: currentItem?.src ?? "",
      alt: currentItem?.alt ?? `Image ${currentIndex + 1} of ${items.length}`,
      role: "img" as const,
      "aria-label": currentItem?.alt ?? `Image ${currentIndex + 1} of ${items.length}`,
    }),
    [currentItem, currentIndex, items.length]
  );

  return {
    currentIndex,
    currentItem,
    canPrev,
    canNext,
    prev,
    next,
    goTo,
    getOverlayProps,
    getCloseProps,
    getPrevProps,
    getNextProps,
    getImageProps,
  };
}
