import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Page not found.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 2,
      initialValue: 'This dispatch has been redacted, relocated, or never existed. Return to the archive.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Return to Archive',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA Button URL',
      type: 'string',
      initialValue: '/',
    }),

    // ─── War facts / quotes ────────────────────────────────────────────────
    defineField({
      name: 'facts',
      title: 'War Facts & Quotes',
      description: 'Add up to 32. One is randomly displayed on every 404 page visit.',
      type: 'array',
      validation: (Rule) => Rule.max(32),
      of: [{
        type: 'object',
        name: 'fact',
        fields: [
          defineField({
            name: 'text',
            title: 'Fact or Quote',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'attribution',
            title: 'Attribution',
            type: 'string',
            description: 'Optional — e.g. "Winston Churchill, 1940" or "Battle of Midway, June 1942"',
          }),
        ],
        preview: {
          select: { title: 'text', subtitle: 'attribution' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prepare(value: any) {
            return {
              title: value.title?.slice(0, 80) + (value.title?.length > 80 ? '…' : ''),
              subtitle: value.subtitle || 'No attribution',
            }
          },
        },
      }],
    }),
  ],
  preview: {
    prepare() { return { title: '404 Page' } },
  },
})
