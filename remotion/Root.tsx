import { Composition } from "remotion";
import { NeartermVideo } from "../src/capsules/006/01/NeartermVideo";

export function RemotionRoot() {
  return <Composition id="Nearterm-006-01" component={NeartermVideo} durationInFrames={240} fps={30} width={720} height={720} />;
}
