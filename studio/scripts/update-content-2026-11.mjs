// One-off (Nov 2026): bring the live Sanity content in line with site/src/content/*.json
// after the round of feedback (logo, hero, People & Partners, Upcoming Projects, footer).
// Images already in Sanity are kept; new ones are uploaded (Unsplash photos, partner logos).
// Run from /studio:  npx sanity exec scripts/update-content-2026-11.mjs --with-user-token
// Add `-- --dry` to print what would be written without changing anything.
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'

const DRY = process.argv.includes('--dry')
const client = getCliClient({apiVersion: '2025-01-01'})
const site = new URL('../../site/', import.meta.url)
const read = (f) => JSON.parse(readFileSync(new URL(`src/content/${f}.json`, site), 'utf8'))
const key = () => Math.random().toString(36).slice(2, 12)
const ref = (id) => ({_type: 'image', asset: {_type: 'reference', _ref: id}})

// JSON keeps image URLs; Sanity image fields are set separately below.
const IMAGE_FIELDS = new Set(['image', 'logo', 'photo'])
function clean(v) {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === 'object' ? {_key: key(), ...clean(x)} : x))
  if (v && typeof v === 'object') {
    const out = {}
    for (const [k, x] of Object.entries(v)) if (!IMAGE_FIELDS.has(k) && x !== '') out[k] = clean(x)
    return out
  }
  return v
}

async function upload(source, filename, creditLine) {
  if (DRY) return `dry-upload:${filename}`
  const body = source.startsWith('http')
    ? Buffer.from(await (await fetch(source)).arrayBuffer())
    : readFileSync(new URL(`public${source}`, site))
  const asset = await client.assets.upload('image', body, {filename, ...(creditLine ? {creditLine} : {})})
  console.log('uploaded', filename, asset._id)
  return asset._id
}
const creditName = (credit) => (credit.match(/Photo: (.+?) \//) || [])[1]

// ---------- home ----------
const liveHome = await client.getDocument('home')
const h = read('home')
const home = {_id: 'home', _type: 'home', ...clean(h)}

// Hero: same photo, cropped on the right so the man by the ladder is out of frame.
const right = 1 - 1980 / 2400
home.hero.image = {
  ...liveHome.hero.image,
  crop: {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right},
  hotspot: {_type: 'sanity.imageHotspot', x: (1 - right) / 2, y: 0.5, width: 1 - right, height: 1},
}

// Programs: keep each item's key and existing photo, upload the two new ones.
home.programs.items = await Promise.all(
  h.programs.items.map(async (item, i) => {
    const live = liveHome.programs.items.find((x) => x.title === item.title)
    const out = {...clean(item), _key: live?._key || key()}
    if (item.image.includes('images.unsplash.com')) {
      out.image = ref(await upload(item.image, `vcace-program-${i + 1}.jpg`, item.imageCredit))
    } else {
      out.image = live.image
    }
    return out
  }),
)

// ---------- team: members, advisory board and partners ----------
const t = read('team')
const team = {
  _id: 'team',
  _type: 'team',
  members: clean(t.members),
  partners: await Promise.all(
    t.partners.map(async (p) => {
      const out = {_key: key(), ...clean(p)}
      if (p.logo) out.logo = ref(await upload(p.logo, `partner-${p.logo.split('/').pop()}`))
      return out
    }),
  ),
}

// ---------- projects ----------
const {projects} = read('projects')
const ids = {
  'CHẠM': 'project-inaugural-cultural-encounters',
  'Jazz Music Exchange': 'project-music-creative-collaboration',
}
const tx = client.transaction().createOrReplace(home).createOrReplace(team)
for (const p of projects) {
  const id = ids[p.shortTitle]
  if (!id) continue
  const set = clean(p)
  if (p.image.includes('images.unsplash.com')) set.image = ref(await upload(p.image, `vcace-${id}.jpg`, p.imageCredit))
  tx.patch(id, (x) => x.set(set).unset(['featured']))
}
for (const id of await client.fetch('*[_type=="project" && defined(featured)]._id')) {
  if (!Object.values(ids).includes(id)) tx.patch(id, (x) => x.unset(['featured']))
}

// ---------- terms: governing law ----------
const terms = read('pages').pages.find((p) => p.id === 'terms')
const liveTerms = await client.getDocument('terms')
const law = liveTerms.sections.find((s) => s.heading === 'Governing law')
const newLaw = terms.sections.find((s) => s.heading === 'Governing law')
if (law && newLaw) tx.patch('terms', (x) => x.set({[`sections[_key=="${law._key}"].paragraphs`]: newLaw.paragraphs}))

if (DRY) {
  console.log(JSON.stringify({home, team, mutations: tx.serialize().length}, null, 2))
} else {
  const res = await tx.commit()
  console.log('committed', res.transactionId, res.results.map((r) => r.id).join(', '))
  const drafts = await client.fetch('*[_id in path("drafts.**")]._id')
  if (drafts.length) console.log('open drafts in the Studio (not touched):', drafts.join(', '))
}
console.log('photo credits:', home.programs.items.map((i) => creditName(i.imageCredit || '')).join(', '))
