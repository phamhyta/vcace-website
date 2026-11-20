// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages not meant for search engines (internal or still in draft review)
const hidden = ['/style-guide/'];

export default defineConfig({
  site: 'https://vcace.org.au',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !hidden.some((p) => page.endsWith(p)) })],
});
