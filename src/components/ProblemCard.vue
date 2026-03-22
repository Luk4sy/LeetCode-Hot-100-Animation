<template>
  <div class="problem-card" @click="$router.push(`/problem/${problem.id}`)">
    <div class="card-header">
      <a class="card-title" :href="problem.link" target="_blank" @click.stop>{{
        problem.title
      }}</a>
      <span :class="['badge', `badge-${problem.difficulty}`]">
        {{ difficultyText }}
      </span>
    </div>
    <p class="card-desc">{{ problem.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProblemConfig } from "../problems/types";

const props = defineProps<{
  problem: ProblemConfig;
}>();

const difficultyText = computed(() => {
  const map = { easy: "简单", medium: "中等", hard: "困难" };
  return map[props.problem.difficulty];
});
</script>

<style scoped>
.problem-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-card);
}

.problem-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  background-image: linear-gradient(to right, #3b82f6, #8b5cf6);
  background-size: 0% 2px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 0.2s ease-in-out;
}

.card-title:hover {
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

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 12px;
}


</style>
