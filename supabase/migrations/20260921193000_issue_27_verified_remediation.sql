begin;

-- Issue #27 verified remediation. Historical migrations remain immutable.
create index if not exists cfy_os_requests_client_created_idx
  on public.cfy_os_requests(client_id,created_at);

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
        select s.id into v_driver_id from public.cfy_menu_staff s where s.client_id=p_client_id and s.role='delivery' and s.enabled and s.shift_state='available'
          order by (select count(*) from public.cfy_menu_delivery_assignments a where a.driver_id=s.id and a.status in ('assigned','picked_up')) asc,s.last_assigned_at nulls first,s.created_at limit 1;
      end if;
      select * into v_driver from public.cfy_menu_staff where id=v_driver_id and client_id=p_client_id and role='delivery' and enabled and shift_state='available';
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
      if v_order.order_type='delivery' and v_order.payment_status<>'paid' then raise exception 'payment_required' using errcode='P0001'; end if;
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
 select * into ord from cfy_menu_orders where id=p_order_id and client_id=cid for update;if ord.id is null then raise exception 'order_not_found';end if;
 if actor->>'role'<>'owner' and p_page='delivery' and (ord.order_type<>'delivery' or ord.assigned_driver_id is distinct from aid) then raise exception 'not_assigned_driver' using errcode='42501';end if;
 if actor->>'role'='delivery' and coalesce(actor->>'shift_state','offline')='offline' then raise exception 'shift_inactive' using errcode='42501';end if;
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
 hash:=encode(digest(jsonb_build_object('order',p_order,'intent',p_intent,'actor',actor->'id')::text,'sha256'),'hex');
 perform pg_advisory_xact_lock(hashtextextended(cid::text||p_request_key::text,0));
 select * into old from cfy_os_requests where client_id=cid and request_key=p_request_key;
 if old.request_key is not null then if old.request_hash<>hash then raise exception 'request_conflict';end if;return old.result||'{"duplicate":true}'::jsonb;end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
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

create or replace function public.cfy_os_finance_snapshot(p_token text,p_from date,p_to date,p_branch uuid default null) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare actor jsonb:=public.cfy_os_require(p_token,'accounts');cid uuid:=(actor->>'client_id')::uuid;begin
 if p_from is null or p_to is null or p_from>p_to or p_to-p_from>3660 then raise exception 'invalid_date_range';end if;
 if p_branch is not null and not exists(select 1 from cfy_os_branches where id=p_branch and client_id=cid) then raise exception 'invalid_branch';end if;
 return jsonb_build_object(
 'branches',coalesce((select jsonb_agg(to_jsonb(b) order by name) from cfy_os_branches b where client_id=cid),'[]'),
 'entries',coalesce((select jsonb_agg(to_jsonb(e) order by occurred_on desc,created_at desc) from cfy_os_finance_entries e where client_id=cid and not archived and occurred_on between p_from and p_to and (p_branch is null or branch_id=p_branch)),'[]'),
 'order_revenue',coalesce((select jsonb_agg(jsonb_build_object('id',id,'reference',reference,'amount',total,'payment_method',payment_method,'source',order_source,'order_type',order_type,'branch_id',branch_id,'occurred_on',(paid_at at time zone 'Africa/Cairo')::date) order by paid_at desc) from cfy_menu_orders where client_id=cid and payment_status='paid' and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date between p_from and p_to and (p_branch is null or branch_id=p_branch)),'[]'),
 'cash_balance',coalesce((select sum(case when kind in ('cash_in','revenue') then amount when kind in ('cash_out','expense','payroll') then -amount else 0 end) from cfy_os_finance_entries where client_id=cid and not archived and payment_method='cash' and occurred_on<=p_to and (p_branch is null or branch_id=p_branch)),0)+coalesce((select sum(total) from cfy_menu_orders where client_id=cid and payment_status='paid' and payment_method in ('cash','pay_on_delivery') and status<>'cancelled' and (paid_at at time zone 'Africa/Cairo')::date<=p_to and (p_branch is null or branch_id=p_branch)),0),
 'inventory',coalesce((select jsonb_agg(to_jsonb(i) order by name) from cfy_os_inventory i where client_id=cid and not archived and (p_branch is null or branch_id=p_branch)),'[]'),
 'movements',coalesce((select jsonb_agg(to_jsonb(m) order by occurred_at desc) from cfy_os_stock_movements m where client_id=cid and (occurred_at at time zone 'Africa/Cairo')::date between p_from and p_to and exists(select 1 from cfy_os_inventory i where i.id=m.item_id and i.client_id=cid and not i.archived and (p_branch is null or i.branch_id=p_branch))),'[]'),
 'recipes',coalesce((select jsonb_agg(to_jsonb(r)||jsonb_build_object('cost',case when not archived then public.cfy_os_recipe_cost(cid,ingredients) else null end) order by name) from cfy_os_recipes r where client_id=cid and not archived and (p_branch is null or branch_id=p_branch)),'[]'),
 'employees',coalesce((select jsonb_agg(to_jsonb(e) order by name) from cfy_os_employees e where client_id=cid and not archived and (p_branch is null or branch_id=p_branch)),'[]'));
end $$;
revoke all on function public.cfy_os_finance_snapshot(text,date,date,uuid) from public;
grant execute on function public.cfy_os_finance_snapshot(text,date,date,uuid) to anon,authenticated;

create or replace function public.cfy_os_customer_recover(p_code text,p_phone text,p_reference text,p_device_token text) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;v_phone text;pid uuid;source_pid uuid;source_order uuid;begin
 if length(coalesce(p_device_token,''))<32 then raise exception 'invalid_device_token';end if;
 v_phone:=public.cfy_os_phone(p_phone);
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 select cp.id,o.id into source_pid,source_order from cfy_os_customer_profiles cp join cfy_os_customer_orders co on co.profile_id=cp.id join cfy_menu_orders o on o.id=co.order_id where cp.client_id=cid and cp.phone_normalized=v_phone and o.reference=upper(trim(p_reference)) limit 1;
 if source_pid is null then raise exception 'recovery_proof_invalid';end if;
 insert into cfy_os_customer_profiles(client_id,device_token_hash,phone_normalized,profile)
 select cid,encode(digest(p_device_token,'sha256'),'hex'),v_phone,profile from cfy_os_customer_profiles where id=source_pid
 on conflict(client_id,device_token_hash) do update set phone_normalized=excluded.phone_normalized,profile=excluded.profile,updated_at=now() returning id into pid;
 insert into cfy_os_customer_orders(profile_id,order_id,tracking_token,delivery_otp)
 select pid,co.order_id,co.tracking_token,co.delivery_otp from cfy_os_customer_orders co where co.profile_id=source_pid and co.order_id=source_order
 on conflict(profile_id,order_id) do nothing;
 return public.cfy_os_customer_payload(pid);
end $$;
revoke all on function public.cfy_os_customer_recover(text,text,text,text) from public;
grant execute on function public.cfy_os_customer_recover(text,text,text,text) to anon,authenticated;

create or replace function public.cfy_os_public_order(p_code text,p_device_token text,p_order jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;pid uuid;bid uuid;result jsonb;phone text;begin
 if length(coalesce(p_device_token,''))<32 then raise exception 'invalid_device_token';end if;
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 if cid is null then raise exception 'menu_unavailable';end if;
 phone:=public.cfy_os_phone(p_order->>'phone');
 select id into pid from cfy_os_customer_profiles where client_id=cid and device_token_hash=encode(digest(p_device_token,'sha256'),'hex') and phone_normalized=phone;
 if pid is null then raise exception 'customer_profile_required';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 perform set_config('cardfy.order_branch_id',bid::text,true);
 result:=public.cfy_menu_create_order_v3(p_code,p_order);
 perform set_config('cardfy.order_branch_id','',true);
 if coalesce((result->>'duplicate')::boolean,false) then return result;end if;
 update cfy_menu_orders set branch_id=bid where id=(result->>'id')::uuid;
 insert into cfy_os_customer_orders(profile_id,order_id,tracking_token,delivery_otp) values(pid,(result->>'id')::uuid,result->>'tracking_token',result->>'delivery_otp') on conflict do nothing;
 return result||jsonb_build_object('branch_id',bid);
end $$;
revoke all on function public.cfy_os_public_order(text,text,jsonb) from public;
grant execute on function public.cfy_os_public_order(text,text,jsonb) to anon,authenticated;

create or replace function public.cfy_os_order_branch_default() returns trigger language plpgsql set search_path=public as $$
declare linked uuid;begin
 if new.table_id is not null then select branch_id into linked from cfy_menu_tables where id=new.table_id and client_id=new.client_id;end if;
 if linked is null and new.delivery_zone_id is not null then select branch_id into linked from cfy_menu_delivery_zones where id=new.delivery_zone_id and client_id=new.client_id;end if;
 new.branch_id:=coalesce(new.branch_id,linked,nullif(current_setting('cardfy.order_branch_id',true),'')::uuid);
 if new.branch_id is null and (select count(*) from cfy_os_branches where client_id=new.client_id and enabled)=1 then select id into new.branch_id from cfy_os_branches where client_id=new.client_id and enabled;end if;
 if new.branch_id is null and exists(select 1 from cfy_os_branches where client_id=new.client_id and enabled) then raise exception 'branch_required';end if;
 if new.branch_id is not null and not exists(select 1 from cfy_os_branches where id=new.branch_id and client_id=new.client_id and enabled) then raise exception 'invalid_branch';end if;
 if linked is not null and new.branch_id is distinct from linked then raise exception 'branch_resource_mismatch';end if;
 return new;
end $$;
revoke all on function public.cfy_os_order_branch_default() from public,anon,authenticated;

commit;
