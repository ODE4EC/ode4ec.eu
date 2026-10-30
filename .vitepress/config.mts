import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { partnerStats, type ProjectId } from './theme/data/partners'

const __dirname = dirname(fileURLToPath(import.meta.url))

function getSidebarItems(subdir: string) {
  const dirPath = resolve(__dirname, '..', subdir)
  const files = readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()

  return files.map(file => {
    const content = readFileSync(resolve(dirPath, file), 'utf-8')
    const titleMatch = content.match(/^title:\s*(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '')
    return { text: title, link: `/${subdir}/${file.replace('.md', '')}` }
  })
}

const projectLinks = [
  { text: 'ODE4EC-AMS', link: '/projects/ams/' },
  { text: 'ODE4EC-DIG', link: '/projects/dig/' },
  { text: 'ODE4EC-PIV', link: '/projects/piv/' },
]

const topLevel = [
  { text: 'About', link: '/about', items: [] },
  { text: 'Advocacy', link: '/advocacy', items: [] },
  { text: 'Projects', link: '/projects', items: [] },
]

const hostname = 'https://ode4ec.eu'
const siteTitle = 'ODE4EC'
const siteDescription = 'This is the central website for projects under the ODE4EC initiative.'
// Scaffold pages with no content yet, and the unlisted stats page: kept out of the
// sitemap (and noindex in their frontmatter).
const unpublished = ['/projects/dig/work-plan', '/projects/dig/technology', '/projects/dig/funding', '/stats']

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en',
  title: siteTitle,
  description: siteDescription,
  sitemap: {
    hostname,
    transformItems: (items) => items.filter((i) => !unpublished.some((u) => i.url.startsWith(u.slice(1)))),
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    // the site's page background in light and dark (see style.css and VitePress's --vp-c-bg)
    ['meta', { name: 'theme-color', content: '#faf8f4', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#1b1b1f', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${hostname}/img/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Cloudflare Web Analytics, for the stats page (see privacy.md for what it collects);
    // the token is public: Analytics & Logs → Web Analytics → ode4ec.eu → Manage site
    ['script', { type: 'module', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "b7552edafe154e798792fe1c320e8b0b"}' }],
  ],
  // The partners pages' description carries counts from the partner data.
  transformPageData(pageData) {
    const project = pageData.relativePath.match(/^projects\/(ams|dig|piv)\/partners\.md$/)?.[1] as ProjectId | undefined
    if (project) {
      const { organisations, countries } = partnerStats(project)
      const what = 'universities, research organisations and companies'
      pageData.description = pageData.frontmatter.description = `The ${organisations} ${what} from ${countries} countries behind ODE4EC-${project.toUpperCase()}.`
    }
  },
  transformHead({ pageData }) {
    const title = pageData.frontmatter.title ?? pageData.title ?? siteTitle
    return [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageData.frontmatter.description ?? pageData.description ?? siteDescription }],
    ]
  },
  themeConfig: {
    logo: '/img/ode4ec-logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
      { text: 'Projects', items: projectLinks },
      { text: 'Advocacy', link: '/advocacy/' },
      { text: 'News', link: '/news/' },
      { text: 'Events', link: '/events/' },
    ],

    sidebar: {
      '/about': [
        ...topLevel,
        { text: 'News', link: '/news/', items: [] },
        { text: 'Events', link: '/events/', items: [] },
      ],
      '/advocacy': [
        ...topLevel,
        { text: 'News', link: '/news/', items: [] },
        { text: 'Events', link: '/events/', items: [] },
      ],
      // Without this key the projects index had no sidebar at all, which made
      // the whole side navigation vanish when landing on /projects/.
      '/projects/': [
        ...topLevel.map((item) => (item.link === '/projects' ? { ...item, items: projectLinks } : item)),
        { text: 'News', link: '/news/', items: [] },
        { text: 'Events', link: '/events/', items: [] },
      ],
      '/news/': [
        ...topLevel,
        { text: 'News', link: '/news/', items: getSidebarItems('news/posts') },
        { text: 'Events', link: '/events/', items: [] },
      ],
      '/events/': [
        ...topLevel,
        { text: 'News', link: '/news/', items: [] },
        { text: 'Events', link: '/events/', items: getSidebarItems('events/posts') },
      ],
      '/projects/ams/': [
        {
          text: 'ODE4EC-AMS',
          items: [
            { text: 'Overview', link: '/projects/ams/' },
            { text: 'Technology', link: '/projects/ams/technology' },
            { text: 'Work plan', link: '/projects/ams/work-plan' },
            { text: 'Partners', link: '/projects/ams/partners' },
            { text: 'News', link: '/projects/ams/news' },
            { text: 'Funding', link: '/projects/ams/funding' },
          ],
        },
      ],
      '/projects/dig/': [
        {
          text: 'ODE4EC-DIG',
          items: [
            { text: 'Overview', link: '/projects/dig/' },
            { text: 'Partners', link: '/projects/dig/partners' },
            { text: 'News', link: '/projects/dig/news' },
          ],
        },
      ],
      '/projects/piv/': [
        {
          text: 'ODE4EC-PIV',
          items: [
            { text: 'Overview', link: '/projects/piv/' },
            { text: 'Work plan', link: '/projects/piv/work-plan' },
            { text: 'Partners', link: '/projects/piv/partners' },
            { text: 'News', link: '/projects/piv/news' },
            { text: 'Funding', link: '/projects/piv/funding' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fossi-foundation/ode4ec.eu.git' }
    ],
  }
})
