begin;

create table public.cfy_os_staff_branches(
 client_id uuid not null references public.cfy_clients(id) on delete cascade,
 staff_id uuid not null references public.cfy_menu_staff(id) on delete cascade,
 branch_id uuid not null references public.cfy_os_branches(id) on delete cascade,
 is_default boolean not null default false,
 created_at timestamptz not null default now(),
 primary key(staff_id,branch_id)
);
create unique index cfy_os_staff_branches_one_default on public.cfy_os_staff_branches(staff_id) where is_default;
create index cfy_os_staff_branches_scope on public.cfy_os_staff_branches(client_id,branch_id,staff_id);
alter table public.cfy_os_staff_branches enable row level security;
revoke all on public.cfy_os_staff_branches from public,anon,authenticated;

create function public.cfy_os_staff_branch_guard() returns trigger language plpgsql set search_path=public as $$
begin
 if not exists(select 1 from cfy_menu_staff s where s.id=new.staff_id and s.client_id=new.client_id) or not exists(select 1 from cfy_os_branches b where b.id=new.branch_id and b.client_id=new.client_id) then raise exception 'invalid_branch_assignment';end if;
 return new;
end $$;
revoke all on function public.cfy_os_staff_branch_guard() from public,anon,authenticated;
create trigger cfy_os_staff_branch_guard before insert or update on public.cfy_os_staff_branches for each row execute function public.cfy_os_staff_branch_guard();

insert into public.cfy_os_staff_branches(client_id,staff_id,branch_id,is_default)
select distinct s.client_id,s.id,o.branch_id,false from public.cfy_menu_staff s join public.cfy_menu_orders o on o.client_id=s.client_id and o.assigned_driver_id=s.id join public.cfy_os_branches b on b.id=o.branch_id and b.client_id=s.client_id and b.enabled where o.branch_id is not null on conflict do nothing;
insert into public.cfy_os_staff_branches(client_id,staff_id,branch_id,is_default)
select s.client_id,s.id,b.id,false from public.cfy_menu_staff s join lateral(select id from public.cfy_os_branches where client_id=s.client_id and enabled order by created_at,id limit 1)b on true where not exists(select 1 from public.cfy_os_staff_branches sb where sb.staff_id=s.id) on conflict do nothing;
with ranked as(select staff_id,branch_id,row_number() over(partition by staff_id order by created_at,branch_id) rn from public.cfy_os_staff_branches) update public.cfy_os_staff_branches sb set is_default=true from ranked r where r.staff_id=sb.staff_id and r.branch_id=sb.branch_id and r.rn=1;

create function public.cfy_os_staff_branch_autofill() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into cfy_os_staff_branches(client_id,staff_id,branch_id,is_default) select new.client_id,new.id,b.id,true from cfy_os_branches b where b.client_id=new.client_id and b.enabled order by b.created_at,b.id limit 1 on conflict do nothing;return new;
end $$;
revoke all on function public.cfy_os_staff_branch_autofill() from public,anon,authenticated;
create trigger cfy_os_staff_branch_autofill after insert on public.cfy_menu_staff for each row execute function public.cfy_os_staff_branch_autofill();

create function public.cfy_os_actor_branch_allowed(p_actor jsonb,p_branch uuid) returns boolean language sql stable security definer set search_path=public as $$
 select coalesce(p_actor->>'role'='owner' or exists(select 1 from cfy_os_staff_branches sb join cfy_os_branches b on b.id=sb.branch_id and b.client_id=sb.client_id and b.enabled where sb.client_id=(p_actor->>'client_id')::uuid and sb.staff_id=nullif(p_actor->>'id','')::uuid and sb.branch_id=p_branch),false)
$$;
revoke all on function public.cfy_os_actor_branch_allowed(jsonb,uuid) from public,anon,authenticated;

create or replace function public.cfy_os_session(p_token text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare owner_id uuid;s public.cfy_menu_staff%rowtype;perms text[];branches uuid[];default_branch uuid;begin
 if p_token is null or length(p_token)<16 then raise exception 'invalid_session';end if;
 begin owner_id:=public.cfy_token_client_id(p_token,'menu');exception when others then owner_id:=null;end;
 if owner_id is not null then select coalesce(array_agg(id order by created_at),'{}'),(array_agg(id order by created_at))[1] into branches,default_branch from cfy_os_branches where client_id=owner_id and enabled;return jsonb_build_object('client_id',owner_id,'role','owner','name',(select coalesce(nullif(brand_name_ar,''),brand_name_en) from cfy_clients where id=owner_id),'permissions',array['tools','takeaway','dinein','prep','kitchen','delivery','analytics','accounts','settings'],'branch_ids',branches,'default_branch_id',default_branch);end if;
 owner_id:=public.cfy_menu_staff_client_id(p_token,null);select st.* into s from cfy_menu_staff_sessions ss join cfy_menu_staff st on st.id=ss.staff_id where ss.token_hash=encode(digest(p_token,'sha256'),'hex') and ss.expires_at>now() and st.enabled and st.client_id=owner_id;if s.id is null then raise exception 'invalid_session';end if;
 perms:=coalesce(s.page_permissions,case s.role when 'cashier' then array['takeaway','dinein'] when 'coordinator' then array['prep','kitchen'] when 'delivery' then array['delivery'] else array[]::text[] end);
 select coalesce(array_agg(sb.branch_id order by sb.is_default desc,b.created_at),'{}'),(array_agg(sb.branch_id) filter(where sb.is_default))[1] into branches,default_branch from cfy_os_staff_branches sb join cfy_os_branches b on b.id=sb.branch_id and b.enabled where sb.staff_id=s.id and sb.client_id=owner_id;
 return jsonb_build_object('client_id',owner_id,'id',s.id,'name',s.name,'role',s.role,'permissions',perms,'shift_state',s.shift_state,'branch_ids',branches,'default_branch_id',default_branch);
end $$;
revoke all on function public.cfy_os_session(text) from public;
grant execute on function public.cfy_os_session(text) to anon,authenticated;

create function public.cfy_os_staff_branches_set(p_token text,p_staff uuid,p_branches uuid[],p_default uuid) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'settings');cid uuid:=(actor->>'client_id')::uuid;begin
 if actor->>'role'<>'owner' then raise exception 'owner_required' using errcode='42501';end if;
 if p_staff is null or coalesce(array_length(p_branches,1),0)=0 or array_length(p_branches,1)>50 or p_default is null or not p_default=any(p_branches) then raise exception 'invalid_branch_assignment';end if;
 if not exists(select 1 from cfy_menu_staff where id=p_staff and client_id=cid) or exists(select 1 from unnest(p_branches) x left join cfy_os_branches b on b.id=x and b.client_id=cid and b.enabled where b.id is null) then raise exception 'invalid_branch_assignment';end if;
 delete from cfy_os_staff_branches where client_id=cid and staff_id=p_staff;
 insert into cfy_os_staff_branches(client_id,staff_id,branch_id,is_default) select cid,p_staff,x,x=p_default from(select distinct unnest(p_branches) x)q;
 insert into cfy_os_audit_events(client_id,actor_role,operation,entity_id,details) values(cid,'owner','staff_branches',p_staff,jsonb_build_object('branch_ids',p_branches,'default_branch_id',p_default));
 return jsonb_build_object('staff_id',p_staff,'branch_ids',p_branches,'default_branch_id',p_default);
end $$;
revoke all on function public.cfy_os_staff_branches_set(text,uuid,uuid[],uuid) from public;
grant execute on function public.cfy_os_staff_branches_set(text,uuid,uuid[],uuid) to anon,authenticated;

create or replace function public.cfy_os_operational_snapshot(p_token text,p_page text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;begin
 if p_page not in ('takeaway','dinein','prep','kitchen','delivery') then raise exception 'invalid_page';end if;
 return jsonb_build_object('actor',actor,
 'orders',coalesce((select jsonb_agg(public.cfy_menu_order_payload(o.id) order by o.created_at desc) from cfy_menu_orders o where o.client_id=cid and public.cfy_os_actor_branch_allowed(actor,o.branch_id) and (o.status not in ('completed','cancelled') or o.created_at>now()-interval '1 day') and (p_page<>'delivery' or actor->>'role'='owner' or o.assigned_driver_id=(actor->>'id')::uuid)),'[]'),
 'tables',case when p_page='delivery' then '[]'::jsonb else coalesce((select jsonb_agg(to_jsonb(t)||jsonb_build_object('session',(select to_jsonb(s) from cfy_menu_table_sessions s where s.table_id=t.id and s.status in ('open','bill_requested','payment_pending') order by opened_at desc limit 1)) order by sort_order,label) from cfy_menu_tables t where t.client_id=cid and public.cfy_os_actor_branch_allowed(actor,t.branch_id)),'[]') end,
 'drivers',case when p_page='prep' or actor->>'role'='owner' then coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'shift_state',s.shift_state) order by s.name) from cfy_menu_staff s where s.client_id=cid and s.role='delivery' and s.enabled and exists(select 1 from cfy_os_staff_branches sb where sb.staff_id=s.id and sb.client_id=cid and public.cfy_os_actor_branch_allowed(actor,sb.branch_id))),'[]') else '[]'::jsonb end,
 'branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where b.client_id=cid and b.enabled and public.cfy_os_actor_branch_allowed(actor,b.id)),'[]'),
 'catalog',public.cfy_menu_public_catalog((select code from cfy_clients where id=cid)));
end $$;
revoke all on function public.cfy_os_operational_snapshot(text,text) from public;
grant execute on function public.cfy_os_operational_snapshot(text,text) to anon,authenticated;

CREATE OR REPLACE FUNCTION public.cfy_menu_order_action_core(p_client_id uuid, p_actor_type text, p_actor_id uuid, p_actor_role text, p_order_id uuid, p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_order public.cfy_menu_orders%rowtype; v_settings public.cfy_menu_settings%rowtype; v_driver public.cfy_menu_staff%rowtype; v_driver_id uuid; v_job_type text; begin
  select * into v_order from public.cfy_menu_orders where id=p_order_id and client_id=p_client_id for update;
  if v_order.id is null then raise exception 'order_not_found' using errcode='P0001'; end if;
  select * into v_settings from public.cfy_menu_settings where client_id=p_client_id;
  if p_actor_role<>'owner' then
    if p_actor_role='coordinator' and p_action not in ('accept','ready','assign_driver','complete','cancel','issue','resolve_issue','reprint') then raise exception 'forbidden_action' using errcode='P0001'; end if;
    if p_actor_role='cashier' and p_action not in ('accept','complete','cancel','issue','resolve_issue','reprint') then raise exception 'forbidden_action' using errcode='P0001'; end if;
    if p_actor_role='delivery' and p_action not in ('picked_up','delivered','issue') then raise exception 'forbidden_action' using errcode='P0001'; end if;
  end if;

  case p_action
    when 'accept' then
      if v_order.status<>'new' then raise exception 'invalid_transition' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='preparing',accepted_at=coalesce(accepted_at,now()),preparing_at=coalesce(preparing_at,now()),updated_at=now() where id=v_order.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'accepted',p_actor_type,p_actor_id),(v_order.id,p_client_id,'preparing',p_actor_type,p_actor_id);
      if v_settings.kitchen_printer_enabled then insert into public.cfy_menu_print_jobs(client_id,order_id,job_type,status,copies,payload) values(p_client_id,v_order.id,'kitchen','pending',v_settings.print_copies,public.cfy_menu_order_payload(v_order.id)); end if;
    when 'ready' then
      if v_order.status<>'preparing' then raise exception 'invalid_transition' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='ready',ready_at=coalesce(ready_at,now()),updated_at=now() where id=v_order.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'ready',p_actor_type,p_actor_id);
    when 'assign_driver' then
      if v_order.order_type<>'delivery' or v_order.status<>'ready' then raise exception 'invalid_transition' using errcode='P0001'; end if;
      v_driver_id:=nullif(p_data->>'driver_id','')::uuid;
      if v_driver_id is null then
        select s.id into v_driver_id from public.cfy_menu_staff s where s.client_id=p_client_id and s.role='delivery' and s.enabled and s.shift_state='available' and exists(select 1 from public.cfy_os_staff_branches sb where sb.client_id=p_client_id and sb.staff_id=s.id and sb.branch_id=v_order.branch_id)
          order by (select count(*) from public.cfy_menu_delivery_assignments a where a.driver_id=s.id and a.status in ('assigned','picked_up')) asc,s.last_assigned_at nulls first,s.created_at limit 1;
      end if;
      select * into v_driver from public.cfy_menu_staff where id=v_driver_id and client_id=p_client_id and role='delivery' and enabled and shift_state='available' and exists(select 1 from public.cfy_os_staff_branches sb where sb.client_id=p_client_id and sb.staff_id=v_driver_id and sb.branch_id=v_order.branch_id);
      if v_driver.id is null then raise exception 'driver_unavailable' using errcode='P0001'; end if;
      update public.cfy_menu_delivery_assignments set status='cancelled',cancelled_at=now() where order_id=v_order.id and status in ('assigned','picked_up');
      insert into public.cfy_menu_delivery_assignments(client_id,order_id,driver_id,status,assigned_by_type,assigned_by_id) values(p_client_id,v_order.id,v_driver.id,'assigned',p_actor_type,p_actor_id);
      update public.cfy_menu_orders set assigned_driver_id=v_driver.id,updated_at=now() where id=v_order.id;
      update public.cfy_menu_staff set last_assigned_at=now(),updated_at=now() where id=v_driver.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id,data) values(v_order.id,p_client_id,'driver_assigned',p_actor_type,p_actor_id,jsonb_build_object('driver_id',v_driver.id,'driver_name',v_driver.name));
    when 'picked_up' then
      if v_order.order_type<>'delivery' or v_order.status<>'ready' or v_order.assigned_driver_id is null then raise exception 'invalid_transition' using errcode='P0001'; end if;
      if p_actor_role='delivery' and v_order.assigned_driver_id<>p_actor_id then raise exception 'not_assigned_driver' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='on_the_way',picked_up_at=coalesce(picked_up_at,now()),updated_at=now() where id=v_order.id;
      update public.cfy_menu_delivery_assignments set status='picked_up',picked_up_at=coalesce(picked_up_at,now()) where order_id=v_order.id and driver_id=v_order.assigned_driver_id and status='assigned';
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'picked_up',p_actor_type,p_actor_id);
    when 'delivered' then
      if v_order.order_type<>'delivery' or v_order.status<>'on_the_way' or v_order.assigned_driver_id is null then raise exception 'invalid_transition' using errcode='P0001'; end if;
      if p_actor_role='delivery' and v_order.assigned_driver_id<>p_actor_id then raise exception 'not_assigned_driver' using errcode='P0001'; end if;
      if v_order.delivery_otp_hash is not null and encode(digest(coalesce(p_data->>'otp',''),'sha256'),'hex')<>v_order.delivery_otp_hash then raise exception 'invalid_otp' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='delivered',delivered_at=coalesce(delivered_at,now()),payment_status=case when payment_method in ('cash','pay_on_delivery') then 'paid' else payment_status end,paid_at=case when payment_method in ('cash','pay_on_delivery') then coalesce(paid_at,now()) else paid_at end,updated_at=now() where id=v_order.id;
      update public.cfy_menu_delivery_assignments set status='delivered',delivered_at=coalesce(delivered_at,now()) where order_id=v_order.id and driver_id=v_order.assigned_driver_id and status in ('assigned','picked_up');
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'delivered',p_actor_type,p_actor_id);
    when 'complete' then
      if not ((v_order.order_type='delivery' and v_order.status='delivered') or (v_order.order_type in ('takeaway','dinein') and v_order.status='ready')) then raise exception 'invalid_transition' using errcode='P0001'; end if;
      if v_order.order_type in ('delivery','dinein') and v_order.payment_status<>'paid' then raise exception 'payment_required' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='completed',completed_at=coalesce(completed_at,now()),payment_status=case when order_type='takeaway' and payment_method='cash' then 'paid' else payment_status end,paid_at=case when order_type='takeaway' and payment_method='cash' then coalesce(paid_at,now()) else paid_at end,updated_at=now() where id=v_order.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'completed',p_actor_type,p_actor_id);
    when 'cancel' then
      if v_order.status in ('completed','delivered','cancelled') then raise exception 'invalid_transition' using errcode='P0001'; end if;
      update public.cfy_menu_orders set status='cancelled',cancelled_at=coalesce(cancelled_at,now()),updated_at=now() where id=v_order.id;
      update public.cfy_menu_delivery_assignments set status='cancelled',cancelled_at=now() where order_id=v_order.id and status in ('assigned','picked_up');
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id,data) values(v_order.id,p_client_id,'cancelled',p_actor_type,p_actor_id,jsonb_build_object('reason',left(coalesce(p_data->>'reason',''),500)));
    when 'issue' then
      -- A delivery user may only access the delivery currently assigned to them.
      if p_actor_role='delivery' and (v_order.order_type<>'delivery'
        or v_order.assigned_driver_id is null or p_actor_id is null
        or v_order.assigned_driver_id is distinct from p_actor_id) then
        raise exception 'not_assigned_driver' using errcode='P0001';
      end if;
      update public.cfy_menu_orders set issue_open=true,issue_text=left(coalesce(p_data->>'text',''),1000),updated_at=now() where id=v_order.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id,data) values(v_order.id,p_client_id,'issue_opened',p_actor_type,p_actor_id,jsonb_build_object('text',left(coalesce(p_data->>'text',''),1000)));
    when 'resolve_issue' then
      update public.cfy_menu_orders set issue_open=false,updated_at=now() where id=v_order.id;
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'issue_resolved',p_actor_type,p_actor_id);
    when 'reprint' then
      v_job_type:=coalesce(p_data->>'job_type','cashier'); if v_job_type not in ('cashier','kitchen') then raise exception 'invalid_print_type' using errcode='P0001'; end if;
      insert into public.cfy_menu_print_jobs(client_id,order_id,job_type,status,copies,payload) values(p_client_id,v_order.id,v_job_type,'pending',greatest(1,least(5,coalesce((p_data->>'copies')::int,v_settings.print_copies))),public.cfy_menu_order_payload(v_order.id));
    else raise exception 'unsupported_action' using errcode='P0001';
  end case;
  return public.cfy_menu_order_payload(v_order.id);
end
$function$;

revoke all on function public.cfy_menu_order_action_core(uuid,text,uuid,text,uuid,text,jsonb) from public,anon,authenticated;

create or replace function public.cfy_os_order_action(p_token text,p_page text,p_order_id uuid,p_action text,p_data jsonb default '{}') returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;aid uuid:=nullif(actor->>'id','')::uuid;effective_role text;ord public.cfy_menu_orders%rowtype;begin
 if p_page not in ('takeaway','dinein','prep','kitchen','delivery') then raise exception 'invalid_page';end if;
 if not ((p_page='prep' and p_action in ('accept','ready','assign_driver','complete','issue','resolve_issue','reprint','cancel')) or (p_page='kitchen' and p_action in ('accept','ready','reprint')) or (p_page in ('takeaway','dinein') and p_action in ('accept','complete','reprint','cancel')) or (p_page='delivery' and p_action in ('picked_up','delivered','issue','delivery_exception'))) then raise exception 'forbidden_action' using errcode='42501';end if;
 select * into ord from cfy_menu_orders where id=p_order_id and client_id=cid and public.cfy_os_actor_branch_allowed(actor,branch_id) for update;if ord.id is null then raise exception 'order_not_found';end if;
 if actor->>'role'<>'owner' and p_page='delivery' and (ord.order_type<>'delivery' or ord.assigned_driver_id is distinct from aid) then raise exception 'not_assigned_driver' using errcode='42501';end if;
 -- Only an explicitly available delivery shift is active. Paused/offline sessions stay inactive.
 if actor->>'role'='delivery' and coalesce(actor->>'shift_state','offline')<>'available' then raise exception 'shift_inactive' using errcode='42501';end if;
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

create or replace function public.cfy_os_pos_order(p_token text,p_page text,p_order jsonb,p_intent text,p_request_key uuid) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;bid uuid;result jsonb;old public.cfy_os_requests%rowtype;hash text;aid uuid:=nullif(actor->>'id','')::uuid;atype text:=case when actor->>'role'='owner' then 'owner' else 'staff' end;payment_method text;begin
 if p_page not in ('takeaway','dinein') or p_intent not in ('save','kitchen','pay') or p_request_key is null then raise exception 'invalid_operation';end if;
 delete from cfy_os_requests where client_id=cid and created_at<now()-interval '30 days';
 if (p_page='dinein' and p_order->>'order_type'<>'dinein') or (p_page='takeaway' and p_order->>'order_type' not in ('takeaway','delivery')) then raise exception 'forbidden_order_type';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 if not public.cfy_os_actor_branch_allowed(actor,bid) then raise exception 'branch_forbidden' using errcode='42501';end if;
 hash:=encode(digest(jsonb_build_object('order',p_order,'intent',p_intent,'actor',actor->'id')::text,'sha256'),'hex');
 perform pg_advisory_xact_lock(hashtextextended(cid::text||p_request_key::text,0));
 select * into old from cfy_os_requests where client_id=cid and request_key=p_request_key;
 if old.request_key is not null then if old.request_hash<>hash then raise exception 'request_conflict';end if;return old.result||'{"duplicate":true}'::jsonb;end if;
 perform set_config('cardfy.order_branch_id',bid::text,true);
 result:=public.cfy_menu_create_internal_order_v2(cid,atype,aid,coalesce(p_order->>'source','pos'),p_order);
 perform set_config('cardfy.order_branch_id','',true);
 result:=public.cfy_menu_finalize_created_order_v3((result->>'id')::uuid,p_order,result);
 update cfy_menu_orders set branch_id=bid where id=(result->>'id')::uuid;
 if p_intent in ('kitchen','pay') then perform public.cfy_menu_order_action_core(cid,atype,aid,'cashier',(result->>'id')::uuid,'accept','{}');end if;
 if p_intent='pay' then
  select o.payment_method into payment_method from cfy_menu_orders o where o.id=(result->>'id')::uuid and o.client_id=cid;
  if payment_method='pay_on_delivery' then raise exception 'payment_collection_deferred' using errcode='P0001';end if;
  update cfy_menu_orders set payment_status='paid',paid_at=now(),updated_at=now() where id=(result->>'id')::uuid;
  insert into cfy_menu_order_events(client_id,order_id,event_type,actor_type,actor_id) values(cid,(result->>'id')::uuid,'pos_payment_recorded',atype,aid);
 end if;
 result:=result||jsonb_build_object('branch_id',bid,'order',public.cfy_menu_order_payload((result->>'id')::uuid));
 insert into cfy_os_requests(client_id,request_key,request_hash,result) values(cid,p_request_key,hash,result);return result;
end $$;

revoke all on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) from public;
grant execute on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) to anon,authenticated;

create or replace function public.cfy_os_table_action(p_token text,p_table uuid,p_action text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'dinein');cid uuid:=(actor->>'client_id')::uuid;sid uuid;begin
 perform 1 from cfy_menu_tables where id=p_table and client_id=cid and public.cfy_os_actor_branch_allowed(actor,branch_id) for update;if not found then raise exception 'table_not_found';end if;
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

create or replace function public.cfy_os_pos_quote(p_token text,p_page text,p_order jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,p_page);cid uuid:=(actor->>'client_id')::uuid;code text;bid uuid;result jsonb;begin
 if p_page not in ('takeaway','dinein') then raise exception 'invalid_operation';end if;
 if (p_page='dinein' and p_order->>'order_type'<>'dinein') or (p_page='takeaway' and p_order->>'order_type' not in ('takeaway','delivery')) then raise exception 'forbidden_order_type';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 if not public.cfy_os_actor_branch_allowed(actor,bid) then raise exception 'branch_forbidden' using errcode='42501';end if;
 select c.code into code from cfy_clients c where c.id=cid;
 result:=public.cfy_menu_quote_order_v3(code,p_order);
 return result||jsonb_build_object('branch_id',bid);
end $$;

revoke all on function public.cfy_os_pos_quote(text,text,jsonb) from public;
grant execute on function public.cfy_os_pos_quote(text,text,jsonb) to anon,authenticated;

create or replace function public.cfy_os_analytics(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'analytics');cid uuid:=(actor->>'client_id')::uuid;result jsonb;begin
 if p_from is null or p_to is null or p_from>p_to or p_to-p_from>3660 then raise exception 'invalid_date_range';end if;
 if p_branch is not null and not exists(select 1 from cfy_os_branches where id=p_branch and client_id=cid) then raise exception 'invalid_branch';end if;
 if p_branch is not null and not public.cfy_os_actor_branch_allowed(actor,p_branch) then raise exception 'branch_forbidden' using errcode='42501';end if;
 with orders as (select * from cfy_menu_orders where client_id=cid and (created_at at time zone 'Africa/Cairo')::date between p_from and p_to and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)),
 revenue as (select * from orders where status<>'cancelled' and payment_status='paid'),
 days as (select (created_at at time zone 'Africa/Cairo')::date d,count(*) n,sum(case when status<>'cancelled' and payment_status='paid' then total else 0 end) amount from orders group by 1),
 categories as (select coalesce(c.name_ar,c.name_en,'غير مصنف') label,sum(i.quantity) quantity,sum(i.line_total) amount from revenue o join cfy_menu_order_items i on i.order_id=o.id left join cfy_menu_products p on p.id=i.product_id and p.client_id=cid left join cfy_menu_categories c on c.id=p.category_id and c.client_id=cid group by 1),
 drivers as (select s.id,s.name,count(o.id) handled,count(o.id) filter(where o.issue_open) issues,count(o.id) filter(where o.status in ('delivered','completed')) delivered,avg(extract(epoch from (o.delivered_at-o.picked_up_at))/60) filter(where o.delivered_at>=o.picked_up_at) duration from cfy_menu_staff s left join orders o on o.assigned_driver_id=s.id where s.client_id=cid and s.role='delivery' and exists(select 1 from cfy_os_staff_branches sb where sb.client_id=cid and sb.staff_id=s.id and (p_branch is null or sb.branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,sb.branch_id)) group by s.id,s.name)
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
 'branches',coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name)) from cfy_os_branches b where client_id=cid and public.cfy_os_actor_branch_allowed(actor,b.id)),'[]')) into result;
 -- Additive read metrics. Same client, permission, dates and branch as the established RPC.
 with orders as (
   select * from cfy_menu_orders where client_id=cid
   and (created_at at time zone 'Africa/Cairo')::date between p_from and p_to
   and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)
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
     (select count(*) from cfy_menu_staff s where s.client_id=cid and s.role='delivery' and s.enabled and s.shift_state='available' and exists(select 1 from cfy_os_staff_branches sb where sb.client_id=cid and sb.staff_id=s.id and (p_branch is null or sb.branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,sb.branch_id)))),
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
 and (p_branch is null or branch_id=p_branch) and public.cfy_os_actor_branch_allowed(actor,branch_id)
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

revoke all on function public.cfy_os_analytics(text,date,date,uuid) from public;
grant execute on function public.cfy_os_analytics(text,date,date,uuid) to anon,authenticated;

commit;

