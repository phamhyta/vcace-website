// One-off (24 Nov 2026): executive team portraits for the official site (www.vcace.org).
// Uploads each file in site/public/team/ to the matching team member's photo; every other field is left as is.
// The full site (vcace.netlify.app) does not show portraits, see OFFICIAL in site/src/lib/content.ts.
// Run from /studio:  npx sanity exec scripts/add-portraits-2026-11c.mjs --with-user-token   (add `-- --dry` to preview)
import {getCliClient} from 'sanity/cli'
import {readFileSync, existsSync} from 'node:fs'

const DRY = process.argv.includes('--dry')
const client = getCliClient({apiVersion: '2025-01-01'})
const PHOTOS = {'Mai Trinh': 'mai-trinh.jpg', 'Celine Dang': 'celine-dang.jpg'}

const team = await client.fetch('*[_id == "team"][0]{members[]{_key, name, photo}}')
const tx = client.transaction()
for (const [name, file] of Object.entries(PHOTOS)) {
  const path = new URL(`../../site/public/team/${file}`, import.meta.url)
  const member = team.members.find((m) => m.name === name)
  if (!member) throw new Error(`No team member called ${name}`)
  if (!existsSync(path)) { console.log('skip (no file yet):', name); continue }
  if (member.photo && !process.argv.includes('--replace')) { console.log('skip (already has a photo, add -- --replace to swap):', name); continue }
  if (DRY) { console.log('would set photo for', name, 'from', file); continue }
  const asset = await client.assets.upload('image', readFileSync(path), {filename: `vcace-${file}`})
  tx.patch('team', (p) => p.set({[`members[_key=="${member._key}"].photo`]: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}}))
  console.log('uploaded', name, asset._id)
}
if (!DRY) console.log('committed', (await tx.commit()).transactionId)
