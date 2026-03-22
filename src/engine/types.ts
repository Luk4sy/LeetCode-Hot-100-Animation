// 可绘制元素类型
export interface NodeElement {
  type: 'node'
  id: string
  x: number
  y: number
  value: number | string
  highlight?: string // 高亮颜色
}

export interface ArrowElement {
  type: 'arrow'
  fromId: string
  toId: string
  color?: string
}

export interface PointerElement {
  type: 'pointer'
  targetId: string
  label: string
  color: string
  position: 'top' | 'bottom' // 指针显示在节点上方还是下方
}

export interface NullMarker {
  type: 'null'
  x: number
  y: number
  label?: string
}

export type DrawableElement = NodeElement | ArrowElement | PointerElement | NullMarker

// 一帧动画状态
export interface AnimationFrame {
  elements: DrawableElement[]
  description: string
}

// 每道题需要提供的动画配置
export interface ProblemAnimation {
  generateSteps(): AnimationFrame[]
  canvasWidth: number
  canvasHeight: number
}

// 引擎播放状态
export type PlayState = 'idle' | 'playing' | 'paused'
