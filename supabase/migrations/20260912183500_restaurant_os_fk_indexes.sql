-- Cover composite foreign keys introduced by Restaurant OS.
create index cfy_os_zones_branch on public.cfy_menu_delivery_zones(client_id,branch_id);
create index cfy_os_tables_branch on public.cfy_menu_tables(client_id,branch_id);
create index cfy_os_customer_orders_order on public.cfy_os_customer_orders(order_id);
create index cfy_os_finance_branch on public.cfy_os_finance_entries(client_id,branch_id);
