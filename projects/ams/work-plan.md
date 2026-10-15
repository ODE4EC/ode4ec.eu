---
title: ODE4EC-AMS Work plan
description: How the ODE4EC-AMS work packages fit together, from open source tools and design automation to PDKs, silicon validation and training.
---

# Work plan

The work follows the path of a real design: better tools and automation, PDKs to design with, industrial designs that test everything in silicon, and training that helps new users adopt the flow.

<div class="flow">
  <div class="flow-step"><span class="num">1</span><div><strong>Tools</strong><p>Simulation, extraction and electromagnetic analysis for analogue and RF design.</p></div></div>
  <div class="flow-step"><span class="num">2</span><div><strong>Design automation</strong><p>Generators, layout automation and sizing in the MOSAIC framework.</p></div></div>
  <div class="flow-step"><span class="num">3</span><div><strong>PDKs and silicon</strong><p>PDKs that support the new tool features, and MPW runs to fabricate designs.</p></div></div>
  <div class="flow-step"><span class="num">4</span><div><strong>Industrial validation</strong><p>Partners design real IP blocks with the open flow and measure them.</p></div></div>
  <div class="flow-step"><span class="num">5</span><div><strong>Training</strong><p>Design examples, teaching material and tutorials for new users.</p></div></div>
</div>

## Work packages

| WP | Title | Focus | Lead |
|----|-------|-------|------|
| WP1 | Analogue and RF Design Flow Improvements | Simulation, parasitic extraction and EM tools | University of Duisburg-Essen |
| WP2 | Analogue Design Generation | MOSAIC framework, generators and design automation | Infineon Technologies Austria |
| WP3 | PDK Setup and IP Verification | PDKs and MPW runs | IHP |
| WP4 | Commercial Validation | Industrial IP designs with the open flow | IMST |
| WP5 | Design Development for Training Material and Tutorials | Design examples, courses and tutorials | University of Southern Denmark |
| WP6 | Dissemination, Communication and Exploitation | Outreach, community and sustainability | IHP |
| WP7 | Project Management | Coordination | IHP |

<style scoped>
.flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin: 1.5rem 0;
  counter-reset: step;
}
.flow-step {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
.flow-step .num {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-weight: 600;
  font-size: 0.9rem;
}
.flow-step strong {
  display: block;
  line-height: 1.75rem;
}
.flow-step p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}
</style>
