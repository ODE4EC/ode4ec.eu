<script setup lang="ts">
const projects = [
  { code: 'AMS', name: 'ODE4EC-AMS', focus: 'Analog & mixed-signal', link: '/projects/ams/' },
  { code: 'DIG', name: 'ODE4EC-DIG', focus: 'Digital design', link: '/projects/dig/' },
  { code: 'PIV', name: 'ODE4EC-PIV', focus: 'Productivity, integration & verification', link: '/projects/piv/' },
]
</script>

<template>
  <section class="ode-module" aria-labelledby="ode-mod-projects">
    <div class="ode-module__head">
      <h2 id="ode-mod-projects" class="ode-module__title">Projects</h2>
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
  gap: 6px;
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
  padding: clamp(5px, 1vh, 10px) 12px;
  margin: 0 -12px;
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s;
}

.ode-projects__row:hover {
  background: rgba(127, 176, 255, 0.08);
}

.ode-projects__row:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 0;
}

/* the code sits on a small gold pad, like a part designator */
.ode-projects__code {
  flex-shrink: 0;
  width: 48px;
  padding: 5px 0;
  border-radius: 6px;
  text-align: center;
  font-size: 12.5px;
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
  font-size: 15.5px;
  line-height: 1.35;
}

.ode-projects__focus {
  font-size: 13.5px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
}

.ode-projects__arrow {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.2s, transform 0.2s;
}

.ode-projects__row:hover .ode-projects__arrow {
  color: var(--ode-c-accent-1);
  transform: translateX(3px);
}

/* short screens: name and focus share a line, to keep the board on one screen */
@media (min-width: 1152px) and (max-height: 780px) {
  .ode-projects__text {
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
  }

  .ode-projects__focus {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ode-projects__row:hover .ode-projects__arrow { transform: none; }
}
</style>
