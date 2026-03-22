import type { AnimationFrame, DrawableElement, NodeElement } from '../../engine/types'

// 链表节点定义
interface ListNode {
  id: string
  val: number
  next: ListNode | null
}

// 构建示例链表
// 链表 A: 4 -> 1 -> [8] -> 4 -> 5
// 链表 B: 5 -> 6 -> 1 -> [8] -> 4 -> 5
// 相交节点: 8
function buildLinkedLists() {
  // 共享部分
  const shared3: ListNode = { id: 's3', val: 5, next: null }
  const shared2: ListNode = { id: 's2', val: 4, next: shared3 }
  const shared1: ListNode = { id: 's1', val: 8, next: shared2 }

  // 链表A独有部分
  const a2: ListNode = { id: 'a2', val: 1, next: shared1 }
  const a1: ListNode = { id: 'a1', val: 4, next: a2 }

  // 链表B独有部分
  const b3: ListNode = { id: 'b3', val: 1, next: shared1 }
  const b2: ListNode = { id: 'b2', val: 6, next: b3 }
  const b1: ListNode = { id: 'b1', val: 5, next: b2 }

  return { headA: a1, headB: b1, intersection: shared1 }
}

// 节点布局坐标
// 链表A独有:   a1(100,100) -> a2(210,100)
//                                          \-> s1(370,170) -> s2(480,170) -> s3(590,170)
// 链表B独有:   b1(50,240) -> b2(160,240) -> b3(270,240)
function getNodePositions(): Record<string, { x: number; y: number }> {
  return {
    a1: { x: 110, y: 90 },
    a2: { x: 230, y: 90 },
    s1: { x: 380, y: 165 },
    s2: { x: 500, y: 165 },
    s3: { x: 620, y: 165 },
    b1: { x: 80, y: 240 },
    b2: { x: 200, y: 240 },
    b3: { x: 320, y: 240 },
  }
}

// 将链表转为数组方便遍历
function listToArray(head: ListNode | null): ListNode[] {
  const arr: ListNode[] = []
  let curr = head
  while (curr) {
    arr.push(curr)
    curr = curr.next
  }
  return arr
}

export function generateSteps(): AnimationFrame[] {
  const { headA, headB, intersection } = buildLinkedLists()
  const pos = getNodePositions()
  const nodesA = listToArray(headA)
  const nodesB = listToArray(headB)
  const steps: AnimationFrame[] = []

  // 基础元素（节点和箭头）
  function baseElements(highlightId?: string): DrawableElement[] {
    const elements: DrawableElement[] = []

    // 所有节点
    const allNodes = ['a1', 'a2', 's1', 's2', 's3', 'b1', 'b2', 'b3']
    const nodeMap: Record<string, number> = {
      a1: 4, a2: 1, s1: 8, s2: 4, s3: 5,
      b1: 5, b2: 6, b3: 1,
    }

    for (const id of allNodes) {
      const p = pos[id]
      elements.push({
        type: 'node',
        id,
        x: p.x,
        y: p.y,
        value: nodeMap[id],
        highlight: id === highlightId ? '#22c55e' : undefined,
      })
    }

    // 链表A的箭头
    elements.push({ type: 'arrow', fromId: 'a1', toId: 'a2' })
    elements.push({ type: 'arrow', fromId: 'a2', toId: 's1' })
    // 共享部分箭头
    elements.push({ type: 'arrow', fromId: 's1', toId: 's2' })
    elements.push({ type: 'arrow', fromId: 's2', toId: 's3' })
    // 链表B的箭头
    elements.push({ type: 'arrow', fromId: 'b1', toId: 'b2' })
    elements.push({ type: 'arrow', fromId: 'b2', toId: 'b3' })
    elements.push({ type: 'arrow', fromId: 'b3', toId: 's1' })

    return elements
  }

  // 模拟双指针算法
  // pA 从 headA 出发，pB 从 headB 出发
  // pA 走完 A 后跳到 B 头，pB 走完 B 后跳到 A 头
  let pA: ListNode | null = headA
  let pB: ListNode | null = headB
  let pASwitched = false
  let pBSwitched = false

  // 初始状态
  steps.push({
    elements: [
      ...baseElements(),
      { type: 'pointer', targetId: pA!.id, label: 'pA', color: '#3b82f6', position: 'top' },
      { type: 'pointer', targetId: pB!.id, label: 'pB', color: '#ef4444', position: 'bottom' },
    ],
    description: '初始化：pA 指向链表A头部，pB 指向链表B头部',
  })

  let stepCount = 0
  const maxSteps = 20 // 安全限制

  while (pA !== pB && stepCount < maxSteps) {
    // 移动指针
    const prevPA = pA
    const prevPB = pB

    if (pA === null) {
      pA = headB
      pASwitched = true
    } else {
      pA = pA.next
    }

    if (pB === null) {
      pB = headA
      pBSwitched = true
    } else {
      pB = pB.next
    }

    stepCount++

    // 构建描述
    let desc = ''
    if (prevPA === null) {
      desc = 'pA 到达链表A末尾，跳转到链表B头部；'
    } else {
      desc = `pA 从 ${prevPA.val} 前进；`
    }
    if (prevPB === null) {
      desc += 'pB 到达链表B末尾，跳转到链表A头部'
    } else {
      desc += `pB 从 ${prevPB.val} 前进`
    }

    const elements: DrawableElement[] = baseElements(
      pA !== null && pB !== null && pA === pB ? pA.id : undefined
    )

    // pA 指针
    if (pA !== null) {
      elements.push({
        type: 'pointer',
        targetId: pA.id,
        label: 'pA',
        color: '#3b82f6',
        position: pASwitched ? 'bottom' : 'top',
      })
    } else {
      // pA 到达 null
      elements.push({
        type: 'null',
        x: 710,
        y: pASwitched ? 240 : 90,
        label: 'null',
      })
      elements.push({
        type: 'pointer',
        targetId: 's3', // 指向最后一个节点旁
        label: 'pA→null',
        color: '#3b82f6',
        position: pASwitched ? 'bottom' : 'top',
      })
    }

    // pB 指针
    if (pB !== null) {
      elements.push({
        type: 'pointer',
        targetId: pB.id,
        label: 'pB',
        color: '#ef4444',
        position: pBSwitched ? 'top' : 'bottom',
      })
    } else {
      elements.push({
        type: 'null',
        x: 710,
        y: pBSwitched ? 90 : 240,
        label: 'null',
      })
      elements.push({
        type: 'pointer',
        targetId: 's3',
        label: 'pB→null',
        color: '#ef4444',
        position: pBSwitched ? 'top' : 'bottom',
      })
    }

    steps.push({ elements, description: desc })
  }

  // 最终相遇
  if (pA === pB && pA !== null) {
    steps.push({
      elements: [
        ...baseElements(pA.id),
        { type: 'pointer', targetId: pA.id, label: 'pA', color: '#3b82f6', position: 'top' },
        { type: 'pointer', targetId: pB!.id, label: 'pB', color: '#ef4444', position: 'bottom' },
      ],
      description: `🎉 pA 和 pB 在节点 ${pA.val} 相遇！这就是相交节点！`,
    })
  }

  return steps
}

export const canvasWidth = 750
export const canvasHeight = 320
