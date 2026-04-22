-- Row Level Security — basic policies
-- Enable RLS on all tables
alter table profiles       enable row level security;
alter table branches       enable row level security;
alter table customers      enable row level security;
alter table vehicles       enable row level security;
alter table technicians    enable row level security;
alter table suppliers      enable row level security;
alter table parts          enable row level security;
alter table jobs           enable row level security;
alter table job_technicians enable row level security;
alter table job_parts      enable row level security;

-- Authenticated users can read all data
create policy "authenticated_read_all" on branches       for select to authenticated using (true);
create policy "authenticated_read_all" on customers      for select to authenticated using (true);
create policy "authenticated_read_all" on vehicles       for select to authenticated using (true);
create policy "authenticated_read_all" on technicians    for select to authenticated using (true);
create policy "authenticated_read_all" on suppliers      for select to authenticated using (true);
create policy "authenticated_read_all" on parts          for select to authenticated using (true);
create policy "authenticated_read_all" on jobs           for select to authenticated using (true);
create policy "authenticated_read_all" on job_technicians for select to authenticated using (true);
create policy "authenticated_read_all" on job_parts      for select to authenticated using (true);

-- Users can read their own profile
create policy "own_profile_read" on profiles for select to authenticated using (auth.uid() = id);
create policy "own_profile_update" on profiles for update to authenticated using (auth.uid() = id);

-- Admins and managers can write data (simplified — extend per role requirements)
create policy "authenticated_insert_customers" on customers for insert to authenticated with check (true);
create policy "authenticated_update_customers" on customers for update to authenticated using (true);

create policy "authenticated_insert_vehicles" on vehicles for insert to authenticated with check (true);
create policy "authenticated_update_vehicles" on vehicles for update to authenticated using (true);

create policy "authenticated_insert_jobs" on jobs for insert to authenticated with check (true);
create policy "authenticated_update_jobs" on jobs for update to authenticated using (true);

create policy "authenticated_insert_parts" on parts for insert to authenticated with check (true);
create policy "authenticated_update_parts" on parts for update to authenticated using (true);

create policy "authenticated_insert_job_parts" on job_parts for insert to authenticated with check (true);
create policy "authenticated_insert_job_technicians" on job_technicians for insert to authenticated with check (true);
create policy "authenticated_delete_job_technicians" on job_technicians for delete to authenticated using (true);
