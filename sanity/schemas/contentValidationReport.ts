import { defineField, defineType } from 'sanity'

// ─────────────────────────────────────────────────────────────────────────────
// Content Validation Report
// Created automatically by the /api/content-guard webhook on every article
// publish. Never created manually — treat as read-only in Studio.
// ─────────────────────────────────────────────────────────────────────────────

export default defineType({
  name: 'contentValidationReport',
  title: 'Content Validation Report',
  type: 'document',
  // Prevent manual creation from Studio
  __experimental_actions: ['update', 'publish', 'delete'],

  fields: [
    // ── Article reference ──────────────────────────────────────────────────
    defineField({
      name: 'article',
      title: 'Article',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule) => Rule.required(),
    }),

    // ── Timestamps ────────────────────────────────────────────────────────
    defineField({
      name: 'checkedAt',
      title: 'Checked At',
      type: 'datetime',
      readOnly: true,
    }),

    // ── Overall result ────────────────────────────────────────────────────
    defineField({
      name: 'overallStatus',
      title: 'Overall Status',
      type: 'string',
      options: {
        list: [
          { title: '✅ PASS — All checks clear', value: 'PASS' },
          { title: '⚠️ WARN — Minor issues, review recommended', value: 'WARN' },
          { title: '🚫 BLOCK — Hard failures, must fix before featuring', value: 'BLOCK' },
        ],
        layout: 'radio',
      },
      readOnly: true,
    }),

    defineField({
      name: 'featureEligible',
      title: 'Feature Block Eligible',
      type: 'boolean',
      description: 'True only if a main image is present and no hard failures exist. Gates homepage feature blocks.',
      readOnly: true,
    }),

    // ── Individual checks ─────────────────────────────────────────────────

    defineField({
      name: 'checkImagePresent',
      title: 'Image Presence',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'message', title: 'Message', type: 'string', readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkImageDuplicate',
      title: 'Image Uniqueness',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'message', title: 'Message', type: 'string', readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkTitleDuplicate',
      title: 'Title Uniqueness',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'message', title: 'Message', type: 'string', readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkSourcesCount',
      title: 'Sources Count (min 3)',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'count', title: 'Count', type: 'number', readOnly: true }),
        defineField({ name: 'message', title: 'Message', type: 'string', readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkSourceUrls',
      title: 'Source URL Reachability',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'checked', title: 'URLs Checked', type: 'number', readOnly: true }),
        defineField({
          name: 'deadLinks',
          title: 'Dead Links',
          type: 'array',
          of: [{ type: 'string' }],
          readOnly: true,
        }),
        defineField({ name: 'message', title: 'Message', type: 'string', readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkTopicRelevance',
      title: 'Topic Relevance (AI)',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({ name: 'score', title: 'Score (0–100)', type: 'number', readOnly: true }),
        defineField({ name: 'message', title: 'Message', type: 'text', rows: 2, readOnly: true }),
      ],
    }),

    defineField({
      name: 'checkHallucinationRisk',
      title: 'Hallucination Risk (AI)',
      type: 'object',
      fields: [
        defineField({ name: 'pass', title: 'Pass', type: 'boolean', readOnly: true }),
        defineField({
          name: 'flags',
          title: 'Flagged Claims',
          type: 'array',
          of: [{ type: 'string' }],
          readOnly: true,
          description: 'Claims in the article body that appear unverifiable against the cited sources.',
        }),
        defineField({ name: 'message', title: 'Summary', type: 'text', rows: 3, readOnly: true }),
      ],
    }),
  ],

  preview: {
    select: {
      title:  'article.title',
      status: 'overallStatus',
      eligible: 'featureEligible',
      checkedAt: 'checkedAt',
    },
    prepare({
      title,
      status,
      eligible,
      checkedAt,
    }: {
      title?: string
      status?: string
      eligible?: boolean
      checkedAt?: string
    }) {
      const icon =
        status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : status === 'BLOCK' ? '🚫' : '—'
      const featLabel = eligible === true ? '· Feature OK' : eligible === false ? '· No feature' : ''
      const date = checkedAt ? new Date(checkedAt).toLocaleDateString() : ''
      return {
        title: `${icon} ${title ?? 'Unknown Article'}`,
        subtitle: `${status ?? '—'} ${featLabel} ${date ? `· ${date}` : ''}`.trim(),
      }
    },
  },

  orderings: [
    {
      title: 'Checked: Newest First',
      name: 'checkedAtDesc',
      by: [{ field: 'checkedAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'overallStatus', direction: 'asc' }],
    },
  ],
})
