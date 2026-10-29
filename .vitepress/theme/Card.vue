<script setup lang="ts">
defineProps<{
  icon?: string
  logo?: string
  flag?: string
  title?: string
  link?: string
  linkText?: string
  target?: string
  rel?: string
  /** Heading level for the title; defaults to h3 so cards nest under a page's h2s. */
  headingLevel?: 2 | 3 | 4
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
      <div v-if="logo || flag" class="logo">
        <!-- logos sit on their own light plate: most partner logos are dark
             artwork made for white backgrounds, unreadable on a dark card -->
        <span v-if="logo" class="logo-plate">
          <img :src="logo" :alt="title ? '' : 'Logo'" />
        </span>
        <span v-if="flag" class="flag">{{ flag }}</span>
      </div>
      <div v-else-if="icon" class="icon" v-html="icon"></div>
      <component
        :is="`h${headingLevel ?? 3}`"
        v-if="title"
        class="title"
        v-html="title"
      />
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
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  box-shadow: var(--ode-shadow-card);
  transition: border-color 0.25s, background-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.Card.link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.Card.link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: var(--ode-shadow-card-hover);
}

@media (prefers-reduced-motion: reduce) {
  .Card.link:hover {
    transform: none;
  }
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
  min-height: 48px;
  margin-bottom: 16px;
}

.logo-plate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 164px;
  height: 60px;
  padding: 8px 12px;
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--ode-c-logo-plate);
}

.logo img {
  display: block;
  /* a definite height lets dimensionless SVGs size from their viewBox */
  height: 40px;
  width: 100%;
  object-fit: contain;
  object-position: center;
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
