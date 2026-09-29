<script setup lang="ts">
defineProps<{
  /** true once HomeBoard draws the real pins and feeds these cards */
  wired?: boolean
}>()

const projects = [
  {
    code: 'AMS',
    name: 'ODE4EC-AMS',
    focus: 'Analog & mixed-signal',
    description: 'Open source EDA tools for analog and mixed signal designs.',
    link: '/projects/ams/',
  },
  {
    code: 'DIG',
    name: 'ODE4EC-DIG',
    focus: 'Digital design',
    description: 'Open source EDA tools for digital designs.',
    link: '/projects/dig/',
  },
  {
    code: 'PIV',
    name: 'ODE4EC-PIV',
    focus: 'Productivity, integration & verification',
    description: 'Open source tools for productivity, integration into flows and verification of chip designs.',
    link: '/projects/piv/',
  },
]
</script>

<template>
  <section class="ode-projects" :class="{ 'ode-projects--wired': wired }">
    <div class="ode-projects__inner">
      <p class="ode-eyebrow">The projects</p>
      <h2 class="ode-section-heading ode-heading ode-projects__heading">Three projects, one environment</h2>
      <p class="ode-projects__sub">
        The first batch of ODE4EC projects launches in summer 2026, each covering
        a different part of the open source chip design flow.
      </p>

      <div class="ode-projects__grid">
        <a v-for="p in projects" :key="p.code" :href="p.link" class="ode-project">
          <div class="ode-project__pins" aria-hidden="true" />
          <div class="ode-project__head">
            <span class="ode-project__via" aria-hidden="true" />
            <span class="ode-project__code">{{ p.code }}</span>
          </div>
          <h3 class="ode-project__name">{{ p.name }}</h3>
          <p class="ode-project__focus">{{ p.focus }}</p>
          <p class="ode-project__desc">{{ p.description }}</p>
          <span class="ode-project__more">View project →</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ode-projects {
  /* side padding comes from the container it sits in (see HomeBoard) */
  padding: 24px 0 64px;
}

@media (min-width: 640px) {
  .ode-projects { padding: 32px 0 80px; }
}

.ode-projects__inner {
  max-width: 1152px;
  margin: 0 auto;
}


.ode-projects__heading {
  margin: 0 0 16px;
}

.ode-projects__sub {
  /* room for the circuit rail that runs above the cards' pins */
  margin: 0 0 56px;
  max-width: 60ch;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ode-projects__grid {
  display: grid;
  /* stacked cards: room for pins above and below, and the rail between */
  gap: 64px;
}

@media (min-width: 768px) {
  .ode-projects__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* Each project card is a chip package: solid beveled body, pins along the
   top and bottom edges (drawn by HomeBoard, with the chip's feeds landing on
   the top ones), via dot next to the silkscreen code. Cards don't lift on
   hover: a chip moving off its pins would look detached. */
.ode-project {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 28px 26px 22px;
  margin-top: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -2px 0 rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(2, 8, 20, 0.06),
    0 10px 24px rgba(2, 8, 20, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dark .ode-project {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -2px 0 rgba(0, 0, 0, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 12px 28px rgba(0, 0, 0, 0.35);
}

.ode-project:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.ode-project:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -2px 0 rgba(0, 0, 0, 0.06),
    0 4px 8px rgba(2, 8, 20, 0.08),
    0 20px 40px rgba(2, 8, 20, 0.14);
}

.ode-project__pins {
  position: absolute;
  top: -12px;
  left: 28px;
  right: 28px;
  height: 12px;
  background: repeating-linear-gradient(
    90deg,
    var(--ode-c-gold-light) 0 3px,
    var(--ode-c-gold-dark) 3px 8px,
    transparent 8px 30px
  );
  border-radius: 2px 2px 0 0;
  opacity: 0.9;
}

/* pre-hydration / no-JS fallback only */
.ode-projects--wired .ode-project__pins {
  display: none;
}

.ode-project__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ode-project__via {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 3px solid var(--ode-c-accent-1);
}

.ode-project__code {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--vp-c-brand-1);
}

.ode-project__name {
  margin: 0 0 4px;
  border: none;
  padding: 0;
  font-size: 20px;
  color: var(--vp-c-text-1);
}

.ode-project__focus {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
}

.ode-project__desc {
  margin: 0 0 18px;
  flex-grow: 1;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ode-project__more {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
