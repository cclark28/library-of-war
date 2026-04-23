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
import idDrillQuestion from './idDrillQuestion'
import contentValidationReport from './contentValidationReport'

export const schemaTypes = [
  // ── Content documents ────────────────────────────────────────────
  article,
  author,
  series,
  category,
  contributorSubmission,
  idDrillQuestion,
  // ── Quality assurance (auto-created by /api/content-guard) ───────
  contentValidationReport,
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
