<script setup lang="ts">
// Optional responsive grid for laying out multiple <Card> components,
// mirroring the homepage features grid.
</script>

<template>
  <div class="card-grid">
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
</style>
