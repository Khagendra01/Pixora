import {useMemo} from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import backgroundSvg from "../../assets/background.svg";
import characterSvg from "../../assets/character.svg";
import bicycleSvg from "../../assets/object.svg";

const textStyle = {
  fontFamily: "'Avenir', 'Helvetica Neue', sans-serif",
  fontWeight: 600,
  fontSize: 72,
  color: "#2d1b69",
  textShadow: "0 6px 12px rgba(45, 27, 105, 0.15)",
  letterSpacing: 2,
};

const subtitleStyle = {
  fontSize: 44,
  fontWeight: 400,
  letterSpacing: 0.5,
  color: "#4f2f80",
};

const daisiesLayout = [
  {x: 420, delay: 60, drift: 14},
  {x: 960, delay: 54, drift: 20},
  {x: 1500, delay: 66, drift: 18},
];

export const DaisyBellStory = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  const enterX = interpolate(frame, [0, 30], [-600, width * 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const pedalBob = Math.sin(frame / 6) * 8;

  const bloomOpacity = interpolate(frame, [58, 70, 90], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0, 6, 18, 26], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const verseOpacity = interpolate(frame, [30, 36, 54, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const refrainOpacity = interpolate(frame, [60, 66, 84, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const daisies = useMemo(() => {
    return daisiesLayout.map(({x, delay, drift}) => {
      const progress = Math.max(0, frame - delay);
      const rise = interpolate(progress, [0, 20, 32], [180, 40, -20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const wobble = Math.sin((frame - delay) / 8) * drift;
      const opacity = interpolate(progress, [0, 8, 20], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {x, rise, wobble, opacity};
    });
  }, [frame]);

  return (
    <AbsoluteFill style={{backgroundColor: "#f7f5ff"}}>
      <Img src={backgroundSvg} style={{position: "absolute", inset: 0}} />

      <Audio src={staticFile("audio/daisy-bell.mp3")} volume={0.7} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: "translateY(-260px)",
          opacity: titleOpacity,
        }}
      >
        <div style={textStyle}>Daisy Bell</div>
        <div style={{...textStyle, ...subtitleStyle, marginTop: 20}}>
          A Bicycle Built for Two
        </div>
      </AbsoluteFill>

      <Sequence from={30} durationInFrames={30}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
          <div
            style={{
              ...textStyle,
              ...subtitleStyle,
              opacity: verseOpacity,
              transform: "translateY(-300px)",
            }}
          >
            "We'll look sweet upon the seat"
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={60} durationInFrames={30}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
          <div
            style={{
              ...textStyle,
              ...subtitleStyle,
              opacity: refrainOpacity,
              transform: "translateY(-300px)",
            }}
          >
            "Of a bicycle built for two"
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: enterX,
            transform: `translateY(${pedalBob}px)`,
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <Img src={bicycleSvg} style={{width: 360}} />
          <Img src={characterSvg} style={{width: 160}} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: bloomOpacity}}>
        {daisies.map(({x, rise, wobble, opacity}, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              bottom: 160 + rise,
              left: x + wobble,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff6f6 0%, #ffc3da 65%, #f58fb5 100%)",
              boxShadow: "0 12px 26px rgba(245, 143, 181, 0.35)",
              opacity,
            }}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
