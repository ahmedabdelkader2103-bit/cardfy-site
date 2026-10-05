-- Counter POS takeaway may be anonymous. This definition is the current
-- production function with only the takeaway validation narrowed to exempt
-- source=pos. CREATE OR REPLACE preserves the function owner and existing ACL.
create or replace function public.cfy_menu_create_internal_order_v2(
 p_client_id uuid,
 p_actor_type text,
 p_actor_id uuid,
 p_source text,
 p_order jsonb
) returns jsonb
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $function$
declare
 v_settings public.cfy_menu_settings%rowtype;
 v_price jsonb;
 v_order_id uuid;
 v_ref text;
 v_raw_track text;
 v_raw_otp text:='';
 v_item jsonb;
 v_table public.cfy_menu_tables%rowtype;
 v_session public.cfy_menu_table_sessions%rowtype;
 v_type text;
 v_scheduled timestamptz;
begin
 if p_source not in ('pos','phone') then raise exception 'invalid_order_source' using errcode='P0001'; end if;
 if not exists(select 1 from public.cfy_clients c where c.id=p_client_id and c.active and (c.sub_end is null or c.sub_end>=current_date))
    or not exists(select 1 from public.cfy_client_services cs where cs.client_id=p_client_id and cs.service='menu' and cs.enabled)
 then raise exception 'menu_unavailable' using errcode='P0001'; end if;
 select * into v_settings from public.cfy_menu_settings where client_id=p_client_id;
 if v_settings.client_id is null then raise exception 'menu_settings_missing' using errcode='P0001'; end if;
 v_type:=coalesce(p_order->>'order_type','');
 v_price:=public.cfy_menu_price_order_v2(p_client_id,p_order);
 if v_type='delivery' and (length(trim(coalesce(p_order->>'customer_name','')))<2
   or length(regexp_replace(coalesce(p_order->>'phone',''),'\D','','g'))<8
   or length(trim(coalesce(p_order->>'address','')))<5)
 then raise exception 'delivery_details_required'; end if;
 if v_type='takeaway' and p_source is distinct from 'pos' and length(trim(coalesce(p_order->>'customer_name','')))<2
 then raise exception 'takeaway_details_required'; end if;
 if v_type='dinein' then
   select * into v_table from public.cfy_menu_tables where id=nullif(p_order->>'table_id','')::uuid and client_id=p_client_id and enabled limit 1;
   if v_table.id is null then raise exception 'table_required' using errcode='P0001'; end if;
   select * into v_session from public.cfy_menu_table_sessions where table_id=v_table.id and status in ('open','bill_requested','payment_pending') order by opened_at desc limit 1 for update;
   if v_session.id is null then insert into public.cfy_menu_table_sessions(client_id,table_id,status) values(p_client_id,v_table.id,'open') returning * into v_session; end if;
   if v_session.status<>'open' then raise exception 'table_not_accepting_orders' using errcode='P0001'; end if;
 end if;
 v_scheduled:=nullif(p_order->>'scheduled_for','')::timestamptz;
 if v_scheduled is not null and (v_scheduled<now()+interval '5 minutes' or v_scheduled>now()+make_interval(days=>v_settings.max_advance_days))
 then raise exception 'invalid_scheduled_time'; end if;
 v_ref:='MN-'||to_char(now(),'YYMMDD')||'-'||upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
 v_raw_track:=encode(gen_random_bytes(24),'hex');
 if v_type='delivery' and v_settings.otp_enabled then v_raw_otp:=lpad((floor(random()*1000000))::int::text,6,'0'); end if;
 insert into public.cfy_menu_orders(reference,client_id,order_type,order_source,customer_name,phone,address,delivery_zone_id,table_number,table_id,table_session_id,pickup_time,scheduled_for,notes,coupon_code,products_subtotal,product_discount,coupon_discount,delivery_fee,total,status,tracking_token_hash,delivery_otp_hash,payment_method,payment_status)
 values(v_ref,p_client_id,v_type,p_source,left(coalesce(p_order->>'customer_name',''),160),left(coalesce(p_order->>'phone',''),40),left(coalesce(p_order->>'address',''),1000),nullif(v_price#>>'{delivery_zone,id}','')::uuid,coalesce(v_table.label,''),v_table.id,v_session.id,v_scheduled,v_scheduled,left(coalesce(p_order->>'notes',''),1000),nullif(upper(trim(coalesce(p_order->>'coupon_code',''))),''),(v_price->>'products_subtotal')::numeric,(v_price->>'product_discount')::numeric,(v_price->>'coupon_discount')::numeric,(v_price->>'delivery_fee')::numeric,(v_price->>'total')::numeric,'new',encode(digest(v_raw_track,'sha256'),'hex'),case when v_raw_otp='' then null else encode(digest(v_raw_otp,'sha256'),'hex') end,'cash','unpaid')
 returning id into v_order_id;
 for v_item in select * from jsonb_array_elements(v_price->'items') loop
   insert into public.cfy_menu_order_items(order_id,product_id,quantity,unit_price,options_total,discount_amount,line_total,snapshot)
   values(v_order_id,(v_item->>'product_id')::uuid,(v_item->>'quantity')::int,(v_item->>'unit_price')::numeric,(v_item->>'options_total')::numeric,(v_item->>'discount_amount')::numeric,(v_item->>'line_total')::numeric,v_item->'snapshot');
 end loop;
 if coalesce(trim(p_order->>'coupon_code'),'')<>'' then
   update public.cfy_menu_coupons set used_count=used_count+1,updated_at=now()
   where client_id=p_client_id and upper(code)=upper(trim(p_order->>'coupon_code'));
 end if;
 insert into public.cfy_menu_order_events(order_id,client_id,event_type,actor_type,actor_id,data)
 values(v_order_id,p_client_id,'new',p_actor_type,p_actor_id,jsonb_build_object('source',p_source,'order_type',v_type));
 return jsonb_build_object('id',v_order_id,'reference',v_ref,'status','new','tracking_token',v_raw_track,'delivery_otp',nullif(v_raw_otp,''),'total',v_price->'total','order_type',v_type,'source',p_source,'table',case when v_table.id is null then null else jsonb_build_object('id',v_table.id,'label',v_table.label,'session_id',v_session.id) end);
end
$function$;
