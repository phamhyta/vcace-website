import {defineArrayMember, defineField, defineType} from 'sanity'

// News posts: /news/ lists them newest first, each one has its own page at /news/<slug>/.
// The Vietnamese fields are optional; anything left empty shows the English text on /vi/news/.
const body = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          {title: 'Paragraph', value: 'normal'},
          {title: 'Heading', value: 'h2'},
          {title: 'Highlight line', value: 'blockquote'},
        ],
        lists: [{title: 'Bullets', value: 'bullet'}],
        marks: {
          decorators: [
            {title: 'Bold', value: 'strong'},
            {title: 'Italic', value: 'em'},
          ],
          annotations: [
            defineArrayMember({
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [defineField({name: 'href', title: 'URL or page link (e.g. /#collaborate)', type: 'string'})],
            }),
          ],
        },
      }),
    ],
  })

export const post = defineType({
  name: 'post',
  title: 'News post',
  type: 'document',
  groups: [
    {name: 'en', title: 'English', default: true},
    {name: 'vi', title: 'Tiếng Việt'},
  ],
  fields: [
    defineField({name: 'published', title: 'Show on the website', type: 'boolean', initialValue: false, group: 'en'}),
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'en'}),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
      description: 'The end of the link: vcace.org/news/<this>/',
      group: 'en',
    }),
    defineField({name: 'date', type: 'date', validation: (r) => r.required(), group: 'en'}),
    defineField({name: 'dek', title: 'Subtitle', type: 'string', group: 'en'}),
    defineField({name: 'excerpt', title: 'Summary for the news list and search engines', type: 'text', rows: 3, group: 'en'}),
    defineField({name: 'image', title: 'Image (optional)', type: 'image', options: {hotspot: true}, group: 'en'}),
    defineField({name: 'imageAlt', title: 'Image description (alt text)', type: 'string', group: 'en'}),
    defineField({name: 'imageCredit', title: 'Image credit', type: 'string', group: 'en'}),
    body('body', 'Text'),
    defineField({name: 'titleVi', title: 'Tiêu đề', type: 'string', group: 'vi'}),
    defineField({name: 'dekVi', title: 'Phụ đề', type: 'string', group: 'vi'}),
    defineField({name: 'excerptVi', title: 'Tóm tắt', type: 'text', rows: 3, group: 'vi'}),
    {...body('bodyVi', 'Nội dung'), group: 'vi'},
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', published: 'published'},
    prepare: ({title, subtitle, published}) => ({title, subtitle: `${subtitle ?? ''}${published ? '' : ' · hidden'}`})},
})
