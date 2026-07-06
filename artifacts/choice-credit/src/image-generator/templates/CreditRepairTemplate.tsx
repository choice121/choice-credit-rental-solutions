import type { TemplateProps } from "./index";

/**
 * Credit Repair Template — "Score Dial" layout
 * Hero: circular score progress ring (CSS only), bold headline, bullet checklist.
 */
export default function CreditRepairTemplate({
  headline,
  subtext,
  bullets,
  accentColor,
  badge,
  width,
  height,
}: TemplateProps & { width: number; height: number }) {
  const isLandscape = width > height;
  const pad = Math.round(width * 0.065);
  const dialSize = isLandscape ? Math.round(height * 0.42) : Math.round(width * 0.32);

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(145deg, #0b1630 0%, #162550 55%, #0b1630 100%)",
        display: "flex",
        flexDirection: isLandscape ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        padding: pad,
        boxSizing: "border-box",
        fontFamily: 'Georgia, "Times New Roman", serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background geometric accent */}
      <div
        style={{
          position: "absolute",
          top: -width * 0.18,
          right: -width * 0.12,
          width: width * 0.55,
          height: width * 0.55,
          borderRadius: "50%",
          border: `${Math.round(width * 0.025)}px solid`,
          borderColor: accentColor + "22",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -width * 0.22,
          left: -width * 0.1,
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: "50%",
          border: `${Math.round(width * 0.018)}px solid`,
          borderColor: accentColor + "15",
        }}
      />
      {/* Gold top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.round(width * 0.007),
          background: accentColor,
        }}
      />

      {/* Dial graphic */}
      <div
        style={{
          flexShrink: 0,
          width: dialSize,
          height: dialSize,
          borderRadius: "50%",
          border: `${Math.round(dialSize * 0.07)}px solid`,
          borderColor: accentColor + "30",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginRight: isLandscape ? pad : 0,
          marginBottom: isLandscape ? 0 : Math.round(pad * 0.8),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: Math.round(dialSize * 0.08),
            borderRadius: "50%",
            border: `${Math.round(dialSize * 0.06)}px solid transparent`,
            borderTopColor: accentColor,
            borderRightColor: accentColor,
            transform: "rotate(-45deg)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: Math.round(dialSize * 0.26),
              fontWeight: 700,
              color: accentColor,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            750+
          </div>
          <div
            style={{
              fontSize: Math.round(dialSize * 0.1),
              color: "rgba(255,255,255,0.6)",
              marginTop: Math.round(dialSize * 0.03),
              fontFamily: "system-ui, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Your Goal
          </div>
        </div>
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
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
              marginBottom: Math.round(width * 0.02),
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            fontSize: isLandscape ? Math.round(width * 0.05) : Math.round(width * 0.072),
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
            marginBottom: Math.round(width * 0.018),
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: Math.round(width * 0.022),
            color: "rgba(255,255,255,0.65)",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.5,
            marginBottom: Math.round(width * 0.03),
          }}
        >
          {subtext}
        </div>
        {bullets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: Math.round(width * 0.013) }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: Math.round(width * 0.014) }}>
                <div
                  style={{
                    width: Math.round(width * 0.022),
                    height: Math.round(width * 0.022),
                    borderRadius: "50%",
                    background: accentColor,
                    flexShrink: 0,
                    marginTop: Math.round(width * 0.003),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: Math.round(width * 0.008),
                      height: Math.round(width * 0.013),
                      border: `${Math.round(width * 0.003)}px solid #0b1630`,
                      borderTop: "none",
                      borderLeft: "none",
                      transform: "rotate(45deg) translate(-1px, -1px)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: Math.round(width * 0.022),
                    color: "rgba(255,255,255,0.85)",
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
      </div>

      {/* Bottom brand */}
      <div
        style={{
          position: "absolute",
          bottom: Math.round(pad * 0.7),
          right: pad,
          display: "flex",
          alignItems: "center",
          gap: Math.round(width * 0.01),
        }}
      >
        <div
          style={{
            width: Math.round(width * 0.028),
            height: Math.round(width * 0.028),
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.round(width * 0.016),
            fontWeight: 700,
            color: "#0b1630",
          }}
        >
          C
        </div>
        <span
          style={{
            fontSize: Math.round(width * 0.018),
            fontFamily: "system-ui, sans-serif",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.02em",
          }}
        >
          Choice Credit & Rental Solutions
        </span>
      </div>
    </div>
  );
}
