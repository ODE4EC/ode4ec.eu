<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{ label: string; value: string }>()

// Each chip picks its own pins and rhythm, after hydration so server and client markup agree.
const pins = ref<Record<string, string>>({})
onMounted(() => {
  const pin = () => `${Math.floor(Math.random() * 5) * 14}px`
  const secs = (min: number, max: number) => `${(min + Math.random() * (max - min)).toFixed(2)}s`
  pins.value = {
    '--pa1': pin(), '--pa2': pin(), '--pb1': pin(), '--pb2': pin(),
    '--da': secs(2.8, 5.5), '--db': secs(2.8, 5.5), '--wa': secs(0, 1.5), '--wb': secs(0, 2.5),
  }
})
</script>

<template>
  <div class="key-fact" :style="pins">
    <dt>{{ label }}</dt>
    <dd>{{ value }}</dd>
  </div>
</template>

<style scoped>
/* A small chip: gold pin rows on its top and bottom edges. */
.key-fact {
  /* in light mode a gold pin can't get brighter on paper: it lights blue, like the board's signals */
  --pin: color-mix(in srgb, var(--ode-c-gold-shade) 70%, transparent);
  --pin-hot: var(--vp-c-brand-2);
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--ode-c-card-edge);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.dark .key-fact {
  --pin: var(--ode-c-gold-dark);
  --pin-hot: var(--ode-c-pin-hot);
}

/* Pins on a 14px pitch. The first layer is one lit pin, parked off-chip until
   the hover animation steps it onto a pin. */
.key-fact::before,
.key-fact::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  height: 3px;
  background:
    linear-gradient(var(--pin-hot), var(--pin-hot)) -20px 0 / 4px 3px no-repeat,
    repeating-linear-gradient(90deg, var(--pin) 0 4px, transparent 4px 14px);
}

.key-fact::before { top: -4px; }
.key-fact::after { bottom: -4px; }

/* On hover, single pins flash now and then: two random pins per edge, each
   edge on its own random period and delay, with long dark gaps between. */
.key-fact:hover::before { animation: key-fact-pins-a var(--da, 3.2s) step-end var(--wa, 0s) infinite; }
.key-fact:hover::after { animation: key-fact-pins-b var(--db, 4.1s) step-end var(--wb, 0.7s) infinite; }

@keyframes key-fact-pins-a {
  0% { background-position: var(--pa1, 28px) 0, 0 0; }
  6% { background-position: -20px 0, 0 0; }
  45% { background-position: var(--pa2, 56px) 0, 0 0; }
  51% { background-position: -20px 0, 0 0; }
}

@keyframes key-fact-pins-b {
  0% { background-position: var(--pb1, 42px) 0, 0 0; }
  5% { background-position: -20px 0, 0 0; }
  60% { background-position: var(--pb2, 14px) 0, 0 0; }
  65% { background-position: -20px 0, 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .key-fact:hover::before,
  .key-fact:hover::after { animation: none; }
}

dt,
dd {
  white-space: nowrap;
}

dt {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

dd {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
