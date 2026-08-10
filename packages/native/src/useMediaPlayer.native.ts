/**
 * React Native equivalent of useMediaPlayer() from @headless-media/wrappers.
 *
 * Key difference from web:
 *   Web   → ref={attachRef} on <video>
 *   Native → onRef={(ref) => videoRef.current = ref} on react-native-video <Video>,
 *            then call player.attachNative(ref) manually (or let this hook handle it).
 *
 * Everything else (state, play/pause/seek/volume) is identical.
 */

// @ts-ignore — react-native not installed in web workspace
import { useCallback } from "react";
import { useMediaContext } from "./MediaContext.native.js";
import type { AuthConfig } from "@headless-media/core";

export function useMediaPlayer() {
  const { player, state } = useMediaContext();

  const load = useCallback((src: string) => player.load(src), [player]);
  const play = useCallback(() => player.play(), [player]);
  const pause = useCallback(() => player.pause(), [player]);
  const seek = useCallback((t: number) => player.seek(t), [player]);
  const setVolume = useCallback((v: number) => player.setVolume(v), [player]);
  const setMuted = useCallback((m: boolean) => player.setMuted(m), [player]);
  const setPlaybackRate = useCallback((r: number) => player.setPlaybackRate(r), [player]);
  const setAuth = useCallback((a: AuthConfig) => player.setAuth(a), [player]);

  /**
   * Pass to react-native-video's onLoad / onProgress / onError callbacks
   * instead of attaching a DOM ref. The native Video component drives state
   * by calling these handlers; we forward them into the core player.
   */
  const nativeHandlers = {
    onLoad: (data: { duration: number }) => {
      // Core MediaPlayer exposes internal transition for native use
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).state.duration = data.duration;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).transition("ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).emitState();
    },
    onProgress: (data: { currentTime: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).state.currentTime = data.currentTime;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).emitState();
    },
    onEnd: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).transition("ended");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).emitState();
    },
    onError: (err: { error: { localizedDescription: string } }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (player as any).handleError({ code: -1, message: err.error.localizedDescription });
    },
  };

  return { state, load, play, pause, seek, setVolume, setMuted, setPlaybackRate, setAuth, nativeHandlers };
}
