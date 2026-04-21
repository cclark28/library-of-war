import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contributorPage',
  title: 'Contributor Page',
  type: 'document',
  fields: [

    // ─── Gate phase ────────────────────────────────────────────────────────
    defineField({
      name: 'gateLabel',
      title: 'Gate — Label',
      type: 'string',
      description: 'Small eyebrow label above the headline.',
      initialValue: 'Contributor Access',
    }),
    defineField({
      name: 'gateHeadline',
      title: 'Gate — Headline',
      type: 'string',
      initialValue: 'Submit an Article',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gateSubtext',
      title: 'Gate — Subtext',
      type: 'text',
      rows: 3,
      initialValue: 'Library of War accepts pitches and drafts from qualified contributors. Enter the access password to continue.',
    }),
    defineField({
      name: 'gateCtaLabel',
      title: 'Gate — Button Label',
      type: 'string',
      initialValue: 'Enter',
    }),

    // ─── Form phase ────────────────────────────────────────────────────────
    defineField({
      name: 'formLabel',
      title: 'Form — Label',
      type: 'string',
      initialValue: 'Contributor Submission',
    }),
    defineField({
      name: 'formHeadline',
      title: 'Form — Headline',
      type: 'string',
      initialValue: 'Submit Your Article',
    }),
    defineField({
      name: 'formSubtext',
      title: 'Form — Subtext',
      type: 'text',
      rows: 2,
      initialValue: 'All submissions are reviewed before publication. Your name will appear as the author credit exactly as entered below.',
    }),
    defineField({
      name: 'guidelines',
      title: 'Form — Legal / Guidelines Text',
      type: 'text',
      rows: 4,
      description: 'Shown below the form before the submit button.',
      initialValue: 'By submitting, you confirm this is original work and that any images are in the public domain. Library of War retains the right to edit, decline, or not publish submitted work. You will receive no automatic confirmation — Charlie will be in touch if it advances.',
    }),
    defineField({
      name: 'submitCtaLabel',
      title: 'Form — Submit Button Label',
      type: 'string',
      initialValue: 'Submit for Review',
    }),

    // ─── Success phase ─────────────────────────────────────────────────────
    defineField({
      name: 'successLabel',
      title: 'Success — Label',
      type: 'string',
      initialValue: 'Received',
    }),
    defineField({
      name: 'successHeadline',
      title: 'Success — Headline',
      type: 'string',
      initialValue: 'Submission Filed',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success — Message',
      type: 'text',
      rows: 3,
      initialValue: 'Your article is in the queue for review. Charlie will reach out directly if it moves forward. There is no automated confirmation.',
    }),
  ],
  preview: {
    prepare() { return { title: 'Contributor Page' } },
  },
})
