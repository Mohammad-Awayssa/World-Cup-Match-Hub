# World Cup 2026 Match Hub — Implementation Plan v2

Build an interactive, shareable FIFA World Cup 2026 schedule website with a premium tournament atmosphere, live countdown, full 104-match schedule support, group standings, and a clean future path to live API data.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19 + Vite 6** | Fast dev, instant HMR, static build |
| Styling | **Tailwind CSS v4** (CSS-first config, `@theme` block) | Rapid, utility-first, modern CSS features |
| Routing | **React Router v7** (client-side, hash-based for static deploy) | Simple tabbed navigation, works on GitHub Pages |
| Date/Time | **Native `Intl.DateTimeFormat` + `Date`** | Browser timezone auto-detection, zero deps |
| Flags | **flagcdn.com** (free CDN, Cloudflare-backed) | `https://flagcdn.com/w80/{code}.png`, SVG also available |
| Font | **Google Fonts: "Outfit"** (headings) + **"Inter"** (body) | Modern, geometric, high readability |
| Deployment | **Static build** (`vite build`) | Deploy anywhere: Vercel / Netlify / GitHub Pages |
| Data (MVP) | **Local JSON files** in `src/data/` | Reliable, no network dependency |
| Data (future) | **Service layer abstraction** → plug in any API | Swap data source without touching components |

---

## 2. Future-Proof Match Data Model

### 2.1 Tournament Structure (All 104 Matches)

The data model supports the complete FIFA World Cup 2026 format from day one:

| Stage | Matches | Dates | Notes |
|---|---|---|---|
| **Group Stage** | 48 | Jun 11 – Jun 27 | 12 groups × 4 teams × 3 matches each ÷ 2 |
| **Round of 32** | 16 | Jun 28 – Jul 3 | Top 2 per group + 8 best 3rd-place |
| **Round of 16** | 8 | Jul 4 – Jul 7 | |
| **Quarter Finals** | 4 | Jul 9 – Jul 12 | |
| **Semi Finals** | 2 | Jul 15 – Jul 16 | |
| **Third Place** | 1 | Jul 18 | |
| **Final** | 1 | Jul 19 | MetLife Stadium, NJ |
| **Total** | **104** | | |

### 2.2 Match Schema — `matches.json`

```json
{
  "id": 1,
  "matchNumber": 1,
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
  "round": 1,
  "status": "upcoming",
  "homeScore": null,
  "awayScore": null,
  "homePenalties": null,
  "awayPenalties": null,
  "winner": null
}
```

#### Knockout Match with Placeholders

```json
{
  "id": 49,
  "matchNumber": 49,
  "homeTeam": "Runner-up Group A",
  "awayTeam": "Runner-up Group B",
  "homeCode": null,
  "awayCode": null,
  "kickoffUTC": "2026-06-28T20:00:00Z",
  "stadium": "TBD",
  "city": "TBD",
  "country": "USA",
  "group": null,
  "stage": "Round of 32",
  "round": null,
  "status": "upcoming",
  "homeScore": null,
  "awayScore": null,
  "homePenalties": null,
  "awayPenalties": null,
  "winner": null
}
```

### 2.3 Full Field Reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `number` | ✅ | Unique match ID (1–104) |
| `matchNumber` | `number` | ✅ | Official FIFA match number |
| `homeTeam` | `string` | ✅ | Full name OR placeholder (e.g. "Winner Group A") |
| `awayTeam` | `string` | ✅ | Full name OR placeholder |
| `homeCode` | `string \| null` | ❌ | ISO 3166-1 alpha-2 code. `null` for TBD knockout teams |
| `awayCode` | `string \| null` | ❌ | Same as above |
| `kickoffUTC` | `string` | ✅ | ISO 8601 UTC datetime |
| `stadium` | `string` | ✅ | FIFA tournament venue name or "TBD" |
| `city` | `string` | ✅ | Host city or "TBD" |
| `country` | `string` | ✅ | "USA" / "Mexico" / "Canada" |
| `group` | `string \| null` | ❌ | `"A"` – `"L"` for group stage, `null` for knockouts |
| `stage` | `string` | ✅ | One of: `"Group Stage"`, `"Round of 32"`, `"Round of 16"`, `"Quarter Finals"`, `"Semi Finals"`, `"Third Place"`, `"Final"` |
| `round` | `number \| null` | ❌ | Group round (1, 2, 3) or `null` |
| `status` | `string` | ✅ | `"upcoming"` / `"live"` / `"finished"` |
| `homeScore` | `number \| null` | ❌ | `null` if not yet played |
| `awayScore` | `number \| null` | ❌ | `null` if not yet played |
| `homePenalties` | `number \| null` | ❌ | Penalty shootout score (knockout only) |
| `awayPenalties` | `number \| null` | ❌ | Penalty shootout score (knockout only) |
| `winner` | `string \| null` | ❌ | `"home"` / `"away"` / `"draw"` / `null` |

> **Flags** are derived dynamically: `https://flagcdn.com/w80/${code}.png`
> When `homeCode` or `awayCode` is `null` (TBD knockout team), show a generic placeholder flag icon (e.g. a "?" shield).

### 2.4 Group Schema — `groups.json`

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
      "goalsFor": 0,
      "goalsAgainst": 0,
      "goalDifference": 0,
      "points": 0
    }
  ]
}
```

### 2.5 Confirmed Groups (All 12)

| Group | Team 1 | Team 2 | Team 3 | Team 4 |
|---|---|---|---|---|
| **A** | 🇲🇽 Mexico | 🇿🇦 South Africa | 🇰🇷 South Korea | 🇨🇿 Czechia |
| **B** | 🇨🇦 Canada | 🇧🇦 Bosnia & Herzegovina | 🇶🇦 Qatar | 🇨🇭 Switzerland |
| **C** | 🇧🇷 Brazil | 🇲🇦 Morocco | 🇭🇹 Haiti | 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland |
| **D** | 🇺🇸 USA | 🇵🇾 Paraguay | 🇦🇺 Australia | 🇹🇷 Türkiye |
| **E** | 🇩🇪 Germany | 🇨🇼 Curaçao | 🇨🇮 Côte d'Ivoire | 🇪🇨 Ecuador |
| **F** | 🇳🇱 Netherlands | 🇯🇵 Japan | 🇸🇪 Sweden | 🇹🇳 Tunisia |
| **G** | 🇧🇪 Belgium | 🇪🇬 Egypt | 🇮🇷 Iran | 🇳🇿 New Zealand |
| **H** | 🇪🇸 Spain | 🇨🇻 Cape Verde | 🇸🇦 Saudi Arabia | 🇺🇾 Uruguay |
| **I** | 🇫🇷 France | 🇸🇳 Senegal | 🇮🇶 Iraq | 🇳🇴 Norway |
| **J** | 🇦🇷 Argentina | 🇩🇿 Algeria | 🇦🇹 Austria | 🇯🇴 Jordan |
| **K** | 🇵🇹 Portugal | 🇨🇩 DR Congo | 🇺🇿 Uzbekistan | 🇨🇴 Colombia |
| **L** | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England | 🇭🇷 Croatia | 🇬🇭 Ghana | 🇵🇦 Panama |

### 2.6 Round of 32 Bracket Template

Pre-defined matchups (teams populate as group stage completes):

| Match # | Home Slot | Away Slot |
|---|---|---|
| 49 | Runner-up Group A | Runner-up Group B |
| 50 | Winner Group C | Runner-up Group F |
| 51 | Winner Group E | 3rd Place (A/B/C/D/F) |
| 52 | Winner Group F | Runner-up Group C |
| 53 | Runner-up Group E | Runner-up Group I |
| 54 | Winner Group I | 3rd Place (C/D/F/G/H) |
| 55 | Winner Group A | 3rd Place (C/E/F/H/I) |
| 56 | Winner Group L | 3rd Place (E/H/I/J/K) |
| 57 | Winner Group G | 3rd Place (A/E/H/I/J) |
| 58 | Winner Group D | 3rd Place (B/E/F/I/J) |
| 59 | Winner Group H | Runner-up Group J |
| 60 | Runner-up Group K | Runner-up Group L |
| 61 | Winner Group B | 3rd Place (E/F/G/I/J) |
| 62 | Runner-up Group D | Runner-up Group G |
| 63 | Winner Group J | Runner-up Group H |
| 64 | Winner Group K | 3rd Place (D/E/I/J/L) |

> **Architecture note**: Knockout matches use placeholder strings like `"Winner Group A"` for team names and `null` for country codes. The UI renders a `<PlaceholderFlag />` (shield with "?") when `homeCode` is null. When results come in, simply update the JSON — no structural refactoring needed.

### 2.7 Stadiums Reference — `stadiums.json` (optional, enrichment data)

```json
{
  "name": "Estadio Ciudad de Mexico",
  "city": "Mexico City",
  "country": "Mexico",
  "capacity": 87523,
  "image": null
}
```

16 venues across USA (11), Mexico (3), Canada (2).

---

## 3. API Integration Strategy

### 3.1 API Comparison

| Feature | **worldcup26.ir** | **football-data.org** | **API-Football** | **Sportmonks** |
|---|---|---|---|---|
| **Cost** | 🟢 100% Free | 🟢 Free tier / €12/mo live | 🟡 Free (100 req/day) | 🔴 Paid only |
| **WC 2026 coverage** | 🟢 Full (104 matches, 48 teams) | 🟢 Included in free tier | 🟡 May require paid plan | 🟢 Full |
| **Rate limits** | 🟢 Generous (community) | 🟡 10 req/min free | 🟡 10 req/min, 100/day | 🟢 High |
| **Live scores** | 🟢 Yes, real-time | 🔴 Delayed on free tier | 🟡 Check plan | 🟢 Yes |
| **Data format** | JSON REST | JSON REST | JSON REST | JSON REST |
| **Authentication** | JWT token | API key header | API key header | API key |
| **Open source** | 🟢 Yes | ❌ | ❌ | ❌ |
| **Documentation** | Swagger UI | Good docs | Excellent docs | Excellent |
| **Best for** | **Personal / hobby** | **Prototyping** | **Small prod apps** | **Enterprise** |

> [!TIP]
> **Recommendation**: Start with static JSON for MVP. When ready for live data, integrate **worldcup26.ir** first (free, purpose-built for WC 2026, open source). If you need a fallback or more reliable uptime, **football-data.org** free tier is solid for basic schedule data.

### 3.2 Service Layer Architecture

The key architectural decision: **components never import data directly**. They go through a service layer that abstracts the data source.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Components  │ ──→ │  DataProvider │ ──→ │  matchService   │
│  (React)     │     │  (Context)    │     │  (abstraction)  │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                          ┌────────┴────────┐
                                          │                 │
                                   ┌──────▼──────┐  ┌──────▼──────┐
                                   │ localAdapter │  │  apiAdapter  │
                                   │ (JSON files) │  │ (HTTP fetch) │
                                   └─────────────┘  └─────────────┘
```

#### Service Interface

```javascript
// src/services/matchService.js
const dataAdapter = USE_LIVE_API ? apiAdapter : localAdapter;

export const matchService = {
  getAllMatches:   () => dataAdapter.getAllMatches(),
  getMatchById:   (id) => dataAdapter.getMatchById(id),
  getMatchesByStage: (stage) => dataAdapter.getMatchesByStage(stage),
  getMatchesByDate:  (date) => dataAdapter.getMatchesByDate(date),
  getGroups:      () => dataAdapter.getGroups(),
  getGroupStandings: (group) => dataAdapter.getGroupStandings(group),
  getTeams:       () => dataAdapter.getTeams(),
};
```

#### Local Adapter (MVP)

```javascript
// src/services/adapters/localAdapter.js
import matchesData from '../../data/matches.json';
import groupsData from '../../data/groups.json';

export const localAdapter = {
  getAllMatches: async () => matchesData,
  getMatchById: async (id) => matchesData.find(m => m.id === id),
  // ... etc
};
```

#### API Adapter (Future)

```javascript
// src/services/adapters/apiAdapter.js
const BASE_URL = 'https://worldcup26.ir';

export const apiAdapter = {
  getAllMatches: async () => {
    const res = await fetch(`${BASE_URL}/get/games`, { headers });
    return transformApiResponse(await res.json());
  },
  // ... etc
};
```

### 3.3 Caching Strategy (for API mode)

| Concern | Approach |
|---|---|
| **Request dedup** | `DataProvider` React Context caches fetched data in state |
| **Stale-while-revalidate** | Show cached data instantly, refetch in background |
| **Polling for live matches** | When any match has `status: "live"`, poll every 30s |
| **Rate limit safety** | Minimum 6s between requests; queue if rate-limited |
| **Offline fallback** | If API fails, fall back to last cached data or static JSON |

### 3.4 Feature Flag

```javascript
// src/config.js
export const config = {
  USE_LIVE_API: false,       // flip to true when ready
  API_BASE_URL: 'https://worldcup26.ir',
  POLL_INTERVAL_MS: 30000,  // 30s for live matches
  CACHE_TTL_MS: 60000,      // 1min for general data
};
```

---

## 4. World Cup 2026 Visual Identity

> **Goal**: "Fans open the site and immediately feel World Cup excitement."

### 4.1 Color Palette

A curated palette that evokes the three host nations without copying official FIFA assets:

```css
@theme {
  /* === Primary Gradients === */
  --color-usa-blue:       #1B2A4A;    /* Deep navy — USA */
  --color-mexico-green:   #006847;    /* Rich emerald — Mexico */
  --color-canada-red:     #C8102E;    /* Vibrant maple — Canada */

  /* === Accent & Trophy === */
  --color-gold:           #FFD700;    /* Trophy gold */
  --color-gold-warm:      #F5A623;    /* Warm gold for hovers */
  --color-gold-shimmer:   #FFF1C1;    /* Light gold shimmer */

  /* === Surface System (Dark Glassmorphism) === */
  --color-bg-deep:        #050510;    /* Deepest background — near-black */
  --color-bg-base:        #0A0A1F;    /* Main background */
  --color-bg-elevated:    #111133;    /* Cards, elevated surfaces */
  --color-bg-glass:       rgba(255, 255, 255, 0.04);  /* Glass panels */
  --color-bg-glass-hover: rgba(255, 255, 255, 0.08);  /* Glass hover */
  --color-border-glass:   rgba(255, 255, 255, 0.08);  /* Subtle glass borders */
  --color-border-glow:    rgba(255, 215, 0, 0.15);    /* Gold glow borders */

  /* === Text Hierarchy === */
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #A0A0C0;
  --color-text-muted:     #6B6B8D;
  --color-text-gold:      #FFD700;

  /* === Status Colors === */
  --color-status-live:    #FF3B3B;    /* Pulsing red for LIVE */
  --color-status-upcoming:#3B82F6;    /* Blue for upcoming */
  --color-status-finished:#6B7280;    /* Gray for finished */
  --color-qualify-green:  rgba(34, 197, 94, 0.15);   /* Row highlight */
  --color-qualify-yellow: rgba(234, 179, 8, 0.10);   /* 3rd place row */
}
```

### 4.2 Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

@theme {
  --font-heading: 'Outfit', sans-serif;  /* Bold, geometric, sporty */
  --font-body:    'Inter', sans-serif;    /* Clean, high readability */
  --font-mono:    'JetBrains Mono', monospace;  /* Countdown digits */
}
```

| Element | Font | Weight | Size |
|---|---|---|---|
| Page title / Hero | Outfit | 900 (Black) | 3rem–4.5rem |
| Section headings | Outfit | 700 (Bold) | 1.5rem–2rem |
| Card team names | Outfit | 600 (Semibold) | 1rem–1.25rem |
| Body text | Inter | 400 (Regular) | 0.875rem–1rem |
| Labels / metadata | Inter | 500 (Medium) | 0.75rem |
| Countdown digits | Outfit | 800 (ExtraBold) | 2.5rem–4rem |

### 4.3 Animations & Effects

#### Keyframe Animations

| Animation | Usage | Duration | CSS |
|---|---|---|---|
| `fadeInUp` | Cards entering viewport | 0.5s ease-out | translate(0, 20px) → translate(0, 0) + opacity |
| `pulse-glow` | LIVE badge | 2s infinite | box-shadow pulsing red glow |
| `shimmer` | Gold accent lines, loading states | 2s linear infinite | Background gradient slide |
| `countdown-tick` | Countdown digit change | 0.3s | scaleY(0.8) → 1 + opacity flash |
| `gradient-shift` | Hero background | 15s ease infinite | Background-position animation |
| `float` | Decorative elements | 6s ease-in-out infinite | subtle Y translate |
| `border-glow` | Live match card | 3s ease infinite | border-color cycling |

#### Background Effects

```
┌─────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░  RADIAL GLOW (top-left): mexico-green, 30% op ░  │
│  ░                                                 ░  │
│  ░      RADIAL GLOW (top-right): usa-blue, 25%   ░  │
│  ░                                                 ░  │
│  ░  ▓▓▓ CSS noise texture overlay (2% opacity) ▓▓ ░  │
│  ░                                                 ░  │
│  ░   RADIAL GLOW (bottom-center): canada-red, 15% ░  │
│  ░                                                 ░  │
│  ░  Animated gradient: shifts position over 15s   ░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────┘
```

**Implementation**: Multiple `radial-gradient` layers on `body` or a `<BackgroundEffects />` component with CSS. NO heavy WebGL or canvas — pure CSS for performance.

#### Stadium Light Effect

- Two or three soft, large radial gradients positioned at the top of the hero section
- Slight animated opacity pulsing (like distant stadium floodlights)
- CSS `mix-blend-mode: screen` to create light bleed effect
- Subtle CSS noise texture (SVG data URI, 2% opacity) for depth

#### Particle Effect (Lightweight)

- CSS-only confetti/sparkle using `::before` and `::after` pseudo-elements on the Hero
- Small gold dots with `float` animation at different speeds/delays
- Maximum 8–12 pseudo-elements for performance
- Alternative: tiny SVG stars scattered with CSS animation

### 4.4 Card Design — "Collectible Tournament Card"

```
┌─────────────────────────────────────────┐
│  ┌─ Status Badge ──┐    Group A • R1    │  ← Header bar
│  │    UPCOMING     │                    │
│  └─────────────────┘                    │
│                                         │
│   🇲🇽                        🇿🇦         │  ← Large flags (48-64px)
│   Mexico          vs     South Africa   │  ← Team names (Outfit 600)
│                                         │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  ← Separator (gold gradient line)
│                                         │
│   📅 Wed, Jun 11 • 21:00               │  ← Local time (auto-detected)
│   🏟️  Estadio Ciudad de Mexico          │  ← Stadium + City
│   📍 Mexico City, Mexico                │
│                                         │
│   ░░░░░░░░░░ gold shimmer border ░░░░░  │  ← Bottom accent
└─────────────────────────────────────────┘

Styling:
- background: rgba(255,255,255,0.03) with backdrop-blur(12px)
- border: 1px solid rgba(255,255,255,0.06)
- border-radius: 16px
- Hover: lift 4px (translateY(-4px)), border glows gold
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Bottom border: 2px gold gradient (shimmer animation)
- Live matches: border pulses red, subtle red glow shadow
```

**Finished Match Card** (additional elements):

```
│   🇲🇽 Mexico      2 — 1    South Africa 🇿🇦  │  ← Scores visible
│   ✅ FINISHED                                  │  ← Gray badge
```

### 4.5 Hero Section Design

```
┌──────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════╗ │
│  ║  ☆ ☆ ☆  stadium light glows  ☆ ☆ ☆            ║ │
│  ║                                                  ║ │
│  ║         ⚽ FIFA WORLD CUP 2026                   ║ │
│  ║         "Match Hub"                              ║ │
│  ║         🇺🇸 🇲🇽 🇨🇦                               ║ │
│  ║                                                  ║ │
│  ║    ─── NEXT MATCH ───                            ║ │
│  ║                                                  ║ │
│  ║    🇲🇽  Mexico   vs   South Africa  🇿🇦           ║ │
│  ║                                                  ║ │
│  ║    📅 Wednesday, June 11 • 21:00                 ║ │
│  ║    🏟️  Estadio Ciudad de Mexico                  ║ │
│  ║    🏷️  Group A • Group Stage                     ║ │
│  ║                                                  ║ │
│  ║    ┌────────┬────────┬────────┬────────┐         ║ │
│  ║    │   01   │   12   │   30   │   45   │         ║ │
│  ║    │  DAYS  │  HRS   │  MINS  │  SECS  │         ║ │
│  ║    └────────┴────────┴────────┴────────┘         ║ │
│  ║                                                  ║ │
│  ╚══════════════════════════════════════════════════╝ │
│                                                      │
│  Animated gradient background shifting slowly        │
│  Noise texture overlay                               │
│  Gold sparkle pseudo-elements floating               │
└──────────────────────────────────────────────────────┘
```

**Key details**:
- Title uses Outfit 900 with subtle text-shadow glow
- "NEXT MATCH" label: uppercase, letter-spacing, gold color
- Countdown boxes: glass background, golden border, large Outfit digits
- When countdown hits 0: "🔴 MATCH IN PROGRESS!" with pulse animation
- Host nation flags displayed small (24px) as a subtle identity mark
- Mobile: stacks vertically, countdown boxes shrink proportionally

### 4.6 Mobile Experience

| Breakpoint | Layout | Special Adaptations |
|---|---|---|
| `< 640px` (mobile) | Single column, full-width cards | Compact hero, 2×2 countdown grid, hamburger nav, touch-friendly 44px min targets |
| `640–1024px` (tablet) | 2-column card grid | Medium hero, side-by-side team names |
| `> 1024px` (desktop) | 3-column card grid | Full hero, spacious layout |

**Mobile-first CSS**: All styles default to mobile, use `@media (min-width: ...)` to scale up.

**Touch interactions**: Cards have `:active` states with scale(0.98) for tactile feedback. No hover-dependent functionality.

---

## 5. Home Page Design — The Centerpiece

The HomePage is divided into 5 distinct sections, each with clear purpose:

### Section Layout

```
┌──────────────────────────────────────┐
│  1. HERO + COUNTDOWN (full width)    │  ← Always visible, eye-catching
├──────────────────────────────────────┤
│  2. TODAY'S MATCHES (if any)         │  ← Highlighted in gold border
├──────────────────────────────────────┤
│  3. UPCOMING MATCHES (next 6)        │  ← Primary engagement section
├──────────────────────────────────────┤
│  4. QUICK GROUPS OVERVIEW            │  ← Horizontal scroll cards
├──────────────────────────────────────┤
│  5. TOURNAMENT STATS                 │  ← Fun stats bar
├──────────────────────────────────────┤
│  FOOTER                             │
└──────────────────────────────────────┘
```

### Section Details & MVP Classification

| # | Section | Description | MVP? |
|---|---|---|---|
| 1 | **Hero + Countdown** | Next match spotlight with countdown timer, team flags, date/time, stadium | ✅ MVP |
| 2 | **Today's Matches** | Matches happening today, highlighted with gold border. Shows "No matches today" if none | ✅ MVP |
| 3 | **Upcoming Matches** | Next 6 upcoming matches as cards + "View Full Schedule" CTA | ✅ MVP |
| 4 | **Quick Groups** | 12 compact group pills/cards in a scrollable row, click → groups page with that group highlighted | ✅ MVP |
| 5 | **Tournament Stats** | 4 stat boxes: "Total Matches: 104", "Teams: 48", "Venues: 16", "Host Countries: 3" | ✅ MVP |
| — | Host Country Highlights | USA/Mexico/Canada showcase with photos | ❌ v1.1 |
| — | World Cup Facts Carousel | Random fun facts cycling with fade | ❌ v1.1 |
| — | Recent Results | Last 3 finished matches | ❌ v1.1 |

### Today's Matches — Detail

```
┌─────── TODAY'S MATCHES ───────────────────────┐
│  🔴 Jun 11                                    │
│  ┌─────────────┐  ┌─────────────┐             │
│  │  MX vs ZA   │  │  KR vs CZ   │             │
│  │  21:00      │  │  03:00+1    │             │
│  │  Group A    │  │  Group A    │             │
│  └─────────────┘  └─────────────┘             │
└───────────────────────────────────────────────┘
```

- Uses the user's browser timezone to determine "today"
- If a match is LIVE, it gets a pulsing red border and appears first
- If no matches today, show: "No matches today. Next match in X days."

---

## 6. User Experience Features — Prioritized

### Classification: MVP / v1.1 / Future

| Feature | Tier | Effort | Value | Implementation Notes |
|---|---|---|---|---|
| **Timezone auto-detection** | ✅ MVP | Low | High | `Intl.DateTimeFormat().resolvedOptions().timeZone` — zero config |
| **Favorite teams** | ✅ MVP | Low | High | `useLocalStorage('favorites', [])` hook; star toggle on cards; filter "My Matches" |
| **Stage/Group filter** (Schedule) | ✅ MVP | Low | High | Dropdown: All / Group A–L / Round of 32 / etc. |
| **Team search** (Schedule) | ✅ MVP | Low | Medium | Text input → filter matches by team name (case-insensitive) |
| **Share match** | 🔷 v1.1 | Low | Medium | Web Share API (`navigator.share`) with fallback to clipboard copy |
| **"My Matches" filtered view** | 🔷 v1.1 | Low | Medium | Show only matches for favorited teams |
| **Recently viewed matches** | 🔷 v1.1 | Low | Low | Track last 5 viewed match IDs in localStorage |
| **Match detail modal** | 🔷 v1.1 | Medium | Medium | Click card → modal with extended info |
| **Knockout bracket visualization** | 🔷 v1.1 | Medium | High | SVG bracket tree, connected with lines |
| **Dark/Light mode toggle** | 🔷 v1.1 | Medium | Medium | CSS variables swap + localStorage pref |
| **Match reminders** | 🔶 Future | Medium | High | Browser Notification API + scheduled alarm |
| **PWA support** | 🔶 Future | Medium | Medium | Service worker, offline mode, installable |
| **Score predictions** | 🔶 Future | High | High | User predictions with points system |
| **Animated bracket** | 🔶 Future | High | High | Bracket with team logos flowing through rounds |
| **Multi-language** | 🔶 Future | High | Medium | i18n with English + Arabic |

### Favorites Feature (MVP Detail)

```jsx
// Hook: useLocalStorage.js
const [favorites, setFavorites] = useLocalStorage('wc2026-favorites', []);

// Toggle: MatchCard.jsx
<button onClick={() => toggleFavorite(match.homeCode)}>
  {isFavorited(match.homeCode) ? '★' : '☆'}
</button>

// Filter: SchedulePage.jsx
const filtered = showMyMatches
  ? matches.filter(m => favorites.includes(m.homeCode) || favorites.includes(m.awayCode))
  : matches;
```

- Star icon on each team flag in match cards
- "★ My Teams" toggle button on Schedule page
- Stored in localStorage, persists across sessions
- Also used in groups page: favorited teams get a subtle gold highlight

---

## 7. Project Architecture (Revised)

### 7.1 Critique of Original Architecture

| Issue | Problem | Fix |
|---|---|---|
| Flat `components/` | All components at same level, hard to find | Group by feature/domain |
| No service layer | Components import JSON directly | Add `services/` with adapter pattern |
| No data context | Props drilling for match data | Add `DataProvider` context |
| No `config.js` | Feature flags hardcoded | Centralized config |
| Missing error/loading states | No skeleton screens | Add `LoadingCard`, `ErrorBoundary` |
| No constants file | Magic strings everywhere | Add `constants.js` for stages, statuses |

### 7.2 Improved Architecture

```
world-cup-2026-match-hub/
├── index.html                      # Entry HTML with meta tags + OG tags
├── package.json
├── vite.config.js                  # Vite + React + Tailwind v4 plugins
├── public/
│   ├── favicon.svg                 # ⚽ Soccer ball SVG favicon
│   └── og-image.png               # Open Graph share image (generated)
│
├── src/
│   ├── main.jsx                    # React DOM entry
│   ├── App.jsx                     # Router + Layout shell
│   ├── index.css                   # Tailwind v4 @import + @theme + globals
│   ├── config.js                   # Feature flags, API URLs, timing
│   ├── constants.js                # STAGES, STATUSES, GROUP_LETTERS enums
│   │
│   ├── data/                       # Static JSON data (MVP source)
│   │   ├── matches.json            # All 104 matches
│   │   ├── groups.json             # 12 groups + team standings
│   │   └── stadiums.json           # 16 venues (optional enrichment)
│   │
│   ├── services/                   # Data abstraction layer
│   │   ├── matchService.js         # Public API: getAllMatches, getGroups, etc.
│   │   └── adapters/
│   │       ├── localAdapter.js     # Reads from JSON files
│   │       └── apiAdapter.js       # Fetches from live API (future)
│   │
│   ├── context/
│   │   └── DataProvider.jsx        # React Context: loads data, provides to tree
│   │
│   ├── hooks/
│   │   ├── useCountdown.js         # Countdown timer (1s interval)
│   │   ├── useLocalStorage.js      # Persistent state in localStorage
│   │   ├── useMatchData.js         # Convenience hook for DataProvider context
│   │   └── useFavorites.js         # Favorite teams management
│   │
│   ├── utils/
│   │   ├── time.js                 # formatLocalTime, getTimeUntil, isToday
│   │   ├── matchHelpers.js         # groupByStatus, sortByKickoff, filterByStage
│   │   └── flagUrl.js              # getFlagUrl(code) → flagcdn URL or placeholder
│   │
│   ├── components/                 # Shared, reusable UI components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Sticky glass nav with mobile drawer
│   │   │   ├── Footer.jsx          # Credits, data source
│   │   │   └── PageLayout.jsx      # Wrapper: page title + content area
│   │   ├── match/
│   │   │   ├── MatchCard.jsx       # Single match card (the collectible card)
│   │   │   ├── MatchList.jsx       # Grid of MatchCards with section headers
│   │   │   ├── MatchScore.jsx      # Score display (handles null/penalties)
│   │   │   └── StatusBadge.jsx     # Upcoming/Live/Finished pill
│   │   ├── countdown/
│   │   │   ├── CountdownTimer.jsx  # 4-box countdown display
│   │   │   └── CountdownBox.jsx    # Single digit box with label
│   │   ├── group/
│   │   │   ├── GroupCard.jsx       # Group header + standings table
│   │   │   └── TeamRow.jsx         # Flag + team name + stats row
│   │   ├── hero/
│   │   │   ├── Hero.jsx            # Full hero section orchestrator
│   │   │   ├── NextMatch.jsx       # Next match display within hero
│   │   │   └── BackgroundEffects.jsx # Stadium lights + gradients
│   │   ├── common/
│   │   │   ├── FlagImage.jsx       # Flag img with fallback for null codes
│   │   │   ├── LoadingCard.jsx     # Skeleton shimmer card
│   │   │   ├── FavoriteButton.jsx  # Star toggle button
│   │   │   ├── StageFilter.jsx     # Dropdown filter for stage/group
│   │   │   └── SearchInput.jsx     # Team search input
│   │   └── stats/
│   │       └── TournamentStats.jsx # 4 stat boxes (matches, teams, venues, etc.)
│   │
│   └── pages/
│       ├── HomePage.jsx            # Hero + Today + Upcoming + Groups + Stats
│       ├── SchedulePage.jsx        # Full schedule with filters + search
│       ├── GroupsPage.jsx          # All 12 group cards
│       └── AboutPage.jsx           # Data source, credits, API info
```

### 7.3 Architecture Decisions

| Decision | Rationale |
|---|---|
| **Components grouped by domain** (`match/`, `group/`, `hero/`) | Easier to locate related code; scales better than flat list |
| **`DataProvider` context** | Single data fetch on mount; all children access via `useMatchData()` hook; avoids prop drilling |
| **Service adapter pattern** | Swap JSON → API by changing one import in `matchService.js`; components are 100% agnostic |
| **`FlagImage` component** | Handles null codes (TBD knockout teams) gracefully with placeholder SVG |
| **`constants.js`** | No magic strings; `STAGES.GROUP`, `STATUS.LIVE` etc. |
| **Separate `MatchScore`** | Handles regular scores, penalty scores, null scores — complex enough to deserve its own component |
| **No global state library** | React Context + `useReducer` is sufficient for this app size. Adding Zustand/Redux would be over-engineering |

### 7.4 Scalability Assessment

| Concern | Assessment | Mitigation |
|---|---|---|
| **104 matches rendering** | All 104 fit in memory easily (~15KB JSON) | No virtualization needed |
| **Re-renders** | DataProvider memoizes data; MatchCard uses `React.memo` | Performance should be fine |
| **Bundle size** | React + Router + Tailwind ≈ ~60KB gzip | Well under budget |
| **Image loading** | 96 flag images (48 teams × 2 sizes) from CDN | `loading="lazy"` + CDN caching |
| **Countdown timer** | Single `setInterval`, 1s tick | Minimal CPU; paused when tab hidden (`visibilitychange`) |

---

## 8. Step-by-Step Implementation Plan

### Phase 1: Foundation (Steps 1–4)

#### Step 1 — Scaffold Vite + React project
- Run: `npx -y create-vite@latest ./ --template react`
- Install: `npm install react-router-dom`
- Install Tailwind v4: `npm install tailwindcss @tailwindcss/vite`
- Configure `vite.config.js` with both plugins
- Clean up default Vite boilerplate files

#### Step 2 — Design system in `index.css`
- `@import "tailwindcss"`
- `@theme { }` block with full color palette from Section 4.1
- Google Fonts imports (Outfit + Inter)
- Global animation keyframes (fadeInUp, pulse-glow, shimmer, gradient-shift, float)
- Custom utility classes for glass panels, gold borders
- Scrollbar styling, selection color, smooth scroll
- Noise texture SVG background
- Base body styling with stadium light gradients

#### Step 3 — Build all data files
- `src/data/matches.json`: All 48 group stage matches with real UTC kickoff times + 56 knockout matches with placeholder teams
- `src/data/groups.json`: All 12 groups with confirmed teams and zeroed standings
- `src/data/stadiums.json`: 16 venues with city, country, capacity
- `src/constants.js`: Stage names, status values, group letters

#### Step 4 — Config + utilities
- `src/config.js`: Feature flags, API URL, timing constants
- `src/utils/time.js`: `formatLocalTime()`, `getTimeUntil()`, `isToday()`, `getNextMatch()`
- `src/utils/matchHelpers.js`: `groupByStatus()`, `sortByKickoff()`, `filterByStage()`, `filterByTeam()`
- `src/utils/flagUrl.js`: `getFlagUrl(code)` → flagcdn URL or placeholder path

---

### Phase 2: Data + Infrastructure (Steps 5–7)

#### Step 5 — Service layer
- `src/services/adapters/localAdapter.js`: Read from JSON, return promises
- `src/services/matchService.js`: Public API wrapping adapter
- All methods return Promises (ready for async API swap)

#### Step 6 — Context + hooks
- `src/context/DataProvider.jsx`: Fetch data on mount, store in state, provide via context
- `src/hooks/useMatchData.js`: `const { matches, groups, loading } = useMatchData()`
- `src/hooks/useCountdown.js`: Returns `{ days, hours, minutes, seconds, isExpired }`
- `src/hooks/useLocalStorage.js`: Generic localStorage persistence
- `src/hooks/useFavorites.js`: Toggle/check favorites, backed by useLocalStorage

#### Step 7 — App shell + routing
- `src/App.jsx`: `<DataProvider>` → `<BrowserRouter>` → `<Navbar>` + `<Routes>` + `<Footer>`
- Routes: `/` → HomePage, `/schedule` → SchedulePage, `/groups` → GroupsPage, `/about` → AboutPage
- `HashRouter` for static deploy compatibility

---

### Phase 3: Core Components (Steps 8–14)

#### Step 8 — Layout components
- `Navbar`: Sticky, backdrop-blur glass, links with active indicator, mobile hamburger + drawer
- `Footer`: Credits, flagcdn attribution, data source link
- `PageLayout`: Wraps pages with consistent title + padding

#### Step 9 — Common components
- `FlagImage`: `<img>` with flagcdn URL; shows placeholder SVG when code is null
- `StatusBadge`: Color-coded pill (blue/red-pulse/gray)
- `FavoriteButton`: Gold star toggle
- `LoadingCard`: Shimmer skeleton card

#### Step 10 — Hero section
- `BackgroundEffects`: Stadium lights + animated gradients (CSS-only)
- `NextMatch`: Team flags, names, date/time, venue, group badge
- `Hero`: Orchestrates BackgroundEffects + title + NextMatch + CountdownTimer
- `CountdownTimer` + `CountdownBox`: Animated digit display

#### Step 11 — Match components
- `MatchScore`: Renders score or "vs" or penalty score
- `MatchCard`: Full collectible card with glass styling, hover effects, favorite button
- `MatchList`: Grid layout with section headers ("🔴 Live", "⏰ Upcoming", "✅ Finished")

#### Step 12 — Group components
- `TeamRow`: Flag + team name + P/W/D/L/GF/GA/GD/Pts
- `GroupCard`: Group header + table + qualification highlights

#### Step 13 — Filter components
- `StageFilter`: Dropdown to filter by stage or group
- `SearchInput`: Text input for team name search

#### Step 14 — Stats component
- `TournamentStats`: 4 glass stat boxes with icons + numbers + labels

---

### Phase 4: Pages (Steps 15–18)

#### Step 15 — HomePage
- Hero section with countdown
- "Today's Matches" section (gold-bordered if matches exist)
- "Upcoming Matches" (next 6 cards) + "View Full Schedule" CTA
- Quick Groups overview (12 compact group pills in scrollable row)
- Tournament Stats bar

#### Step 16 — SchedulePage
- StageFilter dropdown + SearchInput
- "★ My Teams" toggle (favorites filter)
- MatchList with all matches, sectioned by status
- Upcoming sorted soonest-first, finished sorted most-recent-first

#### Step 17 — GroupsPage
- 12 GroupCards in responsive grid (1→2→3 cols)
- Qualification legend: green = auto-qualify (top 2), yellow = potential 3rd place

#### Step 18 — AboutPage
- Project description
- Data sources: flagcdn, static JSON
- API upgrade path explanation
- Personal credits

---

### Phase 5: Polish + Deploy (Steps 19–22)

#### Step 19 — Responsive testing
- Test: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (laptop), 1920px (desktop)
- Verify Arabic/Palestine timezone: `Asia/Hebron` (+03:00) and `Asia/Gaza` (+02:00)
- Test RTL layout doesn't break (even without full RTL support)

#### Step 20 — Favorites feature
- Star toggles on match cards
- "My Teams" filter on schedule page
- Gold highlight on favorited teams in groups page
- Persistence via localStorage

#### Step 21 — SEO + sharing
- `<title>`: "World Cup 2026 Match Hub — Live Schedule & Countdown"
- `<meta name="description">`: Compelling description
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Favicon (SVG soccer ball)
- Generate OG share image

#### Step 22 — Build + deploy verification
- `npm run build` → verify clean build, no errors
- `npm run preview` → test production bundle locally
- Check: all flags load, countdown works, timezone correct
- Ready for Vercel / Netlify / GitHub Pages deploy

---

## 9. Verification Plan

### Automated Checks
```bash
npm run build          # Clean build, no errors/warnings
npm run preview        # Production preview server
```

### Manual Verification
| Check | Method |
|---|---|
| Countdown accuracy | Compare displayed countdown with manual calculation to opening match |
| Timezone display | Test in browser with different timezone settings (Chrome DevTools → Sensors) |
| All 104 matches render | Scroll through schedule page, verify no missing cards |
| All 12 groups render | Groups page shows all 12 with correct teams |
| Mobile layout | Chrome DevTools responsive mode at 375px, 390px |
| Flag images load | Verify no broken images; check TBD teams show placeholder |
| Favorites persist | Add favorites, refresh page, verify they remain |
| Filter works | Test stage filter, team search, "My Teams" toggle |
| Performance | Lighthouse audit: target 90+ on Performance, Accessibility |
| Live badge | Temporarily set a match to `"live"` status, verify pulsing red card |

---

## 10. Risks & Limitations

| Risk | Impact | Severity | Mitigation |
|---|---|---|---|
| **Static data goes stale** | Scores/schedule won't update automatically | High | Clear "last updated" timestamp; easy JSON update; API swap ready |
| **flagcdn.com CDN downtime** | Missing flag images | Low | Flags are decorative; `alt` text fallback; country code text backup |
| **Kickoff times change** | Wrong times displayed | Medium | All times stored as UTC; easy to update JSON; `Intl` handles DST |
| **3rd-place advance rules** | Complex bracket logic (495 scenarios) | Medium | MVP: use placeholder text; update manually when known |
| **Tailwind v4 newer** | Fewer Stack Overflow answers | Low | CSS-first config is simpler; core utilities are stable and documented |
| **No backend** | Can't handle user accounts / real-time | Low | Intentionally static; favorites use localStorage; API layer ready |
| **104 matches = large JSON** | Initial load size | Low | ~25KB gzip; well under any performance budget |
| **Palestine timezone edge case** | Gaza (+02) vs Hebron (+03) vary | Low | `Intl.DateTimeFormat` handles both correctly via browser |

---

## 11. Instructions for Codex

> This section is designed to be used as a comprehensive prompt/reference for code generation.

### 11.1 Exact Technologies

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 6.x | Build tool + dev server |
| Tailwind CSS | 4.x | Styling (CSS-first config, `@tailwindcss/vite` plugin) |
| React Router | 7.x (`react-router-dom`) | Client-side routing (use `HashRouter` for static deploy) |
| Node.js | 20+ | Runtime (dev only) |

### 11.2 Required Libraries

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "vite": "^6.0.0"
  }
}
```

**Zero additional runtime dependencies.** No date library, no state manager, no UI component library. Everything is built with React + Tailwind + native browser APIs.

### 11.3 Design Requirements

1. **Color System**: Use the exact color palette defined in Section 4.1. Dark glassmorphism theme with deep navy backgrounds, glass panels (`rgba(255,255,255,0.04)` + `backdrop-blur(12px)`), gold accents (#FFD700).

2. **Typography**: Google Fonts "Outfit" (headings, 600-900 weight) and "Inter" (body, 400-600 weight). Import in CSS. Use rem units. Hero title: 3rem mobile → 4.5rem desktop.

3. **Cards**: Glass card style — semi-transparent bg, blur, 1px border `rgba(255,255,255,0.06)`, 16px border-radius. Hover: translateY(-4px) + gold border glow. Transition: 0.3s cubic-bezier.

4. **Animations**: All animations defined in CSS `@keyframes`. fadeInUp for card entrance. pulse-glow for live badge. shimmer for gold accents. gradient-shift for hero background. No JavaScript animation libraries.

5. **Background**: Multiple layered radial gradients on body: mexico-green (top-left, 30% opacity), usa-blue (top-right, 25%), canada-red (bottom-center, 15%). Add a 2% opacity noise texture via SVG data URI. Optional: slow animated gradient-position shift.

6. **Stadium lights**: Large, soft radial gradients near top of hero section. Slight animated opacity pulse. Use `mix-blend-mode: screen`.

7. **Icons**: Use emoji for icons (⚽📅🏟️📍🏷️★☆) — no icon library needed. StatusBadge uses text + colored background.

8. **Flags**: Always use `https://flagcdn.com/w80/{code}.png` for standard flags and `https://flagcdn.com/w40/{code}.png` for small flags. When code is `null`, render a gray shield placeholder SVG.

### 11.4 Performance Requirements

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 90+ |
| First Contentful Paint | < 1.5s |
| Bundle size (gzipped) | < 100KB total |
| Flag images | `loading="lazy"` on all below-the-fold |
| Countdown timer | Pause when tab hidden (`document.visibilityState`) |
| No layout shift | Reserve space for images, use aspect-ratio |

### 11.5 Mobile Responsiveness Requirements

- **Mobile-first CSS**: Default styles target mobile (< 640px). Use `min-width` media queries to scale up.
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Touch targets**: Minimum 44×44px for all interactive elements
- **Card grid**: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- **Hero**: Full-width on all sizes. Countdown boxes shrink proportionally on mobile.
- **Nav**: Full links on desktop → hamburger + slide-in drawer on mobile (< 768px)
- **Tables** (group standings): Horizontal scroll on mobile with sticky team name column
- **Font sizing**: Clamp for fluid typography: `clamp(1rem, 2.5vw, 1.25rem)`

### 11.6 Accessibility Requirements

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
- Single `<h1>` per page, proper heading hierarchy
- All images have `alt` text (e.g., "Mexico flag", "Placeholder team")
- Color contrast ratio: minimum 4.5:1 for text on backgrounds
- Focus visible styles: gold outline on interactive elements (not just browser default)
- `aria-label` on icon-only buttons (favorite star, hamburger menu)
- `aria-live="polite"` on countdown timer for screen reader updates
- Keyboard navigable: Tab through all interactive elements
- `prefers-reduced-motion`: Disable animations when user prefers reduced motion

### 11.7 Deployment Requirements

- **Build command**: `npm run build` → outputs to `dist/`
- **Router**: Use `HashRouter` from `react-router-dom` so deep links work on static hosts without server configuration
- **Base path**: Set `base: './'` in `vite.config.js` for relative asset paths
- **OG Image**: Include a static `og-image.png` (1200×630) in `public/`
- **Favicon**: Include `favicon.svg` in `public/`
- **No server required**: 100% static files, no SSR, no API calls in MVP
- **Compatible hosts**: Vercel, Netlify, GitHub Pages, Cloudflare Pages, any static host

### 11.8 Code Quality Requirements

- All components are **functional components** using hooks
- Use **React.memo** on MatchCard and TeamRow (rendered many times)
- Use **`useCallback`** for event handlers passed to memoized children
- **No `any` types** if TypeScript is used (but TypeScript is optional for MVP)
- **No inline styles** — use Tailwind utility classes exclusively
- **No `!important`** in CSS
- Keep components under 150 lines; extract sub-components when larger
- All data access through `useMatchData()` hook — never import JSON directly in components
- Use named exports for components, default export for pages

### 11.9 File Naming Conventions

- Components: `PascalCase.jsx` (e.g., `MatchCard.jsx`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useCountdown.js`)
- Utilities: `camelCase.js` (e.g., `matchHelpers.js`)
- Data: `camelCase.json` (e.g., `matches.json`)
- Pages: `PascalCase.jsx` (e.g., `HomePage.jsx`)

---

## 12. Open Questions

> [!IMPORTANT]
> **Group B & D playoff outcomes**: Research indicates Bosnia & Herzegovina and Türkiye won their respective playoffs. The data files will use these teams. Flag if any different.

> [!NOTE]
> **Match count**: The `matches.json` file will contain all 104 matches. The 48 group-stage matches will have full real data (teams, times, venues). The 56 knockout matches will use placeholder team names and approximate dates. This is by design — no refactoring needed when real data arrives.

> [!NOTE]
> **TypeScript**: The plan uses `.jsx` (JavaScript) for simplicity and speed. TypeScript could be added later but is not required for MVP. Should I use TypeScript from the start instead?
