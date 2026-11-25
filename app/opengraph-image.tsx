import { ImageResponse } from "next/og";

// Default 1200x630 share image for any page without its own og_image.
export const alt = "millionaireoutlet: luxury for less";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#F7F5F0",
          color: "#111111",
          borderBottom: "16px solid #B8924A",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: "#8A6A2F" }}>Luxury for less</div>
        <div style={{ fontSize: 96, marginTop: 24, fontFamily: "serif" }}>millionaireoutlet.</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#666666" }}>Curated deals and honest buying guides.</div>
      </div>
    ),
    size,
  );
}
