import type { TemplateProps } from "./index";

/**
 * Eviction Recovery Template — "Bold Statement" layout
 * Full-bleed dark background, oversized decorative text, bold headline layered on top.
 */
export default function EvictionRecoveryTemplate({
  headline,
  subtext,
  bullets,
  accentColor,
  badge,
  width,
  height,
}: TemplateProps & { width: number; height: number }) {
  const pad = Math.round(width * 0.07);

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(160deg, #0e1e40 0%, #091426 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: pad,
        boxSizing: "border-box",
        fontFamily: 'Georgia, "Times New Roman", serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Giant decorative background text */}
      <div
        style={{
          position: "absolute",
          bottom: -Math.round(height * 0.05),
          left: -Math.round(width * 0.04),
          fontSize: Math.round(width * 0.38),
          fontWeight: 900,
          color: "rgba(255,255,255,0.025)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        NEW
      </div>

      {/* Diagonal accent stripe */}
      <div
        style={{
          position: "absolute",
          right: -Math.round(width * 0.1),
          top: 0,
          width: Math.round(width * 0.55),
          height: Math.round(height * 0.5),
          background: `linear-gradient(135deg, transparent 0%, ${accentColor}12 50%, transparent 100%)`,
          transform: "skewX(-20deg)",
        }}
      />

      {/* Top: badge + headline */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Gold top bar */}
        <div
          style={{
            width: Math.round(width * 0.09),
            height: Math.round(width * 0.006),
            background: accentColor,
            marginBottom: Math.round(width * 0.035),
          }}
        />
        {badge && (
          <div
            style={{
              display: "inline-block",
              background: accentColor + "20",
              border: `1px solid ${accentColor}50`,
              color: accentColor,
              fontSize: Math.round(width * 0.016),
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: `${Math.round(width * 0.008)}px ${Math.round(width * 0.018)}px`,
              borderRadius: Math.round(width * 0.004),
              marginBottom: Math.round(width * 0.025),
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            fontSize: Math.round(width * 0.082),
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            whiteSpace: "pre-line",
          }}
        >
          {headline}
        </div>
      </div>

      {/* Bottom: subtext + bullets */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {bullets.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(width * 0.018),
              marginBottom: Math.round(width * 0.03),
            }}
          >
            {bullets.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: Math.round(width * 0.02),
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: Math.round(width * 0.005),
                  padding: `${Math.round(width * 0.014)}px ${Math.round(width * 0.02)}px`,
                }}
              >
                <span
                  style={{
                    fontSize: Math.round(width * 0.022),
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.3,
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: Math.round(width * 0.022),
              color: "rgba(255,255,255,0.55)",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.4,
              maxWidth: "70%",
            }}
          >
            {subtext}
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: Math.round(width * 0.016),
              fontFamily: "system-ui, sans-serif",
              color: accentColor,
              fontWeight: 600,
            }}
          >
            <div>Choice Credit</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
              & Rental Solutions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
