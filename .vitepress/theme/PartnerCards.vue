<script setup lang="ts">
// One group of a project's partner cards, from data/partners.ts.
import { computed } from 'vue'
import { PARTNERS, type PartnerType, type ProjectId } from './data/partners'
import Card from './Card.vue'
import CardGrid from './CardGrid.vue'

const props = defineProps<{ project: ProjectId; group: PartnerType }>()

const partners = computed(() => PARTNERS[props.project].filter((p) => p.type === props.group))

const urls = (u?: string | string[]) => (u === undefined ? [] : [u].flat())
const label = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '')
</script>

<template>
  <CardGrid>
    <Card
      v-for="p in partners"
      :key="p.name"
      :title="p.name"
      :logo="p.logo"
      :flag="p.flag"
      :hover="urls(p.url).length > 1"
      :link="urls(p.url).length === 1 ? urls(p.url)[0] : undefined"
      :link-text="urls(p.url).length === 1 ? label(urls(p.url)[0]) : undefined"
      :target="urls(p.url).length === 1 ? '_blank' : undefined"
      :rel="urls(p.url).length === 1 ? 'noopener' : undefined"
    >
      <p>{{ p.location ?? p.city }}</p>
      <Badge v-if="p.role" type="tip" :text="p.role" />{{ p.role && p.wps ? ' ' : '' }}<Badge v-if="p.wps" type="tip" :text="`${p.wps.join(' · ')} lead`" />
      <ul v-if="urls(p.url).length > 1" class="links">
        <li v-for="u in urls(p.url)" :key="u">
          <a :href="u" target="_blank" rel="noopener">{{ label(u) }} <span class="vpi-arrow-right" /></a>
        </li>
      </ul>
    </Card>
  </CardGrid>
</template>

<style scoped>
.links { list-style: none; margin: 8px 0 0; padding: 0; }
.links a { display: inline-flex; align-items: center; font-size: 14px; font-weight: 500; color: var(--vp-c-brand-1); text-decoration: none; }
.links a .vpi-arrow-right { margin-left: 6px; }
.links a:hover { text-decoration: underline; }
</style>
