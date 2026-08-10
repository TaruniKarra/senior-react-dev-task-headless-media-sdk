import React, { useRef } from "react";
import { useMediaPlayer } from "@headless-media/wrappers";
import {
  usePlayButton,
  useProgressBar,
  useVolumeControl,
  usePlaybackRate,
  useMediaStatus,
} from "@headless-media/components";

function formatTime(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MediaPlayerUI() {
  const { state, play, pause, seek, setVolume, setMuted, setPlaybackRate, attachRef } =
    useMediaPlayer();

  const controls = { play, pause, seek, setVolume, setMuted, setPlaybackRate };

  const { isPlaying, isDisabled, getPlayButtonProps } = usePlayButton({ state, controls });
  const { progress, bufferedProgress, currentTime, duration, getProgressBarProps } =
    useProgressBar({ state, controls });
  const { volume, muted, getMuteButtonProps, getVolumeSliderProps, onVolumeChange } =
    useVolumeControl({ state, controls });
  const { playbackRate, availableRates, getRateButtonProps } = usePlaybackRate({
    state,
    controls,
  });
  const { isLoading, isError, isEnded, error } = useMediaStatus(state);

  const progressRef = useRef<HTMLDivElement>(null);
  const playButtonProps = getPlayButtonProps();
  const muteButtonProps = getMuteButtonProps();
  const progressBarProps = getProgressBarProps();

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl mx-auto"
      style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1030 100%)", border: "1px solid rgba(139,92,246,0.18)" }}
    >
      {/* Video */}
      <div className="relative bg-black aspect-video">
        <video
          ref={attachRef as React.RefObject<HTMLVideoElement>}
          className="w-full h-full object-contain"
          playsInline
          preload="auto"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute bottom-3 right-3">
            <div
              className="w-6 h-6 rounded-full animate-spin"
              style={{ border: "2px solid rgba(139,92,246,0.3)", borderTopColor: "#a78bfa" }}
            />
          </div>
        )}

        {/* Error overlay */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgba(15,12,26,0.85)" }}>
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-red-400 text-sm font-medium">{error?.message ?? "Playback error"}</p>
          </div>
        )}

        {/* Ended overlay */}
        {isEnded && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(15,12,26,0.7)" }}>
            <button
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
              onClick={() => { seek(0); play(); }}
            >
              ↺ Replay
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 pt-3 pb-4 space-y-3">

        {/* Progress bar */}
        <div
          ref={progressRef}
          role={progressBarProps.role}
          aria-label={progressBarProps["aria-label"]}
          aria-valuemin={progressBarProps["aria-valuemin"]}
          aria-valuemax={progressBarProps["aria-valuemax"]}
          aria-valuenow={progressBarProps["aria-valuenow"]}
          aria-valuetext={progressBarProps["aria-valuetext"]}
          tabIndex={progressBarProps.tabIndex}
          className="relative h-1.5 rounded-full cursor-pointer group"
          style={{ background: "rgba(255,255,255,0.08)" }}
          onMouseDown={(e) => {
            if (!progressRef.current) return;
            progressBarProps.onSeek(e.clientX, progressRef.current.getBoundingClientRect());
          }}
        >
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{ width: `${bufferedProgress * 100}%`, background: "rgba(167,139,250,0.25)" }}
          />
          {/* Played */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            style={{
              left: `calc(${progress * 100}% - 6px)`,
              background: "#a78bfa",
              boxShadow: "0 0 8px rgba(167,139,250,0.8)",
            }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">

          {/* Play / Pause */}
          <button
            {...playButtonProps}
            className="w-9 h-9 flex items-center justify-center rounded-full transition hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Time */}
          <span className="text-xs tabular-nums" style={{ color: "rgba(167,139,250,0.9)" }}>
            {formatTime(currentTime)}
            <span style={{ color: "rgba(255,255,255,0.25)" }}> / </span>
            {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              {...muteButtonProps}
              className="text-sm transition"
              style={{ color: "rgba(167,139,250,0.7)" }}
            >
              {muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </button>
            <input
              {...(getVolumeSliderProps() as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : Math.round(volume * 100)}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="w-20 cursor-pointer"
              style={{ accentColor: "#a78bfa" }}
            />
          </div>

          {/* Playback rate */}
          <div className="flex items-center gap-1">
            {availableRates.map((rate) => (
              <button
                key={rate}
                {...getRateButtonProps(rate)}
                className="text-xs px-2 py-0.5 rounded-full transition"
                style={
                  playbackRate === rate
                    ? { background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "#fff" }
                    : { color: "rgba(167,139,250,0.55)" }
                }
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
