<script setup lang="ts">
// Lives inside the chip, in two columns where it fits, so a fourth project
// fills the empty slot instead of making the board taller.
const projects = [
  { code: 'AMS', name: 'ODE4EC-AMS', focus: 'Analog & mixed-signal', link: '/projects/ams/' },
  { code: 'DIG', name: 'ODE4EC-DIG', focus: 'Digital design', link: '/projects/dig/' },
  { code: 'PIV', name: 'ODE4EC-PIV', focus: 'Productivity, integration & verification', link: '/projects/piv/' },
]
</script>

<template>
  <section aria-labelledby="ode-mod-projects">
    <div class="ode-module__head">
      <h2 id="ode-mod-projects" class="ode-eyebrow">Projects</h2>
      <a class="ode-module__all" href="/projects/">All projects →</a>
    </div>
    <ul class="ode-projects">
      <li v-for="p in projects" :key="p.code">
        <a class="ode-projects__row" :href="p.link">
          <span class="ode-projects__code">{{ p.code }}</span>
          <span class="ode-projects__text">
            <span class="ode-projects__name">{{ p.name }}</span>
            <span class="ode-projects__focus">{{ p.focus }}</span>
          </span>
          <span class="ode-projects__arrow" aria-hidden="true">→</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.ode-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 190px), 1fr));
  gap: 6px 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ode-projects li {
  margin: 0;
}

.ode-projects__row {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  padding: clamp(5px, 1vh, 10px) 12px;
  margin: 0 -12px;
  border-radius: 10px;
  color: var(--board-text-1);
  text-decoration: none;
  transition: background-color 0.2s;
}

.ode-projects__row:hover {
  color: var(--board-text-1);
  background: var(--board-row-hover);
}

.ode-projects__row:focus-visible {
  outline-offset: 0;
}

/* the code sits on a small gold pad, like a part designator */
.ode-projects__code {
  flex-shrink: 0;
  width: 48px;
  padding: 5px 0;
  border-radius: 6px;
  text-align: center;
  font-size: 0.78125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ode-c-board-deep);
  background: linear-gradient(180deg, var(--ode-c-gold-light), var(--ode-c-gold-shade));
  box-shadow: inset 0 -1.5px 0 rgba(0, 0, 0, 0.18);
}

.ode-projects__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ode-projects__name {
  font-weight: 600;
  font-size: 0.96875rem;
  line-height: 1.35;
}

.ode-projects__focus {
  font-size: 0.84375rem;
  line-height: 1.4;
  color: var(--board-text-2);
}

.ode-projects__arrow {
  margin-left: auto;
  color: var(--board-text-2);
  transition: color 0.2s, transform 0.2s;
}

.ode-projects__row:hover .ode-projects__arrow {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .ode-projects__row:hover .ode-projects__arrow { transform: none; }
}
</style>
