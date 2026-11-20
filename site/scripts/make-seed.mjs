// Builds seed.ndjson from the JSON copy so the CMS starts with the current content.
// Then, from ../studio:  npx sanity dataset import ../site/seed.ndjson production --replace
import {readFileSync, writeFileSync} from 'node:fs';
const read = (f) => JSON.parse(readFileSync(`src/content/${f}.json`, 'utf8'));
const home = read('home');
const team = read('team');
const {projects} = read('projects');
const {stories} = read('stories');
const {pages} = read('pages');

const key = () => Math.random().toString(36).slice(2, 12);
const keyed = (arr) => arr.map((x) => ({_key: key(), ...x}));
// Image fields hold URLs in JSON; in Sanity they are uploaded in the Studio instead.
const noImage = ({image, ...rest}) => rest;
const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

home.hero = noImage(home.hero);
home.vision.values = keyed(home.vision.values);
home.programs.items = keyed(home.programs.items.map(noImage));

const docs = [
  {_id: 'home', _type: 'home', ...home},
  {_id: 'team', _type: 'team', members: keyed(team.members)},
  ...projects.map((p, i) => ({_id: `project-${slug(p.shortTitle || p.title)}`, _type: 'project', order: (i + 1) * 10, ...noImage(p)})),
  ...stories.map((s) => ({_id: `story-${slug(s.title)}`, _type: 'story', ...noImage(s)})),
  ...pages.map(({id, updated, sections, ...p}) => ({_id: id, _type: 'page', ...p, ...(updated ? {updated} : {}), sections: keyed(sections)})),
];
writeFileSync('seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote seed.ndjson (${docs.length} documents)`);
