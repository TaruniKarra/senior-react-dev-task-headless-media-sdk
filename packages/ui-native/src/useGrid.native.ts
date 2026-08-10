/**
 * Headless grid for React Native.
 * Uses FlatList's onEndReached for infinite scroll — no IntersectionObserver needed.
 *
 * Same prop contract as useGrid() in @headless-media/components.
 *
 * Usage:
 *   const { getFlatListProps, getItemProps } = useGrid({ hasMore, isLoading, onLoadMore });
 *   <FlatList {...getFlatListProps()} renderItem={({ item, index }) => (
 *     <TouchableOpacity {...getItemProps(item.id)}>...</TouchableOpacity>
 *   )} />
 */

// @ts-ignore
import { useCallback } from "react";

export interface UseGridNativeProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function useGrid({ hasMore, isLoading, onLoadMore }: UseGridNativeProps) {
  const getFlatListProps = useCallback(
    () => ({
      accessible: true,
      accessibilityLabel: "Media grid",
      onEndReached: () => { if (hasMore && !isLoading) onLoadMore(); },
      onEndReachedThreshold: 0.3,
    }),
    [hasMore, isLoading, onLoadMore]
  );

  const getItemProps = useCallback(
    (id: string) => ({
      accessible: true,
      accessibilityLabel: `Media item ${id}`,
      accessibilityRole: "button" as const,
    }),
    []
  );

  const getLoadMoreProps = useCallback(
    () => ({
      onPress: onLoadMore,
      disabled: isLoading || !hasMore,
      accessibilityLabel: hasMore ? "Load more" : "No more items",
    }),
    [onLoadMore, isLoading, hasMore]
  );

  return { getFlatListProps, getItemProps, getLoadMoreProps };
}
