import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useProgressBar } from "./useProgressBar.js";
import type { ComponentMediaState, ComponentControls } from "./types.js";

function ProgressBarDemo() {
  const [currentTime, setCurrentTime] = useState(30);
  const duration = 120;
  const buffered = 80;

  const state: ComponentMediaState = {
    status: "playing",
    currentTime,
    duration,
    volume: 1,
    muted: false,
    playbackRate: 1,
    buffered,
    error: null,
    src: "demo.mp4",
  };

  const controls: ComponentControls = {
    play: () => {},
    pause: () => {},
    seek: (t) => setCurrentTime(t),
    setVolume: () => {},
    setMuted: () => {},
    setPlaybackRate: () => {},
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, bufferedProgress, getProgressBarProps } = useProgressBar({ state, controls });
  const barProps = getProgressBarProps();

  return (
    <div style={{ width: 400, padding: 20 }}>
      <div
        ref={containerRef}
        role={barProps.role}
        aria-label={barProps["aria-label"]}
        aria-valuemin={barProps["aria-valuemin"]}
        aria-valuemax={barProps["aria-valuemax"]}
        aria-valuenow={barProps["aria-valuenow"]}
        tabIndex={barProps.tabIndex}
        onMouseDown={(e) => {
          if (!containerRef.current) return;
          barProps.onSeek(e.clientX, containerRef.current.getBoundingClientRect());
        }}
        style={{ position: "relative", height: 8, background: "#333", borderRadius: 4, cursor: "pointer" }}
      >
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${bufferedProgress * 100}%`, background: "#555", borderRadius: 4 }} />
        <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${progress * 100}%`, background: "#3498db", borderRadius: 4 }} />
      </div>
      <p style={{ color: "#aaa", fontSize: 12, marginTop: 8 }}>
        {Math.floor(currentTime)}s / {duration}s — click to seek
      </p>
    </div>
  );
}

const meta: Meta = {
  title: "Headless/useProgressBar",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <ProgressBarDemo />,
};
