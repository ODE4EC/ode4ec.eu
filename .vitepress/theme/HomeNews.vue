<script setup lang="ts">
import { data as posts } from '../../news/posts.data.ts'
import HomeCarousel from './HomeCarousel.vue'
import { formatDate } from './format'

const latest = posts.slice(0, 8)
</script>

<template>
  <HomeCarousel title="News" noun="news" all-href="/news/" all-label="All news →" :items="latest" empty="No news yet." class="ode-news">
    <template #default="{ item: post }">
      <a class="ode-module__card ode-news__card" :href="post.url">
        <span class="ode-news__thumb">
          <img v-if="post.image" :src="post.image" alt="" loading="lazy" />
          <svg v-else viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect class="nf-bg" width="120" height="90" />
            <g fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path class="nf-gold" d="M-5,26 L28,26 L40,38 L44,38" />
              <path class="nf-blue" d="M-5,52 L44,52" />
              <path class="nf-deep" d="M76,38 L82,38 L94,26 L125,26" />
              <path class="nf-gold" d="M76,52 L125,52" />
            </g>
            <rect class="nf-chip" x="44" y="28" width="32" height="34" rx="4" />
          </svg>
        </span>
        <span class="ode-news__body">
          <time class="ode-news__date" :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span class="ode-news__title">{{ post.title }}</span>
        </span>
      </a>
    </template>
  </HomeCarousel>
</template>

<style scoped>
.ode-news :deep(.ode-module__track > li) {
  flex: 0 0 min(340px, 88%);
}

.ode-news__card {
  gap: 12px;
  padding: 10px;
}

.ode-news__thumb {
  flex: 0 0 auto;
  width: clamp(5rem, 11vh, 7rem);
  aspect-ratio: 4 / 3;
  border-radius: 7px;
  overflow: hidden;
  background: var(--ode-c-panel);
}

.ode-news__thumb img,
.ode-news__thumb svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nf-bg { fill: var(--ode-c-panel-deep); }
.nf-gold { stroke: var(--ode-c-accent-1); opacity: 0.75; }
.nf-blue { stroke: var(--ode-c-trace-blue); opacity: 0.55; }
.nf-deep { stroke: var(--ode-c-trace-deep); opacity: 0.75; }
.nf-chip {
  fill: var(--ode-c-panel-top);
  stroke: rgba(160, 190, 240, 0.4);
  stroke-width: 1.5;
}

.ode-news__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ode-news__date {
  font-size: 0.78125rem;
  font-weight: 600;
  color: var(--ode-c-trace-blue);
}

.ode-news__title {
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
