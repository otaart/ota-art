# ota.art

Website for the painter Ota Votoček. Next.js 16 (App Router, TypeScript), every page prebuilt as static HTML, hosted on Vercel.
Built from the accepted HTML prototype (live version 1795378873-3709, 23 Nov 2026).

## Addresses

| Page | English | Czech |
|---|---|---|
| Landing | `/en` | `/cs` |
| Works | `/en/works` | `/cs/works` |
| One work | `/en/works/immortality` (+ `#about`, `#setting`) | `/cs/works/immortality` |
| Author, Contact, Inquire, Copyright | `/en/author` … `/en/legal` | `/cs/…` |

`ota.art` and any address without a language go to `/en` or `/cs` by the browser's language.
Crawlers: `/sitemap.xml`, `/robots.txt`, `/llms.txt`. Test address without living photos: add `#still`.

## Run locally

```bash
npm install
npm run images      # builds public/media from media-src/img (only after adding or changing masters)
npm run dev         # http://localhost:3000
npm run build && npm start   # production check
```

## Content

- Works, sizes, texts, order, landing scenes, living photos: `content/works.ts`
- Interface texts EN/CS: `content/dictionaries.ts`; copyright page: `content/legal.ts`
- `lib/content.ts` is the only reader. When Sanity is connected, it reads Sanity instead (schema ready in `sanity/schemaTypes.ts`).

## Images

Masters go in `media-src/img/` (not in git), named as in the prototype:
`w01.jpg` full scan, `w01_g.jpg` Works wall, `w01_x.jpg` close-up, `scene_01.jpg` / `scene_01_m.jpg` photo desktop / phone, plus `scene_*.mp4`, `amb.mp3`, cursors, `author.jpg`, `contact_*.jpg`, `menu_bg.jpg`.
`npm run images` writes WebP copies at 480 / 960 / 1600 / 2400 px and a JPEG fallback to `public/media/`, and lists missing masters in `content/media-manifest.json`. A missing master falls back to the nearest existing one, so nothing breaks.

## Environment (Vercel → Project → Settings → Environment Variables)

See `.env.example`. Without `RESEND_API_KEY` the forms answer "not available" and send nothing.

## Deploy

1. Push this folder to the GitHub organization (e.g. `ota-art/website`).
2. Vercel → Add New → Project → import the repository (framework detected: Next.js). Add the environment variables.
3. Vercel → Project → Settings → Domains → add `ota.art` and `www.ota.art`; Vercel shows the DNS records.
4. GoDaddy → ota.art → DNS: add exactly the records Vercel shows. Leave the Zoho MX/TXT records untouched.
5. Turn on Vercel Web Analytics (Project → Analytics). It uses no cookies.
