# Feedback setup (Vercel + Supabase)

The feedback widget (the "Send feedback" icon in the toolbar) posts to
`/api/feedback`, which inserts one row into a Supabase table. No login is
required from visitors. Follow these one-time steps to make it live.

## 1. Connect Supabase to your Vercel project

1. In your Vercel project → **Storage** (or **Integrations**) → add **Supabase**.
2. Create / link a Supabase project. Vercel automatically adds these env vars to
   your project (Production + Preview + Development):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`  ← used by the API route (server-only)
   - `SUPABASE_ANON_KEY`, `POSTGRES_*`, etc. (not needed by this feature)

No keys are committed to the repo and none are sent to the browser.

## 2. Create the table

In Supabase → **SQL Editor** → run:

```sql
create table if not exists public.feedback (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  message     text not null,
  rating      smallint,            -- 1..5, optional
  email       text,                -- optional, only if the user gives it
  page        text                 -- which path they were on
);

-- Keep the table locked down. The API route uses the service-role key, which
-- bypasses RLS, so no public insert policy is needed. RLS on + no policy means
-- the anon/public key cannot read or write this table directly.
alter table public.feedback enable row level security;
```

## 3. Run locally (optional)

To test on `localhost`, create `my-app/.env.local` with:

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
```

(Find both in Supabase → Project Settings → API. Never commit `.env.local`.)

## 4. Deploy

Push to the branch Vercel builds. Once the env vars from step 1 are present, the
widget works in production.

## 5. Manage / read feedback

- **Supabase → Table Editor → `feedback`**: sort, filter, delete rows — this is
  your inbox, no extra UI needed.
- For email alerts on new feedback, add a Supabase **Database Webhook** on insert,
  or a scheduled digest later.
- If you ever want to read feedback inside the app, we can add a protected
  `/admin` page that lists rows (kept out of search engines).

## Anti-spam (already built in)

- A hidden honeypot field rejects most bots silently.
- Message length is capped server-side (2000 chars).
- For higher volume, add a rate limit (e.g. Vercel KV) or hCaptcha later.
