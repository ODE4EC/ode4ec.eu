<script setup lang="ts">
import { data } from '../../events/events.data.ts'
</script>

<template>
  <section class="ode-events">
    <div class="ode-events__inner">
      <p class="ode-eyebrow">What's next</p>
      <h2 class="ode-section-heading ode-heading ode-events__heading">Upcoming Events</h2>

      <ul v-if="data.upcoming.length" class="ode-events__list">
        <li v-for="event in data.upcoming" :key="event.url" class="ode-events__item">
          <a :href="event.url" class="ode-events__row">
            <span class="ode-events__date">{{ event.date }}</span>
            <span class="ode-events__title">{{ event.title }}</span>
            <span v-if="event.location" class="ode-events__location">{{ event.location }}</span>
            <span class="ode-events__arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
      <p v-else class="ode-events__empty">No upcoming events right now — check back soon.</p>

      <a href="/events/" class="ode-events__all">All events →</a>
    </div>
  </section>
</template>

<style scoped>
.ode-events {
  padding: 24px 24px 64px;
}

@media (min-width: 640px) {
  .ode-events { padding: 32px 48px 80px; }
}

.ode-events__inner {
  max-width: 1152px;
  margin: 0 auto;
}


.ode-events__heading {
  margin: 0 0 32px;
}

.ode-events__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ode-events__item + .ode-events__item {
  border-top: 1px solid var(--vp-c-divider);
}

.ode-events__row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 16px;
  padding: 18px 14px;
  margin: 0 -14px;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.ode-events__row:hover {
  background: var(--vp-c-bg-soft);
}

.ode-events__date {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.ode-events__title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ode-events__row:hover .ode-events__title {
  color: var(--vp-c-brand-1);
}

.ode-events__location {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.ode-events__arrow {
  margin-left: auto;
  color: var(--vp-c-text-3);
  transition: color 0.2s, transform 0.2s;
}

.ode-events__row:hover .ode-events__arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(3px);
}

.ode-events__empty {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.ode-events__all {
  display: inline-block;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
</style>
