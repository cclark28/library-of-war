import { defineField, defineType } from 'sanity'

// onThisDayEntry — quick-read historical brief, one per significant military date.
//
// NOT an article. Exempt from:
//   - Law 1 (no image required)
//   - Law 3 (no 3-source minimum)
//
// Generated nightly by the OTD pipeline for tomorrow's date.
// Manually editable in Studio for corrections or editorial additions.

export default defineType({
  name: 'onThisDayEntry',
  title: 'On This Day',
  type: 'document',
  fields: [
    defineField({
      name: 'month',
      title: 'Month (1–12)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(12).integer(),
    }),
    defineField({
      name: 'day',
      title: 'Day (1–31)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(31).integer(),
    }),
    defineField({
      name: 'year',
      title: 'Historical Year',
      type: 'number',
      description: 'The year the event occurred — not the publication year.',
      validation: (Rule) => Rule.required().integer(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Sharp, factual. Max 120 chars. No clickbait.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 5,
      description: 'Quick read — 100 to 200 words. Atmospheric but factual. No sources required.',
      validation: (Rule) =>
        Rule.required()
          .min(80)
          .max(1400)
          .warning('Keep it between 100–200 words for the best reader experience.'),
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {
        list: [
          { title: 'Ancient & Medieval (Antiquity–1500)',    value: 'ancient-medieval' },
          { title: 'Early Modern (1500–1800)',               value: 'early-modern' },
          { title: 'Napoleonic Wars (1803–1815)',            value: 'napoleonic-wars' },
          { title: 'American Civil War (1861–1865)',         value: 'american-civil-war' },
          { title: 'World War I (1914–1918)',                value: 'world-war-i' },
          { title: 'World War II (1939–1945)',               value: 'world-war-ii' },
          { title: 'Korean War (1950–1953)',                 value: 'korean-war' },
          { title: 'Vietnam War (1955–1975)',                value: 'vietnam-war' },
          { title: 'Cold War (1947–1991)',                   value: 'cold-war' },
          { title: 'Modern Conflicts (1990–Present)',        value: 'modern-conflicts' },
          { title: 'Technology & Weapons (All Eras)',        value: 'technology-weapons' },
          { title: 'Intelligence & Spec Ops (All Eras)',     value: 'intelligence-special-ops' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkedArticle',
      title: 'Linked Article',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'Optional — if a full Library of War article covers this event, link it here. The "Read full article" CTA appears automatically.',
      options: {
        filter: 'status == "published"',
      },
    }),
  ],

  orderings: [
    {
      title: 'Calendar Date (Month → Day → Year)',
      name: 'calendarAsc',
      by: [
        { field: 'month', direction: 'asc' },
        { field: 'day', direction: 'asc' },
        { field: 'year', direction: 'desc' },
      ],
    },
    {
      title: 'Most Recent Historical Event',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      headline: 'headline',
      month: 'month',
      day: 'day',
      year: 'year',
      era: 'era',
    },
    prepare({ headline, month, day, year, era }: {
      headline?: string
      month?: number
      day?: number
      year?: number
      era?: string
    }) {
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const m = month ? MONTHS[month - 1] : '?'
      return {
        title: headline ?? 'Untitled',
        subtitle: `${m} ${day ?? '?'} · ${year ?? '?'} · ${era ?? 'No era'}`,
      }
    },
  },
})
