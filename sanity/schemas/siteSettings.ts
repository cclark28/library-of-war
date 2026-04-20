import { defineField, defineType } from 'sanity'

// Singleton document — only one instance, accessed via fixed documentId
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Library of War',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short descriptor shown in header or hero.',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Default meta description for the homepage.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Primary logo. Served from Sanity CDN.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Fallback Open Graph image. 1200×630. Used when articles have no OG image set.',
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          initialValue: 'https://facebook.com/libraryxwar',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          initialValue: 'https://instagram.com/libraryofwar',
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'hello@libraryofwar.com',
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      initialValue: 'libraryofwar.com',
      readOnly: true,
    }),

    // ─── Section Visibility ───────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Section Visibility',
      description: 'Toggle homepage sections on or off without a code deploy. Changes take effect immediately.',
      type: 'object',
      fields: [
        defineField({
          name: 'showHero',
          title: 'Hero / Top Story',
          type: 'boolean',
          description: 'The large featured article at the top of the homepage.',
          initialValue: true,
        }),
        defineField({
          name: 'showLatestDispatches',
          title: 'Latest Dispatches (3-column grid)',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showFromArchive',
          title: 'From the Archive (4-column grid)',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showEraGrid',
          title: 'Era Sections (World War I, WWII, etc.)',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showFlagshipSeries',
          title: 'Flagship Series',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),

    // ─── Maintenance Mode ─────────────────────────────────────────────────────
    defineField({
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'boolean',
      description: 'When on, the entire site shows a maintenance message instead of content.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'logo' },
  },
})
