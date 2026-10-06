<script setup lang="ts">
import { ref } from 'vue'
import { data as posts } from '../../news/posts.data.ts'
import { useCarousel } from './useCarousel'

const latest = posts.slice(0, 8)
const track = ref<HTMLElement | null>(null)
const { atStart, atEnd, step, update } = useCarousel(track)

const fmt = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''
</script>

<template>
  <section class="ode-module" aria-labelledby="ode-mod-news">
    <div class="ode-module__head">
      <h2 id="ode-mod-news" class="ode-module__title">News</h2>
      <div v-if="latest.length > 1" class="ode-module__nav">
        <button type="button" aria-label="Previous news" aria-controls="ode-news-track" :disabled="atStart" @click="step(-1)">‹</button>
        <button type="button" aria-label="Next news" aria-controls="ode-news-track" :disabled="atEnd" @click="step(1)">›</button>
      </div>
      <a class="ode-module__all" href="/news/">All news →</a>
    </div>

    <ul v-if="latest.length" id="ode-news-track" ref="track" class="ode-module__track" :class="{ 'is-end': atEnd }" aria-label="Latest news" @scroll.passive="update">
      <li v-for="post in latest" :key="post.url" class="ode-news__item">
        <a class="ode-news__card" :href="post.url">
          <span class="ode-news__thumb">
            <img v-if="post.image" :src="post.image" alt="" loading="lazy" />
            <svg v-else viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <!-- a miniature chip on a board, for posts without an image -->
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
            <time class="ode-news__date" :datetime="post.date">{{ fmt(post.date) }}</time>
            <span class="ode-news__title">{{ post.title }}</span>
          </span>
        </a>
      </li>
    </ul>
    <p v-else class="ode-module__empty">No news yet.</p>
  </section>
</template>

<style scoped>
.ode-news__item {
  flex: 0 0 min(340px, 88%);
}

.ode-news__card {
  display: flex;
  gap: 12px;
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 18, 42, 0.45);
  border: 1px solid rgba(140, 175, 240, 0.16);
  color: #fff;
  text-decoration: none;
  transition: border-color 0.2s;
}

.ode-news__card:hover {
  border-color: rgba(255, 214, 23, 0.45);
}

.ode-news__card:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.ode-news__thumb {
  flex: 0 0 auto;
  width: clamp(80px, 11vh, 112px);
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
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ode-c-trace-blue);
}

.ode-news__title {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
