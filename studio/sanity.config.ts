import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Home and team are single documents; news posts, projects and stories are lists.
const singletons = [
  {id: 'home', title: 'Home page'},
  {id: 'team', title: 'People (team)'},
]
const pages = [
  {id: 'privacy', title: 'Privacy'},
  {id: 'terms', title: 'Terms of use'},
  {id: 'accessibility', title: 'Accessibility'},
]
// Vietnamese site (/vi/): the home page and policy pages have their own Vietnamese copy.
// Fill in only the text; anything left empty (and every image) is taken from the English version.
// People and Projects have their Vietnamese fields inside each entry.
const vietnamese = [
  {id: 'home-vi', type: 'home', title: 'Trang chủ (Tiếng Việt)'},
  ...pages.map((p) => ({id: `${p.id}-vi`, type: 'page', title: `${p.title} (Tiếng Việt)`})),
]

export default defineConfig({
  name: 'vcace',
  title: 'VCACE website',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'hd1rue71',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website')
          .items([
            ...singletons.map((s) =>
              S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.id).documentId(s.id)),
            ),
            S.divider(),
            S.documentTypeListItem('post').title('News'),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('story').title('Stories'),
            S.divider(),
            ...pages.map((p) =>
              S.listItem().title(p.title).id(p.id).child(S.document().schemaType('page').documentId(p.id)),
            ),
            S.divider(),
            S.listItem()
              .title('Tiếng Việt (/vi/)')
              .id('vietnamese')
              .child(
                S.list()
                  .title('Tiếng Việt')
                  .items(vietnamese.map((v) => S.listItem().title(v.title).id(v.id).child(S.document().schemaType(v.type).documentId(v.id)))),
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => schemaType !== 'page' && !singletons.some((s) => s.id === schemaType)),
  },
  document: {
    actions: (prev, {schemaType}) =>
      (schemaType === 'page' || singletons.some((s) => s.id === schemaType))
        ? prev.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : prev,
  },
})
