import { AbsoluteFill, interpolate, spring } from "remotion";

export const Character = ({ phase, progress, emotionalIntensity, storyData }) => {
  // Character animation based on story phase and emotional state
  const characterScale = interpolate(progress, [0, 1], [0.8, 1.2]);
  
  // Emotional expression based on phase
  const getEmotionalState = () => {
    switch (phase) {
      case "setup":
        return "curious"; // Character discovering the situation
      case "conflict":
        return "determined"; // Character facing the challenge
      case "resolution":
        return "triumphant"; // Character after overcoming challenge
      default:
        return "neutral";
    }
  };

  // Character position animation
  const characterX = interpolate(progress, [0, 1], [100, 800]);
  const characterY = interpolate(progress, [0, 1], [400, 500]);

  // Breathing animation for life-like movement
  const breathing = spring({
    frame: progress * 60,
    fps: 30,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const breathingOffset = Math.sin(breathing * Math.PI * 2) * 5;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: characterX,
          top: characterY + breathingOffset,
          transform: `scale(${characterScale})`,
          transformOrigin: "center bottom",
          transition: "all 0.3s ease",
        }}
      >
        {/* Character SVG will be loaded here */}
        <img 
          src="../../assets/character.svg" 
          alt="Main Character"
          style={{
            width: "200px",
            height: "auto",
            filter: `brightness(${emotionalIntensity * 0.2 + 1}) contrast(${emotionalIntensity * 0.1 + 1})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
