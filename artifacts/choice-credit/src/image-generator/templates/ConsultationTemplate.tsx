import type { TemplateProps } from "./index";

/**
 * Consultation CTA Template — "Action" layout
 * Centered composition, prominent FREE badge, strong call-to-action feel.
 */
export default function ConsultationTemplate({
  headline,
  subtext,
  bullets,
  accentColor,
  badge,
  width,
  height,
}: TemplateProps & { width: number; height: number }) {
  const pad = Math.round(width * 0.07);
  const isLandscape = width > height;

  return (
    <div
      style={{
        width,
        height,
        background: `radial-gradient(ellipse at 50% 0%, #1e3060 0%, #0b1630 65%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: pad,
        boxSizing: "border-box",
        fontFamily: 'Georgia, "Times New Roman", serif',
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Corner accent lines */}
      <div style={{ position: "absolute", top: 0, left: 0, width: Math.round(width * 0.18), height: Math.round(width * 0.18) }}>
        <div style={{ position: "absolute", top: Math.round(width * 0.04), left: Math.round(width * 0.04), width: Math.round(width * 0.06), height: 2, background: accentColor }} />
        <div style={{ position: "absolute", top: Math.round(width * 0.04), left: Math.round(width * 0.04), width: 2, height: Math.round(width * 0.06), background: accentColor }} />
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, width: Math.round(width * 0.18), height: Math.round(width * 0.18) }}>
        <div style={{ position: "absolute", top: Math.round(width * 0.04), right: Math.round(width * 0.04), width: Math.round(width * 0.06), height: 2, background: accentColor }} />
        <div style={{ position: "absolute", top: Math.round(width * 0.04), right: Math.round(width * 0.04), width: 2, height: Math.round(width * 0.06), background: accentColor }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: Math.round(width * 0.18), height: Math.round(width * 0.18) }}>
        <div style={{ position: "absolute", bottom: Math.round(width * 0.04), left: Math.round(width * 0.04), width: Math.round(width * 0.06), height: 2, background: accentColor }} />
        <div style={{ position: "absolute", bottom: Math.round(width * 0.04), left: Math.round(width * 0.04), width: 2, height: Math.round(width * 0.06), background: accentColor }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: Math.round(width * 0.18), height: Math.round(width * 0.18) }}>
        <div style={{ position: "absolute", bottom: Math.round(width * 0.04), right: Math.round(width * 0.04), width: Math.round(width * 0.06), height: 2, background: accentColor }} />
        <div style={{ position: "absolute", bottom: Math.round(width * 0.04), right: Math.round(width * 0.04), width: 2, height: Math.round(width * 0.06), background: accentColor }} />
      </div>

      {/* FREE badge */}
      <div
        style={{
          width: isLandscape ? Math.round(height * 0.28) : Math.round(width * 0.28),
          height: isLandscape ? Math.round(height * 0.28) : Math.round(width * 0.28),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}CC 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: Math.round(height * 0.04),
          boxShadow: `0 0 ${Math.round(width * 0.06)}px ${accentColor}55`,
        }}
      >
        <div
          style={{
            fontSize: isLandscape ? Math.round(height * 0.1) : Math.round(width * 0.1),
            fontWeight: 900,
            color: "#0b1630",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {badge || "FREE"}
        </div>
        <div
          style={{
            fontSize: isLandscape ? Math.round(height * 0.036) : Math.round(width * 0.036),
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            color: "rgba(0,0,0,0.55)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Consultation
        </div>
      </div>

      <div
        style={{
          fontSize: isLandscape ? Math.round(width * 0.05) : Math.round(width * 0.075),
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          whiteSpace: "pre-line",
          marginBottom: Math.round(height * 0.025),
          maxWidth: "85%",
        }}
      >
        {headline}
      </div>

      <div
        style={{
          fontSize: Math.round(width * 0.024),
          color: "rgba(255,255,255,0.6)",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
          marginBottom: bullets.length > 0 ? Math.round(height * 0.035) : 0,
          maxWidth: "75%",
        }}
      >
        {subtext}
      </div>

      {bullets.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: isLandscape ? "row" : "column",
            gap: Math.round(width * 0.016),
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: Math.round(height * 0.03),
          }}
        >
          {bullets.map((b, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: Math.round(width * 0.004),
                padding: `${Math.round(width * 0.01)}px ${Math.round(width * 0.022)}px`,
                fontSize: Math.round(width * 0.02),
                color: "rgba(255,255,255,0.8)",
                fontFamily: "system-ui, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: Math.round(width * 0.01),
              }}
            >
              <span style={{ color: accentColor }}>✓</span> {b}
            </div>
          ))}
        </div>
      )}

      {/* Website */}
      <div
        style={{
          position: "absolute",
          bottom: Math.round(pad * 0.65),
          fontSize: Math.round(width * 0.018),
          fontFamily: "system-ui, sans-serif",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.04em",
        }}
      >
        choicecreditandrentalsolutions.com
      </div>
    </div>
  );
}
