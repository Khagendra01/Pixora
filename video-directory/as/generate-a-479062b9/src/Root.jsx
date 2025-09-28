import "./index.css";
import { Composition } from "remotion";
import { GeneratedVideo } from "./GeneratedVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="GeneratedVideo"
        component={GeneratedVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
