<script setup lang="ts">
// The site footer: funding logos and acknowledgement, plus the credit line.
// VitePress's own footer hides on every page with a sidebar, so this one is
// placed through the layout-bottom slot on inner pages and by HomeBoard on the
// homepage (`home`), where the board's pause button goes in the `controls` slot.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useLayout } from 'vitepress/theme'

const props = defineProps<{ home?: boolean }>()

const { frontmatter } = useData()
const { hasSidebar } = useLayout()
// on the homepage the board places its own copy
const shown = computed(() => props.home || frontmatter.value.layout !== 'home')
</script>

<template>
  <footer v-if="shown" class="ode-footer" :class="{ 'has-sidebar': hasSidebar && !home, 'is-home': home }">
    <div class="ode-footer__inner">
      <div class="ode-footer__funding">
        <div class="ode-footer__logos">
          <img src="/img/logos/eu-cofunded.svg" alt="Co-funded by the European Union" width="148" height="30" />
          <img src="/img/logos/chips-ju.svg" alt="Chips Joint Undertaking" width="100" height="30" />
        </div>
        <p class="ode-footer__ack">
          The ODE4EC projects have received funding from the Chips Joint Undertaking (Chips JU) under Grant Agreement
          No 101252356, 101252962 and 101252715, with support from the European Union’s Horizon Europe research and
          innovation programme, and respective national funding agencies.
        </p>
      </div>
      <div class="ode-footer__bottom">
        <p class="ode-footer__credit">
          &copy; the authors and project partners of ODE4EC projects. Hosted by the
          <a href="https://www.fossi-foundation.org">FOSSi Foundation</a>.
          <a href="/privacy">Privacy</a>
        </p>
        <slot name="controls" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Light mode: the warm paper of the page, set off by a hairline. Dark mode:
   the dark page, with the logos on the same light plate as partner logos,
   since the EU emblem must sit on a light ground. */
.ode-footer {
  position: relative;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.ode-footer__inner {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 24px 24px 20px;
}

@media (min-width: 640px) {
  .ode-footer__inner { padding: 24px 32px 20px; }
}

/* beside the fixed sidebar, the same offset VitePress gives the content */
@media (min-width: 960px) {
  .ode-footer.has-sidebar { padding-left: var(--vp-sidebar-width); }
  .ode-footer__inner { padding: 24px 64px 20px; }
}

@media (min-width: 1440px) {
  .ode-footer.has-sidebar {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.ode-footer__funding {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
}

.ode-footer__logos {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 24px;
}

.ode-footer__logos img {
  display: block;
  height: 30px;
  width: auto;
}

/* phones: the logos get their own centred row, well clear of the text (the
   dark plate spreads 8px past them) */
@media (max-width: 639px) {
  .ode-footer__funding { gap: 32px; }
  .ode-footer__logos { width: 100%; justify-content: center; }
}

/* keep both logos on one line at 320px */
@media (max-width: 399px) {
  .ode-footer__logos { gap: 16px; }
  .ode-footer__logos img { height: 26px; }
}

/* drawn as a shadow spread, not padding, so the footer has the same size in
   both themes and the homepage board doesn't shift when the theme changes */
.dark .ode-footer__logos {
  border-radius: 2px;
  background: var(--ode-c-logo-plate);
  box-shadow: 0 0 0 8px var(--ode-c-logo-plate);
}

.ode-footer__ack {
  flex: 1 1 320px;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
}

.ode-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.ode-footer__credit {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
}

.ode-footer__credit a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ode-footer__credit a:hover {
  color: var(--vp-c-brand-1);
}

/* the homepage board's own width and gutters, and tighter, to fit one screen */
.ode-footer.is-home .ode-footer__inner {
  max-width: 1280px;
  padding: 14px clamp(24px, 5vw + 8px, 64px) 10px;
}

.ode-footer.is-home .ode-footer__bottom {
  margin-top: 10px;
  padding-top: 8px;
}

/* .vp-doc styles paragraphs and links on the homepage; keep ours */
.vp-doc .ode-footer p { margin: 0; }
.vp-doc .ode-footer a { color: inherit; font-weight: inherit; }
.vp-doc .ode-footer a:hover { color: var(--vp-c-brand-1); }
</style>
