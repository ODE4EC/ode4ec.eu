<script setup lang="ts">
// A numbered strip of <FlowStep>s: how a project's work fits together.
</script>

<template>
  <ol class="flow">
    <slot />
  </ol>
</template>

<style scoped>
.flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}
</style>
