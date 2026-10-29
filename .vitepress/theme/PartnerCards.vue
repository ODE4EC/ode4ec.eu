<script setup lang="ts">
// One group of a project's partner cards, from data/partners.ts.
import { computed } from 'vue'
import { PARTNERS, type PartnerType, type ProjectId } from './data/partners'
import Card from './Card.vue'
import CardGrid from './CardGrid.vue'

const props = defineProps<{ project: ProjectId; group: PartnerType }>()

const partners = computed(() => PARTNERS[props.project].filter((p) => p.type === props.group))
</script>

<template>
  <CardGrid>
    <Card
      v-for="p in partners"
      :key="p.name"
      :title="p.name"
      :logo="p.logo"
      :flag="p.flag"
      :link="p.url"
      :link-text="p.url ? p.url.replace(/^https?:\/\/(www\.)?/, '') : undefined"
      :target="p.url ? '_blank' : undefined"
      :rel="p.url ? 'noopener' : undefined"
    >
      <p>{{ p.location ?? p.city }}</p>
      <Badge v-if="p.role" type="tip" :text="p.role" />{{ p.role && p.wps ? ' ' : '' }}<Badge v-if="p.wps" type="tip" :text="`${p.wps.join(' · ')} lead`" />
    </Card>
  </CardGrid>
</template>
