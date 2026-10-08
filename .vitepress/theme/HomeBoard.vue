<script setup lang="ts">
// The homepage "board": one dark PCB holding the main chip (HomeChip) and,
// beside it, the projects / events / news modules, with a single circuit
// overlay drawn in real pixels behind them. The overlay measures the chip and
// the modules, so pins sit exactly on their edges and every trace lands on a
// pin at any viewport size: the chip's outputs cross to each module, other
// traces come in from the board edges. On wide, tall-enough screens it all
// fits one screen; otherwise the cards stack in one column and the page
// scrolls. Signal packets travel along the traces (circuit/packets.ts) while
// the board is visible and someone is using the page.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'
import HomeChip from './HomeChip.vue'
import HomeProjects from './HomeProjects.vue'
import HomeEvents from './HomeEvents.vue'
import HomeNews from './HomeNews.vue'
import { buildCircuit, type Circuit, type Rect } from './circuit/layout'
import { PacketEngine, type FadeBand } from './circuit/packets'

const { theme } = useData()
const footerMessage = computed(() => theme.value.footer?.message as string | undefined)

const root = ref<HTMLElement | null>(null)
const packetLayer = ref<HTMLElement | null>(null)
const size = ref({ w: 0, h: 0 })
const TONES = ['deep', 'blue', 'gold'] as const
// Empty on the server and on first client render (hydration must match);
// filled in after mount.
const circuit = shallowRef<Circuit | null>(null)

function measure() {
  const el = root.value
  if (!el) return
  const chipEl = el.querySelector('.ode-chip')
  const moduleEls = [...el.querySelectorAll('.ode-module')]
  const footEl = el.querySelector('.ode-board__foot')
  if (!chipEl) return

  const box = el.getBoundingClientRect()
  const rel = (r: DOMRect): Rect => ({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height })
  const chip = rel(chipEl.getBoundingClientRect())
  const modules = moduleEls.map((m) => rel(m.getBoundingClientRect()))

  size.value = { w: box.width, h: box.height }
  circuit.value = buildCircuit({
    width: box.width,
    height: box.height,
    chip,
    modules,
    stacked: !modules.length || modules[0].x < chip.x + chip.w,
    floor: footEl ? rel(footEl.getBoundingClientRect()).y : box.height,
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

/** At 960px+ the traces fade out under the transparent navbar (see the
 *  .ode-board__wires mask); packets fade over the same band. */
function navFade(): FadeBand {
  if (!window.matchMedia('(min-width: 960px)').matches) return null
  const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 64
  return [40, nav + 56]
}

// rebind the engine to the freshly rendered packet slots after every layout
watch(circuit, async (c) => {
  await nextTick()
  if (!c || !packetLayer.value) return
  engine.attach(
    packetLayer.value,
    c.traces.map((t) => ({ id: t.id, pts: t.pts, len: t.len, flow: t.flow, pinId: t.pinId, endPinId: t.endPinId })),
    navFade(),
  )
  if (running.value) engine.start()
})

// Ambient packets stop once nobody has touched the page for a while, so an
// open but unattended tab goes fully still; any input brings them back.
const IDLE_MS = 30_000
const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const
const ambient = ref(true)
let lastActive = 0
let idleTimer: ReturnType<typeof setTimeout> | 0 = 0

watch(ambient, (on) => engine.setAmbient(on))

function checkIdle() {
  const left = lastActive + IDLE_MS - performance.now()
  if (left > 0) {
    idleTimer = setTimeout(checkIdle, left)
  } else {
    idleTimer = 0
    ambient.value = false
  }
}

function onActivity() {
  lastActive = performance.now()
  ambient.value = true
  if (!idleTimer) idleTimer = setTimeout(checkIdle, IDLE_MS)
}

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
  engine.burst(circuit.value?.traces.filter((t) => t.module === 0).map((t) => t.id) ?? [])
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
  for (const e of ACTIVITY_EVENTS) window.addEventListener(e, onActivity, { passive: true })
  onActivity()
  mounted.value = true

  measure()
  resizeObserver = new ResizeObserver(scheduleMeasure)
  resizeObserver.observe(root.value!)
  for (const el of root.value!.querySelectorAll('.ode-chip, .ode-module')) resizeObserver.observe(el)
  // web fonts change the cards' sizes once they load
  document.fonts?.ready.then(scheduleMeasure)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  motionQuery?.removeEventListener('change', onMotionChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  for (const e of ACTIVITY_EVENTS) window.removeEventListener(e, onActivity)
  if (idleTimer) clearTimeout(idleTimer)
  engine.destroy()
})
</script>

<template>
  <div ref="root" class="ode-board">
    <div class="ode-board__halo" aria-hidden="true" />

    <svg
      v-if="circuit"
      class="ode-board__wires"
      :width="size.w"
      :height="size.h"
      :viewBox="`0 0 ${size.w} ${size.h}`"
      aria-hidden="true"
      focusable="false"
    >
      <!-- grouped by tone so that traces sharing a route draw as one
           (opacity is applied per group, not per path) -->
      <g class="ode-board__traces">
        <g v-for="tone in TONES" :key="tone" :class="`tone--${tone}`">
          <path v-for="t in circuit.traces.filter((x) => x.tone === tone)" :key="t.id" :d="t.d" />
        </g>
      </g>
      <g class="ode-board__vias">
        <circle v-for="(v, i) in circuit.vias" :key="i" :cx="v.x" :cy="v.y" r="4" :class="`tone--${v.tone}`" />
      </g>
      <g class="ode-board__pins">
        <rect
          v-for="p in circuit.pins"
          :key="p.id"
          class="ode-pin"
          :class="{ 'ode-pin--wired': p.wired }"
          :x="p.x"
          :y="p.y"
          :width="p.w"
          :height="p.h"
          rx="1.5"
        />
      </g>
    </svg>

    <!-- Moving parts live in HTML, over the SVG: they only animate transform
         and opacity, so the board itself never repaints while they run. -->
    <div v-if="circuit" ref="packetLayer" class="ode-board__packets" aria-hidden="true">
      <template v-for="p in circuit.pins" :key="`g-${p.id}`">
        <span
          v-if="p.wired"
          class="ode-pin-glow"
          :data-pin-glow="p.id"
          :style="{ left: `${p.x - 2.5}px`, top: `${p.y - 2.5}px`, width: `${p.w + 5}px`, height: `${p.h + 5}px` }"
        />
      </template>
      <!-- packet slots: hidden until the engine sends one down the trace;
           the chip's outputs get extra slots for the CTA burst -->
      <template v-for="t in circuit.traces" :key="`p-${t.id}`">
        <span
          v-for="k in t.flow === 'out' ? 3 : 1"
          :key="k"
          class="ode-packet"
          :class="`tone--${t.tone}`"
          :data-packet="t.id"
        />
      </template>
    </div>

    <div class="ode-board__grid">
      <HomeChip @burst="burst" />
      <div class="ode-board__side">
        <HomeProjects />
        <HomeEvents />
        <HomeNews />
      </div>
    </div>

    <div class="ode-board__foot">
      <p v-if="footerMessage" class="ode-board__credit" v-html="footerMessage" />
      <button
        v-if="mounted && !reducedMotion"
        class="ode-board__motion"
        type="button"
        :aria-pressed="userPaused"
        :title="userPaused ? 'Play background animation' : 'Pause background animation'"
        @click="toggleMotion"
      >
        <span class="visually-hidden">Pause background animation</span>
        <svg v-if="userPaused" width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M4 2.5v9M10 2.5v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Full-bleed, at least one screen tall, and at 960px+ pulled up under the
   fixed, transparent-at-top navbar (VitePress pads the content by the nav
   height at that size). Always dark, in both color schemes. */
.ode-board {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  margin-left: var(--vp-offset, calc(50% - 50vw));
  margin-right: var(--vp-offset, calc(50% - 50vw));
  background: linear-gradient(180deg, var(--ode-c-board-top) 0%, var(--ode-c-board-mid) 55%, var(--ode-c-board) 100%);
  color: #fff;
  /* the halo is larger than the board: never let it add scroll */
  overflow: clip;
}

@media (min-width: 960px) {
  .ode-board {
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  }
}

/* a soft glow behind the cards; fades in once, then holds still */
.ode-board__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(1400px, 150vw);
  aspect-ratio: 1.7;
  translate: -50% -50%;
  background: radial-gradient(closest-side, rgba(47, 111, 214, 0.36), rgba(47, 111, 214, 0.1) 60%, transparent);
  pointer-events: none;
  animation: ode-fade-in 1.6s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .ode-board__halo,
  .ode-board__wires,
  .ode-board__packets {
    animation: none;
  }
}

/* The grid: one column (stacked, scrolls) by default; two columns that fit
   one screen on wide screens that are tall enough for it. */
.ode-board__grid {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  gap: 56px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 32px;
}

@media (min-width: 640px) {
  .ode-board__grid { padding: 48px 48px 32px; }
}

@media (min-width: 960px) {
  .ode-board__grid { padding: calc(var(--vp-nav-height) + 48px) 64px 32px; }
}

.ode-board__side {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 56px;
  min-width: 0;
}

@media (min-width: 1152px) and (min-height: 600px) {
  .ode-board__grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
    column-gap: clamp(76px, 7vw, 112px);
    /* the chip spans the module column top to bottom, so the pins on its
       right edge face the modules' pins and the traces run straight */
    align-items: stretch;
    padding-top: calc(var(--vp-nav-height) + clamp(8px, 2vh, 32px));
    padding-bottom: clamp(8px, 1.5vh, 20px);
  }

  .ode-board__side {
    gap: clamp(12px, 2.2vh, 22px);
  }
}

/* Behind the cards (z-index 2), above the board's background. */
.ode-board__wires {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  animation: ode-fade-in 0.8s ease-out;
}

/* At 960px+ the transparent navbar sits over the board: fade the traces out
   underneath it so they never run through the nav links. */
@media (min-width: 960px) {
  .ode-board__wires {
    mask-image: linear-gradient(180deg, transparent 0, transparent 40px, #000 calc(var(--vp-nav-height) + 56px));
  }
}

@keyframes ode-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ode-board__traces path {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 639px) {
  .ode-board__traces path { stroke-width: 2; }
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

.ode-pin {
  fill: var(--ode-c-pin-dim);
}

.ode-pin--wired {
  fill: var(--ode-c-accent-1);
}

/* Packets and pin glows: HTML over the SVG, in the board's pixel space. */
.ode-board__packets {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  animation: ode-fade-in 0.8s ease-out;
}

/* pin lit by a passing packet: fades in quickly, out slowly, no strobing */
.ode-pin-glow {
  position: absolute;
  border-radius: 999px;
  background: var(--ode-c-pin-hot);
  box-shadow: 0 0 8px 1px rgba(255, 225, 88, 0.55);
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.ode-pin-glow.is-hot {
  opacity: 0.9;
  transition-duration: 0.15s;
}

/* a short capsule, centred on (0,0) so its transform puts the centre on the
   trace; the head is at +x, the direction of travel */
.ode-packet {
  position: absolute;
  left: -13px;
  top: -2px;
  width: 26px;
  height: 4px;
  border-radius: 2px;
  visibility: hidden;
  --packet: var(--ode-c-packet-blue);
  background: linear-gradient(90deg, transparent, var(--packet) 60%);
  box-shadow: 4px 0 8px 1px color-mix(in srgb, var(--packet) 30%, transparent);
}

.ode-packet.tone--gold { --packet: var(--ode-c-pin-hot); }

/* site credit (the footer is off on this page) and the motion toggle */
.ode-board__foot {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 10px;
}

@media (min-width: 640px) {
  .ode-board__foot { padding: 0 48px 10px; }
}

@media (min-width: 960px) {
  .ode-board__foot { padding: 0 64px 10px; }
}

.vp-doc .ode-board__credit {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.5);
}

.vp-doc .ode-board__credit :deep(a) {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.vp-doc .ode-board__credit :deep(a:hover) {
  color: var(--ode-c-accent-1);
}

.ode-board__motion {
  flex-shrink: 0;
  margin-left: auto;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
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
