# .Dev Website — Complete Developer Reference

> **Club:** .Dev — Product Engineering & Innovation Club
> **University:** REVA University, Bengaluru
> **Tagline:** Build. Ship. Innovate.
> **Repo:** https://github.com/DotDev-Club/DD_website
> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · MongoDB/Mongoose · Cloudinary · Upstash Redis · Vercel

---

## Deployment (Vercel) — Current Setup

- **Production URL:** https://dotdev-website.vercel.app
- **Admin Panel:** https://dotdev-website.vercel.app/admin
- **Vercel Project:** `dotdev-website` under `pranav-s-projects-2142d19d`
- **Deploy command:** `vercel deploy --prod` (from project root, Vercel CLI must be logged in)
- **Force rebuild:** `vercel deploy --prod --force`

### Infrastructure
| Service | Details |
|---|---|
| MongoDB Atlas | Cluster0 · `cluster0.nievczh.mongodb.net` · DB: `dotdev` · User: `rajasaipranav0_db_user` |
| Upstash Redis | `apt-cricket-91232.upstash.io` (REST API) |
| Gmail SMTP | `rajasaipranav0@gmail.com` · App Password set |
| Cloudinary | Placeholders set — update with real credentials if image upload fails |

### All Vercel Environment Variables (set for Production)
```
NEXT_PUBLIC_MONGODB_URI        — MongoDB Atlas connection string (dotdev DB)
JWT_SECRET                     — Random 64-char hex (generated, secure)
SESSION_SECRET                 — Random 64-char hex (generated, secure)
NEXT_PUBLIC_DOMAIN             — https://dotdev-website.vercel.app
ADMIN_EMAILS                   — rajasaipranav0@gmail.com
MAIL_SMTP                      — smtp.gmail.com
MAIL_SMTP_PORT                 — 465
MAIL_USER                      — rajasaipranav0@gmail.com
MAIL_PASS                      — Gmail App Password (set)
UPSTASH_REDIS_REST_URL         — https://apt-cricket-91232.upstash.io
UPSTASH_REDIS_REST_TOKEN       — set
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — update with real value
NEXT_PUBLIC_CLOUDINARY_API_KEY    — update with real value
NEXT_PUBLIC_CLOUDINARY_API_SECRET — update with real value
```

### To update an env var
```bash
vercel env rm VAR_NAME production --yes
vercel env add VAR_NAME production --value "new-value" --yes
vercel deploy --prod
```

### Admin login flow
1. Go to https://dotdev-website.vercel.app/admin
2. Enter `rajasaipranav0@gmail.com`
3. Check Gmail inbox for magic link (expires 15 min)
4. Click link → redirected to `/admin/dashboard`

> **Note:** Cloudinary env vars still have placeholder values — image uploads in admin will fail until real Cloudinary credentials are added.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all values — see "Environment Variables" section below

# 3. Seed the database with sample data
npm run seed

# 4. Start development server
npm run dev
# → http://localhost:3000       (public site)
# → http://localhost:3000/admin (admin panel)
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | React Server Components + client pages |
| Language | TypeScript (strict) | All files typed |
| Styling | Tailwind CSS + CSS variables | Dark techy theme, green accent |
| Database | MongoDB via Mongoose | Hosted on MongoDB Atlas |
| Media | Cloudinary | All images uploaded via `/api/upload` |
| Auth | JWT magic-link + Upstash Redis | Passwordless, one-time-use links |
| Email | Nodemailer (Gmail SMTP) | Sends magic link emails |
| Forms | react-hook-form | All public + admin forms |
| Toast | react-hot-toast | Notifications across all pages |
| Icons | lucide-react | Consistent icon set |
| State | Zustand | Admin `isLoggedIn` + `adminEmail` |
| Deployment | Netlify | `@netlify/plugin-nextjs` plugin |

---

## Folder Structure

```
DD_website/
├── app/
│   ├── css/
│   │   └── style.css               # Global Tailwind + CSS custom properties
│   ├── layout.tsx                  # Root layout (fonts: Inter + JetBrains Mono)
│   ├── error.tsx                   # Error boundary page
│   ├── not-found.tsx               # 404 page
│   │
│   ├── (default)/                  # Public-facing route group
│   │   ├── layout.tsx              # Wraps pages with Header + Footer
│   │   ├── page.tsx                # Home: Hero + StatsBar + About + CTA
│   │   ├── events/page.tsx         # Events listing with type filter
│   │   ├── projects/page.tsx       # Projects showcase with domain filter
│   │   ├── team/page.tsx           # Team grid grouped by category
│   │   ├── workshops/page.tsx      # Workshops with search
│   │   ├── gallery/page.tsx        # Masonry gallery with lightbox
│   │   └── join/page.tsx           # Join .Dev application form
│   │
│   ├── admin/                      # Admin panel
│   │   ├── layout.tsx              # Root admin layout (Toaster only)
│   │   ├── page.tsx                # Sign-in page (magic link)
│   │   ├── login/route.ts          # GET: verify token → set cookie → redirect
│   │   ├── logout/route.ts         # GET: clear cookie → redirect to /admin
│   │   └── (panel)/                # Protected admin pages (route group)
│   │       ├── layout.tsx          # Sidebar + TopBar shell
│   │       ├── dashboard/page.tsx  # Stats overview + quick links
│   │       ├── events/page.tsx     # CRUD events
│   │       ├── projects/page.tsx   # CRUD projects
│   │       ├── members/page.tsx    # CRUD team members
│   │       ├── applications/page.tsx # View + update application status
│   │       ├── gallery/page.tsx    # Upload/delete gallery images
│   │       └── cycles/page.tsx     # CRUD product cycles
│   │
│   └── api/                        # REST API (all use Next.js Route Handlers)
│       ├── events/route.ts         # GET (public) / POST PUT DELETE (auth)
│       ├── members/route.ts        # GET (public) / POST PUT DELETE (auth)
│       ├── projects/route.ts       # GET (public) / POST PUT DELETE (auth)
│       ├── workshops/route.ts      # GET (public) / POST DELETE (auth)
│       ├── applications/
│       │   ├── route.ts            # GET (auth admin) / POST (public join form)
│       │   └── [id]/route.ts       # PATCH status (auth)
│       ├── cycles/route.ts         # GET (public) / POST PUT DELETE (auth)
│       ├── gallery/
│       │   ├── route.ts            # GET (public) / POST DELETE (auth)
│       │   └── upload/route.ts     # POST Cloudinary upload (auth)
│       └── upload/route.ts         # General-purpose Cloudinary upload (auth)
│
├── components/
│   ├── ui/                         # Shared UI components
│   │   ├── header.tsx              # Sticky navbar with scroll behaviour
│   │   ├── footer.tsx              # Footer with links + socials
│   │   ├── logo.tsx                # .Dev logo (club_logo.jpeg + text)
│   │   ├── mobile-menu.tsx         # Hamburger nav for mobile
│   │   └── NavItems.ts             # Centralised nav link definitions
│   ├── admin/                      # Admin-only components
│   │   ├── Sidebar.tsx             # Collapsible sidebar with active states
│   │   ├── TopBar.tsx              # Admin top bar (email + sign out)
│   │   └── ImageUpload.tsx         # Drag-and-drop + URL paste Cloudinary uploader
│   ├── Hero.tsx                    # Typewriter hero section
│   ├── About.tsx                   # About + 3 pillars (Build / Ship / Innovate)
│   ├── StatsBar.tsx                # Animated count-up stats row
│   ├── EventCard.tsx               # Event card (type badge, status dot)
│   ├── ProjectCard.tsx             # Project card (tech stack tags, links)
│   ├── WorkshopCard.tsx            # Workshop card (meta, tags, resources link)
│   ├── MemberCard.tsx              # Team member card (photo, socials)
│   └── JoinForm.tsx                # Join application form (react-hook-form)
│
├── models/                         # Mongoose schemas
│   ├── Event.ts
│   ├── Member.ts
│   ├── Project.ts
│   ├── Workshop.ts
│   ├── Application.ts
│   ├── GalleryImage.ts
│   └── Cycle.ts
│
├── lib/
│   ├── dbConnect.ts                # Singleton MongoDB connection
│   ├── cloudinary.ts               # Cloudinary SDK config
│   ├── redis.ts                    # Upstash Redis client + rate limiter
│   ├── requireAuth.ts              # requireAuth() for API route protection
│   ├── server/
│   │   └── auth.ts                 # sendVerificationEmail, verifyLoginToken, verifyToken
│   ├── client/
│   │   └── verifyAuth.ts           # Reads admin_token cookie, calls verifyToken
│   └── zustand/
│       └── store.ts                # Zustand: isLoggedIn + adminEmail
│
├── utils/
│   └── cn.ts                       # clsx + tailwind-merge helper
│
├── scripts/
│   └── seed.ts                     # DB seed: 6 events, 8 members, 6 projects, 5 workshops, 6 gallery images
│
├── public/
│   └── club_logo.jpeg              # .Dev club logo (used in navbar + admin)
│
├── middleware.ts                   # Route protection + CORS headers
├── tailwind.config.ts              # Theme tokens (extends PB_Website palette)
├── next.config.mjs                 # Image domains, CORS headers, webpack fallbacks
├── netlify.toml                    # Netlify build config
├── .env.example                    # All required env variables with descriptions
└── tsconfig.json                   # TypeScript strict mode, path alias @/*
```

---

## Environment Variables

Copy `.env.example` → `.env.local` and fill in all values.

```env
# ── Database ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dotdev

# ── Cloudinary ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret

# ── Admin Auth ─────────────────────────────────────────────────────────────────
ADMIN_EMAILS=admin@reva.edu.in,president@dotdev.reva.edu.in
# Comma-separated list of emails allowed to access the admin panel

JWT_SECRET=<random 32+ char string>        # Signs magic-link tokens (15 min)
SESSION_SECRET=<different random string>   # Signs session tokens (1 day)
NEXT_PUBLIC_DOMAIN=http://localhost:3000   # Change to production URL on deploy

# ── Nodemailer (Gmail) ─────────────────────────────────────────────────────────
MAIL_SMTP=smtp.gmail.com
MAIL_SMTP_PORT=465
MAIL_USER=your.gmail@gmail.com
MAIL_PASS=your_gmail_app_password          # Use Gmail App Password, not your real password

# ── Upstash Redis ──────────────────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
# Get these from https://console.upstash.com → Create Database → REST API tab
```

---

## MongoDB Models

All models live in `models/`. They follow the PB_Website pattern:
- Use a string `id` field (uuid v4) alongside MongoDB's `_id`
- Model name cached with `mongoose.models.name || mongoose.model(...)`

### Event
```ts
{
  id: string          // uuid
  title: string
  description: string
  date: string        // ISO date string
  type: "Hackathon" | "Workshop" | "Talk" | "Product Sprint"
  bannerImage: string // Cloudinary URL
  registrationLink: string
  status: "upcoming" | "ongoing" | "past"
  venue: string
  dateCreated: string
  dateModified: string
}
// Collection: devevents
```

### Member
```ts
{
  id: string
  name: string
  role: string         // e.g. "President", "Technical Lead"
  category: "Core Team" | "Faculty Advisor" | "Mentor"
  photo: string        // Cloudinary URL
  linkedin: string
  github: string
  batch: string        // e.g. "2022-2026"
  bio: string
}
// Collection: devmembers
```

### Project
```ts
{
  id: string
  name: string
  description: string
  techStack: string[]
  domain: "Web" | "Mobile" | "AI/ML" | "Blockchain" | "Open Source"
  coverImage: string   // Cloudinary URL
  liveUrl: string
  githubUrl: string
  teamMembers: string[]
  year: string         // e.g. "2025"
  featured: boolean
}
// Collection: devprojects
```

### Workshop
```ts
{
  id: string
  title: string
  facilitator: string
  date: string
  duration: string     // e.g. "3 hours"
  description: string
  resourcesLink: string
  coverImage: string
  tags: string[]
  dateCreated: string
}
// Collection: devworkshops
```

### Application (Join form)
```ts
{
  name: string
  email: string
  year: string         // e.g. "2nd Year"
  branch: string       // e.g. "CSE"
  whyJoin: string
  skills: string
  submittedAt: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
}
// Collection: devapplications
// Note: Uses _id for updates (no custom id field)
```

### GalleryImage
```ts
{
  id: string
  imageUrl: string     // Cloudinary URL
  caption: string
  eventTag: string     // e.g. "DevSprint 1.0"
  uploadedAt: string
}
// Collection: devgallery
```

### Cycle (Product Sprint Cycle)
```ts
{
  id: string
  name: string         // e.g. "CampusEats v2"
  description: string
  week: number         // Current week number (1-12)
  squad: string[]      // Member names
  githubRepo: string
  startDate: string
  endDate: string
  industryMentor: string
  status: "active" | "completed" | "upcoming"
  outcome: string
  dateCreated: string
}
// Collection: devcycles
```

---

## API Reference

All routes under `/api/`. GET requests are public. Mutating operations require a valid `admin_token` cookie (set after magic-link login).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List all events sorted by date |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events?id=<id>` | Admin | Update event |
| DELETE | `/api/events?id=<id>` | Admin | Delete event |
| GET | `/api/members` | Public | List all members |
| POST | `/api/members` | Admin | Add member |
| PUT | `/api/members?id=<id>` | Admin | Update member |
| DELETE | `/api/members?id=<id>` | Admin | Remove member |
| GET | `/api/projects` | Public | List all projects |
| POST | `/api/projects` | Admin | Add project |
| PUT | `/api/projects?id=<id>` | Admin | Update project |
| DELETE | `/api/projects?id=<id>` | Admin | Delete project |
| GET | `/api/workshops` | Public | List all workshops |
| POST | `/api/workshops` | Admin | Add workshop |
| DELETE | `/api/workshops?id=<id>` | Admin | Delete workshop |
| GET | `/api/applications` | Admin | List all applications |
| POST | `/api/applications` | Public | Submit join application |
| PATCH | `/api/applications/:id` | Admin | Update application status |
| GET | `/api/cycles` | Public | List all product cycles |
| POST | `/api/cycles` | Admin | Create cycle |
| PUT | `/api/cycles?id=<id>` | Admin | Update cycle |
| DELETE | `/api/cycles?id=<id>` | Admin | Delete cycle |
| GET | `/api/gallery` | Public | List gallery images |
| POST | `/api/gallery` | Admin | Add image record |
| DELETE | `/api/gallery?id=<id>` | Admin | Delete image record |
| POST | `/api/gallery/upload` | Admin | Upload image to Cloudinary |
| POST | `/api/upload` | Admin | Upload any image to Cloudinary (general) |

---

## Auth System (Magic Link)

### How it works
```
Admin enters email
       ↓
sendVerificationEmail(email)          ← lib/server/auth.ts
  • Check ADMIN_EMAILS whitelist
  • Sign 15-min JWT with JWT_SECRET
  • Store token in Redis (key: admin_login_<email>, TTL: 15min)
  • Send email via Nodemailer with link:
    /admin/login?token=<jwt>
       ↓
Admin clicks email link
       ↓
GET /admin/login?token=<jwt>          ← app/admin/login/route.ts
  • verifyLoginToken(token):
      - jwt.verify(token, JWT_SECRET)
      - redis.get(admin_login_<email>) === token  (one-time check)
      - redis.del(admin_login_<email>)             (invalidate immediately)
      - return jwt.sign({email, role}, SESSION_SECRET, {expiresIn: "1d"})
  • Set httpOnly cookie: admin_token = sessionJWT
  • Redirect to /admin/dashboard?token=<sessionJWT>
       ↓
All subsequent requests:
  • middleware.ts reads admin_token cookie
  • If missing → redirect to /admin
  • API routes call requireAuth() → verifyAuth() → verifyToken(cookie)
```

### Key files
| File | Role |
|---|---|
| `lib/redis.ts` | Upstash Redis client (REST API, works in Edge/serverless) |
| `lib/server/auth.ts` | Server actions: `sendVerificationEmail`, `verifyLoginToken`, `verifyToken` |
| `lib/client/verifyAuth.ts` | Reads `admin_token` cookie server-side, calls `verifyToken` |
| `lib/requireAuth.ts` | Wrapper for API routes — returns `{ user }` or `{ error: 401 response }` |
| `lib/zustand/store.ts` | Client state: `isLoggedIn`, `adminEmail`, `setLoggedIn`, `reset` |
| `middleware.ts` | Protects `/admin/*` (except `/admin` and `/admin/login`) |

### Redis usage
- **Token store key:** `admin_login_<email>` with 15-minute TTL
- **One-time use:** deleted immediately on first successful verify
- **Rate limiter:** `ratelimiter` export (5 req/min sliding window) — can be used on the sign-in API if needed
- **Provider:** Upstash (serverless Redis, HTTP REST — no TCP connection issues in Netlify/Vercel)

---

## Design System

### Colors
```
Background:   #0a0a0a (root)  #111 (cards)  #0d0d0d (sections)
Brand Green:  #22c55e (green-500) — primary accent
Text:         white · gray-300 · gray-400 (muted) · gray-500 · gray-600 (subtle)
Borders:      border-gray-800 (default) → border-green-500/20..40 (hover/active)
```

CSS variables (defined in `app/css/style.css`, HSL format for shadcn/ui compatibility):
```css
--primary: 142 71% 45%;       /* green-500 */
--background: 0 0% 4%;        /* #0a0a0a */
--card: 0 0% 7%;               /* #111 */
--border: 0 0% 15%;
```

### Typography
- **Body font:** Inter — variable `--font-inter`, loaded via `next/font/google`
- **Mono/accent font:** JetBrains Mono — variable `--font-mono`, for code-editor aesthetic
- **Pattern:** section headers use `font-mono` to look like code:
  - `<About />` · `.events {}` · `// comment style` · `{ key: value }`

### Utility Classes (custom, defined in `style.css`)
| Class | Effect |
|---|---|
| `bg-grid` | Subtle green grid lines background |
| `bg-dots` | Radial dot pattern background |
| `card-hover` | `translateY(-4px)` + green shadow on hover |
| `glow-green` | `box-shadow: 0 0 20px rgba(34,197,94,0.3)` |
| `glow-green-lg` | Stronger glow |
| `code-label` | Monospace, green-500 color |

### Animations (defined in `tailwind.config.ts`)
| Class | Effect |
|---|---|
| `animate-blink` | Typewriter cursor blink |
| `animate-glow-pulse` | Pulsing green glow |
| `animate-slide-up` | Fade in + slide up |
| `animate-float` | Gentle floating (3s loop) |

---

## Admin Panel

### Pages
| URL | Description |
|---|---|
| `/admin` | Sign-in (public, no sidebar) |
| `/admin/dashboard` | Stats cards + quick links |
| `/admin/events` | Table + create/edit/delete modal |
| `/admin/projects` | Table + create/edit/delete modal |
| `/admin/members` | Category grid + add/edit/delete |
| `/admin/applications` | Expandable rows, status filter, one-click status update |
| `/admin/gallery` | Masonry grid, drag-and-drop upload, delete |
| `/admin/cycles` | Product sprint cycle management |

### Admin Components
| Component | Purpose |
|---|---|
| `components/admin/Sidebar.tsx` | Left nav with active link highlighting, collapses on mobile |
| `components/admin/TopBar.tsx` | Shows admin email + sign-out button, handles Zustand hydration |
| `components/admin/ImageUpload.tsx` | Drag-and-drop file upload → `/api/upload` → Cloudinary, with URL paste fallback |

### Adding a New Admin Section
1. Create model in `models/YourModel.ts`
2. Create API route in `app/api/your-route/route.ts` (use `requireAuth` on mutations)
3. Create admin page: `app/admin/(panel)/your-section/page.tsx`
4. Add sidebar link to `components/admin/Sidebar.tsx` `navLinks` array
5. Add title to `app/admin/(panel)/layout.tsx` `TITLES` map

---

## Pages — Public

### Home (`/`)
- **Hero:** `.Dev` heading + typewriter subtitles cycling through "We Build Products." etc.
- **StatsBar:** Animated count-up row (120+ Members, 30+ Projects, 25+ Workshops, 8 Hackathons Won)
- **About:** Club description + 3 pillar cards (Build / Ship / Innovate)
- **CTA:** Join .Dev banner with Apply + Events buttons

### Events (`/events`)
- Fetches `/api/events`, client-side filter by type (All / Hackathon / Workshop / Talk / Product Sprint)
- Groups into Upcoming and Past sections
- Uses `EventCard` component with type-colored badge and status dot

### Projects (`/projects`)
- Fetches `/api/projects`, client-side filter by domain
- Featured projects shown first in their own section
- Uses `ProjectCard` with tech stack chips and live/GitHub links

### Team (`/team`)
- Fetches `/api/members`, renders three sections: Core Team → Faculty Advisor → Mentor
- Uses `MemberCard` with photo, role badge, batch, and social links

### Workshops (`/workshops`)
- Fetches `/api/workshops`, client-side search by title/facilitator/tags
- Uses `WorkshopCard` with metadata row and optional resources link

### Gallery (`/gallery`)
- Fetches `/api/gallery`, renders Masonry grid (CSS `columns`)
- Click to open lightbox (Escape to close)

### Join (`/join`)
- `JoinForm` component (react-hook-form) POSTs to `/api/applications`
- Fields: name, email, year, branch, skills, why join
- Sidebar shows "Why .Dev?" bullet points and social links

---

## Seed Script

```bash
npm run seed
```

Located at `scripts/seed.ts`. Requires `NEXT_PUBLIC_MONGODB_URI` in `.env.local`.

**Seeds:** 6 events · 8 members (Core Team + Faculty Advisor + Mentors) · 6 projects · 5 workshops · 6 gallery images

Uses Cloudinary demo placeholder images. Replace with real images after seeding.

To reseed (wipes existing data first): `npm run seed` again — each collection is cleared before inserting.

---

## Deployment (Netlify)

1. Push to GitHub (`main` or `staging` branch)
2. Connect repo in Netlify dashboard
3. Set all env variables from `.env.example` in Netlify → Site settings → Environment variables
4. Build command: `npm run build` · Publish directory: `.next`
5. Plugin `@netlify/plugin-nextjs` is pre-configured in `netlify.toml`
6. Set `NEXT_PUBLIC_DOMAIN=https://your-site.netlify.app` (used in magic link emails)

---

## How to Add Content (Quick Reference)

### Add event / project / member / workshop / gallery image
→ Sign in to `/admin` and use the relevant admin page. All changes are live immediately.

### Add a new page
1. Create `app/(default)/your-page/page.tsx`
2. Add to `components/ui/NavItems.ts`

### Add a new model
1. `models/YourModel.ts` — export `interface IYour extends Document` + model
2. `app/api/your-route/route.ts` — `connectMongoDB()` + `requireAuth()` on mutations
3. `app/admin/(panel)/your-section/page.tsx` — admin CRUD page
4. Add nav link to sidebar
5. Add sample data to `scripts/seed.ts`

### Change accent color
- Edit `--primary` HSL value in `app/css/style.css`
- Update `dev-green` in `tailwind.config.ts`

---

## Development Notes

- **Path alias:** `@/*` maps to the project root (e.g. `@/lib/dbConnect`)
- **Auth in API routes:** Always `const { error } = await requireAuth(); if (error) return error;` before any DB call on mutating routes
- **Image uploads:** Use `POST /api/upload` with `FormData` (field: `file`, optional: `folder`). Returns `{ url: string }`
- **MongoDB connection:** `connectMongoDB()` uses a module-level singleton — safe to call at the top of every route handler
- **Never commit `.env.local`** — it is in `.gitignore`
- **Redis:** Uses Upstash REST API — works in serverless (no TCP). Requires `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
