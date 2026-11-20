// One-off: upload the concept photos (Unsplash License) and attach them with alt text and credits.
// Run: npx sanity exec scripts/upload-photos.mjs --with-user-token -- <folder with the jpgs>
import {getCliClient} from 'sanity/cli'
import {createReadStream} from 'node:fs'
import {join} from 'node:path'

const dir = process.argv[process.argv.length - 1]
const client = getCliClient({apiVersion: '2025-01-01'})
const credit = (name) => `Concept image · Photo: ${name} / Unsplash`

const photos = {
  hero: {name: 'Bernd Dittrich', alt: 'Two men hang long hand-printed woodcut scrolls in yellow, black, orange, white and green on the wall of a timber hall.'},
  experiences: {name: 'Bernd Dittrich', alt: 'Musicians in traditional dress play live beside the stage of a Vietnamese water puppet theatre.'},
  dialogues: {name: 'Antenna', alt: 'A woman speaks to a seated group during an informal talk in a gallery hung with bright geometric paintings.'},
  exchange: {name: 'Alisa Kreydina', alt: 'Two street artists in Hội An, one folding palm-leaf flowers and one painting calligraphy scrolls on a mat.'},
  education: {name: 'Monika Bienert', alt: 'Clay-covered hands shape a bowl on a spinning pottery wheel.'},
  project: {name: 'buian_photos', alt: 'A dimly lit exhibition hall with one long, brightly lit white wall of paintings and wall texts.'},
}

const assets = {}
for (const key of Object.keys(photos)) {
  const asset = await client.assets.upload('image', createReadStream(join(dir, `${key}.jpg`)), {
    filename: `vcace-${key}.jpg`,
    creditLine: credit(photos[key].name),
  })
  assets[key] = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
  console.log('uploaded', key, asset._id)
}

const home = await client.getDocument('home')
const keyOf = (title) => home.programs.items.find((i) => i.title === title)._key
const programs = {experiences: 'Cultural Experiences', dialogues: 'Cultural Dialogues', exchange: 'Cultural Exchange', education: 'Cultural Education'}

const set = {
  'hero.image': assets.hero,
  'hero.imageAlt': photos.hero.alt,
  'hero.imageCredit': credit(photos.hero.name),
  'footer.credits': 'Photographs are concept images from Unsplash, not from VCACE events',
}
for (const [k, title] of Object.entries(programs)) {
  const p = `programs.items[_key=="${keyOf(title)}"]`
  set[`${p}.image`] = assets[k]
  set[`${p}.imageAlt`] = photos[k].alt
  set[`${p}.imageCredit`] = credit(photos[k].name)
}

const project = await client.fetch('*[_type=="project" && featured && !(_id in path("drafts.**"))][0]._id')
await client
  .transaction()
  .patch('home', (p) => p.set(set))
  .patch(project, (p) => p.set({image: assets.project, imageAlt: photos.project.alt, imageCredit: credit(photos.project.name)}))
  .commit()

const drafts = await client.fetch('*[_id in ["drafts.home", "drafts." + $p]]._id', {p: project})
console.log('patched home and', project, drafts.length ? `(open drafts: ${drafts.join(', ')})` : '')
