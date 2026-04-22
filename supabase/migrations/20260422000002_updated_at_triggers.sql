-- Reusable trigger function to keep updated_at current
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

create trigger vehicles_updated_at
  before update on vehicles
  for each row execute function update_updated_at();

create trigger parts_updated_at
  before update on parts
  for each row execute function update_updated_at();

create trigger jobs_updated_at
  before update on jobs
  for each row execute function update_updated_at();
