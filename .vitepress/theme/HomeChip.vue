<script setup lang="ts">
// Its pins and traces are drawn around it by HomeBoard.vue.
import HomeProjects from './HomeProjects.vue'
</script>

<template>
  <div class="ode-chip">
    <span class="ode-chip__notch" aria-hidden="true" />

    <h1 class="ode-chip__title">ODE4EC</h1>
    <p class="ode-chip__lede">Open Design Environment for European Chips</p>
    <p class="ode-chip__tagline">
      A coordinated initiative bringing together research institutions, universities and industry across Europe to
      build an open source chip design environment.
    </p>
    <div class="ode-chip__actions">
      <a class="ode-btn ode-btn--gold" href="/about/">About the initiative</a>
      <a class="ode-btn ode-btn--ghost" href="/advocacy/">Our advocacy</a>
    </div>

    <HomeProjects class="ode-chip__projects" />
  </div>
</template>

<style scoped>
/* Vertical rhythm scales with the viewport height so the whole board fits
   one screen on laptops too. */
.ode-chip {
  position: relative;
  z-index: 2;
  padding: clamp(24px, 3.4vh, 48px) clamp(24px, 3.4vw, 48px);
  color: var(--board-text-1);
  background: var(--board-panel-bg);
  border: 1px solid var(--board-panel-edge);
  border-top-color: var(--board-panel-edge-top);
  border-radius: 18px;
  box-shadow: var(--board-chip-shadow);
}

/* the pin-1 marker every chip has */
.ode-chip__notch {
  position: absolute;
  top: 16px;
  left: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--board-notch);
  box-shadow:
    inset 0 1.5px 3px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.08);
}

.vp-doc .ode-chip__title {
  font-family: var(--vp-font-family-heading);
  font-size: clamp(3rem, min(2rem + 4vw, 8.5vh), 5rem);
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 clamp(10px, 1.6vh, 18px);
  padding-bottom: clamp(12px, 1.8vh, 20px);
  color: var(--board-text-1);
}

.ode-chip__lede {
  font-size: clamp(1.125rem, 2.6vh, 1.375rem);
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 8px;
  color: var(--board-text-1);
}

.ode-chip__tagline {
  font-size: 0.96875rem;
  line-height: 1.55;
  color: var(--board-text-2);
  margin: 0 0 clamp(14px, 2.4vh, 24px);
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
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.ode-btn:hover {
  transform: translateY(-1px);
}

.ode-btn--gold {
  background: linear-gradient(180deg, var(--ode-c-gold-light) 0%, var(--ode-c-accent-1) 45%, var(--ode-c-gold-shade) 100%);
  color: var(--ode-c-board-deep);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -2px 0 rgba(0, 0, 0, 0.18);
}

/* keep the text colour: .vp-doc a:hover would turn it blue */
.ode-btn--gold:hover {
  color: var(--ode-c-board-deep);
}

.ode-btn--ghost {
  background: var(--board-control-bg);
  color: var(--board-text-1);
  border: 1.5px solid var(--board-control-edge);
}

.ode-btn--ghost:hover {
  color: var(--board-text-1);
  border-color: var(--board-accent);
  background: var(--board-row-hover);
}

@media (prefers-reduced-motion: reduce) {
  .ode-btn:hover { transform: none; }
}

/* Stretched to the module column's height: the projects sit at the bottom. */
@media (min-width: 1152px) and (min-height: 600px) {
  .ode-chip {
    display: flex;
    flex-direction: column;
  }

  .ode-chip__projects {
    margin-top: auto;
  }
}

.ode-chip__projects {
  margin-top: clamp(14px, 2.4vh, 24px);
  padding-top: clamp(12px, 2vh, 22px);
  border-top: 1px solid var(--board-panel-edge);
}
</style>
