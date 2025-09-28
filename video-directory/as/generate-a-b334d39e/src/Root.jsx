import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { MainScene } from "./MainScene";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "black",
        }}
      />
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Main Scene for story-driven videos */}
      <Composition
        id="MainScene"
        component={MainScene}
        durationInFrames={900}  // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          storyData: {
            setupTitle: "The Journey Begins",
            setupSubtitle: "Our hero discovers a new world",
            conflictTitle: "The Challenge",
            conflictSubtitle: "Facing the greatest test",
            resolutionTitle: "Triumph",
            resolutionSubtitle: "Victory and new beginnings",
          }
        }}
      />
    </>
  );
};
