export const meta = {
  id: "21",
  title: "21. 合并两个有序链表",
  difficulty: "easy" as const,
  category: "链表" as const,
  link: "https://leetcode.cn/problems/merge-two-sorted-lists/",
  description:
    "将两个升序链表合并为一个新的升序链表并返回。使用双指针法：比较两个链表当前节点的值，将较小的节点接到结果链表尾部，直到其中一个链表遍历完毕，再将另一个链表剩余部分直接接上。",
};
