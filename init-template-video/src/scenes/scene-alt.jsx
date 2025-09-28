import { AbsoluteFill, useCurrentFrame } from "remotion";
import { createLinearTimeline } from "../timelines";

export const SceneAlt = () => {
  const frame = useCurrentFrame();
  const glow = createLinearTimeline({ frame, start: 0, end: 60, from: 0.2, to: 0.8 });
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.6), rgba(15,23,42,1))",
        boxShadow: `0 0 160px rgba(250,204,21,${glow})`,
      }}
    />
  );
};

export default SceneAlt;
