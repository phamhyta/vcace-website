import {defineArrayMember, defineField, defineType} from 'sanity'

export const team = defineType({
  name: 'team',
  title: 'People & Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'members',
      title: 'Team members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'published', title: "Published (only with the person's consent)", type: 'boolean', initialValue: false}),
            defineField({name: 'group', title: 'Group', type: 'string', initialValue: 'executive', options: {list: [{title: 'Executive Team', value: 'executive'}, {title: 'Advisory Board', value: 'advisory'}], layout: 'radio'}}),
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'role', type: 'string'}),
            defineField({name: 'bio', title: 'Biography', type: 'text', rows: 3}),
            defineField({name: 'photo', title: 'Photo (optional, only an approved portrait)', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'name', subtitle: 'role', group: 'group', pub: 'published'}, prepare: ({title, subtitle, group, pub}) => ({title, subtitle: `${group === 'advisory' ? 'Advisory' : 'Executive'} · ${subtitle ?? ''} ${pub ? '(published)' : '(hidden)'}`})},
        }),
      ],
    }),
    defineField({
      name: 'partners',
      title: 'Partners & Supporters',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'published', title: 'Published (only with the organisation’s agreement)', type: 'boolean', initialValue: false}),
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', title: 'Website', type: 'url'}),
            defineField({name: 'logo', title: 'Logo (optional; the name is shown until there is one)', type: 'image'}),
            defineField({name: 'showName', title: 'Show the name next to the logo (for icon-only logos)', type: 'boolean', initialValue: false}),
          ],
          preview: {select: {title: 'name', pub: 'published', media: 'logo'}, prepare: ({title, pub, media}) => ({title, subtitle: pub ? '(published)' : '(hidden)', media})},
        }),
      ],
    }),
  ],
})
