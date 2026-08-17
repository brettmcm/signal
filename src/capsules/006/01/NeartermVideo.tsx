import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { NeartermView } from "./NeartermView";

export function NeartermVideo() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#050607", overflow: "hidden" }}>
    <div style={{
      width: 396,
      opacity: interpolate(frame, [0, 18, durationInFrames - 18, durationInFrames - 1], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      scale: interpolate(frame, [0, 24], [0.94, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        output: "perceptual-scale",
      }),
    }}>
      <NeartermView
        theme={frame >= 162 ? "light" : "dark"}
        reminderCount={3}
        eventCount={frame >= 126 ? 3 : 2}
        completedReminders={frame >= 72 ? [0] : []}
      />
    </div>
  </AbsoluteFill>;
}
