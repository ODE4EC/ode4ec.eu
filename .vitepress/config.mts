import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ODE4EC",
  description: "This is the central website for projects under the ODE4EC umbrella.",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Domine:wght@400;600;700&display=swap', rel: 'stylesheet' }],
  ],
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
