---
title: ODE4EC-DIG Partners
---

<script setup>
import { partnerStats } from '../../.vitepress/theme/data/partners'
const s = partnerStats('dig')
</script>

# Partners

ODE4EC-DIG is a pan-European consortium of {{ s.organisations }} organisations across {{ s.countries }} countries.

<Card title="Consortium at a glance">

<KeyFacts>
  <KeyFact label="Organisations" :value="String(s.organisations)" />
  <KeyFact label="Countries" :value="String(s.countries)" />
  <KeyFact label="Universities" :value="String(s.universities)" />
  <KeyFact label="Research organisations" :value="String(s.research)" />
  <KeyFact label="Companies" :value="String(s.companies)" />
</KeyFacts>

</Card>

<PartnersMap project="dig" />

## Research organisations

<PartnerCards project="dig" group="research" />

## Universities

<PartnerCards project="dig" group="university" />

## Industry

<PartnerCards project="dig" group="company" />
