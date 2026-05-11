# ZhuuVIP

Deep-ocean themed VIP community platform with AI chat, speed test, portfolio, linktree, community links, and more.

## Stack
- **Frontend**: React 18 + Vite + TailwindCSS v4 + shadcn/ui
- **Auth**: Clerk (email, Google, GitHub)
- **AI**: OpenAI → Claude → DeepSeek → Gemini → Pollinations (auto fallback)
- **Database**: PostgreSQL via Drizzle ORM
- **Hosting**: Vercel (frontend + API serverless functions)

## Admin Panel Features
- **Linktree** — manage links shown on the /linktree page
- **Community** — manage platform cards shown on the /community page (Discord, Instagram, etc.)
- **Sounds** — manage background music tracks in the player
- **Feedback** — read and manage user feedback submissions
- **Settings** — site title, description, announcement banner

## Deploy to Vercel

### 1. Upload to GitHub
Push this repo to your GitHub account.

### 2. Set up Database
Create a free PostgreSQL database at [neon.tech](https://neon.tech). Run this SQL:

```sql
CREATE TABLE linktree_links (
  id SERIAL PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT,
  url TEXT NOT NULL, icon TEXT, icon_type TEXT DEFAULT 'emoji',
  color TEXT DEFAULT '#00e5ff', badge TEXT,
  sort_order INTEGER DEFAULT 0, active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE sounds (
  id SERIAL PRIMARY KEY, title TEXT NOT NULL, artist TEXT,
  url TEXT NOT NULL, cover TEXT, active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY, type TEXT DEFAULT 'general',
  rating INTEGER, name TEXT, email TEXT,
  message TEXT NOT NULL, read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE community_links (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL,
  icon TEXT DEFAULT '🌐', description TEXT,
  url TEXT NOT NULL, members TEXT DEFAULT '',
  btn_text TEXT DEFAULT 'Visit', color TEXT DEFAULT '#00e5ff',
  badge TEXT, sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);
```

Seed default community links (optional):
```sql
INSERT INTO community_links (name, icon, description, url, members, btn_text, color, badge, sort_order)
VALUES
  ('Discord', '💬', 'Join our main hub!', 'https://discord.gg/YOUR_INVITE', '500+', 'Join Discord', '#7289da', 'Most Active', 1),
  ('Instagram', '📸', 'Follow for daily updates.', 'https://instagram.com/YOUR_HANDLE', '2K+', 'Follow', '#e1306c', NULL, 2);
```

### 3. Set up Clerk
- Create a new app at [clerk.com](https://clerk.com)
- Copy your **Publishable Key** and **Secret Key**

### 4. Deploy on Vercel
- Import from GitHub at [vercel.com](https://vercel.com)
- Set **Framework Preset** to `Vite`
- Add these Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Password for /admin panel |
| `OPENAI_API_KEY` | No | OpenAI key for AI chat |
| `ANTHROPIC_API_KEY` | No | Claude key |
| `DEEPSEEK_API_KEY` | No | DeepSeek key |
| `GEMINI_API_KEY` | No | Gemini key |

- Deploy!

## Local Development
```bash
npm install
cp .env.example .env.local
# Fill in values, then:
npm run dev
```

## Admin Panel
Go to `/admin` and enter your `ADMIN_PASSWORD`.
Default password: `zhuu2026admin`
