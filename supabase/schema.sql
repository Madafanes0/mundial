-- (Opcional) Esquema si más adelante conectas cuentas Supabase + álbum en la nube.
-- La app actual solo usa localStorage en el navegador.
--
-- Ejecutar en Supabase → SQL Editor (una vez por proyecto).
-- Habilita un álbum JSON por usuario con RLS.

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint albums_user_id_key unique (user_id)
);

create index if not exists albums_user_id_idx on public.albums (user_id);

alter table public.albums enable row level security;

create policy "albums_select_own"
  on public.albums for select
  using (auth.uid() = user_id);

create policy "albums_insert_own"
  on public.albums for insert
  with check (auth.uid() = user_id);

create policy "albums_update_own"
  on public.albums for update
  using (auth.uid() = user_id);
