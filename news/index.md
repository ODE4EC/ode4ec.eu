<script setup>
import { data as posts } from './posts.data.ts'
</script>

# News & Updates

Stay up to date with the latest developments from the ODE4EC projects.

<div v-for="post in posts" :key="post.url" class="post-entry">
  <div class="post-head">
    <span class="date">{{ post.date }}</span>
    <a :href="post.url">{{ post.title }}</a>
  </div>
  <div class="tags" v-if="post.tags.length">
    <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
  </div>
</div>

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
  transition: background-color 0.2s, color 0.2s;
}
.tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
