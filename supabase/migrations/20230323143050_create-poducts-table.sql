create table public.products(
  id bigint generated always  as identity,
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text not null,
  images text[] not null,
  price text not null,

  primary key(id)
);

alter table public.products enable row level security;

create policy "Only authenticated users can create products"
on "public"."products"
as permissive
for insert
to public
with check ((auth.uid() = user_id));

