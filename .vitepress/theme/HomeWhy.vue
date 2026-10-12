<script setup lang="ts">
const reasons = [
  {
    icon: 'globe',
    title: 'Open Source',
    text: 'Built on, and for, a healthy open source chip design ecosystem.',
  },
  {
    icon: 'chip',
    title: 'Grow Chip Design',
    text: 'Attracting talent and making chip design more accessible.',
  },
  {
    icon: 'stars',
    title: 'Pan-European',
    text: 'A joint effort of leading institutions across Europe.',
  },
]
</script>

<template>
  <section class="ode-module" aria-labelledby="ode-mod-why">
    <div class="ode-module__head">
      <h2 id="ode-mod-why" class="ode-eyebrow">Why ODE4EC</h2>
    </div>
    <ul class="ode-why">
      <li v-for="r in reasons" :key="r.title" class="ode-why__reason">
        <svg class="ode-why__icon" width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <template v-if="r.icon === 'globe'">
            <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="2" />
            <ellipse cx="20" cy="20" rx="15" ry="6" stroke="currentColor" stroke-width="2" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2" />
          </template>
          <template v-else-if="r.icon === 'chip'">
            <rect x="13" y="13" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2" />
            <path d="M20 13V7M20 33v-6M13 20H7M33 20h-6M16 13v-3M24 13v-3M16 30v-3M24 30v-3M27 16h3M27 24h3M10 16h3M10 24h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </template>
          <template v-else>
            <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="2" />
            <circle v-for="i in 12" :key="i" :cx="20 + 11 * Math.sin((i * Math.PI) / 6)" :cy="20 - 11 * Math.cos((i * Math.PI) / 6)" r="1.6" fill="currentColor" />
          </template>
        </svg>
        <div>
          <h3 class="ode-why__title">{{ r.title }}</h3>
          <p class="ode-why__text">{{ r.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.ode-why {
  display: grid;
  gap: clamp(6px, 1.2vh, 12px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ode-why__reason {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0;
}

.ode-why__icon {
  flex-shrink: 0;
  color: var(--board-icon);
}

.vp-doc .ode-why__title {
  margin: 0 0 2px;
  padding: 0;
  border: none;
  font-size: 0.96875rem;
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--board-text-1);
}

.ode-why__text {
  margin: 0;
  font-size: 0.84375rem;
  line-height: 1.5;
  color: var(--board-text-2);
}
</style>
