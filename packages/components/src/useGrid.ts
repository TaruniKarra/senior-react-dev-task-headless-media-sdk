import { useRef, useEffect, useCallback } from "react";

export interface UseGridProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export interface UseGridReturn {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  getGridProps: () => {
    role: "list";
    "aria-label": string;
    "aria-busy": boolean;
  };
  getItemProps: (id: string) => {
    role: "listitem";
    "aria-label": string;
    tabIndex: number;
  };
  getLoadMoreProps: () => {
    onClick: () => void;
    disabled: boolean;
    "aria-label": string;
    "aria-busy": boolean;
  };
}

/**
 * Headless grid with infinite scroll via IntersectionObserver.
 * Attach `sentinelRef` to a div at the bottom of the list to trigger auto load-more.
 * Alternatively use `getLoadMoreProps()` on a manual button.
 * No styles or markup — caller controls layout entirely.
 */
export function useGrid({ hasMore, isLoading, onLoadMore }: UseGridProps): UseGridReturn {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) onLoadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const getGridProps = useCallback(
    () => ({
      role: "list" as const,
      "aria-label": "Media grid",
      "aria-busy": isLoading,
    }),
    [isLoading]
  );

  const getItemProps = useCallback(
    (id: string) => ({
      role: "listitem" as const,
      "aria-label": `Media item ${id}`,
      tabIndex: 0,
    }),
    []
  );

  const getLoadMoreProps = useCallback(
    () => ({
      onClick: onLoadMore,
      disabled: isLoading || !hasMore,
      "aria-label": hasMore ? "Load more" : "No more items",
      "aria-busy": isLoading,
    }),
    [onLoadMore, isLoading, hasMore]
  );

  return { sentinelRef, getGridProps, getItemProps, getLoadMoreProps };
}
