// One-off (24 Nov 2026): the two "To be announced" Advisory Board places become Jane Tran (VASEA)
// and Claire Gorman (ABC). Names, roles and Vietnamese roles come from site/src/content/team.json.
// Run from /studio:  npx sanity exec scripts/advisory-2026-11f.mjs --with-user-token   (add `-- --dry` to preview)
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'

const DRY = process.argv.includes('--dry')
const client = getCliClient({apiVersion: '2025-01-01'})
const team = JSON.parse(readFileSync(new URL('../../site/src/content/team.json', import.meta.url), 'utf8'))
const wanted = team.members.filter((m) => ['Jane Tran', 'Claire Gorman'].includes(m.name))

const live = await client.fetch('*[_id == "team"][0].members[]{_key, name, group}')
if (live.some((m) => wanted.some((w) => w.name === m.name))) throw new Error('Already added')
const slots = live.filter((m) => m.group === 'advisory' && m.name === 'To be announced')
if (slots.length < wanted.length) throw new Error(`Only ${slots.length} empty advisory places`)

const tx = client.transaction()
wanted.forEach((w, i) => {
  const key = slots[i]._key
  console.log(DRY ? 'would set' : 'set', key, '->', w.name, '|', w.role)
  tx.patch('team', (p) =>
    p.set({
      [`members[_key=="${key}"].name`]: w.name,
      [`members[_key=="${key}"].role`]: w.role,
      [`members[_key=="${key}"].roleVi`]: w.roleVi,
    }).unset([`members[_key=="${key}"].nameVi`]),
  )
})
if (!DRY) console.log('committed', (await tx.commit()).transactionId)
