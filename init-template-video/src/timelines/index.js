import { interpolate } from "remotion";

export const createLinearTimeline = ({ frame, start, end, from = 0, to = 1 }) => {
  return interpolate(frame, [start, end], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
