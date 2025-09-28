import { AbsoluteFill, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import background from "../../assets/background.svg";
import spiderman from "../../assets/character.svg";
import rooftopCat from "../../assets/object.svg";

const fontFamily = "'Inter', 'Helvetica Neue', sans-serif";

const Background = () => {
  return (
    <AbsoluteFill>
      <Img
        src={background}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};

const WebLine = ({ anchorX, anchorY, heroX, heroY }) => {
  return (
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
      }}
      viewBox="0 0 1920 1080"
    >
      <line
        x1={anchorX}
        y1={anchorY}
        x2={heroX}
        y2={heroY}
        stroke="#f7f2f2"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="24 18"
        opacity={0.85}
      />
    </svg>
  );
};

const TextBlock = ({ text, subtitle, opacity }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 160,
        color: "#f7f2f2",
        opacity,
        transition: "opacity 0.3s ease-out",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily,
            marginTop: 18,
            fontSize: 34,
            lineHeight: 1.4,
            maxWidth: 620,
            color: "#d1d7ff",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

export const GeneratedVideo = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const swingProgress = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 90,
      mass: 0.6,
    },
    durationInFrames: 60,
  });

  const baseX = interpolate(swingProgress, [0, 1], [width * 0.05, width * 0.58]);
  const baseY = interpolate(swingProgress, [0, 1], [height * 0.18, height * 0.38]);
  const waveOffset = Math.sin(frame / 10) * 28;

  const heroEntryFrame = Math.max(0, frame - 60);
  const heroPose = spring({
    frame: heroEntryFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 70,
    },
    durationInFrames: 30,
  });

  const heroScale = interpolate(heroPose, [0, 1], [1, 1.06]);
  const heroLift = interpolate(heroPose, [0, 1], [0, -40]);
  const heroRotation = interpolate(frame, [0, 60], [-24, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroX = baseX;
  const heroY = baseY + waveOffset + heroLift;

  const catFrame = Math.max(0, frame - 38);
  const catReveal = spring({
    frame: catFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 85,
    },
    durationInFrames: 20,
  });

  const catOpacity = interpolate(catReveal, [0, 1], [0, 1]);
  const catY = interpolate(catReveal, [0, 1], [40, 0]);

  const introOpacity = interpolate(frame, [2, 12, 30, 40], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const actionOpacity = interpolate(frame, [42, 52, 78, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const anchorX = width * 0.82;
  const anchorY = height * 0.12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050915" }}>
      <Background />

      <WebLine anchorX={anchorX} anchorY={anchorY} heroX={heroX} heroY={heroY - 60} />

      <div
        style={{
          position: "absolute",
          left: heroX,
          top: heroY,
          width: 200,
          transform: `translate(-100px, -120px) rotate(${heroRotation}deg) scale(${heroScale})`,
          transformOrigin: "center",
          filter: "drop-shadow(0 12px 25px rgba(0,0,0,0.45))",
        }}
      >
        <Img
          src={spiderman}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.72,
          top: height * 0.44 + catY,
          width: 140,
          opacity: catOpacity,
          transform: "translate(-50%, -50%)",
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))",
        }}
      >
        <Img
          src={rooftopCat}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      <Sequence from={0} durationInFrames={45}>
        <TextBlock
          text="Friendly Neighborhood Hero"
          subtitle="Spider-Man swings over Midtown to keep the skyline safe."
          opacity={introOpacity}
        />
      </Sequence>

      <Sequence from={45} durationInFrames={45}>
        <TextBlock
          text="Rescue On The Rooftops"
          subtitle="He spots a stranded rooftop cat and swoops in for a smooth save."
          opacity={actionOpacity}
        />
      </Sequence>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 32,
            letterSpacing: "0.06em",
            color: "#f39f86",
            textTransform: "uppercase",
            opacity: interpolate(frame, [60, 70, 88, 90], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          With great power comes great responsibility.
        </div>
      </div>
    </AbsoluteFill>
  );
};
