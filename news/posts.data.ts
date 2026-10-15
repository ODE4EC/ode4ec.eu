import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  image?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('news/posts/*.md', {
  transform(rawData): Post[] {
    return rawData
      .map(page => ({
        title: page.frontmatter.title ?? page.url,
        url: page.url,
        date: page.frontmatter.date
        ? new Date(page.frontmatter.date).toISOString().slice(0, 10)
        : '',
        tags: page.frontmatter.tags ?? [],
        image: checkImage(page.frontmatter.image, page.url),
      }))
      .sort((a, b) => (a.date > b.date ? -1 : 1))
  }
})

// `image` must be a site-root path to a file in public/, e.g. /img/news/foo.png.
// Anything else is dropped with a warning, so the homepage draws its fallback thumbnail.
function checkImage(image: string | undefined, url: string) {
  if (image && (!image.startsWith('/') || !existsSync(fileURLToPath(new URL(`../public${image}`, import.meta.url))))) {
    console.warn(`[news] ${url}: image "${image}" is not a file under public/ (use e.g. /img/news/foo.png)`)
    return undefined
  }
  return image
}
