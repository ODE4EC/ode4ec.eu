<script setup lang="ts">
import { ref } from 'vue'
import { data as posts } from '../../news/posts.data.ts'

const track = ref<HTMLElement | null>(null)

function scrollByCards(dir: number) {
  track.value?.scrollBy({ left: dir * 340, behavior: 'smooth' })
}
</script>

<template>
  <section class="ode-news">
    <div class="ode-news__inner">
      <div class="ode-news__header">
        <div>
          <p class="ode-news__eyebrow">Latest</p>
          <h2 class="ode-news__heading">News &amp; Updates</h2>
        </div>
        <div class="ode-news__controls">
          <button class="ode-news__nav-btn" type="button" aria-label="Scroll left" @click="scrollByCards(-1)">‹</button>
          <button class="ode-news__nav-btn" type="button" aria-label="Scroll right" @click="scrollByCards(1)">›</button>
        </div>
      </div>

      <div v-if="posts.length" ref="track" class="ode-news__track">
        <a v-for="post in posts.slice(0, 10)" :key="post.url" :href="post.url" class="ode-news__card">
          <div class="ode-news__media">
            <img v-if="post.image" :src="post.image" alt="" loading="lazy" />
            <svg v-else class="ode-news__media-fallback" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="320" height="150" fill="#0a2455" />
              <g fill="none" stroke-linecap="round">
                <path d="M-10,40 L120,40 Q136,40 136,56 L136,160" stroke="#ffd617" stroke-width="3" opacity="0.7" />
                <path d="M-10,70 L90,70 Q106,70 106,86 L106,160" stroke="#7fb0ff" stroke-width="3" opacity="0.5" />
                <path d="M330,30 L230,30 Q214,30 214,46 L214,160" stroke="#7fb0ff" stroke-width="3" opacity="0.5" />
                <path d="M330,60 L260,60 Q244,60 244,76 L244,160" stroke="#ffd617" stroke-width="3" opacity="0.45" />
              </g>
              <circle cx="60" cy="40" r="3.5" fill="#ffd617" opacity="0.85" />
              <circle cx="290" cy="30" r="3.5" fill="#7fb0ff" opacity="0.8" />
              <g transform="translate(150,84)">
                <rect x="3" y="5" width="36" height="36" rx="5" fill="#000b1e" opacity="0.5" />
                <rect width="40" height="40" rx="5" fill="#12305f" stroke="rgba(160,190,240,0.4)" stroke-width="1.5" />
                <circle cx="8" cy="8" r="2.5" fill="#ffd617" />
              </g>
            </svg>
            <span class="ode-news__date">{{ post.date }}</span>
          </div>
          <div class="ode-news__body">
            <h3>{{ post.title }}</h3>
            <span class="ode-news__more">Read more →</span>
          </div>
        </a>
      </div>

      <a href="/news/" class="ode-news__all">All news →</a>
    </div>
  </section>
</template>

<style scoped>
.ode-news {
  padding: 24px 24px 88px;
}

@media (min-width: 640px) {
  .ode-news { padding: 32px 48px 104px; }
}

.ode-news__inner {
  max-width: 1152px;
  margin: 0 auto;
}

.ode-news__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.ode-news__eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin: 0 0 14px;
}

.ode-news__heading {
  margin: 0;
  border: none;
  padding: 26px 0 0;
  font-size: 1.7rem;
}

.ode-news__controls {
  display: none;
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: 6px;
}

@media (min-width: 640px) {
  .ode-news__controls { display: flex; }
}

.ode-news__nav-btn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
}

.ode-news__nav-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ode-news__track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 4px 4px 16px;
  margin: 0 -4px;
  scrollbar-width: none;
}

.ode-news__track::-webkit-scrollbar {
  display: none;
}

.ode-news__card {
  scroll-snap-align: start;
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow:
    0 1px 2px rgba(2, 8, 20, 0.06),
    0 10px 24px rgba(2, 8, 20, 0.08);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.dark .ode-news__card {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 12px 28px rgba(0, 0, 0, 0.35);
}

@media (min-width: 640px) {
  .ode-news__card { flex-basis: 320px; }
}

.ode-news__card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 4px 8px rgba(2, 8, 20, 0.08),
    0 20px 40px rgba(2, 8, 20, 0.14);
}

.ode-news__card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.ode-news__media {
  position: relative;
  height: 150px;
  background: #0a2455;
}

.ode-news__media img,
.ode-news__media-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ode-news__date {
  position: absolute;
  left: 14px;
  bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #00122a;
  background: var(--ode-c-accent-1);
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.ode-news__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  padding: 18px 20px 20px;
}

.ode-news__body h3 {
  margin: 0;
  border: none;
  padding: 0;
  font-size: 17px;
  line-height: 1.4;
  flex-grow: 1;
  color: var(--vp-c-text-1);
}

.ode-news__more {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.ode-news__card:hover .ode-news__more {
  color: var(--vp-c-brand-1);
}

.ode-news__all {
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
</style>
