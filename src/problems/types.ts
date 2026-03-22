import type { ProblemAnimation } from "../engine/types";

export type Category =
  | "哈希"
  | "双指针"
  | "滑动窗口"
  | "子串"
  | "普通数组"
  | "矩阵"
  | "链表"
  | "二叉树"
  | "图论"
  | "二分查找"
  | "栈"
  | "堆"
  | "贪心算法"
  | "动态规划"
  | "多维动态规划"
  | "技巧";

export const categoryOrder: Category[] = [
  "哈希", "双指针", "滑动窗口", "子串", "普通数组", "矩阵",
  "链表", "二叉树", "图论", "二分查找", "栈", "堆",
  "贪心算法", "动态规划", "多维动态规划", "技巧",
];

export interface ProblemConfig {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: Category;
  description: string;
  link: string;
  animation: ProblemAnimation;
}
