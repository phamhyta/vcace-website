// News posts: from Sanity (type "post") when SANITY_PROJECT_ID is set, otherwise from content/posts.json.
// The body is Portable Text; toHtml() below renders the few styles the Studio allows.
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import postDefaults from '../content/posts.json';
import type { Lang } from './i18n';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';

type Span = { _type: 'span'; text: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
export type Block = { _type: 'block'; _key?: string; style?: string; listItem?: string; children: Span[]; markDefs?: MarkDef[] };
export type Post = {
  title: string; slug: string; date: string; dek: string; excerpt: string;
  image: string; imageAlt: string; imageCredit: string; body: Block[];
  /** False on /vi/ when the post has no Vietnamese text yet and shows the English version. */
  translated: boolean;
};

const cache = new Map<Lang, Promise<Post[]>>();

/** Published posts, newest first. Vietnamese fields fall back to English when empty. */
export function getPosts(lang: Lang = 'en'): Promise<Post[]> {
  if (!cache.has(lang)) cache.set(lang, load(lang));
  return cache.get(lang)!;
}

async function load(lang: Lang): Promise<Post[]> {
  let raw: any[] = postDefaults.posts;
  let urlFor = (i: any) => (typeof i === 'string' ? i : '');
  if (projectId) {
    const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, token: import.meta.env.SANITY_READ_TOKEN });
    const builder = imageUrlBuilder(client);
    urlFor = (i: any) => (i?.asset ? builder.image(i).width(1800).auto('format').url() : '');
    raw = await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc){..., "slug": slug.current}`);
  }
  const vi = (v: any, en: any) => (lang === 'vi' && (Array.isArray(v) ? v.length : v) ? v : en);
  return raw
    .filter((p) => p.published && p.slug && p.title)
    .map((p) => ({
      title: vi(p.titleVi, p.title),
      slug: p.slug,
      date: p.date ?? '',
      dek: vi(p.dekVi, p.dek ?? ''),
      excerpt: vi(p.excerptVi, p.excerpt ?? ''),
      image: urlFor(p.image),
      imageAlt: p.imageAlt ?? '',
      imageCredit: p.imageCredit ?? '',
      body: vi(p.bodyVi, p.body ?? []),
      translated: lang === 'en' || (p.bodyVi?.length ?? 0) > 0,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function spans(b: Block) {
  const defs = new Map((b.markDefs ?? []).map((d) => [d._key, d]));
  return b.children
    .map((s) => {
      let html = esc(s.text).replace(/\n/g, '<br>');
      for (const m of s.marks ?? []) {
        if (m === 'em' || m === 'strong') html = `<${m}>${html}</${m}>`;
        else if (defs.get(m)?._type === 'link' && defs.get(m)!.href) {
          const href = defs.get(m)!.href!;
          const ext = /^https?:/.test(href);
          html = `<a href="${esc(href)}"${ext ? ' rel="noopener"' : ''}>${html}</a>`;
        }
      }
      return html;
    })
    .join('');
}

/** Portable Text to HTML: paragraphs, h2 headings, highlight lines (blockquote) and bullet lists. */
export function toHtml(blocks: Block[], homePath = '/'): string {
  let out = '';
  let inList = false;
  for (const b of blocks.filter((x) => x._type === 'block')) {
    // Site links like "/#collaborate" point at the matching language's home page.
    const html = spans(b).replace(/href="\/#/g, `href="${homePath}#`);
    if (b.listItem === 'bullet') {
      if (!inList) out += '<ul>';
      inList = true;
      out += `<li>${html}</li>`;
      continue;
    }
    if (inList) out += '</ul>';
    inList = false;
    if (b.style === 'h2') out += `<h2>${html}</h2>`;
    else if (b.style === 'blockquote') out += `<p class="highlight">${html}</p>`;
    else out += `<p>${html}</p>`;
  }
  return inList ? out + '</ul>' : out;
}
