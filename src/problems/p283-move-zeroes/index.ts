import type { ProblemConfig } from "../types";
import { meta } from "./meta";
import { generateSteps, canvasWidth, canvasHeight } from "./animation";

export const p283: ProblemConfig = {
  ...meta,
  animation: {
    generateSteps,
    canvasWidth,
    canvasHeight,
  },
};
