import type { TemplateProps } from "./index";

/**
 * Rental Approval Template — "Split Panel" layout
 * Left: bold "APPROVED" stamp graphic. Right: headline + bullets.
 */
export default function RentalApprovalTemplate({
  headline,
  subtext,
  bullets,
  accentColor,
  badge,
  width,
  height,
}: TemplateProps & { width: number; height: number }) {
  const isLandscape = width > height;
  const pad = Math.round(width * 0.06);
  const splitW = Math.round(width * (isLandscape ? 0.38 : 0.42));

  return (
    <div
      style={{
        width,
        height,
        background: "#0b1630",
        display: "flex",
        flexDirection: isLandscape ? "row" : "column",
        fontFamily: 'Georgia, "Times New Roman", serif',
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Left / top accent panel */}
      <div
        style={{
          width: isLandscape ? splitW : width,
          height: isLandscape ? height : Math.round(height * 0.38),
          background: `linear-gradient(135deg, ${accentColor}EE 0%, ${accentColor}BB 100%)`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pattern rings */}
        {[0.9, 0.7, 0.5].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.08)",
            }}
          />
        ))}
        {/* APPROVED stamp */}
        <div
          style={{
            textAlign: "center",
            position: "relative",
            transform: "rotate(-12deg)",
          }}
        >
          <div
            style={{
              border: `${Math.round(width * 0.008)}px solid rgba(0,0,0,0.25)`,
              borderRadius: Math.round(width * 0.012),
              padding: `${Math.round(height * 0.03)}px ${Math.round(width * 0.025)}px`,
              display: "inline-block",
            }}
          >
            <div
              style={{
                fontSize: isLandscape
                  ? Math.round(splitW * 0.18)
                  : Math.round(width * 0.12),
                fontWeight: 900,
                color: "rgba(0,0,0,0.3)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              APPROVED
            </div>
          </div>
          <div
            style={{
              fontSize: isLandscape ? Math.round(splitW * 0.065) : Math.round(width * 0.042),
              color: "rgba(0,0,0,0.5)",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: Math.round(height * 0.012),
            }}
          >
            Rental Ready
          </div>
        </div>
      </div>

      {/* Right / bottom content panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: pad,
          position: "relative",
        }}
      >
        {badge && (
          <div
            style={{
              display: "inline-block",
              background: accentColor + "22",
              border: `1px solid ${accentColor}55`,
              color: accentColor,
              fontSize: Math.round(width * 0.016),
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: `${Math.round(width * 0.008)}px ${Math.round(width * 0.018)}px`,
              borderRadius: Math.round(width * 0.004),
              marginBottom: Math.round(width * 0.022),
              alignSelf: "flex-start",
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            fontSize: isLandscape ? Math.round(width * 0.048) : Math.round(width * 0.07),
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
            marginBottom: Math.round(width * 0.02),
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: Math.round(width * 0.022),
            color: "rgba(255,255,255,0.6)",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
            marginBottom: Math.round(width * 0.032),
          }}
        >
          {subtext}
        </div>
        {bullets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: Math.round(width * 0.014) }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: Math.round(width * 0.014) }}>
                <div
                  style={{
                    width: Math.round(width * 0.008),
                    height: Math.round(width * 0.008),
                    borderRadius: "50%",
                    background: accentColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: Math.round(width * 0.022),
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.4,
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom brand */}
        <div
          style={{
            position: "absolute",
            bottom: Math.round(pad * 0.65),
            right: pad,
            fontSize: Math.round(width * 0.016),
            fontFamily: "system-ui, sans-serif",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.02em",
          }}
        >
          choicecreditandrentalsolutions.com
        </div>
      </div>
    </div>
  );
}
