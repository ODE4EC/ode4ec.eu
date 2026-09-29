<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  /** true once HomeBoard has drawn the real pins and traces */
  wired?: boolean
}>()

const emit = defineEmits<{
  /** "Explore projects" was hovered or focused */
  burst: []
}>()

const section = ref<HTMLElement | null>(null)

function scrollToNext() {
  const next = section.value?.nextElementSibling as HTMLElement | null
  if (!next) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <section ref="section" class="ode-hero" :class="{ 'ode-hero--wired': wired }">
    <div class="ode-hero__halo" aria-hidden="true" />

    <div class="ode-hero__content">
      <span class="ode-hero__pins ode-hero__pins--top" aria-hidden="true" />
      <span class="ode-hero__pins ode-hero__pins--bottom" aria-hidden="true" />
      <span class="ode-hero__notch" aria-hidden="true" />
      <p class="ode-hero__eyebrow">Open source chip design for Europe</p>
      <h1 class="ode-hero__title">ODE4EC</h1>
      <p class="ode-hero__lede">Open Design Environment for European Chips</p>
      <p class="ode-hero__tagline">
        The central website of the ODE4EC initiative and its projects.
      </p>
      <div class="ode-hero__actions">
        <a class="ode-btn ode-btn--gold" href="/about">About the initiative</a>
        <a
          class="ode-btn ode-btn--ghost"
          href="/projects"
          @mouseenter="emit('burst')"
          @focus="emit('burst')"
        >Explore projects</a>
      </div>
    </div>

    <slot name="controls" />

    <button class="ode-hero__scroll-cue" type="button" @click="scrollToNext">
      <span>Scroll</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>

<style scoped>
.ode-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #060f22 0%, #092a66 45%, var(--ode-c-board) 100%);
}

.ode-hero__halo {
  position: absolute;
  left: 50%;
  top: 49%;
  width: min(1240px, 140vw);
  aspect-ratio: 1.6;
  translate: -50% -50%;
  background: radial-gradient(closest-side, rgba(47, 111, 214, 0.4), rgba(47, 111, 214, 0.12) 60%, transparent);
  pointer-events: none;
  animation: ode-breathe 9s ease-in-out infinite;
}

@keyframes ode-breathe {
  0%, 100% { opacity: 0.7; scale: 1; }
  50% { opacity: 1; scale: 1.06; }
}

@media (prefers-reduced-motion: reduce) {
  .ode-hero__halo {
    animation: none;
  }
}

/* The headline card is a chip package: solid body, beveled edges, pin strips
   on all four sides. No transparency — chips are not transparent. */
.ode-hero__content {
  position: relative;
  z-index: 2;
  margin: 0 24px;
  max-width: 620px;
  padding: 44px 32px;
  color: #fff;
  text-align: center;
  background: linear-gradient(168deg, #102c5c 0%, #0a2148 55%, #081b3c 100%);
  border: 1px solid rgba(140, 175, 240, 0.28);
  border-top-color: rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -3px 0 rgba(0, 0, 0, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 14px 28px rgba(0, 0, 0, 0.45),
    0 48px 90px rgba(1, 6, 18, 0.65);
}

/* pin strips: left/right… */
.ode-hero__content::before,
.ode-hero__content::after {
  content: '';
  position: absolute;
  top: 72px;
  bottom: 72px;
  width: 11px;
  background: repeating-linear-gradient(
    180deg,
    #ffe158 0 4px,
    #b8990e 4px 10px,
    transparent 10px 38px
  );
  opacity: 0.9;
  pointer-events: none;
}

.ode-hero__content::before { left: -11px; }
.ode-hero__content::after { right: -11px; }

/* …and top/bottom, completing the QFP package */
.ode-hero__pins {
  position: absolute;
  left: 72px;
  right: 72px;
  height: 11px;
  background: repeating-linear-gradient(
    90deg,
    #ffe158 0 4px,
    #b8990e 4px 10px,
    transparent 10px 38px
  );
  opacity: 0.9;
  pointer-events: none;
}

.ode-hero__pins--top { top: -11px; }
.ode-hero__pins--bottom { bottom: -11px; }

/* The CSS pin strips are only the pre-hydration / no-JS fallback: once
   HomeBoard draws real pins (with traces landing on them), hide these. */
.ode-hero--wired .ode-hero__content::before,
.ode-hero--wired .ode-hero__content::after,
.ode-hero--wired .ode-hero__pins {
  display: none;
}

/* the pin-1 marker every chip has */
.ode-hero__notch {
  position: absolute;
  top: 16px;
  left: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #0e2a58, #04102a);
  box-shadow:
    inset 0 1.5px 3px rgba(0, 0, 0, 0.8),
    0 1px 0 rgba(255, 255, 255, 0.08);
}

@media (min-width: 640px) {
  .ode-hero__content { padding: 56px 64px; }
}

.ode-hero__eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 16px;
}

.ode-hero__title {
  font-family: var(--vp-font-family-heading);
  font-size: clamp(44px, 15vw, 64px);
  line-height: 1;
  font-weight: 700;
  margin: 0 0 14px;
  padding-bottom: 18px;
  background: linear-gradient(120deg, #7fb0ff 15%, #ffd617 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* center the global h1 trace underline within the card */
.ode-hero__title::after {
  left: 50%;
  transform: translateX(-50%);
}

/* forced colors drop background-clip text; fall back to plain text */
@media (forced-colors: active) {
  .ode-hero__title {
    background: none;
    -webkit-text-fill-color: CanvasText;
  }
}

@media (min-width: 640px) {
  .ode-hero__title { font-size: 84px; }
}

.ode-hero__lede {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 12px;
  color: #fff;
}

.ode-hero__tagline {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 auto 32px;
  max-width: 40ch;
}

.ode-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.ode-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.ode-btn:hover {
  transform: translateY(-1px);
}

.ode-btn:focus-visible,
.ode-hero__scroll-cue:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.ode-btn--gold {
  background: linear-gradient(180deg, #ffe158 0%, #ffd617 45%, #edbf00 100%);
  color: #00122a;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -2px 0 rgba(0, 0, 0, 0.18),
    0 6px 16px rgba(255, 214, 23, 0.22);
}

.ode-btn--gold:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -2px 0 rgba(0, 0, 0, 0.18),
    0 8px 22px rgba(255, 214, 23, 0.32);
}

.ode-btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
}

.ode-btn--ghost:hover {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
}

.ode-hero__scroll-cue {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.ode-hero__scroll-cue:hover {
  color: #fff;
}

@media (min-width: 960px) {
  .ode-hero__scroll-cue { display: flex; }
}

.ode-hero__scroll-cue svg {
  animation: ode-bounce 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ode-hero__scroll-cue svg { animation: none; }
}

@keyframes ode-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}
</style>
