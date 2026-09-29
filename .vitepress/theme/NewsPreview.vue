<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { data as posts } from '../../news/posts.data.ts'

const latest = posts.slice(0, 10)
const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

// Step by exactly one card (its width plus the track gap).
function scrollByCards(dir: number) {
  const el = track.value
  const first = el?.firstElementChild as HTMLElement | null
  if (!el || !first) return
  const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
}

function updateEnds() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 2
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
}

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  updateEnds()
  if (track.value) {
    resizeObserver = new ResizeObserver(updateEnds)
    resizeObserver.observe(track.value)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <section class="ode-news">
    <div class="ode-news__inner">
      <div class="ode-news__header">
        <div>
          <p class="ode-eyebrow">Latest</p>
          <h2 class="ode-section-heading ode-heading ode-news__heading">News &amp; Updates</h2>
        </div>
        <div class="ode-news__controls">
          <button
            class="ode-news__nav-btn"
            type="button"
            aria-label="Previous news"
            aria-controls="ode-news-track"
            :disabled="atStart"
            @click="scrollByCards(-1)"
          >‹</button>
          <button
            class="ode-news__nav-btn"
            type="button"
            aria-label="Next news"
            aria-controls="ode-news-track"
            :disabled="atEnd"
            @click="scrollByCards(1)"
          >›</button>
        </div>
      </div>

      <ul
        v-if="latest.length"
        id="ode-news-track"
        ref="track"
        class="ode-news__track"
        aria-label="Latest news"
        @scroll.passive="updateEnds"
      >
        <li v-for="post in latest" :key="post.url" class="ode-news__item">
          <a :href="post.url" class="ode-news__card">
            <div class="ode-news__media">
              <img v-if="post.image" :src="post.image" alt="" loading="lazy" />
              <svg v-else class="ode-news__media-fallback" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <!-- a miniature of the homepage board: 45° buses into a chip -->
                <rect class="nf-bg" width="320" height="150" />
                <g fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path class="nf-gold" d="M-10,30 L90,30 L126,66 L132,66" />
                  <path class="nf-blue" d="M-10,40 L86,40 L122,76 L132,76" />
                  <path class="nf-deep" d="M-10,50 L82,50 L118,86 L132,86" />
                  <path class="nf-blue" d="M188,66 L194,66 L230,30 L330,30" />
                  <path class="nf-gold" d="M188,76 L198,76 L234,40 L330,40" />
                  <path class="nf-deep" d="M188,86 L214,86 L240,112 L240,160" />
                  <path class="nf-gold" d="M160,104 L160,160" />
                </g>
                <circle class="nf-via nf-via--gold" cx="48" cy="30" r="3.5" />
                <circle class="nf-via nf-via--blue" cx="282" cy="30" r="3.5" />
                <g class="nf-pin">
                  <rect x="132" y="64" width="8" height="4" rx="1" />
                  <rect x="132" y="74" width="8" height="4" rx="1" />
                  <rect x="132" y="84" width="8" height="4" rx="1" />
                  <rect x="180" y="64" width="8" height="4" rx="1" />
                  <rect x="180" y="74" width="8" height="4" rx="1" />
                  <rect x="180" y="84" width="8" height="4" rx="1" />
                  <rect x="158" y="96" width="4" height="8" rx="1" />
                </g>
                <rect class="nf-chip" x="138" y="54" width="44" height="44" rx="5" />
                <circle class="nf-pin" cx="146" cy="62" r="2.2" />
              </svg>
              <time class="ode-news__date" :datetime="post.date">{{ post.date }}</time>
            </div>
            <div class="ode-news__body">
              <h3>{{ post.title }}</h3>
              <span class="ode-news__more">Read more →</span>
            </div>
          </a>
        </li>
      </ul>

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

.ode-news__heading {
  margin: 0;
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

.ode-news__nav-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.ode-news__nav-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.ode-news__nav-btn:hover:not(:disabled) {
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
  list-style: none;
}

.ode-news__item {
  flex: 0 0 280px;
  scroll-snap-align: start;
  margin: 0;
}

@media (min-width: 640px) {
  .ode-news__item { flex-basis: 320px; }
}

.ode-news__track::-webkit-scrollbar {
  display: none;
}

.ode-news__card {
  height: 100%;
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
  background: var(--ode-c-panel);
}

.ode-news__media img,
.ode-news__media-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* fallback art (no post image): colors from the board tokens */
.nf-bg { fill: var(--ode-c-panel); }
.nf-gold { stroke: var(--ode-c-accent-1); opacity: 0.75; }
.nf-blue { stroke: var(--ode-c-trace-blue); opacity: 0.55; }
.nf-deep { stroke: var(--ode-c-trace-deep); opacity: 0.75; }
.nf-via { fill: var(--ode-c-panel); stroke-width: 2; }
.nf-via--gold { stroke: var(--ode-c-accent-1); }
.nf-via--blue { stroke: var(--ode-c-trace-blue); }
.nf-pin { fill: var(--ode-c-accent-1); }
.nf-chip {
  fill: var(--ode-c-panel-top);
  stroke: rgba(160, 190, 240, 0.4);
  stroke-width: 1.5;
}

.ode-news__date {
  position: absolute;
  left: 14px;
  bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ode-c-board-deep);
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
