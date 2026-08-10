/**
 * React Native wrapper for @headless-media/core MediaPlayer.
 * Same contract as @headless-media/wrappers — only the attach mechanism differs:
 * instead of ref={attachRef} on <video>, you pass onRef to react-native-video's <Video>.
 *
 * Requires: react-native, react-native-video >=6.0.0
 */

// NOTE: These imports resolve only in a React Native environment.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — react-native not installed in web workspace
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { MediaPlayer } from "@headless-media/core";
import type { MediaOptions, MediaState } from "@headless-media/core";

interface MediaContextValue {
  player: MediaPlayer;
  state: MediaState;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export interface MediaProviderNativeProps {
  options?: MediaOptions;
  children: React.ReactNode;
}

/**
 * Drop-in equivalent of <MediaProvider> from @headless-media/wrappers.
 * Wrap around any screen/component that needs video playback state.
 */
export function MediaProvider({ options, children }: MediaProviderNativeProps) {
  const playerRef = useRef<MediaPlayer | null>(null);
  if (!playerRef.current) playerRef.current = new MediaPlayer(options);

  const [state, setState] = useState<MediaState>(() => playerRef.current!.getState());

  useEffect(() => {
    const player = playerRef.current!;
    const unsub = player.on("statechange", (s) => setState({ ...s }));
    return unsub;
  }, []);

  useEffect(() => {
    return () => { playerRef.current?.destroy(); };
  }, []);

  return (
    <MediaContext.Provider value={{ player: playerRef.current, state }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaContext(): MediaContextValue {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMediaContext must be used inside <MediaProvider>");
  return ctx;
}
