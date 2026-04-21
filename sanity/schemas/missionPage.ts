import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'missionPage',
  title: 'Mission Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Page Headline',
      type: 'string',
      initialValue: 'Our Mission',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      description: 'The main editorial text of the mission page. Supports rich text.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Blockquote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
    }),

    // ─── Donation section ──────────────────────────────────────────────────
    defineField({
      name: 'donationHeading',
      title: 'Donation Section — Heading',
      type: 'string',
      initialValue: 'Support the Library of War',
    }),
    defineField({
      name: 'donationSubtext',
      title: 'Donation Section — Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'This archive is free and will always remain free. Your support keeps it that way.',
    }),
  ],
  preview: {
    prepare() { return { title: 'Mission Page' } },
  },
})
