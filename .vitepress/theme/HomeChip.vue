<script setup lang="ts">
// The homepage's main chip: the initiative's name and calls to action, with
// "Why ODE4EC" condensed underneath. Its pins and traces are drawn by
// HomeBoard.vue around it.
const emit = defineEmits<{
  /** "Explore projects" was hovered or focused */
  burst: []
}>()

const reasons = [
  {
    icon: 'globe',
    title: 'Open Source',
    text: 'Built on, and for, a healthy open source chip design ecosystem.',
  },
  {
    icon: 'chip',
    title: 'Grow Chip Design',
    text: 'Attracting talent and making chip design more accessible.',
  },
  {
    icon: 'stars',
    title: 'Paneuropean',
    text: 'A joint effort of leading institutions across Europe.',
  },
]
</script>

<template>
  <div class="ode-chip">
    <span class="ode-chip__notch" aria-hidden="true" />

    <h1 class="ode-chip__title">ODE4EC</h1>
    <p class="ode-chip__lede">Open Design Environment for European Chips</p>
    <p class="ode-chip__tagline">The central website of the ODE4EC initiative and its projects.</p>
    <div class="ode-chip__actions">
      <a class="ode-btn ode-btn--gold" href="/about/">About the initiative</a>
      <a class="ode-btn ode-btn--ghost" href="/projects/" @mouseenter="emit('burst')" @focus="emit('burst')">
        Explore projects
      </a>
    </div>

    <section class="ode-chip__why" aria-labelledby="ode-why">
      <h2 id="ode-why" class="ode-chip__why-heading">Why ODE4EC</h2>
      <ul class="ode-chip__reasons">
        <li v-for="r in reasons" :key="r.title" class="ode-chip__reason">
          <svg class="ode-chip__icon" width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <template v-if="r.icon === 'globe'">
              <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="2" />
              <ellipse cx="20" cy="20" rx="15" ry="6" stroke="currentColor" stroke-width="2" />
              <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2" />
            </template>
            <template v-else-if="r.icon === 'chip'">
              <rect x="13" y="13" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2" />
              <path d="M20 13V7M20 33v-6M13 20H7M33 20h-6M16 13v-3M24 13v-3M16 30v-3M24 30v-3M27 16h3M27 24h3M10 16h3M10 24h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </template>
            <template v-else>
              <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="2" />
              <circle v-for="i in 12" :key="i" :cx="20 + 11 * Math.sin((i * Math.PI) / 6)" :cy="20 - 11 * Math.cos((i * Math.PI) / 6)" r="1.6" fill="currentColor" />
            </template>
          </svg>
          <div>
            <h3 class="ode-chip__reason-title">{{ r.title }}</h3>
            <p class="ode-chip__reason-text">{{ r.text }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* A chip package: solid body, beveled edges. No transparency — chips are not
   transparent. Vertical rhythm scales with the viewport height so the whole
   board fits one screen on laptops too. */
.ode-chip {
  position: relative;
  z-index: 2;
  padding: clamp(28px, 4.5vh, 48px) clamp(24px, 3.4vw, 48px);
  color: #fff;
  background: linear-gradient(168deg, var(--ode-c-panel-top) 0%, var(--ode-c-panel) 55%, var(--ode-c-panel-deep) 100%);
  border: 1px solid rgba(140, 175, 240, 0.28);
  border-top-color: rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -3px 0 rgba(0, 0, 0, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 14px 28px rgba(0, 0, 0, 0.45),
    0 40px 80px rgba(1, 6, 18, 0.6);
  --ode-heading-via-bg: var(--ode-c-panel);
  --ode-heading-trace: var(--ode-c-trace-blue);
}

/* the pin-1 marker every chip has */
.ode-chip__notch {
  position: absolute;
  top: 16px;
  left: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--ode-c-panel), var(--ode-c-board-deep));
  box-shadow:
    inset 0 1.5px 3px rgba(0, 0, 0, 0.8),
    0 1px 0 rgba(255, 255, 255, 0.08);
}

.vp-doc .ode-chip__title {
  font-family: var(--vp-font-family-heading);
  font-size: min(clamp(48px, 8.5vh, 80px), 15vw);
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 clamp(12px, 2vh, 18px);
  padding-bottom: clamp(14px, 2.2vh, 20px);
  background: linear-gradient(120deg, var(--ode-c-trace-blue) 15%, var(--ode-c-accent-1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* forced colors drop background-clip text; fall back to plain text */
@media (forced-colors: active) {
  .vp-doc .ode-chip__title {
    background: none;
    -webkit-text-fill-color: CanvasText;
  }
}

.ode-chip__lede {
  font-size: clamp(18px, 2.6vh, 22px);
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 8px;
  color: #fff;
}

.ode-chip__tagline {
  font-size: 15.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 clamp(18px, 3vh, 28px);
}

.ode-chip__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ode-btn {
  display: inline-flex;
  align-items: center;
  padding: 11px 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.ode-btn:hover {
  transform: translateY(-1px);
}

.ode-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.ode-btn--gold {
  background: linear-gradient(180deg, var(--ode-c-gold-light) 0%, var(--ode-c-accent-1) 45%, var(--ode-c-gold-shade) 100%);
  color: var(--ode-c-board-deep);
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

@media (prefers-reduced-motion: reduce) {
  .ode-btn:hover { transform: none; }
}

/* Beside the modules the chip is stretched to their column's height: the
   intro stays at the top and Why ODE4EC sits at the bottom. */
@media (min-width: 1152px) and (min-height: 600px) {
  .ode-chip {
    display: flex;
    flex-direction: column;
  }

  .ode-chip__actions {
    margin-bottom: clamp(22px, 4vh, 40px);
  }

  .ode-chip__why {
    margin-top: auto;
  }
}

/* Why ODE4EC: an inset section of the same chip, under an etched line */
.ode-chip__why {
  margin-top: clamp(22px, 4vh, 40px);
  padding-top: clamp(18px, 3vh, 28px);
  border-top: 1px solid rgba(140, 175, 240, 0.2);
}

.vp-doc .ode-chip__why-heading {
  margin: 0 0 clamp(12px, 2vh, 18px);
  padding: 0;
  border: none;
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--ode-c-trace-blue);
}

.ode-chip__reasons {
  display: grid;
  gap: clamp(10px, 1.8vh, 16px);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* three columns where the chip is wide enough, one row each otherwise */
@media (min-width: 640px) {
  .ode-chip__reasons { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}

.ode-chip__reason {
  display: flex;
  gap: 12px;
  margin: 0;
}

@media (min-width: 640px) {
  .ode-chip__reason { flex-direction: column; gap: 8px; }
}

.ode-chip__icon {
  flex-shrink: 0;
  color: var(--ode-c-accent-1);
}

.vp-doc .ode-chip__reason-title {
  margin: 0 0 4px;
  padding: 0;
  border: none;
  font-size: 15.5px;
  line-height: 1.3;
  letter-spacing: 0;
  color: #fff;
}

.ode-chip__reason-text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}
</style>
