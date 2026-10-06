<script setup lang="ts">
import { ref } from 'vue'
import { data } from '../../events/events.data.ts'
import { useCarousel } from './useCarousel'

// Upcoming events first (soonest first), then the most recent past ones, so
// the carousel never runs empty between events.
const events = [
  ...data.upcoming.map((e) => ({ ...e, past: false })),
  ...data.past.slice(0, 4).map((e) => ({ ...e, past: true })),
]

const track = ref<HTMLElement | null>(null)
const { atStart, atEnd, step, update } = useCarousel(track)

const fmt = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''
</script>

<template>
  <section class="ode-module" aria-labelledby="ode-mod-events">
    <div class="ode-module__head">
      <h2 id="ode-mod-events" class="ode-module__title">Events</h2>
      <div v-if="events.length > 1" class="ode-module__nav">
        <button type="button" aria-label="Previous event" aria-controls="ode-events-track" :disabled="atStart" @click="step(-1)">‹</button>
        <button type="button" aria-label="Next event" aria-controls="ode-events-track" :disabled="atEnd" @click="step(1)">›</button>
      </div>
      <a class="ode-module__all" href="/events/">All events →</a>
    </div>

    <ul v-if="events.length" id="ode-events-track" ref="track" class="ode-module__track" :class="{ 'is-end': atEnd }" aria-label="Events" @scroll.passive="update">
      <li v-for="e in events" :key="e.url" class="ode-events__item">
        <a class="ode-events__card" :href="e.url">
          <span class="ode-events__meta">
            <time class="ode-events__date" :datetime="e.date">{{ fmt(e.date) }}</time>
            <span class="ode-events__status" :class="{ 'is-past': e.past }">{{ e.past ? 'Past' : 'Upcoming' }}</span>
          </span>
          <span class="ode-events__title">{{ e.title }}</span>
          <span v-if="e.location" class="ode-events__location">{{ e.location }}</span>
        </a>
      </li>
    </ul>
    <p v-else class="ode-module__empty">No events yet — check back soon.</p>
  </section>
</template>

<style scoped>
.ode-events__item {
  flex: 0 0 100%;
}

.ode-events__card {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.6vh, 6px);
  height: 100%;
  padding: clamp(9px, 1.4vh, 12px) 14px;
  border-radius: 10px;
  background: rgba(0, 18, 42, 0.45);
  border: 1px solid rgba(140, 175, 240, 0.16);
  color: #fff;
  text-decoration: none;
  transition: border-color 0.2s;
}

.ode-events__card:hover {
  border-color: rgba(255, 214, 23, 0.45);
}

.ode-events__card:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.ode-events__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
}

.ode-events__date {
  font-weight: 600;
  color: var(--ode-c-board-deep);
  background: var(--ode-c-accent-1);
  padding: 2px 9px;
  border-radius: 999px;
}

.ode-events__status {
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ode-c-trace-blue);
}

.ode-events__status.is-past {
  color: rgba(255, 255, 255, 0.5);
}

.ode-events__title {
  font-weight: 600;
  font-size: 15.5px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ode-events__location {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.65);
}
</style>
