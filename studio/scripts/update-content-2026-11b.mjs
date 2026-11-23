// One-off (late Nov 2026): second round of feedback plus the Vietnamese site.
// - home: new hero intro, key figures band, strategic partner heading, project button, footer line
// - team: Project Coordinator roles, Advisory Board changes, Mai Galleria (strategic) and TapTu,
//         Vietnamese name/role/bio for each person
// - projects: CHẠM note, Jazz Music Exchange text, Vietnamese fields
// - new documents: home-vi, privacy-vi, terms-vi, accessibility-vi
// Every image already in Sanity is kept; the two new partner logos and the Vision background are uploaded.
// Run from /studio:  npx sanity exec scripts/update-content-2026-11b.mjs --with-user-token
// Add `-- --dry` to print a summary without writing anything.
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

async function upload(path, filename, creditLine) {
  if (DRY) return `dry-upload:${filename}`
  const body = path.startsWith('http') ? Buffer.from(await (await fetch(path)).arrayBuffer()) : readFileSync(new URL(`public${path}`, site))
  const asset = await client.assets.upload('image', body, {filename, ...(creditLine ? {creditLine} : {})})
  console.log('uploaded', filename, asset._id)
  return asset._id
}

const live = await client.fetch(`{
  "home": *[_id == "home"][0], "team": *[_id == "team"][0],
  "pages": *[_type == "page" && !(_id in path("drafts.**"))]{_id, draft, updated}
}`)

// ---------- home (English) ----------
const h = read('home')
const home = {_id: 'home', _type: 'home', ...clean(h)}
home.hero.image = live.home.hero.image
home.vision.image = ref(await upload(h.vision.image, 'vcace-vision-hoi-an-lanterns.jpg', 'Steven Wilcox / Unsplash'))
home.programs.items = h.programs.items.map((item) => {
  const old = live.home.programs.items.find((x) => x.title === item.title)
  if (!old?.image) throw new Error(`No live image for program "${item.title}"`)
  return {...clean(item), _key: old._key, image: old.image}
})

// ---------- team ----------
const t = read('team')
const team = {
  _id: 'team',
  _type: 'team',
  members: clean(t.members),
  partners: await Promise.all(
    t.partners.map(async (p) => {
      const out = {_key: key(), ...clean(p)}
      const old = live.team.partners?.find((x) => x.name === p.name || (p.name === 'TapTu' && x.name === 'Tu Tap'))
      if (old?.logo) out.logo = old.logo
      else if (p.logo) out.logo = ref(await upload(p.logo, `partner-${p.logo.split('/').pop()}`))
      return out
    }),
  ),
}

const tx = client.transaction().createOrReplace(home).createOrReplace(team)

// ---------- projects ----------
const ids = {'CHẠM': 'project-inaugural-cultural-encounters', 'Jazz Music Exchange': 'project-music-creative-collaboration'}
for (const p of read('projects').projects) {
  const id = ids[p.shortTitle]
  if (id) tx.patch(id, (x) => x.set(clean(p)))
}

// ---------- Vietnamese ----------
tx.createOrReplace({_id: 'home-vi', _type: 'home', ...clean(read('vi/home'))})
for (const p of read('vi/pages').pages) {
  const en = live.pages.find((x) => x._id === p.id)
  const {id, ...rest} = p
  tx.createOrReplace({_id: `${id}-vi`, _type: 'page', draft: en?.draft ?? true, ...(en?.updated ? {updated: en.updated} : {}), ...clean(rest)})
}

if (DRY) {
  console.log(JSON.stringify({
    members: team.members.map((m) => `${m.name} | ${m.role} | ${m.nameVi ?? ''} | ${m.roleVi ?? ''}`),
    partners: team.partners.map((p) => `${p.name} ${p.strategic ? '(strategic)' : ''} logo:${p.logo?.asset?._ref ?? 'none'} ${p.published ? '' : '(hidden)'}`),
    stats: home.stats, mutations: tx.serialize().length,
  }, null, 2))
} else {
  const res = await tx.commit()
  console.log('committed', res.transactionId, res.results.map((r) => r.id).join(', '))
  const drafts = await client.fetch('*[_id in path("drafts.**")]._id')
  if (drafts.length) console.log('open drafts in the Studio (not touched):', drafts.join(', '))
}
