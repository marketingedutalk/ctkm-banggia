-- Công cụ tính giá KM — lưu dữ liệu gốc dạng 1 tài liệu JSON + lịch sử phiên bản.
-- Chạy trong Supabase SQL Editor của project portal.

create table if not exists public.promo_config (
  key         text primary key default 'current',
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid default auth.uid()
);

-- Mỗi lần admin bấm "Lưu & áp dụng" sẽ giữ lại bản cũ để rollback / đối soát giá đã báo.
create table if not exists public.promo_config_history (
  id          bigint generated always as identity primary key,
  key         text not null,
  data        jsonb not null,
  saved_at    timestamptz not null default now(),
  saved_by    uuid
);

create or replace function public.promo_config_touch() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  insert into public.promo_config_history (key, data, saved_by) values (new.key, new.data, auth.uid());
  return new;
end $$;

drop trigger if exists trg_promo_config_touch on public.promo_config;
create trigger trg_promo_config_touch before insert or update on public.promo_config
for each row execute function public.promo_config_touch();

-- ---------------------------------------------------------------- Phân quyền
-- Danh sách admin của công cụ. Nếu portal đã có bảng vai trò (VD profiles.role = 'admin'),
-- thay thân hàm promo_is_admin() bằng truy vấn vào bảng đó.
create table if not exists public.promo_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.promo_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.promo_admins where user_id = auth.uid());
$$;

alter table public.promo_config enable row level security;
alter table public.promo_config_history enable row level security;
alter table public.promo_admins enable row level security;

-- Sale/TVV (mọi tài khoản đăng nhập) chỉ đọc; chỉ admin được ghi.
drop policy if exists promo_config_read on public.promo_config;
create policy promo_config_read on public.promo_config for select to authenticated using (true);

drop policy if exists promo_config_write on public.promo_config;
create policy promo_config_write on public.promo_config for all to authenticated
  using (public.promo_is_admin()) with check (public.promo_is_admin());

drop policy if exists promo_history_read on public.promo_config_history;
create policy promo_history_read on public.promo_config_history for select to authenticated using (public.promo_is_admin());

drop policy if exists promo_admins_read on public.promo_admins;
create policy promo_admins_read on public.promo_admins for select to authenticated using (user_id = auth.uid() or public.promo_is_admin());

-- Thêm admin đầu tiên (đổi email):
-- insert into public.promo_admins (user_id) select id from auth.users where email = 'marketing@edutalkvn.com';
