import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Native Works — Better product decisions. Made by humans.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: logo wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Symbol — N rotated square */}
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#0a0a0a",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              N
            </div>
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Native Works
          </div>
        </div>

        {/* Center: main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: "900px",
            }}
          >
            Better product decisions. Made by humans.
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "22px",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            A curated group of product specialists. From concept to production-ready output.
          </div>
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "16px",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          nativeworks.eu
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
