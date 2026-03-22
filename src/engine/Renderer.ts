import type { AnimationFrame, DrawableElement, NodeElement, ArrowElement, PointerElement, NullMarker } from './types'

export class Renderer {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private dpr: number

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.dpr = window.devicePixelRatio || 1
    this.width = width
    this.height = height

    canvas.width = width * this.dpr
    canvas.height = height * this.dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Cannot get 2d context')
    ctx.scale(this.dpr, this.dpr)
    this.ctx = ctx
  }

  private css(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  drawFrame(frame: AnimationFrame) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    // 收集所有节点用于箭头和指针查找坐标
    const nodes = new Map<string, NodeElement>()
    for (const el of frame.elements) {
      if (el.type === 'node') nodes.set(el.id, el)
    }

    // 按顺序绘制：箭头 -> 节点 -> 指针 -> null标记
    for (const el of frame.elements) {
      if (el.type === 'arrow') this.drawArrow(el, nodes)
    }
    for (const el of frame.elements) {
      if (el.type === 'node') this.drawNode(el)
    }
    for (const el of frame.elements) {
      if (el.type === 'null') this.drawNull(el)
    }
    for (const el of frame.elements) {
      if (el.type === 'pointer') this.drawPointer(el, nodes)
    }

    // 绘制说明文字
    this.drawDescription(frame.description)
  }

  private drawNode(el: NodeElement) {
    const ctx = this.ctx
    const radius = 22

    // 圆形背景
    ctx.beginPath()
    ctx.arc(el.x, el.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = el.highlight || this.css('--canvas-node-fill')
    ctx.fill()
    ctx.strokeStyle = el.highlight ? el.highlight : this.css('--canvas-node-stroke')
    ctx.lineWidth = 2.5
    ctx.stroke()

    // 节点值
    ctx.fillStyle = el.highlight ? '#ffffff' : this.css('--canvas-node-text')
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(el.value), el.x, el.y)
  }

  private drawArrow(el: ArrowElement, nodes: Map<string, NodeElement>) {
    const from = nodes.get(el.fromId)
    const to = nodes.get(el.toId)
    if (!from || !to) return

    const ctx = this.ctx
    const radius = 22
    const headLen = 10

    // 计算起点和终点（从圆边缘开始）
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return

    const ux = dx / dist
    const uy = dy / dist
    const startX = from.x + ux * radius
    const startY = from.y + uy * radius
    const endX = to.x - ux * (radius + 2)
    const endY = to.y - uy * (radius + 2)

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    const defaultArrow = this.css('--canvas-arrow')
    ctx.strokeStyle = el.color || defaultArrow
    ctx.lineWidth = 2
    ctx.stroke()

    // 箭头
    const angle = Math.atan2(endY - startY, endX - startX)
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - headLen * Math.cos(angle - Math.PI / 6),
      endY - headLen * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      endX - headLen * Math.cos(angle + Math.PI / 6),
      endY - headLen * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fillStyle = el.color || defaultArrow
    ctx.fill()
  }

  private drawPointer(el: PointerElement, nodes: Map<string, NodeElement>) {
    const target = nodes.get(el.targetId)
    if (!target) return

    const ctx = this.ctx
    const offsetY = el.position === 'top' ? -42 : 42
    const px = target.x
    const py = target.y + offsetY

    // 三角形指向节点
    const triSize = 8
    ctx.beginPath()
    if (el.position === 'top') {
      ctx.moveTo(px, py + 16)
      ctx.lineTo(px - triSize, py + 16 - triSize)
      ctx.lineTo(px + triSize, py + 16 - triSize)
    } else {
      ctx.moveTo(px, py - 16)
      ctx.lineTo(px - triSize, py - 16 + triSize)
      ctx.lineTo(px + triSize, py - 16 + triSize)
    }
    ctx.closePath()
    ctx.fillStyle = el.color
    ctx.fill()

    // 标签
    ctx.fillStyle = el.color
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = el.position === 'top' ? 'bottom' : 'top'
    const textY = el.position === 'top' ? py - 2 : py + 2
    ctx.fillText(el.label, px, textY)
  }

  private drawNull(el: NullMarker) {
    const ctx = this.ctx
    const nullColor = this.css('--canvas-null')
    ctx.strokeStyle = nullColor
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.strokeRect(el.x - 20, el.y - 14, 40, 28)
    ctx.setLineDash([])

    ctx.fillStyle = nullColor
    ctx.font = '13px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(el.label || 'null', el.x, el.y)
  }

  private drawDescription(text: string) {
    const ctx = this.ctx
    ctx.fillStyle = this.css('--canvas-desc')
    ctx.font = '15px "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(text, this.width / 2, this.height - 16)
  }
}
