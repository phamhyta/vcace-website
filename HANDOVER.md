# VCACE website: handover and launch checklist

Status as of 20 November 2026.

**Live:** https://vcace.netlify.app (temporary address) · **Editor:** https://vcace.sanity.studio · **Code:** github.com/phamhyta/vcace-website (private; `ducnd-dev` has write access)
 Items marked ☐ need an account, an approval or real content from VCACE.

## What is in this folder

| Folder | What it is |
|---|---|
| `site/` | The website (Astro). Builds to static files in `site/dist/`. |
| `studio/` | The editing tool (Sanity Studio). Editors sign in with email or Google. |
| `brand/` | Logo kit (SVG + PNG), social share image, and the script that makes them. |
| `index.html` | First single-file prototype. Reference only, not used by the site. |

Pages: home (one-page, five anchors), `/privacy`, `/terms`, `/accessibility`, `/style-guide` (hidden from search), 404.

## Editing content (for VCACE staff)

1. Open the Studio at https://vcace.sanity.studio and sign in, always with the same method (the project owner uses GitHub).
2. **Home page**: hero, vision and values, the four programs, section headings, contact form topics, footer.
3. **People (team)**: each person has *Published*. Switch it on only with that person's written consent to their name, title and bio.
4. **Projects**: one project marked *Featured* appears as the First Project. Other published projects appear under “What we are exploring”. Use *Exact date* only when the date is confirmed; until then use *Timing*.
5. **Stories**: the newest published story appears on the home page. Needs written consent from the person featured and from identifiable people in photos.
6. **Privacy / Terms / Accessibility**: switch off *Draft* only after the wording is approved.
7. Upload images inside any image field. Always fill in *alt text* and *credit*.
8. Press **Publish**. The site rebuilds and the change is live in about a minute.

### One-hour training outline
- 10 min: tour of the Studio, publishing and drafts
- 15 min: change hero text and a program image, add alt text and credit
- 15 min: add a project, keep it hidden, then feature it
- 10 min: team consent rules, policy pages, the legal host line
- 10 min: questions; who to contact for problems

## Backups
- Content: `cd studio && npx sanity dataset export production backup-YYYY-MM-DD.tar.gz` (includes images). Do this monthly and before big changes. Sanity also keeps document history.
- Code: the Git repository is the backup. Keep it owned by the VCACE/legal-host GitHub organisation.

## Ownership (brief §10, §12, §13)
Create every account under the agreed legal owner, then invite the developer as a member. Nothing needs transferring later.
- ☐ Domain registrar (vcace.org.au): owner keeps login
- ✅ GitHub repository `ducnd-dev/vcace-website` (private). ☐ Transfer to a VCACE-owned GitHub organisation when it exists
- ✅ Sanity project `hd1rue71`, Studio at https://vcace.sanity.studio. ☐ Move it into a VCACE-owned organisation if needed; owner as Administrator, editors as Editor. Project is on a Growth Trial: switch to Free before it ends
- ✅ Netlify project `vcace`, deploys from `main`; build hook "Sanity publish" is called by the Sanity webhook "Rebuild website (Netlify)". "Powered by Netlify" badge switched off (Project configuration → General). ☐ Transfer to a VCACE-owned Netlify team; ☐ add the custom domain vcace.org.au (Domain management) and point DNS
- ☐ Form service and contact inbox
- ☐ 2FA switched on for all of the above

### Transfer to the new owner `phamhyta` (started 20 November 2026)

| Service | Status | What the new owner does |
|---|---|---|
| Sanity | ✅ phamhyta@gmail.com is **Administrator** of project `hd1rue71` | Sign in at https://vcace.sanity.studio. The account was added with **Google** login; Sanity treats Google and GitHub logins as different users, so always use Google, or invite your GitHub login from Members and use that from then on. Switch the plan to Free before the trial ends (Plan). |
| GitHub | ✅ Transferred to `phamhyta/vcace-website` (20 Nov 2026); `ducnd-dev` kept as collaborator | Accept it from the GitHub email (or github.com/notifications) within 1 day. Then, if the developer still maintains the site: repo **Settings → Collaborators → Add people → `ducnd-dev`** |
| Netlify | ☐ Rebuild in the new owner's account (Free-plan teams have one member, so the project cannot be moved in-app) | Steps below |

**Netlify, after the GitHub transfer is accepted** (all build settings are in `netlify.toml`, nothing to type):
1. Sign up / log in at https://app.netlify.com **with GitHub** as `phamhyta`.
2. **Add new project → Import an existing project → GitHub →** allow Netlify on the `phamhyta` account → choose `vcace-website` → **Deploy**.
3. **Forms → Enable form detection**, then **Trigger deploy → Clear cache and deploy** once.
4. **Project configuration → General → Powered by Netlify badge →** untick → Save.
5. **Project configuration → Build & deploy → Build hooks → Add build hook** named `Sanity publish`, branch `main`. Copy the URL.
6. In Sanity (https://www.sanity.io/manage/project/hd1rue71 → **API → Webhooks → Rebuild website (Netlify)**), paste the new build hook URL and save.
7. Tell the developer: they delete or rename the old project so the address **vcace.netlify.app** becomes free, then in the new project **Domain management → Options → Edit project name → `vcace`**.
8. Test: change one word in the Studio and Publish; the site should update in about a minute. Send one test enquiry and check **Forms → contact**. Add the VCACE inbox under **Forms → Form notifications**.

Until step 7 the old site at vcace.netlify.app stays online; once the GitHub transfer is accepted it can no longer rebuild, so do steps 1–7 the same day.

## Acceptance checklist (brief §12)

| Item | Status |
|---|---|
| Vision and four program pillars, no false claims of partners or advisers | ✅ Built. Advisory group not built; Lan Anh and Phuc Chen hidden; SEA Effect and Mai Galleria not named |
| Headline, typography, logo and yellow/black/off-white match references | ✅ Matches the two prototypes. Text yellow darkened for contrast (see style guide) |
| Working enquiry form and confirmed email routing | ✅ Netlify Forms (form `contact`): honeypot + Netlify spam filter, consent checkbox, submissions in Netlify → Forms. ☐ Add the confirmed VCACE inbox under Forms → Submission notifications. Free tier: 100 submissions/month |
| Mobile navigation and buttons | ✅ Checked at 375 px and 1440 px; menu closes with Escape |
| Images, licences, credits recorded; placeholders removed | ✅ Placeholders replaced by 6 Unsplash photos, marked in the footer as concept images; credits kept on record (see Image record), not printed on the photos. ☐ Replace with VCACE’s own licensed photos, with written consent from identifiable people, as they become available |
| Legal host statement, copyright and privacy approved | ☐ Footer line is empty until SEA Effect approves. Policy pages are drafts with [placeholders] |
| Domain, hosting, design files and admin controlled by legal owner | ☐ See Ownership above |

## Release checklist (brief §13)

| Item | Where to switch it on once approved |
|---|---|
| SEA Effect legal-host wording | Home page → Footer → Legal host line |
| Mai Galleria as partner | Not built. Add to a project description or ask for a partners section |
| Team names and roles | People → Published |
| Advisory group | Not built on purpose. Ask the developer to add it when acceptances arrive |
| Inaugural event details | Projects → Cultural Encounters → Status, Exact date |
| Donation / sponsorship language | Not built (phase 2) |
| IP, domain, website transfer | See Ownership above |

## Requirements by area (brief §10)

| Area | Done | Still to do |
|---|---|---|
| CMS | Sanity project hd1rue71 with content loaded; Studio deployed | Invite editors |
| Responsive | 375 / 768 / 1440 layouts | Review on real devices |
| Performance | Static HTML, ~no JavaScript, lazy-loaded images, Sanity serves WebP/AVIF automatically | Run Lighthouse on the live site |
| Accessibility | Skip link, focus states, labels, alt text, heading order, colour contrast checked | Automated audit (axe/Lighthouse) and a screen-reader pass before launch |
| Search | Titles, meta description, Open Graph image, sitemap, robots.txt, organisation schema | Submit sitemap in Google Search Console |
| Forms | Netlify Forms live; consent statement, honeypot, spam filter, no unnecessary fields | ☐ Email notification to the VCACE inbox |
| Email | Not created (brief: no fictitious address) | ☐ SPF/DKIM/DMARC by the domain administrator |
| Events / payments | Phase 2 | Link to Humanitix etc. from a project when approved |
| Security | HTTPS via host, security headers (`site/public/_headers`), no admin on the public site | ☐ 2FA, least-privilege roles |
| Future-proofing | Projects, stories, team and pages are already CMS lists; can become their own pages without redesign | Vietnamese version (not in MVP) |
| Legal / footer | Privacy, Terms, Accessibility drafts; credits line | ☐ Approved wording, legal entity, ABN, contact email, state |
| Handover | Logo SVGs, style guide page, this document, training outline, backup steps | ☐ Image licences; final logo outlines by a designer |

## Image record (brief §10–11)

All current photographs are **concept images**, not documentation of VCACE events. They are used under the [Unsplash License](https://unsplash.com/license) (free commercial use, no permission needed; credit given voluntarily). Brief §11 asks for VCACE's own ethically sourced photos with written consent from identifiable participants, so replace these as real photos arrive. When you replace one, update its *alt text* and *credit*, and once no concept images remain, change the footer credits line (Home page → Footer → Credits).

| Where | Photo | Photographer | Source |
|---|---|---|---|
| Hero | Woodcut scrolls being hung in a timber hall | Bernd Dittrich | https://unsplash.com/photos/4m7qJjtYxHA |
| Program 01 Cultural Experiences | Live musicians at a water puppet theatre | Bernd Dittrich | https://unsplash.com/photos/Y1Nno7hBhRQ |
| Program 02 Cultural Dialogues | Informal talk in a gallery | Antenna | https://unsplash.com/photos/cw-cj_nFa14 |
| Program 03 Cultural Exchange | Street artists in Hội An | Alisa Kreydina | https://unsplash.com/photos/-s94FsX2J4Q |
| Program 04 Cultural Education | Hands shaping a bowl on a pottery wheel | Monika Bienert | https://unsplash.com/photos/EETgT0lmAiQ |
| First Project | Dimly lit exhibition hall | buian_photos | https://unsplash.com/photos/eVlcG42Ukkw |

Note: Unsplash photos come without model releases. The people shown are not endorsing VCACE; do not use these images in advertising that implies they do.

## Connecting Sanity and going live
See `site/README.md` for the exact commands.
