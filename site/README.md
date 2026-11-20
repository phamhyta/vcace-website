# VCACE website (Astro + Sanity)

See ../HANDOVER.md for the full handover and launch checklist.

Editors log in to Sanity Studio with email/password or Google. No GitHub account needed.

```bash
cd site   && npm install && npm run dev      # website, http://localhost:4321
cd studio && npm install && npm run dev      # editor, http://localhost:3333
```

## Without Sanity (default)
If `SANITY_PROJECT_ID` is empty, the site builds from `site/src/content/*.json`.

## Connect Sanity (one time)
1. In `studio/`: `npx sanity login`, then `npx sanity init --env` to create a project (or create one at sanity.io/manage). Use the **VCACE-owned** account.
2. Put the project ID in `site/.env` (`SANITY_PROJECT_ID`) and `studio/.env` (`SANITY_STUDIO_PROJECT_ID`).
3. Load the current copy: `cd site && node scripts/make-seed.mjs && cd ../studio && npx sanity dataset import ../site/seed.ndjson production --replace`
4. Publish the editor: `cd studio && npx sanity deploy` (gives a URL such as vcace.sanity.studio). Add editors in sanity.io/manage > Members.
5. In the CMS host (Cloudflare Pages / Netlify), set `SANITY_PROJECT_ID`, create a deploy hook, then in sanity.io/manage > API > Webhooks call that hook on publish. Edits then go live after a rebuild (~1 min).
6. In sanity.io/manage > API > CORS origins, add the studio URL and `http://localhost:3333`.

## Before launch
- Host must allow commercial use (Cloudflare Pages / Netlify; Vercel needs Pro).
- `site` in `astro.config.mjs` is set to `https://vcace.org.au` (sitemap, canonical, og:image).
- Connect the contact form (paste the endpoint in the CMS), add Privacy and Terms pages, replace placeholder art, enable 2FA for editors.
- Team members with Published off are not rendered. Advisory group is intentionally not built.
