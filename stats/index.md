---
title: Visitor statistics
description: Monthly page views and visits for the ODE4EC website.
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { data as months } from './stats.data'

const sections = [
  ['home', 'Home'],
  ['ams', 'AMS'],
  ['dig', 'DIG'],
  ['piv', 'PIV'],
  ['site', 'Whole site'],
]
const count = (m, s, key) => (m.counts[s]?.[key] ?? 0).toLocaleString('en')
</script>

# Visitor statistics

Monthly page views and visits from Cloudflare Web Analytics, counted in real browsers without bots. A visit is someone arriving from another site or typing the address; a project's numbers include all of its pages. Months marked * contain sampled days, so their numbers are estimates.

<p v-if="!months.length">No data yet.</p>

<template v-for="[key, label] in [['views', 'Page views'], ['visits', 'Visits']]" :key="key">

<h2 v-if="months.length">{{ label }}</h2>

<table v-if="months.length">
  <thead>
    <tr>
      <th>Month</th>
      <th>Days</th>
      <th v-for="[s, name] in sections" :key="s">{{ name }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="m in months" :key="m.month">
      <td>{{ m.month }}{{ m.sampled ? ' *' : '' }}</td>
      <td>{{ m.days }}</td>
      <td v-for="[s] in sections" :key="s">{{ count(m, s, key) }}</td>
    </tr>
  </tbody>
</table>

</template>
