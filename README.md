# World Cup 2026 Match Hub

A fan-made FIFA World Cup 2026 schedule website built with React, Vite, and Tailwind CSS all using  Codex.

Features:
- Countdown to next match
- Full tournament schedule
- Local timezone conversion
- Group standings
- Mobile-first design

Live Demo:
https://world-cup-match-hub.vercel.app

## Live scores API

The Vercel Function at `/api/live-scores` keeps the football-data.org API key
server-side and falls back to worldcup26.ir if the primary provider fails.

Supported endpoints:

- `/api/live-scores` - football-data.org with automatic fallback
- `/api/live-scores?source=football-data` - test football-data.org only
- `/api/live-scores?source=worldcup26` - test worldcup26.ir only

### Local environment

Create `.env.local` in the project root:

```env
FOOTBALL_DATA_API_KEY=your_real_key_here
```

Use `vercel dev` when testing the API endpoint locally. Normal `npm run dev`
continues to run the Vite frontend, but it does not emulate Vercel Functions.

### Vercel environment

In the Vercel project, open **Settings > Environment Variables** and add:

- Name: `FOOTBALL_DATA_API_KEY`
- Value: your football-data.org API key
- Environments: Production, Preview, and Development

Redeploy after adding or changing the variable.
