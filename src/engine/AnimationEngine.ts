import type { AnimationFrame, ProblemAnimation, PlayState } from './types'
import { Renderer } from './Renderer'

export class AnimationEngine {
  private steps: AnimationFrame[] = []
  private currentIndex = 0
  private state: PlayState = 'idle'
  private speed = 800 // ms per step
  private timerId: number | null = null
  private renderer: Renderer | null = null
  private onStateChange?: (state: PlayState, index: number, total: number) => void

  init(
    canvas: HTMLCanvasElement,
    animation: ProblemAnimation,
    onStateChange?: (state: PlayState, index: number, total: number) => void
  ) {
    this.renderer = new Renderer(canvas, animation.canvasWidth, animation.canvasHeight)
    this.steps = animation.generateSteps()
    this.currentIndex = 0
    this.state = 'idle'
    this.onStateChange = onStateChange
    this.renderCurrent()
    this.notify()
  }

  play() {
    if (this.steps.length === 0) return
    if (this.currentIndex >= this.steps.length - 1) {
      this.currentIndex = 0
    }
    this.state = 'playing'
    this.notify()
    this.startTimer()
  }

  pause() {
    this.state = 'paused'
    this.stopTimer()
    this.notify()
  }

  reset() {
    this.stopTimer()
    this.currentIndex = 0
    this.state = 'idle'
    this.renderCurrent()
    this.notify()
  }

  stepForward() {
    this.stopTimer()
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++
      this.state = 'paused'
      this.renderCurrent()
      this.notify()
    }
  }

  stepBackward() {
    this.stopTimer()
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.state = 'paused'
      this.renderCurrent()
      this.notify()
    }
  }

  setSpeed(ms: number) {
    this.speed = ms
    if (this.state === 'playing') {
      this.stopTimer()
      this.startTimer()
    }
  }

  redraw() {
    this.renderCurrent()
  }

  destroy() {
    this.stopTimer()
  }

  private startTimer() {
    this.stopTimer()
    this.timerId = window.setInterval(() => {
      if (this.currentIndex < this.steps.length - 1) {
        this.currentIndex++
        this.renderCurrent()
        this.notify()
      } else {
        this.pause()
      }
    }, this.speed)
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  private renderCurrent() {
    if (this.renderer && this.steps.length > 0) {
      this.renderer.drawFrame(this.steps[this.currentIndex])
    }
  }

  private notify() {
    this.onStateChange?.(this.state, this.currentIndex, this.steps.length)
  }
}
