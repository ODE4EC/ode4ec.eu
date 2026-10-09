<script setup lang="ts" generic="T extends { url: string }">
import { ref, useId } from 'vue'
import { useCarousel } from './useCarousel'

defineProps<{
  title: string
  /** what one item is called, for the button labels: "news", "event" */
  noun: string
  allHref: string
  allLabel: string
  items: T[]
  empty: string
}>()

const id = useId()
const track = ref<HTMLElement | null>(null)
const { atStart, atEnd, step, update } = useCarousel(track)
</script>

<template>
  <section class="ode-module" :aria-labelledby="`${id}-title`">
    <div class="ode-module__head">
      <h2 :id="`${id}-title`" class="ode-eyebrow">{{ title }}</h2>
      <div v-if="items.length > 1" class="ode-module__nav">
        <button type="button" :aria-label="`Previous ${noun}`" :aria-controls="`${id}-track`" :disabled="atStart" @click="step(-1)">‹</button>
        <button type="button" :aria-label="`Next ${noun}`" :aria-controls="`${id}-track`" :disabled="atEnd" @click="step(1)">›</button>
      </div>
      <a class="ode-module__all" :href="allHref">{{ allLabel }}</a>
    </div>

    <ul v-if="items.length" :id="`${id}-track`" ref="track" class="ode-module__track" :class="{ 'is-end': atEnd }" :aria-label="title" @scroll.passive="update">
      <li v-for="item in items" :key="item.url">
        <slot :item="item" />
      </li>
    </ul>
    <p v-else class="ode-module__empty">{{ empty }}</p>
  </section>
</template>
