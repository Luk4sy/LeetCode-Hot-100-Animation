import type { AnimationFrame, DrawableElement } from "../../engine/types";

// 示例数组: [0, 1, 0, 3, 12]
// 结果:     [1, 3, 12, 0, 0]

const xStart = 90;
const xGap = 110;
const y = 110;

function buildArrayFrame(
  arr: number[],
  highlights: Record<number, string>,
  slowIdx?: number,
  fastIdx?: number,
): DrawableElement[] {
  const elements: DrawableElement[] = [];

  for (let i = 0; i < arr.length; i++) {
    elements.push({
      type: "node",
      id: `n${i}`,
      x: xStart + i * xGap,
      y,
      value: arr[i],
      highlight: highlights[i],
    });
  }

  // 下标标签
  for (let i = 0; i < arr.length; i++) {
    elements.push({
      type: "null",
      x: xStart + i * xGap,
      y: y + 50,
      label: `[${i}]`,
    });
  }

  if (slowIdx !== undefined && slowIdx < arr.length) {
    elements.push({
      type: "pointer",
      targetId: `n${slowIdx}`,
      label: "slow",
      color: "#3b82f6",
      position: "top",
    });
  }

  if (fastIdx !== undefined && fastIdx < arr.length) {
    elements.push({
      type: "pointer",
      targetId: `n${fastIdx}`,
      label: "fast",
      color: "#ef4444",
      position: "bottom",
    });
  }

  return elements;
}

export function generateSteps(): AnimationFrame[] {
  const steps: AnimationFrame[] = [];
  const arr = [0, 1, 0, 3, 12];
  let slow = 0;

  // Step 0: 初始状态
  steps.push({
    elements: buildArrayFrame(arr, {}, 0, 0),
    description: "初始化：slow=0，fast=0，遍历数组寻找非零元素",
  });

  // 遍历 fast 从 0 到 arr.length-1
  for (let fast = 0; fast < arr.length; fast++) {
    if (arr[fast] !== 0) {
      if (fast !== slow) {
        // 高亮即将交换的两个位置
        steps.push({
          elements: buildArrayFrame(arr, { [slow]: "#f59e0b", [fast]: "#f59e0b" }, slow, fast),
          description: `fast 找到非零元素 ${arr[fast]}，与 slow 位置的 ${arr[slow]} 交换`,
        });

        // 执行交换
        const temp = arr[slow];
        arr[slow] = arr[fast];
        arr[fast] = temp;

        // 交换后
        steps.push({
          elements: buildArrayFrame(arr, { [slow]: "#22c55e", [fast]: "#3b82f6" }, slow, fast),
          description: `交换完成：arr[${slow}]=${arr[slow]}，arr[${fast}]=${arr[fast]}`,
        });
      } else {
        // slow === fast, 非零元素已经在正确位置
        steps.push({
          elements: buildArrayFrame(arr, { [fast]: "#22c55e" }, slow, fast),
          description: `arr[${fast}]=${arr[fast]} 非零且已在正确位置，slow 和 fast 同时后移`,
        });
      }
      slow++;
    } else {
      // arr[fast] === 0, fast 跳过
      steps.push({
        elements: buildArrayFrame(arr, { [fast]: "#9ca3af" }, slow, fast),
        description: `arr[${fast}]=0，fast 跳过，继续前进`,
      });
    }
  }

  // 最终结果
  const allGreen: Record<number, string> = {};
  for (let i = 0; i < arr.length; i++) allGreen[i] = "#22c55e";
  steps.push({
    elements: buildArrayFrame(arr, allGreen),
    description: "🎉 移动完成！所有零已移到末尾：[1, 3, 12, 0, 0]",
  });

  return steps;
}

export const canvasWidth = 640;
export const canvasHeight = 250;
