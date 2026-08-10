import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MediaPlayer } from "@headless-media/core";
import type { MediaOptions, MediaState } from "@headless-media/core";

interface MediaContextValue {
  player: MediaPlayer;
  state: MediaState;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export interface MediaProviderProps {
  options?: MediaOptions;
  children: React.ReactNode;
}

export function MediaProvider({ options, children }: MediaProviderProps) {
  const playerRef = useRef<MediaPlayer | null>(null);

  if (!playerRef.current) {
    playerRef.current = new MediaPlayer(options);
  }

  const [state, setState] = useState<MediaState>(() =>
    playerRef.current!.getState()
  );

  useEffect(() => {
    const player = playerRef.current!;
    const unsub = player.on("statechange", (s) => setState({ ...s }));
    return unsub;
  }, []);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <MediaContext.Provider value={{ player: playerRef.current, state }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaContext(): MediaContextValue {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error("useMediaContext must be used inside <MediaProvider>");
  }
  return ctx;
}
