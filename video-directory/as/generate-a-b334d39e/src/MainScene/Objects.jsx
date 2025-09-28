import { AbsoluteFill, interpolate, spring } from "remotion";

export const Objects = ({ phase, progress, storyData }) => {
  // Object animation based on story phase
  const getObjectAnimation = () => {
    switch (phase) {
      case "setup":
        return {
          scale: interpolate(progress, [0, 1], [0.5, 1]),
          opacity: interpolate(progress, [0, 1], [0, 1]),
          rotation: 0,
        };
      case "conflict":
        return {
          scale: 1.1,
          opacity: 1,
          rotation: spring({
            frame: progress * 60,
            fps: 30,
            config: {
              damping: 200,
              stiffness: 100,
            },
          }) * 10, // Slight shake during conflict
        };
      case "resolution":
        return {
          scale: interpolate(progress, [0, 1], [1, 1.2]),
          opacity: interpolate(progress, [0, 1], [1, 0.8]),
          rotation: 0,
        };
      default:
        return {
          scale: 1,
          opacity: 1,
          rotation: 0,
        };
    }
  };

  const objectAnimation = getObjectAnimation();

  return (
    <AbsoluteFill>
      {/* Primary story object */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 300,
          transform: `scale(${objectAnimation.scale}) rotate(${objectAnimation.rotation}deg)`,
          opacity: objectAnimation.opacity,
          transition: "all 0.3s ease",
        }}
      >
        <img 
          src="../../assets/object.svg" 
          alt="Story Object"
          style={{
            width: "150px",
            height: "auto",
            filter: phase === "conflict" 
              ? "brightness(1.2) contrast(1.1)" 
              : phase === "resolution"
              ? "brightness(1.1) saturate(1.2)"
              : "brightness(1) contrast(1)",
          }}
        />
      </div>

      {/* Secondary object if available */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 400,
          transform: `scale(${objectAnimation.scale * 0.8}) rotate(${-objectAnimation.rotation * 0.5}deg)`,
          opacity: objectAnimation.opacity * 0.7,
          transition: "all 0.3s ease",
        }}
      >
        <img 
          src="../../assets/object-2.svg" 
          alt="Secondary Object"
          style={{
            width: "100px",
            height: "auto",
            filter: phase === "conflict" 
              ? "brightness(1.1) contrast(1.05)" 
              : "brightness(1) contrast(1)",
          }}
        />
      </div>

      {/* Interactive elements based on story phase */}
      {phase === "conflict" && (
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 200,
            width: "20px",
            height: "20px",
            backgroundColor: "#ff6b6b",
            borderRadius: "50%",
            opacity: interpolate(progress, [0, 1], [0, 1]),
            transform: `scale(${spring({
              frame: progress * 60,
              fps: 30,
              config: {
                damping: 200,
                stiffness: 100,
              },
            })})`,
            boxShadow: "0 0 20px rgba(255, 107, 107, 0.6)",
          }}
        />
      )}

      {phase === "resolution" && (
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 150,
            width: "30px",
            height: "30px",
            backgroundColor: "#51cf66",
            borderRadius: "50%",
            opacity: interpolate(progress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(progress, [0, 1], [0.5, 1.5])})`,
            boxShadow: "0 0 30px rgba(81, 207, 102, 0.8)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
