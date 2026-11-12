<script setup lang="ts">
defineProps<{ label?: string; link?: string; linkText?: string }>()
</script>

<template>
  <div class="key-facts-block">
    <dl class="key-facts" :aria-label="label ?? 'Key facts'">
      <slot />
    </dl>
    <a v-if="link" class="key-facts__link no-icon" :href="link" target="_blank" rel="noreferrer">
      {{ linkText ?? 'View on CORDIS' }}
      <span class="vpi-arrow-right" aria-hidden="true" />
      <span class="visually-hidden">(opens in a new tab)</span>
    </a>
  </div>
</template>

<style scoped>
.key-facts-block {
  margin: 24px 0 8px;
}

/* Chips fill the row and wrap; a lone last chip stretches rather than leaving a gap. */
.key-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 12px;
  margin: 0;
  padding: 6px 0;
}

.key-facts__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  margin-top: 18px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s;
}

/* Same chip as the facts, pins included; the arrow says it's a link. */
.key-facts__link::before,
.key-facts__link::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  height: 3px;
  background: repeating-linear-gradient(90deg, color-mix(in srgb, var(--ode-c-gold-shade) 70%, transparent) 0 4px, transparent 4px 9px);
}

.dark .key-facts__link::before,
.dark .key-facts__link::after {
  background: repeating-linear-gradient(90deg, var(--ode-c-gold-dark) 0 4px, transparent 4px 9px);
}

.key-facts__link::before { top: -4px; }
.key-facts__link::after { bottom: -4px; }

.key-facts__link:hover {
  border-color: var(--vp-c-brand-1);
}

.key-facts__link .vpi-arrow-right {
  margin-left: auto;
  color: var(--vp-c-brand-1);
}
</style>
