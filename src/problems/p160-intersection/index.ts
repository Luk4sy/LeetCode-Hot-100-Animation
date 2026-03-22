import type { ProblemConfig } from '../types'
import { meta } from './meta'
import { generateSteps, canvasWidth, canvasHeight } from './animation'

export const p160: ProblemConfig = {
  ...meta,
  animation: {
    generateSteps,
    canvasWidth,
    canvasHeight,
  },
}
