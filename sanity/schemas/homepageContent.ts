import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepageContent',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    // ─── Section headings ──────────────────────────────────────────────────
    defineField({
      name: 'latestDispatchesLabel',
      title: 'Section: Latest Dispatches',
      type: 'string',
      initialValue: 'Latest Dispatches',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fromArchiveLabel',
      title: 'Section: From the Archive',
      type: 'string',
      initialValue: 'From the Archive',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'flagshipSeriesLabel',
      title: 'Section: Flagship Series',
      type: 'string',
      initialValue: 'Flagship Series',
      validation: (Rule) => Rule.required(),
    }),

    // ─── CTAs and labels ───────────────────────────────────────────────────
    defineField({
      name: 'seeAllLabel',
      title: 'See All CTA Label',
      type: 'string',
      initialValue: '— See All Archive Articles —',
    }),
    defineField({
      name: 'comingSoonLabel',
      title: 'Series Coming Soon Label',
      type: 'string',
      initialValue: 'Coming Soon',
    }),

    // ─── Filter bar ────────────────────────────────────────────────────────
    defineField({
      name: 'filterLabel',
      title: 'Filter Bar: Filter Label',
      type: 'string',
      initialValue: 'Filter',
    }),
    defineField({
      name: 'showAllLabel',
      title: 'Filter Bar: Show All Label',
      type: 'string',
      initialValue: 'Show All',
    }),
    defineField({
      name: 'sortLabel',
      title: 'Filter Bar: Sort By Label',
      type: 'string',
      initialValue: 'Sort By',
    }),

    // ─── Masthead tagline ──────────────────────────────────────────────────
    defineField({
      name: 'mastTagline',
      title: 'Masthead Tagline',
      type: 'string',
      description: 'The small label below the logo in the header.',
      initialValue: 'Military History Archive',
    }),
  ],
  preview: {
    prepare() { return { title: 'Homepage Content' } },
  },
})
