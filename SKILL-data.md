# Skill: Wiring Data with @headless-media/wrappers

Use this skill when building any UI that fetches or plays media through the Headless Media SDK.

## Provider setup

Always wrap your app tree with **both** providers. `ApiProvider` owns the data client. `MediaProvider` owns a single video player instance — create one per player element, not one globally.

```tsx
import { ApiProvider, MediaProvider } from "@headless-media/wrappers";

// Root of app:
<ApiProvider>
  {/* one MediaProvider per video player */}
  <MediaProvider options={{ src: "/intro.mp4" }}>
    <YourPlayerUI />
  </MediaProvider>
</ApiProvider>
```

## Fetching photos

Use `useCurated` for the default feed, `useSearch` for keyword results. Both return the same shape so you can swap them.

```tsx
import { useCurated, useSearch } from "@headless-media/wrappers";

// Trending feed with infinite scroll:
const { photos, loading, hasMore, loadMore } = useCurated();

// Search:
const { query, setQuery, photos, loading, hasMore, loadMore } = useSearch();
// Updating `setQuery` triggers a debounced fetch automatically.
```

`MediaPhoto` shape:
```ts
{ id, author, width, height, url, src, srcSmall }
// src       — full-resolution image URL
// srcSmall  — thumbnail (~400px wide)
```

## Fetching videos

```tsx
import { useVideos } from "@headless-media/wrappers";
const { videos } = useVideos();
// MediaVideo: { id, title, src, poster, duration?, width, height }
```

## Controlling the video player

```tsx
import { useMediaPlayer } from "@headless-media/wrappers";

const { state, play, pause, seek, setVolume, setMuted, load, attachRef } = useMediaPlayer();
// state.status: "idle" | "loading" | "ready" | "playing" | "paused" | "ended" | "error"
// state.currentTime, duration, volume, muted, playbackRate, buffered, src

// Attach the player to a <video> element:
<video ref={attachRef as React.RefObject<HTMLVideoElement>} playsInline preload="auto" />

// Load a new src at runtime:
load("/new-video.mp4");
```

## Auth

Pass an API key when constructing `MediaProvider`, or update at runtime:

```tsx
<MediaProvider options={{ auth: { type: "bearer", token: "MY_TOKEN" } }}>
```

Or at runtime inside a child:
```tsx
const { setAuth } = useMediaPlayer();
setAuth({ type: "apiKey", token: "MY_KEY" });
// Appends ?api_key=MY_KEY to media src requests
```

## Events

Subscribe to SDK events for analytics. Events fire automatically for `view` and `download` — the default listener already logs them to console. Add your own:

```tsx
import { useApiClient } from "@headless-media/wrappers";
const client = useApiClient();
useEffect(() => {
  const unsub = client.on("view", (e) => analytics.track("view", e));
  return unsub; // cleanup on unmount
}, [client]);
```

Player events via `useMediaEvent`:
```tsx
import { useMediaEvent } from "@headless-media/wrappers";
useMediaEvent("ended", () => playNext());
useMediaEvent("error", (err) => reportError(err));
```

## Rules
- Never call `useMediaPlayer` or `useMediaEvent` outside a `<MediaProvider>`.
- Never call `useCurated`, `useSearch`, `useVideos`, or `useApiClient` outside `<ApiProvider>`.
- `ApiProvider` does NOT need `MediaProvider` around it — they are independent.
- Do not import from `@headless-media/core` in app code; use `@headless-media/wrappers` which re-exports all types.
