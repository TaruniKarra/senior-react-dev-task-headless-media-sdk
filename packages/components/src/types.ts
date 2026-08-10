/** Minimal media state shape that components depend on — no core import. */
export interface ComponentMediaState {
  status: "idle" | "loading" | "ready" | "playing" | "paused" | "ended" | "error";
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  buffered: number;
  error: { code: number; message: string } | null;
  src: string | null;
}

export interface ComponentControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}
