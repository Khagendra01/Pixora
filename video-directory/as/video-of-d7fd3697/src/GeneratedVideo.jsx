import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const headingStyle = {
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: 700,
  color: "#ffffff",
  textAlign: "center",
  width: "100%",
};

const bodyStyle = {
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: 400,
  color: "#c5ccff",
  textAlign: "center",
  width: "100%",
};

export const GeneratedVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const characterX = interpolate(frame, [0, 25], [-400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const characterTranslateX = -280 + characterX;
  const heroTranslateX = interpolate(frame, [40, 58], [520, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const heroOpacity = interpolate(frame, [40, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroBob = Math.sin(((frame - 40) * Math.PI) / 18) * 8;
  const heroRotation = interpolate(frame, [56, 66], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const knockProgress = interpolate(frame, [58, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const knockedTranslateX = knockProgress * -80;
  const knockedTranslateY = knockProgress * 150;
  const knockedRotate = knockProgress * -75;
  const characterOpacity = 1 - knockProgress * 0.4;

  const impactOpacity = interpolate(frame, [58, 62, 72], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactScale = interpolate(frame, [58, 72], [0.4, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#040515" }}>
      <Img
        src={staticFile("background.svg")}
        style={{ position: "absolute", inset: 0, opacity: introOpacity * outroOpacity }}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: outroOpacity }}
      >
        <Sequence from={0}>
          <div style={{ position: "absolute", top: 240, width: "100%", opacity: introOpacity }}>
            <div style={{ ...headingStyle, fontSize: 72, letterSpacing: 4 }}>
              Sam Altman Presents
            </div>
          </div>
        </Sequence>
        <Sequence from={10}>
          <div style={{ position: "absolute", top: 320, width: "100%" }}>
            <div style={{ ...headingStyle, fontSize: 124 }}>Open GPT-5 Codex</div>
            <div style={{ ...bodyStyle, fontSize: 40, marginTop: 16 }}>
              Next-gen creative intelligence for builders
            </div>
          </div>
        </Sequence>
        <Sequence from={5}>
          <Img
            src={staticFile("character.svg")}
            style={{
              position: "absolute",
              bottom: 200,
              left: "50%",
              width: 220,
              transform: `translateX(${characterTranslateX + knockedTranslateX}px) translateY(${knockedTranslateY}px) rotate(${knockedRotate}deg)`,
              opacity: characterOpacity,
            }}
          />
        </Sequence>
        <Sequence from={28}>
          <div style={{ position: "absolute", bottom: 220, width: "100%" }}>
            <div style={{ ...bodyStyle, fontSize: 36 }}>
              The stage is set—eyes on the challenger.
            </div>
          </div>
        </Sequence>
        <Sequence from={40}>
          <Img
            src={staticFile("object.svg")}
            style={{
              position: "absolute",
              bottom: 210 + heroBob,
              left: "50%",
              width: 210,
              transform: `translateX(${heroTranslateX}px) rotate(${heroRotation}deg)`,
              opacity: heroOpacity,
            }}
          />
        </Sequence>
        <Sequence from={58} durationInFrames={18}>
          <div
            style={{
              position: "absolute",
              bottom: 260,
              left: "50%",
              width: 40,
              height: 40,
              transform: `translateX(-60px) scale(${impactScale})`,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(250,235,215,0.9) 0%, rgba(255,105,97,0.4) 60%, rgba(4,5,21,0) 100%)",
              opacity: impactOpacity,
            }}
          />
        </Sequence>
        <Sequence from={60}>
          <div style={{ position: "absolute", bottom: 160, width: "100%" }}>
            <div style={{ ...bodyStyle, fontSize: 34 }}>
              A flag of Nepal arcs through the night, toppling the first contender.
            </div>
          </div>
        </Sequence>
        <Sequence from={60}>
          <div style={{ position: "absolute", bottom: 80, width: "100%" }}>
            <div
              style={{
                ...headingStyle,
                fontSize: 48,
                letterSpacing: 3,
              }}
            >
              Witness the upset. Stay ready for the next legend.
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
