# WordPress blog backend — setup guide

Your site keeps its design and its `/publications` URLs on Cloudflare Pages.
WordPress becomes the **editorial backend for blog posts only**: you write in
WordPress, and every site build pulls the latest posts into `articles.json`
automatically. Total cost: **Rs. 0 / $0 forever** (free WordPress.com plan —
visitors never see the WordPress site, so its free-plan branding is irrelevant).

```
WordPress.com (free)  --REST API-->  sync-wp.cjs  -->  articles.json  -->  Cloudflare Pages
   you write posts                     runs at every build               serves plutoassociates.com
```

---

## Step 1 — Create the free WordPress site (5 minutes)

1. Go to **https://wordpress.com/start** and create a free account.
2. When it asks what to build, choose **Start with a basic website** / blog.
3. Pick any subdomain, e.g. `plutoassociatesblog.wordpress.com`.
4. **Decline every paid plan offer** — keep clicking "Continue with free",
   "Skip", "No thanks". The free plan is all we need.
5. Pick any theme (the default one is fine). Nobody will see this site.

## Step 2 — Hide the WordPress site from Google (1 minute)

1. Go to **https://yourname.wordpress.com/wp-admin**
2. **Settings → General** → find **"Search engine visibility"**
   ("Discourage search engines from indexing this site").
3. Tick it and save. This avoids duplicate-content SEO issues, since every
   article also lives on plutoassociates.com.

## Step 3 — Create an application password (3 minutes)

The sync needs a special password (not your login password).

1. In wp-admin: **Users → Profile** (or **My Home → Settings → Security**),
   find **Two-Step Authentication** and turn it on (free — use an
   authenticator app or SMS). Application passwords require this.
2. Then find **Application Passwords**, name it `Pluto site sync`, click
   **Create**.
3. Copy the generated password immediately (it looks like
   `xxxx xxxx xxxx xxxx xxxx xxxx` — the spaces are fine). It is shown only once.

## Step 4 — Push the 32 existing articles into WordPress (one time)

On your computer, in the `repo` folder:

1. Copy `.env.example` to `.env` and fill in:

   ```
   WP_URL=https://yourname.wordpress.com
   WP_USER=your_wp_username
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```

2. Dry run first (changes nothing, prints what it would do):

   ```
   npm run wp:import
   ```

3. When the summary looks right, push for real:

   ```
   npm run wp:import -- --yes
   ```

   It creates the categories (fdi, corporate, family…), uploads the featured
   images, and creates all 32 posts. Takes a few minutes.

4. Pull everything back to verify the round trip:

   ```
   npm run wp:sync
   ```

   `git diff src/content/articles.json` should be near-empty (minor date or
   formatting normalisation is normal).

## Step 5 — Connect Cloudflare Pages (5 minutes)

1. Open the Cloudflare Pages project for plutoassociates.com →
   **Settings → Environment variables**.
2. Add all three variables for **Production** (and Preview if you use it):
   `WP_URL`, `WP_USER`, `WP_APP_PASSWORD` — same values as your `.env`.
3. From now on, every build pulls fresh posts automatically. If WordPress is
   ever unreachable, the build keeps the last committed content instead of
   failing — the site can never go down because of WordPress.

## Step 6 — Auto-publish: new posts go live automatically (5 minutes, free)

WordPress.com free plans cannot run plugins, so we trigger builds with a free
cron service instead:

1. Cloudflare Pages → **Settings → Builds & deployments → Build hooks** →
   **Create build hook**. Name it "WordPress publish". Copy the URL it gives
   you.
2. Go to **https://cron-job.org**, create a free account.
3. **Create cron job** → URL = your build hook URL, method **POST**, schedule
   (e.g. every 6 hours at minute 0).
4. Done. When you publish a post in WordPress, the site updates within the
   next scheduled ping (or immediately — see the manual trigger below).

**Manual instant publish:** open your build-hook URL in the browser (or run
`curl -X POST <build-hook-url>`). The rebuild takes about a minute and the new
post is live.

## Step 7 — Everyday use

- Write posts at **wordpress.com → Posts → Add new**, exactly like any blog:
  title, content, excerpt, **featured image**, category, tags. Hit Publish.
- Your post appears on **plutoassociates.com/publications/your-slug** after
  the next build — same design, same URLs, with SEO metadata and FAQ schema
  handled by the site.
- New categories you create in WordPress work automatically; the site shows
  the category name as-is.
- One caution when editing an *imported* post: the body is a single
  **Custom HTML** block, and its last line is an invisible comment that stores
  SEO fields and the original article id. **Do not delete that last comment
  line** when editing. Posts you create fresh in WordPress don't need it.

## Useful commands

| Command | What it does |
|---|---|
| `npm run wp:import` | Dry run: show what would be pushed to WordPress |
| `npm run wp:import -- --yes` | Push articles.json → WordPress |
| `npm run wp:sync` | Pull WordPress → articles.json |
| `npm run build` | Sync, then full production build |
| `npm run wp:selftest` | Offline check of the sync pipeline |

## Moving house later

If you ever outgrow the free plan, everything exports from WordPress.com to
any self-hosted WordPress for free (Tools → Export). Only `WP_URL` changes —
the pipeline stays identical.

## Troubleshooting

- **`401 invalid_credentials`** — the application password was copied wrong
  (or 2FA was turned off after creating it). Create a new one in wp-admin.
- **`WP returned zero posts` during build** — the import never ran, or the
  env vars point at the wrong site. Run `npm run wp:import -- --yes` once.
- **Post published but site not updated** — trigger the build hook manually
  (Step 6), then check the Pages build log for sync output.
- **Featured image missing on a post** — set it again in the WordPress editor
  (Media → Set featured image) and rebuild.
