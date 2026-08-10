import { useEffect } from "react";
import { useMediaContext } from "./MediaContext.js";
import type { MediaEventKey, MediaEventHandler } from "@headless-media/core";

export function useMediaEvent<K extends MediaEventKey>(
  event: K,
  handler: MediaEventHandler<K>
): void {
  const { player } = useMediaContext();

  useEffect(() => {
    return player.on(event, handler);
  }, [player, event, handler]);
}
