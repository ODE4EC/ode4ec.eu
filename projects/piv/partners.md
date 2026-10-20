---
title: ODE4EC-PIV Partners
---

<script setup>
import { partnerStats } from '../../.vitepress/theme/data/partners'
const s = partnerStats('piv')
</script>

# Partners

ODE4EC-PIV is a European consortium of {{ s.organisations }} organisations across {{ s.countries }} countries, bringing together universities, research organisations and companies from across the chip design value chain.

<Card title="Consortium at a glance">

<KeyFacts>
  <KeyFact label="Organisations" :value="String(s.organisations)" />
  <KeyFact label="Countries" :value="String(s.countries)" />
  <KeyFact label="Universities" :value="String(s.universities)" />
  <KeyFact label="Research organisations" :value="String(s.research)" />
  <KeyFact label="Companies" :value="String(s.companies)" />
</KeyFacts>

</Card>

<PartnersMap project="piv" />

## Research organisations

<PartnerCards project="piv" group="research" />

## Universities

<PartnerCards project="piv" group="university" />

## Industry

<PartnerCards project="piv" group="company" />
