# ZhuuVIP — Vercel Deployment Guide

## Setup

1. Push this folder to a new GitHub repo
2. Import the repo in Vercel (vercel.com/new)
3. Vercel auto-detects the Vite framework — click **Deploy**

## Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_BASE_URL` | (Optional) Custom OpenAI base URL. Defaults to `https://api.openai.com/v1` |

## Notes
- The AI chat endpoint runs as a Vercel Edge Function (`/api/openai/stream-chat`)
- Background music (`bgm.mp3`) is served from `public/`
- All routes (SPA) are handled via `vercel.json` rewrites
