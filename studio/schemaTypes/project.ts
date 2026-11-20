import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'published', title: 'Show on the website', type: 'boolean', initialValue: false,
      description: 'Only switch on when the details shown are approved.'}),
    defineField({name: 'featured', title: 'Featured (shown as the First Project)', type: 'boolean', initialValue: false,
      description: 'Only one project should be featured. Others appear under "What we are exploring".'}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 10}),
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'shortTitle', title: 'Short title (for links)', type: 'string'}),
    defineField({name: 'summary', title: 'One-line format', type: 'string', description: 'e.g. exhibition + dialogue + performance'}),
    defineField({name: 'status', type: 'string', options: {list: ['Confirmed', 'In development', 'Proposed', 'Concept', 'Potential project']}}),
    defineField({name: 'period', title: 'Timing (approximate)', type: 'string', description: 'e.g. 2027 or Jul–Oct 2027'}),
    defineField({name: 'date', title: 'Exact date (only when confirmed)', type: 'string', description: 'e.g. 14–28 March 2027. Replaces Timing on the site.'}),
    defineField({name: 'lead', title: 'Lead sentence', type: 'text', rows: 2}),
    defineField({name: 'description', type: 'text', rows: 5}),
    defineField({name: 'note', title: 'Status note', type: 'text', rows: 2}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imageAlt', title: 'Image description (alt text)', type: 'string'}),
    defineField({name: 'imageCredit', title: 'Image credit', type: 'string', description: 'Kept on record for licensing; not printed on the image'}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', status: 'status', pub: 'published', feat: 'featured'},
    prepare: ({title, status, pub, feat}) => ({title, subtitle: [status, feat && 'featured', pub ? 'on site' : 'hidden'].filter(Boolean).join(' · ')}),
  },
})
