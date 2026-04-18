import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'voice',
      title: 'House Voice',
      type: 'string',
      description: 'The Analyst: cold, clinical, source-dense. The Correspondent: short, punchy, human detail.',
      options: {
        list: [
          { title: 'The Analyst', value: 'analyst' },
          { title: 'The Correspondent', value: 'correspondent' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'series' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Public domain only. National Archives, Library of Congress, DVIDS, Wikimedia Commons PD.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption / Credit',
          type: 'string',
          description: 'e.g. "National Archives, RG-111, 1944"',
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Source URL',
          type: 'url',
          description: 'Direct link to the public domain source record.',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown in article cards and meta description. Max 300 chars.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption / Credit', type: 'string' },
            { name: 'sourceUrl', title: 'Source URL', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      description: 'Minimum 3 verifiable open sources. Every claim must be citable.',
      of: [
        {
          type: 'object',
          name: 'source',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'publisher', title: 'Publisher / Archive', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
            defineField({ name: 'date', title: 'Publication Date', type: 'string', description: 'e.g. "1944" or "March 12, 1968"' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'publisher' },
          },
        },
      ],
      validation: (Rule) => Rule.min(3).error('Minimum 3 sources required.'),
    }),
    defineField({
      name: 'socialCaption',
      title: 'Social Caption',
      type: 'text',
      rows: 4,
      description: 'Auto-posted to Facebook Page and Instagram on publish via Meta Graph API webhook. Max 2,200 chars (IG limit).',
      validation: (Rule) => Rule.max(2200),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Title',
          type: 'string',
          description: 'Defaults to article title if blank. Max 60 chars.',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Defaults to excerpt if blank. Max 160 chars.',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          description: 'Defaults to mainImage if blank. 1200×630 recommended.',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      voice: 'voice',
      status: 'status',
      media: 'mainImage',
    },
    prepare({ title, voice, status, media }) {
      const voiceLabel = voice === 'analyst' ? 'Analyst' : 'Correspondent'
      const statusLabel = status === 'published' ? '' : ` · ${status?.toUpperCase()}`
      return {
        title,
        subtitle: `${voiceLabel}${statusLabel}`,
        media,
      }
    },
  },
})
