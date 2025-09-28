import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import background from "../../assets/background.svg";
import character from "../../assets/character.svg";
import note from "../../assets/object.svg";

const rideXPositions = [-400, 640];
const rideFrames = [0, 30];

export const DaisyBellStory = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rideX = interpolate(frame, rideFrames, rideXPositions, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bobble = Math.sin((frame / fps) * Math.PI * 2) * 8;

  const noteOneOpacity = interpolate(frame, [24, 36, 48], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const noteOneY = interpolate(frame, [24, 48], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const noteTwoOpacity = interpolate(frame, [36, 48, 60], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const noteTwoY = interpolate(frame, [36, 60], [20, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finaleOpacity = interpolate(frame, [60, 80, 90], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img src={background} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          color: "#2F2A3C",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontWeight: 600,
          fontSize: 80,
          letterSpacing: 2,
          textAlign: "center",
        }}
      >
        <Sequence from={0} durationInFrames={30}>
          <div style={{ fontSize: 64 }}>Daisy Bell</div>
          <div style={{ fontSize: 36, marginTop: 24 }}>A sunny ride through the park</div>
        </Sequence>
        <Sequence from={30}>
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              transform: `translate(${rideX}px, ${bobble}px)`,
            }}
          >
            <Img src={character} style={{ width: "100%", height: "100%" }} />
          </div>
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              transform: `translate(840px, ${320 + noteOneY}px)`,
              opacity: noteOneOpacity,
            }}
          >
            <Img src={note} style={{ width: "100%", height: "100%" }} />
          </div>
          <div
            style={{
              position: "absolute",
              width: 70,
              height: 70,
              transform: `translate(960px, ${280 + noteTwoY}px)`,
              opacity: noteTwoOpacity,
            }}
          >
            <Img src={note} style={{ width: "100%", height: "100%" }} />
          </div>
        </Sequence>
        <Sequence from={60}>
          <div
            style={{
              position: "absolute",
              bottom: 160,
              left: 0,
              right: 0,
              margin: "0 auto",
              width: "fit-content",
              padding: "24px 48px",
              borderRadius: 24,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              fontSize: 42,
              opacity: finaleOpacity,
            }}
          >
            Singing "A Bicycle Built for Two!"
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

