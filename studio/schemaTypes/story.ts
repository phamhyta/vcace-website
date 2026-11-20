import {defineArrayMember, defineField, defineType} from 'sanity'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    defineField({name: 'published', title: 'Show on the website', type: 'boolean', initialValue: false,
      description: 'Only with written consent from the person featured and for any identifiable people in the photo.'}),
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'person', title: 'Person featured', type: 'string'}),
    defineField({name: 'role', title: 'Their role or practice', type: 'string'}),
    defineField({name: 'quote', title: 'Pull quote', type: 'text', rows: 2}),
    defineField({name: 'body', title: 'Paragraphs', type: 'array', of: [defineArrayMember({type: 'text', rows: 4})]}),
    defineField({name: 'date', type: 'date'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image description (alt text)', type: 'string'}),
    defineField({name: 'imageCredit', title: 'Image credit', type: 'string', description: 'Kept on record for licensing; not printed on the image'}),
  ],
  preview: {select: {title: 'title', subtitle: 'person'}},
})
