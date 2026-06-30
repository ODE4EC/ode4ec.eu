<script setup lang="ts">
// Generic reusable card. Reuses VitePress's built-in feature-card styling
// (--vp-c-* variables → free dark mode + brand hover) and adds a default
// slot so any markdown can be placed inside it.
defineProps<{
  icon?: string
  logo?: string
  flag?: string
  title?: string
  link?: string
  linkText?: string
  target?: string
  rel?: string
}>()
</script>

<template>
  <component
    :is="link ? 'a' : 'div'"
    class="Card"
    :class="{ link: !!link }"
    :href="link"
    :target="target"
    :rel="rel"
  >
    <article class="box">
      <div v-if="logo" class="logo">
        <img :src="logo" :alt="title" />
        <span v-if="flag" class="flag">{{ flag }}</span>
      </div>
      <div v-else-if="icon" class="icon" v-html="icon"></div>
      <h2 v-if="title" class="title" v-html="title"></h2>
      <div class="details">
        <slot />
      </div>
      <div v-if="linkText" class="link-text">
        <p class="link-text-value">
          {{ linkText }} <span class="vpi-arrow-right link-text-icon" />
        </p>
      </div>
    </article>
  </component>
</template>

<style scoped>
.Card {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s, background-color 0.25s;
}

.Card.link:hover {
  border-color: var(--vp-c-brand-1);
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

.logo {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  margin-bottom: 16px;
}

.logo img {
  max-height: 48px;
  max-width: 140px;
  width: auto;
  object-fit: contain;
  object-position: left center;
}

.flag {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 32px;
  line-height: 1;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  padding: 0;
  margin: 0;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* Keep nested markdown tidy inside the card */
.details :deep(> :first-child) {
  margin-top: 0;
}
.details :deep(> :last-child) {
  margin-bottom: 0;
}

.link-text {
  padding-top: 8px;
}

.link-text-value {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  margin: 0;
}

.link-text-icon {
  margin-left: 6px;
}
</style>
