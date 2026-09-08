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
        image: page.frontmatter.image,
      }))
      .sort((a, b) => (a.date > b.date ? -1 : 1))
  }
})
