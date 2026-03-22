import type { AnimationFrame, DrawableElement } from '../../engine/types'

interface ListNode {
  id: string
  val: number
  next: ListNode | null
}

function buildList(): ListNode {
  const n5: ListNode = { id: 'n5', val: 5, next: null }
  const n4: ListNode = { id: 'n4', val: 4, next: n5 }
  const n3: ListNode = { id: 'n3', val: 3, next: n4 }
  const n2: ListNode = { id: 'n2', val: 2, next: n3 }
  const n1: ListNode = { id: 'n1', val: 1, next: n2 }
  return n1
}

// 节点固定位置（水平排列）
const nodePositions: Record<string, { x: number; y: number }> = {
  n1: { x: 120, y: 150 },
  n2: { x: 250, y: 150 },
  n3: { x: 380, y: 150 },
  n4: { x: 510, y: 150 },
  n5: { x: 640, y: 150 },
}

const nodeValues: Record<string, number> = {
  n1: 1, n2: 2, n3: 3, n4: 4, n5: 5,
}

const nodeIds = ['n1', 'n2', 'n3', 'n4', 'n5']

export function generateSteps(): AnimationFrame[] {
  const steps: AnimationFrame[] = []

  // 记录当前箭头方向状态：true = 正向(→), false = 反向(←)
  // arrows[i] 表示 nodeIds[i] -> nodeIds[i+1] 的箭头
  const arrows: ('forward' | 'reversed' | 'none')[] = ['forward', 'forward', 'forward', 'forward']

  function buildFrame(
    prevId: string | null,
    currId: string | null,
    nextId: string | null,
    arrowState: typeof arrows,
    highlightId?: string,
  ): DrawableElement[] {
    const elements: DrawableElement[] = []

    // 节点
    for (const id of nodeIds) {
      const p = nodePositions[id]
      elements.push({
        type: 'node',
        id,
        x: p.x,
        y: p.y,
        value: nodeValues[id],
        highlight: id === highlightId ? '#22c55e' : undefined,
      })
    }

    // 箭头
    for (let i = 0; i < arrowState.length; i++) {
      if (arrowState[i] === 'forward') {
        elements.push({ type: 'arrow', fromId: nodeIds[i], toId: nodeIds[i + 1], color: '#9ca3af' })
      } else if (arrowState[i] === 'reversed') {
        elements.push({ type: 'arrow', fromId: nodeIds[i + 1], toId: nodeIds[i], color: '#f59e0b' })
      }
    }

    // null 标记（prev 初始为 null 时画在左侧）
    if (prevId === null) {
      elements.push({ type: 'null', x: 40, y: 80, label: 'null' })
    }

    // 指针标记
    if (prevId !== null) {
      elements.push({ type: 'pointer', targetId: prevId, label: 'prev', color: '#8b5cf6', position: 'top' })
    }
    if (currId !== null) {
      elements.push({ type: 'pointer', targetId: currId, label: 'curr', color: '#3b82f6', position: 'top' })
    }
    if (nextId !== null) {
      elements.push({ type: 'pointer', targetId: nextId, label: 'next', color: '#ef4444', position: 'bottom' })
    }

    return elements
  }

  // Step 0: 初始状态
  steps.push({
    elements: [
      ...buildFrame(null, 'n1', null, [...arrows]),
    ],
    description: '初始化：prev = null，curr 指向头节点 1',
  })

  // 模拟迭代反转过程
  // curr 从 n1 开始，每步：next = curr.next, curr.next = prev, prev = curr, curr = next
  const currSequence = [0, 1, 2, 3, 4] // indices into nodeIds
  for (let i = 0; i < currSequence.length; i++) {
    const currIdx = currSequence[i]
    const currNode = nodeIds[currIdx]
    const nextNode = currIdx + 1 < nodeIds.length ? nodeIds[currIdx + 1] : null

    // Step: 保存 next
    if (nextNode) {
      steps.push({
        elements: buildFrame(
          i > 0 ? nodeIds[currIdx - 1] : null,
          currNode,
          nextNode,
          [...arrows],
        ),
        description: `保存 next = ${nodeValues[nextNode]}，防止断链`,
      })
    }

    // Step: 反转 curr.next = prev（修改箭头方向）
    if (currIdx > 0) {
      arrows[currIdx - 1] = 'reversed'
    }
    // 断开 curr 到 next 的箭头
    if (currIdx < arrows.length) {
      arrows[currIdx] = 'none'
    }

    steps.push({
      elements: buildFrame(
        i > 0 ? nodeIds[currIdx - 1] : null,
        currNode,
        nextNode,
        [...arrows],
        currNode,
      ),
      description: `将节点 ${nodeValues[currNode]} 的 next 指向 prev${i > 0 ? `（节点 ${nodeValues[nodeIds[currIdx - 1]]}）` : '（null）'}`,
    })

    // Step: prev = curr, curr = next
    // 恢复正向箭头用于后续显示
    if (currIdx < arrows.length && nextNode) {
      arrows[currIdx] = 'none'
    }

    if (nextNode) {
      steps.push({
        elements: buildFrame(
          currNode,
          nextNode,
          null,
          [...arrows],
        ),
        description: `prev 移到节点 ${nodeValues[currNode]}，curr 移到节点 ${nodeValues[nextNode]}`,
      })
    }
  }

  // 最终结果：所有箭头已反转
  const finalElements: DrawableElement[] = []
  for (const id of nodeIds) {
    const p = nodePositions[id]
    finalElements.push({
      type: 'node', id, x: p.x, y: p.y,
      value: nodeValues[id],
      highlight: '#22c55e',
    })
  }
  for (let i = 0; i < arrows.length; i++) {
    finalElements.push({ type: 'arrow', fromId: nodeIds[i + 1], toId: nodeIds[i], color: '#22c55e' })
  }
  finalElements.push({ type: 'pointer', targetId: 'n5', label: 'head', color: '#22c55e', position: 'top' })

  steps.push({
    elements: finalElements,
    description: '🎉 反转完成！新的头节点为 5，链表变为 5→4→3→2→1',
  })

  return steps
}

export const canvasWidth = 750
export const canvasHeight = 300
