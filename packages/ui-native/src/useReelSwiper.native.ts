/**
 * Headless vertical reel swiper for React Native.
 * Uses FlatList with pagingEnabled + viewabilityConfig to detect the active item.
 * Same contract as useReelSwiper() in @headless-media/components.
 *
 * Usage:
 *   const { activeIndex, getFlatListProps, getItemProps, isActive } =
 *     useReelSwiper({ items, onActiveChange });
 *
 *   <FlatList
 *     {...getFlatListProps()}
 *     renderItem={({ item, index }) => (
 *       <View {...getItemProps(index)} style={{ height: SCREEN_HEIGHT }}>
 *         {isActive(index) && <Video source={{ uri: item.src }} />}
 *       </View>
 *     )}
 *   />
 */

// @ts-ignore
import { useState, useRef, useCallback } from "react";

export interface UseReelSwiperNativeProps<T> {
  items: T[];
  onActiveChange?: (index: number, item: T) => void;
}

export function useReelSwiper<T>({ items, onActiveChange }: UseReelSwiperNativeProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<unknown>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const first = viewableItems[0];
      if (first?.index != null && first.index !== activeIndex) {
        setActiveIndex(first.index);
        onActiveChange?.(first.index, items[first.index] as T);
      }
    },
    [activeIndex, items, onActiveChange]
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

  const goTo = useCallback((index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (flatListRef.current as any)?.scrollToIndex({ index, animated: true });
  }, []);

  const getFlatListProps = useCallback(
    () => ({
      ref: flatListRef,
      pagingEnabled: true,
      showsVerticalScrollIndicator: false,
      vertical: true,
      onViewableItemsChanged,
      viewabilityConfig,
      accessibilityLabel: "Video reel",
    }),
    [onViewableItemsChanged]
  );

  const getItemProps = useCallback(
    (index: number) => ({
      accessible: true,
      accessibilityLabel: `Reel item ${index + 1} of ${items.length}`,
      accessibilityRole: "none" as const,
    }),
    [items.length]
  );

  const isActive = useCallback((index: number) => index === activeIndex, [activeIndex]);

  return { activeIndex, activeItem: items[activeIndex] ?? null, goTo, getFlatListProps, getItemProps, isActive };
}
