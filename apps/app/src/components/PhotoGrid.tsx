import React from "react";
import type { MediaPhoto } from "@headless-media/wrappers";
import { useGrid } from "@headless-media/components";

interface PhotoGridProps {
  photos: MediaPhoto[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onPhotoClick: (photo: MediaPhoto, index: number) => void;
}

export function PhotoGrid({ photos, loading, hasMore, onLoadMore, onPhotoClick }: PhotoGridProps) {
  const { sentinelRef, getGridProps, getItemProps } = useGrid({
    hasMore,
    isLoading: loading,
    onLoadMore,
  });

  if (!loading && photos.length === 0) {
    return (
      <p className="text-center py-20 text-sm" style={{ color: "rgba(167,139,250,0.4)" }}>
        No photos found
      </p>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div
        {...getGridProps()}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            {...getItemProps(photo.id)}
            onClick={() => onPhotoClick(photo, index)}
            onKeyDown={(e) => e.key === "Enter" && onPhotoClick(photo, index)}
            className="relative cursor-pointer overflow-hidden rounded-xl group"
            style={{ aspectRatio: "3/2", border: "1px solid rgba(139,92,246,0.08)" }}
          >
            <img
              src={photo.srcSmall}
              alt={`Photo by ${photo.author}`}
              loading="lazy"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
            >
              <p className="text-xs text-white truncate">{photo.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{ aspectRatio: "3/2", background: "rgba(139,92,246,0.08)" }}
            />
          ))}
        </div>
      )}

      {/* IntersectionObserver sentinel for auto load-more */}
      <div ref={sentinelRef as React.RefObject<HTMLDivElement>} className="h-8" aria-hidden />
    </div>
  );
}
