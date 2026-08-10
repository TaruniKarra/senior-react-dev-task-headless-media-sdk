import type { MediaEventKey, MediaEventMap, MediaEventHandler } from "./types.js";

type Listeners = {
  [K in MediaEventKey]?: Set<MediaEventHandler<K>>;
};

export class EventEmitter {
  private listeners: Listeners = {};

  on<K extends MediaEventKey>(event: K, handler: MediaEventHandler<K>): () => void {
    if (!this.listeners[event]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.listeners as any)[event] = new Set<MediaEventHandler<K>>();
    }
    (this.listeners[event] as Set<MediaEventHandler<K>>).add(handler);
    return () => this.off(event, handler);
  }

  off<K extends MediaEventKey>(event: K, handler: MediaEventHandler<K>): void {
    (this.listeners[event] as Set<MediaEventHandler<K>> | undefined)?.delete(handler);
  }

  emit<K extends MediaEventKey>(event: K, payload: MediaEventMap[K]): void {
    (this.listeners[event] as Set<MediaEventHandler<K>> | undefined)?.forEach((h) =>
      h(payload)
    );
  }

  removeAllListeners(): void {
    this.listeners = {};
  }
}
