---
title: ODE4EC-AMS
---

# ODE4EC-AMS

ODE4EC-AMS targets open source EDA tools for analogue, mixed-signal (AMS) and RF designs.

<Card title="Key facts" link="https://cordis.europa.eu/project/id/101252962" linkText="Find on Cordis" target="new">

<KeyFacts>
  <KeyFact label="Start date" value="1 June 2026" />
  <KeyFact label="End date" value="31 May 2029" />
  <KeyFact label="Funded by" value="Chips JU" />
  <KeyFact label="Partners" value="26 organizations" />
  <KeyFact label="Total cost" value="€14,500,644" />
</KeyFacts>

</Card>

## Focus

Open source tools already make digital chip design possible for small teams. For analogue, mixed-signal and RF circuits on mature technology nodes, important parts of the flow are still missing or not robust enough for product development. ODE4EC-AMS closes these gaps so that SMEs, start-ups and universities can design real AMS products without expensive licences.

The work covers three areas. First, the project improves the open source tools themselves: circuit simulation, electromagnetic and RF simulation, parasitic extraction, and the interfaces between tools. Second, it automates analogue design with a modular framework for circuit generators, from transistor level up to system level. Third, it builds a library of reusable open source IP blocks, from hard macros to parameterised templates.

The tools and PDKs are tested on real designs. Partners design IP blocks, fabricate them in two multi-project wafer (MPW) runs and measure them. Training material and tutorials help new users adopt the flow. All results are released under open source licences.

## Objectives

<CardGrid>

<Card title="Close tool gaps">

Improve the maturity and usability of open source tools for simulation, EM/RF analysis and parasitic extraction, so that AMS ASIC product development becomes possible.

</Card>

<Card title="Open PDKs">

Provide open source process design kits for mature technologies that support the new tool features.

</Card>

<Card title="Design automation">

Create a modular framework with analogue generators and parameterised IP templates for reuse across design projects.

</Card>

<Card title="Validated IP">

Demonstrate the tools on analogue, RF and AMS designs fabricated in MPW runs, and feed the results back into tool and PDK development.

</Card>

<Card title="Training and adoption">

Bring open source EDA to academia, SMEs and industry through teaching material, tutorials and outreach.

</Card>

<Card title="Sustainability">

Align with European initiatives and the EU design platform, and build a community that keeps the tools alive after the project.

</Card>

</CardGrid>

## Work packages

| WP | Title | Lead |
|----|-------|------|
| WP1 | Analogue and RF Design Flow Improvements | University of Duisburg-Essen |
| WP2 | Analogue Design Generation | Infineon Technologies Austria |
| WP3 | PDK Setup and IP Verification | IHP |
| WP4 | Commercial Validation | IMST |
| WP5 | Design Development for Training Material and Tutorials | University of Southern Denmark |
| WP6 | Dissemination, Communication and Exploitation | IHP |
| WP7 | Project Management | IHP |

## Contacts

<CardGrid>

<Card title="Rene Scholz" link="mailto:[email]" linkText="[email]">

Project Coordinator, IHP

</Card>

<Card title="Karolos-Alexandros Tsakalos" link="mailto:tsakalos@ihp-microelectronics.com" linkText="tsakalos@ihp-microelectronics.com">

Dissemination, Communication and Exploitation (WP6), IHP

</Card>

</CardGrid>

## Funding

<div class="funding-logos">
  <img src="/img/logos/eu-cofunded.svg" alt="Co-funded by the European Union" />
  <img src="/img/logos/chips-ju.png" alt="Chips Joint Undertaking" />
</div>

ODE4EC-AMS has received funding from the Chips Joint Undertaking (Chips JU) under Grant Agreement No 101252962.

Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the Chips Joint Undertaking. Neither the European Union nor the granting authority can be held responsible for them.

<style scoped>
.funding-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem 3rem;
  margin: 2rem 0;
  padding: 1.75rem 2rem;
  background: #ffffff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.funding-logos img {
  height: 56px;
  width: auto;
}
@media (max-width: 640px) {
  .funding-logos { gap: 1.5rem; padding: 1.25rem; }
  .funding-logos img { height: 44px; }
}
</style>
