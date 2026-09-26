# ScrapeSuite — Scrape in Plain English

Natural Language Scraping API + Template Marketplace. Type what you need, get structured data.

ScrapeSuite ships **two coexisting designs**:

| Surface | Design | Routes |
|---|---|---|
| **Visitor site** | Dark/amber marketing landing ("Scrape in Plain English"), auth pages, account area | `/`, `/login`, `/signup`, `/dashboard/*`, `/templates`, `/docs`, `/blog`, … |
| **Proxy console** | Light "Proxy Manager Dashboard" for logged-in users | `/console`, `/proxy/*`, `/jobs`, `/analytics`, `/settings`, `/marketplace/*` |

Unauthenticated visitors see the marketing site; signing in unlocks both the account
dashboard and the proxy console.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** (strict — `tsc` runs clean, build errors are not ignored)
- **Tailwind CSS 4** + shadcn/ui components
- **Prisma** + SQLite (self-seeding, serverless-tolerant)
- **JWT auth** (HS256, `scrapesuite_token` cookie, edge-verified in middleware)
- Deployed on **Vercel**

## Getting started

```bash
bun install        # or npm install
cp .env.example .env   # then edit values
bun run db:push    # create local SQLite tables (optional — app also self-seeds)
bun run dev        # http://localhost:3000
```

A demo admin account is seeded automatically on first boot (see `.env.example`
to override the credentials). Production build:

```bash
bun run build
bun run start      # serves the standalone build
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | SQLite `file:` URL. On serverless the app falls back to `/tmp` automatically. |
| `JWT_SECRET` | yes | HS256 signing secret for session tokens. **Set a strong random value in production.** |
| `AUTH_EMAIL` / `AUTH_PASSWORD` | no | Override the seeded demo admin credentials. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin for SEO metadata, sitemap, robots and OG tags. |
| `NEXT_PUBLIC_APP_URL` | no | Alternate public URL reference used by legacy code paths. |
| `PAYSTACK_*` | no | Paystack secret/webhook/plan codes for billing features. |

## Deployment (Vercel)

The project deploys via the Vercel CLI (no git integration required):

```bash
npm i -g vercel
vercel link --project scrapesuite
vercel pull --environment=production
vercel deploy --prod
```

Configure `DATABASE_URL` and `JWT_SECRET` in the Vercel project settings
(Production environment). Everything else is optional.

### Serverless data caveat

Vercel functions have an **ephemeral filesystem** — the SQLite database lives in
`/tmp` and is re-created (schema + seed admin) on cold starts. This is intentional
for the demo: auth works out of the box with zero external services. For durable
user data, swap `DATABASE_URL` to a hosted Postgres provider (e.g. Neon, Turso via
driver adapters) and re-run `prisma db push`.

## Production readiness checklist

- [x] Real favicon set: `favicon.ico` (16/32/48), SVG icon, apple-touch-icon, PWA icons (192/512 + maskable)
- [x] Open Graph / Twitter card image (`/og-image.png`) with `metadataBase` set
- [x] SEO metadata: title template, description, keywords, robots directives
- [x] `robots.txt` (generated; private areas excluded) + `sitemap.xml` (public pages only)
- [x] Web app manifest (`/manifest.webmanifest`)
- [x] Branded 404 page, route-level `error.tsx`, root `global-error.tsx`
- [x] Security headers: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`; `X-Powered-By` removed
- [x] `Cache-Control: no-store` on all `/api/*` responses
- [x] Strict TypeScript build (no `ignoreBuildErrors`), React strict mode on
- [x] Auth timeout/retry handling on all client fetches (8s + 1 retry)
- [x] Skeleton loaders instead of blocking spinners; JWT-first UI hydration

## Project structure

```
src/
├── app/
│   ├── (marketing)/      # visitor design: landing, auth, account area, content pages
│   ├── (app)/            # proxy console design (auth-gated)
│   ├── api/              # auth, keys, scrape, dashboard, paystack routes
│   ├── layout.tsx        # root layout + SEO metadata
│   ├── not-found.tsx     # branded 404
│   ├── error.tsx         # route error boundary
│   ├── global-error.tsx  # root error boundary
│   ├── manifest.ts       # PWA manifest
│   ├── robots.ts         # robots.txt generator
│   └── sitemap.ts        # sitemap.xml generator
├── components/           # shared + shadcn/ui components
├── lib/                  # auth (JWT), db (Prisma), api-init, client helpers
└── middleware.ts         # edge JWT verification for protected routes
```

## Security notes

- Session JWTs are signed with `JWT_SECRET` (rotate if ever exposed) and verified
  at the edge in `middleware.ts` before protected routes render.
- Never commit `.env` — `.gitignore` already excludes `.env*`.
- The demo credentials are public knowledge (this is a demo app). For real
  deployments, set `AUTH_EMAIL`/`AUTH_PASSWORD` to private values **before the
  first boot**, and consider disabling the seed entirely.
