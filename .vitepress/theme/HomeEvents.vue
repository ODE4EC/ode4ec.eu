<script setup lang="ts">
import { data } from '../../events/events.data.ts'
import HomeCarousel from './HomeCarousel.vue'
import { formatDate } from './format'

// Upcoming first, then the latest past ones, so the row never runs empty.
const events = [
  ...data.upcoming.map((e) => ({ ...e, past: false })),
  ...data.past.map((e) => ({ ...e, past: true })),
].slice(0, 3)
</script>

<template>
  <HomeCarousel title="Events" noun="event" all-href="/events/" all-label="All events →" :items="events" empty="No events yet — check back soon." class="ode-events">
    <template #default="{ item: e }">
      <a class="ode-module__card ode-events__card" :href="e.url">
        <span class="ode-events__meta">
          <time class="ode-events__date" :datetime="e.date">{{ formatDate(e.date) }}</time>
          <span class="ode-events__status" :class="{ 'is-past': e.past }">{{ e.past ? 'Past' : 'Upcoming' }}</span>
        </span>
        <span class="ode-events__title">{{ e.title }}</span>
        <span v-if="e.location" class="ode-events__location">{{ e.location }}</span>
      </a>
    </template>
  </HomeCarousel>
</template>

<style scoped>
.ode-events :deep(.ode-module__track > li) {
  flex: 0 0 100%;
}

.ode-events__card {
  flex-direction: column;
  gap: clamp(3px, 0.6vh, 6px);
  padding: clamp(9px, 1.4vh, 12px) 14px;
}

.ode-events__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  font-size: 0.78125rem;
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
  color: var(--board-eyebrow);
}

.ode-events__status.is-past {
  color: var(--board-text-2);
}

.ode-events__title {
  font-weight: 600;
  font-size: 0.96875rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ode-events__location {
  font-size: 0.84375rem;
  color: var(--board-text-2);
}
</style>
