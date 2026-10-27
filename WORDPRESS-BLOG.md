# WordPress blog backend — optional drafting workflow

`src/content/articles.json` is the **source of truth** for everything under
`/publications`. The site builds from that file, and `npm run build` never
contacts WordPress. WordPress is an optional drafting backend for the team.

```
src/content/articles.json  -->  vite build  -->  prerender  -->  Cloudflare Pages
        source of truth

WordPress (optional)  --explicit sync-->  src/content/articles.json
```

## Why the build no longer syncs

The live WordPress.com account cannot currently edit posts over XML-RPC
(`401 — not allowed to edit posts in this post type`). An automatic pull at
build time would therefore overwrite local SEO/content fixes with stale
WordPress data. Builds are now deterministic: what is committed in
`articles.json` is what ships.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Build and prerender from `articles.json` only. No WordPress access. |
| `npm run build:wp` | Pull WordPress, overwrite `articles.json`, then build. Use only when WordPress should be authoritative. |
| `npm run wp:sync` | Dry run: report whether WordPress would change `articles.json`. Downloads nothing and writes nothing. |
| `npm run wp:sync:write` | Replace `articles.json` with WordPress content. |
| `npm run wp:import` | Dry run: show what would be pushed to WordPress. |
| `npm run wp:import -- --yes` | Push `articles.json` to WordPress. |
| `npm run wp:import -- --yes --slug=<slug>` | Push one article, or a comma-separated list of slugs. |
| `npm run wp:selftest` | Offline check of the sync pipeline. |

## Initial WordPress setup (already done)

If the WordPress site ever needs to be recreated:

1. Create a free site at **https://wordpress.com/start** and decline all paid
   plans.
2. In **Settings → General**, enable **Discourage search engines from indexing
   this site** so the duplicate WordPress pages do not compete with
   plutoassociates.com.
3. Enable two-step authentication, then create an application password under
   **Users → Profile → Application Passwords**.
4. Put the credentials in `.env` (never commit it):

   ```
   WP_URL=https://yourname.wordpress.com
   WP_USER=your_wp_username
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```

Application passwords and XML-RPC require an account role that can edit posts.
A contributor-style account may authenticate but still return
`401 — not allowed to edit posts in this post type`.

## Pushing local edits to WordPress

Only needed if WordPress should receive a copy. This changes the live
WordPress backend, so confirm the target slugs first.

```
npm run wp:import -- --slug=<slug>
npm run wp:import -- --yes --slug=<slug>
```

Without `--slug`, the command targets all articles in `articles.json`. The
import creates/updates posts and uploads featured images. WordPress.com's
XML-RPC ignores taxonomy arguments, so category/tag/SEO fields ride in the
invisible `pluto-meta` comment at the end of the post body.

## Pulling WordPress edits into the site

```
npm run wp:sync          # dry run first
npm run wp:sync:write    # only if the reported change is wanted
npm run build
```

`wp:sync:write` replaces the whole local file. Review the dry-run output and
the resulting `git diff` before committing.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- `WP_URL`, `WP_USER`, and `WP_APP_PASSWORD` are **not required** for normal
  builds.
- Do not set the build command to `npm run build:wp` unless WordPress is meant
  to overwrite committed article content on every deploy.

## Editing imported posts in WordPress

An imported post body is a single **Custom HTML** block. Its last line is an
invisible `pluto-meta` comment containing the article id, SEO fields, FAQs,
image metadata and taxonomy. Do not delete that line when editing. Posts
created fresh in WordPress do not need it.

## Troubleshooting

- **`401 invalid_credentials`** — the application password was copied wrong or
  two-step authentication was disabled after it was created. Create a new
  application password.
- **`401 not allowed to edit posts in this post type`** — the WordPress user
  lacks permission to create/edit posts. Use an account with the appropriate
  role, or keep editing `articles.json` and deploy the React site directly.
- **WordPress returns zero posts** — check `WP_URL` and confirm the site has
  posts. `WP_SYNC_ALLOW_EMPTY=1` overrides the safety stop deliberately.
- **Featured image missing on a post** — set it again in the WordPress editor
  and re-import, or set `featuredImage` in `articles.json` directly.
- **Post published in WordPress but site unchanged** — expected. Normal builds
  do not pull WordPress. Run `npm run wp:sync` and, if the diff is correct,
  `npm run wp:sync:write`, then commit and deploy.
