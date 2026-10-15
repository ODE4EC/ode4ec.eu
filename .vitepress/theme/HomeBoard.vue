<script setup lang="ts">
// The homepage board: the chip and the modules beside it, over one circuit
// drawn in real pixels from their measured positions, so every trace lands on
// a pin at any viewport size.
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import HomeChip from './HomeChip.vue'
import HomeWhy from './HomeWhy.vue'
import HomeEvents from './HomeEvents.vue'
import HomeNews from './HomeNews.vue'
import SiteFooter from './SiteFooter.vue'
import { buildCircuit, type Circuit, type Rect, type Trace } from './circuit/layout'
import { usePacketMotion } from './circuit/usePacketMotion'

const root = ref<HTMLElement | null>(null)
const packetLayer = ref<HTMLElement | null>(null)
const size = ref({ w: 0, h: 0 })
const TONES = ['deep', 'blue', 'gold'] as const
// Empty on the server and on first client render (hydration must match);
// filled in after mount.
const circuit = shallowRef<Circuit | null>(null)

const tracesByTone = computed(() => {
  const groups: Record<string, Trace[]> = {}
  for (const t of circuit.value?.traces ?? []) (groups[t.tone] ??= []).push(t)
  return groups
})

const { mounted, reducedMotion, userPaused, toggleMotion } = usePacketMotion(root, packetLayer, circuit)

function measure() {
  const el = root.value
  const chipEl = el?.querySelector('.ode-chip')
  if (!el || !chipEl) return
  const moduleEls = [...el.querySelectorAll('.ode-module')]
  const footEl = el.querySelector('.ode-board__foot')

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
let unmounted = false
function scheduleMeasure() {
  if (unmounted) return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(scheduleMeasure)
  resizeObserver.observe(root.value!)
  // the footer too: when it changes height the chip moves without resizing
  for (const el of root.value!.querySelectorAll('.ode-chip, .ode-module, .ode-board__foot')) resizeObserver.observe(el)
  document.fonts?.ready.then(scheduleMeasure)
})

onBeforeUnmount(() => {
  unmounted = true
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
      <!-- one group per tone, so overlapping traces of a tone share one opacity -->
      <g class="ode-board__traces">
        <g v-for="tone in TONES" :key="tone" :class="`tone--${tone}`">
          <path v-for="t in tracesByTone[tone]" :key="t.id" :d="t.d" />
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
      <span
        v-for="t in circuit.traces"
        :key="`p-${t.id}`"
        class="ode-packet"
        :class="`tone--${t.tone}`"
        :data-packet="t.id"
      />
    </div>

    <div class="ode-board__grid">
      <HomeChip />
      <div class="ode-board__side">
        <HomeWhy />
        <HomeEvents />
        <HomeNews />
      </div>
    </div>

    <SiteFooter home class="ode-board__foot">
      <template #controls>
        <button
          v-if="mounted && !reducedMotion"
          class="ode-board__motion"
          type="button"
          @click="toggleMotion"
        >
          <svg v-if="userPaused" width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M4 2.5v9M10 2.5v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          </svg>
          {{ userPaused ? 'Play' : 'Pause' }} background animation
        </button>
      </template>
    </SiteFooter>
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
  background: var(--vp-c-bg);
  color: var(--board-text-1);
  overflow: clip;
}

@media (min-width: 960px) {
  .ode-board {
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  }
}

@media (prefers-reduced-motion: reduce) {
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
  padding: 40px clamp(24px, 5vw + 8px, 64px) 32px;
}

@media (min-width: 960px) {
  .ode-board__grid { padding-top: calc(var(--vp-nav-height) + 48px); }
}

.ode-board__side {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 56px;
  min-width: 0;
}

@media (min-width: 1152px) and (min-height: 600px) {
  .ode-board__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: clamp(76px, 7vw, 112px);
    /* the chip spans the module column top to bottom, so the pins on its
       right edge face the modules' pins and the traces run straight */
    align-items: stretch;
    padding-top: calc(var(--vp-nav-height) + clamp(8px, 2vh, 32px));
    padding-bottom: clamp(8px, 1.5vh, 20px);
  }

  /* modules keep their own height; when the chip is the taller column the
     spare room goes between them, not inside them */
  .ode-board__side {
    align-content: space-between;
    gap: clamp(12px, 2.2vh, 22px);
  }
}

.ode-board__wires {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  animation: ode-fade-in 0.8s ease-out;
}

/* At 960px+ the transparent navbar sits over the board: fade the traces out
   underneath it. Keep in sync with NAV_FADE_* in circuit/usePacketMotion.ts. */
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

.ode-board__traces .tone--gold { stroke: var(--board-trace-gold); opacity: calc(var(--board-trace-opacity) + 0.12); }
.ode-board__traces .tone--blue { stroke: var(--board-trace-blue); opacity: calc(var(--board-trace-opacity) - 0.1); }
.ode-board__traces .tone--deep { stroke: var(--board-trace-deep); opacity: calc(var(--board-trace-opacity) + 0.1); }

.ode-board__vias circle {
  fill: var(--vp-c-bg);
  stroke-width: 2;
}

.ode-board__vias .tone--gold { stroke: var(--board-trace-gold); }
.ode-board__vias .tone--blue { stroke: var(--board-trace-blue); }
.ode-board__vias .tone--deep { stroke: var(--board-trace-deep); }

.ode-pin {
  fill: var(--board-pin-dim);
}

.ode-pin--wired {
  fill: var(--board-pin-wired);
}

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
  --packet: var(--board-packet-blue);
  background: linear-gradient(90deg, transparent, var(--packet) 60%);
  box-shadow: 4px 0 8px 1px color-mix(in srgb, var(--packet) 30%, transparent);
}

.ode-packet.tone--gold { --packet: var(--ode-c-pin-hot); }

/* above the wires and packets */
.ode-board__foot {
  z-index: 2;
}

.ode-board__motion {
  flex-shrink: 0;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.ode-board__motion:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

@media (pointer: coarse) {
  .ode-board__motion { min-height: 40px; }
}
</style>
