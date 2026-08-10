import React, { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useGrid } from "./useGrid.js";

const DEMO_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i + 1}`,
  label: `Photo ${i + 1}`,
  color: `hsl(${(i * 30) % 360}, 60%, 45%)`,
}));

function GridDemo({ totalItems = 12 }: { totalItems?: number }) {
  const [loaded, setLoaded] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const items = DEMO_ITEMS.slice(0, loaded);
  const hasMore = loaded < totalItems;

  const onLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLoaded((n) => Math.min(n + 6, totalItems));
      setIsLoading(false);
    }, 800);
  }, [totalItems]);

  const { sentinelRef, getGridProps, getItemProps, getLoadMoreProps } = useGrid({
    hasMore,
    isLoading,
    onLoadMore,
  });

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        {...getGridProps()}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            {...getItemProps(item.id)}
            style={{
              background: item.color,
              aspectRatio: "1",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Sentinel for auto infinite scroll */}
      <div ref={sentinelRef as React.RefObject<HTMLDivElement>} style={{ height: 1 }} />

      {/* Manual load-more button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          {...getLoadMoreProps()}
          style={{
            padding: "8px 24px",
            background: hasMore ? "#7c3aed" : "#444",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: hasMore && !isLoading ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Loading…" : hasMore ? "Load more" : "All loaded"}
        </button>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Headless/useGrid",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <GridDemo />,
};

export const AllLoaded: Story = {
  render: () => <GridDemo totalItems={6} />,
};

export const ManyItems: Story = {
  render: () => <GridDemo totalItems={30} />,
};
