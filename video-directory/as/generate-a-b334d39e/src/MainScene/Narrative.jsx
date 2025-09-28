import { AbsoluteFill, interpolate, spring } from "remotion";

export const Narrative = ({ 
  currentPhase, 
  setupProgress, 
  conflictProgress, 
  resolutionProgress, 
  emotionalIntensity, 
  storyData 
}) => {
  // Narrative text based on story phase
  const getNarrativeText = () => {
    switch (currentPhase) {
      case "setup":
        return {
          title: storyData.setupTitle || "The Journey Begins",
          subtitle: storyData.setupSubtitle || "Our hero discovers a new world",
          opacity: interpolate(setupProgress, [0, 1], [0, 1]),
        };
      case "conflict":
        return {
          title: storyData.conflictTitle || "The Challenge",
          subtitle: storyData.conflictSubtitle || "Facing the greatest test",
          opacity: interpolate(conflictProgress, [0, 1], [0, 1]),
        };
      case "resolution":
        return {
          title: storyData.resolutionTitle || "Triumph",
          subtitle: storyData.resolutionSubtitle || "Victory and new beginnings",
          opacity: interpolate(resolutionProgress, [0, 1], [0, 1]),
        };
      default:
        return {
          title: "Story",
          subtitle: "A tale unfolds",
          opacity: 0,
        };
    }
  };

  const narrative = getNarrativeText();

  // Emotional color scheme based on phase
  const getEmotionalColors = () => {
    switch (currentPhase) {
      case "setup":
        return {
          titleColor: "#2563eb", // Blue - calm, discovery
          subtitleColor: "#64748b", // Gray - neutral
        };
      case "conflict":
        return {
          titleColor: "#dc2626", // Red - tension, drama
          subtitleColor: "#991b1b", // Dark red - intensity
        };
      case "resolution":
        return {
          titleColor: "#059669", // Green - success, triumph
          subtitleColor: "#047857", // Dark green - achievement
        };
      default:
        return {
          titleColor: "#374151",
          subtitleColor: "#6b7280",
        };
    }
  };

  const colors = getEmotionalColors();

  // Text animation based on emotional intensity
  const textScale = spring({
    frame: emotionalIntensity * 60,
    fps: 30,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const textScaleValue = 1 + (textScale * 0.1);

  return (
    <AbsoluteFill>
      {/* Narrative overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, 
            rgba(0,0,0,0.1) 0%, 
            rgba(0,0,0,0.05) 50%, 
            rgba(0,0,0,0.1) 100%
          )`,
          opacity: narrative.opacity,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: `translateX(-50%) scale(${textScaleValue})`,
          textAlign: "center",
          opacity: narrative.opacity,
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: colors.titleColor,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            margin: 0,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {narrative.title}
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: `translateX(-50%) scale(${textScaleValue * 0.8})`,
          textAlign: "center",
          opacity: narrative.opacity * 0.8,
        }}
      >
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "normal",
            color: colors.subtitleColor,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            margin: 0,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {narrative.subtitle}
        </p>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "4px",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(currentPhase === "setup" ? setupProgress : 
                      currentPhase === "conflict" ? conflictProgress : 
                      resolutionProgress) * 100}%`,
            height: "100%",
            backgroundColor: colors.titleColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Phase indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          color: colors.subtitleColor,
          fontSize: "0.9rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity: narrative.opacity * 0.6,
        }}
      >
        {currentPhase}
      </div>
    </AbsoluteFill>
  );
};
