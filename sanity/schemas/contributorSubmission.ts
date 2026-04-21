import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contributorSubmission',
  title: 'Contributor Submissions',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Pending Review', value: 'pending' },
          { title: '✅ Approved', value: 'approved' },
          { title: '❌ Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contributorName',
      title: 'Contributor Name',
      type: 'string',
      description: 'This will appear as the author credit.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'articleTitle',
      title: 'Article Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      options: {
        list: [
          "Weapons That Shouldn't Have Worked",
          'The Day After',
          'Black Projects',
        ],
      },
    }),
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'text',
      rows: 25,
    }),
    defineField({
      name: 'image',
      title: 'Submitted Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption / Credit', type: 'string' }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Used to contact the contributor for approval, denial, or follow-up.',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      description: 'Optional.',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Editor Notes',
      type: 'text',
      rows: 4,
      description: 'Internal only. Not visible to the contributor.',
    }),
  ],
  preview: {
    select: {
      title: 'articleTitle',
      subtitle: 'contributorName',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const badge =
        status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳'
      return {
        title: `${badge} ${title || 'Untitled'}`,
        subtitle: subtitle ? `by ${subtitle}` : 'Unknown contributor',
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
})
