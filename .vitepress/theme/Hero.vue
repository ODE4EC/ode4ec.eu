<script setup lang="ts">
function scrollToNext() {
  document.getElementById('ode-hero-next')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="ode-hero">
    <svg
      class="ode-hero__scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ode-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#060f22" />
          <stop offset="45%" stop-color="#092a66" />
          <stop offset="100%" stop-color="#001f47" />
        </linearGradient>
        <linearGradient id="ode-chip-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14336a" />
          <stop offset="100%" stop-color="#0a1f42" />
        </linearGradient>
        <radialGradient id="ode-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="#2f6fd6" stop-opacity="0.4" />
          <stop offset="60%" stop-color="#2f6fd6" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#2f6fd6" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#ode-bg)" />
      <ellipse class="ode-hero__halo" cx="800" cy="440" rx="620" ry="380" fill="url(#ode-glow)" />

      <!--
        Circuit routing. Wires are concentrated at the corners, run in
        parallel bundles with rounded bends, cross each other, and either
        plug into the central chip card (their ends are hidden underneath
        the opaque card), terminate at an on-board component, or exit
        through the page edges. Nothing ends mid-air.
        Card keep-out geometry (all aspect ratios): ends under the card must
        sit in x 660-990, y 470-620.
      -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- top-left bundle → into the chip's left pins -->
        <path d="M-20,70 L250,70 Q290,70 290,110 L290,440 Q290,480 330,480 L700,480"
          stroke="#ffd617" stroke-width="5" opacity="0.85" />
        <path d="M-20,110 L210,110 Q250,110 250,150 L250,470 Q250,510 290,510 L700,510"
          stroke="#7fb0ff" stroke-width="4" opacity="0.6" />
        <path d="M-20,150 L170,150 Q210,150 210,190 L210,500 Q210,540 250,540 L700,540"
          stroke="#4a7fd9" stroke-width="4" opacity="0.7" />
        <!-- crossing wire: drops through the bundle and exits left -->
        <path d="M370,-20 L370,620 Q370,660 330,660 L-20,660"
          stroke="#ffd617" stroke-width="3.5" opacity="0.5" />

        <!-- top-right bundle → into the chip's right pins -->
        <path d="M1620,70 L1350,70 Q1310,70 1310,110 L1310,440 Q1310,480 1270,480 L900,480"
          stroke="#ffd617" stroke-width="5" opacity="0.85" />
        <path d="M1620,110 L1390,110 Q1350,110 1350,150 L1350,470 Q1350,510 1310,510 L900,510"
          stroke="#7fb0ff" stroke-width="4" opacity="0.6" />
        <path d="M1620,150 L1430,150 Q1390,150 1390,190 L1390,500 Q1390,540 1350,540 L900,540"
          stroke="#4a7fd9" stroke-width="4" opacity="0.7" />
        <!-- crossing wire: drops through the bundle and exits right -->
        <path d="M1230,-20 L1230,620 Q1230,660 1270,660 L1620,660"
          stroke="#7fb0ff" stroke-width="3.5" opacity="0.5" />

        <!-- feed lines from the top edge into the chip's top pins -->
        <path d="M760,-20 L760,505" stroke="#ffd617" stroke-width="3" opacity="0.55" />
        <path d="M840,-20 L840,505" stroke="#7fb0ff" stroke-width="3" opacity="0.5" />

        <!-- bottom-left component: wires arrive from the page edge -->
        <path d="M-20,645 L196,645" stroke="#7fb0ff" stroke-width="3.5" opacity="0.6" />
        <path d="M-20,667 L196,667" stroke="#ffd617" stroke-width="3.5" opacity="0.7" />
        <path d="M-20,689 L196,689" stroke="#4a7fd9" stroke-width="3.5" opacity="0.6" />

        <!-- bottom-right component: wires arrive from the page edge -->
        <path d="M1620,615 L1448,615" stroke="#ffd617" stroke-width="3.5" opacity="0.7" />
        <path d="M1620,637 L1448,637" stroke="#7fb0ff" stroke-width="3.5" opacity="0.6" />
        <path d="M1620,659 L1448,659" stroke="#4a7fd9" stroke-width="3.5" opacity="0.6" />
      </g>

      <!-- signal pulses along the two gold bundles -->
      <g
        fill="none"
        stroke="#fff6cf"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="14 900"
        opacity="0.85"
      >
        <path class="ode-pulse ode-pulse--a" d="M-20,70 L250,70 Q290,70 290,110 L290,440 Q290,480 330,480 L700,480" />
        <path class="ode-pulse ode-pulse--b" d="M1620,70 L1350,70 Q1310,70 1310,110 L1310,440 Q1310,480 1270,480 L900,480" />
      </g>

      <!-- vias: small filled dots in the wire's own color -->
      <g>
        <circle cx="150" cy="70" r="4" fill="#ffd617" opacity="0.85" />
        <circle cx="120" cy="110" r="3.5" fill="#7fb0ff" opacity="0.7" />
        <circle cx="90" cy="150" r="3.5" fill="#4a7fd9" opacity="0.8" />
        <circle cx="370" cy="200" r="3.5" fill="#ffd617" opacity="0.6" />
        <circle cx="1450" cy="70" r="4" fill="#ffd617" opacity="0.85" />
        <circle cx="1480" cy="110" r="3.5" fill="#7fb0ff" opacity="0.7" />
        <circle cx="1510" cy="150" r="3.5" fill="#4a7fd9" opacity="0.8" />
        <circle cx="1230" cy="200" r="3.5" fill="#7fb0ff" opacity="0.6" />
        <circle cx="760" cy="120" r="3.5" fill="#ffd617" opacity="0.6" />
        <circle cx="840" cy="180" r="3.5" fill="#7fb0ff" opacity="0.55" />
        <circle cx="90" cy="660" r="3.5" fill="#ffd617" opacity="0.55" />
        <circle cx="1530" cy="660" r="3.5" fill="#7fb0ff" opacity="0.55" />
      </g>
      <!-- a few square SMD pads -->
      <g fill="#7fb0ff" opacity="0.35">
        <rect x="430" y="66" width="8" height="8" rx="1.5" />
        <rect x="1162" y="146" width="8" height="8" rx="1.5" />
        <rect x="56" y="596" width="8" height="8" rx="1.5" />
        <rect x="1536" y="576" width="8" height="8" rx="1.5" />
      </g>

      <!-- bottom-left chip package (3D: shadow slab under a gradient face) -->
      <g transform="translate(196,616)">
        <!-- pins, two-tone for depth -->
        <g>
          <rect x="-4" y="24" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="-4" y="46" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="-4" y="68" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="24" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="46" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="68" width="14" height="7" rx="2" fill="#8fa8d6" />
        </g>
        <rect x="4" y="16" width="82" height="78" rx="9" fill="#000b1e" opacity="0.55" />
        <rect x="0" y="10" width="90" height="80" rx="9" fill="url(#ode-chip-face)" stroke="rgba(160,190,240,0.35)" stroke-width="1.5" />
        <rect x="10" y="20" width="70" height="60" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        <circle cx="14" cy="24" r="3.5" fill="#ffd617" />
        <!-- short stubs from the right pins to vias -->
        <path d="M94,27 L124,27 M94,49 L124,49 M94,71 L124,71" stroke="#4a7fd9" stroke-width="3" opacity="0.6" stroke-linecap="round" />
        <circle cx="130" cy="27" r="4" fill="#4a7fd9" opacity="0.8" />
        <circle cx="130" cy="49" r="4" fill="#4a7fd9" opacity="0.8" />
        <circle cx="130" cy="71" r="4" fill="#4a7fd9" opacity="0.8" />
      </g>

      <!-- bottom-right chip package, mirrored -->
      <g transform="translate(1358,586)">
        <g>
          <rect x="-4" y="22" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="-4" y="44" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="-4" y="66" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="22" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="44" width="14" height="7" rx="2" fill="#8fa8d6" />
          <rect x="80" y="66" width="14" height="7" rx="2" fill="#8fa8d6" />
        </g>
        <rect x="4" y="14" width="82" height="78" rx="9" fill="#000b1e" opacity="0.55" />
        <rect x="0" y="8" width="90" height="80" rx="9" fill="url(#ode-chip-face)" stroke="rgba(160,190,240,0.35)" stroke-width="1.5" />
        <rect x="10" y="18" width="70" height="60" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        <circle cx="14" cy="22" r="3.5" fill="#ffd617" />
        <path d="M-8,25 L-38,25 M-8,47 L-38,47 M-8,69 L-38,69" stroke="#4a7fd9" stroke-width="3" opacity="0.6" stroke-linecap="round" />
        <circle cx="-44" cy="25" r="4" fill="#4a7fd9" opacity="0.8" />
        <circle cx="-44" cy="47" r="4" fill="#4a7fd9" opacity="0.8" />
        <circle cx="-44" cy="69" r="4" fill="#4a7fd9" opacity="0.8" />
      </g>
    </svg>

    <!-- the two wires that leave the chip's bottom pins and run down past the
         fold; Features.vue continues them at the same viewport percentages -->
    <div class="ode-hero__feeds" aria-hidden="true">
      <span class="ode-hero__feed ode-hero__feed--gold" style="left: 38.75%" />
      <span class="ode-hero__feed ode-hero__feed--blue" style="left: 61.25%" />
    </div>

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
        <a class="ode-btn ode-btn--ghost" href="/projects">Explore projects</a>
      </div>
    </div>

    <button class="ode-hero__scroll-cue" type="button" @click="scrollToNext" aria-label="Scroll to content">
      <span>Scroll</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>

<style scoped>
.ode-hero {
  position: relative;
  margin-left: var(--vp-offset, calc(50% - 50vw));
  margin-right: var(--vp-offset, calc(50% - 50vw));
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #001f47;
}

/* Below 960px VitePress's nav is static (in normal flow, pushes content down) so there's
   no gap to cancel. At 960px+ it becomes fixed and VPContent adds nav-height padding-top —
   cancel that the same way VPHero itself does, so this bleeds up under the (transparent-
   at-top) nav instead of leaving a gap that shows the page's plain background above it. */
@media (min-width: 960px) {
  .ode-hero {
    margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  }
}

.ode-hero__scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ode-hero__halo {
  animation: ode-breathe 9s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes ode-breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}

.ode-pulse--a {
  animation: ode-pulse 7s linear infinite;
}

.ode-pulse--b {
  animation: ode-pulse 7s linear infinite;
  animation-delay: -3.5s;
}

@media (prefers-reduced-motion: reduce) {
  .ode-pulse,
  .ode-hero__halo {
    animation: none !important;
  }
  .ode-pulse { opacity: 0; }
}

@keyframes ode-pulse {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -1828; }
}

.ode-hero__feeds {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ode-hero__feed {
  position: absolute;
  top: 50%;
  bottom: 0;
  width: 4px;
  margin-left: -2px;
}

.ode-hero__feed--gold { background: rgba(255, 214, 23, 0.8); }
.ode-hero__feed--blue { background: rgba(127, 176, 255, 0.6); }

/* The headline card is a chip package: solid body, beveled edges, pin strips
   on all four sides. No transparency — chips are not transparent. */
.ode-hero__content {
  position: relative;
  z-index: 1;
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
  font-size: 64px;
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
  z-index: 1;
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
