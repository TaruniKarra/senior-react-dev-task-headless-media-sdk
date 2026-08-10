# Headless Media SDK

A framework-agnostic media SDK built as a pnpm monorepo. Strict layer separation: core logic has zero React or DOM dependencies; React wrappers own the lifecycle bridge; headless UI components own the prop-getter pattern; the demo app consumes all three.

## Live Deployment

| Target | Platform | URL |
|---|---|---|
| Demo app | Vercel | https://senior-react-dev-task-headless-medi-ochre.vercel.app |
| SDK docs (TypeDoc) | GitHub Pages | _link after deploy_ |
| Component docs (Storybook) | GitHub Pages | _link after deploy_ |

## Monorepo Structure

```
.
├── packages/
│   ├── core/          @headless-media/core        — Pure TypeScript SDK (no React, no DOM)
│   ├── wrappers/      @headless-media/wrappers    — React hooks + context wrapping core
│   ├── components/    @headless-media/components  — Headless UI primitives (web)
│   ├── native/        @headless-media/native      — React Native wrappers (same contract as wrappers)
│   └── ui-native/     @headless-media/ui-native   — Headless UI primitives (React Native)
├── apps/
│   └── app/           Demo application (Vite + React)
├── SKILL-data.md      AI coding skill: wiring data providers and hooks
├── SKILL-components.md AI coding skill: using headless UI components
├── typedoc.json       Multi-package TypeDoc config
└── vercel.json        Vercel deploy config
```

## Dependency Rules (strictly enforced)

```
app → wrappers → core
app → components
native → core          (same as wrappers, different platform)
ui-native              (no core/wrappers imports — same rule as components)

components  ✗  never imports core or wrappers
core        ✗  never imports React or any UI
wrappers    ✗  never imports components
```

---

## Packages

### `@headless-media/core`

Framework-agnostic TypeScript. Works in Node, a CLI, or React Native without changes.

**MediaPlayer** — drives an `HTMLMediaElement` (or runs headless). Full typed state machine:
`idle → loading → ready → playing → paused → ended → error`

**MediaApiClient** — Pexels-compatible REST client backed by free public APIs:
- Curated photo feed: [Picsum Photos](https://picsum.photos) (no key required)
- Keyword search: [Openverse API](https://api.openverse.org) (CC-licensed, no key required)
- In-memory cache + request dedup (`Map<url, Promise>`) for both
- `trackView()` / `trackDownload()` emit typed events (`ApiEventMap`)

**EventEmitter** — typed event bus (`on`, `off`, `emit`). Used by both `MediaPlayer` and `MediaApiClient`.

**Auth** — `buildAuthHeaders(config)` supports Bearer token and API-key strategies.

```ts
import { MediaPlayer, MediaApiClient } from '@headless-media/core';

const player = new MediaPlayer({ src: 'video.mp4' });
player.on('statechange', (state) => console.log(state.status));
player.attach(videoElement);
player.play();

const api = new MediaApiClient();
const page = await api.list(1, 20);     // curated photos
const results = await api.search('mountains'); // keyword search
```

---

### `@headless-media/wrappers`

React layer over core. Never import UI components here.

- `<ApiProvider>` — creates and owns a `MediaApiClient` instance via context
- `useApiClient()` — access the shared client anywhere in the tree
- `<MediaProvider>` — creates and owns a `MediaPlayer` instance
- `useMediaPlayer()` — full state + controls + `attachRef` for the video element
- `useMediaEvent(event, handler)` — subscribe to typed core events
- `useCurated(limit?)` — paginated curated feed with `loadMore`
- `useSearch(query, limit?)` — 400 ms debounced keyword search with pagination
- `useVideos()` — returns local demo video list

```tsx
import { ApiProvider, useCurated, useSearch } from '@headless-media/wrappers';

function Photos() {
  const { items, isLoading, hasMore, loadMore } = useCurated(20);
  // ...
}

export default () => (
  <ApiProvider>
    <Photos />
  </ApiProvider>
);
```

---

### `@headless-media/components`

Headless UI primitives — **prop-getter pattern**, zero styles, zero core/wrappers imports.

| Hook | Returns |
|---|---|
| `usePlayButton` | `getPlayButtonProps()`, `isPlaying`, `isDisabled` |
| `useProgressBar` | `getProgressBarProps(ref)`, `progress`, `bufferedProgress` |
| `useVolumeControl` | `getMuteButtonProps()`, `getVolumeSliderProps()` |
| `usePlaybackRate` | `getRateButtonProps(rate)`, `availableRates` |
| `useMediaStatus` | `isPlaying`, `isLoading`, `isError`, … |
| `useGrid` | `sentinelRef`, `getGridProps()`, `getItemProps(id)`, `getLoadMoreProps()` — IntersectionObserver infinite scroll |
| `useLightbox` | `getOverlayProps()`, `getCloseProps()`, `getPrevProps()`, `getNextProps()`, `getImageProps()` — keyboard nav, body scroll lock, ARIA dialog |
| `useReelSwiper` | `getContainerProps()`, `getItemProps(i)`, `isActive(i)`, `goTo(i)` — IntersectionObserver active detection |

```tsx
import { useGrid, useLightbox, useReelSwiper } from '@headless-media/components';

// caller owns all markup and CSS
const { sentinelRef, getGridProps, getItemProps } = useGrid({ hasMore, isLoading, onLoadMore });

<div {...getGridProps()} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
  {items.map(item => <div key={item.id} {...getItemProps(item.id)} />)}
</div>
<div ref={sentinelRef} />   {/* triggers onLoadMore automatically */}
```

---

### `@headless-media/native`

React Native mirror of `@headless-media/wrappers`. Swap the import path — the rest of your screen code stays the same.

Requires: `react-native >=0.73`, `react-native-video >=6.0`

```ts
import { ApiProvider, MediaProvider, useMediaPlayer, useCurated } from '@headless-media/native';
```

---

### `@headless-media/ui-native`

React Native mirror of `@headless-media/components`. Uses `FlatList`, `Modal`, and native scroll instead of DOM APIs.

| Hook | Native equivalent |
|---|---|
| `useGrid` | `FlatList` `onEndReached` |
| `useLightbox` | `Modal` + `onRequestClose` (Android back button) |
| `useReelSwiper` | `FlatList` `pagingEnabled` + `viewabilityConfig` |

```ts
import { useGrid, useLightbox, useReelSwiper } from '@headless-media/ui-native';
```

---

## Demo App Features

- **Photos tab**: curated photo grid (Picsum), keyword search (Openverse), lightbox viewer
- **Videos tab**: vertical reel swiper with three cinematic MP4s (Sintel, Oceans, Jellyfish)
- Full playback controls built from headless hooks (play/pause, progress bar, volume, rate)
- Auth configuration panel (No Auth / Bearer Token / API Key)
- Loading / error / ended overlay states
- Dark purple cinema theme

---

## Getting Started

```bash
pnpm install
pnpm dev          # starts demo app at http://localhost:5173
```

### Build all packages

```bash
pnpm build        # core → wrappers → components → app (in dependency order)
```

### Docs

```bash
pnpm build:docs:sdk          # TypeDoc → docs/sdk/
pnpm build:docs:components   # Storybook build → docs/components/
```

### Storybook (development)

```bash
cd packages/components
pnpm storybook    # opens at http://localhost:6007
```

---

## AI Assistance Notes

### AI-assisted (Claude)

- Monorepo scaffold: `pnpm-workspace.yaml`, `tsconfig.base.json`, package skeletons
- `EventEmitter` class structure and `MediaPlayer.bindElementEvents()` approach
- `MediaApiClient` with Picsum/Openverse integration, cache, and event emission
- `useGrid` / `useLightbox` / `useReelSwiper` hook implementations
- React Native scaffold packages (`native`, `ui-native`) with matching contracts
- Storybook stories for all headless hooks
- SKILL-data.md and SKILL-components.md AI coding tool documents

### Hand-written / key decisions

- **`ComponentMediaState` boundary**: using a local interface in `components` (not re-exporting from `core`) to enforce the `components ✗ core` rule
- **`attach/detach` pattern**: decided the React wrapper calls `attach()` via a ref effect, keeping core portable; AI initially suggested passing the element to the constructor
- **`elementSrc` tracking**: the fix for React 18 StrictMode double-mount resetting video playback — tracking which `src` is already loaded prevents redundant `element.load()` calls
- **`emitState()` in timeupdate**: the root cause of the frozen progress bar; AI identified and fixed after diagnosis
- **API selection**: Picsum (curated) + Openverse (real keyword search) instead of Pexels (requires paid key)
- **App theme and layout**: dark purple cinema style, tab layout, all hand-styled

### SKILL docs usage

`SKILL-data.md` documents how an AI coding tool should wire providers, hooks, auth, and event listeners. `SKILL-components.md` documents how to use the prop-getter pattern correctly. Both were used to drive implementation decisions and verify the boundary rules.

---

## What was cut (and why)

| Cut | Reason |
|---|---|
| HLS / DASH (hls.js / dash.js) | Additive to the attach/detach pattern; large dep not needed for architecture demo |
| Unit tests | Would use Vitest + `@testing-library/react`; cut for time |
| Keyboard shortcuts (space = play) | Non-essential for SDK architecture |
| Fullscreen API hook | Straightforward but out of scope |
| React Native runtime setup | Native packages are scaffold-complete; running them requires a full RN + Metro setup |
