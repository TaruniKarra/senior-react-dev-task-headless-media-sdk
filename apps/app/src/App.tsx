import React, { useState } from "react";
import {
  ApiProvider,
  MediaProvider,
  useCurated,
  useSearch,
  useVideos,
} from "@headless-media/wrappers";
import type { MediaPhoto } from "@headless-media/wrappers";
import { PhotoGrid } from "./components/PhotoGrid.js";
import { PhotoLightbox } from "./components/PhotoLightbox.js";
import { VideoReels } from "./components/VideoReels.js";

type Tab = "photos" | "videos";

function PhotosSection() {
  const { query, setQuery, photos: searchPhotos, loading: searchLoading, hasMore: searchHasMore, loadMore: searchLoadMore } = useSearch();
  const { photos: curatedPhotos, loading: curatedLoading, hasMore: curatedHasMore, loadMore: curatedLoadMore } = useCurated();
  const [lightboxPhoto, setLightboxPhoto] = useState<MediaPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isSearching = query.trim().length > 0;
  const photos = isSearching ? searchPhotos : curatedPhotos;
  const loading = isSearching ? searchLoading : curatedLoading;
  const hasMore = isSearching ? searchHasMore : curatedHasMore;
  const loadMore = isSearching ? searchLoadMore : curatedLoadMore;

  const handlePhotoClick = (photo: MediaPhoto, index: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(index);
  };

  return (
    <>
      {/* Search bar */}
      <div className="w-full max-w-3xl mx-auto mb-6">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <span style={{ color: "rgba(167,139,250,0.6)" }}>🔍</span>
          <input
            type="search"
            placeholder="Search photos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "rgba(255,255,255,0.85)", caretColor: "#a78bfa" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs"
              style={{ color: "rgba(167,139,250,0.5)" }}
            >
              ✕
            </button>
          )}
        </div>
        {isSearching && !loading && (
          <p className="text-xs mt-2 ml-1" style={{ color: "rgba(167,139,250,0.45)" }}>
            Results for "{query}"
          </p>
        )}
      </div>

      <PhotoGrid
        photos={photos}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onPhotoClick={handlePhotoClick}
      />

      {lightboxPhoto && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxPhoto(null)}
        />
      )}
    </>
  );
}

function VideosSection() {
  const { videos } = useVideos();
  return (
    <MediaProvider>
      <VideoReels videos={videos} />
    </MediaProvider>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("photos");

  return (
    <ApiProvider>
      <div
        className="min-h-screen text-white flex flex-col"
        style={{ background: "linear-gradient(160deg, #07050f 0%, #0f0a1e 50%, #12091c 100%)" }}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,5,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Headless Media SDK
          </h1>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(139,92,246,0.1)" }}>
            {(["photos", "videos"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                style={
                  tab === t
                    ? { background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff" }
                    : { color: "rgba(167,139,250,0.6)" }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6">
          {tab === "photos" ? <PhotosSection /> : <VideosSection />}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs" style={{ color: "rgba(167,139,250,0.25)" }}>
          Photos via Picsum Photos (picsum.photos) · Videos: Blender open films
        </footer>
      </div>
    </ApiProvider>
  );
}
