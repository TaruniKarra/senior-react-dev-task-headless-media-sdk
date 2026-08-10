/**
 * Headless lightbox for React Native.
 * Uses Modal for the overlay. Back button / gesture closes it.
 * Same prop contract as useLightbox() in @headless-media/components.
 *
 * Usage:
 *   const { currentItem, getModalProps, getCloseProps, getPrevProps, getNextProps } =
 *     useLightbox({ items, initialIndex, onClose });
 *   <Modal {...getModalProps()}>
 *     <TouchableOpacity {...getCloseProps()}><Text>✕</Text></TouchableOpacity>
 *     <Image source={{ uri: currentItem.src }} />
 *   </Modal>
 */

// @ts-ignore
import { useState, useCallback } from "react";

export interface LightboxItemNative {
  id: string;
  src: string;
  alt?: string;
  type?: "photo" | "video";
}

export function useLightbox({
  items,
  initialIndex = 0,
  onClose,
}: {
  items: LightboxItemNative[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );

  const currentItem = items[currentIndex] ?? null;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < items.length - 1;

  const prev = useCallback(() => setCurrentIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCurrentIndex(i => Math.min(items.length - 1, i + 1)), [items.length]);

  const getModalProps = useCallback(
    () => ({
      visible: true,
      transparent: true,
      animationType: "fade" as const,
      accessibilityViewIsModal: true,
      accessibilityLabel: "Image lightbox",
      onRequestClose: onClose, // Android back button
    }),
    [onClose]
  );

  const getCloseProps = useCallback(
    () => ({ onPress: onClose, accessibilityLabel: "Close lightbox", accessibilityRole: "button" as const }),
    [onClose]
  );

  const getPrevProps = useCallback(
    () => ({ onPress: prev, disabled: !canPrev, accessibilityLabel: "Previous image", accessibilityRole: "button" as const }),
    [prev, canPrev]
  );

  const getNextProps = useCallback(
    () => ({ onPress: next, disabled: !canNext, accessibilityLabel: "Next image", accessibilityRole: "button" as const }),
    [next, canNext]
  );

  const getImageProps = useCallback(
    () => ({
      source: { uri: currentItem?.src ?? "" },
      accessibilityLabel: currentItem?.alt ?? `Image ${currentIndex + 1} of ${items.length}`,
      accessibilityRole: "image" as const,
    }),
    [currentItem, currentIndex, items.length]
  );

  return { currentIndex, currentItem, canPrev, canNext, prev, next, getModalProps, getCloseProps, getPrevProps, getNextProps, getImageProps };
}
