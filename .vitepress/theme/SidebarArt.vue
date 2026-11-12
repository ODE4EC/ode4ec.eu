<script setup lang="ts">
// Decorative circuitry under the sidebar links: two chips with traces in the
// board's 45° routing, some leaving off the sides. It sits in the normal flow
// after the last link, so adding links moves it down instead of under them.
// The drawing itself spans the whole sidebar (its padding varies with width),
// so side traces run out to both edges; the chips keep 40 units clear of the right edge.
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
  { x: 88, y: 78, size: 64, pins: pins(88, 78, 64, 10) },
  { x: 110, y: 250, size: 40, pins: pins(110, 250, 40, 10) },
]

const traces: { d: string; tone: 'blue' | 'gold' }[] = [
  { d: 'M98 74 V44 l-24 -24 H-600', tone: 'blue' },
  { d: 'M128 74 V30', tone: 'gold' },
  { d: 'M156 98 H190 l20 -20 V40', tone: 'blue' },
  { d: 'M156 118 H840', tone: 'gold' },
  { d: 'M84 108 H44 l-16 16 V170', tone: 'gold' },
  { d: 'M108 146 V180 l22 22 V246', tone: 'blue' },
  { d: 'M138 146 V170 l30 30 H840', tone: 'blue' },
  { d: 'M106 270 H64 l-20 20 V340', tone: 'blue' },
  { d: 'M130 294 V330 l24 24 V380', tone: 'gold' },
  { d: 'M154 260 H196 l40 -40 H840', tone: 'gold' },
]

const vias: Pt[] = [[128, 30], [210, 40], [28, 170], [44, 340], [154, 380]]
</script>

<template>
  <div class="sidebar-art" aria-hidden="true">
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMaxYMin meet" focusable="false">
    <defs>
      <linearGradient id="sidebar-art-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.55" stop-color="#fff" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <mask id="sidebar-art-mask">
        <rect x="-600" width="1440" height="400" fill="url(#sidebar-art-fade)" />
      </mask>
    </defs>
    <g mask="url(#sidebar-art-mask)">
      <path v-for="t in traces" :key="t.d" :d="t.d" :class="`tone--${t.tone}`" />
      <g v-for="c in chips" :key="c.x">
        <rect v-for="(p, i) in c.pins" :key="i" class="pin" :x="p.x" :y="p.y" :width="p.w" :height="p.h" />
        <rect class="chip" :x="c.x" :y="c.y" :width="c.size" :height="c.size" rx="7" />
        <circle class="notch" :cx="c.x + 9" :cy="c.y + 9" r="2.5" />
      </g>
      <circle v-for="[cx, cy] in vias" :key="`${cx},${cy}`" class="via" :cx="cx" :cy="cy" r="3.5" />
    </g>
  </svg>
  </div>
</template>

<style scoped>
.sidebar-art {
  height: 400px;
  margin-top: 40px;
}

/* No top: it keeps its place in the flow, while left/right resolve against the
   fixed sidebar, so the drawing spans edge to edge whatever the padding. */
.sidebar-art svg {
  position: absolute;
  left: 0;
  width: 100%;
  height: 400px;
  overflow: hidden;
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
