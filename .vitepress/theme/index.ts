// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import NewsPreview from './NewsPreview.vue'
import EventsPreview from './EventsPreview.vue'
import PostTags from './PostTags.vue'
import Card from './Card.vue'
import CardGrid from './CardGrid.vue'
import KeyFact from './KeyFact.vue'
import KeyFacts from './KeyFacts.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostTags),
    })
  },
  enhanceApp({ app }) {
    app.component('NewsPreview', NewsPreview)
    app.component('EventsPreview', EventsPreview)
    app.component('Card', Card)
    app.component('CardGrid', CardGrid)
    app.component('KeyFact', KeyFact)
    app.component('KeyFacts', KeyFacts)
  }
} satisfies Theme
