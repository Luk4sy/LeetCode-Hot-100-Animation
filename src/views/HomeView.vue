<template>
  <div class="home">
    <header class="home-header">
      <h1>LeetCode Hot 100 算法动画</h1>
      <p>通过交互式动画，逐步演示 LeetCode 经典算法题的执行过程，直观理解每一步的指针移动与数据变化</p>
    </header>

    <!-- 筛选栏 -->
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">分类：</span>
        <button
          :class="['filter-btn', { active: activeCategory === null }]"
          @click="activeCategory = null"
        >全部</button>
        <button
          v-for="cat in availableCategories"
          :key="cat"
          :class="['filter-btn', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>
      <div class="filter-group">
        <span class="filter-label">难度：</span>
        <button
          :class="['filter-btn', { active: activeDifficulty === null }]"
          @click="activeDifficulty = null"
        >全部</button>
        <button
          :class="['filter-btn diff-easy', { active: activeDifficulty === 'easy' }]"
          @click="activeDifficulty = 'easy'"
        >简单</button>
        <button
          :class="['filter-btn diff-medium', { active: activeDifficulty === 'medium' }]"
          @click="activeDifficulty = 'medium'"
        >中等</button>
        <button
          :class="['filter-btn diff-hard', { active: activeDifficulty === 'hard' }]"
          @click="activeDifficulty = 'hard'"
        >困难</button>
      </div>
    </div>

    <!-- 按分类展示 -->
    <template v-for="cat in displayCategories" :key="cat">
      <div v-if="getProblemsForCategory(cat).length > 0" class="category-section">
        <h2 class="category-title">{{ cat }}</h2>
        <div class="problem-grid">
          <ProblemCard
            v-for="problem in getProblemsForCategory(cat)"
            :key="problem.id"
            :problem="problem"
          />
        </div>
      </div>
    </template>

    <div v-if="filteredList.length === 0" class="empty">
      暂无匹配的题目
    </div>

    <footer class="home-footer">
      Made by Lukas
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProblemCard from '../components/ProblemCard.vue'
import { problemList } from '../problems/registry'
import { categoryOrder, type Category } from '../problems/types'

const activeCategory = ref<Category | null>(null)
const activeDifficulty = ref<'easy' | 'medium' | 'hard' | null>(null)

// 只展示有题目的分类
const availableCategories = computed(() =>
  categoryOrder.filter(cat => problemList.some(p => p.category === cat))
)

// 筛选后的题目列表
const filteredList = computed(() =>
  problemList.filter(p => {
    if (activeCategory.value && p.category !== activeCategory.value) return false
    if (activeDifficulty.value && p.difficulty !== activeDifficulty.value) return false
    return true
  })
)

// 要展示的分类
const displayCategories = computed(() =>
  activeCategory.value ? [activeCategory.value] : availableCategories.value
)

// 获取某个分类下筛选后的题目
function getProblemsForCategory(cat: Category) {
  return filteredList.value.filter(p => p.category === cat)
}
</script>

<style scoped>
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
}

.home-header {
  text-align: center;
  margin-bottom: 32px;
}

.home-header h1 {
  font-size: 28px;
  color: var(--text);
  margin: 0 0 8px;
}

.home-header p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

/* 筛选栏 */
.filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  min-width: 48px;
}

.filter-btn {
  font-size: 13px;
  padding: 4px 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--btn-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.filter-btn.diff-easy.active {
  background: #16a34a;
  border-color: #16a34a;
}

.filter-btn.diff-medium.active {
  background: #d97706;
  border-color: #d97706;
}

.filter-btn.diff-hard.active {
  background: #db2777;
  border-color: #db2777;
}

/* 分类区块 */
.category-section {
  margin-bottom: 32px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 14px;
  padding-left: 12px;
  border-left: 3px solid #3b82f6;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
}

.home-footer {
  text-align: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  font-size: 14px;
  color: var(--text-muted);
}
</style>
