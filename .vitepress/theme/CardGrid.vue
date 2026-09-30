<script setup lang="ts">
// Optional responsive grid for laying out multiple <Card> components,
// mirroring the homepage features grid.
defineProps<{
  light?: boolean
}>()
</script>

<template>
  <div class="card-grid" :class="{ light }">
    <slot />
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 1rem 0;
}

/* Partner logos are designed for light backgrounds, so a `light` grid keeps
   the light-mode card palette in dark mode too. */
.dark .card-grid.light {
  --vp-c-bg-soft: #f6f6f7;
  --vp-c-text-1: rgba(60, 60, 67);
  --vp-c-text-2: rgba(60, 60, 67, 0.78);
  --vp-c-brand-1: #3451b2;
  color: var(--vp-c-text-1);
}
</style>
