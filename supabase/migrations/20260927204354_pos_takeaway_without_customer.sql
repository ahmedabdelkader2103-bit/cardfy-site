-- POS takeaway orders are counter sales and do not require customer identity.
-- Public takeaway and all delivery validation remains owned by the existing menu functions.
create or replace function public.cfy_os_pos_order(p_token text,p_page text,p_order jsonb,p_intent text,p_request_key uuid) returns jsonb
language plpgsql security definer set search_path=public,extensions as $$
declare
 actor jsonb:=public.cfy_os_require(p_token,p_page);
 cid uuid:=(actor->>'client_id')::uuid;
 bid uuid;
 result jsonb;
 old public.cfy_os_requests%rowtype;
 hash text;
 aid uuid:=nullif(actor->>'id','')::uuid;
 atype text:=case when actor->>'role'='owner' then 'owner' else 'staff' end;
 payment_method text;
 effective_order jsonb:=p_order;
 anonymous_takeaway boolean:=p_page='takeaway' and p_order->>'order_type'='takeaway' and coalesce(p_order->>'source','pos')='pos';
begin
 if p_page not in ('takeaway','dinein') or p_intent not in ('save','kitchen','pay') or p_request_key is null then raise exception 'invalid_operation';end if;
 delete from cfy_os_requests where client_id=cid and created_at<now()-interval '30 days';
 if (p_page='dinein' and p_order->>'order_type'<>'dinein') or (p_page='takeaway' and p_order->>'order_type' not in ('takeaway','delivery')) then raise exception 'forbidden_order_type';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 if not public.cfy_os_actor_branch_allowed(actor,bid) then raise exception 'branch_forbidden' using errcode='42501';end if;
 hash:=encode(digest(jsonb_build_object('order',p_order,'intent',p_intent,'actor',actor->'id')::text,'sha256'),'hex');
 perform pg_advisory_xact_lock(hashtextextended(cid::text||p_request_key::text,0));
 select * into old from cfy_os_requests where client_id=cid and request_key=p_request_key;
 if old.request_key is not null then if old.request_hash<>hash then raise exception 'request_conflict';end if;return old.result||'{"duplicate":true}'::jsonb;end if;

 -- The legacy internal creator shares validation with public takeaway. Satisfy that
 -- validation inside this transaction, then remove the adapter values before commit.
 if anonymous_takeaway then
  effective_order:=p_order||jsonb_build_object('customer_name','CARDfy POS','phone','01000000000');
 end if;

 perform set_config('cardfy.order_branch_id',bid::text,true);
 result:=public.cfy_menu_create_internal_order_v2(cid,atype,aid,coalesce(p_order->>'source','pos'),effective_order);
 perform set_config('cardfy.order_branch_id','',true);
 result:=public.cfy_menu_finalize_created_order_v3((result->>'id')::uuid,effective_order,result);
 update cfy_menu_orders set branch_id=bid,customer_name=case when anonymous_takeaway then '' else customer_name end,phone=case when anonymous_takeaway then '' else phone end where id=(result->>'id')::uuid;
 if anonymous_takeaway then result:=result-'customer_name'-'phone';end if;
 if p_intent in ('kitchen','pay') then perform public.cfy_menu_order_action_core(cid,atype,aid,'cashier',(result->>'id')::uuid,'accept','{}');end if;
 if p_intent='pay' then
  select o.payment_method into payment_method from cfy_menu_orders o where o.id=(result->>'id')::uuid and o.client_id=cid;
  if payment_method='pay_on_delivery' then raise exception 'payment_collection_deferred' using errcode='P0001';end if;
  update cfy_menu_orders set payment_status='paid',paid_at=now(),updated_at=now() where id=(result->>'id')::uuid;
  insert into cfy_menu_order_events(client_id,order_id,event_type,actor_type,actor_id) values(cid,(result->>'id')::uuid,'pos_payment_recorded',atype,aid);
 end if;
 result:=result||jsonb_build_object('branch_id',bid,'order',public.cfy_menu_order_payload((result->>'id')::uuid));
 insert into cfy_os_requests(client_id,request_key,request_hash,result) values(cid,p_request_key,hash,result);
 return result;
end $$;

revoke all on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) from public;
grant execute on function public.cfy_os_pos_order(text,text,jsonb,text,uuid) to anon,authenticated;
