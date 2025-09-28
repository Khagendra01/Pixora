import { AbsoluteFill, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import background from "../../assets/background.svg";
import character from "../../assets/character.svg";
import productCard from "../../assets/object.svg";

const fadeIn = (frame, start, duration) => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const GeneratedVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.05, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const characterSlide = interpolate(frame, [10, 26], [-420, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const productBounce = spring({
    frame: frame - 24,
    fps,
    damping: 12,
    mass: 0.8,
  });

  const ctaRise = interpolate(frame, [54, 72], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#040b18",
        overflow: "hidden",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: "#f5f8ff",
      }}
    >
      <Img
        src={background}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${bgScale})`,
          transformOrigin: "center",
          opacity: fadeIn(frame, 0, 12),
        }}
      />

      <Sequence from={8}>
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 320,
            width: 320,
            height: 320,
            transform: `translateX(${characterSlide}px)`,
            opacity: fadeIn(frame, 10, 14),
          }}
        >
          <Img src={character} style={{ width: "100%" }} />
        </div>
      </Sequence>

      <Sequence from={16}>
        <div
          style={{
            position: "absolute",
            right: 320,
            top: 260,
            width: 280,
            opacity: fadeIn(frame, 18, 12),
            transform: `scale(${0.8 + productBounce * 0.2})`,
            transformOrigin: "center",
            filter: "drop-shadow(0 12px 24px rgba(10, 26, 47, 0.35))",
          }}
        >
          <Img src={productCard} style={{ width: "100%" }} />
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 82,
              width: 140,
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            OpenGet
            <br />
            5 Codex
          </div>
        </div>
      </Sequence>

      <Sequence from={0}>
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 140,
            maxWidth: 640,
            transform: "translateZ(0)",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -0.5,
              lineHeight: 1,
              opacity: fadeIn(frame, 6, 16),
            }}
          >
            Advertising OpenGet 5 Codex
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              fontWeight: 400,
              opacity: fadeIn(frame, 14, 12),
            }}
          >
            Launch smart automation campaigns in minutes with AI-tuned prompts and
            collaborative guardrails.
          </div>
        </div>
      </Sequence>

      <Sequence from={28}>
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 360,
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: fadeIn(frame, 30, 12),
          }}
        >
          {["Pre-built automation flows", "Live usage analytics", "Secure team controls"].map(
            (item, index) => {
              const itemFrame = frame - (30 + index * 6);
              const itemOpacity = interpolate(
                itemFrame,
                [0, 12],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const itemTranslate = interpolate(
                itemFrame,
                [0, 12],
                [24, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 26,
                    fontWeight: 500,
                    background:
                      "linear-gradient(90deg, rgba(31,65,115,0.35) 0%, rgba(10,26,47,0) 100%)",
                    padding: "12px 20px",
                    borderRadius: 14,
                    backdropFilter: "blur(4px)",
                    transform: `translateY(${itemTranslate}px)`,
                    opacity: itemOpacity,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#3C8DFF",
                      boxShadow: "0 0 12px rgba(60, 141, 255, 0.6)",
                    }}
                  />
                  {item}
                </div>
              );
            }
          )}
        </div>
      </Sequence>

      <Sequence from={52}>
        <div
          style={{
            position: "absolute",
            left: 240,
            bottom: 160,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "22px 28px",
            backgroundColor: "rgba(4, 11, 24, 0.7)",
            borderRadius: 20,
            transform: `translateY(${ctaRise}px)`,
            opacity: fadeIn(frame, 54, 10),
            boxShadow: "0 18px 28px rgba(4, 11, 24, 0.45)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "#8FB4FF",
            }}
          >
            Request Early Access
          </div>
          <div
            style={{
              padding: "12px 24px",
              background:
                "linear-gradient(90deg, rgba(60,141,255,1) 0%, rgba(35,81,181,1) 100%)",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 600,
              color: "#040b18",
            }}
          >
            Unlock OpenGet 5 Codex
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
