import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'text',
      rows: 2,
      initialValue: 'Military History Archive. Every claim cited. Every fact verifiable. Public domain imagery only.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'libraryofwar@gmail.com',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Use {year} as a placeholder for the current year.',
      initialValue: '© {year} Library of War. All imagery public domain.',
    }),
    defineField({
      name: 'domainLabel',
      title: 'Domain Label',
      type: 'string',
      initialValue: 'libraryofwar.com',
    }),

    // ─── Social links ──────────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{
        type: 'object',
        name: 'socialLink',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href',  title: 'URL',   type: 'url',    validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      }],
    }),

    // ─── Footer columns ────────────────────────────────────────────────────
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      description: 'Each column has a heading and a list of links. The brand column (logo, tagline, email, social) is fixed — edit it above.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'footerColumn',
        fields: [
          defineField({ name: 'heading', title: 'Column Heading', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({
            name: 'links',
            title: 'Links',
            type: 'array',
            of: [{
              type: 'object',
              name: 'footerLink',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'href',  title: 'URL',   type: 'string', validation: (Rule) => Rule.required() }),
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            }],
          }),
        ],
        preview: {
          select: { title: 'heading', links: 'links' },
          prepare({ title, links }: { title: string; links?: unknown[] }) {
            return { title, subtitle: `${links?.length ?? 0} link${links?.length === 1 ? '' : 's'}` }
          },
        },
      }],
    }),
  ],
  preview: {
    prepare() { return { title: 'Footer' } },
  },
})
