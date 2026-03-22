<template>
  <div class="animation-player">
    <div class="canvas-wrapper">
      <canvas ref="canvasRef"></canvas>
    </div>
    <div class="controls">
      <div class="control-buttons">
        <button class="btn" @click="handleReset" title="重置">
          <span>⏮</span>
        </button>
        <button class="btn" @click="handleStepBackward" title="上一步">
          <span>◀</span>
        </button>
        <button class="btn btn-primary" @click="handlePlayPause" :title="isPlaying ? '暂停' : '播放'">
          <span>{{ isPlaying ? '⏸' : '▶' }}</span>
        </button>
        <button class="btn" @click="handleStepForward" title="下一步">
          <span>▶</span>
        </button>
      </div>
      <div class="progress-info">
        <span>步骤 {{ currentStep + 1 }} / {{ totalSteps }}</span>
      </div>
      <div class="speed-control">
        <label>速度：</label>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          :value="speed"
          @input="handleSpeedChange"
        />
        <span>{{ speed }}ms</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { ProblemAnimation, PlayState } from '../engine/types'
import { AnimationEngine } from '../engine/AnimationEngine'

const props = defineProps<{
  animation: ProblemAnimation
}>()

const canvasRef = ref<HTMLCanvasElement>()
const engine = new AnimationEngine()
const isPlaying = ref(false)
const currentStep = ref(0)
const totalSteps = ref(0)
const speed = ref(800)

function onStateChange(state: PlayState, index: number, total: number) {
  isPlaying.value = state === 'playing'
  currentStep.value = index
  totalSteps.value = total
}

function handlePlayPause() {
  if (isPlaying.value) {
    engine.pause()
  } else {
    engine.play()
  }
}

function handleReset() {
  engine.reset()
}

function handleStepForward() {
  engine.stepForward()
}

function handleStepBackward() {
  engine.stepBackward()
}

function handleSpeedChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  speed.value = val
  engine.setSpeed(val)
}

function onThemeChange() {
  engine.redraw()
}

onMounted(() => {
  if (canvasRef.value) {
    engine.init(canvasRef.value, props.animation, onStateChange)
  }
  window.addEventListener('theme-change', onThemeChange)
})

watch(() => props.animation, (anim) => {
  if (canvasRef.value) {
    engine.init(canvasRef.value, anim, onStateChange)
  }
})

onUnmounted(() => {
  engine.destroy()
  window.removeEventListener('theme-change', onThemeChange)
})
</script>

<style scoped>
.animation-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.canvas-wrapper {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-canvas);
  box-shadow: var(--shadow-canvas);
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.control-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--btn-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text);
  transition: all 0.15s;
}

.btn:hover {
  background: var(--btn-hover);
  border-color: var(--border-hover);
}

.btn-primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
  width: 52px;
  height: 52px;
  font-size: 18px;
}

.btn-primary:hover {
  background: #2563eb;
}

.progress-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-family: monospace;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.speed-control input[type="range"] {
  width: 120px;
  accent-color: #3b82f6;
}

.speed-control span {
  font-family: monospace;
  min-width: 50px;
}
</style>
