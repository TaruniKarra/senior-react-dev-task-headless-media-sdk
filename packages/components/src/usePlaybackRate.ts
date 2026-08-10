import type { ComponentMediaState, ComponentControls } from "./types.js";

interface UsePlaybackRateProps {
  state: ComponentMediaState;
  controls: ComponentControls;
  rates?: number[];
}

interface RateButtonProps {
  role: "button";
  "aria-label": string;
  "aria-pressed": boolean;
  onClick: () => void;
}

interface UsePlaybackRateReturn {
  playbackRate: number;
  availableRates: number[];
  getRateButtonProps: (rate: number) => RateButtonProps;
  setRate: (rate: number) => void;
}

const DEFAULT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function usePlaybackRate({
  state,
  controls,
  rates = DEFAULT_RATES,
}: UsePlaybackRateProps): UsePlaybackRateReturn {
  const { playbackRate } = state;

  const getRateButtonProps = (rate: number): RateButtonProps => ({
    role: "button",
    "aria-label": `Set playback speed to ${rate}x`,
    "aria-pressed": playbackRate === rate,
    onClick: () => controls.setPlaybackRate(rate),
  });

  return {
    playbackRate,
    availableRates: rates,
    getRateButtonProps,
    setRate: controls.setPlaybackRate,
  };
}
