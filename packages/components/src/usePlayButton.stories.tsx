import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { usePlayButton } from "./usePlayButton.js";
import type { ComponentMediaState, ComponentControls } from "./types.js";

function makeState(overrides: Partial<ComponentMediaState> = {}): ComponentMediaState {
  return {
    status: "paused",
    currentTime: 0,
    duration: 100,
    volume: 1,
    muted: false,
    playbackRate: 1,
    buffered: 0,
    error: null,
    src: "demo.mp4",
    ...overrides,
  };
}

function PlayButtonDemo({ initialStatus }: { initialStatus: ComponentMediaState["status"] }) {
  const [status, setStatus] = useState<ComponentMediaState["status"]>(initialStatus);
  const state = makeState({ status });

  const controls: ComponentControls = {
    play: () => setStatus("playing"),
    pause: () => setStatus("paused"),
    seek: () => {},
    setVolume: () => {},
    setMuted: () => {},
    setPlaybackRate: () => {},
  };

  const { isPlaying, isDisabled, getPlayButtonProps } = usePlayButton({ state, controls });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <button
        {...getPlayButtonProps()}
        style={{
          padding: "8px 20px",
          background: isDisabled ? "#555" : isPlaying ? "#e74c3c" : "#2980b9",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: isDisabled ? "not-allowed" : "pointer",
          fontSize: 14,
        }}
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
      <p style={{ color: "#aaa", fontSize: 12 }}>
        Status: <strong style={{ color: "#fff" }}>{status}</strong>
      </p>
    </div>
  );
}

const meta: Meta = {
  title: "Headless/usePlayButton",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Paused: Story = {
  render: () => <PlayButtonDemo initialStatus="paused" />,
};

export const Playing: Story = {
  render: () => <PlayButtonDemo initialStatus="playing" />,
};

export const Disabled: Story = {
  render: () => <PlayButtonDemo initialStatus="loading" />,
};
