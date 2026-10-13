---
title: ODE4EC-AMS News
description: News and updates from the ODE4EC-AMS project.
---

<script setup>
import { data as posts } from '../../news/posts.data.ts'
const amsPosts = posts.filter(p => p.tags.includes('ode4ec-ams'))
</script>

# News

News and updates about ODE4EC-AMS. For news from all three ODE4EC projects, see [all news](/news/).

<div v-for="post in amsPosts" :key="post.url" class="post-entry">
  <div class="post-head">
    <span class="date">{{ post.date }}</span>
    <a :href="post.url">{{ post.title }}</a>
  </div>
  <div class="tags" v-if="post.tags.length">
    <span v-for="tag in post.tags" :key="tag" class="tag" :class="{ current: tag === 'ode4ec-ams' }">{{ tag }}</span>
  </div>
</div>

<p v-if="!amsPosts.length">No news yet. Check back soon.</p>

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
}
.tag.current {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
