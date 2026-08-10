import { useState, useEffect, useCallback } from "react";
import type { MediaPhoto } from "@headless-media/core";
import { useApiClient } from "./ApiContext.js";

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  photos: MediaPhoto[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useSearch(): UseSearchReturn {
  const client = useApiClient();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 400 ms debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch on debounced query change
  useEffect(() => {
    if (!debounced) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPhotos([]);
    setPage(1);

    client
      .search(debounced, 1)
      .then((result) => {
        if (cancelled) return;
        setPhotos(result.items);
        setHasMore(result.hasMore);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [client, debounced]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !debounced) return;
    setLoading(true);
    try {
      const next = page + 1;
      const result = await client.search(debounced, next);
      setPhotos((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [client, loading, hasMore, debounced, page]);

  return { query, setQuery, photos, loading, error, hasMore, loadMore };
}
