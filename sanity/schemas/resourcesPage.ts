import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Research Resources',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Primary source archives, official photograph collections, and research repositories used in compiling Library of War. All sources are publicly accessible.',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'text',
      rows: 3,
      initialValue: 'Library of War does not endorse any specific viewpoint represented in external archives. All linked repositories are official institutional or government sources. Content availability may change over time as archives update their digital collections.',
    }),

    // ─── Sections ──────────────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Resource Sections',
      description: 'Each section has a heading and a grid of resource links. Drag to reorder.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'resourceSection',
        fields: [
          defineField({
            name: 'title',
            title: 'Section Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'items',
            title: 'Resources',
            type: 'array',
            of: [{
              type: 'object',
              name: 'resourceItem',
              fields: [
                defineField({ name: 'name',        title: 'Name',        type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'url',         title: 'URL',         type: 'url',    validation: (Rule) => Rule.required() }),
                defineField({ name: 'description', title: 'Description', type: 'text',   rows: 3, validation: (Rule) => Rule.required() }),
              ],
              preview: { select: { title: 'name', subtitle: 'url' } },
            }],
          }),
        ],
        preview: {
          select: { title: 'title', items: 'items' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prepare(value: any) {
            return { title: value.title, subtitle: `${value.items?.length ?? 0} resource${value.items?.length === 1 ? '' : 's'}` }
          },
        },
      }],
      // Pre-populated with current hardcoded resources — edit freely in Studio
      initialValue: [
        {
          title: 'Primary Archives',
          items: [
            { name: 'National Archives (USA)', url: 'https://www.archives.gov', description: 'The official repository of U.S. government records. Military records, unit histories, declassified intelligence documents, and official photographs dating to the Revolutionary War.' },
            { name: 'Library of Congress', url: 'https://www.loc.gov', description: 'The largest library in the world. Holds millions of photographs, maps, manuscripts, and periodicals covering every major conflict in American history.' },
            { name: 'Imperial War Museums', url: 'https://www.iwm.org.uk', description: "The UK's primary repository for war records. First-hand accounts, photography, film, and official documents spanning WWI through modern conflicts." },
            { name: 'Bundesarchiv (German Federal Archives)', url: 'https://www.bundesarchiv.de', description: 'German state archives holding military records from the Imperial period through the Second World War, including Wehrmacht documentation and Luftwaffe records.' },
            { name: 'National Security Archive', url: 'https://nsarchive.gwu.edu', description: 'Declassified U.S. government documents obtained through FOIA requests. Essential for Cold War intelligence, nuclear policy, and covert operations research.' },
            { name: 'Avalon Project (Yale Law School)', url: 'https://avalon.law.yale.edu', description: 'Primary source documents in law, history, and diplomacy. Includes treaties, war crimes tribunal records, and key diplomatic correspondence from multiple eras.' },
          ],
        },
        {
          title: 'Photography Collections',
          items: [
            { name: 'NARA Still Pictures', url: 'https://www.archives.gov/research/military/pictures', description: 'Millions of public domain military photographs from U.S. National Archives. Covers both World Wars, Korea, Vietnam, and beyond.' },
            { name: 'Wikimedia Commons — Military', url: 'https://commons.wikimedia.org/wiki/Category:Military_history', description: 'Aggregated public domain and open-license military photography, maps, and illustrations from archives around the world.' },
            { name: 'Signal Corps Photo Archive', url: 'https://www.archives.gov/research/military/ww2/photos', description: 'The U.S. Army Signal Corps documented WWII more comprehensively than any prior conflict. Hundreds of thousands of images, all public domain.' },
          ],
        },
        {
          title: 'Research Repositories',
          items: [
            { name: 'Combined Arms Research Library', url: 'https://cgsc.contentdm.oclc.org', description: 'The research library of the U.S. Army Command and General Staff College. Extensive collection of military doctrine, unit histories, and strategic studies.' },
            { name: 'HyperWar Foundation', url: 'https://www.ibiblio.org/hyperwar', description: 'Digitized WWII-era official histories, unit records, and government publications. One of the most comprehensive online archives of the Second World War.' },
            { name: 'RAND Corporation — Historical Research', url: 'https://www.rand.org/pubs/historical.html', description: 'Declassified RAND research reports spanning Cold War strategy, Vietnam-era analysis, and nuclear doctrine. Free access to older publications.' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'Resources Page' } },
  },
})
