import { useState, useEffect, useCallback } from "react";
import type { MediaPhoto } from "@headless-media/core";
import { useApiClient } from "./ApiContext.js";

export interface UseCuratedReturn {
  photos: MediaPhoto[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useCurated(): UseCuratedReturn {
  const client = useApiClient();
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (p: number, reset: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.list(p);
        setPhotos((prev) => (reset ? result.items : [...prev, ...result.items]));
        setHasMore(result.hasMore);
        setPage(p);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  useEffect(() => {
    void fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) void fetchPage(page + 1, false);
  }, [loading, hasMore, page, fetchPage]);

  return { photos, loading, error, hasMore, loadMore };
}
