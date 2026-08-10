import type { MediaPhoto, MediaVideo, MediaPage, ApiEventMap } from "./types.js";

// ---------- Data sources (both free, no API key required) ----------
// Curated feed  → Picsum Photos  (picsum.photos)        — real editorial photography
// Keyword search → Openverse API  (api.openverse.org)   — real CC-licensed photos by topic
// Videos        → local public-domain files

const PICSUM = "https://picsum.photos";
const OPENVERSE = "https://api.openverse.org/v1/images";

// ---------- Picsum shape ----------

interface PicsumItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

function fromPicsum(p: PicsumItem): MediaPhoto {
  const thumbH = Math.round((400 * p.height) / p.width);
  return {
    id: `picsum-${p.id}`,
    author: p.author,
    width: p.width,
    height: p.height,
    url: p.url,
    src: p.download_url,
    srcSmall: `${PICSUM}/id/${p.id}/400/${thumbH}`,
  };
}

// ---------- Openverse shape ----------

interface OVResult {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  creator: string;
  width: number;
  height: number;
  license_url: string;
}

interface OVPage {
  result_count: number;
  page_count: number;
  results: OVResult[];
}

function fromOpenverse(r: OVResult): MediaPhoto {
  return {
    id: `ov-${r.id}`,
    author: r.creator || "Unknown",
    width: r.width || 800,
    height: r.height || 600,
    url: r.license_url || "#",
    src: r.url,
    srcSmall: r.thumbnail || r.url,
  };
}

// ---------- Simple typed emitter ----------

type Listener<T> = (payload: T) => void;

class ApiEmitter {
  private listeners: Partial<{ [K in keyof ApiEventMap]: Set<Listener<ApiEventMap[K]>> }> = {};

  on<K extends keyof ApiEventMap>(event: K, handler: Listener<ApiEventMap[K]>): () => void {
    if (!this.listeners[event]) {
      (this.listeners as Record<string, Set<Listener<unknown>>>)[event as string] = new Set();
    }
    (this.listeners[event] as Set<Listener<ApiEventMap[K]>>).add(handler);
    return () => (this.listeners[event] as Set<Listener<ApiEventMap[K]>>)?.delete(handler);
  }

  emit<K extends keyof ApiEventMap>(event: K, payload: ApiEventMap[K]): void {
    (this.listeners[event] as Set<Listener<ApiEventMap[K]>> | undefined)?.forEach(h => h(payload));
  }
}

// ---------- Curated video catalog ----------

export const CURATED_VIDEOS: MediaVideo[] = [
  { id: "v1", title: "Sintel — Blender Open Film", src: "/sintel2.mp4", poster: `${PICSUM}/id/1/800/450`, width: 1920, height: 1080, duration: 52 },
  { id: "v2", title: "Oceans", src: "/oceans.mp4", poster: `${PICSUM}/id/15/800/450`, width: 1920, height: 1080 },
  { id: "v3", title: "Jellyfish", src: "/jellyfish.mp4", poster: `${PICSUM}/id/22/800/450`, width: 1920, height: 1080, duration: 10 },
];

// ---------- MediaApiClient ----------

export class MediaApiClient extends ApiEmitter {
  private cache = new Map<string, unknown>();
  private pending = new Map<string, Promise<unknown>>();

  constructor() {
    super();
    this.on("view", (e) => console.log("[media-sdk] view", e));
    this.on("download", (e) => console.log("[media-sdk] download", e));
  }

  private async get<T>(url: string): Promise<T> {
    if (this.cache.has(url)) return this.cache.get(url) as T;
    if (this.pending.has(url)) return this.pending.get(url) as Promise<T>;

    const p = fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json() as Promise<T>;
      })
      .then(data => { this.cache.set(url, data); this.pending.delete(url); return data; })
      .catch((err: unknown) => { this.pending.delete(url); throw err; });

    this.pending.set(url, p);
    return p;
  }

  /** Curated / trending — beautiful Picsum editorial photos, paginated. */
  async list(page = 1, limit = 20): Promise<MediaPage<MediaPhoto>> {
    const url = `${PICSUM}/v2/list?page=${page}&limit=${limit}`;
    const raw = await this.get<PicsumItem[]>(url);
    return { items: raw.map(fromPicsum), page, perPage: limit, hasMore: raw.length === limit };
  }

  /**
   * Real keyword search via Openverse (Creative Commons images, no API key).
   * Try: "dogs", "flowers", "mountains", "ocean", "cats", "city", "food", "sunset"
   */
  async search(query: string, page = 1, limit = 20): Promise<MediaPage<MediaPhoto>> {
    const q = encodeURIComponent(query.trim());
    const url = `${OPENVERSE}/?q=${q}&page=${page}&page_size=${limit}`;
    const raw = await this.get<OVPage>(url);
    return {
      items: raw.results.map(fromOpenverse),
      page,
      perPage: limit,
      hasMore: page < raw.page_count,
    };
  }

  async getPhoto(id: string): Promise<MediaPhoto> {
    // Strip prefix to get the raw Openverse/Picsum id
    const rawId = id.replace(/^(ov-|picsum-)/, "");
    const url = `${OPENVERSE}/${rawId}/`;
    const raw = await this.get<OVResult>(url);
    return fromOpenverse(raw);
  }

  getVideos(): MediaVideo[] {
    return CURATED_VIDEOS;
  }

  trackView(id: string, type: "photo" | "video", url: string): void {
    this.emit("view", { id, type, url });
  }

  trackDownload(id: string, type: "photo" | "video", url: string): void {
    this.emit("download", { id, type, url });
  }

  clearCache(): void {
    this.cache.clear();
  }
}
