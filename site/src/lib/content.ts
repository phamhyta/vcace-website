import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import homeDefaults from '../content/home.json';
import teamDefaults from '../content/team.json';
import projectDefaults from '../content/projects.json';
import storyDefaults from '../content/stories.json';
import homeVi from '../content/vi/home.json';
import type { Lang } from './i18n';

// Both sites show the same content (portraits, SEA Effect beside Mai Galleria as strategic partners).
// The official site (www.vcace.org, built on Vercel) also hides the Advisory Board and the other
// partners; vcace.netlify.app shows them. Preview the official version locally with VCACE_SITE=official.
export const OFFICIAL = process.env.VCACE_SITE === 'official' || (process.env.VERCEL === '1' && process.env.VCACE_SITE !== 'full');
const STRATEGIC = ['SEA Effect'];
// Vercel has no form handling, so the official site posts the contact form to Netlify Forms on the
// Netlify copy of the site (same "contact" form, same email notification).
export const FORMS_HOST = OFFICIAL ? process.env.VCACE_FORMS_HOST || 'https://vcace.netlify.app' : '';

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

// Vietnamese: a translation laid over the English. Any text left empty in the
// Vietnamese version (or any image) falls back to the English one, so nothing goes blank.
// Lists match by position (the 2nd Vietnamese program translates the 2nd English one).
function overlay(base: any, over: any): any {
  if (Array.isArray(base)) return base.map((b, i) => overlay(b, Array.isArray(over) ? over[i] : undefined));
  if (base && typeof base === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(base)) out[k] = overlay(base[k], over?.[k]);
    return out;
  }
  if (typeof base === 'string') return typeof over === 'string' && over.trim() ? over : base;
  return base;
}
const vi = (lang: Lang, v: string, en: string) => (lang === 'vi' && v ? v : en);

const storyShape: Story = {
  published: false, title: '', person: '', role: '', quote: '', body: [''], date: '', image: '', imageAlt: '', imageCredit: '',
};

export async function getContent(lang: Lang = 'en') {
  let home: Home = homeDefaults;
  let homeTranslation: unknown = homeVi;
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
      "homeVi": *[_id == "home-vi"][0],
      "team": *[_id == "team"][0],
      "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(order asc),
      "stories": *[_type == "story" && !(_id in path("drafts.**"))] | order(date desc)
    }`);
    // Each part falls back to JSON only if it has never been created in Sanity.
    if (data.home) home = fill(homeDefaults, normalise(data.home, urlFor));
    if (data.homeVi) homeTranslation = fill(homeDefaults, normalise(data.homeVi, urlFor));
    if (data.team) {
      members = fill(teamDefaults.members, normalise(data.team.members ?? [], urlFor));
      partners = fill(teamDefaults.partners, normalise(data.team.partners ?? [], urlFor));
    }
    if (data.projects?.length) projects = fill(projectDefaults.projects, normalise(data.projects, urlFor));
    if (data.stories?.length) stories = fill([storyShape], normalise(data.stories, urlFor));
  }

  if (lang === 'vi') {
    home = overlay(home, homeTranslation);
    members = members.map((m) => ({ ...m, name: vi(lang, m.nameVi, m.name), role: vi(lang, m.roleVi, m.role), bio: vi(lang, m.bioVi, m.bio) }));
    projects = projects.map((p) => ({
      ...p,
      title: vi(lang, p.titleVi, p.title), period: vi(lang, p.periodVi, p.period), lead: vi(lang, p.leadVi, p.lead),
      description: vi(lang, p.descriptionVi, p.description), note: vi(lang, p.noteVi, p.note),
    }));
  }

  const people = members.filter((m) => m.published);
  const isStrategic = (p: Partner) => p.strategic || STRATEGIC.includes(p.name);
  return {
    home,
    executive: people.filter((m) => m.group !== 'advisory'),
    advisory: OFFICIAL ? [] : people.filter((m) => m.group === 'advisory'),
    strategic: partners.filter((p) => p.published && isStrategic(p)),
    partners: OFFICIAL ? [] : partners.filter((p) => p.published && !isStrategic(p)),
    projects: projects.filter((p) => p.published),
    story: stories.find((s) => s.published),
    source: projectId ? ('sanity' as const) : ('json' as const),
  };
}

// Policy pages (privacy, terms, accessibility)
import pageDefaults from '../content/pages.json';
import pagesVi from '../content/vi/pages.json';
export type Page = (typeof pageDefaults.pages)[number];

// Policy pages: "privacy" in English, "privacy-vi" for its Vietnamese translation.
export async function getPage(id: string, lang: Lang = 'en'): Promise<Page> {
  const fallback = pageDefaults.pages.find((p) => p.id === id)!;
  let page: Page = fallback;
  let translation: unknown = pagesVi.pages.find((p) => p.id === id);
  if (projectId) {
    const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, token: import.meta.env.SANITY_READ_TOKEN });
    const docs = await client.fetch(`{"en": *[_id == $id][0], "vi": *[_id == $vi][0]}`, { id, vi: `${id}-vi` });
    if (docs.en) page = { ...fill(fallback, docs.en), id };
    if (docs.vi) translation = fill(fallback, docs.vi);
  }
  return lang === 'vi' ? { ...overlay(page, translation), id } : page;
}

export const pageIds = pageDefaults.pages.map((p) => p.id);
