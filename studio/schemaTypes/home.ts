import {defineArrayMember, defineField, defineType} from 'sanity'

const str = (name: string, title?: string) => defineField({name, title, type: 'string'})
const txt = (name: string, title?: string) => defineField({name, title, type: 'text', rows: 3})
const img = (name = 'image') => defineField({name, title: 'Image', type: 'image', options: {hotspot: true}})
const alt = () => defineField({name: 'imageAlt', title: 'Image description (alt text)', type: 'string'})
const credit = () => defineField({name: 'imageCredit', title: 'Image credit', type: 'string', description: 'Kept on record for licensing; not printed on the image'})
const textList = (name: string, title: string) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'text', rows: 3})]})

export const home = defineType({
  name: 'home',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'seo', title: 'Search and sharing'},
    {name: 'hero', title: 'Hero'},
    {name: 'vision', title: 'Our Vision'},
    {name: 'programs', title: 'Programs'},
    {name: 'project', title: 'Projects'},
    {name: 'people', title: 'People'},
    {name: 'collaborate', title: 'Collaborate'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({name: 'meta', type: 'object', group: 'seo', fields: [str('title', 'Page title'), txt('description', 'Meta description'), str('shareTitle', 'Social share title')]}),
    defineField({
      name: 'hero', type: 'object', group: 'hero',
      fields: [str('eyebrow'), str('headline', 'Headline, first line'), str('headlineAccent', 'Headline, second line (shown in yellow)'), str('subheadline'), txt('intro', 'Introduction'), str('primaryButton'), str('secondaryButton'), img(), alt(), credit()],
    }),
    defineField({
      name: 'vision', type: 'object', group: 'vision',
      fields: [
        str('headline'),
        textList('paragraphs', 'Paragraphs'),
        defineField({name: 'values', type: 'array', of: [defineArrayMember({type: 'object', fields: [str('title'), txt('text', 'Sentence')], preview: {select: {title: 'title'}}})]}),
      ],
    }),
    defineField({
      name: 'programs', type: 'object', group: 'programs',
      fields: [
        str('headline'), str('intro', 'Introduction'),
        defineField({
          name: 'items', title: 'Program panels', type: 'array',
          of: [defineArrayMember({type: 'object', fields: [str('title'), txt('text', 'Short copy'), txt('examples', 'Example formats'), str('linkText'), str('link', 'Link (anchor or page)'), img(), alt(), credit()], preview: {select: {title: 'title'}}})],
        }),
      ],
    }),
    defineField({name: 'projects', title: 'Upcoming Projects section', type: 'object', group: 'project', description: 'Lists every published project, in the order set under Projects.', fields: [str('headline'), str('buttonText', 'Button under the first project')]}),
    defineField({name: 'story', title: 'Story section', type: 'object', group: 'people', description: 'Shows the newest published story.', fields: [str('headline', 'Section label')]}),
    defineField({name: 'people', title: 'People & Partners', type: 'object', group: 'people', fields: [str('headline'), str('executiveHeadline', 'Executive team heading'), str('advisoryHeadline', 'Advisory board heading'), str('partnersHeadline', 'Partners heading'), txt('partnersIntro', 'Partners introduction')]}),
    defineField({
      name: 'collaborate', type: 'object', group: 'collaborate',
      fields: [
        str('headline'), textList('paragraphs', 'Paragraphs'),
        defineField({name: 'groups', title: 'Who can get involved', type: 'array', of: [defineArrayMember({type: 'object', fields: [str('title'), txt('text', 'Text')], preview: {select: {title: 'title'}}})]}),
        defineField({name: 'topics', title: 'Enquiry topics', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        str('buttonText'),
        str('formEndpoint', 'External form endpoint (leave empty to use Netlify Forms)'),
      ],
    }),
    defineField({name: 'footer', type: 'object', group: 'footer', fields: [str('legalHostLine', 'Legal host line (publish only after approval)'), defineField({name: 'legalHostUrl', title: 'Legal host link', type: 'url'}), str('acknowledgementHeading', 'Acknowledgement heading'), txt('acknowledgement', 'Acknowledgement of Country'), str('credits')]}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
