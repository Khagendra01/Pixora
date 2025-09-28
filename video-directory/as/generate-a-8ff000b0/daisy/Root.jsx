import "./styles.css";
import { Composition } from "remotion";
import { DaisyBellScene } from "./DaisyBell";

export const DaisyRemotionRoot = () => {
  return (
    <Composition
      id="DaisyBell"
      component={DaisyBellScene}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
