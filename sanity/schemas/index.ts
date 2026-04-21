import article from './article'
import author from './author'
import series from './series'
import category from './category'
import siteSettings from './siteSettings'
import navigation from './navigation'
import footer from './footer'
import homepageContent from './homepageContent'
import notFoundPage from './notFoundPage'
import missionPage from './missionPage'
import resourcesPage from './resourcesPage'
import contributorPage from './contributorPage'
import contributorSubmission from './contributorSubmission'

export const schemaTypes = [
  // ── Content documents ────────────────────────────────────────────
  article,
  author,
  series,
  category,
  contributorSubmission,
  // ── Site configuration singletons ────────────────────────────────
  siteSettings,
  navigation,
  footer,
  homepageContent,
  notFoundPage,
  missionPage,
  resourcesPage,
  contributorPage,
]
