import type { ComponentMediaState } from "./types.js";

interface UseMediaStatusReturn {
  isIdle: boolean;
  isLoading: boolean;
  isReady: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isEnded: boolean;
  isError: boolean;
  error: ComponentMediaState["error"];
}

export function useMediaStatus(state: ComponentMediaState): UseMediaStatusReturn {
  return {
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isReady: state.status === "ready",
    isPlaying: state.status === "playing",
    isPaused: state.status === "paused",
    isEnded: state.status === "ended",
    isError: state.status === "error",
    error: state.error,
  };
}
