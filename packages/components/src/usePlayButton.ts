import type { ComponentMediaState, ComponentControls } from "./types.js";

interface UsePlayButtonProps {
  state: ComponentMediaState;
  controls: ComponentControls;
}

interface PlayButtonProps {
  role: "button";
  "aria-label": string;
  "aria-pressed": boolean;
  onClick: () => void;
  disabled: boolean;
}

interface UsePlayButtonReturn {
  isPlaying: boolean;
  isDisabled: boolean;
  getPlayButtonProps: () => PlayButtonProps;
}

export function usePlayButton({
  state,
  controls,
}: UsePlayButtonProps): UsePlayButtonReturn {
  // "loading" during playback (buffering) should still show as playing
  const isPlaying = state.status === "playing" || state.status === "loading";
  const isDisabled = state.status === "idle" || state.status === "error";

  const getPlayButtonProps = (): PlayButtonProps => ({
    role: "button",
    "aria-label": isPlaying ? "Pause" : "Play",
    "aria-pressed": isPlaying,
    disabled: isDisabled,
    onClick: () => {
      if (isPlaying) controls.pause();
      else controls.play();
    },
  });

  return { isPlaying, isDisabled, getPlayButtonProps };
}
