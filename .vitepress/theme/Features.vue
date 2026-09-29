<template>
  <section class="ode-features">
    <div class="ode-features__inner">
      <p class="ode-eyebrow">The initiative</p>
      <h2 class="ode-section-heading ode-heading ode-features__heading">Why ODE4EC</h2>

      <div class="ode-features__grid">
        <div class="ode-feature">
          <svg class="ode-feature__icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="1.6" />
            <ellipse cx="20" cy="20" rx="15" ry="6" stroke="currentColor" stroke-width="1.6" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="1.6" />
          </svg>
          <h3>Open Source</h3>
          <p>The projects in ODE4EC specifically target and rely on a healthy open source chip design ecosystem.</p>
        </div>
        <div class="ode-feature">
          <svg class="ode-feature__icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="13" y="13" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
            <path d="M20 13V7M20 33v-6M13 20H7M33 20h-6M16 13v-3M24 13v-3M16 30v-3M24 30v-3M27 16h3M27 24h3M10 16h3M10 24h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M14 26l4-6 3 3 5-8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <h3>Grow Chip Design</h3>
          <p>ODE4EC projects address challenges in attracting talent and make chip design more accessible.</p>
        </div>
        <div class="ode-feature">
          <svg class="ode-feature__icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="1.6" />
            <circle v-for="i in 12" :key="i" :cx="20 + 11 * Math.sin((i * Math.PI) / 6)" :cy="20 - 11 * Math.cos((i * Math.PI) / 6)" r="1.4" fill="currentColor" />
          </svg>
          <h3>Paneuropean</h3>
          <p>ODE4EC is a joint effort of leading institutions across Europe.</p>
        </div>
      </div>
    </div>

    <!-- One single hand-off from the dark board to the page background. -->
    <div class="ode-features__fade" aria-hidden="true" />
  </section>
</template>

<style scoped>
/* Full-bleed and the circuit traces come from the wrapping HomeBoard. */
.ode-features {
  position: relative;
  background: var(--ode-c-board);
  padding: 64px 24px 240px;
}

@media (min-width: 640px) {
  .ode-features { padding: 72px 48px 260px; }
}

.ode-features__fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 170px;
  background: linear-gradient(180deg, transparent 0%, var(--vp-c-bg) 100%);
}

.ode-features__inner {
  position: relative;
  z-index: 2;
  max-width: 1152px;
  margin: 0 auto;
}


/* dark board: light text, and the heading via's hollow centre matches it */
.ode-features__inner {
  --ode-heading-via-bg: var(--ode-c-board);
  --ode-heading-trace: var(--ode-c-trace-blue);
}

.ode-features__inner .ode-eyebrow {
  color: var(--ode-c-trace-blue);
}

.ode-features__heading {
  margin: 0 0 40px;
  color: #fff;
}

.ode-features__grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 640px) {
  .ode-features__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
}

/* Solid, beveled panels — no transparency. */
.ode-feature {
  background: linear-gradient(170deg, #0e2c5c 0%, #082049 100%);
  border: 1px solid rgba(140, 175, 240, 0.22);
  border-top-color: rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  padding: 28px 26px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 14px 30px rgba(1, 8, 20, 0.45);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.ode-feature:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 214, 23, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.35),
    0 22px 44px rgba(1, 8, 20, 0.55);
}

.ode-feature__icon {
  color: var(--ode-c-accent-1);
  margin-bottom: 16px;
}

.ode-feature h3 {
  font-size: 18px;
  margin: 0 0 8px;
  border: none;
  padding: 0;
  color: #fff;
}

.ode-feature p {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
}
</style>
