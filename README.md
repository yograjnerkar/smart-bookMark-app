# Smart Bookmark App

A real-time bookmark manager built with **Next.js 16** (App Router), **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**.

## Features

- ✅ **Google OAuth** sign-in (no email/password)
- ✅ **Add bookmarks** with URL + title
- ✅ **Private bookmarks** — each user sees only their own
- ✅ **Real-time sync** — changes appear across tabs instantly
- ✅ **Delete bookmarks** with one click
- ✅ **Premium dark UI** with glassmorphism, animations, and favicons

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com/dashboard)
2. Enable **Google** auth provider (Authentication → Providers → Google)
3. Run the SQL from `supabase-setup.sql` in the SQL Editor (see below)
4. Enable **Realtime** on the `bookmarks` table (Database → Replication)

### 3. Configure environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Run this in Supabase SQL Editor:

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);
```

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add the Vercel URL to Google Cloud Console authorized redirect URIs
5. Set the Vercel URL as Supabase **Site URL** (Authentication → URL Configuration)

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (Auth, Database, Realtime)
- [Tailwind CSS 4](https://tailwindcss.com/)
