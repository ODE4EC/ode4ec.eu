<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.tags && frontmatter.tags.length" class="post-tags">
    <span v-for="tag in frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
  </div>
</template>

<style scoped>
.post-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.tag {
  display: inline-flex;
  align-items: center;
  height: 1.5rem;
  padding: 0 0.6rem;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}
.tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
