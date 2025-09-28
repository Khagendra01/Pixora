import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const GothamBackground = () => {
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 80% 20%, #162a59 0%, #060a17 55%, #03040a 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="1920" height="1080" fill="transparent" />
        <rect x="0" y="780" width="1920" height="300" fill="#0b1124" />
        <g fill="#111b37">
          <rect x="120" y="520" width="160" height="480" />
          <rect x="340" y="600" width="140" height="400" />
          <rect x="520" y="560" width="180" height="440" />
          <rect x="740" y="640" width="150" height="360" />
          <rect x="940" y="580" width="170" height="420" />
          <rect x="1160" y="620" width="140" height="380" />
          <rect x="1340" y="560" width="180" height="440" />
          <rect x="1560" y="600" width="140" height="400" />
        </g>
        <g fill="#1a294d">
          <rect x="100" y="540" width="20" height="60" />
          <rect x="150" y="560" width="20" height="50" />
          <rect x="200" y="520" width="20" height="70" />
          <rect x="350" y="620" width="18" height="50" />
          <rect x="380" y="640" width="18" height="60" />
          <rect x="550" y="580" width="20" height="60" />
          <rect x="590" y="600" width="20" height="40" />
          <rect x="980" y="600" width="20" height="60" />
          <rect x="1020" y="620" width="18" height="50" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const BatSignal = ({ opacity, beamScale }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingBottom: 160,
        paddingRight: 240,
        opacity,
        transform: `scale(${beamScale})`,
        transformOrigin: "100% 100%",
      }}
    >
      <svg width="360" height="360" viewBox="0 0 360 360">
        <defs>
          <radialGradient id="signal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f7e27c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f7e27c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon
          points="50,340 200,80 320,340"
          fill="url(#signal-glow)"
          opacity={0.65}
        />
        <circle cx="200" cy="180" r="82" fill="#f7e27c" />
        <path
          d="M144 178 L164 152 L176 170 L188 148 L200 170 L212 152 L232 178 L200 206 L176 206 Z"
          fill="#1a1a1a"
        />
        <rect x="180" y="246" width="40" height="70" fill="#d5c35e" rx="8" />
      </svg>
    </AbsoluteFill>
  );
};

const BatmanFigure = ({ x, y, capeFlutter, poseScale }) => {
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${poseScale})`,
        transformOrigin: "center",
        filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.45))",
      }}
    >
      <svg width="180" height="200" viewBox="0 0 100 110">
        <g transform={`translate(0 ${capeFlutter})`}>
          <path
            d="M12 54 Q24 92 50 100 Q76 92 88 54 L80 58 Q60 74 50 74 Q40 74 20 58 Z"
            fill="#0c152b"
          />
        </g>
        <g fill="#0f182e" stroke="#070b14" strokeWidth="2" strokeLinejoin="round">
          <path d="M28 20 L38 8 L42 20 L48 8 L52 20 L60 8 L72 20 L72 46 L28 46 Z" fill="#121b33" />
          <rect x="34" y="46" width="32" height="34" rx="6" />
          <path d="M30 80 Q50 94 70 80 L66 104 L34 104 Z" />
        </g>
        <g fill="#f4d96b">
          <rect x="46" y="54" width="8" height="12" rx="2" />
          <circle cx="50" cy="80" r="6" />
        </g>
        <path d="M24 46 Q20 60 24 76 L18 78 Q14 60 20 46 Z" fill="#0f182e" />
        <path d="M76 46 Q80 60 76 76 L82 78 Q86 60 80 46 Z" fill="#0f182e" />
      </svg>
    </AbsoluteFill>
  );
};

export const BatmanStory = () => {
  const frame = useCurrentFrame();

  const batSignalOpacity = interpolate(frame, [0, 15, 30], [0, 0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const batSignalScale = interpolate(frame, [0, 30, 60], [0.8, 1, 1.05], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glideX = interpolate(frame, [20, 60], [-220, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const landX = interpolate(frame, [60, 90], [760, 820], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const batmanX = frame < 60 ? glideX : landX;

  const batmanY = frame < 60
    ? interpolate(frame, [20, 60], [-140, 20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [60, 90], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const capeFlutter = Math.sin(frame / 6) * 4;

  const poseScale = frame < 60
    ? 1
    : interpolate(frame, [60, 75, 90], [1, 1.08, 1.02], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const titleOpacity = interpolate(frame, [10, 30, 50], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [10, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const taglineOpacity = interpolate(frame, [40, 60, 80], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#04060f" }}>
      <GothamBackground />
      <BatSignal opacity={batSignalOpacity} beamScale={batSignalScale} />
      <BatmanFigure
        x={batmanX}
        y={batmanY}
        capeFlutter={capeFlutter}
        poseScale={poseScale}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "120px 0 0 120px",
          color: "#f7e27c",
          fontFamily: "'Segoe UI', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Night In Gotham
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 18,
            opacity: taglineOpacity,
            letterSpacing: "0.1em",
          }}
        >
          Batman answers the signal.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
