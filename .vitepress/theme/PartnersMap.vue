<script setup lang="ts">
import { computed, ref } from 'vue'
import mapData from './data/europe-map.json'

interface Partner {
  name: string
  flag: string
  city: string
  role?: string
}

const props = defineProps<{
  project: 'dig' | 'piv'
}>()

// City keys must match a key in ./data/europe-map.json's "cities" map
// (generated from real coordinates via d3-geo — see the map's own README-less
// build script in scratch history; keep new cities consistent with that source).
const DIG_PARTNERS: Partner[] = [
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy', role: 'Coordinator' },
  { name: 'Sorbonne Université', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'University of Thessaly', flag: '🇬🇷', city: 'Volos, Greece' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy' },
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain' },
  { name: 'CSIC', flag: '🇪🇸', city: 'Madrid, Spain' },
  { name: 'IHP GmbH', flag: '🇩🇪', city: 'Frankfurt (Oder), Germany' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany' },
  { name: 'TU Darmstadt', flag: '🇩🇪', city: 'Darmstadt, Germany' },
  { name: 'JMU Würzburg', flag: '🇩🇪', city: 'Würzburg, Germany' },
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal' },
  { name: 'STMicroelectronics', flag: '🇮🇹', city: 'Agrate Brianza, Italy' },
  { name: 'Resiltech', flag: '🇮🇹', city: 'Cascina, Italy' },
  { name: 'Seamless Waves', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Kepler', flag: '🇫🇷', city: 'Palaiseau, France' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria' },
  { name: 'KTH Royal Institute of Technology', flag: '🇸🇪', city: 'Stockholm, Sweden' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'NanoWired', flag: '🇩🇪', city: 'Gernsheim, Germany' },
  { name: 'Joseki Solutions', flag: '🇭🇺', city: 'Budapest, Hungary' },
]

const PIV_PARTNERS: Partner[] = [
  { name: 'INESC TEC', flag: '🇵🇹', city: 'Porto, Portugal', role: 'Coordinator' },
  { name: 'Munich University of Applied Sciences', flag: '🇩🇪', city: 'Munich, Germany', role: 'Technical Manager' },
  { name: 'ETH Zürich', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'Politecnico di Milano', flag: '🇮🇹', city: 'Milano, Italy' },
  { name: 'Politecnico di Torino', flag: '🇮🇹', city: 'Torino, Italy' },
  { name: 'YosysHQ', flag: '🇦🇹', city: 'Vienna, Austria' },
  { name: 'Linköping University', flag: '🇸🇪', city: 'Linköping, Sweden' },
  { name: 'Qamcom', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'BTU Cottbus-Senftenberg', flag: '🇩🇪', city: 'Cottbus, Germany' },
  { name: 'JKU Linz', flag: '🇦🇹', city: 'Linz, Austria' },
  { name: 'Chipmind', flag: '🇨🇭', city: 'Zürich, Switzerland' },
  { name: 'Barcelona Supercomputing Center', flag: '🇪🇸', city: 'Barcelona, Spain' },
  { name: 'Lubis EDA', flag: '🇩🇪', city: 'Kaiserslautern, Germany' },
  { name: 'Infineon Technologies', flag: '🇩🇪', city: 'Neubiberg, Germany' },
  { name: 'CEA', flag: '🇫🇷', city: 'Paris, France' },
  { name: 'Technical University of Denmark', flag: '🇩🇰', city: 'Kongens Lyngby, Denmark' },
  { name: 'Universidad Politécnica de Madrid', flag: '🇪🇸', city: 'Madrid, Spain' },
  { name: 'Synective Labs', flag: '🇸🇪', city: 'Gothenburg, Sweden' },
  { name: 'SyoSil', flag: '🇩🇰', city: 'Taastrup, Denmark' },
  { name: 'E4 Computer Engineering', flag: '🇮🇹', city: 'Scandiano, Italy' },
  { name: 'Universität zu Lübeck', flag: '🇩🇪', city: 'Lübeck, Germany' },
  { name: 'IObundle', flag: '🇵🇹', city: 'Lisboa, Portugal' },
  { name: 'EDALab', flag: '🇮🇹', city: 'Verona, Italy' },
  { name: 'INESC-ID', flag: '🇵🇹', city: 'Lisboa, Portugal' },
]

const partners = computed(() => (props.project === 'dig' ? DIG_PARTNERS : PIV_PARTNERS))

const markers = computed(() => {
  const byCity = new Map<string, Partner[]>()
  for (const p of partners.value) {
    if (!byCity.has(p.city)) byCity.set(p.city, [])
    byCity.get(p.city)!.push(p)
  }
  return [...byCity.entries()]
    .map(([city, list]) => {
      const point = (mapData.cities as Record<string, { x: number; y: number }>)[city]
      if (!point) return null
      return {
        city,
        list,
        x: point.x,
        y: point.y,
        r: 6 + Math.min(list.length - 1, 4) * 1.6,
      }
    })
    .filter((m): m is NonNullable<typeof m> => m !== null)
})

// The generated landPath only occupies y≈188–612 of the 820×800 source
// projection, so rendering the full viewBox left huge empty bands above and
// below the map. Crop the viewBox to the drawn content instead.
const VIEW = { x: 0, y: 180, w: 820, h: 440 }

const activeCity = ref<string | null>(null)

function toggle(city: string) {
  activeCity.value = activeCity.value === city ? null : city
}

const activeMarker = computed(() => markers.value.find((m) => m.city === activeCity.value) ?? null)

const tooltipAnchor = computed(() => {
  const m = activeMarker.value
  if (!m) return 'right'
  if (m.x > mapData.width * 0.62) return 'left'
  return 'right'
})
</script>

<template>
  <div class="pmap">
    <svg
      class="pmap__svg"
      :viewBox="`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`"
      @click="activeCity = null"
    >
      <path class="pmap__land" :d="mapData.landPath" />
      <path class="pmap__borders" :d="mapData.borderPath" />

      <g v-for="m in markers" :key="m.city">
        <circle
          class="pmap__glow"
          :cx="m.x"
          :cy="m.y"
          :r="m.r * 2.4"
        />
        <circle
          class="pmap__marker"
          :class="{ 'pmap__marker--active': activeCity === m.city }"
          :cx="m.x"
          :cy="m.y"
          :r="m.r"
          tabindex="0"
          role="button"
          :aria-label="`${m.city}: ${m.list.length} partner${m.list.length > 1 ? 's' : ''}`"
          @click.stop="toggle(m.city)"
          @keydown.enter.stop="toggle(m.city)"
        />
        <text
          v-if="m.list.length > 1"
          class="pmap__count"
          :x="m.x"
          :y="m.y"
          text-anchor="middle"
          dominant-baseline="central"
        >{{ m.list.length }}</text>
      </g>

      <foreignObject
        v-if="activeMarker"
        :x="tooltipAnchor === 'left' ? activeMarker.x - 236 : activeMarker.x + 16"
        :y="Math.min(Math.max(VIEW.y + 8, activeMarker.y - 14), VIEW.y + VIEW.h - 150)"
        width="220"
        height="200"
        style="overflow: visible; pointer-events: none"
      >
        <div class="pmap__tooltip" xmlns="http://www.w3.org/1999/xhtml">
          <p class="pmap__tooltip-city">{{ activeMarker.city }}</p>
          <ul>
            <li v-for="p in activeMarker.list" :key="p.name">
              <span>{{ p.flag }}</span> {{ p.name }}
              <em v-if="p.role">— {{ p.role }}</em>
            </li>
          </ul>
        </div>
      </foreignObject>
    </svg>
    <p class="pmap__hint">Tap a marker to see the partners based there.</p>
  </div>
</template>

<style scoped>
.pmap {
  margin: 32px 0;
  padding: 20px;
  background: linear-gradient(165deg, #041226, #00060f);
  border: 1px solid rgba(255, 214, 23, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.pmap__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.pmap__land {
  fill: #123564;
  stroke: none;
}

.pmap__borders {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
}

.pmap__glow {
  fill: #ffd617;
  opacity: 0.18;
}

.pmap__marker {
  fill: #ffd617;
  stroke: #00122a;
  stroke-width: 1.5;
  cursor: pointer;
  transition: r 0.15s;
}

.pmap__marker:hover,
.pmap__marker--active {
  fill: #fff2b8;
}

.pmap__count {
  fill: #00122a;
  font-size: 9px;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.pmap__tooltip {
  pointer-events: none;
  background: linear-gradient(165deg, rgba(14, 34, 68, 0.97), rgba(4, 12, 26, 0.98));
  border: 1px solid rgba(255, 214, 23, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 13px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

.pmap__tooltip-city {
  margin: 0 0 6px;
  font-weight: 700;
  font-family: var(--vp-font-family-heading);
  color: var(--ode-c-accent-1, #ffd617);
}

.pmap__tooltip ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pmap__tooltip li {
  padding: 2px 0;
  line-height: 1.4;
}

.pmap__tooltip em {
  color: rgba(255, 255, 255, 0.6);
  font-style: normal;
  font-size: 12px;
}

.pmap__hint {
  margin: 12px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}
</style>
