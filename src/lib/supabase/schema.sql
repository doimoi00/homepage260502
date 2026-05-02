-- Supabase SQL Editor에 붙여넣고 실행하세요

-- 1. profiles 테이블
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

create policy "누구나 프로필 조회" on public.profiles for select using (true);
create policy "본인 프로필 생성" on public.profiles for insert with check (auth.uid() = id);
create policy "본인 프로필 수정" on public.profiles for update using (auth.uid() = id);

-- 2. 회원가입 시 profiles 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. posts 테이블
create table public.posts (
  id bigserial primary key,
  title text not null,
  content text not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.posts enable row level security;

create policy "누구나 게시글 조회" on public.posts for select using (true);
create policy "로그인 사용자 게시글 작성" on public.posts for insert with check (auth.uid() = author_id);
create policy "본인 또는 관리자 수정" on public.posts for update using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "본인 또는 관리자 삭제" on public.posts for delete using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 4. comments 테이블
create table public.comments (
  id bigserial primary key,
  post_id bigint references public.posts(id) on delete cascade not null,
  content text not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);
alter table public.comments enable row level security;

create policy "누구나 댓글 조회" on public.comments for select using (true);
create policy "로그인 사용자 댓글 작성" on public.comments for insert with check (auth.uid() = author_id);
create policy "본인 또는 관리자 댓글 삭제" on public.comments for delete using (
  auth.uid() = author_id or
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
