import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const NOTE_PATTERNS = [
  { left: 1180, delay: 60, hue: "#7f6aa3" },
  { left: 1280, delay: 72, hue: "#d98fbf" },
  { left: 1380, delay: 84, hue: "#f7c76d" },
];

const PETALS = [
  { left: 420, delay: 40, drift: -120 },
  { left: 520, delay: 52, drift: -160 },
  { left: 640, delay: 64, drift: -140 },
];

const fade = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const DaisyBellScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const backdropOpacity = fade(frame, 0, 18);
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 5],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const rideProgress = spring({
    frame: frame - 28,
    fps,
    config: {
      damping: 200,
      stiffness: 80,
    },
  });

  const bikeX = interpolate(rideProgress, [0, 1], [-520, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bobbing = Math.sin(Math.max(frame - 28, 0) / 12) * 6;

  const waveProgress = spring({
    frame: frame - 110,
    fps,
    config: {
      damping: 180,
      stiffness: 60,
    },
  });
  const waveRotation = interpolate(waveProgress, [0, 1], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#fdfcf8" }}>
      <AbsoluteFill style={{ opacity: backdropOpacity * outroOpacity }}>
        <Img
          src={staticFile("assets/background.svg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <Sequence>
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 120,
              opacity: fade(frame, 12, 30) * outroOpacity,
            }}
          >
            <div className="daisy-title">Daisy Bell</div>
            <div className="daisy-subtitle">A bicycle built for two</div>
          </div>
        </Sequence>

        <Sequence from={28}>
          <div
            style={{
              position: "absolute",
              bottom: 160,
              left: bikeX,
              transform: `translateY(${bobbing}px)`,
              opacity: outroOpacity,
            }}
          >
            <Img
              src={staticFile("assets/object.svg")}
              style={{ width: 440, height: "auto" }}
            />
            <div
              style={{
                position: "absolute",
                left: 76,
                bottom: 86,
                transform: `rotate(${waveRotation}deg)`,
                transformOrigin: "bottom left",
              }}
            >
              <Img
                src={staticFile("assets/character.svg")}
                style={{ width: 200, height: "auto" }}
              />
            </div>
          </div>
        </Sequence>

        <Sequence from={60}>
          {NOTE_PATTERNS.map((note) => {
            const noteFrame = frame - note.delay;
            if (noteFrame < 0) {
              return null;
            }

            const rise = interpolate(noteFrame, [0, 60], [0, -160], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const opacity = interpolate(noteFrame, [0, 12, 60], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const sway = Math.sin((noteFrame + note.left) / 18) * 18;

            return (
              <svg
                key={note.left}
                width={48}
                height={80}
                viewBox="0 0 48 80"
                style={{
                  position: "absolute",
                  left: note.left + sway,
                  bottom: 360 + rise,
                  opacity: opacity * outroOpacity,
                }}
              >
                <g fill={note.hue} stroke={note.hue} strokeWidth={2}>
                  <rect x="28" y="8" width="6" height="42" rx="3" />
                  <circle cx="18" cy="60" r="12" />
                  <path d="M34 18 Q44 28 34 38" fill="none" strokeWidth={4} />
                </g>
              </svg>
            );
          })}
        </Sequence>

        <Sequence from={50}>
          {PETALS.map((petal, index) => {
            const petalFrame = frame - petal.delay;
            if (petalFrame < 0) {
              return null;
            }

            const fall = interpolate(petalFrame, [0, 80], [0, petal.drift], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const sway = Math.sin((petalFrame + index * 10) / 14) * 22;
            const opacity = interpolate(petalFrame, [0, 16, 80], [0, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <svg
                key={petal.left}
                width={32}
                height={40}
                viewBox="0 0 32 40"
                style={{
                  position: "absolute",
                  left: petal.left + sway,
                  bottom: 420 + fall,
                  opacity: opacity * outroOpacity,
                }}
              >
                <ellipse
                  cx="16"
                  cy="20"
                  rx="10"
                  ry="18"
                  fill="#f3b3d4"
                />
              </svg>
            );
          })}
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
