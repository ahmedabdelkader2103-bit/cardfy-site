-- Preserve existing analytics signature, grants, paid-revenue semantics and permission checks.
create or replace function public.cfy_os_analytics(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
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
 -- Additive read metrics. Same client, permission, dates and branch as the established RPC.
 with orders as (
   select * from cfy_menu_orders where client_id=cid
   and (created_at at time zone 'Africa/Cairo')::date between p_from and p_to
   and (p_branch is null or branch_id=p_branch)
 ), revenue as (select * from orders where status<>'cancelled' and payment_status='paid'),
 products as (
   select coalesce(p.name_ar,p.name_en,'صنف غير متاح') label,sum(i.quantity) quantity,sum(i.line_total) value
   from revenue o join cfy_menu_order_items i on i.order_id=o.id
   left join cfy_menu_products p on p.id=i.product_id and p.client_id=cid group by 1
 ), source_days as (
   select (created_at at time zone 'Africa/Cairo')::date as "day",order_source source,count(*) orders
   from orders group by 1,2
 ), driver_days as (
   select (delivered_at at time zone 'Africa/Cairo')::date as "day",count(*) delivered
   from orders where assigned_driver_id is not null and status in ('delivered','completed')
   and delivered_at is not null group by 1
 )
 select result || jsonb_build_object(
   'summary',(result->'summary') || jsonb_build_object('paid_orders',(select count(*) from revenue),'rating_count',(select count(*) from orders where rating is not null),'active_drivers',
     (select count(*) from cfy_menu_staff where client_id=cid and role='delivery' and enabled and shift_state='available')),
   'days',coalesce((select jsonb_agg(entry || jsonb_build_object('paid_orders',(select count(*) from revenue r where (r.created_at at time zone 'Africa/Cairo')::date=(entry->>'label')::date))) from jsonb_array_elements(result->'days') entry),'[]'::jsonb),
   'hours',coalesce((select jsonb_agg(entry || jsonb_build_object('preparation_minutes',(select avg(extract(epoch from (r.ready_at-r.preparing_at))/60) from orders r where r.ready_at>=r.preparing_at and extract(hour from r.created_at at time zone 'Africa/Cairo')=(entry->>'label')::integer))) from jsonb_array_elements(result->'hours') entry),'[]'::jsonb),
   'products',coalesce((select jsonb_agg(p order by quantity desc) from products p),'[]'::jsonb),
   'source_days',coalesce((select jsonb_agg(s order by "day",source) from source_days s),'[]'::jsonb),
   'driver_days',coalesce((select jsonb_agg(d order by "day") from driver_days d),'[]'::jsonb),
   'drivers',coalesce((select jsonb_agg(entry || jsonb_build_object('shift_state',s.shift_state))
     from jsonb_array_elements(result->'drivers') entry join cfy_menu_staff s
     on s.id=(entry->>'id')::uuid and s.client_id=cid),'[]'::jsonb)
 ) into result;

with scoped_orders as (
 select * from public.cfy_menu_orders where client_id=cid
 and (created_at at time zone 'Africa/Cairo')::date between p_from and p_to
 and (p_branch is null or branch_id=p_branch)
), paid_orders as (
 select * from scoped_orders where status<>'cancelled' and payment_status='paid'
), linked_customer_orders as (
 select distinct cp.phone_normalized customer_key,co.order_id
 from public.cfy_os_customer_orders co
 join public.cfy_os_customer_profiles cp on cp.id=co.profile_id and cp.client_id=cid
 join scoped_orders o on o.id=co.order_id
), customer_totals as (
 select x.customer_key,count(*) orders,
 sum(case when o.status<>'cancelled' and o.payment_status='paid' then o.total else 0 end) spent,
 min(o.created_at) first_order,max(o.created_at) last_order
 from linked_customer_orders x join scoped_orders o on o.id=x.order_id group by x.customer_key
), customer_month_counts as (
 select (date_trunc('month',o.created_at at time zone 'Africa/Cairo'))::date calendar_month,
 x.customer_key,count(*) orders
 from linked_customer_orders x join scoped_orders o on o.id=x.order_id group by 1,2
), customer_months as (
 select calendar_month,count(*) registered,count(*) filter(where orders>1) returning_customers
 from customer_month_counts group by calendar_month
), product_totals as (
 select i.product_id,coalesce(p.name_ar,p.name_en,'صنف لم يعد متاحًا') label,
 coalesce(c.name_ar,c.name_en,'غير مصنف') category,
 sum(i.quantity) quantity,sum(i.line_total) value,count(distinct o.id) order_count,
 avg(i.unit_price) unit_price
 from paid_orders o join public.cfy_menu_order_items i on i.order_id=o.id
 left join public.cfy_menu_products p on p.id=i.product_id and p.client_id=cid
 left join public.cfy_menu_categories c on c.id=p.category_id and c.client_id=cid
 group by i.product_id,p.name_ar,p.name_en,c.name_ar,c.name_en
), type_totals as (
 select order_type label,count(*) orders,count(*) filter(where status='completed') completed,
 count(*) filter(where status='cancelled') cancelled,
 coalesce(sum(total) filter(where status<>'cancelled' and payment_status='paid'),0) revenue
 from scoped_orders group by order_type
), type_sources as (
 select order_type label,order_source source,count(*) orders from scoped_orders group by order_type,order_source
), type_hours as (
 select extract(hour from created_at at time zone 'Africa/Cairo')::integer hour_of_day,
 order_type label,count(*) orders from scoped_orders group by 1,2
), status_hours as (
 select extract(hour from created_at at time zone 'Africa/Cairo')::integer hour_of_day,status label,count(*) orders
 from scoped_orders group by 1,2
), status_events as (
 select extract(hour from e.created_at at time zone 'Africa/Cairo')::integer hour_of_day,
 e.event_type label,count(*) events
 from public.cfy_menu_order_events e join scoped_orders o on o.id=e.order_id and e.client_id=cid
 where e.event_type in ('preparing','ready','picked_up','delivered','completed','cancelled')
 group by 1,2
), kitchen_days as (
 select (created_at at time zone 'Africa/Cairo')::date calendar_day,
 count(*) filter(where ready_at>=preparing_at) ready_count,
 avg(extract(epoch from (ready_at-preparing_at))/60) filter(where ready_at>=preparing_at) preparation_minutes
 from scoped_orders group by 1
)
select result || jsonb_build_object(
 'customer_summary',jsonb_build_object(
   'registered_customers',(select count(*) from customer_totals),
   'returning_customers',(select count(*) from customer_totals where orders>1),
   'linked_orders',(select count(*) from linked_customer_orders),
   'rated_orders',(select count(*) from scoped_orders where rating is not null),
   'average_rating',(select avg(rating) from scoped_orders where rating is not null)),
 'customer_segments',coalesce((select jsonb_agg(jsonb_build_object('label',segment,'value',customers)) from
   (select case when orders>1 then 'متكرر' else 'طلب واحد' end segment,count(*) customers from customer_totals group by 1) x),'[]'::jsonb),
 'customer_months',coalesce((select jsonb_agg(to_jsonb(x) order by calendar_month) from customer_months x),'[]'::jsonb),
 'customer_top',coalesce((select jsonb_agg(jsonb_build_object('rank',rank,'orders',orders,'spent',spent,'first_order',first_order,'last_order',last_order) order by spent desc)
   from (select row_number() over(order by spent desc,orders desc) rank,orders,spent,first_order,last_order from customer_totals order by spent desc,orders desc limit 20) x),'[]'::jsonb),
 'product_detail',coalesce((select jsonb_agg(jsonb_build_object('id',product_id,'label',label,'category',category,'quantity',quantity,'value',value,'order_count',order_count,'unit_price',unit_price) order by value desc) from product_totals),'[]'::jsonb),
 'type_detail',coalesce((select jsonb_agg(to_jsonb(x) order by orders desc) from type_totals x),'[]'::jsonb),
 'type_sources',coalesce((select jsonb_agg(to_jsonb(x)) from type_sources x),'[]'::jsonb),
 'type_hours',coalesce((select jsonb_agg(to_jsonb(x) order by hour_of_day,label) from type_hours x),'[]'::jsonb),
 'status_hours',coalesce((select jsonb_agg(to_jsonb(x) order by hour_of_day,label) from status_hours x),'[]'::jsonb),
 'status_events',coalesce((select jsonb_agg(to_jsonb(x) order by hour_of_day,label) from status_events x),'[]'::jsonb),
 'status_detail',coalesce((select jsonb_agg(jsonb_build_object('reference',reference,'status',status,'order_type',order_type,'order_source',order_source,'created_at',created_at,'updated_at',updated_at,'cancel_reason',cancel_reason) order by created_at desc)
   from (select o.reference,o.status,o.order_type,o.order_source,o.created_at,o.updated_at,
     (select nullif(left(trim(e.data->>'reason'),500),'') from public.cfy_menu_order_events e
      where e.client_id=cid and e.order_id=o.id and e.event_type='cancelled'
      order by e.created_at desc limit 1) cancel_reason
     from scoped_orders o order by o.created_at desc limit 50) x),'[]'::jsonb),
 'kitchen_days',coalesce((select jsonb_agg(to_jsonb(x) order by calendar_day) from kitchen_days x),'[]'::jsonb),
 'kitchen_detail',coalesce((select jsonb_agg(jsonb_build_object('reference',reference,'status',status,'created_at',created_at,'preparing_at',preparing_at,'ready_at',ready_at,
   'preparation_minutes',case when ready_at>=preparing_at then extract(epoch from (ready_at-preparing_at))/60 else null end) order by created_at desc)
   from (select reference,status,created_at,preparing_at,ready_at from scoped_orders order by created_at desc limit 50) x),'[]'::jsonb)
) into result;

 return result;
end $$;
