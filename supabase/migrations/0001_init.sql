-- Lyric Lingo initial schema
-- Entities: languages, songs, lyric_lines, profiles

create extension if not exists "pgcrypto";

-- 언어 마스터 테이블
create table languages (
  code text primary key,        -- 'ja', 'en', 'it', ...
  name text not null             -- '일본어', '영어', '이탈리아어', ...
);

-- 곡 테이블 (팝송/애니 OST + 성악 딕션 곡 공통)
create table songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  language_code text not null references languages(code),
  mode text not null check (mode in ('pop', 'diction')),
  cover_image_url text,
  audio_url text,
  created_at timestamptz not null default now()
);

-- 가사 줄 테이블
-- pop 모드: romanized_text / meaning_text 사용
-- diction 모드: ipa_text / note_text 사용
create table lyric_lines (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references songs(id) on delete cascade,
  line_order int not null,
  original_text text not null,
  romanized_text text,
  meaning_text text,
  ipa_text text,
  note_text text,
  created_at timestamptz not null default now(),
  unique (song_id, line_order)
);

-- 사용자 프로필 (Supabase Auth 확장)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- 신규 가입 시 프로필 자동 생성
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table languages enable row level security;
alter table songs enable row level security;
alter table lyric_lines enable row level security;
alter table profiles enable row level security;

create policy "languages are publicly readable"
  on languages for select using (true);

create policy "songs are publicly readable"
  on songs for select using (true);

create policy "lyric_lines are publicly readable"
  on lyric_lines for select using (true);

create policy "users can view their own profile"
  on profiles for select using (auth.uid() = id);

create policy "users can update their own profile"
  on profiles for update using (auth.uid() = id);
