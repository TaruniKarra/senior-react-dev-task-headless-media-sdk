import type { ComponentMediaState, ComponentControls } from "./types.js";

interface UseProgressBarProps {
  state: ComponentMediaState;
  controls: ComponentControls;
}

export interface ProgressBarProps {
  role: "progressbar" | "slider";
  "aria-label": string;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-valuetext": string;
  tabIndex: number;
  onSeek: (clientX: number, containerRect: DOMRect) => void;
}

interface UseProgressBarReturn {
  currentTime: number;
  duration: number;
  buffered: number;
  progress: number;
  bufferedProgress: number;
  getProgressBarProps: () => ProgressBarProps;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function useProgressBar({
  state,
  controls,
}: UseProgressBarProps): UseProgressBarReturn {
  const { currentTime, duration, buffered } = state;
  const progress = duration > 0 ? currentTime / duration : 0;
  const bufferedProgress = duration > 0 ? buffered / duration : 0;

  const getProgressBarProps = (): ProgressBarProps => ({
    role: "progressbar",
    "aria-label": "Playback progress",
    "aria-valuemin": 0,
    "aria-valuemax": duration,
    "aria-valuenow": currentTime,
    "aria-valuetext": `${formatTime(currentTime)} of ${formatTime(duration)}`,
    tabIndex: 0,
    onSeek: (clientX, rect) => {
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      controls.seek(ratio * duration);
    },
  });

  return {
    currentTime,
    duration,
    buffered,
    progress,
    bufferedProgress,
    getProgressBarProps,
  };
}
