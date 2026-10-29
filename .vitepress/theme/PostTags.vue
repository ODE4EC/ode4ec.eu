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
</style>
