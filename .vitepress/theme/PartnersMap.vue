<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import mapData from './data/europe-map.json'
import { AMS_PARTNERS, DIG_PARTNERS, PIV_PARTNERS, type Partner } from './data/partners'

const props = defineProps<{
  project: 'ams' | 'dig' | 'piv'
}>()

const PARTNERS = { ams: AMS_PARTNERS, dig: DIG_PARTNERS, piv: PIV_PARTNERS }
const partners = computed(() => PARTNERS[props.project])

type Point = { x: number; y: number }
const CITIES = mapData.cities as Record<string, Point>

/** Locations closer than this (map units, roughly 15 km) share one marker. */
const MERGE_DIST = 3
/** Padding around the markers when framing the map, in map units. */
const PAD = 30
/** Keep the framed map between these width/height ratios. */
const MIN_ASPECT = 1.25
const MAX_ASPECT = 1.6
/** Minimum clear space between two marker edges after relaxing. */
const MARKER_GAP = 1.2

interface Site {
  key: string
  names: string[]
  country: string
  partners: Partner[]
  /** true location */
  ax: number
  ay: number
  /** drawn location, nudged apart from its neighbours when they overlap */
  x: number
  y: number
  r: number
  nudged: boolean
}

const sites = computed<Site[]>(() => {
  const list: Site[] = []
  for (const p of partners.value) {
    const pt = CITIES[p.city]
    if (!pt) {
      if (import.meta.env.DEV) console.warn(`[PartnersMap] no map coordinates for "${p.city}"`)
      continue
    }
    const [name, country] = p.city.split(', ')
    let site = list.find((s) => Math.hypot(s.ax - pt.x, s.ay - pt.y) < MERGE_DIST)
    if (!site) {
      site = { key: p.city, names: [], country, partners: [], ax: pt.x, ay: pt.y, x: pt.x, y: pt.y, r: 0, nudged: false }
      list.push(site)
    }
    if (!site.names.includes(name)) site.names.push(name)
    site.partners.push(p)
  }
  for (const s of list) s.r = 3.6 + Math.min(s.partners.length - 1, 4) * 0.7
  relax(list)
  for (const s of list) s.nudged = Math.hypot(s.x - s.ax, s.y - s.ay) > 0.5
  return list
})

// Push overlapping markers apart. Deterministic (fixed order, fixed
// iterations) so the server and client render identical positions.
function relax(list: Site[]) {
  for (let iter = 0; iter < 80; iter++) {
    let moved = false
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.01
        const min = a.r + b.r + MARKER_GAP
        if (d >= min) continue
        const push = (min - d) / 2
        a.x -= (dx / d) * push
        a.y -= (dy / d) * push
        b.x += (dx / d) * push
        b.y += (dy / d) * push
        moved = true
      }
    }
    if (!moved) break
  }
}

// Frame the map on the markers rather than on the whole source projection.
const view = computed(() => {
  const s = sites.value
  let x0 = Math.min(...s.map((m) => m.x - m.r)) - PAD
  let x1 = Math.max(...s.map((m) => m.x + m.r)) + PAD
  let y0 = Math.min(...s.map((m) => m.y - m.r)) - PAD
  let y1 = Math.max(...s.map((m) => m.y + m.r)) + PAD
  const w = x1 - x0
  const h = y1 - y0
  if (w / h < MIN_ASPECT) {
    const grow = (h * MIN_ASPECT - w) / 2
    x0 -= grow
    x1 += grow
  } else if (w / h > MAX_ASPECT) {
    const grow = (w / MAX_ASPECT - h) / 2
    y0 -= grow
    y1 += grow
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
})

// Split a path of absolute M/L(/Z) commands into subpaths with bounding boxes,
// so polygons far outside the frame (e.g. Atlantic islands) are not drawn.
function splitPath(d: string) {
  return d
    .split(/(?=M)/)
    .filter(Boolean)
    .map((sub) => {
      const nums = sub.match(/-?\d+(?:\.\d+)?/g)!.map(Number)
      const xs = nums.filter((_, i) => i % 2 === 0)
      const ys = nums.filter((_, i) => i % 2 === 1)
      return { d: sub, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
    })
}

const LAND = splitPath(mapData.landPath)
const BORDERS = splitPath(mapData.borderPath)

function inView(parts: ReturnType<typeof splitPath>) {
  const v = view.value
  return parts
    .filter((p) => p.x1 >= v.x && p.x0 <= v.x + v.w && p.y1 >= v.y && p.y0 <= v.y + v.h)
    .map((p) => p.d)
    .join('')
}

const land = computed(() => inView(LAND))
const borders = computed(() => inView(BORDERS))

const clipId = `pmap-clip-${useId()}`

// The first partner listed is the coordinator, so its location is the default.
const activeKey = ref<string | null>(null)
const hoverKey = ref<string | null>(null)
const activeSite = computed(() => sites.value.find((s) => s.key === activeKey.value) ?? sites.value[0])

function select(key: string) {
  activeKey.value = key
}

// Chips: coordinator's location first, then the biggest hubs, then A–Z.
const chips = computed(() =>
  sites.value
    .map((s, i) => ({ s, i }))
    .sort((a, b) =>
      a.i === 0 ? -1 : b.i === 0 ? 1
        : b.s.partners.length - a.s.partners.length || a.s.names[0].localeCompare(b.s.names[0]))
    .map(({ s }) => s),
)

const countryCount = computed(() => new Set(sites.value.map((s) => s.country)).size)
</script>

<template>
  <div class="pmap">
    <div class="pmap__map">
      <svg
        class="pmap__svg"
        :viewBox="`${view.x} ${view.y} ${view.w} ${view.h}`"
        role="img"
        :aria-label="`Map of ${partners.length} partners in ${sites.length} locations across ${countryCount} countries`"
      >
        <defs>
          <clipPath :id="clipId">
            <rect :x="view.x" :y="view.y" :width="view.w" :height="view.h" />
          </clipPath>
        </defs>
        <g :clip-path="`url(#${clipId})`">
          <path class="pmap__land" :d="land" />
          <path class="pmap__borders" :d="borders" />

          <!-- nudged markers keep a trace back to a via at the true location -->
          <g class="pmap__leaders">
            <template v-for="s in sites" :key="`l-${s.key}`">
              <template v-if="s.nudged">
                <line :x1="s.ax" :y1="s.ay" :x2="s.x" :y2="s.y" />
                <circle :cx="s.ax" :cy="s.ay" r="1.1" />
              </template>
            </template>
          </g>

          <!-- every hit area sits under every marker, so a marker always wins
               over a neighbour's larger hit area -->
          <circle
            v-for="s in sites"
            :key="`h-${s.key}`"
            class="pmap__hit"
            :cx="s.x"
            :cy="s.y"
            :r="s.r + 4"
            @click="select(s.key)"
            @mouseenter="hoverKey = s.key"
            @mouseleave="hoverKey = null"
          />
          <g
            v-for="s in sites"
            :key="s.key"
            class="pmap__site"
            :class="{
              'pmap__site--active': activeSite?.key === s.key,
              'pmap__site--hover': hoverKey === s.key,
            }"
            @click="select(s.key)"
            @mouseenter="hoverKey = s.key"
            @mouseleave="hoverKey = null"
          >
            <circle class="pmap__ring" :cx="s.x" :cy="s.y" :r="s.r + 1.8" />
            <circle class="pmap__marker" :cx="s.x" :cy="s.y" :r="s.r" />
            <text
              v-if="s.partners.length > 1"
              class="pmap__count"
              :x="s.x"
              :y="s.y"
              text-anchor="middle"
              dominant-baseline="central"
            >{{ s.partners.length }}</text>
          </g>
        </g>
      </svg>
    </div>

    <div class="pmap__panel">
      <div v-if="activeSite" class="pmap__detail" aria-live="polite">
        <p class="pmap__detail-place">
          {{ activeSite.names.join(' · ') }}<span>, {{ activeSite.country }}</span>
        </p>
        <ul class="pmap__detail-list">
          <li v-for="p in activeSite.partners" :key="p.name">
            <span class="pmap__flag">{{ p.flag }}</span>
            <span>
              {{ p.name }}
              <em v-if="p.role">{{ p.role }}</em>
            </span>
          </li>
        </ul>
      </div>

      <div class="pmap__sites-block">
        <p :id="`${clipId}-label`" class="pmap__sites-label">Locations</p>
        <ul class="pmap__sites" :aria-labelledby="`${clipId}-label`">
          <li v-for="s in chips" :key="s.key">
            <button
              type="button"
              class="pmap__chip"
              :aria-pressed="activeSite?.key === s.key"
              @click="select(s.key)"
              @mouseenter="hoverKey = s.key"
              @mouseleave="hoverKey = null"
              @focus="hoverKey = s.key"
              @blur="hoverKey = null"
            >
              {{ s.names.join(' · ') }}
              <span class="pmap__chip-count">{{ s.partners.length }}<span class="visually-hidden"> partners</span></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The map is always a dark board, in both color schemes. */
.pmap {
  --pmap-gold: var(--ode-c-accent-1);
  --pmap-trace: var(--ode-c-trace-blue);

  display: grid;
  gap: 20px;
  margin: 32px 0;
  padding: 16px;
  background: linear-gradient(165deg, var(--ode-c-board), var(--ode-c-board-deep));
  border: 1px solid rgba(127, 176, 255, 0.18);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  color: #fff;
}

@media (min-width: 640px) {
  .pmap {
    padding: 20px;
  }
}

.pmap__map {
  position: relative;
  align-self: start;
  border-radius: 10px;
  overflow: hidden;
}

/* soften the rectangular crop into the board */
.pmap__map::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 62%, var(--ode-c-board-deep) 100%);
  opacity: 0.7;
}

.pmap__svg {
  display: block;
  width: 100%;
  height: auto;
}

.pmap__land {
  fill: var(--ode-c-board-land);
}

.pmap__borders {
  fill: none;
  stroke: rgba(255, 255, 255, 0.14);
  stroke-width: 0.4;
}

.pmap__leaders line {
  stroke: var(--pmap-trace);
  stroke-width: 0.7;
  stroke-linecap: round;
  opacity: 0.8;
}

.pmap__leaders circle {
  fill: var(--pmap-trace);
}

.pmap__site {
  cursor: pointer;
}

.pmap__hit {
  fill: transparent;
  cursor: pointer;
}


.pmap__ring {
  pointer-events: none;
  fill: none;
  stroke: #fff;
  stroke-width: 0.9;
  opacity: 0;
  transition: opacity 0.15s;
}

.pmap__marker {
  fill: var(--pmap-gold);
  stroke: var(--ode-c-board-deep);
  stroke-width: 0.7;
  transition: fill 0.15s;
}

.pmap__site--hover .pmap__marker {
  fill: var(--ode-c-pin-hot);
}

.pmap__site--hover .pmap__ring {
  opacity: 0.45;
}

.pmap__site--active .pmap__ring {
  opacity: 1;
}

.pmap__count {
  fill: var(--ode-c-board-deep);
  font-size: 4.2px;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.pmap__panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.pmap__detail {
  min-height: 120px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(127, 176, 255, 0.2);
  border-left: 3px solid var(--pmap-gold);
  border-radius: 10px;
}

.pmap__detail-place {
  margin: 0 0 8px;
  font-family: var(--vp-font-family-heading);
  font-weight: 700;
  font-size: 16px;
  line-height: 1.35;
}

.pmap__detail-place span {
  font-family: var(--vp-font-family-base);
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.pmap__detail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.45;
}

.pmap__detail-list li {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 3px 0;
}

.pmap__detail-list em {
  display: block;
  font-style: normal;
  font-size: 12.5px;
  color: var(--pmap-trace);
}

.pmap__sites-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.pmap__sites {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pmap__sites li {
  margin: 0;
}

.pmap__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 3px 6px 3px 10px;
  border: 1px solid rgba(127, 176, 255, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.pmap__chip:hover {
  border-color: rgba(127, 176, 255, 0.6);
  background: rgba(127, 176, 255, 0.1);
}

.pmap__chip:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.pmap__chip[aria-pressed='true'] {
  border-color: var(--pmap-gold);
  background: rgba(255, 214, 23, 0.12);
  color: #fff;
}

.pmap__chip-count {
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(127, 176, 255, 0.18);
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
}

.pmap__chip[aria-pressed='true'] .pmap__chip-count {
  background: var(--pmap-gold);
  color: var(--ode-c-board-deep);
}

/* map on top, full width; detail and locations side by side below it */
@media (min-width: 640px) {
  .pmap__panel {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: 20px;
    align-items: start;
  }
}
</style>
