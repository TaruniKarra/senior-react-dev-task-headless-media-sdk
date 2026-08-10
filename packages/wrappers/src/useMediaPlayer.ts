import { useRef, useEffect, useCallback } from "react";
import { useMediaContext } from "./MediaContext.js";
import type { MediaState, AuthConfig } from "@headless-media/core";

export interface UseMediaPlayerReturn {
  state: MediaState;
  load: (src: string) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setAuth: (auth: AuthConfig) => void;
  attachRef: React.RefObject<HTMLMediaElement | null>;
}

export function useMediaPlayer(): UseMediaPlayerReturn {
  const { player, state } = useMediaContext();
  const attachRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    const el = attachRef.current;
    if (el) {
      player.attach(el);
      return () => player.detach();
    }
  }, [player]);

  const load = useCallback((src: string) => player.load(src), [player]);
  const play = useCallback(() => player.play(), [player]);
  const pause = useCallback(() => player.pause(), [player]);
  const seek = useCallback((t: number) => player.seek(t), [player]);
  const setVolume = useCallback((v: number) => player.setVolume(v), [player]);
  const setMuted = useCallback((m: boolean) => player.setMuted(m), [player]);
  const setPlaybackRate = useCallback((r: number) => player.setPlaybackRate(r), [player]);
  const setAuth = useCallback((a: AuthConfig) => player.setAuth(a), [player]);

  return {
    state,
    load,
    play,
    pause,
    seek,
    setVolume,
    setMuted,
    setPlaybackRate,
    setAuth,
    attachRef,
  };
}
