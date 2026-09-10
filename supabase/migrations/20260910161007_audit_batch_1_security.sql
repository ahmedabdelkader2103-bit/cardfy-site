-- Batch 1 only. Apply to the audited existing schema after deployment approval.
-- No customer-data backfill. Keep public Legacy SELECT policies unchanged.
begin;

CREATE OR REPLACE FUNCTION public.cfy_menu_finalize_created_order_v3(p_order_id uuid, p_order jsonb, p_result jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_order public.cfy_menu_orders%rowtype; v_method text; v_coupon public.cfy_menu_coupons%rowtype; v_result jsonb:=p_result; begin
  select * into v_order from public.cfy_menu_orders where id=p_order_id for update;
  if v_order.id is null then return v_result; end if;
  -- Duplicate/internal retries must not change a submitted or paid order.
  if not coalesce((p_result->>'duplicate')::boolean,false)
     and v_order.status='new' and v_order.payment_status='unpaid' then
  v_method:=public.cfy_menu_resolve_payment_method(v_order.client_id,v_order.order_type,p_order->>'payment_method');
  update public.cfy_menu_orders set payment_method=v_method where id=v_order.id;
  if v_order.coupon_code is not null then
    select * into v_coupon from public.cfy_menu_coupons where client_id=v_order.client_id and upper(code)=upper(v_order.coupon_code) limit 1;
    if v_coupon.id is not null and v_coupon.discount_type='free_delivery' and v_order.order_type='delivery' then
      update public.cfy_menu_orders set coupon_discount=delivery_fee,total=greatest(0,products_subtotal-product_discount),updated_at=now() where id=v_order.id;
    end if;
  end if;
  end if;
  select * into v_order from public.cfy_menu_orders where id=p_order_id;
  v_result:=v_result||jsonb_build_object('payment_method',v_order.payment_method,'payment_status',v_order.payment_status,'coupon_discount',v_order.coupon_discount,'delivery_fee',v_order.delivery_fee,'total',v_order.total);
  return v_result;
end $function$;

REVOKE EXECUTE ON FUNCTION public.cfy_menu_finalize_created_order_v3(uuid,jsonb,jsonb) FROM PUBLIC, anon, authenticated;

-- TRUNCATE bypasses RLS and is not used by the Legacy dashboard.
REVOKE TRUNCATE ON TABLE public.clients, public.app_settings FROM PUBLIC, anon, authenticated;

ALTER POLICY "authenticated can insert settings" ON public.app_settings TO authenticated
  WITH CHECK ((select public.cfy_is_admin()));

ALTER POLICY "authenticated can update settings" ON public.app_settings TO authenticated
  USING ((select public.cfy_is_admin()))
  WITH CHECK ((select public.cfy_is_admin()));

ALTER POLICY "authenticated can delete clients" ON public.clients TO authenticated
  USING ((select public.cfy_is_admin()));

ALTER POLICY "authenticated can insert clients" ON public.clients TO authenticated
  WITH CHECK ((select public.cfy_is_admin()));

ALTER POLICY "authenticated can update clients" ON public.clients TO authenticated
  USING ((select public.cfy_is_admin()))
  WITH CHECK ((select public.cfy_is_admin()));

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
      update public.cfy_menu_orders set status='delivered',delivered_at=coalesce(delivered_at,now()),payment_status=case when payment_method='cash' then 'paid' else payment_status end,paid_at=case when payment_method='cash' then coalesce(paid_at,now()) else paid_at end,updated_at=now() where id=v_order.id;
      update public.cfy_menu_delivery_assignments set status='delivered',delivered_at=coalesce(delivered_at,now()) where order_id=v_order.id and driver_id=v_order.assigned_driver_id and status in ('assigned','picked_up');
      insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id) values(v_order.id,p_client_id,'delivered',p_actor_type,p_actor_id);
    when 'complete' then
      if not ((v_order.order_type='delivery' and v_order.status='delivered') or (v_order.order_type in ('takeaway','dinein') and v_order.status='ready')) then raise exception 'invalid_transition' using errcode='P0001'; end if;
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

-- CREATE OR REPLACE preserves the existing internal-only action-core ACL.
commit;
