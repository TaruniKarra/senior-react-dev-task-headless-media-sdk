import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useReelSwiper } from "./useReelSwiper.js";

interface ReelItem {
  id: string;
  label: string;
  color: string;
  emoji: string;
}

const ITEMS: ReelItem[] = [
  { id: "1", label: "Sunset over mountains", color: "#7c3aed", emoji: "🌄" },
  { id: "2", label: "Ocean waves crashing", color: "#0f766e", emoji: "🌊" },
  { id: "3", label: "City at night", color: "#1e40af", emoji: "🌆" },
  { id: "4", label: "Forest morning", color: "#166534", emoji: "🌲" },
  { id: "5", label: "Desert sands", color: "#92400e", emoji: "🏜️" },
];

function ReelSwiperDemo() {
  const { activeIndex, getContainerProps, getItemProps, isActive, goTo } = useReelSwiper({
    items: ITEMS,
    onActiveChange: (index, item) => console.log("Active:", index, item.label),
  });

  return (
    <div style={{ display: "flex", gap: 24, height: 480, fontFamily: "sans-serif" }}>
      {/* Reel container — caller owns scroll-snap CSS */}
      <div
        {...getContainerProps()}
        ref={getContainerProps().ref as React.RefObject<HTMLDivElement>}
        style={{
          width: 300,
          height: 480,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          borderRadius: 12,
          border: "2px solid #333",
        }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            {...getItemProps(i)}
            style={{
              height: 480,
              scrollSnapAlign: "start",
              background: isActive(i) ? item.color : `${item.color}88`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 48,
              gap: 12,
              transition: "background 0.3s",
            }}
          >
            <span>{item.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
            {isActive(i) && (
              <span style={{ fontSize: 11, opacity: 0.8, background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 20 }}>
                ACTIVE
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Sidebar controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>Active: {activeIndex + 1} / {ITEMS.length}</p>
        {ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => goTo(i)}
            style={{
              padding: "6px 14px",
              background: isActive(i) ? item.color : "#222",
              color: "#fff",
              border: `1px solid ${isActive(i) ? item.color : "#444"}`,
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              textAlign: "left",
            }}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Headless/useReelSwiper",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <ReelSwiperDemo />,
};
