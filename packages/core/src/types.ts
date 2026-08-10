export type MediaStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "ended"
  | "error";

export interface MediaState {
  status: MediaStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  buffered: number;
  error: MediaError | null;
  src: string | null;
}

export interface MediaError {
  code: number;
  message: string;
}

export interface AuthConfig {
  type: "apiKey" | "bearer" | "none";
  token?: string;
  headerName?: string;
}

export interface MediaOptions {
  src?: string;
  auth?: AuthConfig;
  autoPlay?: boolean;
  volume?: number;
  playbackRate?: number;
  onError?: (err: MediaError) => void;
}

// ---------- API / Discovery types ----------

export interface MediaPhoto {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  src: string;
  srcSmall: string;
}

export interface MediaVideo {
  id: string;
  title: string;
  src: string;
  poster: string;
  duration?: number;
  width: number;
  height: number;
}

export interface MediaPage<T> {
  items: T[];
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ---------- Event maps ----------

export type MediaEventMap = {
  play: MediaState;
  pause: MediaState;
  ended: MediaState;
  timeupdate: Pick<MediaState, "currentTime" | "buffered">;
  volumechange: Pick<MediaState, "volume" | "muted">;
  ratechange: Pick<MediaState, "playbackRate">;
  statechange: MediaState;
  error: MediaError;
  ready: MediaState;
  srcchange: { src: string | null };
};

export type ApiEventMap = {
  view: { id: string; type: "photo" | "video"; url: string };
  download: { id: string; type: "photo" | "video"; url: string };
};

export type MediaEventKey = keyof MediaEventMap;
export type MediaEventHandler<K extends MediaEventKey> = (
  payload: MediaEventMap[K]
) => void;
