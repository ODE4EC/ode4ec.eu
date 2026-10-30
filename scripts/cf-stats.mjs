#!/usr/bin/env node
// Daily visitor statistics from Cloudflare Web Analytics (GraphQL API): page views
// and visits per page, written to stats/daily/YYYY-MM-DD.json. The stats page
// (stats/index.md) sums them up per month.
//
//   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... node scripts/cf-stats.mjs [YYYY-MM-DD ...]
//
// The token needs the "Account Analytics: Read" permission. Without dates it fetches
// every day of the last six that has no file yet. Cloudflare keeps unsampled data
// for only seven days and then keeps about one in ten page views, so days have to
// be fetched within that week to get exact counts (see sampleInterval in the files).

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const outDir = new URL('../stats/daily/', import.meta.url).pathname
const token = process.env.CLOUDFLARE_API_TOKEN
const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID
const host = process.env.CLOUDFLARE_HOST ?? 'ode4ec.eu'
// optional: restrict to one Web Analytics site instead of filtering by host
const siteTag = process.env.CLOUDFLARE_SITE_TAG

if (!token || !accountTag) {
  console.error('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID')
  process.exit(1)
}

const query = `
query ($accountTag: string!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumPageloadEventsAdaptiveGroups(filter: $filter, limit: 10000) {
        count
        sum { visits }
        avg { sampleInterval }
        dimensions { requestPath }
      }
    }
  }
}`

async function fetchDay(date) {
  const start = new Date(`${date}T00:00:00Z`)
  const end = new Date(start.getTime() + 86400e3)
  const filter = {
    AND: [
      { datetime_geq: start.toISOString(), datetime_lt: end.toISOString() },
      { bot: 0 },
      siteTag ? { siteTag } : { requestHost: host },
    ],
  }
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { accountTag, filter } }),
  })
  const body = await res.json()
  if (!res.ok || body.errors?.length) {
    throw new Error(`Cloudflare API: ${JSON.stringify(body.errors ?? body)}`)
  }
  return body.data.viewer.accounts[0]?.rumPageloadEventsAdaptiveGroups ?? []
}

// /projects/ams/index.html, /projects/ams/ and /projects/ams are the same page
function normalize(path) {
  const p = path.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '')
  return p === '' ? '/' : p
}

function lastDays(n) {
  const today = Math.floor(Date.now() / 86400e3) * 86400e3 // midnight UTC
  return Array.from({ length: n }, (_, i) => new Date(today - (n - i) * 86400e3).toISOString().slice(0, 10))
}

const args = process.argv.slice(2)
if (args.some(d => !/^\d{4}-\d{2}-\d{2}$/.test(d))) {
  console.error('Dates must be YYYY-MM-DD')
  process.exit(1)
}
const dates = args.length ? args : lastDays(6).filter(d => !existsSync(join(outDir, `${d}.json`)))

mkdirSync(outDir, { recursive: true })
for (const date of dates) {
  const pages = {}
  let sampleInterval = 1
  for (const row of await fetchDay(date)) {
    const page = (pages[normalize(row.dimensions.requestPath)] ??= { views: 0, visits: 0 })
    page.views += row.count
    page.visits += row.sum.visits
    sampleInterval = Math.max(sampleInterval, row.avg.sampleInterval)
  }
  const sorted = Object.fromEntries(Object.entries(pages).sort(([, a], [, b]) => b.views - a.views))
  writeFileSync(join(outDir, `${date}.json`), JSON.stringify({ date, host, sampleInterval, pages: sorted }, null, 2) + '\n')
  const views = Object.values(pages).reduce((n, p) => n + p.views, 0)
  console.log(`${date}: ${views} page views${sampleInterval > 1 ? ` (sampled 1 in ${sampleInterval})` : ''}`)
}
if (!dates.length) console.log('Nothing to fetch, the last six days are already there')
