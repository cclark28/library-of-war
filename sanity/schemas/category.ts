import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {
        list: [
          { title: 'Ancient / Medieval', value: 'ancient-medieval' },
          { title: 'Early Modern (1500–1800)', value: 'early-modern' },
          { title: 'Napoleonic Wars', value: 'napoleonic' },
          { title: 'American Civil War', value: 'civil-war' },
          { title: 'World War I', value: 'wwi' },
          { title: 'World War II', value: 'wwii' },
          { title: 'Korean War', value: 'korean-war' },
          { title: 'Vietnam War', value: 'vietnam' },
          { title: 'Cold War', value: 'cold-war' },
          { title: 'Modern Conflicts (1990–present)', value: 'modern' },
          { title: 'Technology & Weapons', value: 'technology' },
          { title: 'Intelligence & Special Ops', value: 'intel-specops' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'era' },
  },
})
