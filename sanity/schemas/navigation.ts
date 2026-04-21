import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    // ─── Top-level labels ──────────────────────────────────────────────────
    defineField({ name: 'homeLabel',      title: 'Home Label',           type: 'string', initialValue: 'Home' }),
    defineField({ name: 'browseLabel',    title: 'Browse by Era Label',  type: 'string', initialValue: 'Browse by Era' }),
    defineField({ name: 'seriesLabel',    title: 'Series Label',         type: 'string', initialValue: 'Series' }),
    defineField({ name: 'resourcesLabel', title: 'Resources Label',      type: 'string', initialValue: 'Resources' }),
    defineField({ name: 'missionLabel',   title: 'Mission Label',        type: 'string', initialValue: 'Mission' }),
    defineField({ name: 'searchPlaceholder', title: 'Search Placeholder', type: 'string', initialValue: 'Search the archive…' }),
    defineField({ name: 'searchLabel',    title: 'Search Button Label',  type: 'string', initialValue: 'Search' }),

    // ─── Browse by Era dropdown ────────────────────────────────────────────
    defineField({
      name: 'eraItems',
      title: 'Browse by Era — Dropdown Items',
      description: 'Controls the mega-menu. Toggle Visible to hide an era without deleting it.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'eraItem',
        fields: [
          defineField({ name: 'label',   title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'years',   title: 'Years', type: 'string', description: 'e.g. "1914–1918"' }),
          defineField({ name: 'href',    title: 'URL',   type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'visible', title: 'Visible', type: 'boolean', initialValue: true }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'years', visible: 'visible' },
          prepare({ title, subtitle, visible }: { title: string; subtitle?: string; visible?: boolean }) {
            return { title: `${visible === false ? '🙈 ' : ''}${title}`, subtitle }
          },
        },
      }],
    }),

    // ─── Series dropdown ───────────────────────────────────────────────────
    defineField({
      name: 'seriesItems',
      title: 'Series — Dropdown Items',
      description: 'Controls the series dropdown. Toggle Visible to hide.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'seriesNavItem',
        fields: [
          defineField({ name: 'label',   title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href',    title: 'URL',   type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'visible', title: 'Visible', type: 'boolean', initialValue: true }),
        ],
        preview: {
          select: { title: 'label', visible: 'visible' },
          prepare({ title, visible }: { title: string; visible?: boolean }) {
            return { title: `${visible === false ? '🙈 ' : ''}${title}` }
          },
        },
      }],
    }),

    // ─── Social links (top bar + mobile) ──────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      description: 'Shown in the top utility bar and mobile nav.',
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
  ],
  preview: {
    prepare() { return { title: 'Navigation' } },
  },
})
