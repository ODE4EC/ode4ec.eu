<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <li class="flow-step">
    <span class="num" aria-hidden="true" />
    <div>
      <strong>{{ title }}</strong>
      <div class="text"><slot /></div>
    </div>
  </li>
</template>

<style scoped>
.flow-step {
  display: flex;
  gap: 0.75rem;
  min-width: 0;
  overflow-wrap: anywhere;
  margin: 0;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  counter-increment: step;
}

.num {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-weight: 600;
  font-size: 0.9rem;
}

.num::before {
  content: counter(step);
}

strong {
  display: block;
  line-height: 1.75rem;
}

.text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}

.text :deep(p) {
  margin: 0;
}
</style>
