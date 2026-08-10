import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useVolumeControl } from "./useVolumeControl.js";
import type { ComponentMediaState, ComponentControls } from "./types.js";

function VolumeDemo() {
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  const state: ComponentMediaState = {
    status: "playing",
    currentTime: 0,
    duration: 100,
    volume,
    muted,
    playbackRate: 1,
    buffered: 0,
    error: null,
    src: "demo.mp4",
  };

  const controls: ComponentControls = {
    play: () => {},
    pause: () => {},
    seek: () => {},
    setVolume: (v) => setVolume(v),
    setMuted: (m) => setMuted(m),
    setPlaybackRate: () => {},
  };

  const { getMuteButtonProps, getVolumeSliderProps, onVolumeChange } =
    useVolumeControl({ state, controls });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20 }}>
      <button
        {...getMuteButtonProps()}
        style={{
          background: "none",
          border: "1px solid #555",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: 4,
          cursor: "pointer",
        }}
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
        style={{ width: 120, accentColor: "#3498db" }}
      />
      <span style={{ color: "#aaa", fontSize: 12 }}>
        {muted ? "Muted" : `${Math.round(volume * 100)}%`}
      </span>
    </div>
  );
}

const meta: Meta = {
  title: "Headless/useVolumeControl",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <VolumeDemo />,
};
