import type { AnimationFrame, DrawableElement } from "../../engine/types";

// 链表 L1: 1 -> 2 -> 4 -> 6 -> 8
// 链表 L2: 1 -> 3 -> 4 -> 5 -> 7
// 合并结果: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6 -> 7 -> 8

const l1Ids = ["l1a", "l1b", "l1c", "l1d", "l1e"];
const l2Ids = ["l2a", "l2b", "l2c", "l2d", "l2e"];
const l1Vals: Record<string, number> = { l1a: 1, l1b: 2, l1c: 4, l1d: 6, l1e: 8 };
const l2Vals: Record<string, number> = { l2a: 1, l2b: 3, l2c: 4, l2d: 5, l2e: 7 };

const l1Pos: Record<string, { x: number; y: number }> = {
  l1a: { x: 100, y: 90 },
  l1b: { x: 220, y: 90 },
  l1c: { x: 340, y: 90 },
  l1d: { x: 460, y: 90 },
  l1e: { x: 580, y: 90 },
};
const l2Pos: Record<string, { x: number; y: number }> = {
  l2a: { x: 100, y: 190 },
  l2b: { x: 220, y: 190 },
  l2c: { x: 340, y: 190 },
  l2d: { x: 460, y: 190 },
  l2e: { x: 580, y: 190 },
};

// 结果链表的节点位置（水平排列在底部）
const resXStart = 60;
const resXGap = 90;
const resY = 310;

// 合并过程: 双指针比较选较小的
const mergeOrder: { srcId: string; val: number; fromL1: boolean }[] = [
  { srcId: "l1a", val: 1, fromL1: true },   // p1=1 vs p2=1, 选 p1
  { srcId: "l2a", val: 1, fromL1: false },   // p1=2 vs p2=1, 选 p2
  { srcId: "l1b", val: 2, fromL1: true },    // p1=2 vs p2=3, 选 p1
  { srcId: "l2b", val: 3, fromL1: false },   // p1=4 vs p2=3, 选 p2
  { srcId: "l1c", val: 4, fromL1: true },    // p1=4 vs p2=4, 选 p1
  { srcId: "l2c", val: 4, fromL1: false },   // p1=6 vs p2=4, 选 p2
  { srcId: "l2d", val: 5, fromL1: false },   // p1=6 vs p2=5, 选 p2
  { srcId: "l1d", val: 6, fromL1: true },    // p1=6 vs p2=7, 选 p1
  { srcId: "l2e", val: 7, fromL1: false },   // p1=8 vs p2=7, 选 p2
  { srcId: "l1e", val: 8, fromL1: true },    // L2 完, 接 L1 剩余
];

export function generateSteps(): AnimationFrame[] {
  const steps: AnimationFrame[] = [];

  let p1 = 0;
  let p2 = 0;
  const merged: { id: string; val: number; x: number; y: number }[] = [];

  function buildFrame(
    highlightSrc?: string,
    desc?: string,
    p1Idx?: number,
    p2Idx?: number,
    done?: boolean
  ): AnimationFrame {
    const elements: DrawableElement[] = [];

    // L1 节点 + 箭头
    for (const id of l1Ids) {
      elements.push({
        type: "node", id, x: l1Pos[id].x, y: l1Pos[id].y,
        value: l1Vals[id],
        highlight: id === highlightSrc ? "#3b82f6" : undefined,
      });
    }
    for (let i = 0; i < l1Ids.length - 1; i++) {
      elements.push({ type: "arrow", fromId: l1Ids[i], toId: l1Ids[i + 1] });
    }

    // L2 节点 + 箭头
    for (const id of l2Ids) {
      elements.push({
        type: "node", id, x: l2Pos[id].x, y: l2Pos[id].y,
        value: l2Vals[id],
        highlight: id === highlightSrc ? "#ef4444" : undefined,
      });
    }
    for (let i = 0; i < l2Ids.length - 1; i++) {
      elements.push({ type: "arrow", fromId: l2Ids[i], toId: l2Ids[i + 1] });
    }

    // L1 指针
    if (p1Idx !== undefined && p1Idx < l1Ids.length) {
      elements.push({ type: "pointer", targetId: l1Ids[p1Idx], label: "p1", color: "#3b82f6", position: "top" });
    }

    // L2 指针
    if (p2Idx !== undefined && p2Idx < l2Ids.length) {
      elements.push({ type: "pointer", targetId: l2Ids[p2Idx], label: "p2", color: "#ef4444", position: "bottom" });
    }

    // 结果链表
    for (let i = 0; i < merged.length; i++) {
      const m = merged[i];
      elements.push({
        type: "node", id: m.id, x: m.x, y: m.y, value: m.val,
        highlight: done ? "#22c55e" : i === merged.length - 1 ? "#f59e0b" : undefined,
      });
      if (i > 0) {
        elements.push({
          type: "arrow", fromId: merged[i - 1].id, toId: m.id,
          color: done ? "#22c55e" : undefined,
        });
      }
    }

    return { elements, description: desc || "" };
  }

  // Step 0: 初始状态
  steps.push(buildFrame(undefined, "初始化：p1 指向 L1 头部（1），p2 指向 L2 头部（1）", 0, 0));

  // 合并过程
  for (let i = 0; i < mergeOrder.length; i++) {
    const { srcId, val, fromL1 } = mergeOrder[i];

    merged.push({ id: `r${i}`, val, x: resXStart + i * resXGap, y: resY });

    if (fromL1) p1++;
    else p2++;

    let desc: string;
    if (fromL1 && p2 < l2Ids.length) {
      desc = `比较 p1=${val} 和 p2=${l2Vals[l2Ids[p2]]}，选择 p1 的 ${val}，p1 后移`;
    } else if (!fromL1 && p1 < l1Ids.length) {
      desc = `比较 p1=${l1Vals[l1Ids[p1]]} 和 p2=${val}，选择 p2 的 ${val}，p2 后移`;
    } else if (fromL1) {
      desc = `L2 已遍历完，将 L1 剩余节点 ${val} 接到结果链表`;
    } else {
      desc = `L1 已遍历完，将 L2 剩余节点 ${val} 接到结果链表`;
    }

    steps.push(buildFrame(srcId, desc, p1, p2));
  }

  // 最终结果
  steps.push(buildFrame(undefined, "🎉 合并完成！结果链表：1→1→2→3→4→4→5→6→7→8", p1, p2, true));

  return steps;
}

export const canvasWidth = 920;
export const canvasHeight = 390;
