create table public.products(
  id bigint generated always  as identity,
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text not null,
  images text[] not null,
  can_edit boolean not null default true,
  price text not null,

  primary key(id)
);

-- RLS Policies
alter table public.products enable row level security;

create policy "Only authenticated users can create products"
on "public"."products"
as permissive
for insert
to public
with check ((auth.uid() = user_id));

create policy "Enable read access for authenticated users"
on "public"."products"
as permissive
for select
to public
using ((auth.uid() = user_id));

CREATE POLICY "Enable update for users based on authentication" ON "public"."products"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)


-- END OF RLS



