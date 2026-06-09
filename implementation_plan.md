# World Cup 2026 Match Hub — Implementation Plan

Build an interactive, shareable FIFA World Cup 2026 schedule website with a fun tournament vibe, live countdown to the next match, full schedule with local-timezone display, and group standings.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19 + Vite** | Fast dev, instant HMR, static build |
| Styling | **Tailwind CSS v4** (CSS-first config) | Rapid, utility-first, responsive |
| Routing | **React Router v7** (client-side) | Simple tabbed navigation |
| Date/Time | **Native `Intl.DateTimeFormat`** + `Date` | Browser timezone, zero deps |
| Flags | **flagcdn.com** (free CDN) | `https://flagcdn.com/w80/{code}.png` |
| Deployment | **Static build** (`vite build`) | Deploy anywhere: Vercel / Netlify / GitHub Pages |
| Data (MVP) | **Local JSON files** in `src/data/` | Reliable, no network dependency |
| Data (future) | **worldcup26.ir** free API or football-data.org | Live scores, standings updates |

---

## Project Architecture

```
world-cup-2026-match-hub/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg              # ⚽ World Cup themed favicon
├── src/
│   ├── main.jsx                 # React entry
│   ├── App.jsx                  # Router + layout shell
│   ├── index.css                # Tailwind v4 + global styles + animations
│   ├── data/
│   │   ├── matches.json         # All 104 matches (MVP: first 48 group stage)
│   │   └── groups.json          # 12 groups with teams + standings skeleton
│   ├── utils/
│   │   ├── time.js              # formatLocalTime, getCountdown, getNextMatch
│   │   └── matchHelpers.js      # groupByStatus, sortMatches, filterByGroup
│   ├── hooks/
│   │   └── useCountdown.js      # Countdown timer hook (1s interval)
│   ├── components/
│   │   ├── Navbar.jsx           # Top nav: Home / Schedule / Groups / About
│   │   ├── Hero.jsx             # Big countdown + next match spotlight
│   │   ├── CountdownTimer.jsx   # Days/Hours/Minutes/Seconds display
│   │   ├── MatchCard.jsx        # Single match card (flags, time, status)
│   │   ├── MatchList.jsx        # Renders list of MatchCards with section headers
│   │   ├── GroupCard.jsx        # Single group with team list + standings table
│   │   ├── TeamRow.jsx          # Team row inside group standings
│   │   ├── StatusBadge.jsx      # "Upcoming" / "LIVE" / "Finished" badge
│   │   └── Footer.jsx           # Credits, data source link
│   └── pages/
│       ├── HomePage.jsx         # Hero + upcoming matches preview
│       ├── SchedulePage.jsx     # Full schedule with filters
│       ├── GroupsPage.jsx       # All 12 groups
│       └── AboutPage.jsx        # Data source, credits, API info
```

---

## Data Model

### `matches.json` — Match Schema

```json
{
  "id": 1,
  "homeTeam": "Mexico",
  "awayTeam": "South Africa",
  "homeCode": "mx",
  "awayCode": "za",
  "kickoffUTC": "2026-06-11T18:00:00Z",
  "stadium": "Estadio Ciudad de Mexico",
  "city": "Mexico City",
  "country": "Mexico",
  "group": "A",
  "stage": "Group Stage",
  "status": "upcoming",
  "homeScore": null,
  "awayScore": null
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Unique match ID (1–104) |
| `homeTeam` / `awayTeam` | `string` | Full team name |
| `homeCode` / `awayCode` | `string` | ISO 3166-1 alpha-2 code (for flagcdn) |
| `kickoffUTC` | `string` | ISO 8601 UTC datetime |
| `stadium` | `string` | FIFA tournament venue name |
| `city` | `string` | Host city |
| `country` | `string` | Host country (USA / Mexico / Canada) |
| `group` | `string \| null` | `"A"` – `"L"` for group stage, `null` for knockouts |
| `stage` | `string` | `"Group Stage"`, `"Round of 32"`, `"Round of 16"`, etc. |
| `status` | `string` | `"upcoming"` / `"live"` / `"finished"` |
| `homeScore` / `awayScore` | `number \| null` | Scores (null if not yet played) |

> **Flags** are derived dynamically: `https://flagcdn.com/w80/${code}.png` — no flag images stored locally.

### `groups.json` — Group Schema

```json
{
  "group": "A",
  "teams": [
    {
      "name": "Mexico",
      "code": "mx",
      "played": 0,
      "won": 0,
      "drawn": 0,
      "lost": 0,
      "gf": 0,
      "ga": 0,
      "gd": 0,
      "points": 0
    }
  ]
}
```

### Confirmed Groups (All 12)

| Group | Teams |
|---|---|
| **A** | Mexico, South Africa, South Korea, Czechia |
| **B** | Canada, Bosnia & Herzegovina, Qatar, Switzerland |
| **C** | Brazil, Morocco, Haiti, Scotland |
| **D** | USA, Paraguay, Australia, Türkiye |
| **E** | Germany, Curaçao, Côte d'Ivoire, Ecuador |
| **F** | Netherlands, Japan, Sweden, Tunisia |
| **G** | Belgium, Egypt, Iran, New Zealand |
| **H** | Spain, Cape Verde, Saudi Arabia, Uruguay |
| **I** | France, Senegal, Iraq, Norway |
| **J** | Argentina, Algeria, Austria, Jordan |
| **K** | Portugal, DR Congo, Uzbekistan, Colombia |
| **L** | England, Croatia, Ghana, Panama |

---

## UI Layout & Design

### Design Vibe

- **Color palette**: Gradients blending USA blue (`#002868`), Mexico green (`#006341`), Canada red (`#FF0000`), with golden accents (`#FFD700`)
- **Background**: Deep dark gradient (`#0a0a1a` → `#1a1a3e`) with subtle radial glows simulating stadium lights
- **Cards**: Glassmorphism — semi-transparent backgrounds, backdrop-blur, subtle borders
- **Typography**: Google Font **"Outfit"** (modern, geometric, sporty)
- **Animations**: Pulse on live badges, smooth card hover lifts, countdown digit flip-style transition, fade-in on scroll

### Page Layouts

#### 1. HomePage
```
┌─────────────────────────────────────────────┐
│  🏟️  NAVBAR  [Home] [Schedule] [Groups]     │
├─────────────────────────────────────────────┤
│                                             │
│   ⚽ FIFA WORLD CUP 2026                    │
│   NEXT MATCH                                │
│   🇲🇽  Mexico  vs  South Africa  🇿🇦         │
│   📍 Estadio Ciudad de Mexico, Mexico City  │
│   🏷️ Group A • Group Stage                  │
│                                             │
│   ┌──────┬──────┬──────┬──────┐             │
│   │  12  │  04  │  30  │  15  │  countdown  │
│   │ DAYS │  HRS │ MINS │ SECS │             │
│   └──────┴──────┴──────┴──────┘             │
│                                             │
├─────────────────────────────────────────────┤
│  UPCOMING MATCHES (first 6 cards)           │
│  ┌─────────────┐  ┌─────────────┐           │
│  │  Match Card  │  │  Match Card  │          │
│  └─────────────┘  └─────────────┘           │
│  [View Full Schedule →]                     │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

#### 2. SchedulePage
- **Group/Stage filter** dropdown at top
- **Two sections**: "Upcoming & Live" (sorted soonest-first) and "Finished" (most recent first)
- Responsive grid: 1 col mobile → 2 cols tablet → 3 cols desktop

#### 3. GroupsPage
- 12 `GroupCard` components in a responsive grid (1→2→3 cols)
- Each card: group letter header, standings table (rank, flag, team, P, W, D, L, GF, GA, GD, Pts)
- Top 2 rows highlighted (auto-qualify), 3rd row subtle highlight (potential 3rd-place advance)

#### 4. AboutPage
- Data source info
- API upgrade path
- Credits + flagcdn attribution

---

## Component Breakdown

### `Navbar`
- Sticky top, glass background
- Links: Home, Schedule, Groups, About
- Active link indicator (animated underline)
- Mobile: hamburger → slide-in drawer

### `Hero`
- Full-width gradient banner
- Tournament logo / title with glow effect
- Next match info: flags (64px), team names, date/time in local tz, stadium, group
- `CountdownTimer` component centered below

### `CountdownTimer`
- Uses `useCountdown(targetDate)` hook
- 4 boxes: Days, Hours, Minutes, Seconds
- Each box: large number + label below
- Subtle flip/pulse animation on digit change
- When match starts: shows "MATCH IN PROGRESS! 🔴"

### `MatchCard`
- Glass card with hover lift
- Layout: `[HomeFlag] HomeName  score–score  AwayName [AwayFlag]`
- Below: local time, stadium/city, group badge
- `StatusBadge` in corner (color-coded)
- Live matches: pulsing red border + "LIVE" badge

### `StatusBadge`
- `upcoming` → blue pill
- `live` → red pill with pulse animation
- `finished` → gray pill

### `GroupCard`
- Header: "Group A" with gradient accent
- Table: Pos, Flag+Team, P, W, D, L, GF, GA, GD, Pts
- Rows: top 2 highlighted green (qualified), 3rd row yellow (potential)

---

## Step-by-Step Implementation Plan

### Phase 1: Project Setup (Step 1–3)

#### Step 1 — Scaffold Vite + React project
- `npx -y create-vite@latest ./ --template react`
- Install dependencies: `react-router-dom`
- Install Tailwind CSS v4: `@tailwindcss/vite` plugin

#### Step 2 — Configure Tailwind v4 + global styles
- Set up `index.css` with `@import "tailwindcss"` 
- Define CSS custom properties for the color palette
- Import Google Font "Outfit"
- Add global animation keyframes (pulse, fadeIn, slideUp, glow)
- Set `scrollbar-color` and selection styling

#### Step 3 — Build data files
- Create `src/data/matches.json` with all 48 group stage matches (real schedule data)
- Create `src/data/groups.json` with all 12 groups and team data
- Use confirmed kickoff times in UTC, real stadium/city names

---

### Phase 2: Core Infrastructure (Step 4–6)

#### Step 4 — Utility functions
- `src/utils/time.js`: `formatLocalTime(utcString)`, `getTimeUntil(utcString)`, `getNextMatch(matches)`
- `src/utils/matchHelpers.js`: `groupByStatus(matches)`, `sortByKickoff(matches)`, `filterByGroup(matches, group)`

#### Step 5 — Custom hooks
- `src/hooks/useCountdown.js`: takes a UTC target date, returns `{ days, hours, minutes, seconds, isExpired }`
- Updates every second via `setInterval`, cleans up on unmount

#### Step 6 — App shell + routing
- `App.jsx`: React Router with `<Navbar>` + `<Outlet>` + `<Footer>`
- Routes: `/` (Home), `/schedule` (Schedule), `/groups` (Groups), `/about` (About)
- Page transition fade animation

---

### Phase 3: UI Components (Step 7–12)

#### Step 7 — Navbar
- Sticky, backdrop-blur glass nav
- Desktop: horizontal links
- Mobile: hamburger menu + slide-in drawer
- Active route indicator

#### Step 8 — Hero + CountdownTimer
- Hero section with gradient background and stadium glow effect
- Next match display: team flags (from flagcdn), names, time, venue, group
- CountdownTimer with animated digit boxes

#### Step 9 — StatusBadge + MatchCard
- StatusBadge: 3 variants with appropriate colors
- MatchCard: glass card, flags, scores, local time, group/stage badge
- Live match: pulsing red border effect

#### Step 10 — MatchList
- Receives match array, groups into sections by status
- "🔴 Live Now", "⏰ Upcoming", "✅ Finished" section headers
- Responsive grid layout

#### Step 11 — GroupCard + TeamRow
- GroupCard: group header + standings table
- TeamRow: position, flag, team name, stats columns
- Qualification highlighting (top 2 green, 3rd yellow)

#### Step 12 — Footer
- Tournament info, data source credit
- Flagcdn attribution link
- Responsive layout

---

### Phase 4: Pages (Step 13–16)

#### Step 13 — HomePage
- Hero with countdown to next match
- "Upcoming Matches" preview (first 6)
- "View Full Schedule" CTA button

#### Step 14 — SchedulePage
- Group/stage filter dropdown
- Full match list with all sections
- Search/filter by team name (stretch)

#### Step 15 — GroupsPage
- All 12 groups in responsive grid
- Each group as a `GroupCard` with standings

#### Step 16 — AboutPage
- Project description
- Data sources and credits
- How to upgrade to live API
- Personal credits

---

### Phase 5: Polish & Deploy (Step 17–19)

#### Step 17 — Responsive pass
- Test all breakpoints (mobile 375px, tablet 768px, desktop 1280px)
- Ensure touch-friendly tap targets
- Test Arabic/Palestine timezone display (Asia/Hebron, +03:00)

#### Step 18 — SEO + meta tags
- `<title>` and `<meta description>` per page
- Favicon (soccer ball SVG)
- Open Graph tags for sharing

#### Step 19 — Build & deployment check
- `npm run build` → verify clean build
- Test production preview with `npm run preview`
- Ready for Vercel / Netlify / GitHub Pages deploy

---

## MVP Scope (v1.0)

What's IN the MVP:
- [x] All 48 group-stage matches with real data
- [x] Countdown timer to next match
- [x] Match cards with flags, local time, status
- [x] Group standings page (placeholder stats, updatable)
- [x] Responsive, mobile-first design
- [x] Fun World Cup visual theme
- [x] 4 pages: Home, Schedule, Groups, About
- [x] Static build, deployable anywhere

What's NOT in the MVP:
- [ ] Knockout stage matches (add later as tournament progresses)
- [ ] Live API integration
- [ ] Real-time score updates
- [ ] Push notifications
- [ ] Team detail pages
- [ ] Match detail pages with lineups / stats

---

## Nice Extra Features (Post-MVP)

| Feature | Effort | Value |
|---|---|---|
| **Live API integration** (worldcup26.ir) | Medium | High — real-time scores |
| **Knockout bracket visualization** | Medium | High — visual bracket tree |
| **Favorites / "My Teams"** (localStorage) | Low | Medium — personalization |
| **Dark/Light mode toggle** | Low | Medium — accessibility |
| **Share match on social** | Low | Medium — virality |
| **Score predictions game** | High | High — engagement |
| **PWA support** (offline, install) | Medium | Medium — mobile experience |
| **Team detail pages** | Medium | Medium — deeper content |
| **Match notifications** (browser Notification API) | Medium | High — engagement |
| **Animated knockout bracket** | High | High — wow factor |

---

## Future API Integration Path

For upgrading from static JSON to live data:

```
src/
├── services/
│   └── api.js          # Fetch wrapper with error handling
│   └── matchService.js # getMatches(), getGroups(), getMatch(id)
```

**Recommended free API**: [worldcup26.ir](https://worldcup26.ir/api-docs) — completely free, purpose-built for WC 2026.

**Fallback**: [football-data.org](https://www.football-data.org/) free tier (10 req/min, delayed scores).

**Integration strategy**:
1. Create a `services/` layer that wraps API calls
2. Components import from services instead of JSON directly
3. Add a feature flag: `const USE_LIVE_API = false`
4. When ready, flip the flag — components don't change
5. Add SWR or React Query for caching + polling

---

## Risks & Limitations

| Risk | Impact | Mitigation |
|---|---|---|
| **Static data goes stale** | Scores won't update live | Clear "last updated" timestamp; easy JSON update path; API upgrade plan ready |
| **flagcdn.com downtime** | Missing flag images | Flags are decorative, graceful fallback with alt text + country code |
| **Kickoff times change** | Wrong schedule displayed | UTC-based times with `Intl.DateTimeFormat`; easy to update JSON |
| **48-team format is new** | 3rd-place rules are complex | Keep standings simple in MVP; document rules in About page |
| **Tailwind v4 is newer** | Fewer community examples | CSS-first config is simpler; core utilities are stable |
| **No backend** | Can't handle user accounts or real-time | MVP is intentionally static; API layer is designed for future |

---

## Open Questions

> [!IMPORTANT]
> **Group B & D playoff spots**: The search results mention playoff winners for Groups B and D. Based on the latest data, Bosnia & Herzegovina won the Group B playoff and Türkiye won the Group D playoff. I'll use these as the confirmed teams. Please flag if different.

> [!NOTE]
> **Match count for MVP**: I plan to include all 48 group-stage matches (3 per group × 12 groups). Knockout stage matches can be added as the tournament progresses. Sound good?

> [!NOTE]
> **Favicon**: I'll create a simple soccer-ball SVG favicon. Would you prefer the official "26" tournament branding style instead?
