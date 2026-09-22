-- Close confirmed PR #28 re-check blockers without changing public API signatures.

create or replace function public.cfy_os_finance_mutate(p_token text,p_kind text,p_action text,p_data jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'accounts');cid uuid:=(actor->>'client_id')::uuid;eid uuid:=nullif(p_data->>'id','')::uuid;bid uuid:=nullif(p_data->>'branch_id','')::uuid;expected integer:=coalesce((p_data->>'version')::int,1);tbl text;existing jsonb;result jsonb;qty numeric;cost numeric;begin
 if p_kind not in ('revenue','expense','cash_in','cash_out','closure','payroll','inventory','recipe','employee') or p_action not in ('save','archive','restore','movement') then raise exception 'invalid_operation';end if;
 tbl:=case p_kind when 'inventory' then 'cfy_os_inventory' when 'recipe' then 'cfy_os_recipes' when 'employee' then 'cfy_os_employees' else 'cfy_os_finance_entries' end;
 if bid is not null and not exists(select 1 from cfy_os_branches where id=bid and client_id=cid and enabled) then raise exception 'invalid_branch';end if;
 if eid is not null then
  execute format('select to_jsonb(t) from public.%I t where id=$1 and client_id=$2 for update',tbl) into existing using eid,cid;
  if existing is null then raise exception 'record_not_found';end if;
  if actor->>'role'<>'owner' and not public.cfy_os_actor_branch_allowed(actor,nullif(existing->>'branch_id','')::uuid) then raise exception 'record_not_found';end if;
  if (existing->>'version')::int<>expected then raise exception 'record_changed_reload';end if;
  if tbl='cfy_os_finance_entries' and existing->>'kind'<>p_kind then raise exception 'invalid_kind';end if;
 end if;
 if p_action='save' then
  bid:=coalesce(bid,nullif(existing->>'branch_id','')::uuid,nullif(actor->>'default_branch_id','')::uuid);
  if bid is not null and not exists(select 1 from cfy_os_branches where id=bid and client_id=cid and enabled) then raise exception 'invalid_branch';end if;
  if actor->>'role'<>'owner' and (bid is null or not public.cfy_os_actor_branch_allowed(actor,bid)) then raise exception 'branch_forbidden' using errcode='42501';end if;
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

create or replace function public.cfy_os_finance_snapshot(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'accounts');cid uuid:=(actor->>'client_id')::uuid;begin
 if p_from is null or p_to is null or p_from>p_to or p_to-p_from>3660 then raise exception 'invalid_date_range';end if;
 if p_branch is not null and not exists(select 1 from cfy_os_branches where id=p_branch and client_id=cid) then raise exception 'invalid_branch';end if;
 if p_branch is not null and not public.cfy_os_actor_branch_allowed(actor,p_branch) then raise exception 'branch_forbidden' using errcode='42501';end if;
 return jsonb_build_object(
 'branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where client_id=cid and public.cfy_os_actor_branch_allowed(actor,b.id)),'[]'),
 'entries',coalesce((select jsonb_agg(to_jsonb(e) order by occurred_on desc,created_at desc) from cfy_os_finance_entries e where client_id=cid and not archived and occurred_on between p_from and p_to and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),'[]'),
 'order_revenue',coalesce((select jsonb_agg(jsonb_build_object('id',id,'reference',reference,'amount',total,'payment_method',payment_method,'source',order_source,'order_type',order_type,'branch_id',branch_id,'occurred_on',(paid_at at time zone 'Africa/Cairo')::date) order by paid_at desc) from cfy_menu_orders where client_id=cid and payment_status='paid' and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date between p_from and p_to and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),'[]'),
 'cash_balance',coalesce((select sum(case when kind in ('cash_in','revenue') then amount when kind in ('cash_out','expense','payroll') then -amount else 0 end) from cfy_os_finance_entries where client_id=cid and not archived and payment_method='cash' and occurred_on<=p_to and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),0)+coalesce((select sum(total) from cfy_menu_orders where client_id=cid and payment_status='paid' and payment_method in ('cash','pay_on_delivery') and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date<=p_to and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),0),
 'inventory',coalesce((select jsonb_agg(to_jsonb(i) order by name) from cfy_os_inventory i where client_id=cid and not archived and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),'[]'),
 'movements',coalesce((select jsonb_agg(to_jsonb(m) order by occurred_at desc) from cfy_os_stock_movements m where client_id=cid and (occurred_at at time zone 'Africa/Cairo')::date between p_from and p_to and exists(select 1 from cfy_os_inventory i where i.id=m.item_id and i.client_id=cid and not i.archived and (p_branch is null or i.branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,i.branch_id))),'[]'),
 'recipes',coalesce((select jsonb_agg(to_jsonb(r)||jsonb_build_object('cost',case when not archived then public.cfy_os_recipe_cost(cid,ingredients) else null end) order by name) from cfy_os_recipes r where client_id=cid and not archived and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),'[]'),
 'employees',coalesce((select jsonb_agg(to_jsonb(e) order by name) from cfy_os_employees e where client_id=cid and not archived and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),'[]'));
end $$;
revoke all on function public.cfy_os_finance_snapshot(text,date,date,uuid) from public;
grant execute on function public.cfy_os_finance_snapshot(text,date,date,uuid) to anon,authenticated;

-- Owner Command Center: deterministic read model over recorded Restaurant OS state.
-- No alert persistence or inferred AI rules are introduced by this migration.
create or replace function public.cfy_os_owner_command(
  p_token text,
  p_from date,
  p_to date,
  p_branch uuid default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor jsonb := public.cfy_os_session(p_token);
  cid uuid := (actor->>'client_id')::uuid;
  result jsonb;
begin
  if actor->>'role' <> 'owner' then
    raise exception 'owner_required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 3660 then
    raise exception 'invalid_date_range';
  end if;
  if p_branch is not null and not exists (
    select 1 from public.cfy_os_branches b
    where b.id = p_branch and b.client_id = cid and b.enabled
  ) then
    raise exception 'invalid_branch';
  end if;

  with scoped_orders as (
    select o.* from public.cfy_menu_orders o
    where o.client_id = cid
      and (o.created_at at time zone 'Africa/Cairo')::date between p_from and p_to
      and (p_branch is null or o.branch_id = p_branch)
  ), paid_orders as (
    select * from scoped_orders where status <> 'cancelled' and payment_status = 'paid'
  ), active_orders as (
    select o.* from public.cfy_menu_orders o
    where o.client_id = cid and o.status not in ('completed','cancelled')
      and (p_branch is null or o.branch_id = p_branch)
  ), finance_entries as (
    select e.* from public.cfy_os_finance_entries e
    where e.client_id = cid and not e.archived and e.occurred_on between p_from and p_to
      and (p_branch is null or e.branch_id = p_branch)
  ), finance_totals as (
    select
      coalesce((select sum(total) from paid_orders),0)
        + coalesce(sum(amount) filter(where kind='revenue'),0) revenue,
      coalesce(sum(amount) filter(where kind in ('expense','payroll')),0) expenses,
      coalesce(sum(amount) filter(where kind='payroll'),0) payroll
    from finance_entries
  ), low_inventory as (
    select i.* from public.cfy_os_inventory i
    where i.client_id = cid and not i.archived and i.quantity <= i.minimum_quantity
      and (p_branch is null or i.branch_id = p_branch)
  ), drivers as (
    select s.* from public.cfy_menu_staff s
    where s.client_id = cid and s.role = 'delivery' and s.enabled
      and (p_branch is null or exists(select 1 from public.cfy_os_staff_branches sb where sb.client_id=cid and sb.staff_id=s.id and sb.branch_id=p_branch))
  ), open_tables as (
    select s.*,t.label,t.branch_id from public.cfy_menu_table_sessions s
    join public.cfy_menu_tables t on t.id=s.table_id and t.client_id=cid
    where s.client_id=cid and s.status in ('bill_requested','payment_pending')
      and (p_branch is null or t.branch_id=p_branch)
  ), alert_rows as (
    select 'inventory:'||i.id::text id,'inventory' kind,
      case when i.quantity=0 then 'critical' else 'warning' end severity,
      case when i.quantity=0 then 'نفاد مخزون' else 'مخزون عند حد إعادة الطلب' end title,
      i.name||' — '||i.quantity::text||' '||i.unit detail,
      '/restaurant/?page=accounts-inventory' route,i.branch_id,i.updated_at created_at
    from low_inventory i
    union all
    select 'issue:'||o.id::text,'order_issue','critical','بلاغ طلب مفتوح',
      o.reference||case when nullif(trim(o.issue_text),'') is not null then ' — '||left(o.issue_text,180) else '' end,
      '/restaurant/?page=prep',o.branch_id,o.updated_at from active_orders o where o.issue_open
    union all
    select 'receipt:'||o.id::text,'receipt_confirmation',
      case when o.receipt_verification='disputed' then 'critical' else 'warning' end,
      case when o.receipt_verification='disputed' then 'العميل ينفي الاستلام' else 'تأكيد استلام العميل معلّق' end,
      o.reference||' — تسليم بدون OTP','/restaurant/?page=delivery',o.branch_id,o.updated_at
      from active_orders o where o.receipt_verification in ('pending','disputed')
    union all
    select 'driver:'||o.id::text,'driver_assignment','warning','طلب توصيل جاهز بلا مندوب',
      o.reference,'/restaurant/?page=prep',o.branch_id,o.updated_at
      from active_orders o where o.order_type='delivery' and o.status='ready' and o.assigned_driver_id is null
    union all
    select 'table:'||t.id::text,'table_payment','warning',
      case when t.status='payment_pending' then 'دفع طاولة معلّق' else 'فاتورة مطلوبة' end,
      t.label,'/restaurant/?page=dinein',t.branch_id,t.updated_at from open_tables t
    union all
    select 'cancelled:'||p_from::text||':'||coalesce(p_branch::text,'all'),'cancelled_orders','info','طلبات ملغاة خلال الفترة',
      count(*)::text||' طلب','/analytics/order-status/',p_branch,max(updated_at)
      from scoped_orders where status='cancelled' having count(*)>0
    union all
    select 'finance:'||p_from::text||':'||coalesce(p_branch::text,'all'),'negative_result','warning','نتيجة تشغيلية سالبة',
      'الإيرادات والمصروفات المسجلة تحتاج مراجعة','/restaurant/?page=accounts-profit',p_branch,now()
      from finance_totals where revenue-expenses<0
  ), alert_events as (
    select date_trunc('hour',e.created_at at time zone 'Africa/Cairo') bucket_at,count(*) value
    from public.cfy_menu_order_events e join scoped_orders o on o.id=e.order_id
    where e.client_id=cid and e.created_at>=now()-interval '24 hours'
      and e.event_type in ('issue_opened','delivery_otp_exception','receipt_disputed','cancelled')
    group by 1
  ), recent_actions as (
    select e.event_type operation,e.created_at,o.reference entity
    from public.cfy_menu_order_events e join scoped_orders o on o.id=e.order_id
    where e.client_id=cid and e.event_type in ('accepted','ready','driver_assigned','picked_up','delivered','completed','cancelled','issue_opened','issue_resolved','receipt_verified','receipt_disputed')
    order by e.created_at desc limit 12
  )
  select jsonb_build_object(
    'branches',coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'name',b.name) order by b.name)
      from public.cfy_os_branches b where b.client_id=cid and b.enabled),'[]'::jsonb),
    'summary',jsonb_build_object(
      'orders',(select count(*) from scoped_orders),
      'paid_orders',(select count(*) from paid_orders),
      'revenue',(select revenue from finance_totals),
      'expenses',(select expenses from finance_totals),
      'payroll',(select payroll from finance_totals),
      'operating_profit',(select revenue-expenses from finance_totals),
      'average_order',coalesce((select avg(total) from paid_orders),0),
      'average_rating',(select avg(rating) from scoped_orders where rating is not null),
      'rated_orders',(select count(*) from scoped_orders where rating is not null),
      'completed',(select count(*) from scoped_orders where status='completed'),
      'cancelled',(select count(*) from scoped_orders where status='cancelled'),
      'active_orders',(select count(*) from active_orders),
      'open_issues',(select count(*) from active_orders where issue_open),
      'pending_receipts',(select count(*) from active_orders where receipt_verification in ('pending','disputed')),
      'low_stock',(select count(*) from low_inventory),
      'inventory_value',coalesce((select sum(quantity*unit_price) from public.cfy_os_inventory i where i.client_id=cid and not i.archived and (p_branch is null or i.branch_id=p_branch)),0),
      'active_drivers',(select count(*) from drivers where shift_state='available'),
      'total_drivers',(select count(*) from drivers),
      'preparation_minutes',(select avg(extract(epoch from (ready_at-preparing_at))/60) from scoped_orders where ready_at>=preparing_at),
      'delivery_minutes',(select avg(extract(epoch from (delivered_at-picked_up_at))/60) from scoped_orders where delivered_at>=picked_up_at)
    ),
    'operations',jsonb_build_object(
      'new',(select count(*) from active_orders where status='new'),
      'preparing',(select count(*) from active_orders where status='preparing'),
      'ready',(select count(*) from active_orders where status='ready'),
      'on_the_way',(select count(*) from active_orders where status='on_the_way'),
      'table_payments',(select count(*) from open_tables)
    ),
    'inventory',coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name,'unit',unit,'quantity',quantity,'minimum_quantity',minimum_quantity,'branch_id',branch_id)
      order by (quantity=0) desc,quantity asc,name) from low_inventory),'[]'::jsonb),
    'alerts',coalesce((select jsonb_agg(to_jsonb(a) order by case severity when 'critical' then 1 when 'warning' then 2 else 3 end,created_at desc) from alert_rows a),'[]'::jsonb),
    'alert_events',coalesce((select jsonb_agg(jsonb_build_object('hour',bucket_at,'value',value) order by bucket_at) from alert_events),'[]'::jsonb),
    'recent_actions',coalesce((select jsonb_agg(to_jsonb(a) order by created_at desc) from recent_actions a),'[]'::jsonb)
  ) into result;

  return result;
end
$$;

revoke all on function public.cfy_os_owner_command(text,date,date,uuid) from public;
grant execute on function public.cfy_os_owner_command(text,date,date,uuid) to anon,authenticated;

