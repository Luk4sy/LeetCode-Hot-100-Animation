import type { ProblemConfig } from '../types'
import { meta } from './meta'
import { generateSteps, canvasWidth, canvasHeight } from './animation'

export const p206: ProblemConfig = {
  ...meta,
  animation: {
    generateSteps,
    canvasWidth,
    canvasHeight,
  },
}
