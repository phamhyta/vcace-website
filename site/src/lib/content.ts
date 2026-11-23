import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import homeDefaults from '../content/home.json';
import teamDefaults from '../content/team.json';
import projectDefaults from '../content/projects.json';
import storyDefaults from '../content/stories.json';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';

type Home = typeof homeDefaults;
type Member = (typeof teamDefaults.members)[number];
type Partner = (typeof teamDefaults.partners)[number];
type Project = (typeof projectDefaults.projects)[number];
export type Story = {
  published: boolean; title: string; person: string; role: string; quote: string;
  body: string[]; date: string; image: string; imageAlt: string; imageCredit: string;
};

// Sanity images become plain URL strings so templates stay the same.
function normalise(node: any, urlFor: (i: any) => string): any {
  if (Array.isArray(node)) return node.map((n) => normalise(n, urlFor));
  if (node && typeof node === 'object') {
    if (node._type === 'image') return node.asset ? urlFor(node) : '';
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('_')) out[k] = normalise(v, urlFor);
    return out;
  }
  return node;
}

// When a Sanity document exists it is the source of truth: a field an editor
// cleared (Sanity removes it) becomes empty, it does NOT fall back to the JSON copy.
// `shape` only supplies the type of each field (string, list, boolean, object).
function fill(shape: any, value: any): any {
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) return [];
    const item = shape[0];
    return item === undefined ? value : value.map((v) => fill(item, v));
  }
  if (shape && typeof shape === 'object') {
    const v = value && typeof value === 'object' ? value : {};
    const out: Record<string, any> = {};
    for (const k of Object.keys(shape)) out[k] = fill(shape[k], v[k]);
    return out;
  }
  if (typeof shape === 'boolean') return typeof value === 'boolean' ? value : false;
  return value ?? '';
}

const storyShape: Story = {
  published: false, title: '', person: '', role: '', quote: '', body: [''], date: '', image: '', imageAlt: '', imageCredit: '',
};

export async function getContent() {
  let home: Home = homeDefaults;
  let members: Member[] = teamDefaults.members;
  let partners: Partner[] = teamDefaults.partners;
  let projects: Project[] = projectDefaults.projects;
  let stories: Story[] = storyDefaults.stories as Story[];

  if (projectId) {
    const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, token: import.meta.env.SANITY_READ_TOKEN });
    const builder = imageUrlBuilder(client);
    const urlFor = (i: any) => builder.image(i).width(1800).auto('format').url();
    const data = await client.fetch(`{
      "home": *[_id == "home"][0],
      "team": *[_id == "team"][0],
      "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(order asc),
      "stories": *[_type == "story" && !(_id in path("drafts.**"))] | order(date desc)
    }`);
    // Each part falls back to JSON only if it has never been created in Sanity.
    if (data.home) home = fill(homeDefaults, normalise(data.home, urlFor));
    if (data.team) {
      members = fill(teamDefaults.members, normalise(data.team.members ?? [], urlFor));
      partners = fill(teamDefaults.partners, normalise(data.team.partners ?? [], urlFor));
    }
    if (data.projects?.length) projects = fill(projectDefaults.projects, normalise(data.projects, urlFor));
    if (data.stories?.length) stories = fill([storyShape], normalise(data.stories, urlFor));
  }

  const people = members.filter((m) => m.published);
  return {
    home,
    executive: people.filter((m) => m.group !== 'advisory'),
    advisory: people.filter((m) => m.group === 'advisory'),
    partners: partners.filter((p) => p.published),
    projects: projects.filter((p) => p.published),
    story: stories.find((s) => s.published),
    source: projectId ? ('sanity' as const) : ('json' as const),
  };
}

// Policy pages (privacy, terms, accessibility)
import pageDefaults from '../content/pages.json';
export type Page = (typeof pageDefaults.pages)[number];

export async function getPage(id: string): Promise<Page> {
  const fallback = pageDefaults.pages.find((p) => p.id === id)!;
  if (!projectId) return fallback;
  const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, token: import.meta.env.SANITY_READ_TOKEN });
  const doc = await client.fetch(`*[_id == $id][0]`, { id });
  return doc ? { ...fill(fallback, doc), id } : fallback;
}

export const pageIds = pageDefaults.pages.map((p) => p.id);
