# ZhuuVIP

A deep-ocean themed VIP community platform — a clone of https://zhuu-site.vercel.app with added Zhuu AI chat powered by OpenAI.

## Tech Stack

- **Frontend**: React + TypeScript + Vite (artifact: `artifacts/zhuuvip/`)
- **Backend**: Node.js + Express (artifact: `artifacts/api-server/`)
- **Package manager**: pnpm monorepo
- **Styling**: Tailwind CSS v4 with custom ocean theme
- **Routing**: Wouter
- **AI**: OpenAI via Replit AI Integration (streaming SSE)

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, stats, feature grid, CTA |
| `/speedtest` | Speed Test | Download/upload/ping/jitter test |
| `/portfolio` | Portfolio | Projects, skills, contact |
| `/community` | Community | Discord, social platforms, guidelines |
| `/links` | Links | Curated resources by category |
| `/feedback` | Feedback | Feedback form with rating |
| `/ai` | Zhuu AI | Full-page AI chat (OpenAI GPT-4o) |

## Components

- `OceanCanvas` — animated WebGL-style canvas (bubbles, fish, light rays, ripples)
- `Navbar` — desktop + mobile responsive nav with all routes
- `BottomNav` — mobile bottom navigation bar
- `MusicPlayer` — background BGM player (Indila - Love Story)
- `UnderwaterMascot` — floating Zhuu avatar with speech bubble
- `ZhuuAIChat` — floating chat bubble (available on all non-AI pages)

## API Endpoints

- `GET /api/healthz` — health check
- `POST /api/openai/stream-chat` — streaming SSE AI chat (body: `{ messages: [{role, content}] }`)

## AI Integration

Uses Replit AI Integration for OpenAI:
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — proxied OpenAI base URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — managed API key
- Model selection: `gpt-4o` for code questions, `gpt-4o-mini` for general questions

## Assets

- `public/zhuu-avatar.jpg` — Zhuu anime character avatar
- `public/zhuu-logo.png` — Zhuu logo PNG
- `public/bgm.mp3` — Indila - Love Story background music

## Workflows

- `artifacts/zhuuvip: web` — Vite dev server on port 25102, preview path `/`
- `artifacts/api-server: API Server` — Express server on port 8080, path `/api`

## Design

- **Background**: `#050f14` dark ocean
- **Primary**: `hsl(185 100% 50%)` — neon cyan `#00ffff`
- **Font**: Inter + Poppins (Google Fonts)
- **Effects**: glassmorphism cards, neon glow, floating animations, bubble canvas
