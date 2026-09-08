<script setup lang="ts">
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
  <section class="ode-projects">
    <div class="ode-projects__inner">
      <p class="ode-projects__eyebrow">The projects</p>
      <h2 class="ode-projects__heading">Three projects, one environment</h2>
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
  padding: 48px 24px 64px;
}

@media (min-width: 640px) {
  .ode-projects { padding: 56px 48px 80px; }
}

.ode-projects__inner {
  max-width: 1152px;
  margin: 0 auto;
}

.ode-projects__eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin: 0 0 14px;
}

.ode-projects__heading {
  margin: 0 0 12px;
  border: none;
  padding: 26px 0 0;
  font-size: 1.7rem;
  color: var(--vp-c-text-1);
}

.ode-projects__sub {
  margin: 0 0 40px;
  max-width: 60ch;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ode-projects__grid {
  display: grid;
  gap: 20px;
}

@media (min-width: 768px) {
  .ode-projects__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* Each project card is a chip package: solid beveled body, gold pin strip
   along the top edge, via dot next to the silkscreen code. */
.ode-project {
  position: relative;
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
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.dark .ode-project {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -2px 0 rgba(0, 0, 0, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 12px 28px rgba(0, 0, 0, 0.35);
}

.ode-project:hover {
  transform: translateY(-4px);
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
    #ffe158 0 3px,
    #c7a50d 3px 8px,
    transparent 8px 30px
  );
  border-radius: 2px 2px 0 0;
  opacity: 0.9;
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
  color: var(--vp-c-text-3);
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
