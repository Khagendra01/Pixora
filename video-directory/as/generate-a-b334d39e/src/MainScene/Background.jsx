import { AbsoluteFill, interpolate } from "remotion";

export const Background = ({ phase, progress, storyData }) => {
  // Background animation based on story phase
  const getBackgroundStyle = () => {
    switch (phase) {
      case "setup":
        return {
          backgroundColor: "#e8f4fd", // Calm, welcoming
          backgroundImage: "linear-gradient(135deg, #e8f4fd 0%, #d1e7dd 100%)",
        };
      case "conflict":
        return {
          backgroundColor: "#f8d7da", // Tense, dramatic
          backgroundImage: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)",
        };
      case "resolution":
        return {
          backgroundColor: "#d4edda", // Triumphant, peaceful
          backgroundImage: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
        };
      default:
        return {
          backgroundColor: "#f8f9fa",
        };
    }
  };

  // Environmental effects based on phase
  const getEnvironmentalEffects = () => {
    switch (phase) {
      case "setup":
        return {
          opacity: 0.3,
          transform: "scale(1)",
        };
      case "conflict":
        return {
          opacity: 0.7,
          transform: "scale(1.1)",
        };
      case "resolution":
        return {
          opacity: 0.5,
          transform: "scale(1.05)",
        };
      default:
        return {
          opacity: 0.4,
          transform: "scale(1)",
        };
    }
  };

  const backgroundStyle = getBackgroundStyle();
  const effects = getEnvironmentalEffects();

  return (
    <AbsoluteFill style={backgroundStyle}>
      {/* Background SVG */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: effects.opacity,
          transform: effects.transform,
          transition: "all 0.5s ease",
        }}
      >
        <img 
          src="../../assets/background.svg" 
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      
      {/* Atmospheric effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: phase === "conflict" 
            ? "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.1) 0%, transparent 70%)"
            : phase === "resolution"
            ? "radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(0,0,255,0.05) 0%, transparent 70%)",
          opacity: interpolate(progress, [0, 1], [0.3, 0.8]),
        }}
      />
    </AbsoluteFill>
  );
};
