import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import background from "../../assets/background.svg";
import character from "../../assets/character.svg";
import bicycle from "../../assets/object.svg";

const TEXT_SEGMENTS = [
  {
    text: "Daisy Bell pedals into a golden morning park.",
    start: 0,
    end: 30,
  },
  {
    text: "Her bicycle built for two hums a gentle rhythm.",
    start: 30,
    end: 60,
  },
  {
    text: "She sings \"Daisy, Daisy\" as the breeze joins in.",
    start: 60,
    end: 90,
  },
];

export const DaisyBellStory = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const rideX = interpolate(frame, [0, durationInFrames], [-400, 1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bobY = Math.sin(frame / 8) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "#a0d8f1" }}>
      <Img src={background} style={{ width: "100%", height: "100%" }} />
      {TEXT_SEGMENTS.map(({ text, start, end }) => {
        const opacity = interpolate(
          frame,
          [start, start + 8, end - 8, end],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={text}
            style={{
              position: "absolute",
              top: "8%",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: 70,
              color: "#2b3a67",
              fontWeight: 600,
              textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              opacity,
            }}
          >
            {text}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: 300,
          left: rideX,
          transform: `translateY(${bobY}px)`,
        }}
      >
        <Img src={bicycle} style={{ width: "100%" }} />
        <Img
          src={character}
          style={{
            width: 180,
            position: "absolute",
            left: 60,
            bottom: 70,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
