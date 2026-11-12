<script setup lang="ts">
// Decorative circuitry at the foot of the sidebar: two chips with traces in the
// board's 45° routing, rising from the bottom edge. It is the last item in the
// sidebar's nav column and is pushed to the bottom (see style.css), so added
// links push it down rather than run under it. Wires leave only through the
// bottom and right edges; on the left every wire ends in a via.
type Pt = [number, number]

const pins = (x0: number, y0: number, size: number, step: number) => {
  const out: { x: number; y: number; w: number; h: number }[] = []
  for (let o = step; o < size; o += step) {
    out.push({ x: x0 + o - 1.5, y: y0 - 4, w: 3, h: 4 }, { x: x0 + o - 1.5, y: y0 + size, w: 3, h: 4 })
    out.push({ x: x0 - 4, y: y0 + o - 1.5, w: 4, h: 3 }, { x: x0 + size, y: y0 + o - 1.5, w: 4, h: 3 })
  }
  return out
}

const chips = [
  { x: 120, y: 110, size: 40, pins: pins(120, 110, 40, 10) },
  { x: 100, y: 230, size: 64, pins: pins(100, 230, 64, 10) },
]

const traces: { d: string; tone: 'blue' | 'gold' }[] = [
  { d: 'M118 298 V460', tone: 'blue' },
  { d: 'M148 298 V340 l24 24 V460', tone: 'gold' },
  { d: 'M168 256 H200 l30 -30 H900', tone: 'gold' },
  { d: 'M168 278 H900', tone: 'blue' },
  { d: 'M96 250 H50 l-20 -20 V170', tone: 'blue' },
  { d: 'M96 274 H60 l-20 20 V330', tone: 'gold' },
  { d: 'M132 226 V154', tone: 'blue' },
  { d: 'M140 106 V60', tone: 'gold' },
  { d: 'M128 106 V80 l-24 -24 V30', tone: 'blue' },
  { d: 'M164 130 H210 l20 -20 V70', tone: 'blue' },
  { d: 'M116 130 H80 l-20 20 V200', tone: 'gold' },
]

const vias: Pt[] = [[30, 170], [40, 330], [140, 60], [104, 30], [230, 70], [60, 200]]
</script>

<template>
  <div class="sidebar-art" aria-hidden="true">
    <svg viewBox="0 0 280 400" preserveAspectRatio="xMaxYMax meet" focusable="false">
      <path v-for="t in traces" :key="t.d" :d="t.d" :class="`tone--${t.tone}`" />
      <g v-for="c in chips" :key="c.x">
        <rect v-for="(p, i) in c.pins" :key="i" class="pin" :x="p.x" :y="p.y" :width="p.w" :height="p.h" />
        <rect class="chip" :x="c.x" :y="c.y" :width="c.size" :height="c.size" rx="7" />
        <circle class="notch" :cx="c.x + 9" :cy="c.y + 9" r="2.5" />
      </g>
      <circle v-for="[cx, cy] in vias" :key="`${cx},${cy}`" class="via" :cx="cx" :cy="cy" r="3.5" />
    </svg>
  </div>
</template>

<style scoped>
/* A placeholder at the foot of the nav column: with VitePress's 96px sidebar
   bottom padding it reserves the drawing plus a 48px gap above it, so links
   can never run under the art. */
.sidebar-art {
  --art-h: 400px;
  flex: none;
  height: calc(var(--art-h) + 48px - 96px);
  margin-top: auto;
}

/* No top: the drawing keeps its place in the flow (48px into the placeholder,
   so it ends at the sidebar's bottom edge and scrolls with the links), while
   left/width resolve against the fixed sidebar to span it edge to edge. */
.sidebar-art svg {
  position: absolute;
  left: 0;
  margin-top: 48px;
  pointer-events: none;
  width: 100%;
  height: var(--art-h);
  overflow: hidden;
  mask-image: linear-gradient(transparent, #000 40%);
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tone--blue { stroke: var(--vp-c-brand-2); opacity: 0.4; }
.tone--gold { stroke: var(--ode-c-gold-shade); opacity: 0.65; }

.chip {
  fill: var(--vp-c-bg-soft);
  stroke: var(--ode-c-card-edge);
}

.pin { fill: var(--ode-c-gold-shade); opacity: 0.7; }
.notch { fill: var(--ode-c-card-edge); }

.via {
  fill: var(--vp-c-bg-alt);
  stroke: var(--ode-c-gold-shade);
  stroke-width: 2;
}

/* On short windows the art would push the sidebar into scrolling: leave it out. */
@media (max-height: 800px) {
  .sidebar-art { display: none; }
}
</style>
