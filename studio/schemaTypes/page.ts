import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Policy page',
  type: 'document',
  fields: [
    defineField({name: 'draft', title: 'Draft (shows a "draft" notice and hides it from search engines)', type: 'boolean', initialValue: true,
      description: 'Switch off only after the wording is approved (SEA Effect where relevant).'}),
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 2}),
    defineField({name: 'updated', title: 'Last updated', type: 'date'}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3}),
    defineField({
      name: 'sections', type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'heading', type: 'string'}),
          defineField({name: 'paragraphs', type: 'array', of: [defineArrayMember({type: 'text', rows: 4})]}),
        ],
        preview: {select: {title: 'heading'}},
      })],
    }),
  ],
})
