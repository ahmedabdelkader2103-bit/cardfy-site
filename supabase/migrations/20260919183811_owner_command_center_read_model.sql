-- Owner Command Center: deterministic read model over recorded Restaurant OS state.
-- No alert persistence or inferred AI rules are introduced by this migration.
create function public.cfy_os_owner_command(
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
