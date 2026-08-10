import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useLightbox } from "./useLightbox.js";
import type { LightboxItem } from "./useLightbox.js";

const PHOTOS: LightboxItem[] = [
  { id: "1", src: "https://picsum.photos/seed/a/800/600", alt: "Mountain landscape" },
  { id: "2", src: "https://picsum.photos/seed/b/800/600", alt: "Ocean waves" },
  { id: "3", src: "https://picsum.photos/seed/c/800/600", alt: "Forest path" },
  { id: "4", src: "https://picsum.photos/seed/d/800/600", alt: "City lights" },
  { id: "5", src: "https://picsum.photos/seed/e/800/600", alt: "Desert dunes" },
];

function LightboxDemo({ initialIndex = 0 }: { initialIndex?: number }) {
  const [open, setOpen] = useState(true);

  const {
    currentIndex,
    currentItem,
    canPrev,
    canNext,
    getOverlayProps,
    getCloseProps,
    getPrevProps,
    getNextProps,
    getImageProps,
  } = useLightbox({ items: PHOTOS, initialIndex, onClose: () => setOpen(false) });

  if (!open) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <p style={{ color: "#aaa" }}>Lightbox closed</p>
        <button
          onClick={() => setOpen(true)}
          style={{ marginTop: 12, padding: "8px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Reopen
        </button>
      </div>
    );
  }

  return (
    <div
      {...getOverlayProps()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Close */}
      <button
        {...getCloseProps()}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* Counter */}
      <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: 13 }}>
        {currentIndex + 1} / {PHOTOS.length}
      </div>

      {/* Prev */}
      <button
        {...getPrevProps()}
        style={{
          position: "absolute",
          left: 16,
          background: canPrev ? "rgba(255,255,255,0.15)" : "transparent",
          color: canPrev ? "#fff" : "#555",
          border: "none",
          borderRadius: 6,
          padding: "12px 16px",
          fontSize: 20,
          cursor: canPrev ? "pointer" : "not-allowed",
        }}
      >
        ‹
      </button>

      {/* Image */}
      <img
        {...getImageProps()}
        style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }}
      />

      {/* Next */}
      <button
        {...getNextProps()}
        style={{
          position: "absolute",
          right: 16,
          background: canNext ? "rgba(255,255,255,0.15)" : "transparent",
          color: canNext ? "#fff" : "#555",
          border: "none",
          borderRadius: 6,
          padding: "12px 16px",
          fontSize: 20,
          cursor: canNext ? "pointer" : "not-allowed",
        }}
      >
        ›
      </button>

      {/* Caption */}
      {currentItem?.alt && (
        <div style={{ position: "absolute", bottom: 20, color: "#ccc", fontSize: 13 }}>
          {currentItem.alt}
        </div>
      )}
    </div>
  );
}

const meta: Meta = {
  title: "Headless/useLightbox",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <LightboxDemo />,
};

export const OpenAtThird: Story = {
  render: () => <LightboxDemo initialIndex={2} />,
};

export const LastItem: Story = {
  render: () => <LightboxDemo initialIndex={4} />,
};
