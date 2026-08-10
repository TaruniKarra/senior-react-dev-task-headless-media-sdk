import { EventEmitter } from "./emitter.js";
import { buildAuthHeaders } from "./auth.js";
import type {
  MediaState,
  MediaOptions,
  MediaStatus,
  AuthConfig,
  MediaError,
} from "./types.js";

const DEFAULT_STATE: MediaState = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,
  buffered: 0,
  error: null,
  src: null,
};

/**
 * Core media player — framework-agnostic, no DOM dependency.
 * Drives an HTMLMediaElement passed in at construction time,
 * or operates in headless mode (for testing / CLI) without one.
 */
export class MediaPlayer extends EventEmitter {
  private state: MediaState = { ...DEFAULT_STATE };
  private element: HTMLMediaElement | null = null;
  private auth: AuthConfig;
  private cleanupFns: Array<() => void> = [];
  /** Tracks which src has actually been sent to the element, to avoid redundant reloads on re-attach (e.g. React StrictMode double-mount). */
  private elementSrc: string | null = null;

  constructor(options: MediaOptions = {}) {
    super();
    this.auth = options.auth ?? { type: "none" };

    if (options.volume !== undefined) this.state.volume = options.volume;
    if (options.playbackRate !== undefined)
      this.state.playbackRate = options.playbackRate;
    if (options.src) this.load(options.src);
  }

  /** Attach an HTMLMediaElement (called by framework wrappers). */
  attach(element: HTMLMediaElement): void {
    this.detach();
    this.element = element;
    this.syncElementFromState();
    this.bindElementEvents();
  }

  /** Detach the current element and remove all listeners. */
  detach(): void {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    this.element = null;
  }

  getState(): Readonly<MediaState> {
    return { ...this.state };
  }

  load(src: string): void {
    const resolvedSrc = this.resolveAuthSrc(src);
    this.transition("loading");
    this.state.src = src;
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.state.buffered = 0;
    this.state.error = null;

    if (this.element) {
      this.element.src = resolvedSrc;
      this.element.load();
      this.elementSrc = src;
    }

    this.emit("srcchange", { src });
    this.emitState();
  }

  play(): void {
    this.element?.play().catch((err: unknown) => {
      this.handleError({ code: 0, message: String(err) });
    });
  }

  pause(): void {
    this.element?.pause();
  }

  seek(time: number): void {
    const clamped = Math.max(0, Math.min(time, this.state.duration));
    if (this.element) this.element.currentTime = clamped;
    else this.state.currentTime = clamped;
  }

  setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.state.volume = clamped;
    this.state.muted = clamped === 0;
    if (this.element) {
      this.element.volume = clamped;
      this.element.muted = this.state.muted;
    }
    this.emit("volumechange", { volume: this.state.volume, muted: this.state.muted });
    this.emitState();
  }

  setMuted(muted: boolean): void {
    this.state.muted = muted;
    if (this.element) this.element.muted = muted;
    this.emit("volumechange", { volume: this.state.volume, muted });
    this.emitState();
  }

  setPlaybackRate(rate: number): void {
    this.state.playbackRate = rate;
    if (this.element) this.element.playbackRate = rate;
    this.emit("ratechange", { playbackRate: rate });
    this.emitState();
  }

  setAuth(auth: AuthConfig): void {
    this.auth = auth;
    if (this.state.src) this.load(this.state.src);
  }

  getAuthHeaders(): Record<string, string> {
    return buildAuthHeaders(this.auth);
  }

  destroy(): void {
    this.detach();
    this.removeAllListeners();
  }

  private resolveAuthSrc(src: string): string {
    if (this.auth.type === "apiKey" && this.auth.token) {
      const sep = src.includes("?") ? "&" : "?";
      return `${src}${sep}api_key=${encodeURIComponent(this.auth.token)}`;
    }
    return src;
  }

  private transition(status: MediaStatus): void {
    this.state.status = status;
  }

  private handleError(err: MediaError): void {
    this.state.error = err;
    this.transition("error");
    this.emit("error", err);
    this.emitState();
  }

  private emitState(): void {
    this.emit("statechange", this.getState());
  }

  private syncElementFromState(): void {
    if (!this.element) return;
    this.element.volume = this.state.volume;
    this.element.muted = this.state.muted;
    this.element.playbackRate = this.state.playbackRate;
    if (this.state.src) {
      const resolvedSrc = this.resolveAuthSrc(this.state.src);
      // Skip reload if this src is already loaded into the element (handles React StrictMode double-mount)
      if (this.state.src !== this.elementSrc) {
        this.element.src = resolvedSrc;
        this.element.load();
        this.elementSrc = this.state.src;
      }
    }
  }

  private bindElementEvents(): void {
    if (!this.element) return;
    const el = this.element;

    const on = <K extends keyof HTMLMediaElementEventMap>(
      event: K,
      handler: (e: HTMLMediaElementEventMap[K]) => void
    ) => {
      el.addEventListener(event, handler);
      this.cleanupFns.push(() => el.removeEventListener(event, handler));
    };

    on("loadedmetadata", () => {
      this.state.duration = el.duration;
      this.transition("ready");
      this.emit("ready", this.getState());
      this.emitState();
    });

    on("play", () => {
      this.transition("playing");
      this.emit("play", this.getState());
      this.emitState();
    });

    on("pause", () => {
      if (this.state.status !== "ended") {
        this.transition("paused");
        this.emit("pause", this.getState());
        this.emitState();
      }
    });

    on("ended", () => {
      this.transition("ended");
      this.emit("ended", this.getState());
      this.emitState();
    });

    on("timeupdate", () => {
      this.state.currentTime = el.currentTime;
      const buffered = el.buffered.length > 0 ? el.buffered.end(el.buffered.length - 1) : 0;
      this.state.buffered = buffered;
      this.emit("timeupdate", {
        currentTime: this.state.currentTime,
        buffered: this.state.buffered,
      });
      this.emitState();
    });

    on("volumechange", () => {
      this.state.volume = el.volume;
      this.state.muted = el.muted;
      this.emit("volumechange", { volume: el.volume, muted: el.muted });
    });

    on("ratechange", () => {
      this.state.playbackRate = el.playbackRate;
      this.emit("ratechange", { playbackRate: el.playbackRate });
    });

    on("waiting", () => {
      this.transition("loading");
      this.emitState();
    });

    on("canplay", () => {
      if (this.state.status === "loading") {
        // Restore correct state — if element is still playing after buffering, go back to "playing"
        this.transition(el.paused ? "ready" : "playing");
        this.emitState();
      }
    });

    on("error", () => {
      const mediaErr = el.error;
      this.handleError({
        code: mediaErr?.code ?? -1,
        message: mediaErr?.message ?? "Unknown media error",
      });
    });
  }
}
