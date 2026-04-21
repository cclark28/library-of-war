import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'idDrillQuestion',
  title: 'ID Drill Question',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Correct Answer Name',
      type: 'string',
      description: 'The name players must identify. e.g. "F-14 Tomcat", "M1 Abrams", "Medal of Honor"',
      validation: (Rule) => Rule.required().max(120),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'All 4 answer choices will be drawn from this same category.',
      options: {
        list: [
          { title: 'Aircraft', value: 'aircraft' },
          { title: 'Armor (Tanks & AFVs)', value: 'armor' },
          { title: 'Small Arms', value: 'smallarms' },
          { title: 'Warship', value: 'warship' },
          { title: 'Military Rank', value: 'rank' },
          { title: 'Medal & Decoration', value: 'medal' },
          { title: 'Unit Insignia & Patch', value: 'insignia' },
          { title: 'Artillery & Crew-Served', value: 'artillery' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'branch',
      title: 'Branch',
      type: 'string',
      description: 'Which branch filter this question appears under.',
      options: {
        list: [
          { title: 'All Branches', value: 'all' },
          { title: 'Army', value: 'army' },
          { title: 'Navy', value: 'navy' },
          { title: 'Air Force', value: 'airforce' },
          { title: 'Marine Corps', value: 'marines' },
          { title: 'Coast Guard', value: 'coastguard' },
          { title: 'Space Force', value: 'spaceforce' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Recruit — Common, widely known', value: 'recruit' },
          { title: 'Sergeant — Requires some knowledge', value: 'sergeant' },
          { title: 'Commander — Specialist / obscure', value: 'commander' },
        ],
        layout: 'radio',
      },
      initialValue: 'sergeant',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Question Image',
      type: 'object',
      description: 'Public domain only. Use Wikimedia Commons, DVIDS, Library of Congress, or National Archives.',
      fields: [
        defineField({
          name: 'url',
          title: 'Image URL',
          type: 'url',
          description: 'Direct URL to the public domain image.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Descriptive but neutral — do NOT include the answer name.',
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'credit',
          title: 'Photo Credit',
          type: 'string',
          description: 'e.g. "U.S. Navy · DVIDS" or "Wikimedia Commons · Public Domain"',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Source Page URL',
          type: 'url',
          description: 'Link to the original record or Wikimedia page.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the feedback info card. 1–3 sentences. Max 400 chars.',
      validation: (Rule) => Rule.required().max(400),
    }),

    defineField({
      name: 'history',
      title: 'Historical Context',
      type: 'text',
      rows: 5,
      description: 'Longer historical background shown on the feedback card. Max 800 chars.',
      validation: (Rule) => Rule.max(800),
    }),

    defineField({
      name: 'wikiUrl',
      title: 'Wikipedia / Source URL',
      type: 'url',
      description: 'Primary "Read More" link. Should go to Wikipedia, history.army.mil, NavSource, etc.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'distractors',
      title: 'Distractors (Wrong Answers)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Exactly 3 plausible wrong answers from the SAME category. e.g. for F-14, use F/A-18, F-15, F-16.',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(3)
          .error('Exactly 3 distractors required — one per wrong answer slot.'),
    }),

    defineField({
      name: 'era',
      title: 'Era (optional)',
      type: 'string',
      options: {
        list: [
          { title: 'World War I', value: 'ww1' },
          { title: 'World War II', value: 'ww2' },
          { title: 'Korean War', value: 'korea' },
          { title: 'Vietnam War', value: 'vietnam' },
          { title: 'Cold War', value: 'cold-war' },
          { title: 'Modern / Post-9/11', value: 'modern' },
          { title: 'All Eras', value: 'all' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'all',
    }),

    defineField({
      name: 'active',
      title: 'Active (live in drill)',
      type: 'boolean',
      description: 'Uncheck to exclude this question without deleting it.',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Category A–Z',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
    {
      title: 'Difficulty',
      name: 'difficultyAsc',
      by: [{ field: 'difficulty', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      category: 'category',
      difficulty: 'difficulty',
      active: 'active',
      imageUrl: 'image.url',
    },
    prepare({ title, category, difficulty, active, imageUrl }) {
      const diffLabel: Record<string, string> = {
        recruit: 'R',
        sergeant: 'S',
        commander: 'C',
      }
      const catLabel: Record<string, string> = {
        aircraft: '✈',
        armor: '🎯',
        smallarms: '🔫',
        warship: '⚓',
        rank: '⭐',
        medal: '🎖',
        insignia: '🛡',
        artillery: '💥',
      }
      return {
        title: `${catLabel[category] ?? '?'} ${title}${active ? '' : ' ⛔'}`,
        subtitle: `${category} · ${diffLabel[difficulty] ?? difficulty}`,
        media: imageUrl as string | undefined,
      }
    },
  },
})
