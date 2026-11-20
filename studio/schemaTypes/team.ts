import {defineArrayMember, defineField, defineType} from 'sanity'

export const team = defineType({
  name: 'team',
  title: 'People (team)',
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
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'role', type: 'string'}),
            defineField({name: 'bio', title: 'Biography', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'name', subtitle: 'role', pub: 'published'}, prepare: ({title, subtitle, pub}) => ({title, subtitle: `${subtitle ?? ''} ${pub ? '(published)' : '(hidden)'}`})},
        }),
      ],
    }),
  ],
})
