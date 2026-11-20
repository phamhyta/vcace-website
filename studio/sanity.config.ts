import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Home and team are single documents; projects and stories are lists.
const singletons = [
  {id: 'home', title: 'Home page'},
  {id: 'team', title: 'People (team)'},
]
const pages = [
  {id: 'privacy', title: 'Privacy'},
  {id: 'terms', title: 'Terms of use'},
  {id: 'accessibility', title: 'Accessibility'},
]

export default defineConfig({
  name: 'vcace',
  title: 'VCACE website',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
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
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('story').title('Stories'),
            S.divider(),
            ...pages.map((p) =>
              S.listItem().title(p.title).id(p.id).child(S.document().schemaType('page').documentId(p.id)),
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
