import fs from 'node:fs'

export interface Counts {
  views: number
  visits: number
}

export interface MonthStats {
  /** YYYY-MM */
  month: string
  /** Days with data in this month */
  days: number
  /** Some of the days are sampled, so their counts are estimates */
  sampled: boolean
  /** Keyed by section: 'home', a project id, or 'site' for the whole site */
  counts: Record<string, Counts>
}

const projects = ['ams', 'dig', 'piv']

declare const data: MonthStats[]
export { data }

interface Day {
  date: string
  sampleInterval: number
  pages: Record<string, Counts>
}

function section(path: string) {
  if (path === '/') return 'home'
  return projects.find(id => path === `/projects/${id}` || path.startsWith(`/projects/${id}/`))
}

export default {
  // Paths are relative to this loader file; rebuilds when a day is added.
  watch: ['./daily/*.json'],
  load(files: string[]): MonthStats[] {
    const months = new Map<string, MonthStats>()
    for (const file of files) {
      const day = JSON.parse(fs.readFileSync(file, 'utf-8')) as Day
      const key = day.date.slice(0, 7)
      const month = months.get(key) ?? { month: key, days: 0, sampled: false, counts: {} }
      months.set(key, month)
      month.days++
      month.sampled ||= day.sampleInterval > 1
      for (const [path, page] of Object.entries(day.pages)) {
        for (const s of [section(path), 'site']) {
          if (!s) continue
          const c = (month.counts[s] ??= { views: 0, visits: 0 })
          c.views += page.views
          c.visits += page.visits
        }
      }
    }
    return [...months.values()].sort((a, b) => b.month.localeCompare(a.month))
  }
}
