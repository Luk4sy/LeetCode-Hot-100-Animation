import type { AnimationFrame, DrawableElement } from '../../engine/types'

// 链表: 1 -> 2 -> 3 -> 4 -> 3 -> 2 -> 1 (回文，7个节点)
const nodeIds = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7']
const nodeValues: Record<string, number> = {
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 3, n6: 2, n7: 1,
}
const nodePositions: Record<string, { x: number; y: number }> = {
  n1: { x: 70, y: 120 },
  n2: { x: 180, y: 120 },
  n3: { x: 290, y: 120 },
  n4: { x: 400, y: 120 },
  n5: { x: 510, y: 120 },
  n6: { x: 620, y: 120 },
  n7: { x: 730, y: 120 },
}

const allForwardArrows: [string, string][] = [
  ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4'], ['n4', 'n5'], ['n5', 'n6'], ['n6', 'n7'],
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

function buildArrows(arrowDefs: [string, string, string?][]): DrawableElement[] {
  return arrowDefs.map(([from, to, color]) => ({
    type: 'arrow' as const,
    fromId: from,
    toId: to,
    color,
  }))
}

export function generateSteps(): AnimationFrame[] {
  const steps: AnimationFrame[] = []

  // ============ Phase 1: 快慢指针找中点 ============

  // slow=n1, fast=n1
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(allForwardArrows),
      { type: 'pointer', targetId: 'n1', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n1', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: '阶段一：快慢指针找中点。slow 和 fast 都从头节点出发',
  })

  // slow=n2, fast=n3
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(allForwardArrows),
      { type: 'pointer', targetId: 'n2', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n3', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: 'slow 走一步到节点 2，fast 走两步到节点 3',
  })

  // slow=n3, fast=n5
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(allForwardArrows),
      { type: 'pointer', targetId: 'n3', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n5', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: 'slow 走一步到节点 3，fast 走两步到节点 3（右）',
  })

  // slow=n4, fast=n7
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(allForwardArrows),
      { type: 'pointer', targetId: 'n4', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n7', label: 'fast', color: '#ef4444', position: 'bottom' },
    ],
    description: 'slow 走一步到节点 4（中点），fast 走两步到节点 1（尾）',
  })

  // fast.next == null，停止。slow 在中点 n4
  steps.push({
    elements: [
      ...buildNodes({ n4: '#f59e0b' }),
      ...buildArrows(allForwardArrows),
      { type: 'pointer', targetId: 'n4', label: 'slow', color: '#3b82f6', position: 'top' },
      { type: 'null', x: 810, y: 120, label: 'fast' },
    ],
    description: 'fast 到达末尾停止。slow 在节点 4 = 中点。后半部分从 slow.next 开始',
  })

  // ============ Phase 2: 反转后半部分 n5->n6->n7 变成 n7->n6->n5 ============

  // 前半部分箭头
  const frontArrows: [string, string][] = [['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4']]

  // 反转第一步: prev=null, curr=n5, next=n6. n5.next = null (断开)
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(frontArrows),
      // n5->n6 箭头断开, n6->n7 还在
      { type: 'arrow', fromId: 'n6', toId: 'n7' },
      { type: 'pointer', targetId: 'n5', label: 'curr', color: '#8b5cf6', position: 'top' },
      { type: 'pointer', targetId: 'n6', label: 'next', color: '#ef4444', position: 'bottom' },
      { type: 'null', x: 510, y: 50, label: 'prev' },
    ],
    description: '阶段二：反转后半部分。curr=3，next=2，将 curr.next 指向 prev(null)',
  })

  // 反转第二步: prev=n5, curr=n6, next=n7. n6.next = n5
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(frontArrows),
      { type: 'arrow', fromId: 'n6', toId: 'n5', color: '#f59e0b' },
      // n6->n7 断开
      { type: 'pointer', targetId: 'n5', label: 'prev', color: '#8b5cf6', position: 'top' },
      { type: 'pointer', targetId: 'n6', label: 'curr', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n7', label: 'next', color: '#ef4444', position: 'bottom' },
    ],
    description: 'prev 移到 3，curr 移到 2。将 curr.next 指向 prev（节点 3）',
  })

  // 反转第三步: prev=n6, curr=n7, next=null. n7.next = n6
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(frontArrows),
      { type: 'arrow', fromId: 'n6', toId: 'n5', color: '#f59e0b' },
      { type: 'arrow', fromId: 'n7', toId: 'n6', color: '#f59e0b' },
      { type: 'pointer', targetId: 'n6', label: 'prev', color: '#8b5cf6', position: 'top' },
      { type: 'pointer', targetId: 'n7', label: 'curr', color: '#3b82f6', position: 'top' },
    ],
    description: 'prev 移到 2，curr 移到 1。将 curr.next 指向 prev（节点 2）',
  })

  // 反转完成，rev 指向 n7（新头）
  steps.push({
    elements: [
      ...buildNodes(),
      ...buildArrows(frontArrows),
      { type: 'arrow', fromId: 'n6', toId: 'n5', color: '#f59e0b' },
      { type: 'arrow', fromId: 'n7', toId: 'n6', color: '#f59e0b' },
      { type: 'pointer', targetId: 'n7', label: 'rev', color: '#f59e0b', position: 'top' },
    ],
    description: '后半部分反转完成！反转后链表：1→2→3（从 n7 开始）',
  })

  // 反转后的箭头集合
  const revArrows: [string, string, string][] = [
    ['n6', 'n5', '#f59e0b'],
    ['n7', 'n6', '#f59e0b'],
  ]

  // ============ Phase 3: 逐一比较 ============

  // 比较 n1(1) 和 n7(1)
  steps.push({
    elements: [
      ...buildNodes({ n1: '#3b82f6', n7: '#3b82f6' }),
      ...buildArrows(frontArrows),
      ...buildArrows(revArrows),
      { type: 'pointer', targetId: 'n1', label: 'p1', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n7', label: 'p2', color: '#f59e0b', position: 'top' },
    ],
    description: '阶段三：逐一比较。p1=1，p2=1 ✓ 相等！',
  })

  // 比较 n2(2) 和 n6(2)
  steps.push({
    elements: [
      ...buildNodes({ n1: '#22c55e', n7: '#22c55e', n2: '#3b82f6', n6: '#3b82f6' }),
      ...buildArrows(frontArrows),
      ...buildArrows(revArrows),
      { type: 'pointer', targetId: 'n2', label: 'p1', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n6', label: 'p2', color: '#f59e0b', position: 'top' },
    ],
    description: 'p1 前进到 2，p2 前进到 2。p1=2，p2=2 ✓ 相等！',
  })

  // 比较 n3(3) 和 n5(3)
  steps.push({
    elements: [
      ...buildNodes({ n1: '#22c55e', n7: '#22c55e', n2: '#22c55e', n6: '#22c55e', n3: '#3b82f6', n5: '#3b82f6' }),
      ...buildArrows(frontArrows),
      ...buildArrows(revArrows),
      { type: 'pointer', targetId: 'n3', label: 'p1', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: 'n5', label: 'p2', color: '#f59e0b', position: 'top' },
    ],
    description: 'p1 前进到 3，p2 前进到 3。p1=3，p2=3 ✓ 相等！',
  })

  // p2 到达 null，比较结束
  const allGreen: Record<string, string> = {}
  for (const id of nodeIds) allGreen[id] = '#22c55e'

  steps.push({
    elements: [
      ...buildNodes(allGreen),
      ...buildArrows(allForwardArrows.map(([f, t]) => [f, t, '#22c55e'] as [string, string, string])),
    ],
    description: '🎉 所有节点比较完毕，该链表是回文链表！1→2→3→4→3→2→1',
  })

  return steps
}

export const canvasWidth = 800
export const canvasHeight = 280
