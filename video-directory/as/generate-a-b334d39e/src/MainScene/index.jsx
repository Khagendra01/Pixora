import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Character } from "./Character";
import { Background } from "./Background";
import { Objects } from "./Objects";
import { Narrative } from "./Narrative";

export const MainScene = ({ storyData = {} }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Story structure phases
  const setupPhase = frame < 300;      // 0-300 frames: Setup
  const conflictPhase = frame >= 300 && frame < 600;  // 300-600 frames: Conflict
  const resolutionPhase = frame >= 600; // 600-900 frames: Resolution

  // Calculate progress within each phase
  const setupProgress = interpolate(frame, [0, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const conflictProgress = interpolate(frame, [300, 600], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolutionProgress = interpolate(frame, [600, 900], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Emotional pacing based on story beats
  const emotionalIntensity = spring({
    frame: conflictPhase ? frame - 300 : 0,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f0f0f0" }}>
      {/* Background layer - establishes setting and mood */}
      <Background 
        phase={setupPhase ? "setup" : conflictPhase ? "conflict" : "resolution"}
        progress={setupPhase ? setupProgress : conflictPhase ? conflictProgress : resolutionProgress}
        storyData={storyData}
      />
      
      {/* Character layer - protagonist animation */}
      <Character 
        phase={setupPhase ? "setup" : conflictPhase ? "conflict" : "resolution"}
        progress={setupPhase ? setupProgress : conflictPhase ? conflictProgress : resolutionProgress}
        emotionalIntensity={emotionalIntensity}
        storyData={storyData}
      />
      
      {/* Objects layer - story-relevant props and interactions */}
      <Objects 
        phase={setupPhase ? "setup" : conflictPhase ? "conflict" : "resolution"}
        progress={setupPhase ? setupProgress : conflictPhase ? conflictProgress : resolutionProgress}
        storyData={storyData}
      />
      
      {/* Narrative layer - story structure and pacing */}
      <Narrative 
        currentPhase={setupPhase ? "setup" : conflictPhase ? "conflict" : "resolution"}
        setupProgress={setupProgress}
        conflictProgress={conflictProgress}
        resolutionProgress={resolutionProgress}
        emotionalIntensity={emotionalIntensity}
        storyData={storyData}
      />
    </AbsoluteFill>
  );
};
