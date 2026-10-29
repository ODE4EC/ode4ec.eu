<script setup lang="ts">
// The news list, newest first: every post, or only those tagged ode4ec-<project>.
import { computed } from 'vue'
import { data as posts } from '../../news/posts.data'
import { formatDate } from './format'
import type { ProjectId } from './data/partners'

const props = defineProps<{ project?: ProjectId }>()

const projectTag = computed(() => props.project && `ode4ec-${props.project}`)
const projectPosts = computed(() => (projectTag.value ? posts.filter((p) => p.tags.includes(projectTag.value!)) : posts))
</script>

<template>
  <div>
    <div v-for="post in projectPosts" :key="post.url" class="post-entry">
      <div class="post-head">
        <time class="date" :datetime="post.date">{{ formatDate(post.date) }}</time>
        <a :href="post.url">{{ post.title }}</a>
      </div>
      <div class="tags" v-if="post.tags.length">
        <span v-for="tag in post.tags" :key="tag" class="tag" :class="{ current: tag === projectTag }">{{ tag }}</span>
      </div>
    </div>

    <p v-if="!projectPosts.length">No news yet. Check back soon.</p>
  </div>
</template>

<style scoped>
.post-entry {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.post-head {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.date {
  color: var(--vp-c-text-2);
  white-space: nowrap;
  font-size: 0.9rem;
}
.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 0.35rem;
}
.tag.current {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
