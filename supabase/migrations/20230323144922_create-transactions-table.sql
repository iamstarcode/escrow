create table public.transactions (
    id bigint primary key generated always as identity not null,
    seller_id uuid not null references auth.users on delete cascade,
    buyer_id uuid null references auth.users on delete cascade,
    buyer_agreed boolean default false,
    created_at timestamptz default now(),
    products integer[] not null,
    amount_payable integer not null
    
);

alter table public.transactions enable row level security;

create policy "Enable read access for both seller and buyer" on public.transactions
as permissive
for select
to public
using (((auth.uid() = buyer_id) OR (auth.uid() = seller_id)));