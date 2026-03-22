import type { AnimationFrame, DrawableElement } from '../../engine/types'

// 链表: 3 -> 2 -> 0 -> -4 -> 7 -> 1 -> (回到 2)
//       n1    n2    n3    n4    n5   n6
// n1 是入口，n2~n6 构成环

const nodeIds = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']
const nodeValues: Record<string, number | string> = {
  n1: 3, n2: 2, n3: 0, n4: -4, n5: 7, n6: 1,
}

// 布局: n1 在左侧, n2~n6 构成一个五边形环
const nodePositions: Record<string, { x: number; y: number }> = {
  n1: { x: 80, y: 150 },
  n2: { x: 230, y: 60 },
  n3: { x: 420, y: 60 },
  n4: { x: 540, y: 150 },
  n5: { x: 420, y: 240 },
  n6: { x: 230, y: 240 },
}

// 箭头: n1->n2, n2->n3, n3->n4, n4->n5, n5->n6, n6->n2 (环回)
const arrowDefs: [string, string][] = [
  ['n1', 'n2'],
  ['n2', 'n3'],
  ['n3', 'n4'],
  ['n4', 'n5'],
  ['n5', 'n6'],
  ['n6', 'n2'], // 环回
]

function buildNodes(highlights?: Record<string, string>): DrawableElement[] {
  return nodeIds.map(id => ({
    type: 'node' as const,
    id,
    x: nodePositions[id].x,
    y: nodePositions[id].y,
    value: nodeValues[id],
    highlight: highlights?.[id],
  }))
}

function buildArrows(color?: string): DrawableElement[] {
  return arrowDefs.map(([from, to]) => ({
    type: 'arrow' as const,
    fromId: from,
    toId: to,
    color,
  }))
}

// 按 next 指针的遍历顺序（足够长以覆盖相遇）
// n1 -> n2 -> n3 -> n4 -> n5 -> n6 -> n2 -> n3 -> n4 -> n5 -> n6 -> n2 -> ...
const traversal = [
  'n1', 'n2', 'n3', 'n4', 'n5', 'n6',
  'n2', 'n3', 'n4', 'n5', 'n6',
  'n2', 'n3', 'n4', 'n5', 'n6',
]

export function generateSteps(): AnimationFrame[] {
  const steps: AnimationFrame[] = []

  // 初始状态
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(),
      { type: 'pointer', targetId: 'n1', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n1', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: '初始化：slow 和 fast 都指向头节点 3',
  })

  // slow 每次走1步(index+1), fast 每次走2步(index+2)
  // slow: 0->1->2->3->4->5->6(=n2)->7(=n3)
  // fast: 0->2->4->6(=n2)->8(=n4)->10(=n6)->12(=n3)
  // 相遇: slow=7(n3), fast=? 让我们手算
  // step1: slow=1(n2), fast=2(n3)
  // step2: slow=2(n3), fast=4(n5)
  // step3: slow=3(n4), fast=6(n2)
  // step4: slow=4(n5), fast=8(n4)
  // step5: slow=5(n6), fast=10(n6) -> 相遇!

  const moveSteps: { slow: number; fast: number; desc: string }[] = [
    { slow: 1, fast: 2, desc: 'slow 走一步到节点 2，fast 走两步到节点 0' },
    { slow: 2, fast: 4, desc: 'slow 走一步到节点 0，fast 走两步到节点 7' },
    { slow: 3, fast: 6, desc: 'slow 走一步到节点 -4，fast 走两步到节点 2（绕回环内）' },
    { slow: 4, fast: 8, desc: 'slow 走一步到节点 7，fast 走两步到节点 -4' },
    { slow: 5, fast: 10, desc: 'slow 走一步到节点 1，fast 走两步到节点 1' },
  ]

  for (const step of moveSteps) {
    const slowNode = traversal[step.slow]
    const fastNode = traversal[step.fast]
    const met = slowNode === fastNode

    const highlights: Record<string, string> = {}
    if (met) highlights[slowNode] = '#22c55e'

    const elements: DrawableElement[] = [
      ...buildNodes(highlights),
      ...buildArrows(),
    ]

    elements.push({
      type: 'pointer', targetId: slowNode, label: 'slow', color: '#3b82f6', position: 'top',
    })
    elements.push({
      type: 'pointer', targetId: fastNode, label: 'fast', color: '#ef4444', position: 'bottom',
    })

    steps.push({ elements, description: step.desc })
  }

  // 最终相遇高亮
  steps.push({
    elements: [
      ...buildNodes({ n6: '#22c55e' }),
      ...buildArrows('#22c55e'),
      { type: 'pointer', targetId: 'n6', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n6', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: '🎉 slow 和 fast 在节点 1 相遇！链表存在环！',
  })

  return steps
}

export const canvasWidth = 650
export const canvasHeight = 310
