# Skill: Using @headless-media/components

Use this skill when building any UI element that wraps media player controls, a photo grid, a lightbox, or a video reel. These hooks return prop-getter functions — you apply them to your own HTML elements. No styles are shipped.

## Core pattern: prop-getters

Every hook returns one or more `getXxxProps()` functions. Call the function, spread the result onto your element, then add your own className/style:

```tsx
const { getPlayButtonProps, isPlaying } = usePlayButton({ state, controls });
// ✓ correct:
<button {...getPlayButtonProps()} className="my-button">
  {isPlaying ? "Pause" : "Play"}
</button>
// ✗ wrong — don't pass style here, the hook doesn't set it:
<button {...getPlayButtonProps()} style={{ color: "red" }} />
```

## Player controls

All player hooks take `{ state, controls }`. Get both from `useMediaPlayer()`:

```tsx
const { state, play, pause, seek, setVolume, setMuted, setPlaybackRate } = useMediaPlayer();
const controls = { play, pause, seek, setVolume, setMuted, setPlaybackRate };
```

### Play button
```tsx
const { isPlaying, isDisabled, getPlayButtonProps } = usePlayButton({ state, controls });
<button {...getPlayButtonProps()} disabled={isDisabled}>
  {isPlaying ? "⏸" : "▶"}
</button>
```
`isPlaying` is true during both "playing" AND "loading" (buffering). `isDisabled` is true only for "idle" and "error".

### Progress bar (seekable)
```tsx
const { progress, bufferedProgress, currentTime, duration, getProgressBarProps } =
  useProgressBar({ state, controls });

const ref = useRef<HTMLDivElement>(null);
const barProps = getProgressBarProps();

<div
  {...barProps}
  ref={ref}
  onMouseDown={(e) => barProps.onSeek(e.clientX, ref.current!.getBoundingClientRect())}
>
  <div style={{ width: `${bufferedProgress * 100}%` }} />  {/* buffered */}
  <div style={{ width: `${progress * 100}%` }} />           {/* played */}
</div>
```
`onSeek` takes raw `clientX` + `DOMRect` — not a React MouseEvent — so it's framework-agnostic.

### Volume
```tsx
const { volume, muted, getMuteButtonProps, getVolumeSliderProps, onVolumeChange } =
  useVolumeControl({ state, controls });

<button {...getMuteButtonProps()}>{muted ? "🔇" : "🔊"}</button>
<input
  type="range" min={0} max={100}
  value={muted ? 0 : Math.round(volume * 100)}
  onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
/>
```

### Status
```tsx
const { isLoading, isError, isEnded, error } = useMediaStatus(state);
```

## Photo Grid (infinite scroll)

```tsx
import { useGrid } from "@headless-media/components";

const { sentinelRef, getGridProps, getItemProps } = useGrid({
  hasMore,
  isLoading: loading,
  onLoadMore,
});

<div {...getGridProps()} className="grid grid-cols-3 gap-2">
  {photos.map((p) => (
    <div key={p.id} {...getItemProps(p.id)} onClick={() => openLightbox(p)}>
      <img src={p.srcSmall} alt={p.author} />
    </div>
  ))}
</div>
{/* Attach sentinel to trigger auto load-more via IntersectionObserver */}
<div ref={sentinelRef} />
```

## Lightbox (keyboard + ARIA)

```tsx
import { useLightbox } from "@headless-media/components";

const items = photos.map(p => ({ id: p.id, src: p.src, alt: p.author, type: "photo" }));

const {
  currentItem, currentIndex, canPrev, canNext,
  getOverlayProps, getCloseProps, getPrevProps, getNextProps, getImageProps,
} = useLightbox({ items, initialIndex, onClose });

{isOpen && (
  <div {...getOverlayProps()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)" }}>
    <button {...getCloseProps()}>✕</button>
    {canPrev && <button {...getPrevProps()}>←</button>}
    <img {...getImageProps()} style={{ maxHeight: "80vh" }} />
    {canNext && <button {...getNextProps()}>→</button>}
  </div>
)}
```
Arrow keys (←/→) and Escape work automatically. Body scroll locks while open.

## Reel Swiper (vertical snap)

```tsx
import { useReelSwiper } from "@headless-media/components";

const { activeIndex, isActive, getContainerProps, getItemProps } = useReelSwiper({
  items: videos,
  onActiveChange: (i, video) => console.log("active:", video.title),
});

const containerProps = getContainerProps();

<div
  {...containerProps}
  ref={containerProps.ref}
  style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}
>
  {videos.map((v, i) => (
    <div
      key={v.id}
      {...getItemProps(i)}
      style={{ height: "100vh", scrollSnapAlign: "start" }}
    >
      {isActive(i) && <video src={v.src} autoPlay />}
    </div>
  ))}
</div>
```
Active item is detected via IntersectionObserver — no manual scroll math needed.

## A11y contract
- Prop-getters set `role`, `aria-*`, and `tabIndex`. Do not override these.
- You MAY add `className`, `style`, `onClick` (alongside the getter's onClick), `ref`.
- Lightbox overlay gets `role="dialog"` + `aria-modal`. Ensure focus moves into it on open.

## Rules
- `@headless-media/components` has ZERO imports from `@headless-media/core` or `@headless-media/wrappers`.
- All hooks accept plain data + callback props — they don't fetch or own state.
- Never import styles from this package — there are none.
- You own 100% of the markup and visual design.
