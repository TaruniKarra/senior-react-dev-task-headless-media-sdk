import React, { useEffect, useRef } from "react";
import type { MediaVideo } from "@headless-media/wrappers";
import { MediaProvider, useMediaPlayer } from "@headless-media/wrappers";
import { useReelSwiper, usePlayButton, useProgressBar, useMediaStatus } from "@headless-media/components";

interface VideoReelsProps {
  videos: MediaVideo[];
}

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function ReelItem({
  video,
  isActive,
  itemProps,
}: {
  video: MediaVideo;
  isActive: boolean;
  itemProps: ReturnType<ReturnType<typeof useReelSwiper>["getItemProps"]>;
}) {
  const { state, play, pause, seek, setVolume, setMuted, load, setPlaybackRate, attachRef } =
    useMediaPlayer();

  const controls = { play, pause, seek, setVolume, setMuted, setPlaybackRate };
  const { isPlaying, getPlayButtonProps } = usePlayButton({ state, controls });
  const { progress, currentTime, duration, getProgressBarProps } = useProgressBar({ state, controls });
  const { isLoading } = useMediaStatus(state);

  const progressRef = useRef<HTMLDivElement>(null);
  const playButtonProps = getPlayButtonProps();
  const progressBarProps = getProgressBarProps();

  // Load / auto-play when this reel becomes active
  useEffect(() => {
    if (isActive) {
      load(video.src);
    } else {
      pause();
    }
  }, [isActive, video.src, load, pause]);

  return (
    <div
      {...itemProps}
      className="relative flex-shrink-0 w-full flex items-center justify-center bg-black"
      style={{ height: "100vh", scrollSnapAlign: "start" }}
    >
      {/* Video */}
      <video
        ref={attachRef as React.RefObject<HTMLVideoElement>}
        className="w-full h-full object-contain"
        playsInline
        preload={isActive ? "auto" : "none"}
        poster={video.poster}
      />

      {/* Loading */}
      {isLoading && isActive && (
        <div className="absolute bottom-20 right-4">
          <div
            className="w-5 h-5 rounded-full animate-spin"
            style={{ border: "2px solid rgba(167,139,250,0.3)", borderTopColor: "#a78bfa" }}
          />
        </div>
      )}

      {/* Overlay controls */}
      <div className="absolute bottom-0 left-0 right-0 p-5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
        <p className="text-sm font-semibold mb-2 truncate">{video.title}</p>

        {/* Progress */}
        <div
          ref={progressRef}
          role={progressBarProps.role}
          aria-label={progressBarProps["aria-label"]}
          aria-valuemin={progressBarProps["aria-valuemin"]}
          aria-valuemax={progressBarProps["aria-valuemax"]}
          aria-valuenow={progressBarProps["aria-valuenow"]}
          aria-valuetext={progressBarProps["aria-valuetext"]}
          tabIndex={progressBarProps.tabIndex}
          className="relative h-1 rounded-full mb-3 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.15)" }}
          onMouseDown={(e) => {
            if (!progressRef.current) return;
            progressBarProps.onSeek(e.clientX, progressRef.current.getBoundingClientRect());
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            {...playButtonProps}
            className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.6)" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function VideoReels({ videos }: VideoReelsProps) {
  const { activeIndex, getContainerProps, getItemProps, isActive } = useReelSwiper({
    items: videos,
    onActiveChange: (i, v) => console.log("[media-sdk] view", { id: v.id, type: "video", src: v.src }),
  });

  const containerProps = getContainerProps();

  return (
    <div
      {...containerProps}
      ref={containerProps.ref as React.RefObject<HTMLDivElement>}
      className="w-full"
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        marginTop: "-1.5rem",
      }}
    >
      {videos.map((video, i) => (
        <MediaProvider key={video.id} options={{ src: undefined }}>
          <ReelItem
            video={video}
            isActive={isActive(i)}
            itemProps={getItemProps(i)}
          />
        </MediaProvider>
      ))}
      {videos.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p style={{ color: "rgba(167,139,250,0.4)" }}>No videos available</p>
        </div>
      )}
    </div>
  );
}
