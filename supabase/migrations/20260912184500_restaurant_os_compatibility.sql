-- Keep every order branch-associated, including calls from cached Legacy/public clients.
create function public.cfy_os_order_branch_default() returns trigger language plpgsql set search_path=public as $$
declare linked uuid;begin
 if new.table_id is not null then select branch_id into linked from cfy_menu_tables where id=new.table_id and client_id=new.client_id;end if;
 if linked is null and new.delivery_zone_id is not null then select branch_id into linked from cfy_menu_delivery_zones where id=new.delivery_zone_id and client_id=new.client_id;end if;
 new.branch_id:=coalesce(new.branch_id,linked);
 if new.branch_id is null and (select count(*) from cfy_os_branches where client_id=new.client_id and enabled)=1 then select id into new.branch_id from cfy_os_branches where client_id=new.client_id and enabled;end if;
 if new.branch_id is not null and not exists(select 1 from cfy_os_branches where id=new.branch_id and client_id=new.client_id and enabled) then raise exception 'invalid_branch';end if;
 if linked is not null and new.branch_id is distinct from linked then raise exception 'branch_resource_mismatch';end if;
 return new;
end $$;
revoke all on function public.cfy_os_order_branch_default() from public,anon,authenticated;
create trigger cfy_os_order_branch_default before insert or update of branch_id,table_id,delivery_zone_id on public.cfy_menu_orders for each row execute function public.cfy_os_order_branch_default();

create function public.cfy_os_public_quote(p_code text,p_order jsonb) returns jsonb language plpgsql security definer set search_path=public,extensions as $$
declare cid uuid;bid uuid;result jsonb;begin
 select id into cid from cfy_clients where upper(code)=upper(trim(p_code)) and active and (sub_end is null or sub_end>=current_date);
 if cid is null then raise exception 'menu_unavailable';end if;
 bid:=public.cfy_os_validate_branch(cid,p_order);
 result:=public.cfy_menu_quote_order_v3(p_code,p_order);
 return result||jsonb_build_object('branch_id',bid);
end $$;
revoke all on function public.cfy_os_public_quote(text,jsonb) from public;
grant execute on function public.cfy_os_public_quote(text,jsonb) to anon,authenticated;
