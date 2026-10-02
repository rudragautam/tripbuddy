# TripBuddy

Free day-by-day trip plans for India. Visitors pick a destination and 2–6 days and get a themed itinerary with a route map, live weather, best time to visit and a rough budget. There is no booking and no payment; visitors who want help send an enquiry, which the team handles in the admin panel.

## Stack

| Area | Choice |
| --- | --- |
| App | Next.js 16 (App Router, server actions, `proxy.ts`), React 19, Tailwind CSS 4 |
| Data | PostgreSQL via Drizzle ORM. Itinerary content is JSONB validated with zod |
| Local DB | PGlite (embedded Postgres, `.data/pglite`) when `DATABASE_URL` is empty |
| Auth | Email + password (bcrypt), signed HTTP-only session cookie (jose), roles `admin` / `editor` |
| Weather | Open-Meteo (no key), cached 30 min |
| Email | Resend REST API, optional |
| Tests | Vitest (unit + seed integrity), Playwright-core end-to-end against a real browser |

## Run locally

```bash
npm install
cp .env.example .env.local        # set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup                  # migrate + seed 45 destinations + first admin
npm run db:seed:demo              # optional: demo enquiries + editors for the admin
npm run dev                       # http://localhost:3000, admin at /admin
```

PGlite allows one process at a time: stop `npm run dev` before running any `db:*` or `user:*` script. To use real Postgres locally instead, run `docker compose up -d` and set `DATABASE_URL=postgres://tripbuddy:tripbuddy@localhost:5432/tripbuddy`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run db:generate` | Create a SQL migration after editing `lib/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Insert seed destinations that don't exist yet, and the first admin if there are no users. `-- --force` overwrites seed destinations (loses admin edits to them) |
| `npm run db:seed:demo` | Demo data for showing the admin: 72 enquiries over 90 days in every status, plus 2 demo editors (local DBs only). `-- --remove` deletes it all |
| `npm run user:admin -- you@example.com "Name"` | Create or recover an admin. Password from `ADMIN_PASSWORD` |
| `npm run db:purge-enquiries` | Delete enquiries older than 24 months (the privacy policy promise). Run monthly |
| `npm run typecheck` / `lint` / `test` | Static checks and unit tests |
| `npm run test:e2e` | Browser test against `BASE_URL` (uses installed Chrome/Edge; set `ADMIN_EMAIL`/`ADMIN_PASSWORD` to include admin flows) |

## Deploy (Vercel + Neon, or any Node host + Postgres)

1. Create a Postgres database and copy its **pooled** connection string.
2. Set the environment variables from `.env.example`. `DATABASE_URL`, `AUTH_SECRET` (32+ chars) and `NEXT_PUBLIC_SITE_URL` are required.
3. From your machine, with the production env loaded, run `npm run db:setup` once. Run `npm run db:migrate` on each release that adds a migration.
4. Deploy. Sign in at `/admin` and change the seeded admin password under **Account**.
5. Schedule `npm run db:purge-enquiries` monthly (Vercel Cron, GitHub Actions or a server cron).

The app refuses to start in production without `DATABASE_URL` and `AUTH_SECRET`.

## How it fits together

```
app/
  page.tsx, destinations/, explore/[type]/, enquire/, saved/, about|privacy|terms   public site
  destinations/[slug]/print/          printable / save-as-PDF itinerary
  admin/login, admin/(panel)/…         admin (dashboard, enquiries, destinations, users, account)
  admin/actions/*                      server actions (every one re-checks the user)
  admin/export/enquiries               CSV export
  sitemap.ts, robots.ts, manifest.ts   SEO
proxy.ts                               fast session gate for /admin
lib/
  types.ts, themes.ts                  tour types and their design tokens (one palette per trip type)
  validation.ts                        zod schemas shared by admin editor, seed and enquiry form
  db/                                  Drizzle schema, client (Postgres or PGlite)
  data/destinations.ts                 cached reads, tagged for instant refresh after admin edits
  auth/                                sessions, login lockout, roles
  seed/                                launch content (45 destinations × 6 days)
components/
  Planner/                             destination dashboard (trip pass, weather, map, timeline…)
  Scene/Diorama.tsx                    illustrated isometric scene per trip type
  Admin/                               admin UI
```

### Design system

Every page is themed by the destination's trip type (`hills`, `mountain`, `desert`, `beach`, `backwaters`, `heritage`, `wildlife`, `snow`). `lib/themes.ts` maps each to CSS variables that the `t-*` Tailwind colours read, so one layout gets eight looks. To add a trip type: add it to `TOUR_TYPES`, give it a palette in `themes.ts` and a scene in `Diorama.tsx`, then run `npm run db:generate` (the Postgres enum changes).

### Photos

Every destination has a real hero photo (shown on a tilted 3D slab, cards and share previews) and photos of most day stops. They come from Wikimedia Commons under free licences; each photo stores its author, licence and source, shown under the photo and on `/credits` (the licences require this).

- `npm run images:fetch` downloads photos for destinations that lack them (`-- <slug>` for one, `-- --refresh` for all) into `public/images/places/` and records attribution in `lib/seed/images.json`. Then `npm run db:seed -- --force` (or edit in the admin).
- `npm run images:review -- sheet.png` renders a contact sheet of all hero photos for a visual check. Rejected stop photos go in `EXCLUDED_STOPS` in `scripts/fetch-images.ts`.
- In the admin, **Hero photo** takes any `/path` or an https URL on Wikimedia, Unsplash or Cloudinary, plus the credit.
- A rendered 3D diorama (like the original references) can still be set per destination in **3D scene image**; it takes priority over the photo.

### Caching

Public pages render per request and read through `unstable_cache` (1 h), tagged `destinations` and `destination:<slug>`. Admin saves call `updateTag`, so changes are live immediately. Seed scripts write to the database directly; if the site is already running, use **Refresh site cache** in Admin › Destinations afterwards.

### Security notes

- Sessions are re-validated against the database on every admin request; password changes and deactivation sign the user out everywhere.
- 5 failed sign-ins lock an account for 15 minutes. Errors don't reveal whether an email exists.
- Enquiries: zod validation, honeypot field, rate limit of 3 per 10 minutes per hashed IP. Raw IPs are never stored.
- CSV export neutralises spreadsheet formulas. JSON-LD is escaped. Security headers are set in `next.config.ts`.
- There must always be one active admin: the UI refuses to demote or deactivate the last one.

## Content to verify before launch

The seed itineraries were written carefully but must be checked by someone with local knowledge before launch, especially permits, closing days, ropeway/road status, and the approximate coordinates of a few remote stops (e.g. Pangong Tso, Kunzum-side Spiti villages, White Rann, Khilanmarg). Update **Last checked** in the admin when a plan is verified. The privacy and terms pages are plain-language drafts and should be reviewed by a lawyer.
