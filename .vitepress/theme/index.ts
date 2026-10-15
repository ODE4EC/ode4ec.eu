// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@fontsource-variable/domine'
import './style.css'
import PostTags from './PostTags.vue'
import Card from './Card.vue'
import CardGrid from './CardGrid.vue'
import KeyFact from './KeyFact.vue'
import KeyFacts from './KeyFacts.vue'
import HomeBoard from './HomeBoard.vue'
import PartnersMap from './PartnersMap.vue'
import ProjectNews from './ProjectNews.vue'
import WorkFlow from './WorkFlow.vue'
import FlowStep from './FlowStep.vue'
import SiteFooter from './SiteFooter.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostTags),
      'layout-bottom': () => h(SiteFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('Card', Card)
    app.component('CardGrid', CardGrid)
    app.component('KeyFact', KeyFact)
    app.component('KeyFacts', KeyFacts)
    app.component('HomeBoard', HomeBoard)
    app.component('PartnersMap', PartnersMap)
    app.component('ProjectNews', ProjectNews)
    app.component('WorkFlow', WorkFlow)
    app.component('FlowStep', FlowStep)
  }
} satisfies Theme
