<script setup lang="ts">
// The homepage "board": Hero + Features on one dark PCB, then the project
// cards on the page below, with a single circuit overlay drawn in real
// pixels behind all of them. The overlay measures the chip card, the Features
// cards and the project cards, so its pins sit exactly on the card edges and
// every trace lands on a pin at any viewport size; the chip's two output
// feeds run on into the project cards. Signal packets travel along the
// traces (circuit/packets.ts) while the board is visible.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import Hero from './Hero.vue'
import Features from './Features.vue'
import ProjectsPreview from './ProjectsPreview.vue'
import { buildCircuit, type Circuit, type Rect } from './circuit/layout'
import { PacketEngine } from './circuit/packets'

const root = ref<HTMLElement | null>(null)
const wires = ref<SVGSVGElement | null>(null)
const size = ref({ w: 0, h: 0 })
/** the band where the dark board fades into the page */
const fade = ref({ top: 0, bottom: 0 })
const maskId = `ode-board-page-${useId()}`
const TONES = ['deep', 'blue', 'gold'] as const
// Empty on the server and on first client render (hydration must match);
// filled in after mount.
const circuit = shallowRef<Circuit | null>(null)

function measure() {
  const el = root.value
  if (!el) return
  const chipEl = el.querySelector('.ode-hero__content')
  const heroEl = el.querySelector('.ode-hero')
  const cardEls = [...el.querySelectorAll('.ode-feature')]
  const projectEls = [...el.querySelectorAll('.ode-project')]
  const fadeEl = el.querySelector('.ode-features__fade')
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
  if (fadeEl) {
    const f = rel(fadeEl.getBoundingClientRect())
    fade.value = { top: f.y, bottom: f.y + f.h }
  }
  circuit.value = buildCircuit({
    width: box.width,
    height: box.height,
    chip,
    heroBottom: hero.y + hero.h,
    feedXs,
    gridBottom: Math.max(...cards.map((c) => c.y + c.h)),
    cards: projectEls.map((c) => rel(c.getBoundingClientRect())),
  })
}

let frame = 0
function scheduleMeasure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

// --- signal packets ---------------------------------------------------------

const MOTION_KEY = 'ode-board-motion'

const engine = new PacketEngine()
const mounted = ref(false)
const reducedMotion = ref(false)
const userPaused = ref(false)
const inView = ref(true)
const pageVisible = ref(true)

const running = computed(
  () => mounted.value && !reducedMotion.value && !userPaused.value && inView.value && pageVisible.value,
)

watch(running, (on) => (on ? engine.start() : engine.stop()))

// rebind the engine to the freshly rendered packet slots after every layout
watch(circuit, async (c) => {
  await nextTick()
  if (!c || !wires.value) return
  engine.attach(
    wires.value,
    c.traces.map((t) => ({ id: t.id, len: t.len, flow: t.flow, pinId: t.pinId, endPinId: t.endPinId })),
  )
  if (running.value) engine.start()
})

function toggleMotion() {
  userPaused.value = !userPaused.value
  try {
    localStorage.setItem(MOTION_KEY, userPaused.value ? 'paused' : 'playing')
  } catch {}
}

let lastBurst = 0
function burst() {
  const now = performance.now()
  if (now - lastBurst < 1200) return
  lastBurst = now
  engine.burst(circuit.value?.traces.filter((t) => t.feed).map((t) => t.id) ?? [])
}

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

const onMotionChange = () => (reducedMotion.value = !!motionQuery?.matches)
const onVisibilityChange = () => (pageVisible.value = document.visibilityState === 'visible')

onMounted(() => {
  try {
    userPaused.value = localStorage.getItem(MOTION_KEY) === 'paused'
  } catch {}
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  onMotionChange()
  motionQuery.addEventListener('change', onMotionChange)
  document.addEventListener('visibilitychange', onVisibilityChange)
  onVisibilityChange()
  intersectionObserver = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting))
  intersectionObserver.observe(root.value!)
  mounted.value = true

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
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', onMotionChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  engine.destroy()
})
</script>

<template>
  <div ref="root" class="ode-board" :class="{ 'ode-board--paused': userPaused }">
    <svg
      v-if="circuit"
      ref="wires"
      class="ode-board__wires"
      :width="size.w"
      :height="size.h"
      :viewBox="`0 0 ${size.w} ${size.h}`"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient :id="`${maskId}-grad`" gradientUnits="userSpaceOnUse" x1="0" x2="0" :y1="fade.top" :y2="fade.bottom">
          <stop offset="0" stop-color="#000" />
          <stop offset="1" stop-color="#fff" />
        </linearGradient>
        <mask :id="maskId" maskUnits="userSpaceOnUse" x="0" y="0" :width="size.w" :height="size.h">
          <rect x="0" y="0" :width="size.w" :height="size.h" :fill="`url(#${maskId}-grad)`" />
        </mask>
      </defs>

      <!-- grouped by tone so that feed branches sharing a route draw as one
           trace (opacity is applied per group, not per path) -->
      <g class="ode-board__traces">
        <g v-for="tone in TONES" :key="tone" :class="`tone--${tone}`">
          <path v-for="t in circuit.traces.filter((x) => x.tone === tone)" :key="t.id" :d="t.d" />
        </g>
      </g>
      <!-- light mode only: past the board's fade the feeds run over the light
           page, where the board's pale trace colors vanish; redraw them in
           deeper tones, masked in across the fade -->
      <g class="ode-board__page-traces" :mask="`url(#${maskId})`">
        <g v-for="tone in TONES" :key="tone" :class="`tone--${tone}`">
          <path v-for="t in circuit.traces.filter((x) => x.feed && x.tone === tone)" :key="t.id" :d="t.d" />
        </g>
      </g>
      <g class="ode-board__vias">
        <circle v-for="(v, i) in circuit.vias" :key="i" :cx="v.x" :cy="v.y" r="4" :class="`tone--${v.tone}`" />
      </g>
      <!-- packet slots: hidden until the engine sends one down the trace;
           the feeds get extra slots for the CTA burst -->
      <g class="ode-board__packets">
        <template v-for="t in circuit.traces" :key="`p-${t.id}`">
          <g
            v-for="k in t.feed ? 3 : 1"
            :key="k"
            class="ode-packet"
            :class="[`tone--${t.tone}`, { 'ode-packet--feed': t.feed }]"
            :data-packet="t.id"
            style="visibility: hidden"
          >
            <path class="ode-packet__glow" :d="t.d" />
            <path class="ode-packet__core" :d="t.d" />
          </g>
        </template>
      </g>
      <g class="ode-board__pins">
        <g
          v-for="p in circuit.pins"
          :key="p.id"
          class="ode-pin"
          :class="{ 'ode-pin--wired': p.wired, 'ode-pin--card': p.group === 'card' }"
          :data-pin="p.id"
        >
          <rect
            v-if="p.wired"
            class="ode-pin__glow"
            :x="p.x - 2.5"
            :y="p.y - 2.5"
            :width="p.w + 5"
            :height="p.h + 5"
            :rx="(Math.min(p.w, p.h) + 5) / 2"
          />
          <rect class="ode-pin__body" :x="p.x" :y="p.y" :width="p.w" :height="p.h" rx="1.5" />
        </g>
      </g>
    </svg>

    <Hero :wired="!!circuit" @burst="burst">
      <template #controls>
        <button
          v-if="mounted && !reducedMotion"
          class="ode-board__motion"
          type="button"
          :aria-pressed="userPaused"
          :title="userPaused ? 'Play background animation' : 'Pause background animation'"
          @click="toggleMotion"
        >
          <span class="visually-hidden">Pause background animation</span>
          <svg v-if="userPaused" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M4 2.5v9M10 2.5v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          </svg>
        </button>
      </template>
    </Hero>
    <Features />
    <!-- same box as VitePress's home content container, so Projects stays
         aligned with the sections that follow the board -->
    <div class="ode-board__container">
      <ProjectsPreview :wired="!!circuit" />
    </div>
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

.ode-board__container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .ode-board__container { padding: 0 48px; }
}

@media (min-width: 960px) {
  .ode-board__container { padding: 0 64px; }
}

.ode-board__traces path,
.ode-board__page-traces path {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ode-board__traces .tone--gold { stroke: var(--ode-c-accent-1); opacity: 0.72; }
.ode-board__traces .tone--blue { stroke: var(--ode-c-trace-blue); opacity: 0.5; }
.ode-board__traces .tone--deep { stroke: var(--ode-c-trace-deep); opacity: 0.7; }

.ode-board__page-traces {
  display: none;
}

:root:not(.dark) .ode-board__page-traces {
  display: inline;
}

.ode-board__page-traces .tone--gold { stroke: var(--ode-c-gold-shade); opacity: 0.9; }
.ode-board__page-traces .tone--blue { stroke: var(--vp-c-brand-2); opacity: 0.6; }
.ode-board__page-traces .tone--deep { stroke: var(--vp-c-brand-3); opacity: 0.7; }

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
  fill: var(--ode-c-pin-hot);
  opacity: 0;
  transition: opacity 0.9s ease-out;
}

/* pin lit by a passing packet: fades in quickly, out slowly, no strobing */
.ode-pin.is-hot .ode-pin__body {
  fill: var(--ode-c-pin-hot);
  transition-duration: 0.2s;
}

.ode-pin.is-hot .ode-pin__glow {
  opacity: 0.3;
  transition-duration: 0.2s;
}

/* the pause button stops every looping animation on the board */
.ode-board--paused :deep(.ode-hero__halo),
.ode-board--paused :deep(.ode-hero__scroll-cue svg) {
  animation-play-state: paused;
}

/* packets: a soft halo under a bright core */
.ode-packet path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ode-packet__glow {
  stroke-width: 9;
  opacity: 0.22;
}

.ode-packet__core {
  stroke-width: 3;
}

.ode-packet.tone--gold path { stroke: var(--ode-c-pin-hot); }
.ode-packet.tone--blue path,
.ode-packet.tone--deep path { stroke: var(--ode-c-packet-blue); }

/* feed packets reach the light page in light mode: give them a saturated core */
:root:not(.dark) .ode-packet--feed.tone--gold .ode-packet__core { stroke: var(--ode-c-gold-shade); }
:root:not(.dark) .ode-packet--feed.tone--blue .ode-packet__core { stroke: var(--vp-c-brand-3); }

/* project-card pins on the light page need deeper golds */
:root:not(.dark) .ode-pin--card .ode-pin__body {
  fill: var(--ode-c-gold-dark);
}

:root:not(.dark) .ode-pin--card.ode-pin--wired .ode-pin__body {
  fill: var(--ode-c-gold-shade);
}

@media (max-width: 639px) {
  .ode-board__traces path,
  .ode-board__page-traces path {
    stroke-width: 2;
  }
}

.ode-board__motion {
  position: absolute;
  z-index: 2;
  right: 20px;
  bottom: 20px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(0, 18, 42, 0.5);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.ode-board__motion:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.7);
}

.ode-board__motion:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}
</style>
