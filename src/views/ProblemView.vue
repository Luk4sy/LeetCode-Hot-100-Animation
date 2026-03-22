<template>
  <div class="problem-view">
    <div class="nav-bar">
      <button class="back-btn" @click="$router.push('/')">← 返回列表</button>
    </div>
    <template v-if="problem">
      <div class="problem-info">
        <h1>
          <a :href="problem.link" target="_blank">{{ problem.title }}</a>
        </h1>
        <span :class="['badge', `badge-${problem.difficulty}`]">
          {{ difficultyText }}
        </span>
      </div>
      <p class="problem-desc">
        {{ problem.description }}
      </p>
      <AnimationPlayer :animation="problem.animation" />
    </template>
    <div v-else class="not-found">
      <h2>题目开发中...</h2>
      <p>该题目的动画演示尚未实现</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AnimationPlayer from "../components/AnimationPlayer.vue";
import { problemMap } from "../problems/registry";

const props = defineProps<{
  id: string;
}>();

const problem = computed(() => problemMap[props.id]);

const difficultyText = computed(() => {
  if (!problem.value) return "";
  const map = { easy: "简单", medium: "中等", hard: "困难" };
  return map[problem.value.difficulty];
});
</script>

<style scoped>
.problem-view {
  max-width: 860px;
  margin: 0 auto;
  padding: 30px 20px;
}

.nav-bar {
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.back-btn:hover {
  background: var(--btn-hover);
  border-color: var(--border-hover);
}

.problem-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.problem-info h1 {
  font-size: 24px;
  color: var(--text);
  margin: 0;
}

.problem-info h1 a {
  color: var(--text);
  text-decoration: none;
  background-image: linear-gradient(to right, #3b82f6, #8b5cf6);
  background-size: 0% 2px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out;
}

.problem-info h1 a:hover {
  background-size: 100% 2px;
}

.badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.badge-easy {
  background: #dcfce7;
  color: #16a34a;
}
.badge-medium {
  background: #fef3c7;
  color: #d97706;
}
.badge-hard {
  background: #fce7f3;
  color: #db2777;
}

.problem-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 30px;
}

.not-found {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

.not-found h2 {
  margin: 0 0 8px;
  color: var(--text-secondary);
}
</style>
