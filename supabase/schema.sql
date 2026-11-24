create extension if not exists pg_cron with schema extensions;

create table if not exists public.moderation_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null, ip_address inet,
 last_seen_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '10 days')
);
create table if not exists public.moderation_events (
 id bigint generated always as identity primary key,
 user_id uuid references auth.users(id) on delete set null,
 display_name text not null, room_code text,
 event_type text not null check(event_type in ('blocked','allowed')),
 flagged_terms text[] not null default '{}', flagged_word_count integer not null default 0,
 message_excerpt text, ip_address inet, created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '10 days')
);
create table if not exists public.moderated_chat (
 id uuid primary key, room_code text not null,
 user_id uuid references auth.users(id) on delete cascade,
 display_name text not null, message text not null check(length(message) between 1 and 240),
 created_at timestamptz not null default now(), expires_at timestamptz not null default (now()+interval '10 days')
);
create table if not exists public.moderation_terms (
 id bigint generated always as identity primary key, term text not null unique,
 term_type text not null check(term_type in ('word','phrase')),
 enabled boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.moderation_admins (
 user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);
create index if not exists moderation_events_exp_idx on public.moderation_events(expires_at);
create index if not exists moderation_events_user_idx on public.moderation_events(user_id,created_at desc);
create index if not exists moderated_chat_room_idx on public.moderated_chat(room_code,created_at desc);
create index if not exists moderated_chat_exp_idx on public.moderated_chat(expires_at);
create index if not exists moderation_users_exp_idx on public.moderation_users(expires_at);
alter table public.moderation_users enable row level security;
alter table public.moderation_events enable row level security;
alter table public.moderated_chat enable row level security;
alter table public.moderation_terms enable row level security;
alter table public.moderation_admins enable row level security;
revoke all on public.moderation_users from anon,authenticated;
revoke all on public.moderation_events from anon,authenticated;
revoke all on public.moderated_chat from anon,authenticated;
revoke all on public.moderation_terms from anon,authenticated;
revoke all on public.moderation_admins from anon,authenticated;
grant all on public.moderation_users to service_role;
grant all on public.moderation_events to service_role;
grant all on public.moderated_chat to service_role;
grant all on public.moderation_terms to service_role;
grant all on public.moderation_admins to service_role;
insert into public.moderation_terms(term,term_type) values
('fuck','word'),('shit','word'),('bitch','word'),('asshole','word'),('motherfucker','word'),
('porn','word'),('nude','word'),('sex','word'),('send nudes','phrase'),('kill yourself','phrase'),('go die','phrase')
on conflict(term) do nothing;
create or replace function public.purge_moderation_expired()
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 delete from public.moderated_chat where expires_at<=now();
 delete from public.moderation_events where expires_at<=now();
 delete from public.moderation_users where expires_at<=now();
end; $$;
revoke all on function public.purge_moderation_expired() from public,anon,authenticated;
grant execute on function public.purge_moderation_expired() to service_role;
do $$ begin
 if exists(select 1 from cron.job where jobname='hint-happens-moderation-cleanup') then
  perform cron.unschedule('hint-happens-moderation-cleanup');
 end if;
 if exists(select 1 from cron.job where jobname='hints-happen-moderation-cleanup') then
  perform cron.unschedule('hints-happen-moderation-cleanup');
 end if;
 perform cron.schedule('hints-happen-moderation-cleanup','15 * * * *','select public.purge_moderation_expired()');
end $$;
-- After an admin signs in anonymously, add their UUID to moderation_admins via SQL Editor.
