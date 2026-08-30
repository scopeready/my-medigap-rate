import { ImageResponse } from "next/og";

export const alt = "MyMedigapRate — Medicare Supplement rate research, filing by filing.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a3557 0%, #0f4c81 60%, #14608f 100%)",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 56 }}>
            <div style={{ width: 16, height: 24, borderRadius: 4, background: "#8fb6d6" }} />
            <div style={{ width: 16, height: 40, borderRadius: 4, background: "#bcd6ea" }} />
            <div style={{ width: 16, height: 56, borderRadius: 4, background: "#ffffff" }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}>
            MyMedigapRate
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 66, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.03em", maxWidth: 940 }}>
            Medicare Supplement rate research, filing by filing.
          </div>
          <div style={{ fontSize: 28, color: "#bcd6ea", maxWidth: 880, lineHeight: 1.4 }}>
            What carriers filed with state regulators — cited, or not published.
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#8fb6d6" }}>mymedigaprate.com</div>
      </div>
    ),
    size,
  );
}
