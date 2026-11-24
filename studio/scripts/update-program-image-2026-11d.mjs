// One-off (24 Nov 2026): Cultural Experiences gets a live-music photo instead of the dancers
// (Martin Robles / Unsplash).
// Uploads the image named in site/src/content/home.json (programs.items[0]) and sets image, alt and credit
// on the English home document; the Vietnamese alt text goes on home-vi. Nothing else is touched.
// Run from /studio:  npx sanity exec scripts/update-program-image-2026-11d.mjs --with-user-token   (add `-- --dry` to preview)
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'

const DRY = process.argv.includes('--dry')
const client = getCliClient({apiVersion: '2025-01-01'})
const read = (f) => JSON.parse(readFileSync(new URL(`../../site/src/content/${f}.json`, import.meta.url), 'utf8'))
const TITLE = 'Cultural Experiences'

const items = read('home').programs.items
const en = items.find((x) => x.title === TITLE)
const viAlt = read('vi/home').programs.items[items.indexOf(en)]?.imageAlt
const live = await client.fetch('{"en": *[_id == "home"][0].programs.items[]{_key, title}, "vi": *[_id == "home-vi"][0].programs.items[]{_key}}')
const idx = live.en.findIndex((x) => x.title === TITLE)
if (idx < 0) throw new Error(`No live program called ${TITLE}`)
const key = live.en[idx]._key
const viKey = live.vi?.[idx]?._key

console.log(DRY ? 'would set' : 'set', TITLE, '->', en.image.split('?')[0])
console.log('  alt:', en.imageAlt, '\n  credit:', en.imageCredit, '\n  vi alt:', viAlt, viKey ? '' : '(no home-vi item)')
if (DRY) process.exit(0)

const body = en.image.startsWith('http')
  ? Buffer.from(await (await fetch(en.image)).arrayBuffer())
  : readFileSync(new URL(`../../site/public${en.image}`, import.meta.url))
const asset = await client.assets.upload('image', body, {filename: 'vcace-program-cultural-experiences.jpg', creditLine: 'Martin Robles / Unsplash'})
const tx = client.transaction().patch('home', (p) =>
  p.set({
    [`programs.items[_key=="${key}"].image`]: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
    [`programs.items[_key=="${key}"].imageAlt`]: en.imageAlt,
    [`programs.items[_key=="${key}"].imageCredit`]: en.imageCredit,
  }),
)
if (viKey && viAlt) tx.patch('home-vi', (p) => p.set({[`programs.items[_key=="${viKey}"].imageAlt`]: viAlt}))
console.log('uploaded', asset._id, 'committed', (await tx.commit()).transactionId)
