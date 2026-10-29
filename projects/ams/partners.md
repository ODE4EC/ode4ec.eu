---
title: ODE4EC-AMS Partners
---

<script setup>
import { partnerStats } from '../../.vitepress/theme/data/partners'
const s = partnerStats('ams')
</script>

# Partners

ODE4EC-AMS brings together {{ s.organisations }} organisations from {{ s.countries }} countries, covering the whole chain from tool development and process technology to IP design, industrial use and training.

<Card title="Consortium at a glance">

<KeyFacts>
  <KeyFact label="Organisations" :value="String(s.organisations)" />
  <KeyFact label="Countries" :value="String(s.countries)" />
  <KeyFact label="Universities" :value="String(s.universities)" />
  <KeyFact label="Research organisations" :value="String(s.research)" />
  <KeyFact label="Companies" :value="String(s.companies)" />
</KeyFacts>

</Card>

<PartnersMap project="ams" />

## Research organisations

<PartnerCards project="ams" group="research" />

## Universities

<PartnerCards project="ams" group="university" />

## Industry

<PartnerCards project="ams" group="company" />
