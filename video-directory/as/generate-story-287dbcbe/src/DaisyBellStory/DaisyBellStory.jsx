import { Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import background from "../../assets/background.svg";
import character from "../../assets/character.svg";
import daisy from "../../assets/object.svg";

const daisies = [
  { delay: 0, startX: 200, startY: 780 },
  { delay: 40, startX: 500, startY: 840 },
  { delay: 80, startX: 820, startY: 800 },
  { delay: 120, startX: 1150, startY: 860 },
  { delay: 160, startX: 1450, startY: 820 },
];

export const DaisyBellStory = () => {
  const frame = useCurrentFrame();
  const totalFrames = 1200;

  const progress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const riderX = interpolate(progress, [0, 1], [-220, 1920], {
    easing: Easing.inOut(Easing.ease),
  });

  const bobbing = interpolate(Math.sin((frame / 15) * Math.PI * 2), [-1, 1], [-12, 12]);

  return (
    <div style={{ flex: 1, backgroundColor: "#F2F8FF", position: "relative" }}>
      <img
        src={background}
        alt="Sunny meadow background"
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
      />

      <div
        style={{
          position: "absolute",
          left: riderX,
          top: 520 + bobbing,
          transform: "translate(-50%, -50%)",
          transition: "filter 0.2s",
        }}
      >
        <img src={character} alt="Cyclist" style={{ width: 180, height: "auto" }} />
      </div>

      {daisies.map(({ delay, startX, startY }, index) => {
        const localFrame = Math.max(frame - delay, 0);
        const loopLength = 240;
        const loopProgress = (localFrame % loopLength) / loopLength;
        const floatY = startY - interpolate(loopProgress, [0, 0.5, 1], [0, 25, 0]);
        const sway = interpolate(
          Math.sin((localFrame / 30) * Math.PI * 2),
          [-1, 1],
          [-10, 10]
        );

        return (
          <img
            key={index}
            src={daisy}
            alt="Gentle daisy"
            style={{
              position: "absolute",
              left: startX + sway,
              top: floatY,
              width: 80,
              height: "auto",
              opacity: interpolate(loopProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 170,
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#27303F",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: 6,
          textShadow: "0 8px 20px rgba(39, 48, 63, 0.3)",
        }}
      >
        Daisy Bell
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 260,
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#3A4F8F",
          fontSize: 38,
          fontWeight: 500,
          maxWidth: 1100,
          lineHeight: 1.4,
        }}
      >
        <p style={{ margin: "16px 0" }}>Daisy, Daisy, give me your answer, do!</p>
        <p style={{ margin: "16px 0" }}>I'm half crazy all for the love of you.</p>
        <p style={{ margin: "16px 0" }}>It won't be a stylish marriage,</p>
        <p style={{ margin: "16px 0" }}>I can't afford a carriage,</p>
        <p style={{ margin: "16px 0" }}>But you'll look sweet upon the seat of a bicycle built for two.</p>
      </div>

      <Audio src={staticFile("audio/daisy-bell.mp3")} startFrom={0} endAt={totalFrames} />
    </div>
  );
};
