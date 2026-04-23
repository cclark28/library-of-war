import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'library-of-war',
  title: 'Library of War',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Library of War')
          .items([
            // Singleton — Site Settings
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),

            S.divider(),

            // Content
            S.listItem()
              .title('Articles')
              .child(
                S.documentTypeList('article')
                  .title('Articles')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Series')
              .child(
                S.documentTypeList('series')
                  .title('Series')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),

            S.divider(),

            // ID Drill
            S.listItem()
              .title('ID Drill Questions')
              .child(
                S.documentTypeList('idDrillQuestion')
                  .title('ID Drill Questions')
                  .defaultOrdering([
                    { field: 'category', direction: 'asc' },
                    { field: 'difficulty', direction: 'asc' },
                  ])
              ),

            S.divider(),

            // Contributor submissions — always stay in draft, never auto-publish
            S.listItem()
              .title('Contributor Submissions')
              .child(
                S.documentTypeList('contributorSubmission')
                  .title('Contributor Submissions')
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),

            S.divider(),

            // Content Validation Reports — auto-created by /api/content-guard webhook
            S.listItem()
              .title('🛡 Validation Reports')
              .child(
                S.documentTypeList('contentValidationReport')
                  .title('Validation Reports')
                  .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }])
                  .filter('_type == "contentValidationReport"')
              ),

            // Blocked articles — quick filter for hard failures
            S.listItem()
              .title('🚫 Blocked Articles')
              .child(
                S.documentTypeList('contentValidationReport')
                  .title('Blocked Articles')
                  .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }])
                  .filter('_type == "contentValidationReport" && overallStatus == "BLOCK"')
              ),

            // Articles missing feature image gate
            S.listItem()
              .title('📷 Not Feature-Eligible')
              .child(
                S.documentTypeList('contentValidationReport')
                  .title('Not Feature-Eligible')
                  .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }])
                  .filter('_type == "contentValidationReport" && featureEligible == false')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
