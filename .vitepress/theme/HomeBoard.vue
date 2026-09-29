<script setup lang="ts">
// The homepage "board": Hero + Features on one dark PCB, with a single
// circuit overlay drawn in real pixels behind both. The overlay measures the
// chip card and the Features cards, so its pins sit exactly on the card
// edges and every trace lands on a pin at any viewport size.
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import Hero from './Hero.vue'
import Features from './Features.vue'
import { buildCircuit, type Circuit, type Rect } from './circuit/layout'

const root = ref<HTMLElement | null>(null)
const size = ref({ w: 0, h: 0 })
// Empty on the server and on first client render (hydration must match);
// filled in after mount.
const circuit = shallowRef<Circuit | null>(null)

function measure() {
  const el = root.value
  if (!el) return
  const chipEl = el.querySelector('.ode-hero__content')
  const heroEl = el.querySelector('.ode-hero')
  const cardEls = [...el.querySelectorAll('.ode-feature')]
  if (!chipEl || !heroEl || !cardEls.length) return

  const box = el.getBoundingClientRect()
  const rel = (r: DOMRect): Rect => ({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height })
  const chip = rel(chipEl.getBoundingClientRect())
  const hero = rel(heroEl.getBoundingClientRect())
  const cards = cardEls.map((c) => rel(c.getBoundingClientRect()))

  // Feeds run down the gutters between the first three cards when they sit
  // in a row, otherwise down the side margins.
  const inRow = cards.length >= 3 && Math.abs(cards[0].y - cards[2].y) < 2
  const feedXs: [number, number] = inRow
    ? [(cards[0].x + cards[0].w + cards[1].x) / 2, (cards[1].x + cards[1].w + cards[2].x) / 2]
    : [12, box.width - 12]

  size.value = { w: box.width, h: box.height }
  circuit.value = buildCircuit({
    width: box.width,
    height: box.height,
    chip,
    heroBottom: hero.y + hero.h,
    feedXs,
    gridBottom: Math.max(...cards.map((c) => c.y + c.h)),
  })
}

let frame = 0
function scheduleMeasure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(scheduleMeasure)
  resizeObserver.observe(root.value!)
  const chipEl = root.value!.querySelector('.ode-hero__content')
  if (chipEl) resizeObserver.observe(chipEl)
  // web fonts change the chip card's size once they load
  document.fonts?.ready.then(scheduleMeasure)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="root" class="ode-board">
    <svg
      v-if="circuit"
      class="ode-board__wires"
      :width="size.w"
      :height="size.h"
      :viewBox="`0 0 ${size.w} ${size.h}`"
      aria-hidden="true"
      focusable="false"
    >
      <g class="ode-board__traces">
        <path v-for="t in circuit.traces" :key="t.id" :d="t.d" :class="`tone--${t.tone}`" />
      </g>
      <g class="ode-board__vias">
        <circle v-for="(v, i) in circuit.vias" :key="i" :cx="v.x" :cy="v.y" r="4" :class="`tone--${v.tone}`" />
      </g>
      <g class="ode-board__pins">
        <g
          v-for="p in circuit.pins"
          :key="p.id"
          class="ode-pin"
          :class="{ 'ode-pin--wired': p.wired }"
          :data-pin="p.id"
        >
          <rect v-if="p.wired" class="ode-pin__glow" :x="p.x - 4" :y="p.y - 4" :width="p.w + 8" :height="p.h + 8" rx="5" />
          <rect class="ode-pin__body" :x="p.x" :y="p.y" :width="p.w" :height="p.h" rx="1.5" />
        </g>
      </g>
    </svg>

    <Hero :wired="!!circuit" />
    <Features />
  </div>
</template>

<style scoped>
/* Full-bleed, and at 960px+ pulled up under the fixed, transparent-at-top
   navbar (VitePress adds nav-height padding to the content at that size). */
.ode-board {
  position: relative;
  isolation: isolate;
  margin-left: var(--vp-offset, calc(50% - 50vw));
  margin-right: var(--vp-offset, calc(50% - 50vw));
}

@media (min-width: 960px) {
  .ode-board {
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  }
}

/* Above the section backgrounds, below the chip card and Features cards. */
.ode-board__wires {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  animation: ode-wires-in 0.8s ease-out;
}

/* At 960px+ the transparent navbar sits over the board: fade the traces out
   underneath it so they never run through the nav links. */
@media (min-width: 960px) {
  .ode-board__wires {
    mask-image: linear-gradient(180deg, transparent 0, transparent 40px, #000 calc(var(--vp-nav-height) + 56px));
  }
}

@keyframes ode-wires-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ode-board__traces path {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ode-board__traces .tone--gold { stroke: var(--ode-c-accent-1); opacity: 0.72; }
.ode-board__traces .tone--blue { stroke: var(--ode-c-trace-blue); opacity: 0.5; }
.ode-board__traces .tone--deep { stroke: var(--ode-c-trace-deep); opacity: 0.7; }

.ode-board__vias circle {
  fill: var(--ode-c-board);
  stroke-width: 2;
}

.ode-board__vias .tone--gold { stroke: var(--ode-c-accent-1); }
.ode-board__vias .tone--blue { stroke: var(--ode-c-trace-blue); }
.ode-board__vias .tone--deep { stroke: var(--ode-c-trace-deep); }

.ode-pin__body {
  fill: var(--ode-c-pin-dim);
  transition: fill 0.9s ease-out;
}

.ode-pin--wired .ode-pin__body {
  fill: var(--ode-c-accent-1);
}

.ode-pin__glow {
  fill: var(--ode-c-accent-1);
  opacity: 0;
  transition: opacity 0.9s ease-out;
}

/* pin lit by a passing packet: fades in quickly, out slowly, no strobing */
.ode-pin.is-hot .ode-pin__body {
  fill: var(--ode-c-pin-hot);
  transition-duration: 0.2s;
}

.ode-pin.is-hot .ode-pin__glow {
  opacity: 0.35;
  transition-duration: 0.2s;
}

@media (max-width: 639px) {
  .ode-board__traces path {
    stroke-width: 2;
  }
}
</style>
