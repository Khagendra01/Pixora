import { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import backgroundSvg from "../../assets/background.svg";
import characterSvg from "../../assets/character.svg";
import character2Svg from "../../assets/character-2.svg";
import character3Svg from "../../assets/character-3.svg";
import flagSvg from "../../assets/object.svg";

const SnowLayer = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cycleLength = Math.max(durationInFrames, 1);
  const flakes = useMemo(
    () =>
      new Array(12).fill(null).map((_, i) => ({
        left: (i * 150) % 1920,
        baseTop: (i * 90) % 1080,
        delay: (i * 7) % 30,
        scale: 0.4 + ((i * 13) % 10) / 20,
      })),
    []
  );

  return (
    <AbsoluteFill pointerEvents="none" style={{ opacity }}>
      {flakes.map((flake, index) => {
        const rawProgress = ((frame + flake.delay) % cycleLength) / cycleLength;
        const top = (flake.baseTop + rawProgress * 220) % 1080;
        const opacity = interpolate(rawProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 12 * flake.scale,
              height: 12 * flake.scale,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              left: flake.left,
              top,
              opacity,
              transform: `scale(${flake.scale})`,
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const TitleCard = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 55, 70], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 0,
        width: "100%",
        textAlign: "center",
        color: "#f2f5f9",
        fontFamily: "'Inter', sans-serif",
        textShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
        opacity,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700 }}>Summit Resolve</div>
      <div style={{ fontSize: 36, fontWeight: 400, marginTop: 16 }}>
        A team tackles a snowy mountain ridge together
      </div>
    </div>
  );
};

const ClosingCard = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [120, 132, 146, 150], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 160,
        left: 0,
        width: "100%",
        textAlign: "center",
        color: "#f2f5f9",
        fontFamily: "'Inter', sans-serif",
        textShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
        opacity,
    }}
    >
      <div style={{ fontSize: 54, fontWeight: 600 }}>Peak Achieved</div>
      <div style={{ fontSize: 32, fontWeight: 400, marginTop: 12 }}>
        The team plants the flag as snow settles around them
      </div>
    </div>
  );
};

const TeamBanner = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [72, 90, 118, 132], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [72, 90], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 240,
        width: "100%",
        textAlign: "center",
        color: "#f2f5f9",
        fontFamily: "'Inter', sans-serif",
        fontSize: 40,
        fontWeight: 500,
        letterSpacing: 0.5,
        textShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      Together they crest the ridge.
    </div>
  );
};

export const GeneratedVideo = () => {
  const frame = useCurrentFrame();
  const { height, durationInFrames } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const leaderProgress = interpolate(frame, [24, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leaderY = interpolate(leaderProgress, [0, 1], [height - 320, height - 660]);
  const leaderX = interpolate(leaderProgress, [0, 1], [720, 1120]);

  const leaderLift = interpolate(frame, [120, 138, durationInFrames], [0, -18, 0], {
    extrapolateRight: "clamp",
  });

  const leaderOpacity = interpolate(frame, [16, 30], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const supportOneProgress = interpolate(frame, [36, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const supportOneX = interpolate(supportOneProgress, [0, 1], [560, 980]);
  const supportOneY = interpolate(supportOneProgress, [0, 1], [height - 300, height - 620]);
  const supportOneLift = interpolate(frame, [132, 144, durationInFrames], [0, -14, 0], {
    extrapolateRight: "clamp",
  });
  const supportOneOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const supportTwoProgress = interpolate(frame, [44, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const supportTwoX = interpolate(supportTwoProgress, [0, 1], [840, 1180]);
  const supportTwoY = interpolate(supportTwoProgress, [0, 1], [height - 280, height - 600]);
  const supportTwoLift = interpolate(frame, [135, 146, durationInFrames], [0, -12, 0], {
    extrapolateRight: "clamp",
  });
  const supportTwoOpacity = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const flagOpacity = interpolate(frame, [108, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flagY = interpolate(frame, [108, 130], [height - 640, height - 700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ambientSnowOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ridgeGlowOpacity = interpolate(frame, [90, 108, 126], [0, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1f3a", overflow: "hidden" }}>
      <Img
        src={backgroundSvg}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgOpacity,
          transition: "opacity 0.3s ease-out",
        }}
      />

      <TitleCard />

      <Img
        src={character2Svg}
        style={{
          position: "absolute",
          width: 130,
          height: 130,
          left: supportOneX,
          top: supportOneY + supportOneLift,
          transform: `translate(-50%, -50%) scale(${1 + supportOneProgress * 0.04})`,
          opacity: supportOneOpacity,
          filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.32))",
        }}
      />

      <Img
        src={character3Svg}
        style={{
          position: "absolute",
          width: 128,
          height: 128,
          left: supportTwoX,
          top: supportTwoY + supportTwoLift,
          transform: `translate(-50%, -50%) scale(${1 + supportTwoProgress * 0.035})`,
          opacity: supportTwoOpacity,
          filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.32))",
        }}
      />

      <Img
        src={characterSvg}
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          left: leaderX,
          top: leaderY + leaderLift,
          transform: `translate(-50%, -50%) scale(${1 + leaderProgress * 0.05})`,
          opacity: leaderOpacity,
          filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.35))",
        }}
      />

      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 60% 45%, rgba(255,255,255,0.18), transparent 45%)",
          mixBlendMode: "screen",
          opacity: ridgeGlowOpacity,
          pointerEvents: "none",
        }}
      />

      <Img
        src={flagSvg}
        style={{
          position: "absolute",
          width: 80,
          height: 128,
          left: 1110,
          top: flagY,
          transform: "translate(-50%, -100%)",
          opacity: flagOpacity,
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))",
        }}
      />

      <TeamBanner />

      <SnowLayer opacity={ambientSnowOpacity} />

      <ClosingCard />
    </AbsoluteFill>
  );
};
