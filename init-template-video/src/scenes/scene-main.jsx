import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import assetRegistry, { getAssetById } from "../assets/assetRegistry";

const heroAsset = getAssetById("character-main-hero-192x192");
const backgroundAsset = getAssetById("background-abstract-wave-1920x1080");
const sparkleAsset = getAssetById("effect-particle-sparkle-64x64");

const getSrc = (asset) => {
  if (!asset || !asset.publicPath) {
    return null;
  }
  return staticFile(asset.publicPath);
};

export const SceneMain = () => {
  const frame = useCurrentFrame();
  const heroTranslate = interpolate(frame, [0, 45], [400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sparkleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {backgroundAsset && (
        <Img src={getSrc(backgroundAsset)} style={{ width: "100%", height: "100%" }} />
      )}
      {heroAsset && (
        <Img
          src={getSrc(heroAsset)}
          style={{
            position: "absolute",
            width: 480,
            left: `calc(50% - 240px)`,
            bottom: 120,
            transform: `translateX(${heroTranslate}px)`,
          }}
        />
      )}
      {sparkleAsset && (
        <Img
          src={getSrc(sparkleAsset)}
          style={{
            position: "absolute",
            width: 120,
            left: "60%",
            top: "35%",
            opacity: sparkleOpacity,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "10%",
          color: "#FACC15",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: 3,
        }}
      >
        Pixora Showcase
      </div>
    </AbsoluteFill>
  );
};

export default SceneMain;
