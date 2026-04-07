-- Run this SQL in your Supabase Dashboard → SQL Editor
-- This creates all tables needed for Just Talk

-- 1. Vents table (text venting)
create table if not exists vents (
  id uuid default gen_random_uuid() primary key,
  anonymous_id text not null,
  text text not null check (char_length(text) <= 5000),
  created_at timestamptz default now()
);

create index if not exists idx_vents_anonymous_id on vents(anonymous_id);

-- 2. Voice recordings metadata
create table if not exists voice_recordings (
  id uuid default gen_random_uuid() primary key,
  anonymous_id text not null,
  filename text not null,
  mimetype text default 'audio/webm',
  duration real default 0,
  file_size integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_voice_anonymous_id on voice_recordings(anonymous_id);

-- 3. Patience challenge results
create table if not exists challenge_results (
  id uuid default gen_random_uuid() primary key,
  anonymous_id text not null,
  session_id text unique not null,
  rounds jsonb default '[]',
  final_result text check (final_result in ('Calm', 'Irritated', 'Angry')),
  total_score integer default 0,
  completed_at timestamptz default now()
);

create index if not exists idx_challenge_anonymous_id on challenge_results(anonymous_id);

-- 4. Enable Row Level Security (RLS) - optional but recommended
-- Uncomment these if you want RLS (requires service_role key on server)
-- alter table vents enable row level security;
-- alter table voice_recordings enable row level security;
-- alter table challenge_results enable row level security;
