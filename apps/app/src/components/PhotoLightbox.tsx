import React from "react";
import type { MediaPhoto } from "@headless-media/wrappers";
import { useLightbox } from "@headless-media/components";
import type { LightboxItem } from "@headless-media/components";

interface PhotoLightboxProps {
  photos: MediaPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const items: LightboxItem[] = photos.map((p) => ({
    id: p.id,
    src: p.src,
    alt: `Photo by ${p.author}`,
    type: "photo",
  }));

  const {
    currentIndex,
    currentItem,
    canPrev,
    canNext,
    getOverlayProps,
    getCloseProps,
    getPrevProps,
    getNextProps,
    getImageProps,
  } = useLightbox({ items, initialIndex, onClose });

  if (!currentItem) return null;

  const photo = photos[currentIndex];
  const imageProps = getImageProps();

  return (
    <div
      {...getOverlayProps()}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      {/* Close */}
      <button
        {...getCloseProps()}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-lg transition hover:scale-110"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
      >
        ✕
      </button>

      {/* Counter */}
      <p
        className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tabular-nums"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {currentIndex + 1} / {photos.length}
      </p>

      {/* Prev */}
      {canPrev && (
        <button
          {...getPrevProps()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition hover:scale-110"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          ←
        </button>
      )}

      {/* Image */}
      <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-2">
        <img
          {...imageProps}
          className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
          style={{ border: "1px solid rgba(139,92,246,0.2)" }}
        />
        {photo && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Photo by {photo.author}
          </p>
        )}
      </div>

      {/* Next */}
      {canNext && (
        <button
          {...getNextProps()}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition hover:scale-110"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          →
        </button>
      )}
    </div>
  );
}
