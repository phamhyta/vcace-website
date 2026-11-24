// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages not meant for search engines (internal or still in draft review)
const hidden = ['/style-guide/', '/thanks/'];

export default defineConfig({
  // The live address: canonical links, social previews (og:image) and the sitemap are built from it.
  site: process.env.SITE_URL || 'https://www.vcace.org',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !hidden.some((p) => page.endsWith(p)) })],
});
