# Andreas Vold — site

Personal site built with **[Eleventy](https://www.11ty.dev/)**, edited via **[Decap CMS](https://decapcms.org/)**, and deployed free to **GitHub Pages**.

```
src/                       ← all source content lives here
├── _data/site.json        ← site-wide settings (editable in CMS → "Site settings")
├── _includes/layouts/     ← shared HTML layouts (base + project page)
├── index.njk              ← home
├── about.njk              ← about / CV
├── work.njk               ← auto-lists projects collection
├── writing.njk            ← auto-lists writing collection
├── projects/*.md          ← one file per project (CMS → "Projects")
├── writing-entries/*.md   ← one file per writing entry (CMS → "Writing")
├── assets/                ← images, PDFs, logos
├── site.css / cursor.js / strip.js
└── admin/                 ← the CMS itself (config.yml + index.html)

.eleventy.js               ← build config
package.json               ← dependencies
.github/workflows/deploy.yml ← auto-build & publish on every push
_site/                     ← generated output (not committed)
```

## Local development

```bash
npm install         # one-time
npm start           # http://localhost:8080 with live reload
npm run build       # produce _site/ for deployment
```

## First-time setup — publishing to GitHub Pages

### 1. Push to GitHub
Create a new repo on github.com, then from this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 2. Enable GitHub Pages
On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The workflow in `.github/workflows/deploy.yml` will then run on every push to `main` and publish to `https://YOUR-USERNAME.github.io/YOUR-REPO/` (or to your custom domain — see step 4).

### 3. Connect the CMS to the repo
Open `src/admin/config.yml` and change this line:

```yaml
repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
```

The CMS needs a GitHub OAuth provider so it can commit on your behalf. Two options:

**Option A — Decap Bridge (easiest, free, zero setup)**
1. Go to https://decapbridge.com and connect your GitHub.
2. In `src/admin/config.yml`, uncomment these two lines under `backend:`:
   ```yaml
   base_url: https://decapbridge.com
   auth_endpoint: oauth/authorize/
   ```
3. Push, then visit `https://YOUR-SITE/admin/` and log in with GitHub.

**Option B — self-hosted OAuth** (free Vercel/Render/Netlify)
Deploy https://github.com/vencax/netlify-cms-github-oauth-provider, set `base_url` to its URL. Slightly more setup, no third-party dependency.

### 4. (Optional) Custom domain — andreasvold.no
1. Create the file `src/CNAME` containing one line: `andreasvold.no`
2. At your domain registrar, add a CNAME record `andreasvold.no` → `YOUR-USERNAME.github.io`
3. On GitHub: **Settings → Pages → Custom domain → andreasvold.no**

## Editing content

After the CMS is connected, go to `https://YOUR-SITE/admin/`. You'll see four sections:

- **Projects** — add/edit/reorder project pages. Each project has plates (image cards) you can drag-reorder, plus optional links (e.g. external essay) and a long-form body.
- **Writing** — add essays, link to PDFs (upload them in the form) or external articles.
- **Site settings** — change tagline, email, year, etc.

Hit **Publish** and within ~60 seconds GitHub Actions rebuilds and the new content is live.

### Adding images
Anywhere the editor shows an image field, click and either:
- drag a file in (uploaded to `src/assets/imagery/uploads/`, committed automatically), or
- pick from images already in the repo.

## Adding a new project without the CMS
If you'd rather edit files directly, copy any file in `src/projects/` and edit the frontmatter. The list on `/work/` updates automatically — no other file needs changing.

## Known limits / next steps
- **Images aren't optimized**. For a photo-heavy site over time consider adding the [Eleventy Image plugin](https://www.11ty.dev/docs/plugins/image/) (free, builds responsive `srcset` at build time) or offloading to Cloudinary's free tier.
- **Old project HTML pages deleted** — they were replaced by markdown sources. URLs changed from `/projects/tbilisi.html` to `/work/tbilisi/`. If you need old URLs to keep working, we can add redirects.
