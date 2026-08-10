import type { ComponentMediaState, ComponentControls } from "./types.js";

interface UseVolumeControlProps {
  state: ComponentMediaState;
  controls: ComponentControls;
}

interface MuteButtonProps {
  role: "button";
  "aria-label": string;
  "aria-pressed": boolean;
  onClick: () => void;
}

interface VolumeSliderProps {
  role: "slider";
  "aria-label": string;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-valuetext": string;
  tabIndex: number;
}

interface UseVolumeControlReturn {
  volume: number;
  muted: boolean;
  getMuteButtonProps: () => MuteButtonProps;
  getVolumeSliderProps: () => VolumeSliderProps;
  onVolumeChange: (value: number) => void;
}

export function useVolumeControl({
  state,
  controls,
}: UseVolumeControlProps): UseVolumeControlReturn {
  const { volume, muted } = state;

  const getMuteButtonProps = (): MuteButtonProps => ({
    role: "button",
    "aria-label": muted ? "Unmute" : "Mute",
    "aria-pressed": muted,
    onClick: () => controls.setMuted(!muted),
  });

  const getVolumeSliderProps = (): VolumeSliderProps => ({
    role: "slider",
    "aria-label": "Volume",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(volume * 100),
    "aria-valuetext": `${Math.round(volume * 100)}%`,
    tabIndex: 0,
  });

  const onVolumeChange = (value: number) => {
    controls.setVolume(Math.max(0, Math.min(1, value)));
  };

  return { volume, muted, getMuteButtonProps, getVolumeSliderProps, onVolumeChange };
}
