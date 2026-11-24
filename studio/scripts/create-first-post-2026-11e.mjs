// One-off (24 Nov 2026): the first News post, "A New Cultural Connection Between Australia and Vietnam".
// Text comes from site/src/content/posts.json; the feature image reuses the home page hero image already in Sanity.
// Run from /studio:  npx sanity exec scripts/create-first-post-2026-11e.mjs --with-user-token   (add `-- --dry` to preview)
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'

const DRY = process.argv.includes('--dry')
const client = getCliClient({apiVersion: '2025-01-01'})
const {posts} = JSON.parse(readFileSync(new URL('../../site/src/content/posts.json', import.meta.url), 'utf8'))
const p = posts[0]

const hero = await client.fetch('*[_id == "home"][0].hero{image, imageAlt, imageCredit}')
if (!hero?.image?.asset) throw new Error('No hero image on the home document')

const doc = {
  _id: 'post-a-new-cultural-connection',
  _type: 'post',
  published: p.published,
  title: p.title,
  slug: {_type: 'slug', current: p.slug},
  date: p.date,
  dek: p.dek,
  excerpt: p.excerpt,
  image: {_type: 'image', asset: hero.image.asset, ...(hero.image.crop ? {crop: hero.image.crop} : {}), ...(hero.image.hotspot ? {hotspot: hero.image.hotspot} : {})},
  imageAlt: hero.imageAlt,
  imageCredit: hero.imageCredit,
  body: p.body,
}

if (DRY) {
  console.log(JSON.stringify({...doc, body: `${doc.body.length} blocks`}, null, 2))
} else {
  const res = await client.createOrReplace(doc)
  console.log('saved', res._id, res._rev)
}
