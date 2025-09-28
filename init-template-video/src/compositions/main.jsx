import { Composition } from "remotion";
import { SceneMain } from "../scenes/scene-main";

export const MainComposition = () => {
  return (
    <Composition
      id="MainScene"
      component={SceneMain}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

export default MainComposition;
