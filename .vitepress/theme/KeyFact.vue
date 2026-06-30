<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="key-fact">
    <dt>{{ label }}</dt>
    <dd>{{ value }}</dd>
  </div>
</template>

<style scoped>
.key-fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

dt {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

dd {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
