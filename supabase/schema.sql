-- HabitFlow database schema
-- Run this entire file in Supabase Dashboard -> SQL Editor -> New query.
-- IMPORTANT: This migration enforces the IIT Dharwad email domain at database level.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text check (nickname is null or (char_length(nickname) between 2 and 24)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 60),
  category text not null default 'Personal',
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  weekly_target integer not null default 1 check (weekly_target between 1 and 7),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique(habit_id, log_date)
);

create index if not exists habits_user_active_idx on public.habits(user_id, active);
create index if not exists habit_logs_user_date_idx on public.habit_logs(user_id, log_date desc);
create index if not exists habit_logs_habit_date_idx on public.habit_logs(habit_id, log_date desc);

-- Reject all non-IITDH identities even if an Auth endpoint is called outside this app.
create or replace function public.enforce_iitdh_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null or lower(new.email) !~ '^[^@]+@iitdh\.ac\.in$' then
    raise exception 'Only verified IIT Dharwad email addresses are permitted.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_iitdh_email_before_insert on auth.users;
drop trigger if exists enforce_iitdh_email_before_update on auth.users;
create trigger enforce_iitdh_email_before_insert
before insert or update on auth.users
for each row execute function public.enforce_iitdh_email();

-- Create a profile row automatically after a valid Auth user is created.
create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.create_profile_for_auth_user();

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

drop policy if exists "profile select own" on public.profiles;
create policy "profile select own" on public.profiles
for select to authenticated using (auth.uid() = id);

drop policy if exists "profile insert own" on public.profiles;
create policy "profile insert own" on public.profiles
for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "habits select own" on public.habits;
create policy "habits select own" on public.habits
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "habits insert own" on public.habits;
create policy "habits insert own" on public.habits
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "habits update own" on public.habits;
create policy "habits update own" on public.habits
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habits delete own" on public.habits;
create policy "habits delete own" on public.habits
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "logs select own" on public.habit_logs;
create policy "logs select own" on public.habit_logs
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "logs insert own" on public.habit_logs;
create policy "logs insert own" on public.habit_logs
for insert to authenticated with check (
  auth.uid() = user_id and exists (
    select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid()
  )
);

drop policy if exists "logs update own" on public.habit_logs;
create policy "logs update own" on public.habit_logs
for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id and exists (
    select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid()
  )
);

drop policy if exists "logs delete own" on public.habit_logs;
create policy "logs delete own" on public.habit_logs
for delete to authenticated using (auth.uid() = user_id);

-- Keep updated_at current when profile rows are edited.
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

-- Security note: Never expose a Supabase service_role/secret key in this application.
