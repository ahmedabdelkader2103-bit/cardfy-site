-- Restaurant OS: additive schema. Existing order IDs, prices, auth and Legacy QR remain intact.
-- Deployment is atomic; application rollback can leave these additive tables in place.
create table public.cfy_os_branches (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references public.cfy_clients(id),
  name text not null check(length(trim(name)) between 1 and 120), address text not null default '',
  phone text not null default '', map_url text not null default '', enabled boolean not null default true,
  created_at timestamptz not null default now(), unique(client_id,id)
);
create index cfy_os_branches_client on public.cfy_os_branches(client_id);
insert into public.cfy_os_branches(client_id,name,address,phone)
select c.id,'الفرع الرئيسي','',coalesce(c.whatsapp,'') from public.cfy_clients c
where exists(select 1 from public.cfy_client_services s where s.client_id=c.id and s.service='menu' and s.enabled)
  and not exists(select 1 from public.cfy_os_branches b where b.client_id=c.id);
alter table public.cfy_menu_staff add column page_permissions text[];
alter table public.cfy_menu_orders add column branch_id uuid;
update public.cfy_menu_orders o set branch_id=(select b.id from public.cfy_os_branches b where b.client_id=o.client_id order by b.created_at limit 1) where branch_id is null;
alter table public.cfy_menu_orders add constraint cfy_os_order_branch_fk foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id);
create index cfy_os_orders_branch_date on public.cfy_menu_orders(client_id,branch_id,created_at);
alter table public.cfy_menu_delivery_zones add column branch_id uuid;
update public.cfy_menu_delivery_zones z set branch_id=(select b.id from public.cfy_os_branches b where b.client_id=z.client_id order by b.created_at limit 1) where branch_id is null;
alter table public.cfy_menu_delivery_zones add constraint cfy_os_zone_branch_fk foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id);
alter table public.cfy_menu_tables add column branch_id uuid;
update public.cfy_menu_tables t set branch_id=(select b.id from public.cfy_os_branches b where b.client_id=t.client_id order by b.created_at limit 1) where branch_id is null;
alter table public.cfy_menu_tables add column service_state text not null default 'available' check(service_state in ('available','reserved','out_of_service'));
alter table public.cfy_menu_tables add constraint cfy_os_table_branch_fk foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id);
alter table public.cfy_menu_orders add column receipt_verification text not null default 'not_required' check(receipt_verification in ('not_required','pending','verified','disputed'));
alter table public.cfy_menu_orders add column otp_exception_reason text;

create table public.cfy_os_finance_entries (
  id uuid primary key default gen_random_uuid(),client_id uuid not null references public.cfy_clients(id),branch_id uuid,
  kind text not null check(kind in ('revenue','expense','cash_in','cash_out','closure','payroll')),
  title text not null check(length(trim(title)) between 1 and 160),category text not null default '',
  amount numeric(14,2) not null check(amount>=0),payment_method text not null default 'cash' check(payment_method in ('cash','card','instapay','wallet','other')),
  occurred_on date not null default current_date,notes text not null default '',archived boolean not null default false,
  version integer not null default 1,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
  foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id)
);
create index cfy_os_finance_filter on public.cfy_os_finance_entries(client_id,occurred_on,branch_id) where not archived;
create table public.cfy_os_inventory (
  id uuid primary key default gen_random_uuid(),client_id uuid not null references public.cfy_clients(id),branch_id uuid,
  name text not null check(length(trim(name)) between 1 and 160),unit text not null check(unit in ('kg','g','liter','ml','piece','box','pack','bottle')),
  quantity numeric(16,4) not null default 0 check(quantity>=0),unit_price numeric(14,4) not null default 0 check(unit_price>=0),
  minimum_quantity numeric(16,4) not null default 0 check(minimum_quantity>=0),archived boolean not null default false,
  version integer not null default 1,updated_at timestamptz not null default now(),unique(client_id,id),
  foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id)
);
create index cfy_os_inventory_client on public.cfy_os_inventory(client_id,branch_id);
create table public.cfy_os_stock_movements (
  id uuid primary key default gen_random_uuid(),client_id uuid not null,item_id uuid not null,
  quantity_delta numeric(16,4) not null,unit_price numeric(14,4) not null check(unit_price>=0),reason text not null,
  occurred_at timestamptz not null default now(),foreign key(client_id,item_id) references public.cfy_os_inventory(client_id,id)
);
create index cfy_os_stock_item on public.cfy_os_stock_movements(client_id,item_id,occurred_at);
create table public.cfy_os_recipes (
  id uuid primary key default gen_random_uuid(),client_id uuid not null references public.cfy_clients(id),branch_id uuid,
  name text not null check(length(trim(name)) between 1 and 160),product_id uuid,
  selling_price numeric(14,2) not null default 0 check(selling_price>=0),target_margin numeric(5,2) not null default 30 check(target_margin>=0 and target_margin<100),
  ingredients jsonb not null default '[]' check(jsonb_typeof(ingredients)='array'),archived boolean not null default false,version integer not null default 1,
  foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id)
);
create index cfy_os_recipes_client on public.cfy_os_recipes(client_id,branch_id);
create table public.cfy_os_employees (
  id uuid primary key default gen_random_uuid(),client_id uuid not null references public.cfy_clients(id),branch_id uuid,
  name text not null check(length(trim(name)) between 1 and 160),job_title text not null default '',
  salary numeric(14,2) not null default 0 check(salary>=0),archived boolean not null default false,version integer not null default 1,
  foreign key(client_id,branch_id) references public.cfy_os_branches(client_id,id)
);
create index cfy_os_employees_client on public.cfy_os_employees(client_id,branch_id);
create table public.cfy_os_audit_events (
  id bigint generated always as identity primary key,client_id uuid not null,actor_id uuid,actor_role text not null,
  operation text not null,entity_id uuid,details jsonb not null default '{}',created_at timestamptz not null default now()
);
create index cfy_os_audit_client on public.cfy_os_audit_events(client_id,created_at);
-- Custom token sessions do not populate auth.uid(). All access is through validated RPCs.
do $$ declare t text;begin
  foreach t in array array['cfy_os_branches','cfy_os_finance_entries','cfy_os_inventory','cfy_os_stock_movements','cfy_os_recipes','cfy_os_employees','cfy_os_audit_events'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public, anon, authenticated',t);
  end loop;
end $$;

create function public.cfy_os_session(p_token text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare owner_id uuid;s public.cfy_menu_staff%rowtype;perms text[];begin
  if p_token is null or length(p_token)<16 then raise exception 'invalid_session';end if;
  -- Try the existing owner session verifier; never infer ownership from supplied IDs.
  begin owner_id:=public.cfy_token_client_id(p_token,'menu');exception when others then owner_id:=null;end;
  if owner_id is not null then return jsonb_build_object('client_id',owner_id,'role','owner','name',(select coalesce(nullif(brand_name_ar,''),brand_name_en) from public.cfy_clients where id=owner_id),'permissions',array['tools','takeaway','dinein','prep','kitchen','delivery','analytics','accounts','settings']);end if;
  owner_id:=public.cfy_menu_staff_client_id(p_token,null);
  select st.* into s from public.cfy_menu_staff_sessions ss join public.cfy_menu_staff st on st.id=ss.staff_id where ss.token_hash=encode(digest(p_token,'sha256'),'hex') and ss.expires_at>now() and st.enabled and st.client_id=owner_id;
  if s.id is null then raise exception 'invalid_session';end if;
  perms:=coalesce(s.page_permissions,case s.role when 'cashier' then array['takeaway','dinein'] when 'coordinator' then array['prep','kitchen'] when 'delivery' then array['delivery'] else array[]::text[] end);
  return jsonb_build_object('client_id',owner_id,'id',s.id,'name',s.name,'role',s.role,'permissions',perms,'shift_state',s.shift_state);
end $$;
create function public.cfy_os_require(p_token text,p_page text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_session(p_token);begin
 if not coalesce((actor->'permissions') ? p_page,false) then raise exception 'page_forbidden' using errcode='42501';end if;return actor;
end $$;
revoke all on function public.cfy_os_require(text,text) from public,anon,authenticated;
revoke all on function public.cfy_os_session(text) from public;
grant execute on function public.cfy_os_session(text) to anon,authenticated;

create function public.cfy_os_settings(p_token text,p_action text default 'list',p_data jsonb default '{}') returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'settings');cid uuid:=(actor->>'client_id')::uuid;entity uuid:=nullif(p_data->>'id','')::uuid;bid uuid:=nullif(p_data->>'branch_id','')::uuid;perms text[];begin
 if actor->>'role'<>'owner' then raise exception 'owner_required' using errcode='42501';end if;
 if p_action='permissions' then
  if jsonb_typeof(p_data->'permissions')<>'array' then raise exception 'invalid_permissions';end if;
  select coalesce(array_agg(value),'{}') into perms from jsonb_array_elements_text(p_data->'permissions');
  if not perms <@ array['takeaway','dinein','prep','kitchen','delivery','analytics','accounts'] then raise exception 'invalid_permissions';end if;
  -- Delivery remains an isolated role; operational access for other staff can be composed.
  if exists(select 1 from cfy_menu_staff where id=entity and client_id=cid and ((role='delivery' and not perms <@ array['delivery']) or (role<>'delivery' and 'delivery'=any(perms)))) then raise exception 'delivery_role_required';end if;
  update cfy_menu_staff set page_permissions=perms,updated_at=now() where id=entity and client_id=cid;if not found then raise exception 'staff_not_found';end if;
 elsif p_action='branch' then
  if entity is null then insert into cfy_os_branches(client_id,name,address,phone,map_url) values(cid,p_data->>'name',coalesce(p_data->>'address',''),coalesce(p_data->>'phone',''),coalesce(p_data->>'map_url','')) returning id into entity;
  else update cfy_os_branches set name=p_data->>'name',address=coalesce(p_data->>'address',''),phone=coalesce(p_data->>'phone',''),map_url=coalesce(p_data->>'map_url',''),enabled=coalesce((p_data->>'enabled')::boolean,true) where id=entity and client_id=cid;if not found then raise exception 'branch_not_found';end if;end if;
 elsif p_action in ('zone_branch','table_branch') then
  if entity is null or bid is null or not exists(select 1 from cfy_os_branches where id=bid and client_id=cid and enabled) then raise exception 'invalid_branch_assignment';end if;
  if p_action='zone_branch' then update cfy_menu_delivery_zones set branch_id=bid,updated_at=now() where id=entity and client_id=cid;
  else update cfy_menu_tables set branch_id=bid,updated_at=now() where id=entity and client_id=cid;end if;
  if not found then raise exception 'record_not_found';end if;
 elsif p_action<>'list' then raise exception 'unsupported_action';end if;
 if p_action<>'list' then insert into cfy_os_audit_events(client_id,actor_role,operation,entity_id) values(cid,'owner',p_action,entity);end if;
 return jsonb_build_object('branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where client_id=cid),'[]'),'staff',coalesce((select jsonb_agg(jsonb_build_object('id',id,'code',code,'name',name,'role',role,'enabled',enabled,'permissions',coalesce(page_permissions,case role when 'cashier' then array['takeaway','dinein'] when 'coordinator' then array['prep','kitchen'] when 'delivery' then array['delivery'] else '{}'::text[] end)) order by name) from cfy_menu_staff where client_id=cid),'[]'),'zones',coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name,'branch_id',branch_id) order by name) from cfy_menu_delivery_zones where client_id=cid),'[]'),'tables',coalesce((select jsonb_agg(jsonb_build_object('id',id,'label',label,'branch_id',branch_id) order by sort_order,label) from cfy_menu_tables where client_id=cid),'[]'));
end $$;
revoke all on function public.cfy_os_settings(text,text,jsonb) from public;
grant execute on function public.cfy_os_settings(text,text,jsonb) to anon,authenticated;

create function public.cfy_os_recipe_cost(p_client uuid,p_ingredients jsonb) returns numeric language plpgsql security definer set search_path=public as $$
declare x jsonb;i public.cfy_os_inventory%rowtype;qty numeric;factor numeric;total numeric:=0;u text;begin
 if jsonb_typeof(p_ingredients)<>'array' or jsonb_array_length(p_ingredients)>100 then raise exception 'invalid_ingredients';end if;
 for x in select value from jsonb_array_elements(p_ingredients) loop
  select * into i from cfy_os_inventory where id=(x->>'item_id')::uuid and client_id=p_client;
  if i.id is null then raise exception 'ingredient_not_found';end if;
  qty:=(x->>'quantity')::numeric;u:=x->>'unit';if qty is null or qty<=0 then raise exception 'invalid_quantity';end if;
  factor:=case when u=i.unit then 1 when (u,i.unit) in (('g','kg'),('ml','liter')) then 0.001 when (u,i.unit) in (('kg','g'),('liter','ml')) then 1000 else null end;
  if factor is null then raise exception 'incompatible_units';end if;total:=total+qty*factor*i.unit_price;
 end loop;return round(total,4);
end $$;
revoke all on function public.cfy_os_recipe_cost(uuid,jsonb) from public,anon,authenticated;

create function public.cfy_os_finance_mutate(p_token text,p_kind text,p_action text,p_data jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'accounts');cid uuid:=(actor->>'client_id')::uuid;eid uuid:=nullif(p_data->>'id','')::uuid;bid uuid:=nullif(p_data->>'branch_id','')::uuid;expected integer:=coalesce((p_data->>'version')::int,1);tbl text;existing jsonb;result jsonb;qty numeric;cost numeric;begin
 if p_kind not in ('revenue','expense','cash_in','cash_out','closure','payroll','inventory','recipe','employee') or p_action not in ('save','archive','restore','movement') then raise exception 'invalid_operation';end if;
 tbl:=case p_kind when 'inventory' then 'cfy_os_inventory' when 'recipe' then 'cfy_os_recipes' when 'employee' then 'cfy_os_employees' else 'cfy_os_finance_entries' end;
 if bid is not null and not exists(select 1 from cfy_os_branches where id=bid and client_id=cid and enabled) then raise exception 'invalid_branch';end if;
 if eid is not null then
  execute format('select to_jsonb(t) from public.%I t where id=$1 and client_id=$2 for update',tbl) into existing using eid,cid;
  if existing is null then raise exception 'record_not_found';end if;
  if (existing->>'version')::int<>expected then raise exception 'record_changed_reload';end if;
  if tbl='cfy_os_finance_entries' and existing->>'kind'<>p_kind then raise exception 'invalid_kind';end if;
 end if;
 if p_action in ('archive','restore') then
  if eid is null then raise exception 'record_required';end if;
  execute format('update public.%I set archived=$1,version=version+1 where id=$2 and client_id=$3 returning to_jsonb(%I)',tbl,tbl) into result using p_action='archive',eid,cid;
 elsif p_action='movement' then
  if p_kind<>'inventory' or eid is null then raise exception 'inventory_required';end if;
  qty:=(p_data->>'quantity_delta')::numeric;cost:=(p_data->>'unit_price')::numeric;
  if qty is null or qty=0 or cost is null or cost<0 or length(trim(coalesce(p_data->>'reason','')))=0 then raise exception 'invalid_stock_movement';end if;
  update cfy_os_inventory set quantity=quantity+qty,unit_price=case when qty>0 then (quantity*unit_price+qty*cost)/nullif(quantity+qty,0) else unit_price end,version=version+1,updated_at=now() where id=eid and client_id=cid returning to_jsonb(cfy_os_inventory) into result;
  insert into cfy_os_stock_movements(client_id,item_id,quantity_delta,unit_price,reason) values(cid,eid,qty,cost,left(p_data->>'reason',500));
 else
  if p_kind='recipe' then
   cost:=public.cfy_os_recipe_cost(cid,p_data->'ingredients');
   if nullif(p_data->>'product_id','') is not null and not exists(select 1 from cfy_menu_products where id=(p_data->>'product_id')::uuid and client_id=cid) then raise exception 'invalid_product';end if;
  end if;
  if eid is null then
   if tbl='cfy_os_finance_entries' then insert into cfy_os_finance_entries(client_id,branch_id,kind,title,category,amount,payment_method,occurred_on,notes) values(cid,bid,p_kind,p_data->>'title',coalesce(p_data->>'category',''),(p_data->>'amount')::numeric,coalesce(p_data->>'payment_method','cash'),(p_data->>'occurred_on')::date,coalesce(p_data->>'notes','')) returning to_jsonb(cfy_os_finance_entries) into result;
   elsif p_kind='inventory' then insert into cfy_os_inventory(client_id,branch_id,name,unit,quantity,unit_price,minimum_quantity) values(cid,bid,p_data->>'name',p_data->>'unit',coalesce((p_data->>'quantity')::numeric,0),(p_data->>'unit_price')::numeric,coalesce((p_data->>'minimum_quantity')::numeric,0)) returning to_jsonb(cfy_os_inventory) into result;
   elsif p_kind='recipe' then insert into cfy_os_recipes(client_id,branch_id,name,product_id,selling_price,target_margin,ingredients) values(cid,bid,p_data->>'name',nullif(p_data->>'product_id','')::uuid,(p_data->>'selling_price')::numeric,(p_data->>'target_margin')::numeric,p_data->'ingredients') returning to_jsonb(cfy_os_recipes) into result;
   elsif p_kind='employee' then insert into cfy_os_employees(client_id,branch_id,name,job_title,salary) values(cid,bid,p_data->>'name',coalesce(p_data->>'job_title',''),(p_data->>'salary')::numeric) returning to_jsonb(cfy_os_employees) into result;end if;
  else
   if tbl='cfy_os_finance_entries' then update cfy_os_finance_entries set branch_id=bid,title=p_data->>'title',category=coalesce(p_data->>'category',''),amount=(p_data->>'amount')::numeric,payment_method=p_data->>'payment_method',occurred_on=(p_data->>'occurred_on')::date,notes=coalesce(p_data->>'notes',''),version=version+1,updated_at=now() where id=eid and client_id=cid returning to_jsonb(cfy_os_finance_entries) into result;
   elsif p_kind='inventory' then
    if p_data->>'unit'<>existing->>'unit' then raise exception 'stock_unit_immutable';end if;
    update cfy_os_inventory set branch_id=bid,name=p_data->>'name',unit_price=(p_data->>'unit_price')::numeric,minimum_quantity=coalesce((p_data->>'minimum_quantity')::numeric,0),version=version+1,updated_at=now() where id=eid and client_id=cid returning to_jsonb(cfy_os_inventory) into result;
   elsif p_kind='recipe' then update cfy_os_recipes set branch_id=bid,name=p_data->>'name',product_id=nullif(p_data->>'product_id','')::uuid,selling_price=(p_data->>'selling_price')::numeric,target_margin=(p_data->>'target_margin')::numeric,ingredients=p_data->'ingredients',version=version+1 where id=eid and client_id=cid returning to_jsonb(cfy_os_recipes) into result;
   elsif p_kind='employee' then update cfy_os_employees set branch_id=bid,name=p_data->>'name',job_title=coalesce(p_data->>'job_title',''),salary=(p_data->>'salary')::numeric,version=version+1 where id=eid and client_id=cid returning to_jsonb(cfy_os_employees) into result;end if;
  end if;
 end if;
 insert into cfy_os_audit_events(client_id,actor_id,actor_role,operation,entity_id,details) values(cid,nullif(actor->>'id','')::uuid,actor->>'role',p_kind||':'||p_action,(result->>'id')::uuid,jsonb_build_object('before',existing,'after',result));
 return result;
end $$;
revoke all on function public.cfy_os_finance_mutate(text,text,text,jsonb) from public;
grant execute on function public.cfy_os_finance_mutate(text,text,text,jsonb) to anon,authenticated;

create function public.cfy_os_finance_snapshot(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'accounts');cid uuid:=(actor->>'client_id')::uuid;begin
 if p_from is null or p_to is null or p_from>p_to or p_to-p_from>3660 then raise exception 'invalid_date_range';end if;
 if p_branch is not null and not exists(select 1 from cfy_os_branches where id=p_branch and client_id=cid) then raise exception 'invalid_branch';end if;
 return jsonb_build_object(
 'branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where client_id=cid),'[]'),
 'entries',coalesce((select jsonb_agg(to_jsonb(e) order by occurred_on desc,created_at desc) from cfy_os_finance_entries e where client_id=cid and occurred_on between p_from and p_to and (p_branch is null or branch_id=p_branch)),'[]'),
 'order_revenue',coalesce((select jsonb_agg(jsonb_build_object('id',id,'reference',reference,'amount',total,'payment_method',payment_method,'source',order_source,'order_type',order_type,'branch_id',branch_id,'occurred_on',(paid_at at time zone 'Africa/Cairo')::date) order by paid_at desc) from cfy_menu_orders where client_id=cid and payment_status='paid' and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date between p_from and p_to and (p_branch is null or branch_id=p_branch)),'[]'),
 'cash_balance',coalesce((select sum(case when kind in ('cash_in','revenue') then amount when kind in ('cash_out','expense','payroll') then -amount else 0 end) from cfy_os_finance_entries where client_id=cid and not archived and payment_method='cash' and occurred_on<=p_to and (p_branch is null or branch_id=p_branch)),0)+coalesce((select sum(total) from cfy_menu_orders where client_id=cid and payment_status='paid' and payment_method in ('cash','pay_on_delivery') and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date<=p_to and (p_branch is null or branch_id=p_branch)),0),
 'inventory',coalesce((select jsonb_agg(to_jsonb(i) order by name) from cfy_os_inventory i where client_id=cid and (p_branch is null or branch_id=p_branch)),'[]'),
 'movements',coalesce((select jsonb_agg(to_jsonb(m) order by occurred_at desc) from cfy_os_stock_movements m where client_id=cid and (occurred_at at time zone 'Africa/Cairo')::date between p_from and p_to and exists(select 1 from cfy_os_inventory i where i.id=m.item_id and (p_branch is null or i.branch_id=p_branch))),'[]'),
 'recipes',coalesce((select jsonb_agg(to_jsonb(r)||jsonb_build_object('cost',case when not archived then public.cfy_os_recipe_cost(cid,ingredients) else null end) order by name) from cfy_os_recipes r where client_id=cid and (p_branch is null or branch_id=p_branch)),'[]'),
 'employees',coalesce((select jsonb_agg(to_jsonb(e) order by name) from cfy_os_employees e where client_id=cid and (p_branch is null or branch_id=p_branch)),'[]'));
end $$;
revoke all on function public.cfy_os_finance_snapshot(text,date,date,uuid) from public;
grant execute on function public.cfy_os_finance_snapshot(text,date,date,uuid) to anon,authenticated;

create function public.cfy_os_operational_snapshot(p_token text,p_page text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;begin
 if p_page not in ('takeaway','dinein','prep','kitchen','delivery') then raise exception 'invalid_page';end if;
 return jsonb_build_object('actor',actor,
 'orders',coalesce((select jsonb_agg(public.cfy_menu_order_payload(o.id) order by o.created_at desc) from cfy_menu_orders o where client_id=cid and (status not in ('completed','cancelled') or created_at>now()-interval '1 day') and (p_page<>'delivery' or (actor->>'role'='owner' or assigned_driver_id=(actor->>'id')::uuid))),'[]'),
 'tables',case when p_page='delivery' then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(t)||jsonb_build_object('session',(select to_jsonb(s) from cfy_menu_table_sessions s where s.table_id=t.id and s.status in ('open','bill_requested','payment_pending') order by opened_at desc limit 1)) order by sort_order,label) from cfy_menu_tables t where client_id=cid),'[]') end,
 'drivers',case when p_page='prep' or actor->>'role'='owner' then coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name,'shift_state',shift_state) order by name) from cfy_menu_staff where client_id=cid and role='delivery' and enabled),'[]') else '[]'::jsonb end,
 'branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where client_id=cid and enabled),'[]'),
 'catalog',public.cfy_menu_public_catalog((select code from cfy_clients where id=cid)));
end $$;
revoke all on function public.cfy_os_operational_snapshot(text,text) from public;
grant execute on function public.cfy_os_operational_snapshot(text,text) to anon,authenticated;

create function public.cfy_os_order_action(p_token text,p_page text,p_order_id uuid,p_action text,p_data jsonb default '{}') returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;aid uuid:=nullif(actor->>'id','')::uuid;effective_role text;ord public.cfy_menu_orders%rowtype;begin
 if p_page not in ('takeaway','dinein','prep','kitchen','delivery') then raise exception 'invalid_page';end if;
 if not ((p_page='prep' and p_action in ('accept','ready','assign_driver','complete','issue','resolve_issue','reprint','cancel')) or (p_page='kitchen' and p_action in ('accept','ready','reprint')) or (p_page in ('takeaway','dinein') and p_action in ('accept','complete','reprint','cancel')) or (p_page='delivery' and p_action in ('picked_up','delivered','issue','delivery_exception'))) then raise exception 'forbidden_action' using errcode='42501';end if;
 select * into ord from cfy_menu_orders where id=p_order_id and client_id=cid for update;if ord.id is null then raise exception 'order_not_found';end if;
 if actor->>'role'<>'owner' and p_page='delivery' and (ord.order_type<>'delivery' or ord.assigned_driver_id is distinct from aid) then raise exception 'not_assigned_driver' using errcode='42501';end if;
 if p_page='dinein' and ord.order_type<>'dinein' then raise exception 'forbidden_order_type';end if;
 if p_page='takeaway' and ord.order_type='dinein' then raise exception 'forbidden_order_type';end if;
 if p_action='delivery_exception' then
  if ord.order_type<>'delivery' or ord.status<>'on_the_way' or ord.assigned_driver_id is null then raise exception 'invalid_transition';end if;
  if length(trim(coalesce(p_data->>'reason','')))<5 or not coalesce((p_data->>'confirmed')::boolean,false) then raise exception 'exception_reason_required';end if;
  update cfy_menu_orders set status='delivered',delivered_at=now(),receipt_verification='pending',otp_exception_reason=left(p_data->>'reason',500),updated_at=now() where id=ord.id;
  update cfy_menu_delivery_assignments set status='delivered',delivered_at=now() where order_id=ord.id and driver_id=ord.assigned_driver_id and status='picked_up';
  insert into cfy_menu_order_events(client_id,order_id,event_type,actor_type,actor_id,data) values(cid,ord.id,'delivery_otp_exception',case when actor->>'role'='owner' then 'owner' else 'staff' end,aid,jsonb_build_object('reason',left(p_data->>'reason',500),'customer_confirmation_required',true));
  return public.cfy_menu_order_payload(ord.id);
 end if;
 if p_action='complete' and ord.receipt_verification in ('pending','disputed') then raise exception 'customer_confirmation_required';end if;
 effective_role:=case when actor->>'role'='owner' then 'owner' when p_page='delivery' then 'delivery' when p_page in ('prep','kitchen') then 'coordinator' else 'cashier' end;
 return public.cfy_menu_order_action_core(cid,case when actor->>'role'='owner' then 'owner' else 'staff' end,aid,effective_role,p_order_id,p_action,p_data);
end $$;
revoke all on function public.cfy_os_order_action(text,text,uuid,text,jsonb) from public;
grant execute on function public.cfy_os_order_action(text,text,uuid,text,jsonb) to anon,authenticated;

create function public.cfy_os_customer_receipt(p_reference text,p_tracking_token text,p_received boolean) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare ord public.cfy_menu_orders%rowtype;begin
 select * into ord from cfy_menu_orders where reference=upper(trim(p_reference)) and tracking_token_hash=encode(digest(p_tracking_token,'sha256'),'hex') for update;
 if ord.id is null then raise exception 'order_not_found';end if;
 if ord.receipt_verification<>'pending' then raise exception 'receipt_not_pending';end if;
 if p_received is null then raise exception 'confirmation_required';end if;
 update cfy_menu_orders set receipt_verification=case when p_received then 'verified' else 'disputed' end,issue_open=case when p_received then issue_open else true end,issue_text=case when p_received then issue_text else 'العميل ينفي استلام الطلب بعد التسليم بدون OTP' end,payment_status=case when p_received and payment_method in ('cash','pay_on_delivery') then 'paid' else payment_status end,paid_at=case when p_received and payment_method in ('cash','pay_on_delivery') then coalesce(paid_at,now()) else paid_at end,updated_at=now() where id=ord.id;
 insert into cfy_menu_order_events(client_id,order_id,event_type,actor_type,data) values(ord.client_id,ord.id,case when p_received then 'receipt_verified' else 'receipt_disputed' end,'customer',jsonb_build_object('received',p_received));
 return jsonb_build_object('ok',true,'receipt_verification',case when p_received then 'verified' else 'disputed' end);
end $$;
revoke all on function public.cfy_os_customer_receipt(text,text,boolean) from public;
grant execute on function public.cfy_os_customer_receipt(text,text,boolean) to anon,authenticated;

create function public.cfy_os_analytics(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'analytics');cid uuid:=(actor->>'client_id')::uuid;result jsonb;begin
 if p_from is null or p_to is null or p_from>p_to or p_to-p_from>3660 then raise exception 'invalid_date_range';end if;
 if p_branch is not null and not exists(select 1 from cfy_os_branches where id=p_branch and client_id=cid) then raise exception 'invalid_branch';end if;
 with orders as (select * from cfy_menu_orders where client_id=cid and (created_at at time zone 'Africa/Cairo')::date between p_from and p_to and (p_branch is null or branch_id=p_branch)),
 revenue as (select * from orders where status<>'cancelled' and payment_status='paid'),
 days as (select (created_at at time zone 'Africa/Cairo')::date d,count(*) n,sum(case when status<>'cancelled' and payment_status='paid' then total else 0 end) amount from orders group by 1),
 categories as (select coalesce(c.name_ar,c.name_en,'غير مصنف') label,sum(i.quantity) quantity,sum(i.line_total) amount from revenue o join cfy_menu_order_items i on i.order_id=o.id left join cfy_menu_products p on p.id=i.product_id and p.client_id=cid left join cfy_menu_categories c on c.id=p.category_id and c.client_id=cid group by 1),
 drivers as (select s.id,s.name,count(o.id) handled,count(o.id) filter(where o.issue_open) issues,count(o.id) filter(where o.status in ('delivered','completed')) delivered,avg(extract(epoch from (o.delivered_at-o.picked_up_at))/60) filter(where o.delivered_at>=o.picked_up_at) duration from cfy_menu_staff s left join orders o on o.assigned_driver_id=s.id where s.client_id=cid and s.role='delivery' group by s.id,s.name)
 select jsonb_build_object(
 'summary',jsonb_build_object('orders',(select count(*) from orders),'revenue',coalesce((select sum(total) from revenue),0),'average_order',coalesce((select avg(total) from revenue),0),'completed',(select count(*) from orders where status='completed'),'cancelled',(select count(*) from orders where status='cancelled'),'rating',(select avg(rating) from orders),'preparation_minutes',(select avg(extract(epoch from (ready_at-preparing_at))/60) from orders where ready_at>=preparing_at),'delivery_minutes',(select avg(extract(epoch from (delivered_at-picked_up_at))/60) from orders where delivered_at>=picked_up_at)),
 'days',coalesce((select jsonb_agg(jsonb_build_object('label',d,'orders',n,'value',amount) order by d) from days),'[]'),
 'sources',coalesce((select jsonb_agg(x) from (select order_source label,count(*) orders,sum(case when payment_status='paid' and status<>'cancelled' then total else 0 end) value from orders group by 1)x),'[]'),
 'types',coalesce((select jsonb_agg(x) from (select order_type label,count(*) orders,sum(case when payment_status='paid' and status<>'cancelled' then total else 0 end) value from orders group by 1)x),'[]'),
 'payments',coalesce((select jsonb_agg(x) from (select payment_method label,count(*) orders,sum(total) value from revenue group by 1)x),'[]'),
 'statuses',coalesce((select jsonb_agg(x) from (select status label,count(*) value from orders group by 1)x),'[]'),
 'categories',coalesce((select jsonb_agg(jsonb_build_object('label',label,'quantity',quantity,'value',amount) order by amount desc) from categories),'[]'),
 'hours',coalesce((select jsonb_agg(x order by label) from (select extract(hour from created_at at time zone 'Africa/Cairo')::integer label,count(*) value,sum(case when payment_status='paid' and status<>'cancelled' then total else 0 end) revenue from orders group by 1)x),'[]'),
 'drivers',coalesce((select jsonb_agg(to_jsonb(d) order by delivered desc) from drivers d),'[]'),
 'branches',coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name)) from cfy_os_branches where client_id=cid),'[]')) into result;
 return result;
end $$;
revoke all on function public.cfy_os_analytics(text,date,date,uuid) from public;
grant execute on function public.cfy_os_analytics(text,date,date,uuid) to anon,authenticated;

create table public.cfy_os_requests(client_id uuid not null,request_key uuid not null,request_hash text not null,result jsonb not null,created_at timestamptz not null default now(),primary key(client_id,request_key));
alter table public.cfy_os_requests enable row level security;
revoke all on public.cfy_os_requests from public,anon,authenticated;

create function public.cfy_os_validate_branch(p_client uuid,p_order jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare bid uuid:=nullif(p_order->>'branch_id','')::uuid;z public.cfy_menu_delivery_zones%rowtype;t public.cfy_menu_tables%rowtype;begin
 if bid is null and (select count(*) from cfy_os_branches where client_id=p_client and enabled)=1 then select id into bid from cfy_os_branches where client_id=p_client and enabled;end if;
 if bid is null and exists(select 1 from cfy_os_branches where client_id=p_client and enabled) then raise exception 'branch_required';end if;
 if bid is not null and not exists(select 1 from cfy_os_branches where id=bid and client_id=p_client and enabled) then raise exception 'invalid_branch';end if;
 if nullif(p_order->>'delivery_zone_id','') is not null then select * into z from cfy_menu_delivery_zones where id=(p_order->>'delivery_zone_id')::uuid and client_id=p_client and enabled;if z.id is null or (z.branch_id is not null and z.branch_id is distinct from bid) then raise exception 'invalid_delivery_zone';end if;end if;
 if p_order->>'order_type'='dinein' and nullif(p_order->>'table_id','') is not null then select * into t from cfy_menu_tables where id=(p_order->>'table_id')::uuid and client_id=p_client and enabled for update;if t.id is null or t.service_state<>'available' or (t.branch_id is not null and t.branch_id is distinct from bid) then raise exception 'table_unavailable';end if;end if;
 return bid;
end $$;
revoke all on function public.cfy_os_validate_branch(uuid,jsonb) from public,anon,authenticated;

create function public.cfy_os_pos_order(p_token text,p_page text,p_order jsonb,p_intent text,p_request_key uuid) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;bid uuid;result jsonb;old public.cfy_os_requests%rowtype;hash text;aid uuid:=nullif(actor->>'id','')::uuid;atype text:=case when actor->>'role'='owner' then 'owner' else 'staff' end;begin
 if p_page not in ('takeaway','dinein') or p_intent not in ('save','kitchen','pay') or p_request_key is null then raise exception 'invalid_operation';end if;
 if (p_page='dinein' and p_order->>'order_type'<>'dinein') or (p_page='takeaway' and p_order->>'order_type' not in ('takeaway','delivery')) then raise exception 'forbidden_order_type';end if;
 hash:=encode(digest(jsonb_build_object('order',p_order,'intent',p_intent,'actor',actor->'id')::text,'sha256'),'hex');
 perform pg_advisory_xact_lock(hashtextextended(cid::text||p_request_key::text,0));
 select * into old from cfy_os_requests where client_id=cid and request_key=p_request_key;
 if old.request_key is not null then if old.request_hash<>hash then raise exception 'request_conflict';end if;return old.result||'{"duplicate":true}'::jsonb;end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 result:=public.cfy_menu_create_internal_order_v2(cid,atype,aid,coalesce(p_order->>'source','pos'),p_order);
 result:=public.cfy_menu_finalize_created_order_v3((result->>'id')::uuid,p_order,result);
 update cfy_menu_orders set branch_id=bid where id=(result->>'id')::uuid;
 if p_intent in ('kitchen','pay') then perform public.cfy_menu_order_action_core(cid,atype,aid,'cashier',(result->>'id')::uuid,'accept','{}');end if;
 if p_intent='pay' then
  update cfy_menu_orders set payment_status='paid',paid_at=now(),updated_at=now() where id=(result->>'id')::uuid;
  insert into cfy_menu_order_events(client_id,order_id,event_type,actor_type,actor_id) values(cid,(result->>'id')::uuid,'pos_payment_recorded',atype,aid);
 end if;
 result:=result||jsonb_build_object('branch_id',bid,'order',public.cfy_menu_order_payload((result->>'id')::uuid));
 insert into cfy_os_requests(client_id,request_key,request_hash,result) values(cid,p_request_key,hash,result);return result;
end $$;
revoke all on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) from public;
grant execute on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) to anon,authenticated;

create function public.cfy_os_table_action(p_token text,p_table uuid,p_action text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'dinein');cid uuid:=(actor->>'client_id')::uuid;sid uuid;begin
 perform 1 from cfy_menu_tables where id=p_table and client_id=cid for update;if not found then raise exception 'table_not_found';end if;
 select id into sid from cfy_menu_table_sessions where table_id=p_table and client_id=cid and status in ('open','bill_requested','payment_pending') order by opened_at desc limit 1 for update;
 if p_action in ('available','reserved','out_of_service') then
  if sid is not null then raise exception 'table_busy';end if;
  update cfy_menu_tables set service_state=p_action where id=p_table;
 elsif p_action='bill_requested' then
  if sid is null then raise exception 'table_not_open';end if;update cfy_menu_table_sessions set status='bill_requested',updated_at=now() where id=sid;
 elsif p_action in ('payment_pending','close_paid') then
  return public.cfy_menu_table_action_core(cid,case when actor->>'role'='owner' then 'owner' else 'staff' end,nullif(actor->>'id','')::uuid,'cashier',sid,p_action);
 else raise exception 'unsupported_action';end if;
 insert into cfy_os_audit_events(client_id,actor_id,actor_role,operation,entity_id) values(cid,nullif(actor->>'id','')::uuid,actor->>'role','table:'||p_action,p_table);return jsonb_build_object('ok',true);
end $$;
revoke all on function public.cfy_os_table_action(text,uuid,text) from public;
grant execute on function public.cfy_os_table_action(text,uuid,text) to anon,authenticated;

create function public.cfy_os_pos_quote(p_token text,p_page text,p_order jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;code text;bid uuid;result jsonb;begin
 if p_page not in ('takeaway','dinein') then raise exception 'invalid_operation';end if;
 if (p_page='dinein' and p_order->>'order_type'<>'dinein') or (p_page='takeaway' and p_order->>'order_type' not in ('takeaway','delivery')) then raise exception 'forbidden_order_type';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 select c.code into code from cfy_clients c where c.id=cid;
 result:=public.cfy_menu_quote_order_v3(code,p_order);
 return result||jsonb_build_object('branch_id',bid);
end $$;
revoke all on function public.cfy_os_pos_quote(text,text,jsonb) from public;
grant execute on function public.cfy_os_pos_quote(text,text,jsonb) to anon,authenticated;

create table public.cfy_os_customer_profiles(
 id uuid primary key default gen_random_uuid(),client_id uuid not null references public.cfy_clients(id) on delete cascade,
 device_token_hash text not null,phone_normalized text not null,profile jsonb not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(client_id,device_token_hash)
);
create index cfy_os_customer_profiles_phone_idx on public.cfy_os_customer_profiles(client_id,phone_normalized);
create table public.cfy_os_customer_orders(
 profile_id uuid not null references public.cfy_os_customer_profiles(id) on delete cascade,order_id uuid not null references public.cfy_menu_orders(id) on delete cascade,
 tracking_token text not null,delivery_otp text,created_at timestamptz not null default now(),primary key(profile_id,order_id)
);
alter table public.cfy_os_customer_profiles enable row level security;
alter table public.cfy_os_customer_orders enable row level security;
revoke all on public.cfy_os_customer_profiles,public.cfy_os_customer_orders from public,anon,authenticated;

create function public.cfy_os_phone(p_phone text) returns text language plpgsql immutable set search_path=public as $$
declare digits text:=regexp_replace(coalesce(p_phone,''),'\D','','g');begin
 if digits like '0020%' then digits:=substr(digits,5);elsif digits like '20%' and length(digits)=12 then digits:=substr(digits,3);end if;
 if digits not like '01%' or length(digits)<>11 then raise exception 'invalid_egyptian_phone';end if;
 return '+20'||substr(digits,2);
end $$;
revoke all on function public.cfy_os_phone(text) from public,anon,authenticated;

create function public.cfy_os_customer_payload(p_profile uuid) returns jsonb language sql security definer set search_path=public as $$
 select jsonb_build_object(
  'profile',p.profile,
  'orders',coalesce((select jsonb_agg(jsonb_build_object('reference',o.reference,'status',o.status,'order_type',o.order_type,'total',o.total,'created_at',o.created_at,'tracking_token',x.tracking_token,'delivery_otp',x.delivery_otp,'receipt_verification',o.receipt_verification) order by o.created_at desc) from cfy_os_customer_orders x join cfy_menu_orders o on o.id=x.order_id where x.profile_id=p.id),'[]'::jsonb)
 ) from cfy_os_customer_profiles p where p.id=p_profile
$$;
revoke all on function public.cfy_os_customer_payload(uuid) from public,anon,authenticated;

create function public.cfy_os_customer_profile(p_code text,p_device_token text,p_data jsonb default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;pid uuid;phone text;safe_data jsonb;begin
 if length(coalesce(p_device_token,''))<32 then raise exception 'invalid_device_token';end if;
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 if cid is null then raise exception 'menu_unavailable';end if;
 select id into pid from cfy_os_customer_profiles where client_id=cid and device_token_hash=encode(digest(p_device_token,'sha256'),'hex');
 if p_data is not null then
  phone:=public.cfy_os_phone(p_data->>'phone');
  if length(trim(coalesce(p_data->>'name','')))<2 then raise exception 'customer_name_required';end if;
  if nullif(p_data->>'branch_id','') is not null and not exists(select 1 from cfy_os_branches where id=(p_data->>'branch_id')::uuid and client_id=cid and enabled) then raise exception 'invalid_branch';end if;
  if nullif(p_data->>'zone_id','') is not null and not exists(select 1 from cfy_menu_delivery_zones where id=(p_data->>'zone_id')::uuid and client_id=cid and enabled) then raise exception 'invalid_delivery_zone';end if;
  safe_data:=jsonb_build_object('name',left(trim(p_data->>'name'),160),'phone',regexp_replace(p_data->>'phone','\D','','g'),'whatsapp',left(coalesce(p_data->>'whatsapp',''),40),'address',left(coalesce(p_data->>'address',''),1000),'branch_id',nullif(p_data->>'branch_id',''),'zone_id',nullif(p_data->>'zone_id',''));
  insert into cfy_os_customer_profiles(client_id,device_token_hash,phone_normalized,profile) values(cid,encode(digest(p_device_token,'sha256'),'hex'),phone,safe_data)
  on conflict(client_id,device_token_hash) do update set phone_normalized=excluded.phone_normalized,profile=excluded.profile,updated_at=now() returning id into pid;
 end if;
 if pid is null then return null;end if;
 return public.cfy_os_customer_payload(pid);
end $$;
revoke all on function public.cfy_os_customer_profile(text,text,jsonb) from public;
grant execute on function public.cfy_os_customer_profile(text,text,jsonb) to anon,authenticated;

create function public.cfy_os_customer_recover(p_code text,p_phone text,p_reference text,p_device_token text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;phone text;pid uuid;source_pid uuid;begin
 if length(coalesce(p_device_token,''))<32 then raise exception 'invalid_device_token';end if;
 phone:=public.cfy_os_phone(p_phone);
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 select cp.id into source_pid from cfy_os_customer_profiles cp join cfy_os_customer_orders co on co.profile_id=cp.id join cfy_menu_orders o on o.id=co.order_id where cp.client_id=cid and cp.phone_normalized=phone and o.reference=upper(trim(p_reference)) limit 1;
 if source_pid is null then raise exception 'recovery_proof_invalid';end if;
 insert into cfy_os_customer_profiles(client_id,device_token_hash,phone_normalized,profile)
 select cid,encode(digest(p_device_token,'sha256'),'hex'),phone,profile from cfy_os_customer_profiles where id=source_pid
 on conflict(client_id,device_token_hash) do update set phone_normalized=excluded.phone_normalized,profile=excluded.profile,updated_at=now() returning id into pid;
 insert into cfy_os_customer_orders(profile_id,order_id,tracking_token,delivery_otp)
 select pid,co.order_id,co.tracking_token,co.delivery_otp from cfy_os_customer_orders co join cfy_os_customer_profiles cp on cp.id=co.profile_id where cp.client_id=cid and cp.phone_normalized=phone
 on conflict(profile_id,order_id) do nothing;
 return public.cfy_os_customer_payload(pid);
end $$;
revoke all on function public.cfy_os_customer_recover(text,text,text,text) from public;
grant execute on function public.cfy_os_customer_recover(text,text,text,text) to anon,authenticated;

create function public.cfy_os_public_order(p_code text,p_device_token text,p_order jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;pid uuid;bid uuid;result jsonb;phone text;begin
 if length(coalesce(p_device_token,''))<32 then raise exception 'invalid_device_token';end if;
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 if cid is null then raise exception 'menu_unavailable';end if;
 phone:=public.cfy_os_phone(p_order->>'phone');
 select id into pid from cfy_os_customer_profiles where client_id=cid and device_token_hash=encode(digest(p_device_token,'sha256'),'hex') and phone_normalized=phone;
 if pid is null then raise exception 'customer_profile_required';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 result:=public.cfy_menu_create_order_v3(p_code,p_order);
 if coalesce((result->>'duplicate')::boolean,false) then return result;end if;
 update cfy_menu_orders set branch_id=bid where id=(result->>'id')::uuid;
 insert into cfy_os_customer_orders(profile_id,order_id,tracking_token,delivery_otp) values(pid,(result->>'id')::uuid,result->>'tracking_token',result->>'delivery_otp') on conflict do nothing;
 return result||jsonb_build_object('branch_id',bid);
end $$;
revoke all on function public.cfy_os_public_order(text,text,jsonb) from public;
grant execute on function public.cfy_os_public_order(text,text,jsonb) to anon,authenticated;

create function public.cfy_os_public_track(p_reference text,p_tracking_token text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare result jsonb;ord public.cfy_menu_orders%rowtype;begin
 result:=public.cfy_menu_public_order_track(p_reference,p_tracking_token);
 if result is null then return null;end if;
 select * into ord from cfy_menu_orders where reference=upper(trim(p_reference)) and tracking_token_hash=encode(digest(p_tracking_token,'sha256'),'hex');
 return result||jsonb_build_object('receipt_verification',ord.receipt_verification,'otp_exception_reason',ord.otp_exception_reason);
end $$;
revoke all on function public.cfy_os_public_track(text,text) from public;
grant execute on function public.cfy_os_public_track(text,text) to anon,authenticated;

create function public.cfy_os_public_feedback(p_reference text,p_tracking_token text,p_overall integer,p_food_quality integer default null,p_delivery_speed integer default null,p_packaging integer default null,p_feedback text default '') returns boolean language plpgsql security definer set search_path=public,extensions as $$
declare ord public.cfy_menu_orders%rowtype;begin
 select * into ord from cfy_menu_orders where reference=upper(trim(p_reference)) and tracking_token_hash=encode(digest(p_tracking_token,'sha256'),'hex') for update;
 if ord.id is null then return false;end if;
 if ord.status not in ('delivered','completed') then raise exception 'rating_not_available';end if;
 if ord.order_type='delivery' and ord.receipt_verification in ('pending','disputed') then raise exception 'receipt_confirmation_required';end if;
 if p_overall not between 1 and 5 or (p_food_quality is not null and p_food_quality not between 1 and 5) or (p_packaging is not null and p_packaging not between 1 and 5) or (ord.order_type='delivery' and p_delivery_speed is not null and p_delivery_speed not between 1 and 5) then raise exception 'invalid_rating';end if;
 update cfy_menu_orders set rating=p_overall,food_quality_rating=coalesce(p_food_quality,food_quality_rating),delivery_speed_rating=case when order_type='delivery' then coalesce(p_delivery_speed,delivery_speed_rating) else null end,packaging_rating=coalesce(p_packaging,packaging_rating),feedback=left(coalesce(p_feedback,''),1000),updated_at=now() where id=ord.id;
 return true;
end $$;
revoke all on function public.cfy_os_public_feedback(text,text,integer,integer,integer,integer,text) from public;
grant execute on function public.cfy_os_public_feedback(text,text,integer,integer,integer,integer,text) to anon,authenticated;

create function public.cfy_os_public_branches(p_code text) returns jsonb language sql security definer set search_path=public as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',b.id,'name',b.name,'address',b.address,'phone',b.phone) order by b.name),'[]'::jsonb) from cfy_os_branches b join cfy_clients c on c.id=b.client_id where upper(c.code)=upper(trim(p_code)) and c.active and b.enabled
$$;
revoke all on function public.cfy_os_public_branches(text) from public;
grant execute on function public.cfy_os_public_branches(text) to anon,authenticated;

-- Old staff pages redirect to Restaurant OS. Operational access now passes page permissions.
revoke execute on function public.cfy_menu_staff_operational_snapshot(text,integer) from public,anon,authenticated;
revoke execute on function public.cfy_menu_staff_create_order(text,text,jsonb) from public,anon,authenticated;
revoke execute on function public.cfy_menu_staff_create_order_v3(text,text,jsonb) from public,anon,authenticated;
revoke execute on function public.cfy_menu_staff_order_action(text,uuid,text,jsonb) from public,anon,authenticated;
revoke execute on function public.cfy_menu_staff_table_action(text,uuid,text) from public,anon,authenticated;
revoke execute on function public.cfy_menu_public_feedback(text,text,integer,text) from public,anon,authenticated;
revoke execute on function public.cfy_menu_public_feedback_detailed(text,text,integer,integer,integer,integer,text) from public,anon,authenticated;
