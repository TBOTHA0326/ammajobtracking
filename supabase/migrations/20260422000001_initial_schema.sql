-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Branches ──────────────────────────────────────────────────────────────────
create table branches (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  address    text,
  phone      text,
  created_at timestamptz not null default now()
);

-- ── Users / Auth ──────────────────────────────────────────────────────────────
-- Uses Supabase Auth; extend with a profiles table
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'technician' check (role in ('admin', 'manager', 'technician')),
  branch_id  uuid references branches(id),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ── Customers ─────────────────────────────────────────────────────────────────
create table customers (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  phone      text,
  email      text,
  address    text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Vehicles ──────────────────────────────────────────────────────────────────
create table vehicles (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references customers(id) on delete cascade,
  make         text not null default 'VW',
  model        text not null,
  year         integer not null,
  vin          text,
  registration text,
  mileage      integer not null default 0,
  color        text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on vehicles(customer_id);

-- ── Technicians ───────────────────────────────────────────────────────────────
create table technicians (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  role       text not null,
  phone      text,
  email      text,
  skills     text[] not null default '{}',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Suppliers ─────────────────────────────────────────────────────────────────
create table suppliers (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  contact_name text,
  phone        text,
  email        text,
  address      text,
  notes        text,
  created_at   timestamptz not null default now()
);

-- ── Parts / Inventory ─────────────────────────────────────────────────────────
create table parts (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  part_number   text,
  category      text not null,
  type          text not null check (type in ('New', 'Used', 'Genuine', 'Economy')),
  stock         integer not null default 0,
  cost_price    numeric(10,2) not null default 0,
  selling_price numeric(10,2) not null default 0,
  supplier_id   uuid references suppliers(id),
  reorder_level integer not null default 5,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Jobs ──────────────────────────────────────────────────────────────────────
create table jobs (
  id                  uuid primary key default uuid_generate_v4(),
  customer_id         uuid not null references customers(id),
  vehicle_id          uuid not null references vehicles(id),
  title               text not null,
  description         text,
  status              text not null default 'pending'
                        check (status in ('pending', 'in-progress', 'waiting-parts', 'completed', 'cancelled')),
  priority            text not null default 'medium'
                        check (priority in ('low', 'medium', 'high')),
  estimated_cost      numeric(10,2),
  final_cost          numeric(10,2),
  start_date          date,
  due_date            date,
  completed_at        timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on jobs(status);
create index on jobs(customer_id);
create index on jobs(vehicle_id);
create index on jobs(due_date);

-- ── Job ↔ Technician (many-to-many) ──────────────────────────────────────────
create table job_technicians (
  job_id        uuid not null references jobs(id) on delete cascade,
  technician_id uuid not null references technicians(id) on delete cascade,
  primary key (job_id, technician_id)
);

-- ── Job Parts ─────────────────────────────────────────────────────────────────
create table job_parts (
  id         uuid primary key default uuid_generate_v4(),
  job_id     uuid not null references jobs(id) on delete cascade,
  part_id    uuid not null references parts(id),
  part_name  text not null,
  quantity   integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create index on job_parts(job_id);
