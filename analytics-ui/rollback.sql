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
 return result;
end $$;
