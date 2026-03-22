export const meta = {
  id: "283",
  title: "283. 移动零",
  difficulty: "easy" as const,
  category: "普通数组" as const,
  link: "https://leetcode.cn/problems/move-zeroes/",
  description:
    "给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。使用双指针法：slow 指向下一个非零元素应放置的位置，fast 遍历数组寻找非零元素并与 slow 交换。",
};
